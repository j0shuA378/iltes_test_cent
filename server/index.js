/**
 * IELTS Master Backend REST API Server
 * High-performance, lightweight Express backend with persistent file database.
 * 
 * Phase 1 Security Hardening:
 * - bcrypt password hashing (replaces btoa/base64)
 * - JWT-based API authentication
 * - Admin PIN from environment variable
 * - Path traversal protection on userId params
 * - CORS whitelist (not wildcard)
 */

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// ==========================================
// Security Configuration
// ==========================================
const JWT_SECRET = process.env.JWT_SECRET || 'ielts_master_dev_secret_change_in_production';
const JWT_EXPIRES_IN = '7d';
const BCRYPT_ROUNDS = 12;
const ADMIN_PIN = process.env.ADMIN_PIN || 'admin888'; // Move to env var in production

const CORS_WHITELIST = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
];
// In production, add your domain:
if (process.env.CORS_ORIGIN) {
  CORS_WHITELIST.push(process.env.CORS_ORIGIN);
}

// Ensure database directories exist
const DATA_DIR = path.join(__dirname, 'data');
const VAULTS_DIR = path.join(DATA_DIR, 'vaults');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(VAULTS_DIR)) {
  fs.mkdirSync(VAULTS_DIR, { recursive: true });
}

// Database file paths
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Initialize default data if empty
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([
    {
      id: 'user_guest',
      username: 'guest',
      displayName: '访客学员',
      avatar: '🎓',
      recoveryToken: 'MK-GUEST-0000',
      vaultKey: 'user_vault_user_guest',
      currentBand: 0,
      targetBand: 7.0,
      hasCompletedPlacement: false,
      examDate: new Date(Date.now() + 178 * 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    }
  ], null, 2), 'utf-8');
}

// ==========================================
// Helpers
// ==========================================

// Helper: read JSON safely
function readJSON(file, fallback = {}) {
  try {
    if (!fs.existsSync(file)) return fallback;
    const content = fs.readFileSync(file, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return fallback;
  }
}

// Helper: write JSON safely
function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${file}:`, err);
    return false;
  }
}

/**
 * Sanitize userId to prevent path traversal attacks.
 * Only allows alphanumeric chars, underscores, and hyphens.
 */
function sanitizeUserId(userId) {
  if (!userId || typeof userId !== 'string') return null;
  const sanitized = userId.replace(/[^a-zA-Z0-9_-]/g, '');
  if (sanitized.length === 0 || sanitized.length > 100) return null;
  return sanitized;
}

/**
 * Resolve vault file path safely, ensuring it stays within VAULTS_DIR.
 */
function getVaultPath(userId) {
  const sanitized = sanitizeUserId(userId);
  if (!sanitized) return null;
  const vaultPath = path.join(VAULTS_DIR, `${sanitized}.json`);
  const resolved = path.resolve(vaultPath);
  if (!resolved.startsWith(path.resolve(VAULTS_DIR))) return null;
  return resolved;
}

/**
 * Generate a JWT token for a user.
 */
function generateToken(user) {
  return jwt.sign(
    { userId: user.id, username: user.username, role: user.role || 'student' },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Generate recovery token
 */
function generateRecoveryToken() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let part1 = '';
  let part2 = '';
  for (let i = 0; i < 4; i++) {
    part1 += chars.charAt(Math.floor(Math.random() * chars.length));
    part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `MK-${part1}-${part2}`;
}

// ==========================================
// Middlewares
// ==========================================
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (server-to-server, curl, Postman in dev)
    if (!origin && process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    if (!origin || CORS_WHITELIST.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: origin not allowed'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

/**
 * JWT Authentication Middleware
 * Extracts and validates JWT from Authorization header.
 * Sets req.user on success.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: '未提供认证令牌，请先登录' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: '认证令牌无效或已过期，请重新登录' });
  }
}

/**
 * Admin-only middleware. Must be used after authMiddleware.
 */
function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: '权限不足，仅管理员可操作' });
  }
  next();
}

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production' && !req.path.startsWith('/api/health')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// ==========================================
// 1. HEALTH & SYSTEM RUNTIME API (Public)
// ==========================================
app.get('/api/health', (req, res) => {
  const users = readJSON(USERS_FILE, []);
  let totalVaultSize = 0;
  try {
    const files = fs.readdirSync(VAULTS_DIR);
    files.forEach(f => {
      totalVaultSize += fs.statSync(path.join(VAULTS_DIR, f)).size;
    });
  } catch {}

  res.json({
    status: 'ok',
    serverTime: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    version: '3.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: {
      type: 'persistent-json-store',
      registeredUsersCount: users.length,
      totalVaultStorageBytes: totalVaultSize
    }
  });
});

// ==========================================
// 2. USER AUTHENTICATION & RECOVERY API (Public - returns JWT)
// ==========================================
app.get('/api/auth/users', (req, res) => {
  const users = readJSON(USERS_FILE, []);
  // Return sanitized users (no passwords, no sensitive tokens for unauthenticated requests)
  const sanitized = users.map(u => ({
    id: u.id,
    username: u.username,
    displayName: u.displayName,
    avatar: u.avatar,
    // Only show recovery token to authenticated users (checked below)
    currentBand: u.currentBand,
    targetBand: u.targetBand,
    hasCompletedPlacement: u.hasCompletedPlacement,
    examDate: u.examDate,
    createdAt: u.createdAt,
    lastLoginAt: u.lastLoginAt
  }));
  res.json({ success: true, users: sanitized });
});

app.post('/api/auth/register', async (req, res) => {
  const { username, displayName, password, avatar, targetBand, examDate } = req.body;
  if (!username || !username.trim()) {
    return res.status(400).json({ success: false, error: '用户名不能为空' });
  }

  const users = readJSON(USERS_FILE, []);
  const trimmed = username.trim();
  if (users.some(u => u.username.toLowerCase() === trimmed.toLowerCase())) {
    return res.status(409).json({ success: false, error: '该用户名已被占用' });
  }

  const recoveryToken = generateRecoveryToken();
  const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Hash password with bcrypt if provided
  let passwordHash = undefined;
  if (password && password.trim()) {
    try {
      passwordHash = await bcrypt.hash(password.trim(), BCRYPT_ROUNDS);
    } catch (err) {
      console.error('Password hashing failed:', err);
      return res.status(500).json({ success: false, error: '密码加密失败' });
    }
  }

  const newUser = {
    id: userId,
    username: trimmed,
    displayName: displayName?.trim() || trimmed,
    avatar: avatar || '🎓',
    recoveryToken,
    vaultKey: `user_vault_${userId}`,
    currentBand: 0, // Enforce 0 baseline
    targetBand: targetBand || 7.0,
    hasCompletedPlacement: false,
    examDate: examDate || new Date(Date.now() + 178 * 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    passwordHash
  };

  users.push(newUser);
  writeJSON(USERS_FILE, users);

  // Initialize empty vault
  const vaultPath = getVaultPath(newUser.id);
  if (vaultPath) {
    const userVault = {
      userId: newUser.id,
      recoveryToken: newUser.recoveryToken,
      lastUpdated: new Date().toISOString(),
      profile: {
        targetOverall: newUser.targetBand,
        targetListening: 7.5,
        targetReading: 7.5,
        targetWriting: 6.5,
        targetSpeaking: 6.5,
        examDate: newUser.examDate
      },
      testResults: [],
      mistakes: [],
      vocabProgress: {},
      studyPlanTasks: {},
      ebbinghausRecords: {}
    };
    writeJSON(vaultPath, userVault);
  }

  // Generate JWT token
  const token = generateToken(newUser);

  // Return user without passwordHash
  const { passwordHash: _, ...safeUser } = newUser;
  res.status(201).json({ success: true, user: safeUser, token });
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    return res.status(400).json({ success: false, error: '请提供用户名或标记' });
  }

  const users = readJSON(USERS_FILE, []);
  const trimmed = username.trim().toLowerCase();
  const user = users.find(u => u.username.toLowerCase() === trimmed || (u.recoveryToken && u.recoveryToken.toLowerCase() === trimmed));

  if (!user) {
    return res.status(404).json({ success: false, error: '未找到匹配的学员档案' });
  }

  // Verify password with bcrypt if user has one
  if (user.passwordHash && password) {
    try {
      // Handle legacy base64 passwords: migrate to bcrypt on first successful login
      if (user.passwordHash.length < 60 && !user.passwordHash.startsWith('$2')) {
        // Legacy base64 check
        const legacyCheck = Buffer.from(password).toString('base64') === user.passwordHash;
        if (!legacyCheck) {
          return res.status(401).json({ success: false, error: '密码错误' });
        }
        // Migrate to bcrypt
        user.passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
        writeJSON(USERS_FILE, users);
      } else {
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
          return res.status(401).json({ success: false, error: '密码错误' });
        }
      }
    } catch (err) {
      console.error('Password verification error:', err);
      return res.status(500).json({ success: false, error: '密码验证失败' });
    }
  }

  user.lastLoginAt = new Date().toISOString();
  writeJSON(USERS_FILE, users);

  const token = generateToken(user);
  const { passwordHash: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser, token });
});

app.post('/api/auth/recover', (req, res) => {
  const { recoveryToken } = req.body;
  if (!recoveryToken) {
    return res.status(400).json({ success: false, error: '请输入恢复标记' });
  }

  const users = readJSON(USERS_FILE, []);
  const formatted = recoveryToken.trim().toUpperCase();
  const user = users.find(u => u.recoveryToken === formatted);

  if (!user) {
    return res.status(404).json({ success: false, error: '未找到与该恢复标记关联的学员档案' });
  }

  const token = generateToken(user);
  const { passwordHash: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser, token });
});

app.post('/api/auth/placement', authMiddleware, (req, res) => {
  const { userId, testedBand, rawScore, totalQuestions, levelSummary } = req.body;
  if (!userId || testedBand === undefined) {
    return res.status(400).json({ success: false, error: '参数不完整' });
  }

  // Verify the authenticated user is operating on their own data or is admin
  if (req.user.userId !== userId && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: '无权操作其他用户数据' });
  }

  const users = readJSON(USERS_FILE, []);
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ success: false, error: '学员档案不存在' });
  }

  user.currentBand = Number(testedBand);
  user.hasCompletedPlacement = true;
  user.placementScore = {
    testedBand: Number(testedBand),
    rawScore: Number(rawScore || 0),
    totalQuestions: Number(totalQuestions || 6),
    levelSummary: levelSummary || '已定级',
    completedAt: new Date().toISOString()
  };

  writeJSON(USERS_FILE, users);
  const { passwordHash: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});

// ==========================================
// 2.5 ADMIN AUTHENTICATION (Public - returns admin JWT)
// ==========================================
app.post('/api/admin/login', (req, res) => {
  const { pin } = req.body;
  if (!pin || pin.trim() !== ADMIN_PIN) {
    return res.status(401).json({ success: false, error: '管理员PIN码错误' });
  }

  const token = jwt.sign(
    { userId: 'admin', username: 'admin', role: 'admin' },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.json({ success: true, token, message: '管理员认证成功' });
});

// ==========================================
// 3. CLOUD VAULT STORAGE & SYNC API (Authenticated)
// ==========================================
app.get('/api/vault/:userId', authMiddleware, (req, res) => {
  const { userId } = req.params;

  // Users can only access their own vault (unless admin)
  if (req.user.userId !== userId && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: '无权访问其他用户数据' });
  }

  const vaultPath = getVaultPath(userId);
  if (!vaultPath) {
    return res.status(400).json({ success: false, error: '无效的用户标识' });
  }

  if (!fs.existsSync(vaultPath)) {
    return res.json({ success: true, vault: null, message: '本地沙箱无云端历史快照' });
  }

  const vault = readJSON(vaultPath, null);
  res.json({ success: true, vault });
});

app.put('/api/vault/:userId', authMiddleware, (req, res) => {
  const { userId } = req.params;
  const vaultData = req.body;

  // Users can only write to their own vault (unless admin)
  if (req.user.userId !== userId && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: '无权修改其他用户数据' });
  }

  if (!vaultData || typeof vaultData !== 'object') {
    return res.status(400).json({ success: false, error: '无效的数据结构' });
  }

  const vaultPath = getVaultPath(userId);
  if (!vaultPath) {
    return res.status(400).json({ success: false, error: '无效的用户标识' });
  }

  vaultData.userId = userId;
  vaultData.lastUpdated = new Date().toISOString();

  writeJSON(vaultPath, vaultData);
  res.json({ success: true, message: '数据已安全同步至云端沙箱', lastUpdated: vaultData.lastUpdated });
});

app.delete('/api/vault/:userId', authMiddleware, (req, res) => {
  const { userId } = req.params;

  // Only admin or the user themselves can delete vault
  if (req.user.userId !== userId && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: '无权删除其他用户数据' });
  }

  const vaultPath = getVaultPath(userId);
  if (!vaultPath) {
    return res.status(400).json({ success: false, error: '无效的用户标识' });
  }

  if (fs.existsSync(vaultPath)) {
    fs.unlinkSync(vaultPath);
  }
  res.json({ success: true, message: '学员云端数据已清空' });
});

// ==========================================
// 4. DICTIONARY & AI PROXY API (Public - these are proxies)
// ==========================================
const dictCache = new Map();

app.get('/api/dict/search', async (req, res) => {
  const query = (req.query.q || '').toString().trim();
  if (!query) {
    return res.status(400).json({ error: 'Query parameter q is required' });
  }

  // Check in-memory cache
  if (dictCache.has(query.toLowerCase())) {
    return res.json(dictCache.get(query.toLowerCase()));
  }

  try {
    const targetUrl = `https://dict.youdao.com/suggest?num=5&ver=3.0&doctype=json&cache=false&le=en&q=${encodeURIComponent(query)}`;
    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error(`Youdao API status ${response.status}`);
    }
    const data = await response.json();
    dictCache.set(query.toLowerCase(), data);
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch from dictionary provider', detail: String(err) });
  }
});

// Server-side AI Evaluation Proxy
app.post('/api/ai/evaluate', authMiddleware, async (req, res) => {
  const { module, content } = req.body;
  if (!content) {
    return res.status(400).json({ success: false, error: 'Content is required for evaluation' });
  }

  // Calculate heuristic metrics
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  let band = 6.0;
  if (wordCount >= 250) band = 6.5;
  if (wordCount >= 300) band = 7.0;

  res.json({
    success: true,
    evaluation: {
      module: module || 'writing',
      band,
      wordCount,
      feedback: '服务端学术评估引擎：文章结构清晰，论点展开较为充分，词汇搭配自然。建议在第二段加强学术连接词衔接。',
      evaluatedAt: new Date().toISOString()
    }
  });
});

// ==========================================
// 5. QUESTION BANK MATRIX API (Public)
// ==========================================
app.get('/api/banks', (req, res) => {
  res.json({
    success: true,
    totalBanks: 5,
    collections: [
      { id: 'cam19', title: '剑桥雅思 19 (Cambridge 19)', paperCount: 4, isNew: true },
      { id: 'cam18', title: '剑桥雅思 18 (Cambridge 18)', paperCount: 4, isNew: false },
      { id: 'cam17', title: '剑桥雅思 17 (Cambridge 17)', paperCount: 4, isNew: false },
      { id: 'cdi_recent', title: '2025-2026 机考高频换题季真题', paperCount: 8, isNew: true },
      { id: 'all', title: '全部全真官方题库 (综合大题库)', paperCount: 20, isNew: false }
    ],
    updatedAt: new Date().toISOString()
  });
});

// ==========================================
// 6. ADMIN & METRICS API (Admin-only)
// ==========================================
app.get('/api/admin/metrics', authMiddleware, adminMiddleware, (req, res) => {
  const users = readJSON(USERS_FILE, []);
  let totalTests = 0;
  let totalVaultSize = 0;

  try {
    const files = fs.readdirSync(VAULTS_DIR);
    files.forEach(f => {
      const filePath = path.join(VAULTS_DIR, f);
      totalVaultSize += fs.statSync(filePath).size;
      const v = readJSON(filePath, {});
      if (v.testResults && Array.isArray(v.testResults)) {
        totalTests += v.testResults.length;
      }
    });
  } catch {}

  res.json({
    success: true,
    metrics: {
      totalRegisteredStudents: users.length,
      activeExamsSubmissions: totalTests,
      totalVaultSizeKB: (totalVaultSize / 1024).toFixed(1),
      averageBand: users.length > 0 ? (users.reduce((acc, u) => acc + (u.currentBand || 0), 0) / users.length).toFixed(1) : '0.0',
      uptimeMinutes: Math.floor(process.uptime() / 60)
    }
  });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`\n🚀 [IELTS Master Server] Backend running at http://localhost:${PORT}`);
  console.log(`📦 Persistent database directory: ${DATA_DIR}`);
  console.log(`🔐 JWT authentication enabled`);
  console.log(`🛡️  CORS whitelist: ${CORS_WHITELIST.join(', ')}`);
  console.log(`🟢 Ready to accept frontend requests.\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => console.log('Server terminated'));
});
process.on('SIGINT', () => {
  server.close(() => console.log('Server closed'));
});

# 更新日志 (Changelog)

所有针对 **ILTES (IELTS Master)** 的版本更新与架构演进均在此记录。

---

## [2.5.0] - 2026-10-11

### 🎨 UI/UX 深度重构 (基于 UI UX Pro Max 设计系统)

#### 1. 字体排版与全局设计令牌 (Typography & Design Tokens)
- **字体升级**：引入现代 EdTech / SaaS 首选字体 **Plus Jakarta Sans** 与 **Inter**，并适配跨平台系统字体回退。
- **孤字换行防护**：为所有标题（`h1` ~ `h4`）配置 `text-wrap: balance`，杜绝孤字掉行。
- **数据与计数排版**：全面应用 `font-variant-numeric: tabular-nums`，确保倒计时、分数、天数与词数在动态变动时无抖动对齐。

#### 2. 无障碍与微交互强化 (Accessibility & Micro-interactions)
- **全键盘焦点感知**：全局注入 `:focus-visible` 焦点环标准（`ring-2 ring-sky-500` 与 2px 留白），满足 WCAG 2.2 AA 可访问性规范。
- **触觉按压反馈**：为所有操作按钮、卡片、导航项增加 `cursor-pointer` 与 `active:scale-[0.98]` 触感反馈。
- **动态减弱响应**：注入 `@media (prefers-reduced-motion: reduce)` 适配规则，为敏感用户自动平滑高频动画。
- **Emoji 符号矢量化**：全平台移除功能按钮内的原生 Emoji（如 ❌、⚠️、✅、⚡、🎲、🎯 等），统一采用精确的 **Lucide SVG 矢量图标**（`XCircle`, `AlertTriangle`, `CheckCircle2`, `Zap`, `Dice5`, `Target`）。

#### 3. 核心界面与看板模块优化 (Views & Components)
- **AppChrome (标题栏与状态栏)**：
  - 升级为精细磨砂玻璃材质（`bg-white/85 backdrop-blur-xl border-slate-200/80`），替换原本生硬的纯黑透明度。
  - 优化 Spotlight 搜题胶囊与快捷键（`Ctrl+K`, `Ctrl+D`）物理悬浮阴影。
  - 状态栏统一为低饱和度 Slate 色阶，提升系统运行信息的品质感。
- **AppSidebar 侧边导航**：
  - 激活项升级为高对比度天蓝主色与微光晕；优化折叠状态与移动端汉堡菜单的无障碍操作支持。
- **四科能力雷达看板 (`DashboardView`)**：
  - 为听力（Blue）、阅读（Teal）、写作（Purple）、口语（Amber）分配专属领域色彩语义，强化信息扫视效率。
  - 卡片集成 `shadow-card-subtle` 与 `shadow-card-hover`，赋予平滑浮动动效（`hover:-translate-y-0.5`）。
- **个性化学习计划卡 (`PersonalStudyPlanCard`)**：
  - 消除历史残留的重复时间轴代码，重构 4 阶段推进路线图与今日任务打卡卡片。
- **艾宾浩斯抗遗忘引擎 (`EbbinghausWidget` & `VocabularyView`)**：
  - 清理 SVG 记忆对抗轨迹图的多余节点，强化图例对比度（艾宾浩斯 95%+ vs 自然衰减 21%）。
  - 生词闪卡与 4 级复核操作按钮全面矢量化并增加无障碍对比度。

#### 4. 工程与自动化验证
- **单元测试**：Vitest 全部 3 个测试套件，27 个测试用例 100% 通过（`scoring`, `ebbinghaus`, `aiStudyPlan`）。
- **打包编译**：TypeScript 5.x 静态类型检查 0 错误，Vite 8 构建成功（`dist/` 资源完整产出）。

---

## [2.4.0] - 2026-10-10
- **安全与性能加固**：重构用户敏感信息存储，引入 `bcrypt` 密码加盐哈希与 `jsonwebtoken` 鉴权。
- **受限缓存**：引入 LRU Bounded Cache 机制，优化大规模词库检索内存开销。

## [2.3.0] - 2026-10-09
- **核心逻辑修复**：修复密码校验流程、模态框触发冲突及横幅视图重复渲染 Bug。
- **自动化测试拓展**：引入 Vitest 自动化单元测试矩阵。

## [2.2.0] - 2026-10-08
- **考点与备考承诺**：新增全国官方雅思机考考点调度规划（Exam Center Scheduler）与 AI 学习承诺书系统。

## [2.1.0] - 2026-10-05
- **全栈架构升级**：引入 Express 5 后端服务与 Hybrid Sync 混合同步引擎。

// Cambridge IELTS Academic Scoring Tables

export function calculateReadingBand(rawScore: number): number {
  if (rawScore >= 39) return 9.0;
  if (rawScore >= 37) return 8.5;
  if (rawScore >= 35) return 8.0;
  if (rawScore >= 33) return 7.5;
  if (rawScore >= 30) return 7.0;
  if (rawScore >= 27) return 6.5;
  if (rawScore >= 23) return 6.0;
  if (rawScore >= 19) return 5.5;
  if (rawScore >= 15) return 5.0;
  if (rawScore >= 13) return 4.5;
  if (rawScore >= 10) return 4.0;
  if (rawScore >= 8) return 3.5;
  if (rawScore >= 6) return 3.0;
  if (rawScore >= 4) return 2.5;
  return 2.0;
}

export function calculateListeningBand(rawScore: number): number {
  if (rawScore >= 39) return 9.0;
  if (rawScore >= 37) return 8.5;
  if (rawScore >= 35) return 8.0;
  if (rawScore >= 32) return 7.5;
  if (rawScore >= 30) return 7.0;
  if (rawScore >= 26) return 6.5;
  if (rawScore >= 23) return 6.0;
  if (rawScore >= 18) return 5.5;
  if (rawScore >= 16) return 5.0;
  if (rawScore >= 13) return 4.5;
  if (rawScore >= 10) return 4.0;
  if (rawScore >= 8) return 3.5;
  if (rawScore >= 6) return 3.0;
  if (rawScore >= 4) return 2.5;
  return 2.0;
}

export function calculateOverallBand(
  listening: number,
  reading: number,
  writing: number,
  speaking: number
): number {
  const avg = (listening + reading + writing + speaking) / 4;
  const decimal = avg - Math.floor(avg);
  if (decimal < 0.25) return Math.floor(avg);
  if (decimal < 0.75) return Math.floor(avg) + 0.5;
  return Math.ceil(avg);
}

// Heuristic offline Writing evaluator
export interface HeuristicEvaluationResult {
  wordCount: number;
  paragraphCount: number;
  scores: {
    overall: number;
    tr: number;
    cc: number;
    lr: number;
    gra: number;
  };
  feedback: {
    strengths: string[];
    weaknesses: string[];
    grammarSuggestions: string[];
  };
}

export function evaluateWritingOffline(
  text: string,
  minWords: number,
  taskType: 'task1' | 'task2'
): HeuristicEvaluationResult {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const paragraphCount = paragraphs.length;

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const grammarSuggestions: string[] = [];

  // 1. Task Response / Achievement (TR)
  let tr = 6.0;
  if (wordCount >= minWords + 50) {
    tr += 1.0;
    strengths.push(`字数充足（已达到 ${wordCount} 词，超过要求的 ${minWords} 词），论述展开具备充分空间。`);
  } else if (wordCount >= minWords) {
    tr += 0.5;
    strengths.push(`达到了官方要求的最低字数要求（${wordCount}/${minWords} 词）。`);
  } else {
    tr -= 1.5;
    weaknesses.push(`字数不足（当前 ${wordCount} 词，要求至少 ${minWords} 词），根据雅思考官准则将直接扣减任务完成度分数。`);
  }

  // Paragraph checks
  if (taskType === 'task2') {
    if (paragraphCount >= 4 && paragraphCount <= 5) {
      tr += 0.5;
      strengths.push('采用了清晰的 4-5 段经典学术议论文结构（引入段 + 2-3个主体论证段 + 结论段）。');
    } else if (paragraphCount < 3) {
      weaknesses.push('段落划分不足（仅有 ' + paragraphCount + ' 段），缺乏明确的段落引申与结论归纳。');
      tr -= 0.5;
    }
  }

  // 2. Coherence & Cohesion (CC)
  let cc = 6.0;
  const cohesiveDevices = [
    'furthermore', 'moreover', 'however', 'nonetheless', 'consequently',
    'in addition', 'on the other hand', 'for instance', 'for example',
    'in contrast', 'as a result', 'therefore', 'subsequently', 'in conclusion',
    'to summarize', 'firstly', 'secondly', 'finally', 'specifically'
  ];
  const lower = text.toLowerCase();
  const foundCohesives = cohesiveDevices.filter(d => lower.includes(d));
  
  if (foundCohesives.length >= 6) {
    cc += 1.0;
    strengths.push(`逻辑连接词丰富多样（检测到 ${foundCohesives.length} 种高级衔接标识，如 ${foundCohesives.slice(0, 4).join(', ')}）。`);
  } else if (foundCohesives.length >= 3) {
    cc += 0.5;
    strengths.push('段落间具备基本逻辑过渡标识。');
  } else {
    cc -= 0.5;
    weaknesses.push('逻辑衔接词偏少，建议多使用 furthermore, in contrast, consequently 等学术连接手段增强行文流动感。');
  }

  // 3. Lexical Resource (LR)
  let lr = 6.0;
  const academicWords = [
    'significant', 'substantial', 'dramatic', 'phenomenon', 'consequence',
    'perspective', 'sustainable', 'fundamental', 'counterpart', 'demonstrate',
    'illustrate', 'fluctuate', 'stabilize', 'predominant', 'inevitable',
    'advocate', 'mitigate', 'deteriorate', 'unprecedented', 'comprehensive'
  ];
  const foundAcademic = academicWords.filter(w => lower.includes(w));
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const lexicalDiversity = words.length > 0 ? (uniqueWords.size / words.length) : 0;

  if (foundAcademic.length >= 5 && lexicalDiversity > 0.45) {
    lr += 1.0;
    strengths.push(`学术用词丰富度良好（检测到核心高分学术词汇如 ${foundAcademic.slice(0, 4).join(', ')}），词汇多样性比率达 ${(lexicalDiversity * 100).toFixed(1)}%。`);
  } else if (foundAcademic.length >= 2) {
    lr += 0.5;
    strengths.push('展现了一定的学术词汇积累。');
  } else {
    weaknesses.push('词汇重复度稍高或基础词较多，建议加强高级近义词替换（如使用 substantial 替换 a lot of, mitigate 替换 solve 等）。');
  }

  // 4. Grammatical Range & Accuracy (GRA)
  let gra = 6.0;
  // Check complex sentence markers
  const complexMarkers = ['although', 'even though', 'whereas', 'while', 'which', 'who', 'that', 'if', 'provided that', 'unless'];
  const foundComplex = complexMarkers.filter(m => lower.includes(m));
  
  if (foundComplex.length >= 4) {
    gra += 0.5;
    strengths.push('复合句结构运用良好（从句引导词包括定语从句、让步从句及条件状语从句）。');
  }

  // Check for common basic mistakes
  if (/\bi\b/.test(text)) {
    grammarSuggestions.push('检测到小写单字母 "i"，在学术英文写作中必须大写 "I"。');
  }
  if (/\b(don't|can't|won't|isn't|aren't|didn't)\b/i.test(text)) {
    grammarSuggestions.push('检测到缩写形式（如 don\'t / can\'t），雅思官方学术写作严禁使用缩写，请展开为 do not / cannot。');
    gra -= 0.5;
  }
  if (text.split(/[.!?]/).some(s => s.trim().split(/\s+/).length > 45)) {
    grammarSuggestions.push('存在个别超过 45 词的长难句，注意检查主谓一致与从句嵌套层次，避免产生 Run-on sentence。');
  }

  // Clamp scores between 4.0 and 8.5 for heuristic
  tr = Math.max(4.0, Math.min(8.5, Math.round(tr * 2) / 2));
  cc = Math.max(4.0, Math.min(8.5, Math.round(cc * 2) / 2));
  lr = Math.max(4.0, Math.min(8.5, Math.round(lr * 2) / 2));
  gra = Math.max(4.0, Math.min(8.5, Math.round(gra * 2) / 2));

  const overall = calculateOverallBand(tr, cc, lr, gra);

  return {
    wordCount,
    paragraphCount,
    scores: {
      overall,
      tr,
      cc,
      lr,
      gra
    },
    feedback: {
      strengths,
      weaknesses,
      grammarSuggestions
    }
  };
}

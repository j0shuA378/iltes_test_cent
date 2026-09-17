export interface PlacementQuestion {
  id: number;
  category: '词汇与学术替换' | '长难句与语法逻辑' | '阅读定位与TFNG' | '听力拼写与敏感度' | '学术写作与高阶搭配' | '口语语用与连贯表达';
  module: 'vocabulary' | 'reading' | 'grammar' | 'listening' | 'writing' | 'speaking';
  title: string;
  context?: string;
  question: string;
  options: {
    key: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation: string;
  bandImpact: string;
}

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    id: 1,
    category: '词汇与学术替换',
    module: 'vocabulary',
    title: '学术核心词汇与同义替换能力',
    question: '在雅思阅读与写作中，要替换高频词 "substantial"（大量的、实质性的），以下哪一个选项是最高端、最贴切的同义替换？',
    options: [
      { key: 'A', text: 'temporary（暂时的）' },
      { key: 'B', text: 'considerable（相当大的、可观的）' },
      { key: 'C', text: 'fragile（脆弱的）' },
      { key: 'D', text: 'superficial（肤浅的）' }
    ],
    correctAnswer: 'B',
    explanation: 'substantial 与 considerable 均为雅思学术高频替换词对（如 substantial/considerable increase），能够体现 Band 6.0+ 的学术词汇多样性。',
    bandImpact: '考核学术词汇广度与替换敏锐度'
  },
  {
    id: 2,
    category: '长难句与语法逻辑',
    module: 'grammar',
    title: '复杂句复合连接与主从逻辑',
    question: '请选出填入空白处语法最为严密、符合学术规范的选项：\n"Although renewable energy technology has advanced rapidly, ______ high initial infrastructure costs."',
    options: [
      { key: 'A', text: 'but it still faces' },
      { key: 'B', text: 'it still faces' },
      { key: 'C', text: 'and facing' },
      { key: 'D', text: 'despite facing' }
    ],
    correctAnswer: 'B',
    explanation: '英语语法中 Although 引导让步状语从句后，主句绝对不可再用 but。主句必须具备完整主谓结构（it still faces）。',
    bandImpact: '考核从句连接与常见中式英语语法避坑能力'
  },
  {
    id: 3,
    category: '阅读定位与TFNG',
    module: 'reading',
    title: '雅思学术类阅读是非无逻辑辨析 (TFNG)',
    context: 'Urban rewilding focuses on reintroducing native flora and fauna into city landscapes. While early municipal programs concentrated exclusively on public parks, recent private residential developments have increasingly adopted green rooftops to support pollinator corridors.',
    question: '根据上述段落，判断下列陈述的真实性：\n"Private residential projects in recent years have begun incorporating green rooftops to aid pollinators."',
    options: [
      { key: 'A', text: 'TRUE (陈述与原文事实完全一致)' },
      { key: 'B', text: 'FALSE (陈述与原文事实直接冲突对立)' },
      { key: 'C', text: 'NOT GIVEN (原文未提及该信息或无法推断)' }
    ],
    correctAnswer: 'A',
    explanation: '原文 "recent private residential developments have increasingly adopted green rooftops to support pollinator corridors" 与陈述属于精确同义转述，因此正确判定为 TRUE。',
    bandImpact: '考核学术快速定位与同义转述甄别'
  },
  {
    id: 4,
    category: '听力拼写与敏感度',
    module: 'listening',
    title: '雅思听力高频拼写与细节准确性',
    question: '雅思听力 Section 1 校园住宿场景中，以下哪一个是学术住宿机构 "住宿" 的官方无误英式拼写？（听力失分高发词）',
    options: [
      { key: 'A', text: 'Accomodation (单 c 双 m)' },
      { key: 'B', text: 'Accommodation (双 c 双 m)' },
      { key: 'C', text: 'Acommodation (单 c 单 m)' },
      { key: 'D', text: 'Acomodation (单 c 单 m)' }
    ],
    correctAnswer: 'B',
    explanation: 'Accommodation 必须为双 c 和双 m（two c\'s and two m\'s），这是剑桥雅思听力中最具杀伤力的填空高频失分词之一。',
    bandImpact: '考核机考精确拼写与抗混淆基础'
  },
  {
    id: 5,
    category: '学术写作与高阶搭配',
    module: 'writing',
    title: 'Task 1 图表趋势与学术语域 (Lexical & Register)',
    question: '在学术类写作 Task 1 描写折线图急剧上升趋势时，以下哪句话最符合考官学术客观语域要求？',
    options: [
      { key: 'A', text: 'The number went up very very big and high.' },
      { key: 'B', text: 'The figures witnessed a dramatic surge over the five-year period.' },
      { key: 'C', text: 'The data is jumping bigger and bigger like crazy.' },
      { key: 'D', text: 'It has a large climbing thing on the chart.' }
    ],
    correctAnswer: 'B',
    explanation: '"witnessed a dramatic surge" 采用了学术拟人化主语（figures witnessed...）与高阶动宾搭配，避免口语化修饰，直接达到 Band 6.5+ 表达标准。',
    bandImpact: '考核学术书面语态与动宾搭配'
  },
  {
    id: 6,
    category: '口语语用与连贯表达',
    module: 'speaking',
    title: '口语 Part 3 深度论证与逻辑平衡',
    question: '在雅思口语 Part 3 回答科技利弊等两面性问题时，考官最欣赏的自然、地道开场表达是：',
    options: [
      { key: 'A', text: 'It is a double-edged sword, bringing both unprecedented conveniences and privacy concerns.' },
      { key: 'B', text: 'Good thing and bad thing are together in one box.' },
      { key: 'C', text: 'I think 50% yes and 50% no in my mind.' },
      { key: 'D', text: 'The story has two faces for people.' }
    ],
    correctAnswer: 'A',
    explanation: 'A 选项既运用了地道的习语 "double-edged sword"，又紧跟两个并列宾语 "unprecedented conveniences" 与 "privacy concerns"，逻辑清晰，流利度与语用精准。',
    bandImpact: '考核口语论证连贯度与逻辑修辞'
  }
];

export interface PlacementEvaluation {
  testedBand: number;
  levelTitle: string;
  summary: string;
  advice: string;
  recommendedPhaseIndex: number;
}

export function evaluatePlacementScore(score: number): PlacementEvaluation {
  if (score >= 6) {
    return {
      testedBand: 6.0,
      levelTitle: '良好进阶水平 (Competent User)',
      summary: '词汇储备丰富，具备良好的语法结构敏感度与逻辑辨析力，基本脱离低级失分陷阱。',
      advice: '建议主攻长难句速读定位、大作文 4 维论证深度及口语 Part 3 深度拓展，178天冲刺 7.5 分高分！',
      recommendedPhaseIndex: 1
    };
  } else if (score === 5) {
    return {
      testedBand: 5.5,
      levelTitle: '中度过渡水平 (Modest-Competent User)',
      summary: '具备基本学术英语理解能力，但在高精度机考拼写或逻辑细节转折上存在小盲区。',
      advice: '强化 500 组学术同义替换、精听抓词与剑雅真题计时模考，稳步迈向 7.0 分。',
      recommendedPhaseIndex: 1
    };
  } else if (score === 4) {
    return {
      testedBand: 5.0,
      levelTitle: '基础稳步水平 (Modest User)',
      summary: '掌握核心常用词汇，但长难句分析较吃力，容易受到复杂语境与转折词干扰。',
      advice: '建议从 Phase 1 基础巩固起步，重点补强语法主干拆分与听力 Section 1-2 满分突破。',
      recommendedPhaseIndex: 0
    };
  } else if (score === 3) {
    return {
      testedBand: 4.5,
      levelTitle: '起步基础水平 (Basic-Intermediate)',
      summary: '词汇量有限，阅读容易出现定位回读，中式英语语法习惯较为明显。',
      advice: '严格执行 178 天科学计划，依托艾宾浩斯记忆曲线每日背诵 20 核心词并开展基础精读。',
      recommendedPhaseIndex: 0
    };
  } else if (score >= 1) {
    return {
      testedBand: 4.0,
      levelTitle: '初学起步水平 (Limited User)',
      summary: '基础词汇与语法薄弱，听力拼写与长难句较为吃力，亟需系统性输入与语法脱敏。',
      advice: '已精准测定起点为 Band 4.0，系统已为您匹配专属 4 阶段稳步爬坡方案！',
      recommendedPhaseIndex: 0
    };
  } else {
    return {
      testedBand: 3.5,
      levelTitle: '零基础启动水平 (Novice)',
      summary: '初步接触雅思考试，各科均需从最基础的真题题型、高频拼写与日常场景积累开始。',
      advice: '不要灰心！178 天足够完成基础蜕变，系统将从 Phase 1 为您逐日拆解任务。',
      recommendedPhaseIndex: 0
    };
  }
}

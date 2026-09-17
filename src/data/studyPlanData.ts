export interface StudyPlanPhase {
  id: number;
  phaseNumber: number;
  name: string;
  dayRange: string;
  daysCount: number;
  targetBand: string;
  subtitle: string;
  coreObjectives: string[];
  listeningStrategy: string;
  readingStrategy: string;
  writingStrategy: string;
  speakingStrategy: string;
  dailyRoutine: string[];
  keyMilestone: string;
}

export interface PersonalizedPlanConfig {
  currentBand: number; // 0.0 indicates untested baseline
  targetBand: number;  // 7.0
  totalDays: number;    // 178
  currentDay: number;   // 1
  dailyHours: number;   // 2.5
  startDate: string;
  targetListening: number; // 7.5
  targetReading: number;   // 7.5
  targetWriting: number;   // 6.5
  targetSpeaking: number;  // 6.5
  focusWeaknesses: string[];
}

export const DEFAULT_PLAN_CONFIG: PersonalizedPlanConfig = {
  currentBand: 0.0,
  targetBand: 7.0,
  totalDays: 178,
  currentDay: 1,
  dailyHours: 2.5,
  startDate: new Date().toISOString().split('T')[0],
  targetListening: 7.5,
  targetReading: 7.5,
  targetWriting: 6.5,
  targetSpeaking: 6.5,
  focusWeaknesses: ['学术词汇构建', '长难句语法结构拆解', '听力连读与定位预判', '写作与口语逻辑输出']
};

export function getStudyPhases(currentBand: number = 0, targetBand: number = 7.0): StudyPlanPhase[] {
  const isUntested = currentBand === 0;
  const startBandDisplay = isUntested ? '待定级起步' : `Band ${currentBand.toFixed(1)}`;

  return [
    {
      id: 1,
      phaseNumber: 1,
      name: isUntested ? '筑基起步 · 核心词汇与基础语法重构' : '筑基巩固 · 核心词汇与基础语法重构',
      dayRange: 'Day 1 - 45',
      daysCount: 45,
      targetBand: `${startBandDisplay} ➔ Band 5.0`,
      subtitle: isUntested 
        ? '扫清词汇死角与长难句障碍，通过基础训练摸索个人能力盘' 
        : `从 Band ${currentBand.toFixed(1)} 筑基爬坡，稳步夯实学术词汇与听力数字拼写基本盘`,
      coreObjectives: [
        '扩充词汇量至 3,500+（掌握雅思核心学术 1,500 词）',
        '攻克英语 5 大基本句型与三大从句，突破长难句断句',
        '听力 Section 1（租房、生活咨询、预订场景）正确率达 90% 以上',
        '阅读不限时单篇精读，学会使用划词词典标注长难句与学术生词'
      ],
      listeningStrategy: '剑雅真题 Section 1 专项盲听。重点训练数字、日期、人名、邮编和地址拼写，做 1.0x 原速精听默写。',
      readingStrategy: '每天单篇 Passage 精读。不追求速度，逐句分析长难句的主谓宾结构，利用即时词典查询生词并加入生词本。',
      writingStrategy: '语法与简单句造句重塑。彻底消除主谓不一致、时态混用、词性误用等硬伤；积累 Task 1 基础趋势上升/下降句型。',
      speakingStrategy: '音标与基础语调纠正。大声朗读口语 Part 1 高频生活话题（Hometown, Study, Accommodation），消除不敢开口的畏难情绪。',
      dailyRoutine: [
        '07:30 - 08:15 词汇闪卡背诵 40 词 + 听力 Section 1 拼写词听写',
        '19:30 - 20:30 剑雅阅读单篇精读 + 长难句主干拆解 + 生词划线',
        '20:30 - 21:15 听力 Section 1 精听 1 套 + 错题原因分析',
        '21:15 - 21:45 写作基础造句 3 句 + 口语 Part 1 录音跟读 2 题'
      ],
      keyMilestone: '剑雅听力 S1 稳定对 9/10 题；阅读单篇词汇理解率达 80% 以上。'
    },
    {
      id: 2,
      phaseNumber: 2,
      name: '题型破局 · 剑桥真题技巧专项攻坚',
      dayRange: 'Day 46 - 95',
      daysCount: 50,
      targetBand: 'Band 5.0 ➔ 6.0',
      subtitle: '告别盲目凭感觉做题，全面掌握官方题型解题逻辑与考点',
      coreObjectives: [
        '阅读攻克 TFNG（True/False/Not Given）、Summary 填空与 Matching 题',
        '听力突破 Section 2/3 选择题与地图题，训练定位词预判能力',
        '写作掌握小作文 6 大图表（折线/柱状/饼图/表格/地图/流程）标准结构',
        '口语 Part 1 建立题库素材库，Part 2 初步掌握 1 分钟笔记法'
      ],
      listeningStrategy: '专攻 S2/S3 选择题与配对题。审题时快速画出题干限定词与否定词，边听边捕捉信号词转折（However, In fact）。',
      readingStrategy: '掌握扫读（Scanning）与略读（Skimming）。按题型分类集中突破，掌握“题干定关键词 ➔ 原文定位 ➔ 同义替换比对”三步法。',
      writingStrategy: 'Task 1 图表题模板化。牢记引言改写、概述段（Overview）、特征细节段的分段逻辑，掌握多组数据对比与极值表达。',
      speakingStrategy: 'Part 2 结构化思维。利用“时间/地点/人物/事件/原因”5 指法，保证 1 分钟准备时间内写下提纲，作答连续讲满 1.5 分钟。',
      dailyRoutine: [
        '07:30 - 08:15 雅思进阶学术词汇 30 词 + 错词本复习',
        '19:30 - 20:30 剑雅阅读专项题型训练 2 篇（限时 35 分钟 + 订正）',
        '20:30 - 21:15 听力 S2/S3 选择与地图题精刷 + 信号词捕捉',
        '21:15 - 21:45 Task 1 小作文完整写 1 篇（限时 20 分钟）'
      ],
      keyMilestone: '阅读听力真题正确题数稳定达到 23-26 题（稳过 Band 6.0）。'
    },
    {
      id: 3,
      phaseNumber: 3,
      name: '逻辑同义 · 高分输出与深度反思批改',
      dayRange: 'Day 96 - 145',
      daysCount: 50,
      targetBand: 'Band 6.0 ➔ 6.5',
      subtitle: '建立 500 组官方同义替换体系，大作文论证链深化，口语串题破局',
      coreObjectives: [
        '系统建立 500 组高频同义替换库（Paraphrase Database）',
        'Task 2 大作文掌握利弊、观点、双边讨论题型的完整论证链拓展',
        '口语 Part 2 掌握“万能故事串题法”，准备 4 个核心故事覆盖 80% 季度题库',
        '听读单科目限时做题，听力冲刺 28 题，阅读冲刺 29 题'
      ],
      listeningStrategy: '突破连读、弱读与吞音干扰。对剑 14-18 进行 1.2 倍速精听跟读（Shadowing），提升对同义替换词抓取的敏锐度。',
      readingStrategy: '严格 60 分钟 3 篇全套限时控速（20分钟/篇）。建立段落逻辑映射，针对 Heading 题总结出段落主题句出现规则。',
      writingStrategy: 'Task 2 论证深度训练。杜绝空话套话，采用“观点句 + 展开因果解释 + 具象化例证 + 让步或反面论证”的严密四步法。',
      speakingStrategy: 'Part 2 串题法 + Part 3 深度互动。将事件、人物、地点、物品 4 大模块的故事进行多维交叉串联，流利度与连贯度达标。',
      dailyRoutine: [
        '07:30 - 08:15 500 组同义替换词库巩固 + 高频学术搭配复习',
        '19:00 - 20:10 剑雅真题全套听力或阅读限时模考 + 精准错题归因',
        '20:15 - 21:15 Task 2 大作文 40 分钟限时写 + AI 批改 4 维诊断',
        '21:15 - 21:45 口语 Part 2+3 计时实录 1 组，回听检查停顿与语法'
      ],
      keyMilestone: '写作大作文能在 40 分钟内完成 270 词且论证充分；口语 Part 2 自信流畅讲满 2 分钟。'
    },
    {
      id: 4,
      phaseNumber: 4,
      name: '全真冲刺 · CDI 机考模考与弱项精准绝杀',
      dayRange: 'Day 146 - 178',
      daysCount: 33,
      targetBand: `Band 6.5 ➔ ${targetBand.toFixed(1)}+ 🏆`,
      subtitle: '全流程 CDI 机考仿真压测，打字控时精准，错题归因彻底清零',
      coreObjectives: [
        '全真模拟机考（CDI）屏幕做题手感与快捷键，适应左右分屏',
        '写作英文打字速度突破 40 WPM，预留 3 分钟进行拼写标点检查',
        '全面清空个人错题本，针对高频失误题型做归因防御',
        `实现目标分解：听力 7.5 + 阅读 7.5 + 写作 6.5 + 口语 6.5 = 总分 ${targetBand.toFixed(1)}！`
      ],
      listeningStrategy: '上午 9:00 全真听力模考。训练听力边听边键盘敲击输入答案的机考一心二用能力，稳拿 32 题（Band 7.5）。',
      readingStrategy: '机考划线与笔记功能熟练运用。高强度限时训练（55分钟完成3篇），留出 5 分钟通查答题卡，稳拿 33 题（Band 7.5）。',
      writingStrategy: 'Task 1+2 严格 60 分钟连打。规范打字排版，熟练运用 Band 7+ 词汇与句式多样性，确保 TR、CC、LR、GRA 无短板。',
      speakingStrategy: '模拟考官全真对答。随机抽取新题，重点强化自然连词、语调起伏与词汇灵活性，展现自信大方的交流状态。',
      dailyRoutine: [
        '09:00 - 11:45 全真机考模拟（严格执行听力+阅读+写作连续 2.5 小时）',
        '14:30 - 16:00 模考深度复盘：错题本录入 + 同义替换反思',
        '16:30 - 17:30 写作高分范文研读 + 句式精仿与词汇替换',
        '20:00 - 21:00 口语全套模拟对练 + 考场心态脱敏'
      ],
      keyMilestone: `全真机考连续 3 次模考总分均分稳定突破 ${targetBand.toFixed(1)} 分！自信走入真实雅思考场！`
    }
  ];
}

export const STUDY_PHASES: StudyPlanPhase[] = getStudyPhases(0, 7.0);

export interface DailyPlanTask {
  id: string;
  phaseId: number;
  category: 'vocabulary' | 'listening' | 'reading' | 'writing' | 'speaking';
  title: string;
  description: string;
  durationMinutes: number;
  completed: boolean;
  targetModule: 'vocabulary' | 'listening' | 'reading' | 'writing' | 'speaking';
}

export function getDailyTasksForPhase(phaseId: number): DailyPlanTask[] {
  if (phaseId === 1) {
    return [
      {
        id: 'p1_task_1',
        phaseId: 1,
        category: 'vocabulary',
        title: '【词汇攻坚】背诵 35 个雅思初阶学术词并听英音发音',
        description: '重点攻克核心学术词典高频词，利用闪卡测试强化记忆',
        durationMinutes: 30,
        completed: false,
        targetModule: 'vocabulary'
      },
      {
        id: 'p1_task_2',
        phaseId: 1,
        category: 'listening',
        title: '【听力保分】剑雅 S1 租房/咨询填空 1 套 + 数字拼写默写',
        description: '原速听写并校对数字、日期、人名与地址，保底必须全对',
        durationMinutes: 30,
        completed: false,
        targetModule: 'listening'
      },
      {
        id: 'p1_task_3',
        phaseId: 1,
        category: 'reading',
        title: '【阅读精读】剑雅 Passage 1 长难句拆解与学术生词划线',
        description: '不做限时，单篇精读并利用划词词典查询 5-8 个生词',
        durationMinutes: 40,
        completed: false,
        targetModule: 'reading'
      },
      {
        id: 'p1_task_4',
        phaseId: 1,
        category: 'writing',
        title: '【语法造句】Task 1 图表上升/下降/平稳经典 3 句型练习',
        description: '消除主谓一致与时态错误，模仿标准学术句式造句',
        durationMinutes: 25,
        completed: false,
        targetModule: 'writing'
      },
      {
        id: 'p1_task_5',
        phaseId: 1,
        category: 'speaking',
        title: '【口语朗读】Part 1 日常话题高声朗读与录音纠音 2 题',
        description: '跟读标准英音范例，纠正单个音标发音，建立开口自信',
        durationMinutes: 20,
        completed: false,
        targetModule: 'speaking'
      }
    ];
  } else if (phaseId === 2) {
    return [
      {
        id: 'p2_task_1',
        phaseId: 2,
        category: 'reading',
        title: '【题型突破】阅读 TFNG 与 Summary 填空专项强化 2 篇',
        description: '掌握段落主题句定位与同义替换识别，限时 35 分钟',
        durationMinutes: 40,
        completed: false,
        targetModule: 'reading'
      },
      {
        id: 'p2_task_2',
        phaseId: 2,
        category: 'listening',
        title: '【题型攻坚】听力 Section 2/3 选择题与地图题 1 套',
        description: '画出题干限定词与陷阱词，捕捉转折信号词',
        durationMinutes: 35,
        completed: false,
        targetModule: 'listening'
      },
      {
        id: 'p2_task_3',
        phaseId: 2,
        category: 'writing',
        title: '【小作文实操】Task 1 完整折线/柱状图写作 1 篇 (限时20m)',
        description: '规范引言改写、Overview 总述段与细节段数据对比',
        durationMinutes: 30,
        completed: false,
        targetModule: 'writing'
      },
      {
        id: 'p2_task_4',
        phaseId: 2,
        category: 'vocabulary',
        title: '【考官同义】掌握 20 组真题同义替换词对（如 mitigate/alleviate）',
        description: '建立做题同义替换反应，记录至生词本',
        durationMinutes: 25,
        completed: false,
        targetModule: 'vocabulary'
      },
      {
        id: 'p2_task_5',
        phaseId: 2,
        category: 'speaking',
        title: '【口语结构】Part 2 准备 1 分钟笔记 + 作答讲满 1.5 分钟',
        description: '利用时间/地点/人物/事件结构卡片，流畅完成作答',
        durationMinutes: 20,
        completed: false,
        targetModule: 'speaking'
      }
    ];
  } else if (phaseId === 3) {
    return [
      {
        id: 'p3_task_1',
        phaseId: 3,
        category: 'reading',
        title: '【全套限时】阅读 3 篇 60 分钟标准控速模考 + 错题本归因',
        description: '严格 20 分钟/篇，定位错题原因（定位失误/同义替换遗漏）',
        durationMinutes: 60,
        completed: false,
        targetModule: 'reading'
      },
      {
        id: 'p3_task_2',
        phaseId: 3,
        category: 'writing',
        title: '【大作文突破】Task 2 论证链 4 步法限时写作 1 篇 (40m)',
        description: '观点句+展开解释+具象例子+让步反思，体验 AI 批改诊断',
        durationMinutes: 45,
        completed: false,
        targetModule: 'writing'
      },
      {
        id: 'p3_task_3',
        phaseId: 3,
        category: 'listening',
        title: '【1.2倍速】剑雅真题听力 1.2 倍速精听跟读（Shadowing）',
        description: '突破连读弱读吞音干扰，巩固答题敏感度',
        durationMinutes: 35,
        completed: false,
        targetModule: 'listening'
      },
      {
        id: 'p3_task_4',
        phaseId: 3,
        category: 'speaking',
        title: '【万能串题】口语 Part 2 核心故事交叉串联 2 个新话题',
        description: '练习一个通用核心故事覆盖不同题目的转化衔接',
        durationMinutes: 25,
        completed: false,
        targetModule: 'speaking'
      },
      {
        id: 'p3_task_5',
        phaseId: 3,
        category: 'vocabulary',
        title: '【高分表达】复习错题本待温习题目与近义词搭配',
        description: '查漏补缺，将薄弱考点各个击破',
        durationMinutes: 20,
        completed: false,
        targetModule: 'vocabulary'
      }
    ];
  } else {
    return [
      {
        id: 'p4_task_1',
        phaseId: 4,
        category: 'listening',
        title: '【全真模考】09:00 剑雅 CDI 仿真听力机考（目标 32/40）',
        description: '按真实机考流程连续作答，训练打字手速与专注力',
        durationMinutes: 40,
        completed: false,
        targetModule: 'listening'
      },
      {
        id: 'p4_task_2',
        phaseId: 4,
        category: 'reading',
        title: '【全真模考】09:50 剑雅 CDI 仿真阅读机考（目标 33/40）',
        description: '左右分屏机考操作，55 分钟完成 + 5 分钟检查',
        durationMinutes: 60,
        completed: false,
        targetModule: 'reading'
      },
      {
        id: 'p4_task_3',
        phaseId: 4,
        category: 'writing',
        title: '【全真模考】11:00 写作 Task 1+2 连续 60 分钟键盘输入实战',
        description: '打字速度冲刺 40 WPM，词数 420+ 词，预留 3 分钟检查',
        durationMinutes: 60,
        completed: false,
        targetModule: 'writing'
      },
      {
        id: 'p4_task_4',
        phaseId: 4,
        category: 'speaking',
        title: '【考场实战】口语 Part 1+2+3 全真倒计时模拟考场 1 组',
        description: '完整 14 分钟实战录音，模拟临场面对考官的心理状态',
        durationMinutes: 20,
        completed: false,
        targetModule: 'speaking'
      },
      {
        id: 'p4_task_5',
        phaseId: 4,
        category: 'vocabulary',
        title: '【错题清零】错题本高频失误考点专项复盘防漏',
        description: '彻底消灭做题盲区，以最佳状态迎接真实考试',
        durationMinutes: 20,
        completed: false,
        targetModule: 'vocabulary'
      }
    ];
  }
}

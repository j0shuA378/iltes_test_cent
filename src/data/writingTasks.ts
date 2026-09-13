import { WritingTask } from '../types/ielts';

export const WRITING_TASKS: WritingTask[] = [
  {
    id: 'w_task1_ev_sales',
    type: 'task1',
    title: 'Global Electric Vehicle Market Share by Region (2018-2024)',
    category: 'Academic - Bar Chart (2024-2026 最新真题)',
    year: '2024-2025',
    source: 'Cambridge 19 & Recent CDI Recall',
    tags: ['Bar Chart', 'Technology', 'Automotive', 'Environment'],
    minWords: 150,
    recommendedMinutes: 20,
    prompt: 'The bar chart illustrates the market share of newly registered electric vehicles (EVs) across four major regions—China, Europe, North America, and Other Nations—in 2018, 2021, and 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    chartDescription: 'Bar chart showing EV market share: China (6% in 2018, 16% in 2021, 38% in 2024), Europe (3% in 2018, 18% in 2021, 24% in 2024), North America (2% in 2018, 5% in 2021, 10% in 2024), Other (1% in 2018, 2% in 2021, 5% in 2024).',
    chartSvg: `<svg viewBox="0 0 500 280" className="w-full h-auto bg-slate-50 border border-slate-200 rounded-lg p-3">
      <line x1="50" y1="230" x2="470" y2="230" stroke="#94a3b8" stroke-width="2"/>
      <line x1="50" y1="30" x2="50" y2="230" stroke="#94a3b8" stroke-width="2"/>
      <text x="25" y="40" font-size="11" fill="#64748b">40%</text>
      <text x="25" y="90" font-size="11" fill="#64748b">30%</text>
      <text x="25" y="140" font-size="11" fill="#64748b">20%</text>
      <text x="25" y="190" font-size="11" fill="#64748b">10%</text>
      <text x="35" y="235" font-size="11" fill="#64748b">0%</text>
      <!-- Bars grouped by region: China (80-140), Europe (170-230), NA (260-320), Other (350-410) -->
      <!-- China 2018(6%), 2021(16%), 2024(38%) -->
      <rect x="70" y="200" width="18" height="30" fill="#93c5fd" />
      <rect x="90" y="150" width="18" height="80" fill="#3b82f6" />
      <rect x="110" y="40" width="18" height="190" fill="#1d4ed8" />
      <text x="85" y="248" font-size="11" fill="#1e293b" font-weight="bold">China</text>

      <!-- Europe 2018(3%), 2021(18%), 2024(24%) -->
      <rect x="170" y="215" width="18" height="15" fill="#a7f3d0" />
      <rect x="190" y="140" width="18" height="90" fill="#10b981" />
      <rect x="210" y="110" width="18" height="120" fill="#047857" />
      <text x="180" y="248" font-size="11" fill="#1e293b" font-weight="bold">Europe</text>

      <!-- North America 2018(2%), 2021(5%), 2024(10%) -->
      <rect x="270" y="220" width="18" height="10" fill="#fde68a" />
      <rect x="290" y="205" width="18" height="25" fill="#f59e0b" />
      <rect x="310" y="180" width="18" height="50" fill="#b45309" />
      <text x="270" y="248" font-size="11" fill="#1e293b" font-weight="bold">N. America</text>

      <!-- Others 2018(1%), 2021(2%), 2024(5%) -->
      <rect x="370" y="225" width="18" height="5" fill="#fbcfe8" />
      <rect x="390" y="220" width="18" height="10" fill="#ec4899" />
      <rect x="410" y="205" width="18" height="25" fill="#be185d" />
      <text x="380" y="248" font-size="11" fill="#1e293b" font-weight="bold">Others</text>
    </svg>`,
    sampleBand9: `The bar chart delineates the proportion of electric vehicle registrations across four global geographical segments in three designated years: 2018, 2021, and 2024.

Overall, all monitored regions underwent noticeable growth in EV adoption over the six-year cycle. China cemented its position as the undisputed frontrunner by 2024, exhibiting the most dramatic surge, whereas adoption rates in North America and the rest of the world expanded at substantially more conservative paces.

In 2018, EV market penetration was marginal across the board, led moderately by China at 6%, with Europe trailing closely behind at 3%, and North America registering a negligible 2%. However, by 2021, both Europe and China underwent exponential upswings, capturing 18% and 16% respectively.

Over the subsequent triennium concluding in 2024, China's market share skyrocketed to an unprecedented 38%, more than double its 2021 figure. Concurrently, European growth moderated slightly to peak at 24%. By contrast, North America achieved a modest 10% share, and Other Nations accounted for a mere 5% despite experiencing a fivefold expansion from its baseline.`,
    sampleAnalysis: '【满分图表构架解析】\n1. 概述段精准揭示宏观全局：全部地区增长 + 中国由领跑转为绝对霸主 + 欧美增速的分化。\n2. 数据描述层次分明：先概括基准年（2018）普遍偏低，再描述转折点（2021）中欧并进，最后聚焦终局年（2024）中国的爆发式跨越与欧美对比。\n3. 使用了丰富的学术比率与增速句式：skyrocketed to an unprecedented 38%, exponential upswings, conservative pace, triennium concluding in 2024。',
    keyVocabulary: [
      'market penetration (市场渗透率)',
      'undisputed frontrunner (无可争议的领头羊)',
      'exponential upswings (指数级上升)',
      'subsequent triennium (随后的三年期)',
      'skyrocketed to an unprecedented (暴涨至空前的)'
    ]
  },
  {
    id: 'w_task2_remote_work',
    type: 'task2',
    title: 'Remote Working and Urban Decentralization',
    category: 'Society & Employment (2025/2026 最新题季)',
    year: '2025-2026',
    source: '2025-2026 CDI Machine Exam Pool',
    tags: ['Workplace', 'Urbanization', 'Technology', 'Quality of Life'],
    minWords: 250,
    recommendedMinutes: 40,
    prompt: 'In many countries, an increasing number of professionals are opting to work remotely from home rather than commute to central business district offices.\n\nDo the advantages of this trend outweigh the disadvantages for individuals and society as a whole?',
    sampleBand9: `The proliferation of telecommuting platforms has catalyzed a paradigm shift in modern employment, with millions of white-collar workers abandoning daily commutes to central business districts in favor of remote home setups. In my assessment, although this decentralization presents distinct challenges regarding social cohesion and urban commercial ecosystems, its profound merits in environmental sustainability, worker autonomy, and regional equilibrium vastly outweigh the drawbacks.

On the one hand, remote work is not devoid of societal and personal repercussion. The primary casualty of this shift is the commercial fabric of metropolitan hubs. High-density central business districts traditionally rely on a continuous influx of office workers to sustain transit systems, hospitality venues, and retail shops; widespread absenteeism precipitates financial strain on municipal coffers and service workers. Furthermore, on an individual psychological level, the erosion of physical boundaries between professional responsibilities and domestic life can engender chronic overwork, digital fatigue, and profound sensations of professional isolation, particularly for novice employees deprived of informal workplace socialization.

Nevertheless, the macroscopic and personal advantages are far more compelling. Most noticeably, eliminating the grueling daily commute yields immense dividends for individual well-being and ecological preservation. Commuters save hundreds of hours annually, resulting in enhanced physical rest, healthier diets, and expanded leisure with family. Concurrently, the reduction in vehicular congestion noticeably diminishes vehicular carbon emissions and smog in megacities. More fundamentally, remote working acts as a powerful demographic equalizer: highly skilled professionals are no longer coerced into paying exorbitant metropolitan rents, thereby injecting disposable income and entrepreneurial vitality into regional towns and rural communities.

In conclusion, while telecommuting requires structural adaptation to revitalize metropolitan centers and protect workers from digital burnout, its benefits in mitigating urban sprawl, cutting transport emissions, and restoring work-life equilibrium render it a overwhelmingly positive societal evolution.`,
    sampleAnalysis: '【考官点评与范文剖析】\n- 题型审题：Do the advantages outweigh the disadvantages（利弊权衡题），范文立场极度鲜明（赞成利大于弊）。\n- 辩证深入：让步段直击大都市 CBD 实体经济冲击与个人“数字倦怠/边界模糊”，主体段从“生态减排”、“个人身心健康”与“地区平衡发展”三个宏观维度展开，论证气势磅礴。\n- 词汇句法：paradigm shift, social cohesion, municipal coffers, professional socialization, demographic equalizer, exorbitant rents 等高难度搭配信手拈来。',
    keyVocabulary: [
      'proliferation of telecommuting (远程办公的普及)',
      'paradigm shift (范式转变)',
      'erosion of boundaries (边界的侵蚀/模糊)',
      'demographic equalizer (人口与社会结构的均衡器)',
      'work-life equilibrium (工作生活平衡)'
    ]
  },
  {
    id: 'w_task1_line_chart',
    type: 'task1',
    title: 'Renewable Energy Consumption in 4 Nations (2000-2020)',
    category: 'Academic - Line Chart',
    year: '2023-2024',
    source: 'Cambridge 18 Official',
    tags: ['Line Chart', 'Energy', 'Europe'],
    minWords: 150,
    recommendedMinutes: 20,
    prompt: 'The line graph illustrates the percentage of total electricity generated from renewable sources in four European countries—Sweden, Germany, Spain, and the UK—between 2000 and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    chartDescription: 'Line graph showing renewable electricity share: Sweden (38% to 58%), Germany (8% to 42%), Spain (15% to 39%), UK (3% to 35%) from 2000 to 2020.',
    chartSvg: `<svg viewBox="0 0 500 280" className="w-full h-auto bg-slate-50 border border-slate-200 rounded-lg p-3">
      <line x1="50" y1="230" x2="470" y2="230" stroke="#94a3b8" stroke-width="2"/>
      <line x1="50" y1="30" x2="50" y2="230" stroke="#94a3b8" stroke-width="2"/>
      <text x="25" y="40" font-size="11" fill="#64748b">60%</text>
      <text x="25" y="90" font-size="11" fill="#64748b">45%</text>
      <text x="25" y="140" font-size="11" fill="#64748b">30%</text>
      <text x="25" y="190" font-size="11" fill="#64748b">15%</text>
      <text x="35" y="235" font-size="11" fill="#64748b">0%</text>
      <text x="50" y="250" font-size="11" fill="#64748b">2000</text>
      <text x="155" y="250" font-size="11" fill="#64748b">2005</text>
      <text x="260" y="250" font-size="11" fill="#64748b">2010</text>
      <text x="365" y="250" font-size="11" fill="#64748b">2015</text>
      <text x="460" y="250" font-size="11" fill="#64748b">2020</text>
      <!-- Grid lines -->
      <line x1="50" y1="40" x2="470" y2="40" stroke="#e2e8f0" stroke-dasharray="3,3"/>
      <line x1="50" y1="90" x2="470" y2="90" stroke="#e2e8f0" stroke-dasharray="3,3"/>
      <line x1="50" y1="140" x2="470" y2="140" stroke="#e2e8f0" stroke-dasharray="3,3"/>
      <line x1="50" y1="190" x2="470" y2="190" stroke="#e2e8f0" stroke-dasharray="3,3"/>
      <!-- Sweden (Blue) -->
      <polyline fill="none" stroke="#2563eb" stroke-width="3" points="50,110 155,95 260,75 365,55 470,45" />
      <!-- Germany (Emerald) -->
      <polyline fill="none" stroke="#059669" stroke-width="3" points="50,205 155,185 260,150 365,115 470,95" />
      <!-- Spain (Amber) -->
      <polyline fill="none" stroke="#d97706" stroke-width="3" points="50,180 155,160 260,140 365,120 470,105" />
      <!-- UK (Purple) -->
      <polyline fill="none" stroke="#7c3aed" stroke-width="3" points="50,220 155,210 260,180 365,145 470,118" />
    </svg>`,
    sampleBand9: `The line graph details the proportion of electricity produced utilizing renewable sources across four European nations between 2000 and 2020.

Overall, all four countries experienced an upward trajectory over the two-decade span. Sweden consistently generated the greatest share of green electricity throughout the timeframe, while the United Kingdom demonstrated the most rapid relative expansion despite starting from the lowest base.

In 2000, Sweden occupied a dominant position with approximately 38% of its electricity originating from renewables. This figure rose steadily to plateau at nearly 58% by 2020. In stark contrast, the UK commenced the period with a negligible 3%. However, after modest initial growth up to 2005, British renewable generation experienced exponential acceleration, reaching roughly 35% at the conclusion of the survey.

Meanwhile, Germany and Spain exhibited parallel upward trajectories. Spain initially outpaced Germany in 2000 (15% compared to 8%). Nevertheless, by around 2013, rapid German investments enabled it to overtake Spain, with renewable yields reaching approximately 42% in Germany and 39% in Spain by 2020.`,
    sampleAnalysis: '【高分要点解析】\n1. 概括段（Overview）精准提炼出两大宏观特征：所有国家整体上升趋势 + 瑞典始终领先但英国相对涨幅最显著。\n2. 细节段按逻辑分组：第一段写两级极值（最高点瑞典 vs 最低起点英国）；第二段写交替并进的国家（德国与西班牙的交汇与超车）。\n3. 高级同义句型及多变时态表达，包括 upward trajectory, plateau, exponential acceleration, outpace 等。',
    keyVocabulary: [
      'upward trajectory (上升轨迹)',
      'in stark contrast (形成鲜明对比)',
      'plateau at (在...处趋于平稳)',
      'negligible (微不足道的)',
      'exponential acceleration (指数级加速)',
      'outpace (超过；超越)'
    ]
  },
  {
    id: 'w_task2_ai_education',
    type: 'task2',
    title: 'Artificial Intelligence in Education',
    category: 'Technology & Education',
    year: '2024',
    source: 'Cambridge 19 Sample Pool',
    tags: ['AI', 'Education', 'Technology'],
    minWords: 250,
    recommendedMinutes: 40,
    prompt: 'Some people believe that artificial intelligence will soon replace human classroom teachers, while others contend that the interpersonal role of an educator can never be substituted by technology.\n\nDiscuss both views and give your own opinion.',
    sampleBand9: `The unprecedented surge in artificial intelligence has triggered intense debate over the longevity of conventional professions, with classroom teaching being no exception. While technological proponents argue that AI can deliver tailored and infallible instruction at scale, I firmly contend that the affective mentorship and moral guidance provided by human educators remain entirely irreplaceable.

On the one hand, advocates of automated pedagogy emphasize the unparalleled efficiency of intelligent tutoring systems. Unlike human instructors who must cater to thirty diverse students simultaneously, sophisticated algorithmic platforms can evaluate individual cognitive pace and deliver bespoke learning pathways. For instance, adaptive software can instantaneously diagnose conceptual misconceptions in mathematics or linguistics, providing targeted drill exercises without fatigue. Furthermore, automated grading eliminates human subjectivity, while digital tutors are accessible round-the-clock regardless of geographical boundaries. Consequently, in the domain of purely mechanical knowledge transmission, machines undeniably outperform traditional classroom setups.

However, reducing education solely to the ingestion of syllabus content reflects a deeply flawed understanding of human development. Foremost among the limitations of artificial intelligence is its intrinsic inability to provide empathetic mentorship. Great educators do not merely regurgitate curriculum data; they instill resilience, ignite intellectual curiosity, and provide psychological solace when pupils experience academic despair. A computer algorithm cannot sense an adolescent's anxiety through micro-expressions or offer authentic words of encouragement that alter a student's life trajectory. Moreover, collaborative skills, ethical discernment, and critical contemplation are inherently cultivated through organic social interactions within a community of peers guided by a mature human mentor.

In conclusion, whereas artificial intelligence serves as a transformative pedagogical instrument for personalized content delivery, it must be regarded as an augmentative tool rather than an outright replacement. The quintessential human dimensions of compassion, inspiration, and moral stewardship ensure that classroom teachers will remain the indispensable cornerstone of holistic education.`,
    sampleAnalysis: '【考官点评与满分结构剖析】\n- TR (任务回应): 论点清晰，引言段直接亮明观点，主体一段充分展开 AI 在自适应教学上的客观优势，主体二段从人文关怀、心理支持、道德指引多层次深度反驳替换论，结尾精准重申。\n- CC (连贯衔接): 段落采用经典 Topic sentence + Explanation + Concrete Example + Consequence 逻辑闭环；巧妙使用 While, On the one hand, However, Foremost among, Consequently 等逻辑枢纽。\n- LR (词汇资源): 纯正学术词汇层出不穷：bespoke learning pathways, affective mentorship, regurgitate curriculum data, empathetic mentorship, quintessential human dimensions。\n- GRA (语法多样): 倒装句、让步从句、名词性从句与并列分词短语结构严密自然。',
    keyVocabulary: [
      'affective mentorship (情感指导与关怀)',
      'bespoke learning pathways (定制化学习路径)',
      'infallible instruction (准确无误的教学)',
      'regurgitate curriculum data (机械背诵复述课程数据)',
      'quintessential human dimensions (典型的人性维度)',
      'augmentative tool (辅助增益工具)'
    ]
  }
];

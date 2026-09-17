const fs = require('fs');
const path = require('path');

const tasks = [
  // CAMBRIDGE 19
  {
    id: 'w_cam19_t1_ev',
    type: 'task1',
    title: 'Global Electric Vehicle Market Share by Region (2018-2024)',
    category: 'Academic - Bar Chart',
    bankCategory: 'cam19',
    year: '2024-2025',
    source: 'Cambridge IELTS 19 Official Test 1',
    tags: ['Bar Chart', 'Technology', 'Automotive', 'Environment'],
    minWords: 150,
    recommendedMinutes: 20,
    prompt: 'The bar chart illustrates the market share of newly registered electric vehicles (EVs) across four major regions—China, Europe, North America, and Other Nations—in 2018, 2021, and 2024.\\n\\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    chartDescription: 'Bar chart showing EV market share: China (6% in 2018, 16% in 2021, 38% in 2024), Europe (3% in 2018, 18% in 2021, 24% in 2024), North America (2% in 2018, 5% in 2021, 10% in 2024), Other (1% in 2018, 2% in 2021, 5% in 2024).',
    chartSvg: `<svg viewBox="0 0 500 280" class="w-full h-auto bg-slate-50 border border-slate-200 rounded-lg p-3">
      <line x1="50" y1="230" x2="470" y2="230" stroke="#94a3b8" stroke-width="2"/>
      <line x1="50" y1="30" x2="50" y2="230" stroke="#94a3b8" stroke-width="2"/>
      <text x="25" y="40" font-size="11" fill="#64748b">40%</text>
      <text x="25" y="90" font-size="11" fill="#64748b">30%</text>
      <text x="25" y="140" font-size="11" fill="#64748b">20%</text>
      <text x="25" y="190" font-size="11" fill="#64748b">10%</text>
      <text x="35" y="235" font-size="11" fill="#64748b">0%</text>
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
    sampleBand9: `The bar chart delineates the proportion of electric vehicle registrations across four global geographical segments in three designated years: 2018, 2021, and 2024.\\n\\nOverall, all monitored regions underwent noticeable growth in EV adoption over the six-year cycle. China cemented its position as the undisputed frontrunner by 2024, exhibiting the most dramatic surge, whereas adoption rates in North America and the rest of the world expanded at substantially more conservative paces.\\n\\nIn 2018, EV market penetration was marginal across the board, led moderately by China at 6%, with Europe trailing closely behind at 3%, and North America registering a negligible 2%. However, by 2021, both Europe and China underwent exponential upswings, capturing 18% and 16% respectively.\\n\\nOver the subsequent triennium concluding in 2024, China's market share skyrocketed to an unprecedented 38%, more than double its 2021 figure. Concurrently, European growth moderated slightly to peak at 24%. By contrast, North America achieved a modest 10% share, and Other Nations accounted for a mere 5% despite experiencing a fivefold expansion from its baseline.`,
    sampleAnalysis: '【满分图表构架解析】\\n1. 概述段精准揭示宏观全局：全部地区增长 + 中国由领跑转为绝对霸主 + 欧美增速的分化。\\n2. 数据描述层次分明：先概括基准年（2018）普遍偏低，再描述转折点（2021）中欧并进，最后聚焦终局年（2024）中国的爆发式跨越与欧美对比。\\n3. 使用了丰富的学术比率与增速句式：skyrocketed to an unprecedented 38%, exponential upswings, conservative pace, triennium concluding in 2024。',
    keyVocabulary: [
      'market penetration (市场渗透率)',
      'undisputed frontrunner (无可争议的领头羊)',
      'exponential upswings (指数级上升)',
      'subsequent triennium (随后的三年期)',
      'skyrocketed to an unprecedented (暴涨至空前的)'
    ]
  },
  {
    id: 'w_cam19_t2_ai_edu',
    type: 'task2',
    title: 'Artificial Intelligence in Education & Human Mentorship',
    category: 'Technology & Education',
    bankCategory: 'cam19',
    year: '2024',
    source: 'Cambridge IELTS 19 Official Test 2',
    tags: ['AI', 'Education', 'Technology', 'Pedagogy'],
    minWords: 250,
    recommendedMinutes: 40,
    prompt: 'Some people believe that artificial intelligence will soon replace human classroom teachers, while others contend that the interpersonal role of an educator can never be substituted by technology.\\n\\nDiscuss both views and give your own opinion.',
    sampleBand9: `The unprecedented surge in artificial intelligence has triggered intense debate over the longevity of conventional professions, with classroom teaching being no exception. While technological proponents argue that AI can deliver tailored and infallible instruction at scale, I firmly contend that the affective mentorship and moral guidance provided by human educators remain entirely irreplaceable.\\n\\nOn the one hand, advocates of automated pedagogy emphasize the unparalleled efficiency of intelligent tutoring systems. Unlike human instructors who must cater to thirty diverse students simultaneously, sophisticated algorithmic platforms can evaluate individual cognitive pace and deliver bespoke learning pathways. For instance, adaptive software can instantaneously diagnose conceptual misconceptions in mathematics or linguistics, providing targeted drill exercises without fatigue. Furthermore, automated grading eliminates human subjectivity, while digital tutors are accessible round-the-clock regardless of geographical boundaries. Consequently, in the domain of purely mechanical knowledge transmission, machines undeniably outperform traditional classroom setups.\\n\\nHowever, reducing education solely to the ingestion of syllabus content reflects a deeply flawed understanding of human development. Foremost among the limitations of artificial intelligence is its intrinsic inability to provide empathetic mentorship. Great educators do not merely regurgitate curriculum data; they instill resilience, ignite intellectual curiosity, and provide psychological solace when pupils experience academic despair. A computer algorithm cannot sense an adolescent's anxiety through micro-expressions or offer authentic words of encouragement that alter a student's life trajectory. Moreover, collaborative skills, ethical discernment, and critical contemplation are inherently cultivated through organic social interactions within a community of peers guided by a mature human mentor.\\n\\nIn conclusion, whereas artificial intelligence serves as a transformative pedagogical instrument for personalized content delivery, it must be regarded as an augmentative tool rather than an outright replacement. The quintessential human dimensions of compassion, inspiration, and moral stewardship ensure that classroom teachers will remain the indispensable cornerstone of holistic education.`,
    sampleAnalysis: '【考官点评与满分结构剖析】\\n- TR (任务回应): 论点清晰，引言段直接亮明观点，主体一段充分展开 AI 在自适应教学上的客观优势，主体二段从人文关怀、心理支持、道德指引多层次深度反驳替换论，结尾精准重申。\\n- CC (连贯衔接): 段落采用经典 Topic sentence + Explanation + Concrete Example + Consequence 逻辑闭环；巧妙使用 While, On the one hand, However, Foremost among, Consequently 等逻辑枢纽。\\n- LR (词汇资源): 纯正学术词汇层出不穷：bespoke learning pathways, affective mentorship, regurgitate curriculum data, empathetic mentorship, quintessential human dimensions。\\n- GRA (语法多样): 倒装句、让步从句、名词性从句与并列分词短语结构严密自然。',
    keyVocabulary: [
      'affective mentorship (情感指导与关怀)',
      'bespoke learning pathways (定制化学习路径)',
      'infallible instruction (准确无误的教学)',
      'regurgitate curriculum data (机械背诵复述课程数据)',
      'quintessential human dimensions (典型的人性维度)',
      'augmentative tool (辅助增益工具)'
    ]
  },

  // CAMBRIDGE 18
  {
    id: 'w_cam18_t1_energy',
    type: 'task1',
    title: 'Renewable Energy Consumption in 4 Nations (2000-2020)',
    category: 'Academic - Line Chart',
    bankCategory: 'cam18',
    year: '2023-2024',
    source: 'Cambridge IELTS 18 Official Test 1',
    tags: ['Line Chart', 'Energy', 'Europe', 'Sustainability'],
    minWords: 150,
    recommendedMinutes: 20,
    prompt: 'The line graph illustrates the percentage of total electricity generated from renewable sources in four European countries—Sweden, Germany, Spain, and the UK—between 2000 and 2020.\\n\\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    chartDescription: 'Line graph showing renewable electricity share: Sweden (38% to 58%), Germany (8% to 42%), Spain (15% to 39%), UK (3% to 35%) from 2000 to 2020.',
    chartSvg: `<svg viewBox="0 0 500 280" class="w-full h-auto bg-slate-50 border border-slate-200 rounded-lg p-3">
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
      <line x1="50" y1="40" x2="470" y2="40" stroke="#e2e8f0" stroke-dasharray="3,3"/>
      <line x1="50" y1="90" x2="470" y2="90" stroke="#e2e8f0" stroke-dasharray="3,3"/>
      <line x1="50" y1="140" x2="470" y2="140" stroke="#e2e8f0" stroke-dasharray="3,3"/>
      <line x1="50" y1="190" x2="470" y2="190" stroke="#e2e8f0" stroke-dasharray="3,3"/>
      <polyline fill="none" stroke="#2563eb" stroke-width="3" points="50,110 155,95 260,75 365,55 470,45" />
      <polyline fill="none" stroke="#059669" stroke-width="3" points="50,205 155,185 260,150 365,115 470,95" />
      <polyline fill="none" stroke="#d97706" stroke-width="3" points="50,180 155,160 260,140 365,120 470,105" />
      <polyline fill="none" stroke="#7c3aed" stroke-width="3" points="50,220 155,210 260,180 365,145 470,118" />
    </svg>`,
    sampleBand9: `The line graph details the proportion of electricity produced utilizing renewable sources across four European nations between 2000 and 2020.\\n\\nOverall, all four countries experienced an upward trajectory over the two-decade span. Sweden consistently generated the greatest share of green electricity throughout the timeframe, while the United Kingdom demonstrated the most rapid relative expansion despite starting from the lowest base.\\n\\nIn 2000, Sweden occupied a dominant position with approximately 38% of its electricity originating from renewables. This figure rose steadily to plateau at nearly 58% by 2020. In stark contrast, the UK commenced the period with a negligible 3%. However, after modest initial growth up to 2005, British renewable generation experienced exponential acceleration, reaching roughly 35% at the conclusion of the survey.\\n\\nMeanwhile, Germany and Spain exhibited parallel upward trajectories. Spain initially outpaced Germany in 2000 (15% compared to 8%). Nevertheless, by around 2013, rapid German investments enabled it to overtake Spain, with renewable yields reaching approximately 42% in Germany and 39% in Spain by 2020.`,
    sampleAnalysis: '【高分要点解析】\\n1. 概括段（Overview）精准提炼出两大宏观特征：所有国家整体上升趋势 + 瑞典始终领先但英国相对涨幅最显著。\\n2. 细节段按逻辑分组：第一段写两级极值（最高点瑞典 vs 最低起点英国）；第二段写交替并进的国家（德国与西班牙的交汇与超车）。\\n3. 高级同义句型及多变时态表达，包括 upward trajectory, plateau, exponential acceleration, outpace 等。',
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
    id: 'w_cam18_t2_space',
    type: 'task2',
    title: 'Space Exploration Funding vs Terrestrial Challenges',
    category: 'Science & Public Expenditure',
    bankCategory: 'cam18',
    year: '2023',
    source: 'Cambridge IELTS 18 Official Test 2',
    tags: ['Space', 'Government Budget', 'Science', 'Poverty'],
    minWords: 250,
    recommendedMinutes: 40,
    prompt: 'Some people believe that governments should spend billions of dollars on space exploration, while others argue that these vast financial resources should be directed toward resolving urgent terrestrial problems such as poverty and climate change.\\n\\nDiscuss both views and give your own opinion.',
    sampleBand9: `The exorbitant fiscal allocations devoted to astrophysical expeditions and lunar colonization have sparked contentious debate. While critics maintain that funding space exploration is an unconscionable indulgence in the face of immediate humanitarian and environmental emergencies on Earth, I am convinced that space science yields technological and ecological dividends that are fundamentally indispensable for safeguarding our planet\'s future.\\n\\nOn the one hand, opponents of aerospace expenditure present an intuitively compelling argument grounded in moral urgency. Millions of individuals across developing nations still endure severe food insecurity, lack potable water, and suffer from treatable diseases due to underfunded healthcare systems. Concurrently, global climate change is causing catastrophic droughts and sea-level rise, necessitating astronomical capital investments in flood barriers, reforestation, and renewable energy grids. From this perspective, diverting billions toward distant planetary exploration appears irresponsible when fundamental human survival on our home planet is in jeopardy.\\n\\nNevertheless, categorizing space science as disconnected from terrestrial welfare represents a profound misconception. Historically, breakthroughs conceived for outer-space conditions have revolutionized everyday life on Earth. Satellite infrastructure developed by space agencies is the very backbone of modern climate science, facilitating real-time monitoring of polar ice shrinkage, deforestation rates, and extreme meteorological phenomena. Furthermore, photovoltaic panels, advanced water-purification membranes, and lightweight composites all originated from aerospace engineering. Ultimately, humanity cannot afford a zero-sum mentality: solving terrestrial dilemmas requires the technological innovations born of frontier space exploration.\\n\\nIn conclusion, although the immediate alleviation of poverty and ecological distress demands urgent governmental priority, starving space exploration of funding would be myopic. Investing in cosmic discovery actively generates the analytical tools and sustainable technologies required to heal our own planet.`,
    sampleAnalysis: '【考官点评与满分结构剖析】\\n- TR: 严谨讨论双方立场。充分剖析地球现实苦难（贫困、饥荒、气候灾害）的现实性，随后通过“航天技术对地球的反哺（卫星气象、净水膜、太阳能板）”进行有力反驳，展现卓越辩证思维。\\n- CC: 句子间逻辑严丝合缝，过渡词如 an intuitively compelling argument, from this perspective, nevertheless, categorizing... as... naturally推进论证。\\n- LR: unconscionable indulgence, fiscal allocations, astrological capital investments, zero-sum mentality, myopic等高阶用词极其考究。\\n- GRA: 复合长句丰富，虚拟条件、动名词主语与非谓语结构运用自然流畅。',
    keyVocabulary: [
      'exorbitant fiscal allocations (过度的财政预算分配)',
      'unconscionable indulgence (不合道义的奢华放任)',
      'grounded in moral urgency (立足于道德紧迫性)',
      'in jeopardy (处于危难之中)',
      'zero-sum mentality (零和博弈思维)',
      'myopic (短视的；目光短浅的)'
    ]
  },

  // CAMBRIDGE 17
  {
    id: 'w_cam17_t1_desalination',
    type: 'task1',
    title: 'Industrial Seawater Desalination Process (Reverse Osmosis)',
    category: 'Academic - Process Diagram',
    bankCategory: 'cam17',
    year: '2022-2023',
    source: 'Cambridge IELTS 17 Official Test 1',
    tags: ['Process Diagram', 'Water Treatment', 'Engineering'],
    minWords: 150,
    recommendedMinutes: 20,
    prompt: 'The diagram shows the sequential stages involved in the desalination process to convert seawater into safe drinking water for municipal use.\\n\\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    chartDescription: 'Process diagram illustrating 5 stages: 1. Seawater intake & Pre-filtration -> 2. High-Pressure Pump -> 3. Reverse Osmosis Semi-permeable Membrane -> 4. Post-Treatment Mineral Remineralization & Disinfection -> 5. Municipal Reservoir Storage & Brine Discharge.',
    chartSvg: `<svg viewBox="0 0 520 260" class="w-full h-auto bg-slate-50 border border-slate-200 rounded-lg p-3">
      <!-- Step 1: Intake -->
      <rect x="20" y="50" width="80" height="60" rx="6" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2"/>
      <text x="60" y="75" font-size="10" font-weight="bold" text-anchor="middle" fill="#1e3a8a">1. Intake &amp;</text>
      <text x="60" y="90" font-size="10" font-weight="bold" text-anchor="middle" fill="#1e3a8a">Screening</text>
      <!-- Arrow -->
      <path d="M100 80 L125 80" stroke="#3b82f6" stroke-width="2"/>

      <!-- Step 2: High Pressure Pump -->
      <rect x="125" y="50" width="80" height="60" rx="6" fill="#fed7aa" stroke="#f97316" stroke-width="2"/>
      <text x="165" y="75" font-size="10" font-weight="bold" text-anchor="middle" fill="#7c2d12">2. Pressure</text>
      <text x="165" y="90" font-size="10" font-weight="bold" text-anchor="middle" fill="#7c2d12">Pumping</text>
      <!-- Arrow -->
      <path d="M205 80 L230 80" stroke="#f97316" stroke-width="2"/>

      <!-- Step 3: Membrane Vessel -->
      <rect x="230" y="40" width="90" height="80" rx="8" fill="#bbf7d0" stroke="#16a34a" stroke-width="2"/>
      <line x1="275" y1="40" x2="275" y2="120" stroke="#16a34a" stroke-dasharray="4,4" stroke-width="2"/>
      <text x="275" y="70" font-size="10" font-weight="bold" text-anchor="middle" fill="#14532d">3. Reverse</text>
      <text x="275" y="85" font-size="10" font-weight="bold" text-anchor="middle" fill="#14532d">Osmosis</text>
      <text x="275" y="100" font-size="8" text-anchor="middle" fill="#15803d">Membrane</text>

      <!-- Brine discharge downward -->
      <path d="M275 120 L275 170 L200 170" stroke="#ef4444" stroke-width="2"/>
      <rect x="110" y="150" width="90" height="40" rx="4" fill="#fee2e2" stroke="#ef4444" stroke-width="1.5"/>
      <text x="155" y="167" font-size="9" font-weight="bold" text-anchor="middle" fill="#991b1b">Concentrated</text>
      <text x="155" y="180" font-size="9" font-weight="bold" text-anchor="middle" fill="#991b1b">Brine Exit</text>

      <!-- Fresh water forward -->
      <path d="M320 80 L345 80" stroke="#16a34a" stroke-width="2"/>

      <!-- Step 4: Mineralization -->
      <rect x="345" y="50" width="80" height="60" rx="6" fill="#e9d5ff" stroke="#a855f7" stroke-width="2"/>
      <text x="385" y="75" font-size="10" font-weight="bold" text-anchor="middle" fill="#581c87">4. Mineralize</text>
      <text x="385" y="90" font-size="10" font-weight="bold" text-anchor="middle" fill="#581c87">&amp; Disinfect</text>
      <!-- Arrow -->
      <path d="M425 80 L450 80" stroke="#a855f7" stroke-width="2"/>

      <!-- Step 5: Distribution -->
      <rect x="450" y="45" width="60" height="70" rx="6" fill="#cffafe" stroke="#06b6d4" stroke-width="2"/>
      <text x="480" y="75" font-size="10" font-weight="bold" text-anchor="middle" fill="#164e63">5. City</text>
      <text x="480" y="90" font-size="10" font-weight="bold" text-anchor="middle" fill="#164e63">Water</text>
      <text x="480" y="103" font-size="9" text-anchor="middle" fill="#0891b2">Grid</text>
    </svg>`,
    sampleBand9: `The schematic illustration demonstrates the multi-stage linear process through which raw seawater is purified and converted into potable water suitable for urban household consumption.\\n\\nOverall, the desalination process comprises five distinct consecutive phases: initial physical screening, high-pressure compression, reverse osmosis separation, chemical remineralization and disinfection, and eventual distribution to the municipal water supply, yielding both purified water and hyper-saline brine discharge.\\n\\nIn the inaugural stage, raw water is extracted from the ocean and directed through pre-filtration screens to eliminate coarse debris, seaweed, and sand particles. Following this preliminary cleansing, the saline liquid enters high-pressure pumps designed to generate substantial hydraulic force.\\n\\nThe pressurized water is subsequently forced into reverse osmosis containment vessels equipped with microscopic semi-permeable membranes. At this pivotal juncture, the stream bifurcates: concentrated brine and mineral salts are rejected and piped back into the sea, while demineralized fresh water permeates through the microscopic pores. Finally, the permeated water is enriched with essential mineral compounds and treated with chlorine for disinfection before being pumped into the municipal reservoir for domestic distribution.`,
    sampleAnalysis: '【流程图高分要点解析】\\n1. 概括段（Overview）提纲挈领：说明工序的总步数（五大连续阶段）以及产物（饮用水与浓盐水排海）。\\n2. 语态与衔接词：熟练运用被动语态（is extracted, is forced into, is enriched）凸显客观科技属性；使用 sequential markers（In the inaugural stage, Following this preliminary cleansing, At this pivotal juncture, Finally）使行文行云流水。\\n3. 专业词汇精准：semi-permeable membranes, stream bifurcates, hyper-saline brine, remineralization。',
    keyVocabulary: [
      'potable water (适宜饮用的水)',
      'hyper-saline brine (高浓度盐水/卤水)',
      'semi-permeable membrane (半透膜)',
      'bifurcates (一分为二；分流)',
      'remineralization (重新矿化)',
      'inaugural stage (起始阶段)'
    ]
  },
  {
    id: 'w_cam17_t2_traffic',
    type: 'task2',
    title: 'Urban Traffic Congestion: Road Expansion vs Public Transport',
    category: 'Urban Planning & Transport',
    bankCategory: 'cam17',
    year: '2022',
    source: 'Cambridge IELTS 17 Official Test 2',
    tags: ['Traffic', 'Urban Planning', 'Public Transit', 'Infrastructure'],
    minWords: 250,
    recommendedMinutes: 40,
    prompt: 'In many megacities, traffic congestion has reached intolerable levels. Some people suggest that constructing more highways and widening existing roads is the most effective solution, while others argue that investing heavily in public transport systems is far superior.\\n\\nDiscuss both views and give your own opinion.',
    sampleBand9: `The acute gridlock plaguing metropolitan centers worldwide has precipitated urgent deliberations regarding optimal infrastructural remedies. While proponents of highway expansion argue that increasing vehicular throughput directly alleviates bottlenecks, I am convinced that aggressive investment in mass public transit is an incomparably more sustainable and enduring solution.\\n\\nOn the one hand, advocating for roadway construction appears to offer an intuitive quick fix. Proponents maintain that adding express lanes and flyovers expands physical asphalt capacity, thereby diffusing localized traffic jams during rush hours. In rapidly expanding urban fringes where population decentralization precedes railway planning, upgraded arterial highways can facilitate industrial logistics and accommodate private commuters who lack nearby transit options. Consequently, governments often view highway broadening as a tangible, high-visibility countermeasure to traffic paralysis.\\n\\nHowever, civil engineering history consistently proves that road building creates an inescapable urban planning trap known as 'induced demand'. When new lanes are opened, previously deterred motorists are incentivized to drive, ultimately replenishing and surpassing prior congestion levels within months. Furthermore, paving more tarmac exacerbates urban heat island effects and escalates vehicular fossil-fuel emissions. In contrast, developing comprehensive mass transit networks—encompassing subterranean subways, light rail, and zero-emission bus rapid transit (BRT)—addresses the root cause of congestion. A solitary commuter train can displace over a thousand passenger vehicles, drastically reducing road occupancy while offering punctual, affordable mobility for all socio-economic strata.\\n\\nIn conclusion, while road improvements may provide transient localized relief in suburban corridors, relying on tarmac expansion is fundamentally self-defeating. Only a paradigm shift toward electrified, high-capacity public transportation can liberate modern cities from chronic vehicular paralysis and ecological degradation.`,
    sampleAnalysis: '【考官点评与满分结构剖析】\\n- TR: 双方论点深入探讨。主体一段肯定了公路扩建在郊区物流与短期分流的直观价值；主体二段引入城市规划核心理论“诱导需求（induced demand）”，深入揭示越修路越堵的本质缺陷，并有力论证大运量轨道交通的替代乘数效应。\\n- CC: 逻辑链极度致密，概念自然递进（induced demand -> tarmac heat island -> train passenger capacity displacement）。\\n- LR: acute gridlock, vehicular throughput, induced demand, arterial highways, subterranean subways, self-defeating 等地道学术表达。\\n- GRA: 状语从句倒装与分词短语自如穿插。',
    keyVocabulary: [
      'acute gridlock (严重的交通瘫痪/大堵车)',
      'vehicular throughput (机动车通行量)',
      'induced demand (诱导性交通需求)',
      'arterial highways (城市主干道)',
      'self-defeating (适得其反的；弄巧成拙的)',
      'paradigm shift (范式转移)'
    ]
  },

  // 2025/2026 CDI RECENT RECALLS
  {
    id: 'w_cdi_t1_campus_map',
    type: 'task1',
    title: 'University Campus Layout Evolution (2015 vs 2025)',
    category: 'Academic - Map Comparison',
    bankCategory: 'cdi_recent',
    year: '2025-2026',
    source: '2025-2026 CDI Machine Exam Pool',
    tags: ['Map', 'Campus', 'Urban Planning', 'Modernization'],
    minWords: 150,
    recommendedMinutes: 20,
    prompt: 'The maps show the layout of an Australian university campus in 2015 and its reconstructed configuration in 2025 following a decade of modernization.\\n\\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    chartDescription: 'Map comparison: In 2015, the campus was divided by a central road with private car parking, old lecture halls, and open grassland. In 2025, the central road was converted to a pedestrian boulevard, a light rail station was built on the east, a modern STEM complex replaced old halls, and green solar rooftop gardens were added.',
    chartSvg: `<svg viewBox="0 0 520 280" class="w-full h-auto bg-slate-50 border border-slate-200 rounded-lg p-3">
      <!-- 2015 Map (Left) -->
      <rect x="10" y="30" width="235" height="230" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="127" y="22" font-size="12" font-weight="bold" text-anchor="middle" fill="#334155">2015 Campus Layout</text>
      <line x1="20" y1="145" x2="235" y2="145" stroke="#94a3b8" stroke-width="8"/>
      <text x="127" y="148" font-size="8" fill="#ffffff" font-weight="bold" text-anchor="middle">Car Traffic Road</text>
      <rect x="30" y="50" width="70" height="50" fill="#cbd5e1" rx="4"/>
      <text x="65" y="78" font-size="9" text-anchor="middle" fill="#334155">Old Lecture</text>
      <rect x="130" y="50" width="80" height="60" fill="#93c5fd" rx="4"/>
      <text x="170" y="85" font-size="10" font-weight="bold" text-anchor="middle" fill="#1e3a8a">Library</text>
      <rect x="30" y="180" width="80" height="50" fill="#fecaca" rx="4"/>
      <text x="70" y="210" font-size="10" text-anchor="middle" fill="#991b1b">Car Park</text>
      <rect x="140" y="180" width="70" height="50" fill="#bbf7d0" rx="4"/>
      <text x="175" y="210" font-size="10" text-anchor="middle" fill="#166534">Grassland</text>

      <!-- 2025 Map (Right) -->
      <rect x="275" y="30" width="235" height="230" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="392" y="22" font-size="12" font-weight="bold" text-anchor="middle" fill="#0284c7">2025 Modernized Campus</text>
      <line x1="285" y1="145" x2="500" y2="145" stroke="#38bdf8" stroke-width="10"/>
      <text x="392" y="149" font-size="8" fill="#ffffff" font-weight="bold" text-anchor="middle">Pedestrian Walkway</text>
      <rect x="290" y="50" width="80" height="60" fill="#a7f3d0" rx="4"/>
      <text x="330" y="78" font-size="9" font-weight="bold" text-anchor="middle" fill="#065f46">STEM Hub &amp;</text>
      <text x="330" y="92" font-size="8" text-anchor="middle" fill="#065f46">Laboratories</text>
      <rect x="390" y="45" width="95" height="70" fill="#60a5fa" rx="4"/>
      <text x="437" y="80" font-size="9" font-weight="bold" text-anchor="middle" fill="#ffffff">Expanded</text>
      <text x="437" y="95" font-size="9" font-weight="bold" text-anchor="middle" fill="#ffffff">Library</text>
      <rect x="290" y="180" width="90" height="50" fill="#fed7aa" rx="4"/>
      <text x="335" y="210" font-size="9" font-weight="bold" text-anchor="middle" fill="#9a3412">Student Center</text>
      <rect x="410" y="180" width="85" height="50" fill="#e9d5ff" rx="4"/>
      <text x="452" y="205" font-size="9" font-weight="bold" text-anchor="middle" fill="#6b21a8">Light Rail</text>
      <text x="452" y="218" font-size="8" text-anchor="middle" fill="#6b21a8">Station</text>
    </svg>`,
    sampleBand9: `The two chronological maps illustrate the spatial reconfiguration of an Australian university campus across a ten-year duration between 2015 and 2025.\\n\\nOverall, the campus witnessed a radical metamorphosis characterized by complete pedestrianization, the eradication of private motor vehicle access, and the substitution of outdated infrastructure with state-of-the-art academic and transit facilities.\\n\\nIn 2015, the campus was bisected horizontally by a primary asphalt roadway catering to car traffic, with an open-air car park situated in the south-western quadrant. Academic spaces were comparatively modest, consisting of an older lecture hall on the north-west and an adjacent library to the east, while the south-eastern sector was dominated by unoccupied grassland.\\n\\nBy 2025, drastic modifications were instituted. The central thoroughfare was thoroughly repaved as a tree-lined pedestrian boulevard, rendering the entire campus car-free. The south-western vehicular park was demolished to make way for a multi-functional student amenities center, while the grassland on the south-east was repurposed into a direct-link light rail transit terminal. In the northern zone, the outdated lecture facility was superseded by an expansive STEM research hub, and the existing library received substantial spatial expansion.`,
    sampleAnalysis: '【地图对比满分解析】\\n1. 概括段（Overview）立意高远：总结出全面步行化（complete pedestrianization）、驱除私家车（eradication of motor access）与设施现代化替换（substitution with state-of-the-art facilities）。\\n2. 方位词与时态运用精湛：bisected horizontally, south-western quadrant, south-eastern sector; was demolished, was superseded by, received substantial expansion。\\n3. 高端动词替换：metamorphosis, bisected, repurposed into, superseded by。',
    keyVocabulary: [
      'radical metamorphosis (彻底蜕变/改造)',
      'pedestrianization (步行街化/无车化)',
      'bisected horizontally (横向一分为二)',
      'quadrant (象限；区域)',
      'superseded by (被...所替代)',
      'repurposed into (改造重用为...)'
    ]
  },
  {
    id: 'w_cdi_t2_remote_work',
    type: 'task2',
    title: 'Remote Working and Urban Decentralization',
    category: 'Society & Employment',
    bankCategory: 'cdi_recent',
    year: '2025-2026',
    source: '2025-2026 CDI Machine Exam Pool',
    tags: ['Workplace', 'Urbanization', 'Technology', 'Quality of Life'],
    minWords: 250,
    recommendedMinutes: 40,
    prompt: 'In many countries, an increasing number of professionals are opting to work remotely from home rather than commute to central business district offices.\\n\\nDo the advantages of this trend outweigh the disadvantages for individuals and society as a whole?',
    sampleBand9: `The proliferation of telecommuting platforms has catalyzed a paradigm shift in modern employment, with millions of white-collar workers abandoning daily commutes to central business districts in favor of remote home setups. In my assessment, although this decentralization presents distinct challenges regarding social cohesion and urban commercial ecosystems, its profound merits in environmental sustainability, worker autonomy, and regional equilibrium vastly outweigh the drawbacks.\\n\\nOn the one hand, remote work is not devoid of societal and personal repercussion. The primary casualty of this shift is the commercial fabric of metropolitan hubs. High-density central business districts traditionally rely on a continuous influx of office workers to sustain transit systems, hospitality venues, and retail shops; widespread absenteeism precipitates financial strain on municipal coffers and service workers. Furthermore, on an individual psychological level, the erosion of physical boundaries between professional responsibilities and domestic life can engender chronic overwork, digital fatigue, and profound sensations of professional isolation, particularly for novice employees deprived of informal workplace socialization.\\n\\nNevertheless, the macroscopic and personal advantages are far more compelling. Most noticeably, eliminating the grueling daily commute yields immense dividends for individual well-being and ecological preservation. Commuters save hundreds of hours annually, resulting in enhanced physical rest, healthier diets, and expanded leisure with family. Concurrently, the reduction in vehicular congestion noticeably diminishes vehicular carbon emissions and smog in megacities. More fundamentally, remote working acts as a powerful demographic equalizer: highly skilled professionals are no longer coerced into paying exorbitant metropolitan rents, thereby injecting disposable income and entrepreneurial vitality into regional towns and rural communities.\\n\\nIn conclusion, while telecommuting requires structural adaptation to revitalize metropolitan centers and protect workers from digital burnout, its benefits in mitigating urban sprawl, cutting transport emissions, and restoring work-life equilibrium render it an overwhelmingly positive societal evolution.`,
    sampleAnalysis: '【考官点评与范文剖析】\\n- 题型审题：Do the advantages outweigh the disadvantages（利弊权衡题），范文立场极度鲜明（赞成利大于弊）。\\n- 辩证深入：让步段直击大都市 CBD 实体经济冲击与个人“数字倦怠/边界模糊”，主体段从“生态减排”、“个人身心健康”与“地区平衡发展”三个宏观维度展开，论证气势磅礴。\n- 词汇句法：paradigm shift, social cohesion, municipal coffers, professional socialization, demographic equalizer, exorbitant rents 等高难度搭配信手拈来。',
    keyVocabulary: [
      'proliferation of telecommuting (远程办公的普及)',
      'paradigm shift (范式转变)',
      'erosion of boundaries (边界的侵蚀/模糊)',
      'demographic equalizer (人口与社会结构的均衡器)',
      'work-life equilibrium (工作生活平衡)'
    ]
  }
];

const fileContent = `import { WritingTask } from '../types/ielts';

export const WRITING_TASKS: WritingTask[] = ` + JSON.stringify(tasks, null, 2) + `;\n`;

const outputPath = path.join(__dirname, '../src/data/writingTasks.ts');
fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log('Successfully wrote', tasks.length, 'writing tasks to', outputPath);

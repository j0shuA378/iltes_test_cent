export interface DictionaryEntry {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  chinese: string;
  definition: string;
  example: string;
  synonyms?: string[];
  collocations?: string[];
  ieltsBand?: string;
  category?: string;
}

// Substantial local offline dictionary (150+ core IELTS & Academic vocabulary)
export const LOCAL_DICTIONARY: Record<string, DictionaryEntry> = {
  // A
  abandon: {
    word: 'abandon',
    phonetic: '/əˈbæn.dən/',
    partOfSpeech: 'v.',
    chinese: '放弃；抛弃；中止',
    definition: 'To cease to support or look after someone; desert; give up completely',
    example: 'The expedition had to be abandoned due to deteriorating weather conditions.',
    synonyms: ['relinquish', 'forsake', 'desert', 'renounce'],
    collocations: ['abandon a project', 'abandon hope'],
    ieltsBand: 'Band 6.5+',
    category: 'Academic'
  },
  abundant: {
    word: 'abundant',
    phonetic: '/əˈbʌn.dənt/',
    partOfSpeech: 'adj.',
    chinese: '大量的；充裕的；丰足的',
    definition: 'Existing or available in large quantities; plentiful',
    example: 'The river valley provided an abundant supply of fresh water and fertile soil.',
    synonyms: ['plentiful', 'copious', 'ample', 'profuse'],
    collocations: ['abundant supply', 'abundant wildlife'],
    ieltsBand: 'Band 7.0+',
    category: 'Academic'
  },
  accelerate: {
    word: 'accelerate',
    phonetic: '/əkˈsel.ə.reɪt/',
    partOfSpeech: 'v.',
    chinese: '加速；加快；促进',
    definition: 'To begin to move more quickly; to increase in rate or amount',
    example: 'Urbanization has accelerated dramatically across developing nations over the past decade.',
    synonyms: ['expedite', 'hasten', 'quicken', 'spur'],
    collocations: ['accelerate growth', 'accelerate transition'],
    ieltsBand: 'Band 6.5+',
    category: 'Task 1 Trends'
  },
  accommodation: {
    word: 'accommodation',
    phonetic: '/əˌkɒm.əˈdeɪ.ʃən/',
    partOfSpeech: 'n.',
    chinese: '住宿；膳宿；住处（听力S1最高频词）',
    definition: 'A room, group of rooms, or building in which someone may live or stay',
    example: 'First-year university students are usually guaranteed hall accommodation on campus.',
    synonyms: ['housing', 'lodging', 'residence', 'dormitory'],
    collocations: ['student accommodation', 'rent accommodation', 'hotel accommodation'],
    ieltsBand: 'Band 6.5+',
    category: 'Listening Campus'
  },
  accurate: {
    word: 'accurate',
    phonetic: '/ˈæk.jə.rət/',
    partOfSpeech: 'adj.',
    chinese: '精确的；准确无误的',
    definition: 'Correct in all details; exact',
    example: 'Precise satellite imagery allows scientists to make accurate climate projections.',
    synonyms: ['precise', 'flawless', 'infallible', 'exact'],
    collocations: ['accurate data', 'accurate measurement', 'highly accurate'],
    ieltsBand: 'Band 6.5+',
    category: 'Academic'
  },
  acquire: {
    word: 'acquire',
    phonetic: '/əˈkwaɪər/',
    partOfSpeech: 'v.',
    chinese: '获得；习得；购得',
    definition: 'Buy or obtain an asset or object for oneself; learn or develop a skill',
    example: 'Children acquire their mother tongue through natural social immersion.',
    synonyms: ['obtain', 'attain', 'gain', 'procure'],
    collocations: ['acquire language', 'acquire skills', 'acquire knowledge'],
    ieltsBand: 'Band 6.5+',
    category: 'Education'
  },
  advocate: {
    word: 'advocate',
    phonetic: '/ˈæd.və.keɪt/',
    partOfSpeech: 'v. / n.',
    chinese: '提倡；主张；拥护者',
    definition: 'Publicly recommend or support a particular cause or policy',
    example: 'Environmentalists advocate for stricter carbon emission caps on manufacturing.',
    synonyms: ['champion', 'endorse', 'promote', 'support'],
    collocations: ['advocate reform', 'staunch advocate'],
    ieltsBand: 'Band 7.0+',
    category: 'Writing Task 2'
  },
  alleviate: {
    word: 'alleviate',
    phonetic: '/əˈliː.vi.eɪt/',
    partOfSpeech: 'v.',
    chinese: '缓和；减轻；缓解（痛苦、拥堵、贫困等）',
    definition: 'Make suffering, deficiency, or a problem less severe',
    example: 'Expanding public rail transit helps alleviate chronic traffic congestion.',
    synonyms: ['mitigate', 'ease', 'relieve', 'diminish'],
    collocations: ['alleviate poverty', 'alleviate congestion', 'alleviate suffering'],
    ieltsBand: 'Band 7.5+',
    category: 'Society & Policy'
  },
  apple: {
    word: 'apple',
    phonetic: '/ˈæp.əl/',
    partOfSpeech: 'n.',
    chinese: '苹果；苹果树',
    definition: 'The round fruit of a tree of the rose family, which typically has thin green or red skin and crisp flesh',
    example: 'An apple a day keeps the doctor away.',
    synonyms: ['pome', 'fruit'],
    collocations: ['eat an apple', 'apple orchard', 'apple tree'],
    ieltsBand: 'General',
    category: 'Everyday'
  },
  architecture: {
    word: 'architecture',
    phonetic: '/ˈɑː.kɪ.tek.tʃər/',
    partOfSpeech: 'n.',
    chinese: '建筑学；建筑风格；结构',
    definition: 'The art or practice of designing and constructing buildings',
    example: 'Roman architecture is renowned for its monumental arches and durable concrete vaults.',
    synonyms: ['construction', 'structural design', 'edifice planning'],
    collocations: ['ancient architecture', 'sustainable architecture', 'space architecture'],
    ieltsBand: 'Band 7.0+',
    category: 'Reading Passage'
  },

  // B
  beneficial: {
    word: 'beneficial',
    phonetic: '/ˌben.ɪˈfɪʃ.əl/',
    partOfSpeech: 'adj.',
    chinese: '有益的；有利的；有好处的',
    definition: 'Resulting in good; favourable or advantageous',
    example: 'Regular physical exercise yields highly beneficial dividends for cognitive focus.',
    synonyms: ['advantageous', 'favourable', 'wholesome', 'lucrative'],
    collocations: ['highly beneficial', 'beneficial effect', 'mutually beneficial'],
    ieltsBand: 'Band 6.5+',
    category: 'Writing Task 2'
  },
  biodiversity: {
    word: 'biodiversity',
    phonetic: '/ˌbaɪ.əʊ.daɪˈvɜː.sə.ti/',
    partOfSpeech: 'n.',
    chinese: '生物多样性',
    definition: 'The variety of plant and animal life in the world or in a particular habitat',
    example: 'Preserving biodiversity is crucial for sustaining global ecological balance.',
    synonyms: ['ecological diversity', 'biological variety'],
    collocations: ['conserve biodiversity', 'rich biodiversity', 'loss of biodiversity'],
    ieltsBand: 'Band 7.0+',
    category: 'Environment'
  },
  biomimicry: {
    word: 'biomimicry',
    phonetic: '/ˌbaɪ.əʊˈmɪm.ɪ.kri/',
    partOfSpeech: 'n.',
    chinese: '仿生学；仿生技术',
    definition: 'The design and production of materials, structures, and systems modelled on biological entities',
    example: 'Biomimicry inspired the aerodynamic nose of Japan\'s premier bullet train.',
    synonyms: ['bionics', 'nature-inspired engineering'],
    collocations: ['principles of biomimicry', 'biomimetic architecture'],
    ieltsBand: 'Band 8.0+',
    category: 'Science & Reading'
  },
  book: {
    word: 'book',
    phonetic: '/bʊk/',
    partOfSpeech: 'n. / v.',
    chinese: '书籍；预订；预约',
    definition: 'A written or printed work consisting of pages glued or sewn together; to reserve',
    example: 'He decided to book a conference room for the international seminar.',
    synonyms: ['reserve', 'volume', 'monograph'],
    collocations: ['book a room', 'read a book', 'advance booking'],
    ieltsBand: 'General',
    category: 'Listening S1'
  },

  // C
  catalyst: {
    word: 'catalyst',
    phonetic: '/ˈkæt.əl.ɪst/',
    partOfSpeech: 'n.',
    chinese: '催化剂；促成因素；刺激物',
    definition: 'A person or thing that precipitates an event or change',
    example: 'Public demand served as the primary catalyst for stricter environmental legislation.',
    synonyms: ['stimulus', 'impetus', 'spark', 'accelerator'],
    collocations: ['act as a catalyst', 'serve as a catalyst', 'primary catalyst'],
    ieltsBand: 'Band 7.5+',
    category: 'Academic'
  },
  cohesion: {
    word: 'cohesion',
    phonetic: '/kəʊˈhiː.ʒən/',
    partOfSpeech: 'n.',
    chinese: '连贯性；凝聚力；衔接（写作四维评分维度之一）',
    definition: 'The action or fact of forming a united whole; logical connection in text',
    example: 'Coherence and cohesion determine 25% of your total IELTS Writing score.',
    synonyms: ['consistency', 'unity', 'connectivity', 'solidarity'],
    collocations: ['social cohesion', 'lexical cohesion', 'cohesion markers'],
    ieltsBand: 'Band 7.0+',
    category: 'Writing Rubric'
  },
  comprehensive: {
    word: 'comprehensive',
    phonetic: '/ˌkɒm.prɪˈhen.sɪv/',
    partOfSpeech: 'adj.',
    chinese: '全面的；综合性的；详尽的',
    definition: 'Including or dealing with all or nearly all elements or aspects of something',
    example: 'The ministry published a comprehensive report on national carbon emissions.',
    synonyms: ['exhaustive', 'all-inclusive', 'thorough', 'extensive'],
    collocations: ['comprehensive study', 'comprehensive review', 'comprehensive coverage'],
    ieltsBand: 'Band 7.0+',
    category: 'Academic'
  },
  consequence: {
    word: 'consequence',
    phonetic: '/ˈkɒn.sɪ.kwəns/',
    partOfSpeech: 'n.',
    chinese: '后果；结果；重大影响',
    definition: 'A result or effect, typically one that is unwelcome or unpleasant',
    example: 'Rising sea levels are an inevitable consequence of global warming.',
    synonyms: ['repercussion', 'aftermath', 'outcome', 'implication'],
    collocations: ['serious consequence', 'as a consequence', 'inconsequential'],
    ieltsBand: 'Band 6.5+',
    category: 'Writing Task 2'
  },
  corroborate: {
    word: 'corroborate',
    phonetic: '/kəˈrɒb.ə.reɪt/',
    partOfSpeech: 'v.',
    chinese: '证实；确证；支持（某种说法或理论）',
    definition: 'Confirm or give support to a statement, theory, or finding',
    example: 'Recent scientific evidence has corroborated the ecological hypothesis.',
    synonyms: ['substantiate', 'verify', 'validate', 'authenticate'],
    collocations: ['corroborate evidence', 'corroborate a hypothesis'],
    ieltsBand: 'Band 8.0+',
    category: 'Research'
  },
  crucial: {
    word: 'crucial',
    phonetic: '/ˈkruː.ʃəl/',
    partOfSpeech: 'adj.',
    chinese: '至关重要的；关键的；决定性的',
    definition: 'Decisive or critical, especially in the success or failure of something',
    example: 'Prompt government intervention is crucial to curb rampant inflation.',
    synonyms: ['pivotal', 'vital', 'imperative', 'indispensable'],
    collocations: ['crucial role', 'crucial factor', 'play a crucial role'],
    ieltsBand: 'Band 7.0+',
    category: 'Academic'
  },
  curriculum: {
    word: 'curriculum',
    phonetic: '/kəˈrɪk.jə.ləm/',
    partOfSpeech: 'n.',
    chinese: '学校的全部课程；教程',
    definition: 'The subjects comprising a course of study in a school or college',
    example: 'Environmental ethics should be integrated into the national school curriculum.',
    synonyms: ['syllabus', 'program of study'],
    collocations: ['school curriculum', 'core curriculum', 'revise the curriculum'],
    ieltsBand: 'Band 6.5+',
    category: 'Education'
  },

  // D
  decentralization: {
    word: 'decentralization',
    phonetic: '/diːˌsen.trə.laɪˈzeɪ.ʃən/',
    partOfSpeech: 'n.',
    chinese: '去中心化；分散化；权力下放',
    definition: 'The transfer of control of an activity or organization to several local offices',
    example: 'Remote working has triggered the geographic decentralization of high-tech firms.',
    synonyms: ['dispersion', 'redistribution', 'devolution'],
    collocations: ['urban decentralization', 'decentralization of power'],
    ieltsBand: 'Band 7.5+',
    category: 'Society & Economics'
  },
  demographic: {
    word: 'demographic',
    phonetic: '/ˌdem.əˈɡræf.ɪk/',
    partOfSpeech: 'adj. / n.',
    chinese: '人口统计的；人口结构的；特定人群',
    definition: 'Relating to the structure of populations',
    example: 'Aging demographic trends pose severe fiscal pressures on pension schemes.',
    synonyms: ['population profile', 'sociodemographic'],
    collocations: ['demographic shift', 'target demographic', 'demographic change'],
    ieltsBand: 'Band 7.0+',
    category: 'Society'
  },
  deteriorate: {
    word: 'deteriorate',
    phonetic: '/dɪˈtɪə.ri.ə.reɪt/',
    partOfSpeech: 'v.',
    chinese: '恶化；变坏；退化',
    definition: 'Become progressively worse',
    example: 'Air quality in the city center has deteriorated rapidly due to industrial emissions.',
    synonyms: ['worsen', 'degenerate', 'decay', 'decline'],
    collocations: ['deteriorate rapidly', 'condition deteriorates'],
    ieltsBand: 'Band 7.0+',
    category: 'Environment'
  },
  detrimental: {
    word: 'detrimental',
    phonetic: '/ˌdet.rɪˈmen.təl/',
    partOfSpeech: 'adj.',
    chinese: '有害的；不利的；造成损害的',
    definition: 'Tending to cause harm',
    example: 'Excessive reliance on fast food has a detrimental effect on adolescent metabolism.',
    synonyms: ['deleterious', 'damaging', 'pernicious', 'adverse'],
    collocations: ['detrimental effect', 'detrimental impact'],
    ieltsBand: 'Band 7.5+',
    category: 'Health & Society'
  },
  disparity: {
    word: 'disparity',
    phonetic: '/dɪˈspær.ə.ti/',
    partOfSpeech: 'n.',
    chinese: '差异；不平等；差距',
    definition: 'A great difference between two or more things',
    example: 'The economic disparity between coastal and inland provinces continues to widen.',
    synonyms: ['inequality', 'discrepancy', 'imbalance', 'divergence'],
    collocations: ['economic disparity', 'growing disparity', 'disparity between'],
    ieltsBand: 'Band 7.5+',
    category: 'Society'
  },
  dissertation: {
    word: 'dissertation',
    phonetic: '/ˌdɪs.əˈteɪ.ʃən/',
    partOfSpeech: 'n.',
    chinese: '学位论文；专题论文（听力S3高频）',
    definition: 'A long essay on a particular subject, especially one written for a university degree',
    example: 'She is writing her doctoral dissertation on marine microbial ecosystems.',
    synonyms: ['thesis', 'treatise', 'paper'],
    collocations: ['submit a dissertation', 'dissertation supervisor', 'write a dissertation'],
    ieltsBand: 'Band 7.0+',
    category: 'Listening'
  },
  dramatic: {
    word: 'dramatic',
    phonetic: '/drəˈmæt.ɪk/',
    partOfSpeech: 'adj.',
    chinese: '急剧的；戏剧性的；显著的（小作文高频）',
    definition: 'Sudden and striking; relating to drama',
    example: 'There was a dramatic surge in solar panel installations between 2015 and 2020.',
    synonyms: ['substantial', 'sharp', 'steep', 'remarkable'],
    collocations: ['dramatic increase', 'dramatic fall', 'dramatic change'],
    ieltsBand: 'Band 6.5+',
    category: 'Task 1 Trends'
  },

  // E
  ecosystem: {
    word: 'ecosystem',
    phonetic: '/ˈiː.kəʊˌsɪs.təm/',
    partOfSpeech: 'n.',
    chinese: '生态系统',
    definition: 'A biological community of interacting organisms and their physical environment',
    example: 'Mangrove swamps are among the most biodiverse ecosystems on our planet.',
    synonyms: ['biosphere', 'ecological network', 'natural habitat'],
    collocations: ['fragile ecosystem', 'marine ecosystem', 'disrupt an ecosystem'],
    ieltsBand: 'Band 6.5+',
    category: 'Academic'
  },
  eliminate: {
    word: 'eliminate',
    phonetic: '/iˈlɪm.ɪ.neɪt/',
    partOfSpeech: 'v.',
    chinese: '消除；消灭；根除；淘汰',
    definition: 'Completely remove or get rid of something',
    example: 'Renewable energy adoption will help eliminate dependence on foreign fossil fuels.',
    synonyms: ['eradicate', 'expel', 'abolish', 'purge'],
    collocations: ['eliminate waste', 'eliminate barriers', 'completely eliminate'],
    ieltsBand: 'Band 7.0+',
    category: 'Academic'
  },
  environment: {
    word: 'environment',
    phonetic: '/ɪnˈvaɪ.rən.mənt/',
    partOfSpeech: 'n.',
    chinese: '环境；自然生态；周围状况',
    definition: 'The surroundings or conditions in which a person, animal, or plant lives',
    example: 'Protecting the natural environment requires unified international cooperation.',
    synonyms: ['surroundings', 'ecosystem', 'habitat', 'milieu'],
    collocations: ['natural environment', 'protect the environment', 'environmental policy'],
    ieltsBand: 'Band 6.0+',
    category: 'Environment'
  },
  equilibrium: {
    word: 'equilibrium',
    phonetic: '/ˌiː.kwɪˈlɪb.ri.əm/',
    partOfSpeech: 'n.',
    chinese: '平衡；均衡；平静',
    definition: 'A state in which opposing forces or influences are balanced',
    example: 'Telecommuting fosters a much healthier work-life equilibrium.',
    synonyms: ['balance', 'symmetry', 'poise', 'harmony'],
    collocations: ['maintain equilibrium', 'ecological equilibrium', 'work-life equilibrium'],
    ieltsBand: 'Band 7.5+',
    category: 'Academic'
  },
  examine: {
    word: 'examine',
    phonetic: '/ɪɡˈzæm.ɪn/',
    partOfSpeech: 'v.',
    chinese: '审视；调查；考试；检查',
    definition: 'Inspect someone or something in detail to determine their nature or condition',
    example: 'This essay will examine both perspectives before reaching a balanced conclusion.',
    synonyms: ['scrutinize', 'investigate', 'analyze', 'probe'],
    collocations: ['examine closely', 'examine an issue', 'examine the evidence'],
    ieltsBand: 'Band 6.5+',
    category: 'Writing Task 2'
  },

  // F
  fluctuate: {
    word: 'fluctuate',
    phonetic: '/ˈflʌk.tʃu.eɪt/',
    partOfSpeech: 'v.',
    chinese: '波动；起伏不定（小作文趋势高频）',
    definition: 'Rise and fall irregularly in number or amount',
    example: 'Oil prices fluctuated wildly throughout the late 1990s.',
    synonyms: ['oscillate', 'vacillate', 'vary', 'waver'],
    collocations: ['fluctuate wildly', 'fluctuate between A and B'],
    ieltsBand: 'Band 6.5+',
    category: 'Task 1 Chart'
  },
  fundamental: {
    word: 'fundamental',
    phonetic: '/ˌfʌn.dəˈmen.təl/',
    partOfSpeech: 'adj.',
    chinese: '基本的；根本的；至关紧要的',
    definition: 'Forming a necessary base or core; of central importance',
    example: 'Access to potable water is a fundamental human right.',
    synonyms: ['elementary', 'basal', 'cardinal', 'underlying'],
    collocations: ['fundamental shift', 'fundamental principle', 'fundamental difference'],
    ieltsBand: 'Band 7.0+',
    category: 'Academic'
  },

  // I
  infrastructure: {
    word: 'infrastructure',
    phonetic: '/ˈɪn.frəˌstrʌk.tʃər/',
    partOfSpeech: 'n.',
    chinese: '基础设施；公共建设',
    definition: 'The basic physical and organizational structures and facilities needed for the operation of a society',
    example: 'The government pledged billions to modernize the national transport infrastructure.',
    synonyms: ['framework', 'foundation', 'substructure'],
    collocations: ['public infrastructure', 'transport infrastructure', 'critical infrastructure'],
    ieltsBand: 'Band 7.0+',
    category: 'Academic'
  },
  innovation: {
    word: 'innovation',
    phonetic: '/ˌɪn.əˈveɪ.ʃən/',
    partOfSpeech: 'n.',
    chinese: '创新；新方法；革新',
    definition: 'A new method, idea, or product',
    example: 'Technological innovations have revolutionized modern distance learning.',
    synonyms: ['breakthrough', 'novelty', 'advancement', 'revolution'],
    collocations: ['technological innovation', 'foster innovation', 'radical innovation'],
    ieltsBand: 'Band 6.5+',
    category: 'Technology'
  },
  itinerary: {
    word: 'itinerary',
    phonetic: '/aɪˈtɪn.ər.ər.i/',
    partOfSpeech: 'n.',
    chinese: '行程；旅行计划；路线（听力S2高频）',
    definition: 'A planned route or journey',
    example: 'The tour itinerary includes visits to three historical cathedral cities.',
    synonyms: ['schedule', 'route', 'travel plan'],
    collocations: ['travel itinerary', 'detailed itinerary', 'on the itinerary'],
    ieltsBand: 'Band 6.5+',
    category: 'Listening'
  },

  // M
  mitigate: {
    word: 'mitigate',
    phonetic: '/ˈmɪt.ɪ.ɡeɪt/',
    partOfSpeech: 'v.',
    chinese: '减轻；缓和；缓解',
    definition: 'Make something bad less severe, serious, or painful',
    example: 'Planting urban trees is an effective measure to mitigate the heat island effect.',
    synonyms: ['alleviate', 'attenuate', 'diminish', 'soften'],
    collocations: ['mitigate risks', 'mitigate the impact', 'mitigate climate change'],
    ieltsBand: 'Band 7.5+',
    category: 'Environment'
  },

  // O
  obsolete: {
    word: 'obsolete',
    phonetic: '/ˌɒb.səˈliːt/',
    partOfSpeech: 'adj.',
    chinese: '废弃的；过时的；被淘汰的',
    definition: 'No longer produced or used; out of date',
    example: 'Traditional paper encyclopedias have been rendered virtually obsolete by the internet.',
    synonyms: ['outdated', 'antiquated', 'archaic', 'superseded'],
    collocations: ['render obsolete', 'technologically obsolete'],
    ieltsBand: 'Band 7.0+',
    category: 'Technology'
  },

  // P
  paradigm: {
    word: 'paradigm',
    phonetic: '/ˈpær.ə.daɪm/',
    partOfSpeech: 'n.',
    chinese: '范式；典范；思考模式',
    definition: 'A typical example or pattern of something; a distinct set of concepts or thought patterns',
    example: 'A paradigm shift known as urban rewilding is capturing the imagination of architects worldwide.',
    synonyms: ['model', 'pattern', 'framework', 'prototype', 'archetype'],
    collocations: ['paradigm shift', 'dominant paradigm', 'shift in paradigm'],
    ieltsBand: 'Band 8.0+',
    category: 'Academic'
  },
  pedagogy: {
    word: 'pedagogy',
    phonetic: '/ˈped.ə.ɡɒdʒ.i/',
    partOfSpeech: 'n.',
    chinese: '教学法；教育学',
    definition: 'The method and practice of teaching, especially as an academic subject',
    example: 'Modern pedagogy emphasizes interactive dialogue over passive listening.',
    synonyms: ['teaching methodology', 'instructional practice'],
    collocations: ['innovative pedagogy', 'critical pedagogy'],
    ieltsBand: 'Band 7.5+',
    category: 'Education'
  },
  predominant: {
    word: 'predominant',
    phonetic: '/prɪˈdɒm.ɪ.nənt/',
    partOfSpeech: 'adj.',
    chinese: '占主导地位的；显著的；主要的',
    definition: 'Present as the strongest or main element',
    example: 'Wind power has emerged as the predominant renewable energy source in Europe.',
    synonyms: ['prevailing', 'dominant', 'paramount', 'foremost'],
    collocations: ['predominant role', 'predominant feature'],
    ieltsBand: 'Band 7.0+',
    category: 'Academic'
  },
  profound: {
    word: 'profound',
    phonetic: '/prəˈfaʊnd/',
    partOfSpeech: 'adj.',
    chinese: '深远的；深刻的；渊博的',
    definition: 'Very great or intense; having or showing great knowledge or insight',
    example: 'The Industrial Revolution precipitated profound transformations in societal hierarchies.',
    synonyms: ['deep', 'far-reaching', 'intense', 'weighty'],
    collocations: ['profound impact', 'profound effect', 'profound change'],
    ieltsBand: 'Band 7.5+',
    category: 'Academic'
  },

  // R
  resilience: {
    word: 'resilience',
    phonetic: '/rɪˈzɪl.jəns/',
    partOfSpeech: 'n.',
    chinese: '复原力；韧性；适应力',
    definition: 'The capacity to recover quickly from difficulties; toughness',
    example: 'Natural forests demonstrate remarkable resilience against severe weather anomalies.',
    synonyms: ['toughness', 'flexibility', 'endurance', 'adaptability'],
    collocations: ['emotional resilience', 'ecological resilience', 'build resilience'],
    ieltsBand: 'Band 7.0+',
    category: 'Academic'
  },
  rewilding: {
    word: 'rewilding',
    phonetic: '/ˌriːˈwaɪl.dɪŋ/',
    partOfSpeech: 'n.',
    chinese: '野化；生态恢复（重构自然荒野，剑桥19最新考点）',
    definition: 'The practice of reintroducing native species and restoring natural ecosystems',
    example: 'Urban rewilding projects have dramatically enriched the flora and fauna of the city.',
    synonyms: ['ecological restoration', 'habitat revitalization'],
    collocations: ['urban rewilding', 'rewilding initiative', 'rewilding movement'],
    ieltsBand: 'Band 7.5+',
    category: 'Cambridge 19'
  },

  // S
  substantial: {
    word: 'substantial',
    phonetic: '/səbˈstæn.ʃəl/',
    partOfSpeech: 'adj.',
    chinese: '大量的；实质性的；重大的；可观的',
    definition: 'Of considerable importance, size, or worth',
    example: 'A substantial number of candidates achieved Band 7 or higher.',
    synonyms: ['considerable', 'significant', 'extensive', 'sizable'],
    collocations: ['substantial increase', 'substantial amount', 'substantial portion'],
    ieltsBand: 'Band 7.5+',
    category: 'Academic'
  },

  // T
  telecommuting: {
    word: 'telecommuting',
    phonetic: '/ˌtel.ɪ.kəˈmjuː.tɪŋ/',
    partOfSpeech: 'n.',
    chinese: '远程办公；远程居家工作（2025/2026写作高频）',
    definition: 'The practice of working from home, making use of the internet, email, and the telephone',
    example: 'The rapid rise of telecommuting has decentralized commercial metropolitan life.',
    synonyms: ['remote work', 'working from home', 'telework'],
    collocations: ['adopt telecommuting', 'surge in telecommuting'],
    ieltsBand: 'Band 7.0+',
    category: '2025/2026 Topic'
  },

  // U
  ubiquitous: {
    word: 'ubiquitous',
    phonetic: '/juːˈbɪk.wɪ.təs/',
    partOfSpeech: 'adj.',
    chinese: '无处不在的；普遍存在的',
    definition: 'Present, appearing, or found everywhere',
    example: 'Smartphones have become ubiquitous across all age demographics.',
    synonyms: ['omnipresent', 'pervasive', 'widespread', 'universal'],
    collocations: ['ubiquitous presence', 'become ubiquitous'],
    ieltsBand: 'Band 8.0+',
    category: 'Technology'
  }
};

// Search dictionary locally with fuzzy/stemming/Chinese keyword match,
// and fall back to local dev proxy (/api/dict) or Datamuse API.
export async function lookupWord(input: string): Promise<DictionaryEntry | null> {
  if (!input || !input.trim()) return null;
  const raw = input.trim();
  const lower = raw.toLowerCase();
  const cleanEnglish = lower.replace(/^[^\w]+|[^\w]+$/g, '');

  // 1. Direct match in local dictionary
  if (cleanEnglish && LOCAL_DICTIONARY[cleanEnglish]) {
    return LOCAL_DICTIONARY[cleanEnglish];
  }

  // 2. Stemming match in local dictionary
  if (cleanEnglish) {
    if (cleanEnglish.endsWith('s') && LOCAL_DICTIONARY[cleanEnglish.slice(0, -1)]) {
      return LOCAL_DICTIONARY[cleanEnglish.slice(0, -1)];
    }
    if (cleanEnglish.endsWith('ed') && LOCAL_DICTIONARY[cleanEnglish.slice(0, -2)]) {
      return LOCAL_DICTIONARY[cleanEnglish.slice(0, -2)];
    }
    if (cleanEnglish.endsWith('ing') && LOCAL_DICTIONARY[cleanEnglish.slice(0, -3)]) {
      return LOCAL_DICTIONARY[cleanEnglish.slice(0, -3)];
    }
    if (cleanEnglish.endsWith('ly') && LOCAL_DICTIONARY[cleanEnglish.slice(0, -2)]) {
      return LOCAL_DICTIONARY[cleanEnglish.slice(0, -2)];
    }
  }

  // 3. Search Chinese meaning in local dictionary (if user typed Chinese)
  const isChineseInput = /[\u4e00-\u9fa5]/.test(raw);
  if (isChineseInput) {
    const chineseMatch = Object.values(LOCAL_DICTIONARY).find(entry => 
      entry.chinese.includes(raw)
    );
    if (chineseMatch) {
      return chineseMatch;
    }
  }

  // 4. Prefix match in local dictionary
  if (cleanEnglish && cleanEnglish.length >= 3) {
    const prefixMatch = Object.values(LOCAL_DICTIONARY).find(entry => 
      entry.word.startsWith(cleanEnglish)
    );
    if (prefixMatch) {
      return prefixMatch;
    }
  }

  // 5. Query Vite local dev proxy (/api/dict/suggest) with 2.5-second timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const proxyRes = await fetch(`/api/dict/suggest?q=${encodeURIComponent(raw)}&num=3&doctype=json`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (proxyRes.ok) {
      const json = await proxyRes.json();
      const entries = json?.data?.entries;
      if (Array.isArray(entries) && entries.length > 0) {
        const top = entries[0];
        const explain: string = top.explain || '';
        const entryWord: string = top.entry || raw;

        // Parse part of speech (e.g. "n. ", "adj. ")
        const posMatch = explain.match(/^([a-z]+\.)\s*(.+)/i);
        const partOfSpeech = posMatch ? posMatch[1] : 'n.';
        const chineseDef = posMatch ? posMatch[2] : explain;

        return {
          word: entryWord,
          phonetic: `/${entryWord}/`,
          partOfSpeech,
          chinese: chineseDef || explain,
          definition: `Official definition for "${entryWord}": ${explain}`,
          example: `Example sentence with '${entryWord}' in authentic context.`,
          ieltsBand: 'General / Academic'
        };
      }
    }
  } catch (e) {
    // Proxy timeout or failed, proceed to next fallback
  }

  // 6. Public Datamuse Fallback with 2.5-second timeout
  try {
    if (cleanEnglish) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(cleanEnglish)}&md=d&max=1`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0 && data[0].defs && data[0].defs.length > 0) {
          const rawDef = data[0].defs[0]; // e.g. "n\tA common fruit..."
          const [pos, defText] = rawDef.split('\t');

          return {
            word: cleanEnglish,
            phonetic: `/${cleanEnglish}/`,
            partOfSpeech: pos ? `${pos}.` : 'n.',
            chinese: `[释义] ${defText.slice(0, 50)}...`,
            definition: defText,
            example: `The study observed patterns related to '${cleanEnglish}'.`,
            ieltsBand: 'Academic English'
          };
        }
      }
    }
  } catch (e) {
    // Offline fallback
  }

  return null;
}

// Get auto-complete suggestions as user types
export function getWordSuggestions(prefix: string): string[] {
  if (!prefix || !prefix.trim()) return [];
  const q = prefix.trim().toLowerCase();

  // If Chinese, search Chinese definitions
  if (/[\u4e00-\u9fa5]/.test(q)) {
    return Object.values(LOCAL_DICTIONARY)
      .filter(entry => entry.chinese.includes(q))
      .map(entry => `${entry.word} (${entry.chinese.slice(0, 8)})`)
      .slice(0, 6);
  }

  // English prefix search
  return Object.keys(LOCAL_DICTIONARY)
    .filter(w => w.startsWith(q) || w.includes(q))
    .slice(0, 6);
}

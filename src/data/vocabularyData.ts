import { VocabWord, SynonymPair } from '../types/ielts';

export const CORE_VOCABULARY: VocabWord[] = [
  // Academic & Research
  {
    id: 'v1',
    word: 'substantial',
    phonetic: '/səbˈstæn.ʃəl/',
    partOfSpeech: 'adj.',
    meaning: 'Large in size, value, or importance',
    chinese: '大量的；实质性的；重大的',
    example: 'There has been a substantial increase in public transport usage over the past five years.',
    category: 'Academic',
    synonyms: ['considerable', 'significant', 'massive', 'profound'],
    status: 'learning'
  },
  {
    id: 'v2',
    word: 'corroborate',
    phonetic: '/kəˈrɒb.ə.reɪt/',
    partOfSpeech: 'v.',
    meaning: 'To add proof to an account, statement, or idea with new information',
    chinese: '证实；支持；确证',
    example: 'Recent scientific research corroborated the hypothesis proposed by the team.',
    category: 'Academic',
    synonyms: ['substantiate', 'verify', 'validate', 'confirm'],
    status: 'unfamiliar'
  },
  {
    id: 'v3',
    word: 'fluctuate',
    phonetic: '/ˈflʌk.tʃu.eɪt/',
    partOfSpeech: 'v.',
    meaning: 'To change or vary frequently in level or value',
    chinese: '波动；起伏不定',
    example: 'Oil prices fluctuated wildly during the economic turmoil in the late 1990s.',
    category: 'Academic',
    synonyms: ['oscillate', 'vacillate', 'waver', 'vary'],
    status: 'learning'
  },
  {
    id: 'v4',
    word: 'predominant',
    phonetic: '/prɪˈdɒm.ɪ.nənt/',
    partOfSpeech: 'adj.',
    meaning: 'More noticeable, powerful or important than anything else',
    chinese: '主要的；占主导地位的；显著的',
    example: 'Wind and solar power became the predominant sources of renewable energy in the region.',
    category: 'Academic',
    synonyms: ['prevailing', 'dominant', 'paramount', 'foremost'],
    status: 'unfamiliar'
  },
  {
    id: 'v5',
    word: 'deteriorate',
    phonetic: '/dɪˈtɪə.ri.ə.reɪt/',
    partOfSpeech: 'v.',
    meaning: 'To become progressively worse',
    chinese: '恶化；退化；变坏',
    example: 'Air quality in urban areas continued to deteriorate without stringent regulations.',
    category: 'Environment',
    synonyms: ['degenerate', 'worsen', 'decline', 'decay'],
    status: 'learning'
  },
  {
    id: 'v6',
    word: 'mitigate',
    phonetic: '/ˈmɪt.ɪ.ɡeɪt/',
    partOfSpeech: 'v.',
    meaning: 'To make something less harmful, unpleasant, or bad',
    chinese: '减轻；缓和；缓解',
    example: 'Planting urban trees is an effective measure to mitigate the heat island effect.',
    category: 'Environment',
    synonyms: ['alleviate', 'diminish', 'attenuate', 'ease'],
    status: 'learning'
  },
  {
    id: 'v7',
    word: 'biodiversity',
    phonetic: '/ˌbaɪ.əʊ.daɪˈvɜː.sə.ti/',
    partOfSpeech: 'n.',
    meaning: 'The number and variety of plants and animals in a particular environment',
    chinese: '生物多样性',
    example: 'Deforestation poses an immediate threat to the rich biodiversity of tropical rainforests.',
    category: 'Environment',
    synonyms: ['biological variety', 'ecological diversity'],
    status: 'mastered'
  },
  {
    id: 'v8',
    word: 'ubiquitous',
    phonetic: '/juːˈbɪk.wɪ.təs/',
    partOfSpeech: 'adj.',
    meaning: 'Present, appearing, or found everywhere',
    chinese: '无处不在的；普遍存在的',
    example: 'Smartphones have become ubiquitous in almost every aspect of contemporary life.',
    category: 'Technology',
    synonyms: ['omnipresent', 'pervasive', 'widespread', 'universal'],
    status: 'unfamiliar'
  },
  {
    id: 'v9',
    word: 'obsolete',
    phonetic: '/ˌɒb.səˈliːt/',
    partOfSpeech: 'adj.',
    meaning: 'No longer in use or out of date',
    chinese: '废弃的；过时的；淘汰的',
    example: 'Traditional landline phones have been rendered almost obsolete by mobile technology.',
    category: 'Technology',
    synonyms: ['outdated', 'antiquated', 'archaic', 'superseded'],
    status: 'learning'
  },
  {
    id: 'v10',
    word: 'innovation',
    phonetic: '/ˌɪn.əˈveɪ.ʃən/',
    partOfSpeech: 'n.',
    meaning: 'A new idea, method, or product',
    chinese: '创新；新方法；新技术',
    example: 'Technological innovations have fundamentally reshaped modern pedagogical practices.',
    category: 'Technology',
    synonyms: ['breakthrough', 'advancement', 'novelty', 'revolution'],
    status: 'mastered'
  },
  {
    id: 'v11',
    word: 'curriculum',
    phonetic: '/kəˈrɪk.jə.ləm/',
    partOfSpeech: 'n.',
    meaning: 'The subjects comprising a course of study in a school or college',
    chinese: '学校全部课程；教程',
    example: 'Critical thinking skills ought to be incorporated into the high school curriculum.',
    category: 'Education',
    synonyms: ['syllabus', 'course of study', 'academic program'],
    status: 'learning'
  },
  {
    id: 'v12',
    word: 'pedagogy',
    phonetic: '/ˈped.ə.ɡɒdʒ.i/',
    partOfSpeech: 'n.',
    meaning: 'The method and practice of teaching',
    chinese: '教学法；教育学',
    example: 'Modern pedagogy emphasizes collaborative problem-solving over rote memorization.',
    category: 'Education',
    synonyms: ['teaching methodology', 'instruction', 'education philosophy'],
    status: 'unfamiliar'
  },
  {
    id: 'v13',
    word: 'disparity',
    phonetic: '/dɪˈspær.ə.ti/',
    partOfSpeech: 'n.',
    meaning: 'A great difference or inequality',
    chinese: '不平等；差异；差距',
    example: 'The widening economic disparity between rural and metropolitan populations requires immediate intervention.',
    category: 'Society',
    synonyms: ['inequality', 'discrepancy', 'imbalance', 'divergence'],
    status: 'unfamiliar'
  },
  {
    id: 'v14',
    word: 'demographic',
    phonetic: '/ˌdem.əˈɡræf.ɪk/',
    partOfSpeech: 'adj. / n.',
    meaning: 'Relating to the structure of populations',
    chinese: '人口统计的；人口结构的',
    example: 'Aging demographic trends present severe fiscal challenges for pension systems.',
    category: 'Society',
    synonyms: ['population profile', 'sociodemographic'],
    status: 'learning'
  },
  {
    id: 'v15',
    word: 'accommodation',
    phonetic: '/əˌkɒm.əˈdeɪ.ʃən/',
    partOfSpeech: 'n.',
    meaning: 'A place to live, work, or stay in',
    chinese: '住宿；膳宿（听力Section 1最高频词之一）',
    example: 'First-year university students are usually guaranteed hall accommodation on campus.',
    category: 'Listening_Campus',
    synonyms: ['lodging', 'residence', 'housing', 'dormitory'],
    status: 'mastered'
  },
  {
    id: 'v16',
    word: 'itinerary',
    phonetic: '/aɪˈtɪn.ər.ər.i/',
    partOfSpeech: 'n.',
    meaning: 'A detailed plan or route of a journey',
    chinese: '行程；旅行计划（听力Section 2高频词）',
    example: 'The tour itinerary includes visits to ancient castles and coastal nature reserves.',
    category: 'Listening_Campus',
    synonyms: ['travel schedule', 'journey route', 'tour agenda'],
    status: 'learning'
  },
  {
    id: 'v17',
    word: 'dissertation',
    phonetic: '/ˌdɪs.əˈteɪ.ʃən/',
    partOfSpeech: 'n.',
    meaning: 'A long essay on a particular subject, especially one written for a university degree',
    chinese: '学位论文；专题论文（听力Section 3高频词）',
    example: 'The tutor gave detailed feedback on the literature review chapter of her dissertation.',
    category: 'Listening_Campus',
    synonyms: ['thesis', 'treatise', 'academic paper', 'monograph'],
    status: 'learning'
  },
  {
    id: 'v18',
    word: 'ecosystem',
    phonetic: '/ˈiː.kəʊˌsɪs.təm/',
    partOfSpeech: 'n.',
    meaning: 'All the living things in an area and the way they affect each other and the environment',
    chinese: '生态系统（听力Section 4讲座高频词）',
    example: 'Coral reefs support the most diverse marine ecosystems on our planet.',
    category: 'Listening_Campus',
    synonyms: ['ecological network', 'biosphere', 'natural habitat'],
    status: 'mastered'
  }
];

export const SYNONYM_PAIRS: SynonymPair[] = [
  {
    id: 'syn1',
    coreWord: 'Increase / Rise',
    chinese: '增长；上升；攀升',
    synonyms: ['surge', 'soar', 'escalate', 'climb', 'rocket', 'proliferate'],
    sampleSentence: 'The demand for electric vehicles escalated rapidly over the decade.',
    frequency: 'Essential'
  },
  {
    id: 'syn2',
    coreWord: 'Decrease / Drop',
    chinese: '下降；减少；萎缩',
    synonyms: ['plummet', 'plunge', 'dwindle', 'decline', 'diminish', 'slump'],
    sampleSentence: 'Enrolment numbers plummeted following the tuition fee hike.',
    frequency: 'Essential'
  },
  {
    id: 'syn3',
    coreWord: 'Important / Crucial',
    chinese: '至关重要的；核心的',
    synonyms: ['vital', 'pivotal', 'indispensable', 'paramount', 'essential', 'imperative'],
    sampleSentence: 'Quality early childhood education plays a pivotal role in lifelong cognitive development.',
    frequency: 'Essential'
  },
  {
    id: 'syn4',
    coreWord: 'Solve / Tackle',
    chinese: '解决；处理；应对',
    synonyms: ['address', 'combat', 'resolve', 'remedy', 'mitigate', 'grapple with'],
    sampleSentence: 'Governments must take prompt measures to combat environmental degradation.',
    frequency: 'Essential'
  },
  {
    id: 'syn5',
    coreWord: 'Show / Demonstrate',
    chinese: '展示；表明；阐明',
    synonyms: ['illustrate', 'depict', 'reveal', 'manifest', 'exemplify', 'elucidate'],
    sampleSentence: 'The chart clearly illustrates the shift in consumer expenditure between 2010 and 2020.',
    frequency: 'Essential'
  },
  {
    id: 'syn6',
    coreWord: 'Problem / Obstacle',
    chinese: '问题；困境；障碍',
    synonyms: ['dilemma', 'impediment', 'hindrance', 'setback', 'adversity', 'hurdle'],
    sampleSentence: 'Lack of initial capital proved to be a formidable impediment for young entrepreneurs.',
    frequency: 'High'
  },
  {
    id: 'syn7',
    coreWord: 'Harmful / Detrimental',
    chinese: '有害的；不利的',
    synonyms: ['deleterious', 'adverse', 'damaging', 'pernicious', 'ruinous'],
    sampleSentence: 'Excessive screen exposure can have deleterious repercussions on adolescents\' sleep patterns.',
    frequency: 'Advanced'
  },
  {
    id: 'syn8',
    coreWord: 'Benefit / Advantage',
    chinese: '优势；益处；裨益',
    synonyms: ['merit', 'asset', 'boon', 'dividend', 'virtue'],
    sampleSentence: 'Flexible working arrangements yield tremendous dividends in employee morale.',
    frequency: 'High'
  },
  {
    id: 'syn9',
    coreWord: 'Cause / Lead to',
    chinese: '导致；引起；诱发',
    synonyms: ['trigger', 'engender', 'precipitate', 'foster', 'give rise to', 'instigate'],
    sampleSentence: 'Rapid industrialization gave rise to severe environmental contamination.',
    frequency: 'High'
  },
  {
    id: 'syn10',
    coreWord: 'Different / Diverse',
    chinese: '不同的；多元的；各异的',
    synonyms: ['disparate', 'heterogeneous', 'multifaceted', 'varied', 'distinct'],
    sampleSentence: 'The study brought together researchers from disparate academic disciplines.',
    frequency: 'Advanced'
  }
];

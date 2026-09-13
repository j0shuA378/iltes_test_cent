import { SpeakingTopic } from '../types/ielts';

export const SPEAKING_TOPICS: SpeakingTopic[] = [
  {
    id: 'sp_p2_revitalizing_park',
    part: 2,
    title: 'Describe a public park or green space you found revitalizing (2025/2026 最新题季)',
    category: 'Places & Nature (2025/2026 换题季高频)',
    year: '2025-2026',
    source: '2025/2026 Speaking Season Official Pool',
    tags: ['Nature', 'Urban Park', 'Mental Health', 'Part 2 Cue Card'],
    cueCard: {
      topic: 'Describe a public park or green space you visited and found revitalizing',
      points: [
        'Where this park or green space is located',
        'When and with whom you visited it',
        'What specific features or amenities it offered',
        'And explain why you found this visit so restorative or revitalizing'
      ],
      followUp: 'Do municipal governments in your country invest sufficiently in public green spaces?'
    },
    highBandSample: `I would like to describe the West Lake Botanical Wetland Park, located on the western periphery of my home city. I visited it roughly two months ago during a particularly intense phase of my university examinations, accompanied by my long-time study partner.

What distinguishes this ecological sanctuary from ordinary concrete city squares is its intentional commitment to urban rewilding. Instead of manicured golf lawns, the park features meandering timber boardwalks that hover gently above sprawling reed beds, teeming with migratory waterfowl such as grey herons and kingfishers. There is a tranquil central lagoon fringed by weeping willows and lotus flowers, alongside dedicated contemplation alcoves fitted with solar-powered charging stations and rain shelters.

The primary reason this excursion felt so profoundly revitalizing was the immediate psychological decompression it facilitated. For weeks, my cognitive bandwidth had been depleted by continuous screen exposure and mock tests. Stepping into that verdant atmosphere, inhaling the scent of damp moss, and listening to the rhythmic rustle of leaves triggered what psychologists call 'Attention Restoration Theory'. It completely purged my academic anxiety and replenished my mental stamina.`,
    vocabularyAndIdioms: [
      { term: 'intentional commitment to urban rewilding', definition: '对城市野化/自然恢复的有意识投入', example: 'The sanctuary demonstrates an intentional commitment to urban rewilding.' },
      { term: 'meandering timber boardwalks', definition: '蜿蜒起伏的木质步道', example: 'We strolled along meandering timber boardwalks across the lagoon.' },
      { term: 'Attention Restoration Theory', definition: '注意恢复理论（心理学高阶术语）', example: 'Natural environments stimulate involuntary attention, validating Attention Restoration Theory.' },
      { term: 'replenish my mental stamina', definition: '恢复补充我的精神耐力', example: 'Taking brisk outdoor strolls helps replenish my mental stamina.' }
    ]
  },
  {
    id: 'sp_p1_ai_chatbots',
    part: 1,
    title: 'AI Chatbots & Digital Assistance in Daily Life (2025/2026 最新)',
    category: 'Technology & Daily Life',
    year: '2025-2026',
    source: '2025/2026 CDI Machine Exam Pool',
    tags: ['Artificial Intelligence', 'Smart Tools', 'Daily Life'],
    questions: [
      'Do you frequently utilize artificial intelligence chatbots for your work or study?',
      'In what specific tasks do you find digital assistants most helpful?',
      'Are you concerned that relying on AI might impair your independent thinking skills?',
      'How do you envision AI tools evolving in education over the coming decade?'
    ],
    highBandSample: `I integrate generative AI tools into my academic workflow almost on a daily basis. I primarily deploy them as interactive sparring partners—for instance, asking them to generate counter-arguments to my essay theses or to deconstruct arcane academic syntax. However, I maintain rigorous cognitive discipline: I never use AI to circumvent actual critical contemplation, ensuring it remains an intellectual catalyst rather than an intellectual crutch.`,
    vocabularyAndIdioms: [
      { term: 'interactive sparring partner', definition: '互动的陪练/研讨伙伴', example: 'I treat large language models as interactive sparring partners.' },
      { term: 'arcane academic syntax', definition: '晦涩高深的学术句法', example: 'The tool helped me decipher arcane academic syntax.' },
      { term: 'intellectual catalyst', definition: '思维催化剂', example: 'AI functions best as an intellectual catalyst rather than an intellectual crutch.' }
    ]
  },
  {
    id: 'sp_p2_technology',
    part: 2,
    title: 'Describe an impressive technological device you started using',
    category: 'Technology & Gadgets',
    year: '2024',
    source: 'Cambridge 18 Speaking Pool',
    tags: ['Gadgets', 'E-Ink', 'Study Tool'],
    cueCard: {
      topic: 'Describe an impressive technological device you started using recently',
      points: [
        'What the device is and when you acquired it',
        'What main features or functions it possesses',
        'How frequently and for what purposes you use it',
        'And explain why you consider this device so impressive or beneficial'
      ],
      followUp: 'Do you believe you will still be using similar devices five years from now?'
    },
    highBandSample: `I would like to talk about an active noise-cancelling e-ink digital tablet that I acquired roughly six months ago, just as I commenced my intensive IELTS preparation. 

Visually, it resembles a conventional paper notebook, yet underneath the matte glare-free screen lies a state-of-the-art processor capable of real-time optical character recognition. Unlike standard LCD tablets that cause ocular strain after prolonged reading, this device utilizes microscopic micro-capsules filled with black and white pigment, flawlessly mimicking the tactile feel of actual paper and ink.

I utilize this gadget on a daily basis. Whenever I practice Cambridge reading passages, I can annotate directly into margins, underline thesis statements, and instantly convert my handwritten scratch notes into searchable digital text files. Furthermore, it completely eliminates ambient distractions: there are no intrusive social media notifications, email alerts, or tempting gaming applications.

The principal reason I find this device truly extraordinary is how it miraculously bridges analog tangibility with digital versatility. It has not only streamlined my academic workflow by condensing heavy binders of past papers into a single 300-gram tablet, but it has also substantially augmented my focus span. It has genuinely transformed the way I absorb and consolidate complex academic information.`,
    vocabularyAndIdioms: [
      { term: 'state-of-the-art processor', definition: '最尖端/最先进的处理器', example: 'The gadget features a state-of-the-art processor with instantaneous response.' },
      { term: 'ocular strain', definition: '视疲劳；眼睛酸胀', example: 'E-ink displays significantly alleviate ocular strain during prolonged reading.' },
      { term: 'bridges analog tangibility with digital versatility', definition: '融合了纸质实体触感与数字多功能性', example: 'The tablet brilliantly bridges analog tangibility with digital versatility.' },
      { term: 'streamline my workflow', definition: '精简/优化我的工作学习流', example: 'This tool has streamlined my study workflow remarkably.' }
    ]
  },
  {
    id: 'sp_p1_work_study',
    part: 1,
    title: 'Work, Studies & Daily Routine',
    category: 'Daily Life & Academics',
    year: '2023-2024',
    source: 'Cambridge 18 Official',
    tags: ['Work', 'Postgraduate', 'Routine'],
    questions: [
      'Do you currently work or are you a student?',
      'What is the most interesting or rewarding aspect of your field of study or job?',
      'Do you prefer to study/work in the early morning or late at night?',
      'How do you typically unwind after a strenuous day of work or study?'
    ],
    highBandSample: `I am currently pursuing a postgraduate degree in environmental data science. What fascinates me most is the intersection between big data analytics and ecological conservation—specifically using predictive algorithms to track wildlife migration patterns. When it comes to productivity, I am unequivocally an early riser; my cognitive focus peaks between 6 and 9 AM when the world is still quiet and devoid of digital distractions. To decompress after demanding days, I usually go for an outdoor jog in the local park while listening to history podcasts, which completely clears my mental bandwidth.`,
    vocabularyAndIdioms: [
      { term: 'unequivocally an early riser', definition: '毫无疑问是个早起的人', example: 'I am unequivocally an early riser who enjoys morning tranquility.' },
      { term: 'decompress', definition: '减压；放松身心', example: 'Engaging in light cardio helps me decompress after rigorous exam sessions.' },
      { term: 'clear my mental bandwidth', definition: '清空大脑思绪负担', example: 'Walking in nature helps me clear my mental bandwidth.' }
    ]
  },
  {
    id: 'sp_p3_tech_society',
    part: 3,
    title: 'Technological Progression & Cognitive Impact',
    category: 'Society & Cognition',
    year: '2024',
    source: 'Cambridge 18 Official',
    tags: ['Attention Span', 'Societal Impact'],
    questions: [
      'In what ways has smart technology altered the younger generation\'s attention span?',
      'Do you think artificial intelligence will make humans mentally lazy or more creative?',
      'Should governments impose strict screen-time limits for minors on social media platforms?'
    ],
    highBandSample: `In my estimation, algorithmic short-form content has undeniably truncated adolescents' attention spans. When youths are continuously bombarded with 15-second dopamine-inducing videos, their patience for sustained, linear cognitive engagement—such as reading a 300-page monograph or working through complex mathematical proofs—inevitably erodes. 

Regarding the impact of artificial intelligence, it is largely a double-edged sword. On one hand, offloading mundane computational and grammatical tasks liberates cognitive bandwidth, enabling people to focus on high-level divergent ideation and creative synthesis. On the other hand, an over-reliance on generative algorithms for basic analytical thinking risks cognitive atrophy. Therefore, the outcome hinges fundamentally on whether educational institutions teach students to utilize AI as a collaborative sparring partner rather than an intellectual crutch.`,
    vocabularyAndIdioms: [
      { term: 'truncated attention spans', definition: '被截短/大幅缩短的注意力持续时间', example: 'Constant digital notifications have truncated the attention span of teenagers.' },
      { term: 'double-edged sword', definition: '双刃剑', example: 'Generative AI is unmistakably a double-edged sword for academic integrity.' },
      { term: 'cognitive atrophy', definition: '认知退化', example: 'Delegating all critical problem-solving to machines could trigger cognitive atrophy.' },
      { term: 'intellectual crutch', definition: '智力上的拐杖/过度依赖物', example: 'AI must be an accelerator rather than an intellectual crutch.' }
    ]
  }
];

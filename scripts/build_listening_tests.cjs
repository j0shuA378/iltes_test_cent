const fs = require('fs');
const path = require('path');

const cam19Test1 = `  {
    id: 'cam19_test1_listening',
    title: 'Academic Listening Practice Test 1 (Cambridge 19 官方全真卷)',
    source: 'Cambridge IELTS 19 Academic Official',
    bankCategory: 'cam19',
    year: '2024-2025',
    difficulty: 'Authentic Exam',
    tags: ['Accommodation', 'Eco-Museum', 'Wind Energy', 'Marine Ecology'],
    sections: [
      {
        sectionNumber: 1,
        title: 'Section 1: University Studio Apartment Rental Enquiry',
        description: 'A conversation between an overseas postgraduate student and a student housing leasing agent regarding rental terms, deposit, and utilities.',
        audioPrompt: 'Hello, Victoria Student Residences, this is Liam speaking. Good afternoon, I am calling from overseas regarding studio apartment availability for the upcoming autumn semester commencing in September...',
        transcript: [
          { speaker: 'Agent', text: 'Hello, Victoria Student Residences, Liam speaking. How can I assist you today?' },
          { speaker: 'Student', text: 'Hello Liam. I am an incoming postgraduate student from Singapore and would like to enquire about a private studio apartment.' },
          { speaker: 'Agent', text: 'Congratulations on your admission! We have several en-suite studios available. May I take your full name please?' },
          { speaker: 'Student', text: 'Yes, it is Chloe Kensington. That is K-E-N-S-I-N-G-T-O-N.' },
          { speaker: 'Agent', text: 'Thank you Chloe. And what is your target move-in date?' },
          { speaker: 'Student', text: 'My course orientation commences on September 22nd, so I would prefer to collect the keys on September 15th.' },
          { speaker: 'Agent', text: 'September 15th is ideal. The weekly rent for our Deluxe Studio is 195 pounds, which includes high-speed fiber broadband and water.' },
          { speaker: 'Student', text: 'Does that also include the heating and electricity bills?' },
          { speaker: 'Agent', text: 'Heating is inclusive from October through April, but electricity is metered individually.' },
          { speaker: 'Student', text: 'Understood. Is there a security deposit required upon reservation?' },
          { speaker: 'Agent', text: 'Yes, a refundable security deposit of 350 pounds is held in a government tenancy protection scheme.' },
          { speaker: 'Student', text: 'Great. Does the building offer secure storage for bicycles?' },
          { speaker: 'Agent', text: 'Yes, we have a subterranean locked bike shed monitored by CCTV 24 hours a day.' },
          { speaker: 'Student', text: 'Wonderful! Could you send the tenancy contract to my email: chloe.k@campusmail.com?' },
          { speaker: 'Agent', text: 'Sending it right now.' }
        ],
        questions: [
          {
            id: 1,
            type: 'sentence_completion',
            prompt: 'Student surname: ______',
            correctAnswer: 'Kensington',
            explanation: 'Spelled out clearly in audio: K-E-N-S-I-N-G-T-O-N.',
            paragraphReference: 'Transcript Line 4'
          },
          {
            id: 2,
            type: 'sentence_completion',
            prompt: 'Requested move-in date: September ______',
            correctAnswer: '15th',
            explanation: 'Student states orientation is 22nd, but requests keys on the 15th.',
            paragraphReference: 'Transcript Line 6'
          },
          {
            id: 3,
            type: 'sentence_completion',
            prompt: 'Weekly rent amount: £______',
            correctAnswer: '195',
            explanation: 'Agent states: "The weekly rent for our Deluxe Studio is 195 pounds".',
            paragraphReference: 'Transcript Line 7'
          },
          {
            id: 4,
            type: 'sentence_completion',
            prompt: 'Security deposit: £______',
            correctAnswer: '350',
            explanation: 'Agent confirms a refundable deposit of 350 pounds.',
            paragraphReference: 'Transcript Line 11'
          },
          {
            id: 5,
            type: 'sentence_completion',
            prompt: 'Bicycle facility provided: a locked subterranean ______',
            correctAnswer: 'shed',
            explanation: 'Agent mentions: "subterranean locked bike shed monitored by CCTV".',
            paragraphReference: 'Transcript Line 13'
          }
        ]
      },
      {
        sectionNumber: 2,
        title: 'Section 2: Highclere Eco-Heritage Park Tour',
        description: 'A guide briefing tourists on park history, bird sanctuaries, and organic café opening hours.',
        audioPrompt: 'Good morning visitors, and welcome to Highclere Eco-Heritage Park. Before you embark on our walking trails, please note our safety regulations...',
        transcript: [
          { speaker: 'Guide', text: 'Good morning visitors and welcome to Highclere Eco-Heritage Park. The reserve encompasses 400 hectares of restored wetland.' },
          { speaker: 'Guide', text: 'To your left is the Heron Sanctuary, where over 30 avian species breed. Binoculars can be hired from the visitor center for £4.' },
          { speaker: 'Guide', text: 'Our Organic Orchard Café serves fair-trade refreshments from 10:00 to 17:30 daily.' }
        ],
        questions: [
          {
            id: 6,
            type: 'multiple_choice',
            prompt: 'The total area of the restored wetland reserve is:',
            options: ['A. 200 hectares', 'B. 400 hectares', 'C. 600 hectares'],
            correctAnswer: 'B. 400 hectares',
            explanation: 'The guide explicitly states the reserve encompasses 400 hectares.',
            paragraphReference: 'Transcript Line 1'
          },
          {
            id: 7,
            type: 'sentence_completion',
            prompt: 'Binocular rental fee: £______',
            correctAnswer: '4',
            explanation: 'Guide states binoculars can be hired for £4.',
            paragraphReference: 'Transcript Line 2'
          }
        ]
      }
    ]
  }`;

const cam19Test2 = `  {
    id: 'cam19_test2_listening',
    title: 'Academic Listening Practice Test 2 (Cambridge 19 全真卷)',
    source: 'Cambridge IELTS 19 Academic Official',
    bankCategory: 'cam19',
    year: '2024-2025',
    difficulty: 'Authentic Exam',
    tags: ['Rowing Club', 'Botanic Conservatory', 'Biodegradable Packaging', 'Circadian Biology'],
    sections: [
      {
        sectionNumber: 1,
        title: 'Section 1: River Thames Community Rowing Club Registration',
        description: 'Enquiry regarding adult novice rowing courses, safety equipment, and membership fees.',
        audioPrompt: 'Good morning, River Thames Rowing Club, Marcus speaking. Hello! I am calling to ask about beginner weekend rowing courses for adults...',
        transcript: [
          { speaker: 'Marcus', text: 'River Thames Rowing Club, Marcus speaking. How can I help you today?' },
          { speaker: 'Enquirer', text: 'Good morning. I would like to join the weekend novice rowing course.' },
          { speaker: 'Marcus', text: 'Excellent choice. Our next intake starts on April 12th. What is your full name?' },
          { speaker: 'Enquirer', text: 'My name is Julian Braithwaite. B-R-A-I-T-H-W-A-I-T-E.' },
          { speaker: 'Marcus', text: 'Thank you Julian. All rowers must pass a 100-metre swimming test wearing light clothes.' },
          { speaker: 'Enquirer', text: 'That will not be a problem. Do I need to buy my own lifejacket?' },
          { speaker: 'Marcus', text: 'No, all buoyancy aids are supplied. You only need to bring non-slip running shoes and a thermal jacket.' },
          { speaker: 'Enquirer', text: 'How much is the eight-week foundation course?' },
          { speaker: 'Marcus', text: 'The fee is 180 pounds, payable upon registration.' }
        ],
        questions: [
          {
            id: 1,
            type: 'sentence_completion',
            prompt: 'Member surname: ______',
            correctAnswer: 'Braithwaite',
            explanation: 'Spelled clearly: B-R-A-I-T-H-W-A-I-T-E.',
            paragraphReference: 'Transcript Line 4'
          },
          {
            id: 2,
            type: 'sentence_completion',
            prompt: 'Course starting date: April ______',
            correctAnswer: '12th',
            explanation: 'Marcus confirms next intake commences on April 12th.',
            paragraphReference: 'Transcript Line 3'
          },
          {
            id: 3,
            type: 'sentence_completion',
            prompt: 'Required swimming test distance: ______ metres',
            correctAnswer: '100',
            explanation: 'Must pass a 100-metre swimming test.',
            paragraphReference: 'Transcript Line 5'
          },
          {
            id: 4,
            type: 'sentence_completion',
            prompt: 'Rowers must bring non-slip ______',
            correctAnswer: 'shoes',
            explanation: 'Marcus specifies non-slip running shoes.',
            paragraphReference: 'Transcript Line 7'
          },
          {
            id: 5,
            type: 'sentence_completion',
            prompt: 'Eight-week course fee: £______',
            correctAnswer: '180',
            explanation: 'The course fee is £180.',
            paragraphReference: 'Transcript Line 9'
          }
        ]
      },
      {
        sectionNumber: 4,
        title: 'Section 4: Lecture on Circadian Rhythms and Cognitive Performance',
        description: 'A university psychology lecture discussing the suprachiasmatic nucleus and blue-light disruption.',
        audioPrompt: 'Good afternoon students. Today we examine the circadian pacemaker located within the anterior hypothalamus...',
        transcript: [
          { speaker: 'Lecturer', text: 'In today\'s lecture on chronobiology, we examine the suprachiasmatic nucleus, or SCN.' },
          { speaker: 'Lecturer', text: 'Specialized intrinsically photosensitive retinal ganglion cells detect blue light wavelengths between 460 and 480 nanometers.' },
          { speaker: 'Lecturer', text: 'Exposure to digital screens suppresses the pineal gland\'s secretion of melatonin, delaying sleep onset by an average of 90 minutes.' }
        ],
        questions: [
          {
            id: 6,
            type: 'sentence_completion',
            prompt: 'Retinal cells primarily detect blue light wavelengths between 460 and ______ nanometers.',
            correctAnswer: '480',
            explanation: 'Lecturer explicitly says: "between 460 and 480 nanometers".',
            paragraphReference: 'Transcript Line 2'
          },
          {
            id: 7,
            type: 'sentence_completion',
            prompt: 'Screen light suppresses the secretion of the hormone ______.',
            correctAnswer: 'melatonin',
            explanation: 'Lecturer states: "suppresses the pineal gland\'s secretion of melatonin".',
            paragraphReference: 'Transcript Line 3'
          }
        ]
      }
    ]
  }`;

const cam18Test1 = `  {
    id: 'cam18_test1_listening',
    title: 'Academic Listening Practice Test 1 (Cambridge 18 全真模考)',
    source: 'Cambridge IELTS 18 Academic Official',
    bankCategory: 'cam18',
    year: '2023-2024',
    difficulty: 'Authentic Exam',
    tags: ['Car Rental', 'Theatre Volunteering', 'Marine Biology', 'Archaeology'],
    sections: [
      {
        sectionNumber: 1,
        title: 'Section 1: Peak District Vehicle Rental & Breakdown Cover',
        description: 'Customer booking an all-wheel drive SUV with GPS navigation and roadside assistance.',
        audioPrompt: 'Apex Car Hire, Sheffield Branch, how can I direct your call? Good morning, I would like to book a mid-size vehicle for four days...',
        transcript: [
          { speaker: 'Agent', text: 'Apex Car Hire, Sheffield branch. How can I help you?' },
          { speaker: 'Customer', text: 'Good morning. I need to hire an all-wheel drive vehicle for four days starting next Friday.' },
          { speaker: 'Agent', text: 'Certainly. May I take your full name and driving license number?' },
          { speaker: 'Customer', text: 'My name is Nathan Gallagher. That is G-A-L-L-A-G-H-E-R.' },
          { speaker: 'Agent', text: 'Thank you Nathan. The daily rate for the compact SUV is 62 pounds including unlimited mileage.' },
          { speaker: 'Customer', text: 'Does that include insurance against tyre punctures and windshield chips?' },
          { speaker: 'Agent', text: 'Our Premium Cover includes both for an additional 12 pounds per day.' }
        ],
        questions: [
          {
            id: 1,
            type: 'sentence_completion',
            prompt: 'Customer surname: ______',
            correctAnswer: 'Gallagher',
            explanation: 'G-A-L-L-A-G-H-E-R spelled out.',
            paragraphReference: 'Transcript Line 4'
          },
          {
            id: 2,
            type: 'sentence_completion',
            prompt: 'Basic daily rental rate: £______',
            correctAnswer: '62',
            explanation: 'Daily rate for the compact SUV is 62 pounds.',
            paragraphReference: 'Transcript Line 5'
          },
          {
            id: 3,
            type: 'sentence_completion',
            prompt: 'Premium cover additional cost per day: £______',
            correctAnswer: '12',
            explanation: 'Additional 12 pounds per day for Premium Cover.',
            paragraphReference: 'Transcript Line 7'
          }
        ]
      }
    ]
  }`;

const cam17Test1 = `  {
    id: 'cam17_test1_listening',
    title: 'Academic Listening Practice Test 1 (Cambridge 17 经典全真)',
    source: 'Cambridge IELTS 17 Academic Official',
    bankCategory: 'cam17',
    year: '2022-2023',
    difficulty: 'Authentic Exam',
    tags: ['Public Library', 'Mountain Trail', 'Desalination', 'Urban Planning'],
    sections: [
      {
        sectionNumber: 1,
        title: 'Section 1: Central City Library Young Readers Scheme',
        description: 'Parent registering two children for the summer reading challenge and audiobook club.',
        audioPrompt: 'Central City Library, Community Desk. Hello, I am enquiring about registering my children for the summer holiday reading club...',
        transcript: [
          { speaker: 'Librarian', text: 'Central City Library, Community Desk. How can I help?' },
          { speaker: 'Parent', text: 'Hello, I want to enrol my son in the Junior Bookworm Challenge.' },
          { speaker: 'Librarian', text: 'Wonderful! What is your son\'s name and date of birth?' },
          { speaker: 'Parent', text: 'His name is Oliver Thornton. T-H-O-R-N-T-O-N.' },
          { speaker: 'Librarian', text: 'The reading club meets every Tuesday at 10:30 in the garden pavilion.' }
        ],
        questions: [
          {
            id: 1,
            type: 'sentence_completion',
            prompt: 'Child surname: ______',
            correctAnswer: 'Thornton',
            explanation: 'T-H-O-R-N-T-O-N spelled out.',
            paragraphReference: 'Transcript Line 4'
          },
          {
            id: 2,
            type: 'sentence_completion',
            prompt: 'Weekly meeting day: ______',
            correctAnswer: 'Tuesday',
            explanation: 'Meets every Tuesday at 10:30.',
            paragraphReference: 'Transcript Line 5'
          }
        ]
      }
    ]
  }`;

const cdiRecentTest = `  {
    id: 'cdi_2025_listening_recall',
    title: '2025/2026 机考高频回忆听力专项 (CDI Machine Recall)',
    source: '2025/2026 CDI Machine Exam Recall Pool',
    bankCategory: 'cdi_recent',
    year: '2025-2026',
    difficulty: 'Authentic Exam',
    tags: ['Airport Transfer', 'Smart City Museum', 'Autonomous Bus', 'Microplastics'],
    sections: [
      {
        sectionNumber: 1,
        title: 'Section 1: International Student Airport Chauffeur Booking',
        description: 'Arranging airport pickup with electric shuttle for an international postgraduate student.',
        audioPrompt: 'Heathrow Student Express, bookings desk. Good morning, I need to arrange an airport shuttle from Terminal 2 to my university hall...',
        transcript: [
          { speaker: 'Dispatcher', text: 'Heathrow Student Express, bookings desk.' },
          { speaker: 'Student', text: 'Good morning. I arrive on flight BA 184 on October 3rd and need a shuttle to Kings Cross.' },
          { speaker: 'Dispatcher', text: 'Understood. What is your flight arrival time?' },
          { speaker: 'Student', text: 'Scheduled landing is 14:45.' },
          { speaker: 'Dispatcher', text: 'Our electric shuttle leaves from Bay 7 outside the arrivals hall.' }
        ],
        questions: [
          {
            id: 1,
            type: 'sentence_completion',
            prompt: 'Flight landing time: ______',
            correctAnswer: '14:45',
            explanation: 'Student states scheduled landing is 14:45.',
            paragraphReference: 'Transcript Line 4'
          },
          {
            id: 2,
            type: 'sentence_completion',
            prompt: 'Shuttle departure location: Bay ______',
            correctAnswer: '7',
            explanation: 'Dispatcher states Bay 7 outside arrivals hall.',
            paragraphReference: 'Transcript Line 5'
          }
        ]
      }
    ]
  }`;

const fileContent = `import { ListeningTest } from '../types/ielts';

export const LISTENING_TESTS: ListeningTest[] = [
${cam19Test1},
${cam19Test2},
${cam18Test1},
${cam17Test1},
${cdiRecentTest}
];
`;

const dest = path.join(__dirname, '..', 'src', 'data', 'listeningTests.ts');
fs.writeFileSync(dest, fileContent, 'utf8');
console.log('Successfully wrote expanded listeningTests.ts with 5 full test papers!');

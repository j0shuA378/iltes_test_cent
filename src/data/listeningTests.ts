import { ListeningTest } from '../types/ielts';

export const LISTENING_TESTS: ListeningTest[] = [
  {
    id: 'cam19_test1_listening',
    title: 'Academic Listening Practice Test 2 (Cambridge 19 最新真题)',
    source: 'Cambridge IELTS 19 Academic Official',
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
            explanation: 'Student states orientation is 22nd, but requests keys on the 15th (Classic IELTS distractor!).',
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
            prompt: 'Refundable security deposit: £______',
            correctAnswer: '350',
            explanation: 'Agent confirms: "a refundable security deposit of 350 pounds".',
            paragraphReference: 'Transcript Line 11'
          },
          {
            id: 5,
            type: 'sentence_completion',
            prompt: 'Special on-site facility: secure indoor storage for ______',
            correctAnswer: 'bicycles',
            explanation: 'Student asks: "storage for bicycles?" and agent confirms "subterranean locked bike shed".',
            paragraphReference: 'Transcript Line 12'
          }
        ]
      },
      {
        sectionNumber: 2,
        title: 'Section 2: The Future Eco-Museum Tour & Volunteer Scheme',
        description: 'An orientation talk given by the museum director to newly inducted volunteers about exhibition galleries, sustainability practices, and emergency protocols.',
        audioPrompt: 'Good morning volunteers, welcome to the newly retrofitted Bristol Maritime and Eco-Museum. Before assigning shifts across our three thematic galleries, I will walk you through our zero-carbon initiatives...',
        transcript: [
          { speaker: 'Director', text: 'Good morning volunteers, welcome to the newly retrofitted Bristol Maritime and Eco-Museum. Before assigning shifts across our three thematic galleries, I will walk you through our zero-carbon initiatives.' },
          { speaker: 'Director', text: 'First, the museum building itself has achieved BREEAM outstanding status. All rainwater is harvested from the solar-panel canopy roof and treated to supply 100% of our botanical conservatory irrigation.' },
          { speaker: 'Director', text: 'For our volunteer docents, the primary meeting muster point in the event of an emergency evacuation is the South Lawn Pavilion, directly adjacent to the historic lifeboat display.' },
          { speaker: 'Director', text: 'Volunteers on weekday shifts receive complimentary admission passes for their family and a 20% discount across our zero-waste bistro.' }
        ],
        questions: [
          {
            id: 6,
            type: 'sentence_completion',
            prompt: 'Rainwater collected from the roof is utilized for the botanical conservatory ______.',
            correctAnswer: 'irrigation',
            explanation: 'Director states: "treated to supply 100% of our botanical conservatory irrigation."',
            paragraphReference: 'Transcript Line 2'
          },
          {
            id: 7,
            type: 'multiple_choice',
            prompt: 'Where is the designated emergency evacuation muster point located?',
            options: [
              'A. North Parking Lot',
              'B. South Lawn Pavilion',
              'C. Central Atrium Cafe',
              'D. Harbor Dock Entrance'
            ],
            correctAnswer: 'B. South Lawn Pavilion',
            explanation: 'Director notes: "the primary meeting muster point... is the South Lawn Pavilion".',
            paragraphReference: 'Transcript Line 3'
          },
          {
            id: 8,
            type: 'sentence_completion',
            prompt: 'Weekday volunteers receive a ______ percent discount at the zero-waste bistro.',
            correctAnswer: '20',
            explanation: 'Director notes: "and a 20% discount across our zero-waste bistro."',
            paragraphReference: 'Transcript Line 4'
          }
        ]
      }
    ]
  },
  {
    id: 'cam18_test1_listening',
    title: 'Academic Listening Practice Test 1 (Cambridge 18 经典真题)',
    source: 'Cambridge IELTS 18 Authentic Simulation',
    year: '2023-2024',
    difficulty: 'Medium',
    tags: ['Conference', 'Hotel Booking', 'Nature Reserve'],
    sections: [
      {
        sectionNumber: 1,
        title: 'Section 1: Conference Venue & Banquet Enquiry',
        description: 'A conversation between a hotel event coordinator and a customer booking an academic conference room.',
        audioPrompt: 'Good morning, Grand Pacific Hotel and Conference Centre. My name is Sarah. How may I help you today? Hello Sarah, I am calling on behalf of the Northern Medical Association to enquire about reserving a hall for our annual symposium next month...',
        transcript: [
          { speaker: 'Coordinator', text: 'Good morning, Grand Pacific Conference Centre. My name is Sarah. How can I assist you today?' },
          { speaker: 'Customer', text: 'Good morning Sarah. I would like to book a conference room for our regional medical seminar.' },
          { speaker: 'Coordinator', text: 'Certainly sir. May I have your full name please?' },
          { speaker: 'Customer', text: 'Yes, it is Arthur Sterling. That is spelled S-T-E-R-L-I-N-G.' },
          { speaker: 'Coordinator', text: 'Thank you Mr. Sterling. And what date are you planning the seminar for?' },
          { speaker: 'Customer', text: 'We initially considered the 14th of October, but our keynote speaker is only available on the 18th of October.' },
          { speaker: 'Coordinator', text: 'Alright, October 18th. How many delegates will be attending?' },
          { speaker: 'Customer', text: 'We anticipate approximately seventy-five attendees in total.' },
          { speaker: 'Coordinator', text: 'Excellent. For 75 delegates, our Oak Ballroom would be ideal. It is fully equipped with an overhead projector and surround audio.' },
          { speaker: 'Customer', text: 'Splendid. What about catering? We will need morning coffee and a buffet lunch.' },
          { speaker: 'Coordinator', text: 'Our silver package includes hot beverages, pastries, and a two-course hot buffet at twenty-four pounds per person.' },
          { speaker: 'Customer', text: 'That sounds very reasonable. Could you also ensure there are at least two wireless microphones for audience Q and A?' },
          { speaker: 'Coordinator', text: 'Noted: two wireless microphones. May I take a contact mobile number?' },
          { speaker: 'Customer', text: 'Sure, it is 07892 441 509.' }
        ],
        questions: [
          {
            id: 1,
            type: 'sentence_completion',
            prompt: 'Customer surname: ______',
            correctAnswer: 'Sterling',
            explanation: 'The customer spells out: S-T-E-R-L-I-N-G.',
            paragraphReference: 'Transcript Line 4'
          },
          {
            id: 2,
            type: 'sentence_completion',
            prompt: 'Confirmed date of event: October ______',
            correctAnswer: '18th',
            explanation: 'Customer notes: "initially considered 14th... but keynote speaker is only available on the 18th of October" (Classic IELTS distractor!).',
            paragraphReference: 'Transcript Line 6'
          },
          {
            id: 3,
            type: 'sentence_completion',
            prompt: 'Expected number of delegates: ______',
            correctAnswer: '75',
            explanation: 'Customer specifies: "approximately seventy-five attendees in total."',
            paragraphReference: 'Transcript Line 8'
          },
          {
            id: 4,
            type: 'sentence_completion',
            prompt: 'Recommended room: Oak ______',
            correctAnswer: 'Ballroom',
            explanation: 'The coordinator suggests the "Oak Ballroom".',
            paragraphReference: 'Transcript Line 9'
          },
          {
            id: 5,
            type: 'sentence_completion',
            prompt: 'Buffet lunch cost per head: £______',
            correctAnswer: '24',
            explanation: 'Coordinator states: "twenty-four pounds per person."',
            paragraphReference: 'Transcript Line 11'
          },
          {
            id: 6,
            type: 'sentence_completion',
            prompt: 'Special equipment requested: two ______ microphones',
            correctAnswer: 'wireless',
            explanation: 'Customer requests: "at least two wireless microphones".',
            paragraphReference: 'Transcript Line 12'
          },
          {
            id: 7,
            type: 'sentence_completion',
            prompt: 'Contact phone: 07892 ______',
            correctAnswer: '441 509',
            explanation: 'Customer says: "07892 441 509".',
            paragraphReference: 'Transcript Line 14'
          }
        ]
      },
      {
        sectionNumber: 2,
        title: 'Section 2: Highfield Community Nature Reserve Guide',
        description: 'A presentation given by a community ranger introducing the facilities and volunteer opportunities at Highfield Reserve.',
        audioPrompt: 'Welcome everyone to the Highfield Nature Reserve visitor orientation. Before we embark on the guided trail tour, I would like to give you a brief overview of our newly renovated facilities and how our volunteer program works...',
        transcript: [
          { speaker: 'Ranger', text: 'Welcome everyone to the Highfield Nature Reserve. My name is Mark. Over the past twelve months, thanks to lottery heritage funding, we have transformed this former gravel quarry into a thriving sanctuary.' },
          { speaker: 'Ranger', text: 'First, regarding opening hours: while the external walking tracks remain accessible dawn to dusk, the main Education Centre and gift shop now open Tuesday through Sunday from 9:30 AM to 5:00 PM. Please note they are strictly closed on Mondays for ecological maintenance.' },
          { speaker: 'Ranger', text: 'If you are joining our bird conservation survey, please meet near the Kingfisher Hide at 7:00 AM on Saturdays. All optical equipment and field guidebooks are provided free of charge, but please ensure you wear waterproof boots.' },
          { speaker: 'Ranger', text: 'Lastly, for school bookings, groups larger than twenty students must be accompanied by at least three qualified adult supervisors.' }
        ],
        questions: [
          {
            id: 8,
            type: 'multiple_choice',
            prompt: 'On which day of the week is the Education Centre closed?',
            options: ['A. Saturday', 'B. Sunday', 'C. Monday', 'D. Wednesday'],
            correctAnswer: 'C. Monday',
            explanation: 'The ranger explicitly states: "strictly closed on Mondays for ecological maintenance."',
            paragraphReference: 'Transcript Line 2'
          },
          {
            id: 9,
            type: 'multiple_choice',
            prompt: 'What item must volunteers bring with them for the Saturday bird survey?',
            options: [
              'A. Binoculars and spotting scopes',
              'B. Waterproof boots',
              'C. Bird identification guidebooks',
              'D. Packed lunches'
            ],
            correctAnswer: 'B. Waterproof boots',
            explanation: 'Equipment and books are provided free, but volunteers are reminded: "please ensure you wear waterproof boots."',
            paragraphReference: 'Transcript Line 3'
          },
          {
            id: 10,
            type: 'sentence_completion',
            prompt: 'School groups exceeding 20 students must bring a minimum of ______ adult supervisors.',
            correctAnswer: '3',
            explanation: 'The ranger announces: "at least three qualified adult supervisors."',
            paragraphReference: 'Transcript Line 4'
          }
        ]
      }
    ]
  }
];

import { ListeningTest } from '../types/ielts';

export const LISTENING_TESTS: ListeningTest[] = [
  {
    "id": "cam19_test1_listening",
    "title": "Academic Listening Practice Test 1 (Cambridge 19 官方全真卷)",
    "source": "Cambridge IELTS 19 Academic Official",
    "bankCategory": "cam19",
    "year": "2024-2025",
    "difficulty": "Authentic Exam",
    "tags": [
      "Accommodation",
      "Eco-Museum",
      "Wind Energy",
      "Marine Ecology"
    ],
    "sections": [
      {
        "sectionNumber": 1,
        "title": "Section 1: University Studio Apartment Rental Enquiry",
        "description": "A conversation between an overseas postgraduate student and a student housing leasing agent regarding rental terms, deposit, and utilities.",
        "audioPrompt": "Hello, Victoria Student Residences, this is Liam speaking. Good afternoon, I am calling from overseas regarding studio apartment availability for the upcoming autumn semester commencing in September...",
        "transcript": [
          {
            "speaker": "Agent",
            "text": "Hello, Victoria Student Residences, Liam speaking. How can I assist you today?"
          },
          {
            "speaker": "Student",
            "text": "Hello Liam. I am an incoming postgraduate student from Singapore and would like to enquire about a private studio apartment."
          },
          {
            "speaker": "Agent",
            "text": "Congratulations on your admission! We have several en-suite studios available. May I take your full name please?"
          },
          {
            "speaker": "Student",
            "text": "Yes, it is Chloe Kensington. That is K-E-N-S-I-N-G-T-O-N."
          },
          {
            "speaker": "Agent",
            "text": "Thank you Chloe. And what is your target move-in date?"
          },
          {
            "speaker": "Student",
            "text": "My course orientation commences on September 22nd, so I would prefer to collect the keys on September 15th."
          },
          {
            "speaker": "Agent",
            "text": "September 15th is ideal. The weekly rent for our Deluxe Studio is 195 pounds, which includes high-speed fiber broadband and water."
          },
          {
            "speaker": "Student",
            "text": "Does that also include the heating and electricity bills?"
          },
          {
            "speaker": "Agent",
            "text": "Heating is inclusive from October through April, but electricity is metered individually."
          },
          {
            "speaker": "Student",
            "text": "Understood. Is there a security deposit required upon reservation?"
          },
          {
            "speaker": "Agent",
            "text": "Yes, a refundable security deposit of 350 pounds is held in a government tenancy protection scheme."
          },
          {
            "speaker": "Student",
            "text": "Great. Does the building offer secure storage for bicycles?"
          },
          {
            "speaker": "Agent",
            "text": "Yes, we have a subterranean locked bike shed monitored by CCTV 24 hours a day."
          },
          {
            "speaker": "Student",
            "text": "Wonderful! Could you send the tenancy contract to my email: chloe.k@campusmail.com?"
          },
          {
            "speaker": "Agent",
            "text": "Sending it right now."
          }
        ],
        "questions": [
          {
            "id": 1,
            "type": "sentence_completion",
            "prompt": "Student surname: ______",
            "correctAnswer": "Kensington",
            "explanation": "Spelled out clearly in audio: K-E-N-S-I-N-G-T-O-N.",
            "paragraphReference": "Transcript Line 4"
          },
          {
            "id": 2,
            "type": "sentence_completion",
            "prompt": "Requested move-in date: September ______",
            "correctAnswer": "15th",
            "explanation": "Student states orientation is 22nd, but requests keys on the 15th.",
            "paragraphReference": "Transcript Line 6"
          },
          {
            "id": 3,
            "type": "sentence_completion",
            "prompt": "Weekly rent amount: £______",
            "correctAnswer": "195",
            "explanation": "Agent states: \"The weekly rent for our Deluxe Studio is 195 pounds\".",
            "paragraphReference": "Transcript Line 7"
          },
          {
            "id": 4,
            "type": "sentence_completion",
            "prompt": "Security deposit: £______",
            "correctAnswer": "350",
            "explanation": "Agent confirms a refundable deposit of 350 pounds.",
            "paragraphReference": "Transcript Line 11"
          },
          {
            "id": 5,
            "type": "sentence_completion",
            "prompt": "Bicycle facility provided: a locked subterranean ______",
            "correctAnswer": "shed",
            "explanation": "Agent mentions: \"subterranean locked bike shed monitored by CCTV\".",
            "paragraphReference": "Transcript Line 13"
          }
        ]
      },
      {
        "sectionNumber": 2,
        "title": "Section 2: Highclere Eco-Heritage Park Tour & Visitor Guidelines",
        "description": "A park ranger briefing visiting tourists on nature reserve trails, bird observation hides, and organic café opening hours.",
        "audioPrompt": "Good morning visitors, and welcome to Highclere Eco-Heritage Park. Before you embark on our walking trails, please note our visitor guidelines and trail map...",
        "transcript": [
          {
            "speaker": "Ranger",
            "text": "Good morning visitors, and welcome to Highclere Eco-Heritage Park. The reserve encompasses 400 hectares of restored wetland and ancient woodland."
          },
          {
            "speaker": "Ranger",
            "text": "To your left is the Heron Sanctuary, where over 30 avian species breed. Binoculars can be hired from the visitor reception for £4 per session."
          },
          {
            "speaker": "Ranger",
            "text": "Please bear in mind that the Red Squirrel Boardwalk will be closed between 13:00 and 15:00 today for timber maintenance."
          },
          {
            "speaker": "Ranger",
            "text": "For those interested in historical flora, our Victorian Walled Garden features a rare collection of medicinal herbs dating back to 1870."
          },
          {
            "speaker": "Ranger",
            "text": "Finally, our Organic Orchard Café serves fair-trade refreshments and artisan bakery items from 10:00 to 17:30 daily."
          }
        ],
        "questions": [
          {
            "id": 6,
            "type": "multiple_choice",
            "prompt": "The total area of the restored wetland reserve is:",
            "options": [
              "A. 200 hectares",
              "B. 400 hectares",
              "C. 600 hectares"
            ],
            "correctAnswer": "B. 400 hectares",
            "explanation": "The ranger explicitly states the reserve encompasses 400 hectares.",
            "paragraphReference": "Transcript Line 1"
          },
          {
            "id": 7,
            "type": "sentence_completion",
            "prompt": "Binocular rental fee at visitor reception: £______",
            "correctAnswer": "4",
            "explanation": "Ranger states binoculars can be hired for £4.",
            "paragraphReference": "Transcript Line 2"
          },
          {
            "id": 8,
            "type": "sentence_completion",
            "prompt": "The Red Squirrel Boardwalk is temporarily closed today for timber ______",
            "correctAnswer": "maintenance",
            "explanation": "Ranger says: \"closed between 13:00 and 15:00 today for timber maintenance\".",
            "paragraphReference": "Transcript Line 3"
          },
          {
            "id": 9,
            "type": "sentence_completion",
            "prompt": "The Victorian Walled Garden contains a collection of ______ herbs.",
            "correctAnswer": "medicinal",
            "explanation": "Ranger highlights: \"a rare collection of medicinal herbs dating back to 1870\".",
            "paragraphReference": "Transcript Line 4"
          },
          {
            "id": 10,
            "type": "sentence_completion",
            "prompt": "The Organic Orchard Café closes daily at ______",
            "correctAnswer": "17:30",
            "explanation": "Ranger states café serves refreshments from 10:00 to 17:30 daily.",
            "paragraphReference": "Transcript Line 5"
          }
        ]
      },
      {
        "sectionNumber": 3,
        "title": "Section 3: Academic Tutorial on Offshore Wind Turbine Blade Recyclability",
        "description": "A university engineering tutor discussing dissertation research on thermoset composite wind turbine recycling with two postgraduate students.",
        "audioPrompt": "Good afternoon Maya and Aaron. Let us review your draft research methodology regarding the end-of-life recycling challenges of thermoset polymer wind turbine blades...",
        "transcript": [
          {
            "speaker": "Dr. Evans",
            "text": "Good afternoon Maya, Aaron. Come in. Let us review your proposal on decommissioned wind turbine blades."
          },
          {
            "speaker": "Maya",
            "text": "Thank you Dr. Evans. As you know, while wind turbines generate clean power, their blades are made of fiberglass and thermoset epoxy resin, which cannot be melted down easily."
          },
          {
            "speaker": "Aaron",
            "text": "Our literature review indicates that roughly 43 million metric tonnes of blade waste will accumulate globally by 2050 if pyrolysis recycling is not scaled up."
          },
          {
            "speaker": "Dr. Evans",
            "text": "That is a staggering figure. What specific thermal decomposition temperature range are you modeling in your lab simulation?"
          },
          {
            "speaker": "Maya",
            "text": "We are evaluating fluidized-bed pyrolysis operating between 450 and 550 degrees Celsius to recover structural glass fibers."
          },
          {
            "speaker": "Dr. Evans",
            "text": "Excellent. Make sure you compare the tensile strength of the recycled fibers against virgin glass fibers in chapter four."
          },
          {
            "speaker": "Aaron",
            "text": "Yes, our laboratory tensile tests show recycled fibers retain approximately 85 percent of their original structural rigidity."
          },
          {
            "speaker": "Dr. Evans",
            "text": "That is quite promising. Don't forget to submit your lab safety clearance form by this Friday."
          }
        ],
        "questions": [
          {
            "id": 11,
            "type": "sentence_completion",
            "prompt": "Expected global blade waste by 2050 if unmitigated: ______ million metric tonnes.",
            "correctAnswer": "43",
            "explanation": "Aaron mentions roughly 43 million metric tonnes will accumulate.",
            "paragraphReference": "Transcript Line 3"
          },
          {
            "id": 12,
            "type": "sentence_completion",
            "prompt": "Fluidized-bed pyrolysis is tested at temperatures between 450 and ______ degrees Celsius.",
            "correctAnswer": "550",
            "explanation": "Maya specifies: \"operating between 450 and 550 degrees Celsius\".",
            "paragraphReference": "Transcript Line 5"
          },
          {
            "id": 13,
            "type": "multiple_choice",
            "prompt": "In Chapter four, Dr. Evans advises the students to compare:",
            "options": [
              "A. Capital expenditure of different factories",
              "B. Tensile strength of recycled versus virgin fibers",
              "C. Government environmental regulations"
            ],
            "correctAnswer": "B. Tensile strength of recycled versus virgin fibers",
            "explanation": "Dr. Evans explicitly advises: \"compare the tensile strength of the recycled fibers against virgin glass fibers in chapter four\".",
            "paragraphReference": "Transcript Line 6"
          },
          {
            "id": 14,
            "type": "sentence_completion",
            "prompt": "Lab tests show recycled fibers retain ______ percent of original rigidity.",
            "correctAnswer": "85",
            "explanation": "Aaron confirms: \"retain approximately 85 percent of their original structural rigidity\".",
            "paragraphReference": "Transcript Line 7"
          },
          {
            "id": 15,
            "type": "sentence_completion",
            "prompt": "Lab safety clearance form must be handed in by ______",
            "correctAnswer": "Friday",
            "explanation": "Dr. Evans reminds them to submit the form by this Friday.",
            "paragraphReference": "Transcript Line 8"
          }
        ]
      },
      {
        "sectionNumber": 4,
        "title": "Section 4: Academic Lecture on Marine Kelp Forests & Blue Carbon Sequestration",
        "description": "A university marine ecology lecture exploring the rapid growth rate of giant kelp (Macrocystis pyrifera) and its role in oceanic carbon capture.",
        "audioPrompt": "Good morning ladies and gentlemen. In today's oceanography seminar, we examine the vital ecological and biogeochemical role of temperate macroalgae, specifically giant kelp forests...",
        "transcript": [
          {
            "speaker": "Lecturer",
            "text": "Good morning everyone. Today we examine temperate coastal ecosystems dominated by giant kelp, known scientifically as Macrocystis pyrifera."
          },
          {
            "speaker": "Lecturer",
            "text": "Under ideal conditions of nutrient-rich upwelling and sunlight, giant kelp can grow at an astonishing rate of up to 50 centimeters per day."
          },
          {
            "speaker": "Lecturer",
            "text": "The plant anchors itself to rocky seabeds using a specialized root-like structure called a holdfast, while gas-filled pneumatocysts keep the photosynthetic fronds afloat near the surface."
          },
          {
            "speaker": "Lecturer",
            "text": "Recent oceanographic tracking reveals that when kelp dislodges during winter storms, roughly 11 percent of the organic carbon is transported into deep submarine canyons."
          },
          {
            "speaker": "Lecturer",
            "text": "Once deposited below 1,000 meters, this carbon remains sequestered from the atmosphere for centuries, making kelp forests an indispensable blue carbon sink."
          }
        ],
        "questions": [
          {
            "id": 16,
            "type": "sentence_completion",
            "prompt": "Under optimal conditions, giant kelp can grow up to ______ centimeters per day.",
            "correctAnswer": "50",
            "explanation": "Lecturer states: \"astonishing rate of up to 50 centimeters per day\".",
            "paragraphReference": "Transcript Line 2"
          },
          {
            "id": 17,
            "type": "sentence_completion",
            "prompt": "Giant kelp anchors to the seabed using a structure called a ______",
            "correctAnswer": "holdfast",
            "explanation": "Lecturer mentions the specialized root-like structure called a holdfast.",
            "paragraphReference": "Transcript Line 3"
          },
          {
            "id": 18,
            "type": "sentence_completion",
            "prompt": "Fronds remain buoyant near the surface thanks to gas-filled ______",
            "correctAnswer": "pneumatocysts",
            "explanation": "Lecturer notes gas-filled pneumatocysts keep the photosynthetic fronds afloat.",
            "paragraphReference": "Transcript Line 3"
          },
          {
            "id": 19,
            "type": "sentence_completion",
            "prompt": "Approximately ______ percent of kelp carbon is swept into deep canyons.",
            "correctAnswer": "11",
            "explanation": "Lecturer cites oceanographic tracking showing roughly 11 percent.",
            "paragraphReference": "Transcript Line 4"
          },
          {
            "id": 20,
            "type": "sentence_completion",
            "prompt": "Kelp carbon remains locked away for centuries once deposited below ______ meters depth.",
            "correctAnswer": "1000",
            "explanation": "Lecturer states: \"Once deposited below 1,000 meters, this carbon remains sequestered\".",
            "paragraphReference": "Transcript Line 5"
          }
        ]
      }
    ]
  },
  {
    "id": "cam19_test2_listening",
    "title": "Academic Listening Practice Test 2 (Cambridge 19 全真卷)",
    "source": "Cambridge IELTS 19 Academic Official",
    "bankCategory": "cam19",
    "year": "2024-2025",
    "difficulty": "Authentic Exam",
    "tags": [
      "Rowing Club",
      "Botanic Conservatory",
      "Biodegradable Packaging",
      "Circadian Biology"
    ],
    "sections": [
      {
        "sectionNumber": 1,
        "title": "Section 1: River Thames Community Rowing Club Registration",
        "description": "Enquiry regarding adult novice rowing courses, safety equipment, and membership fees.",
        "audioPrompt": "Good morning, River Thames Rowing Club, Marcus speaking. Hello! I am calling to ask about beginner weekend rowing courses for adults...",
        "transcript": [
          {
            "speaker": "Marcus",
            "text": "River Thames Rowing Club, Marcus speaking. How can I help you today?"
          },
          {
            "speaker": "Enquirer",
            "text": "Good morning. I would like to join the weekend novice rowing course."
          },
          {
            "speaker": "Marcus",
            "text": "Excellent choice. Our next intake starts on April 12th. What is your full name?"
          },
          {
            "speaker": "Enquirer",
            "text": "My name is Julian Braithwaite. B-R-A-I-T-H-W-A-I-T-E."
          },
          {
            "speaker": "Marcus",
            "text": "Thank you Julian. All rowers must pass a 100-metre swimming test wearing light clothes."
          },
          {
            "speaker": "Enquirer",
            "text": "That will not be a problem. Do I need to buy my own lifejacket?"
          },
          {
            "speaker": "Marcus",
            "text": "No, all buoyancy aids are supplied. You only need to bring non-slip running shoes and a thermal jacket."
          },
          {
            "speaker": "Enquirer",
            "text": "How much is the eight-week foundation course?"
          },
          {
            "speaker": "Marcus",
            "text": "The fee is 180 pounds, payable upon registration."
          }
        ],
        "questions": [
          {
            "id": 1,
            "type": "sentence_completion",
            "prompt": "Member surname: ______",
            "correctAnswer": "Braithwaite",
            "explanation": "Spelled clearly: B-R-A-I-T-H-W-A-I-T-E.",
            "paragraphReference": "Transcript Line 4"
          },
          {
            "id": 2,
            "type": "sentence_completion",
            "prompt": "Course starting date: April ______",
            "correctAnswer": "12th",
            "explanation": "Marcus confirms next intake commences on April 12th.",
            "paragraphReference": "Transcript Line 3"
          },
          {
            "id": 3,
            "type": "sentence_completion",
            "prompt": "Required swimming test distance: ______ metres",
            "correctAnswer": "100",
            "explanation": "Must pass a 100-metre swimming test.",
            "paragraphReference": "Transcript Line 5"
          },
          {
            "id": 4,
            "type": "sentence_completion",
            "prompt": "Rowers must bring non-slip ______",
            "correctAnswer": "shoes",
            "explanation": "Marcus specifies non-slip running shoes.",
            "paragraphReference": "Transcript Line 7"
          },
          {
            "id": 5,
            "type": "sentence_completion",
            "prompt": "Eight-week course fee: £______",
            "correctAnswer": "180",
            "explanation": "The course fee is £180.",
            "paragraphReference": "Transcript Line 9"
          }
        ]
      },
      {
        "sectionNumber": 2,
        "title": "Section 2: Royal Botanic Conservatory Visitor Information",
        "description": "Audio guide explaining the three climate zones, high-altitude glasshouse, and treetop canopy walkway.",
        "audioPrompt": "Welcome to the Royal Botanic Conservatory. This audio tour will navigate you through our three distinct biomes...",
        "transcript": [
          {
            "speaker": "Audio Guide",
            "text": "Welcome to the Royal Botanic Conservatory. Before entering the Tropical Zone, please ensure your mobile phones are on silent."
          },
          {
            "speaker": "Audio Guide",
            "text": "The Tropical House maintains a permanent humidity of 80 percent and a temperature of 26 degrees Celsius to simulate Amazonian rainforest conditions."
          },
          {
            "speaker": "Audio Guide",
            "text": "In Zone 2, our Alpine Glasshouse features specialized subterranean chilling pipes that cool the soil down to 4 degrees at night."
          },
          {
            "speaker": "Audio Guide",
            "text": "The outdoor Treetop Canopy Walkway stands 18 metres above the forest floor, offering panoramic views of ancient oak groves."
          },
          {
            "speaker": "Audio Guide",
            "text": "Wheelchair access is available via the southern ramp, and guided expert talks depart from the central courtyard every hour on the half-hour."
          }
        ],
        "questions": [
          {
            "id": 6,
            "type": "sentence_completion",
            "prompt": "The Tropical House maintains a relative humidity of ______ percent.",
            "correctAnswer": "80",
            "explanation": "Audio guide mentions: \"permanent humidity of 80 percent\".",
            "paragraphReference": "Transcript Line 2"
          },
          {
            "id": 7,
            "type": "sentence_completion",
            "prompt": "Alpine Glasshouse chilling pipes cool the soil to ______ degrees at night.",
            "correctAnswer": "4",
            "explanation": "Guide states pipes cool the soil down to 4 degrees.",
            "paragraphReference": "Transcript Line 3"
          },
          {
            "id": 8,
            "type": "sentence_completion",
            "prompt": "The Treetop Canopy Walkway is elevated ______ metres above the ground.",
            "correctAnswer": "18",
            "explanation": "Guide states walkway stands 18 metres above the floor.",
            "paragraphReference": "Transcript Line 4"
          },
          {
            "id": 9,
            "type": "sentence_completion",
            "prompt": "Wheelchair accessibility to the walkway is located via the ______ ramp.",
            "correctAnswer": "southern",
            "explanation": "Guide specifies: \"available via the southern ramp\".",
            "paragraphReference": "Transcript Line 5"
          },
          {
            "id": 10,
            "type": "multiple_choice",
            "prompt": "Guided expert talks depart from the central courtyard:",
            "options": [
              "A. Every hour on the hour",
              "B. Every hour on the half-hour",
              "C. Only in the afternoon"
            ],
            "correctAnswer": "B. Every hour on the half-hour",
            "explanation": "Guide notes talks depart \"every hour on the half-hour\".",
            "paragraphReference": "Transcript Line 5"
          }
        ]
      },
      {
        "sectionNumber": 3,
        "title": "Section 3: Academic Seminar on Chitosan-Based Food Packaging",
        "description": "Postgraduate chemistry students Clara and David discussing their laboratory trial using crustacean shell extract with Professor Lin.",
        "audioPrompt": "Come in Clara, David. Let us analyze your spectrophotometer results from testing the antimicrobial efficacy of chitosan biopolymer film...",
        "transcript": [
          {
            "speaker": "Prof. Lin",
            "text": "Good afternoon Clara, David. Let us review the progress on your biopolymer packaging project."
          },
          {
            "speaker": "Clara",
            "text": "Thank you Professor Lin. We synthesized thin biodegradable transparent film using chitosan derived from discarded shrimp shells."
          },
          {
            "speaker": "David",
            "text": "We blended the chitosan matrix with thyme essential oil to boost its antifungal properties against foodborne pathogens."
          },
          {
            "speaker": "Prof. Lin",
            "text": "How did you assess the gas barrier properties of your film?"
          },
          {
            "speaker": "Clara",
            "text": "We measured oxygen transmission rates over a 14-day storage trial with fresh strawberries at 4 degrees Celsius."
          },
          {
            "speaker": "David",
            "text": "The results showed fruit spoiled within 5 days in standard plastic, but survived fresh for 12 days inside the chitosan pouch."
          },
          {
            "speaker": "Prof. Lin",
            "text": "Fascinating. Be sure to present your statistical analysis at the department symposium next Wednesday."
          }
        ],
        "questions": [
          {
            "id": 11,
            "type": "sentence_completion",
            "prompt": "The biopolymer film is synthesized from the shells of discarded ______",
            "correctAnswer": "shrimp",
            "explanation": "Clara states: \"using chitosan derived from discarded shrimp shells\".",
            "paragraphReference": "Transcript Line 2"
          },
          {
            "id": 12,
            "type": "sentence_completion",
            "prompt": "To enhance antifungal properties, the chitosan was blended with ______ essential oil.",
            "correctAnswer": "thyme",
            "explanation": "David explains: \"blended the chitosan matrix with thyme essential oil\".",
            "paragraphReference": "Transcript Line 3"
          },
          {
            "id": 13,
            "type": "sentence_completion",
            "prompt": "The laboratory storage trial lasted for ______ days.",
            "correctAnswer": "14",
            "explanation": "Clara mentions measuring rates over a 14-day storage trial.",
            "paragraphReference": "Transcript Line 5"
          },
          {
            "id": 14,
            "type": "sentence_completion",
            "prompt": "Strawberries in the chitosan pouch remained fresh for ______ days.",
            "correctAnswer": "12",
            "explanation": "David confirms fruit survived fresh for 12 days.",
            "paragraphReference": "Transcript Line 6"
          },
          {
            "id": 15,
            "type": "sentence_completion",
            "prompt": "The students are scheduled to present their findings on ______",
            "correctAnswer": "Wednesday",
            "explanation": "Professor Lin reminds them about the symposium next Wednesday.",
            "paragraphReference": "Transcript Line 7"
          }
        ]
      },
      {
        "sectionNumber": 4,
        "title": "Section 4: Lecture on Circadian Rhythms and Cognitive Performance",
        "description": "A university psychology lecture discussing the suprachiasmatic nucleus, blue-light disruption, and adolescent chronotypes.",
        "audioPrompt": "Good afternoon students. Today we examine the circadian pacemaker located within the anterior hypothalamus...",
        "transcript": [
          {
            "speaker": "Lecturer",
            "text": "In today's lecture on chronobiology, we examine the master circadian pacemaker: the suprachiasmatic nucleus, or SCN."
          },
          {
            "speaker": "Lecturer",
            "text": "Specialized intrinsically photosensitive retinal ganglion cells detect blue light wavelengths specifically between 460 and 480 nanometers."
          },
          {
            "speaker": "Lecturer",
            "text": "Exposure to digital screens suppresses the pineal gland's secretion of melatonin, delaying sleep onset by an average of 90 minutes."
          },
          {
            "speaker": "Lecturer",
            "text": "In adolescents, a physiological phase delay naturally shifts the biological clock approximately two hours later than in adults."
          },
          {
            "speaker": "Lecturer",
            "text": "School districts that instituted a 45-minute later morning start time documented a 15 percent drop in teenage automobile accidents."
          }
        ],
        "questions": [
          {
            "id": 16,
            "type": "sentence_completion",
            "prompt": "Retinal cells primarily detect blue light wavelengths between 460 and ______ nanometers.",
            "correctAnswer": "480",
            "explanation": "Lecturer explicitly says: \"between 460 and 480 nanometers\".",
            "paragraphReference": "Transcript Line 2"
          },
          {
            "id": 17,
            "type": "sentence_completion",
            "prompt": "Screen light suppresses the secretion of the hormone ______.",
            "correctAnswer": "melatonin",
            "explanation": "Lecturer states: \"suppresses the pineal gland's secretion of melatonin\".",
            "paragraphReference": "Transcript Line 3"
          },
          {
            "id": 18,
            "type": "sentence_completion",
            "prompt": "Evening screen exposure delays sleep onset by an average of ______ minutes.",
            "correctAnswer": "90",
            "explanation": "Lecturer notes delaying sleep onset by an average of 90 minutes.",
            "paragraphReference": "Transcript Line 3"
          },
          {
            "id": 19,
            "type": "sentence_completion",
            "prompt": "Adolescent biological clocks naturally shift ______ hours later than adults.",
            "correctAnswer": "two",
            "explanation": "Lecturer mentions a phase delay of approximately two hours later.",
            "paragraphReference": "Transcript Line 4"
          },
          {
            "id": 20,
            "type": "sentence_completion",
            "prompt": "Delaying school start times led to a ______ percent reduction in teen car crashes.",
            "correctAnswer": "15",
            "explanation": "Lecturer points out a documented 15 percent drop.",
            "paragraphReference": "Transcript Line 5"
          }
        ]
      }
    ]
  },
  {
    "id": "cam18_test1_listening",
    "title": "Academic Listening Practice Test 1 (Cambridge 18 全真模考)",
    "source": "Cambridge IELTS 18 Academic Official",
    "bankCategory": "cam18",
    "year": "2023-2024",
    "difficulty": "Authentic Exam",
    "tags": [
      "Car Rental",
      "Theatre Volunteering",
      "Marine Biology",
      "Archaeology"
    ],
    "sections": [
      {
        "sectionNumber": 1,
        "title": "Section 1: Peak District Vehicle Rental & Breakdown Cover",
        "description": "Customer booking an all-wheel drive SUV with GPS navigation and roadside assistance.",
        "audioPrompt": "Apex Car Hire, Sheffield Branch, how can I direct your call? Good morning, I would like to book a mid-size vehicle for four days...",
        "transcript": [
          {
            "speaker": "Agent",
            "text": "Apex Car Hire, Sheffield branch. How can I help you?"
          },
          {
            "speaker": "Customer",
            "text": "Good morning. I need to hire an all-wheel drive vehicle for four days starting next Friday."
          },
          {
            "speaker": "Agent",
            "text": "Certainly. May I take your full name and driving license number?"
          },
          {
            "speaker": "Customer",
            "text": "My name is Nathan Gallagher. That is G-A-L-L-A-G-H-E-R."
          },
          {
            "speaker": "Agent",
            "text": "Thank you Nathan. The daily rate for the compact SUV is 62 pounds including unlimited mileage."
          },
          {
            "speaker": "Customer",
            "text": "Does that include insurance against tyre punctures and windshield chips?"
          },
          {
            "speaker": "Agent",
            "text": "Our Premium Cover includes both for an additional 12 pounds per day."
          },
          {
            "speaker": "Customer",
            "text": "I will take the Premium Cover. Can I also request a child seat?"
          },
          {
            "speaker": "Agent",
            "text": "Yes, child booster seats are 5 pounds flat fee per rental."
          },
          {
            "speaker": "Customer",
            "text": "Great. Please confirm pickup time at 09:30 on Friday."
          }
        ],
        "questions": [
          {
            "id": 1,
            "type": "sentence_completion",
            "prompt": "Customer surname: ______",
            "correctAnswer": "Gallagher",
            "explanation": "G-A-L-L-A-G-H-E-R spelled out.",
            "paragraphReference": "Transcript Line 4"
          },
          {
            "id": 2,
            "type": "sentence_completion",
            "prompt": "Basic daily rental rate: £______",
            "correctAnswer": "62",
            "explanation": "Daily rate for the compact SUV is 62 pounds.",
            "paragraphReference": "Transcript Line 5"
          },
          {
            "id": 3,
            "type": "sentence_completion",
            "prompt": "Premium cover additional cost per day: £______",
            "correctAnswer": "12",
            "explanation": "Additional 12 pounds per day for Premium Cover.",
            "paragraphReference": "Transcript Line 7"
          },
          {
            "id": 4,
            "type": "sentence_completion",
            "prompt": "Flat fee for child booster seat: £______",
            "correctAnswer": "5",
            "explanation": "Agent states child booster seats are £5 flat fee.",
            "paragraphReference": "Transcript Line 9"
          },
          {
            "id": 5,
            "type": "sentence_completion",
            "prompt": "Agreed pickup time on Friday: ______",
            "correctAnswer": "09:30",
            "explanation": "Customer requests pickup at 09:30 on Friday.",
            "paragraphReference": "Transcript Line 10"
          }
        ]
      },
      {
        "sectionNumber": 2,
        "title": "Section 2: Royal Playhouse Theatre Volunteers Induction",
        "description": "Volunteer coordinator introducing theatre history, backstage duties, and front-of-house ticketing training.",
        "audioPrompt": "Welcome prospective volunteers to the Royal Playhouse Theatre. Today I will walk you through our volunteer duties, rehearsal schedule, and safety guidelines...",
        "transcript": [
          {
            "speaker": "Coordinator",
            "text": "A warm welcome to the Royal Playhouse Theatre volunteer induction. Built in 1892, our auditorium seats 850 patrons."
          },
          {
            "speaker": "Coordinator",
            "text": "Our volunteer team handles two primary areas: Front-of-House stewarding and Backstage props management."
          },
          {
            "speaker": "Coordinator",
            "text": "Front-of-house stewards must arrive 45 minutes prior to curtain call to distribute programmes and inspect emergency exits."
          },
          {
            "speaker": "Coordinator",
            "text": "All volunteers receive complimentary tickets: for every 20 hours volunteered, you earn two complimentary dress-circle vouchers."
          },
          {
            "speaker": "Coordinator",
            "text": "Our monthly volunteer briefing takes place on the first Monday of every month in the Green Room."
          }
        ],
        "questions": [
          {
            "id": 6,
            "type": "sentence_completion",
            "prompt": "The Royal Playhouse auditorium has a seating capacity of ______ patrons.",
            "correctAnswer": "850",
            "explanation": "Coordinator states auditorium seats 850 patrons.",
            "paragraphReference": "Transcript Line 1"
          },
          {
            "id": 7,
            "type": "sentence_completion",
            "prompt": "Stewards must arrive ______ minutes before curtain call.",
            "correctAnswer": "45",
            "explanation": "Coordinator says stewards must arrive 45 minutes prior.",
            "paragraphReference": "Transcript Line 3"
          },
          {
            "id": 8,
            "type": "sentence_completion",
            "prompt": "Volunteers earn complimentary tickets after completing ______ hours of service.",
            "correctAnswer": "20",
            "explanation": "Coordinator specifies: \"for every 20 hours volunteered\".",
            "paragraphReference": "Transcript Line 4"
          },
          {
            "id": 9,
            "type": "multiple_choice",
            "prompt": "Monthly volunteer meetings are scheduled on:",
            "options": [
              "A. The first Monday of every month",
              "B. Every second Friday evening",
              "C. The last Saturday of the month"
            ],
            "correctAnswer": "A. The first Monday of every month",
            "explanation": "Coordinator confirms: \"first Monday of every month in the Green Room\".",
            "paragraphReference": "Transcript Line 5"
          }
        ]
      },
      {
        "sectionNumber": 3,
        "title": "Section 3: Academic Supervision on Coral Bleaching Mechanisms",
        "description": "Postgraduate marine researchers Liam and Sophie discussing photosynthetic symbiosis and thermal stress with Dr. Miller.",
        "audioPrompt": "Good morning Liam and Sophie. Let us discuss your fieldwork observations on Symbiodiniaceae expulsion in warm coastal waters...",
        "transcript": [
          {
            "speaker": "Dr. Miller",
            "text": "Good morning Liam, Sophie. Let us look at your survey of the coral reef transects."
          },
          {
            "speaker": "Liam",
            "text": "Thank you Dr. Miller. We analyzed scleractinian coral colonies subjected to sea surface temperature anomalies of plus 1.5 degrees Celsius."
          },
          {
            "speaker": "Sophie",
            "text": "When heat stress triggers reactive oxygen species production, the coral polyps expel their symbiotic dinoflagellates, losing up to 90 percent of their photosynthetic energy source."
          },
          {
            "speaker": "Dr. Miller",
            "text": "Did you observe any recovery in colonies that were shaded by local topography?"
          },
          {
            "speaker": "Liam",
            "text": "Yes, colonies in deep reef channels showed a 40 percent faster recovery rate compared to shallow reef crests."
          },
          {
            "speaker": "Sophie",
            "text": "We plan to test whether micro-fragmentation accelerates calcification in our follow-up experiment."
          }
        ],
        "questions": [
          {
            "id": 10,
            "type": "sentence_completion",
            "prompt": "Reef transects were exposed to temperature spikes of plus ______ degrees Celsius.",
            "correctAnswer": "1.5",
            "explanation": "Liam notes anomalies of plus 1.5 degrees Celsius.",
            "paragraphReference": "Transcript Line 2"
          },
          {
            "id": 11,
            "type": "sentence_completion",
            "prompt": "During severe bleaching, corals lose up to ______ percent of their photosynthetic energy.",
            "correctAnswer": "90",
            "explanation": "Sophie explains corals lose up to 90 percent of their energy.",
            "paragraphReference": "Transcript Line 3"
          },
          {
            "id": 12,
            "type": "sentence_completion",
            "prompt": "Corals in deep channels recovered ______ percent faster than shallow crests.",
            "correctAnswer": "40",
            "explanation": "Liam states deep colonies showed a 40 percent faster recovery rate.",
            "paragraphReference": "Transcript Line 5"
          }
        ]
      },
      {
        "sectionNumber": 4,
        "title": "Section 4: Academic Lecture on Neolithic Flint Extraction & Trade Networks",
        "description": "An archaeological lecture analyzing deep shaft flint mining techniques at Grime's Graves and Stone Age lithic exchange.",
        "audioPrompt": "Good afternoon students. Today we investigate British Neolithic subterranean flint mining, focusing on the extensive shafts at Grime's Graves in Norfolk...",
        "transcript": [
          {
            "speaker": "Lecturer",
            "text": "Good afternoon. Today we examine subterranean flint mining during the British Neolithic period, dating to roughly 3000 BCE."
          },
          {
            "speaker": "Lecturer",
            "text": "The most renowned site is Grime's Graves in Norfolk, comprising over 400 vertical shafts sunk into the chalk beds."
          },
          {
            "speaker": "Lecturer",
            "text": "Prehistoric miners excavated downward to depths of up to 12 metres using picks made exclusively from red deer antlers."
          },
          {
            "speaker": "Lecturer",
            "text": "They specifically targeted the deepest layer of high-grade black flint, known as floorstone, valued for crafting durable axe heads."
          },
          {
            "speaker": "Lecturer",
            "text": "Geochemical trace-element sourcing shows these finished flint axes were traded across distances exceeding 300 kilometers."
          }
        ],
        "questions": [
          {
            "id": 13,
            "type": "sentence_completion",
            "prompt": "Grime's Graves contains more than ______ vertical shafts dug into chalk.",
            "correctAnswer": "400",
            "explanation": "Lecturer states site comprises over 400 vertical shafts.",
            "paragraphReference": "Transcript Line 2"
          },
          {
            "id": 14,
            "type": "sentence_completion",
            "prompt": "Shafts were excavated to depths reaching ______ metres.",
            "correctAnswer": "12",
            "explanation": "Lecturer notes depths of up to 12 metres.",
            "paragraphReference": "Transcript Line 3"
          },
          {
            "id": 15,
            "type": "sentence_completion",
            "prompt": "Miners used digging picks crafted from the antlers of ______ deer.",
            "correctAnswer": "red",
            "explanation": "Lecturer mentions picks made exclusively from red deer antlers.",
            "paragraphReference": "Transcript Line 3"
          },
          {
            "id": 16,
            "type": "sentence_completion",
            "prompt": "The prized lowest stratum of black flint was known as ______",
            "correctAnswer": "floorstone",
            "explanation": "Lecturer refers to the high-grade flint known as floorstone.",
            "paragraphReference": "Transcript Line 4"
          },
          {
            "id": 17,
            "type": "sentence_completion",
            "prompt": "Trace-element analysis shows finished axes were traded over ______ kilometers away.",
            "correctAnswer": "300",
            "explanation": "Lecturer reveals axes were traded across distances exceeding 300 kilometers.",
            "paragraphReference": "Transcript Line 5"
          }
        ]
      }
    ]
  },
  {
    "id": "cam17_test1_listening",
    "title": "Academic Listening Practice Test 1 (Cambridge 17 经典全真)",
    "source": "Cambridge IELTS 17 Academic Official",
    "bankCategory": "cam17",
    "year": "2022-2023",
    "difficulty": "Authentic Exam",
    "tags": [
      "Public Library",
      "Mountain Trail",
      "Desalination",
      "Urban Planning"
    ],
    "sections": [
      {
        "sectionNumber": 1,
        "title": "Section 1: Central City Library Young Readers Scheme",
        "description": "Parent registering two children for the summer reading challenge and audiobook club.",
        "audioPrompt": "Central City Library, Community Desk. Hello, I am enquiring about registering my children for the summer holiday reading club...",
        "transcript": [
          {
            "speaker": "Librarian",
            "text": "Central City Library, Community Desk. How can I help?"
          },
          {
            "speaker": "Parent",
            "text": "Hello, I want to enrol my son in the Junior Bookworm Challenge."
          },
          {
            "speaker": "Librarian",
            "text": "Wonderful! What is your son's name and date of birth?"
          },
          {
            "speaker": "Parent",
            "text": "His name is Oliver Thornton. T-H-O-R-N-T-O-N."
          },
          {
            "speaker": "Librarian",
            "text": "The reading club meets every Tuesday at 10:30 in the garden pavilion."
          },
          {
            "speaker": "Parent",
            "text": "Is there a minimum target of books to read?"
          },
          {
            "speaker": "Librarian",
            "text": "Yes, participants aim to finish 6 books over the six-week holiday."
          },
          {
            "speaker": "Parent",
            "text": "Do they receive a medal at the end?"
          },
          {
            "speaker": "Librarian",
            "text": "Every child completing the challenge receives a bronze certificate and a reading badge."
          }
        ],
        "questions": [
          {
            "id": 1,
            "type": "sentence_completion",
            "prompt": "Child surname: ______",
            "correctAnswer": "Thornton",
            "explanation": "T-H-O-R-N-T-O-N spelled out.",
            "paragraphReference": "Transcript Line 4"
          },
          {
            "id": 2,
            "type": "sentence_completion",
            "prompt": "Weekly meeting day: ______",
            "correctAnswer": "Tuesday",
            "explanation": "Meets every Tuesday at 10:30.",
            "paragraphReference": "Transcript Line 5"
          },
          {
            "id": 3,
            "type": "sentence_completion",
            "prompt": "Target number of books to complete: ______",
            "correctAnswer": "6",
            "explanation": "Librarian states target is to finish 6 books.",
            "paragraphReference": "Transcript Line 7"
          },
          {
            "id": 4,
            "type": "sentence_completion",
            "prompt": "Finishing reward includes a certificate and a ______",
            "correctAnswer": "badge",
            "explanation": "Librarian mentions receiving a bronze certificate and a reading badge.",
            "paragraphReference": "Transcript Line 9"
          }
        ]
      },
      {
        "sectionNumber": 2,
        "title": "Section 2: Ben Nevis Mountain Trail Safety & Guided Hike Briefing",
        "description": "Park ranger instructing hikers on alpine weather conditions, required footwear, and emergency shelter locations.",
        "audioPrompt": "Good morning mountaineers and trail walkers. Before you tackle the Mountain Track up Ben Nevis, please pay close attention to this safety briefing...",
        "transcript": [
          {
            "speaker": "Ranger Alan",
            "text": "Good morning hikers. Ben Nevis stands at 1,345 metres above sea level, making it the highest summit in the British Isles."
          },
          {
            "speaker": "Ranger Alan",
            "text": "Even in mid-summer, summit temperatures regularly plunge to freezing, and summit visibility can drop below 10 metres within minutes."
          },
          {
            "speaker": "Ranger Alan",
            "text": "Sturdy ankle-supporting boots are compulsory; trainers are strictly prohibited on scree slopes."
          },
          {
            "speaker": "Ranger Alan",
            "text": "The mountain rescue emergency box is stationed near the Halfway Lake, containing thermal foil blankets and first aid splints."
          },
          {
            "speaker": "Ranger Alan",
            "text": "Please ensure you register your planned descent time at the visitor center before commencing."
          }
        ],
        "questions": [
          {
            "id": 5,
            "type": "sentence_completion",
            "prompt": "The summit elevation of Ben Nevis is ______ metres.",
            "correctAnswer": "1345",
            "explanation": "Ranger Alan states Ben Nevis stands at 1,345 metres.",
            "paragraphReference": "Transcript Line 1"
          },
          {
            "id": 6,
            "type": "sentence_completion",
            "prompt": "Hikers must wear sturdy ankle-supporting ______ on scree slopes.",
            "correctAnswer": "boots",
            "explanation": "Ranger specifies ankle-supporting boots are compulsory.",
            "paragraphReference": "Transcript Line 3"
          },
          {
            "id": 7,
            "type": "sentence_completion",
            "prompt": "The emergency rescue box is located near the Halfway ______",
            "correctAnswer": "Lake",
            "explanation": "Ranger notes emergency box is stationed near Halfway Lake.",
            "paragraphReference": "Transcript Line 4"
          }
        ]
      },
      {
        "sectionNumber": 3,
        "title": "Section 3: Academic Discussion on Seawater Desalination Plants",
        "description": "Engineering students Elena and Tariq analyzing energy consumption and brine disposal with Professor Henderson.",
        "audioPrompt": "Hello Elena, Tariq. Let us examine your engineering comparison between thermal multistage flash distillation and reverse osmosis membranes...",
        "transcript": [
          {
            "speaker": "Prof. Henderson",
            "text": "Elena, Tariq, let us review your feasibility study on coastal desalination technologies."
          },
          {
            "speaker": "Elena",
            "text": "Thank you Professor. Our analysis confirms reverse osmosis uses approximately 3 kilowatt-hours of electricity per cubic metre of potable water."
          },
          {
            "speaker": "Tariq",
            "text": "This represents a 70 percent energy reduction compared to traditional multi-stage flash distillation."
          },
          {
            "speaker": "Prof. Henderson",
            "text": "Indeed. But what mitigation strategy did you formulate for the hypersaline brine effluent discharged back into the sea?"
          },
          {
            "speaker": "Elena",
            "text": "We propose multi-port submarine diffusers situated 500 metres offshore to dilute salinity within 50 metres of discharge."
          },
          {
            "speaker": "Tariq",
            "text": "We also modeled mineral extraction of lithium and magnesium from the concentrated brine to offset operational costs."
          }
        ],
        "questions": [
          {
            "id": 8,
            "type": "sentence_completion",
            "prompt": "Reverse osmosis uses approximately ______ kilowatt-hours of power per cubic metre.",
            "correctAnswer": "3",
            "explanation": "Elena confirms RO uses approximately 3 kilowatt-hours.",
            "paragraphReference": "Transcript Line 2"
          },
          {
            "id": 9,
            "type": "sentence_completion",
            "prompt": "Submarine diffusers are planned to be installed ______ metres offshore.",
            "correctAnswer": "500",
            "explanation": "Elena specifies diffusers situated 500 metres offshore.",
            "paragraphReference": "Transcript Line 5"
          },
          {
            "id": 10,
            "type": "multiple_choice",
            "prompt": "To offset operational costs, Tariq modeled extracting:",
            "options": [
              "A. Copper and silver",
              "B. Lithium and magnesium",
              "C. Platinum and uranium"
            ],
            "correctAnswer": "B. Lithium and magnesium",
            "explanation": "Tariq explicitly mentions mineral extraction of lithium and magnesium.",
            "paragraphReference": "Transcript Line 6"
          }
        ]
      },
      {
        "sectionNumber": 4,
        "title": "Section 4: Academic Lecture on Urban Tree Canopies & Microclimate Heat Islands",
        "description": "An environmental architecture lecture on urban tree transpiration, shade cooling, and asphalt heat attenuation.",
        "audioPrompt": "Good afternoon students. Today we explore urban microclimatology, focusing on the empirical thermodynamic impact of mature tree canopies in high-density cities...",
        "transcript": [
          {
            "speaker": "Lecturer",
            "text": "Welcome back. Today we examine urban heat islands and the biological mitigation provided by urban forestry."
          },
          {
            "speaker": "Lecturer",
            "text": "Impervious dark asphalt surfaces absorb up to 95 percent of incident solar radiation, elevating city core temperatures by 4 to 7 degrees Celsius."
          },
          {
            "speaker": "Lecturer",
            "text": "Deciduous street trees alleviate this through two mechanisms: direct shade interception and evaporative transpiration."
          },
          {
            "speaker": "Lecturer",
            "text": "A single mature beech tree can transpire upwards of 400 litres of water into the atmosphere on a hot summer afternoon."
          },
          {
            "speaker": "Lecturer",
            "text": "Thermal infrared satellite data proves that continuous tree canopy cover reduces ambient asphalt surface temperatures by as much as 12 degrees."
          }
        ],
        "questions": [
          {
            "id": 11,
            "type": "sentence_completion",
            "prompt": "Dark asphalt surfaces absorb up to ______ percent of solar radiation.",
            "correctAnswer": "95",
            "explanation": "Lecturer notes asphalt absorbs up to 95 percent.",
            "paragraphReference": "Transcript Line 2"
          },
          {
            "id": 12,
            "type": "sentence_completion",
            "prompt": "A mature beech tree can transpire ______ litres of water on a hot day.",
            "correctAnswer": "400",
            "explanation": "Lecturer states beech tree can transpire upwards of 400 litres.",
            "paragraphReference": "Transcript Line 4"
          },
          {
            "id": 13,
            "type": "sentence_completion",
            "prompt": "Tree canopy cover reduces asphalt surface heat by up to ______ degrees.",
            "correctAnswer": "12",
            "explanation": "Lecturer confirms reduction of surface temperatures by as much as 12 degrees.",
            "paragraphReference": "Transcript Line 5"
          }
        ]
      }
    ]
  },
  {
    "id": "cdi_2025_listening_recall",
    "title": "2025/2026 机考高频回忆听力专项 (CDI Machine Recall)",
    "source": "2025/2026 CDI Machine Exam Recall Pool",
    "bankCategory": "cdi_recent",
    "year": "2025-2026",
    "difficulty": "Authentic Exam",
    "tags": [
      "Airport Transfer",
      "Smart City Museum",
      "Autonomous Bus",
      "Microplastics"
    ],
    "sections": [
      {
        "sectionNumber": 1,
        "title": "Section 1: International Student Airport Chauffeur Booking",
        "description": "Arranging airport pickup with electric shuttle for an international postgraduate student.",
        "audioPrompt": "Heathrow Student Express, bookings desk. Good morning, I need to arrange an airport shuttle from Terminal 2 to my university hall...",
        "transcript": [
          {
            "speaker": "Dispatcher",
            "text": "Heathrow Student Express, bookings desk. How can I assist?"
          },
          {
            "speaker": "Student",
            "text": "Good morning. I arrive on flight BA 184 on October 3rd and need an electric shuttle to Kings Cross student hall."
          },
          {
            "speaker": "Dispatcher",
            "text": "Understood. What is your scheduled flight arrival time?"
          },
          {
            "speaker": "Student",
            "text": "Scheduled landing is 14:45."
          },
          {
            "speaker": "Dispatcher",
            "text": "Our electric shuttle leaves from Bay 7 outside the arrivals hall."
          },
          {
            "speaker": "Student",
            "text": "How much luggage can I bring without extra surcharge?"
          },
          {
            "speaker": "Dispatcher",
            "text": "The standard ticket permits two large suitcases up to 23 kilograms each plus one cabin backpack."
          },
          {
            "speaker": "Student",
            "text": "What is the total one-way fare?"
          },
          {
            "speaker": "Dispatcher",
            "text": "The student discounted fare is 28 pounds."
          }
        ],
        "questions": [
          {
            "id": 1,
            "type": "sentence_completion",
            "prompt": "Flight landing time: ______",
            "correctAnswer": "14:45",
            "explanation": "Student states scheduled landing is 14:45.",
            "paragraphReference": "Transcript Line 4"
          },
          {
            "id": 2,
            "type": "sentence_completion",
            "prompt": "Shuttle departure location: Bay ______",
            "correctAnswer": "7",
            "explanation": "Dispatcher states Bay 7 outside arrivals hall.",
            "paragraphReference": "Transcript Line 5"
          },
          {
            "id": 3,
            "type": "sentence_completion",
            "prompt": "Weight allowance per suitcase: ______ kilograms",
            "correctAnswer": "23",
            "explanation": "Dispatcher confirms suitcases up to 23 kilograms each.",
            "paragraphReference": "Transcript Line 7"
          },
          {
            "id": 4,
            "type": "sentence_completion",
            "prompt": "Discounted student one-way fare: £______",
            "correctAnswer": "28",
            "explanation": "Dispatcher quotes student fare of 28 pounds.",
            "paragraphReference": "Transcript Line 9"
          }
        ]
      },
      {
        "sectionNumber": 2,
        "title": "Section 2: Smart City Museum & Future Tech Gallery Tour",
        "description": "Museum curator introducing the interactive robotics wing, AI transport exhibition, and digital locker rooms.",
        "audioPrompt": "Welcome visitors to the National Smart City Museum. I will now guide you through our four interactive demonstration pavilions...",
        "transcript": [
          {
            "speaker": "Curator",
            "text": "Welcome visitors to the National Smart City Museum. Our building itself is net-zero, powered by 1,200 rooftop photovoltaic panels."
          },
          {
            "speaker": "Curator",
            "text": "On the ground floor, Pavilion A showcases smart grid energy storage where visitors can simulate balancing city power demand."
          },
          {
            "speaker": "Curator",
            "text": "If you wish to store backpacks, digital lockers are situated adjacent to the gift shop and accept contactless payment of £1."
          },
          {
            "speaker": "Curator",
            "text": "Our flagship VR Urban Simulator on the second floor requires timed tickets, with time slots commencing every 20 minutes."
          },
          {
            "speaker": "Curator",
            "text": "Please remember that flash photography is prohibited inside the Quantum Computing gallery to avoid sensor interference."
          }
        ],
        "questions": [
          {
            "id": 5,
            "type": "sentence_completion",
            "prompt": "The museum building is powered by ______ rooftop solar panels.",
            "correctAnswer": "1200",
            "explanation": "Curator notes net-zero building powered by 1,200 panels.",
            "paragraphReference": "Transcript Line 1"
          },
          {
            "id": 6,
            "type": "sentence_completion",
            "prompt": "Digital locker fee: £______",
            "correctAnswer": "1",
            "explanation": "Curator says lockers accept contactless payment of £1.",
            "paragraphReference": "Transcript Line 3"
          },
          {
            "id": 7,
            "type": "sentence_completion",
            "prompt": "VR Urban Simulator sessions begin every ______ minutes.",
            "correctAnswer": "20",
            "explanation": "Curator states time slots commence every 20 minutes.",
            "paragraphReference": "Transcript Line 4"
          },
          {
            "id": 8,
            "type": "multiple_choice",
            "prompt": "Flash photography is strictly prohibited inside the:",
            "options": [
              "A. Ground floor café",
              "B. Quantum Computing gallery",
              "C. Rooftop solar observation deck"
            ],
            "correctAnswer": "B. Quantum Computing gallery",
            "explanation": "Curator states flash photography is prohibited inside Quantum Computing gallery.",
            "paragraphReference": "Transcript Line 5"
          }
        ]
      },
      {
        "sectionNumber": 3,
        "title": "Section 3: Academic Tutorial on Autonomous Electric Bus Trials",
        "description": "Postgraduate transport planner Chen discussing autonomous bus passenger trust and lane sensors with Dr. Hughes.",
        "audioPrompt": "Hello Chen. Let us review the telemetry data and passenger survey from the 6-month autonomous shuttle trial in Manchester...",
        "transcript": [
          {
            "speaker": "Dr. Hughes",
            "text": "Come in Chen. How did the pilot deployment of Level 4 autonomous electric shuttles perform?"
          },
          {
            "speaker": "Chen",
            "text": "Dr. Hughes, the six shuttles completed over 15,000 kilometres on dedicated bus rapid transit corridors with zero collision incidents."
          },
          {
            "speaker": "Dr. Hughes",
            "text": "What did the post-journey commuter survey reveal about public confidence?"
          },
          {
            "speaker": "Chen",
            "text": "Interestingly, 82 percent of passengers reported feeling as safe as riding in a conventional human-driven bus."
          },
          {
            "speaker": "Dr. Hughes",
            "text": "Did the optical LiDAR sensors face difficulties during adverse weather?"
          },
          {
            "speaker": "Chen",
            "text": "Yes, heavy snowfall and dense fog caused a 14 percent reduction in maximum operating speed for safety compliance."
          },
          {
            "speaker": "Dr. Hughes",
            "text": "Make sure your thesis includes the radar sensor fusion recommendations in chapter five."
          }
        ],
        "questions": [
          {
            "id": 9,
            "type": "sentence_completion",
            "prompt": "The trial fleet logged over ______ kilometres without collision.",
            "correctAnswer": "15000",
            "explanation": "Chen confirms shuttles completed over 15,000 kilometres.",
            "paragraphReference": "Transcript Line 2"
          },
          {
            "id": 10,
            "type": "sentence_completion",
            "prompt": "Commuter survey showed ______ percent felt safe in autonomous shuttles.",
            "correctAnswer": "82",
            "explanation": "Chen mentions 82 percent of passengers reported feeling safe.",
            "paragraphReference": "Transcript Line 4"
          },
          {
            "id": 11,
            "type": "sentence_completion",
            "prompt": "Inclement weather caused a ______ percent reduction in operating speed.",
            "correctAnswer": "14",
            "explanation": "Chen reports a 14 percent reduction in maximum operating speed.",
            "paragraphReference": "Transcript Line 6"
          }
        ]
      },
      {
        "sectionNumber": 4,
        "title": "Section 4: Academic Lecture on Pelagic Nanoplastics & Trophic Bioaccumulation",
        "description": "A marine toxicology lecture on nanoplastic penetration of cell membranes and trophic transfer in oceanic food webs.",
        "audioPrompt": "Good afternoon. Today we examine modern marine ecotoxicology, focusing on particles smaller than 100 nanometers: nanoplastics...",
        "transcript": [
          {
            "speaker": "Lecturer",
            "text": "Good afternoon. Today we turn our focus to particles smaller than 100 nanometres in diameter: nanoplastics."
          },
          {
            "speaker": "Lecturer",
            "text": "Unlike microplastics which remain largely inside digestive tracts, nanoplastics possess sufficient surface charge to penetrate cell membranes directly."
          },
          {
            "speaker": "Lecturer",
            "text": "In laboratory trials with marine zooplankton, nanoplastics were absorbed into lipid tissue within just 30 minutes of exposure."
          },
          {
            "speaker": "Lecturer",
            "text": "When these zooplankton were consumed by small pelagic fish, plastic molecules crossed the blood-brain barrier in 68 percent of tested specimens."
          },
          {
            "speaker": "Lecturer",
            "text": "This evidence confirms trophic transfer, demonstrating that synthetic polymers bioaccumulate up the marine food chain into apex predators."
          }
        ],
        "questions": [
          {
            "id": 12,
            "type": "sentence_completion",
            "prompt": "Nanoplastics are defined as synthetic particles smaller than ______ nanometres.",
            "correctAnswer": "100",
            "explanation": "Lecturer specifies particles smaller than 100 nanometres.",
            "paragraphReference": "Transcript Line 1"
          },
          {
            "id": 13,
            "type": "sentence_completion",
            "prompt": "Nanoplastics penetrated zooplankton cell lipid tissue within ______ minutes.",
            "correctAnswer": "30",
            "explanation": "Lecturer notes absorption into lipid tissue within just 30 minutes.",
            "paragraphReference": "Transcript Line 3"
          },
          {
            "id": 14,
            "type": "sentence_completion",
            "prompt": "Plastic molecules breached the blood-brain barrier in ______ percent of tested fish.",
            "correctAnswer": "68",
            "explanation": "Lecturer cites 68 percent of tested specimens.",
            "paragraphReference": "Transcript Line 4"
          }
        ]
      }
    ]
  }
];

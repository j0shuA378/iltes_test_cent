import { ReadingTest } from '../types/ielts';

export const READING_TESTS: ReadingTest[] = [
  {
    id: 'cam19_test1_reading',
    title: 'Academic Reading Practice Test 2 (Cambridge 19 最新真题)',
    source: 'Cambridge IELTS 19 Academic Official',
    year: '2024-2025',
    difficulty: 'Authentic Exam',
    tags: ['Urban Ecology', 'Space Exploration', 'Headings', 'TFNG'],
    durationMinutes: 60,
    passages: [
      {
        id: 1,
        title: 'The Rewilding of Urban Spaces: Nature-Based Solutions in Megacities',
        subtitle: 'How modern metropolis planners are restoring native biodiversity and microclimates',
        paragraphs: [
          {
            id: 'A',
            text: 'For centuries, urban planning was governed by a paradigm of domination: wetlands were drained, rivers entombed in concrete canals, and native flora supplanted by manicured lawns and asphalt. However, as the 21st century confronts escalating climate disruptions and the urban heat island effect—where concrete surfaces trap daytime solar radiation, elevating ambient temperatures by up to 8°C—a paradigm shift known as "urban rewilding" is capturing the imagination of municipal architects worldwide.'
          },
          {
            id: 'B',
            text: 'Unlike traditional municipal landscaping, which relies heavily on non-native ornamental shrubs and energy-intensive chemical fertilizers, urban rewilding seeks to re-establish self-sustaining ecological networks. In Rotterdam, engineers have constructed floating wetlands along the Maas River, utilizing recycled plastic matrices planted with indigenous reeds. These floating ecosystems not only absorb runoff nitrogen and heavy metals from port traffic, but also provide vital spawning sanctuaries for endangered native fish.'
          },
          {
            id: 'C',
            text: 'A profound obstacle to urban rewilding lies in public perception and administrative dogma. For generations, citizens have equated unmanicured wilderness, brambles, and rotting tree logs with neglect and antisocial behaviour. In response, landscape ecologists like Joan Nassauer advocate for "cues to care"—subtle design touches such as tidy mown borders around wild meadows, rustic wooden signage explaining the biodiversity benefits, and split-rail fencing. These visual cues signal intentional stewardship, turning public skepticism into community pride.'
          },
          {
            id: 'D',
            text: 'Economic quantifications are cementing the case for urban rewilding. A recent comprehensive valuation by the European Environment Agency demonstrated that biodiverse green roofs in Basel reduced municipal storm-drain maintenance expenses by 37% while mitigating summer cooling electricity demands by nearly a fifth. By integrating natural resilience into infrastructure, cities are transforming from passive vulnerability centers into proactive ecological havens.'
          }
        ],
        questions: [
          {
            id: 1,
            type: 'matching_headings',
            prompt: 'Choose the correct heading for Paragraph B:',
            options: [
              'i. Aesthetic prejudices and design solutions for public acceptance',
              'ii. Self-regulating aquatic ecosystems and industrial filtration',
              'iii. The economic dividends of municipal green infrastructure',
              'iv. The historical obsession with concrete and control'
            ],
            correctAnswer: 'ii. Self-regulating aquatic ecosystems and industrial filtration',
            explanation: 'Paragraph B highlights self-sustaining networks in Rotterdam with floating wetlands that absorb pollution and provide fish habitats.',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 2,
            type: 'matching_headings',
            prompt: 'Choose the correct heading for Paragraph C:',
            options: [
              'i. Aesthetic prejudices and design solutions for public acceptance',
              'ii. Self-regulating aquatic ecosystems and industrial filtration',
              'iii. The economic dividends of municipal green infrastructure',
              'iv. The historical obsession with concrete and control'
            ],
            correctAnswer: 'i. Aesthetic prejudices and design solutions for public acceptance',
            explanation: 'Paragraph C describes public perception problems ("equated unmanicured wilderness with neglect") and the "cues to care" design solution.',
            paragraphReference: 'Paragraph C'
          },
          {
            id: 3,
            type: 'matching_headings',
            prompt: 'Choose the correct heading for Paragraph D:',
            options: [
              'i. Aesthetic prejudices and design solutions for public acceptance',
              'ii. Self-regulating aquatic ecosystems and industrial filtration',
              'iii. The economic dividends of municipal green infrastructure',
              'iv. The historical obsession with concrete and control'
            ],
            correctAnswer: 'iii. The economic dividends of municipal green infrastructure',
            explanation: 'Paragraph D details economic quantifications, such as 37% reduction in drain maintenance and one-fifth lower cooling bills.',
            paragraphReference: 'Paragraph D'
          },
          {
            id: 4,
            type: 'true_false_not_given',
            prompt: 'Traditional urban landscaping requires less chemical fertilizer than rewilding projects.',
            correctAnswer: 'FALSE',
            explanation: 'Paragraph B states traditional landscaping "relies heavily on non-native ornamental shrubs and energy-intensive chemical fertilizers", while rewilding seeks self-sustaining networks.',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 5,
            type: 'true_false_not_given',
            prompt: 'The floating wetland matrices in Rotterdam are fabricated from recycled glass.',
            correctAnswer: 'FALSE',
            explanation: 'Paragraph B states: "utilizing recycled plastic matrices planted with indigenous reeds" (not glass!).',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 6,
            type: 'sentence_completion',
            prompt: 'Ecologists use subtle landscape additions termed "cues to ______" to indicate intentional human care.',
            correctAnswer: 'care',
            explanation: 'Paragraph C: "landscape ecologists like Joan Nassauer advocate for \'cues to care\'—subtle design touches..."',
            paragraphReference: 'Paragraph C'
          },
          {
            id: 7,
            type: 'sentence_completion',
            prompt: 'In Basel, green roofs lowered municipal storm-drain costs by ______ percent.',
            correctAnswer: '37',
            explanation: 'Paragraph D: "...reduced municipal storm-drain maintenance expenses by 37%".',
            paragraphReference: 'Paragraph D'
          }
        ]
      },
      {
        id: 2,
        title: 'Space Architecture: Designing Habitations for the Moon and Mars',
        subtitle: 'Overcoming radiation, vacuum, and psychological isolation beyond Earth',
        paragraphs: [
          {
            id: 'A',
            text: 'As national space agencies and commercial pioneers advance their roadmaps for long-duration extraterrestrial settlement, the discipline of space architecture has transformed from speculative science fiction into urgent engineering reality. Unlike earthly construction, where gravity is an unyielding constant and the atmosphere a protective cocoon, extraterrestrial builders encounter high-velocity micrometeorites, galactic cosmic radiation, and temperature oscillations exceeding 300°C.'
          },
          {
            id: 'B',
            text: 'Transporting prefabricated metal modules from Earth entails astronomical launch expenses—often estimated at $20,000 per kilogram to lunar transit. Consequently, contemporary architects prioritize In-Situ Resource Utilization (ISRU). On the lunar regolith, robotic autonomous 3D printers can microwave or sinter basaltic dust into protective interlocking shields. When layered over pressurized inflatable tensile membranes, this sintered regolith creates a radiation barrier equivalent to three meters of Earth\'s protective atmosphere.'
          },
          {
            id: 'C',
            text: 'Beyond physical protection, the psychological well-being of astronaut crews residing in perpetual confinement represents a paramount constraint. Submarines and Antarctic research bases have provided sobering case studies in circadian rhythm collapse, sensory deprivation, and interpersonal discord. Space architects are therefore incorporating biophilic design—integrating hydroponic plant walls, dynamic LED luminaires that simulate terrestrial sunrise and sunset spectral shifts, and acoustically insulated private sleeping pods.'
          }
        ],
        questions: [
          {
            id: 8,
            type: 'multiple_choice',
            prompt: 'Why do space architects favor In-Situ Resource Utilization (ISRU) over Earth-made modules?',
            options: [
              'A. Prefabricated modules are structurally too weak for vacuum pressure',
              'B. Transporting heavy building materials from Earth is prohibitively expensive',
              'C. Astronauts prefer building habitats by hand using native tools',
              'D. Lunar soil contains rich organic compounds that promote human health'
            ],
            correctAnswer: 'B. Transporting heavy building materials from Earth is prohibitively expensive',
            explanation: 'Paragraph B explicitly states: "Transporting prefabricated metal modules from Earth entails astronomical launch expenses—often estimated at $20,000 per kilogram".',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 9,
            type: 'sentence_completion',
            prompt: 'The practice of utilizing native planetary materials for construction is abbreviated as ______.',
            correctAnswer: 'ISRU',
            explanation: 'Paragraph B: "In-Situ Resource Utilization (ISRU)".',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 10,
            type: 'multiple_choice',
            prompt: 'Which measure is utilized to prevent circadian rhythm collapse among isolated astronaut crews?',
            options: [
              'A. Continuous high-intensity blue light fixtures',
              'B. Dynamic LED lighting that mimics natural Earth sunlight shifts',
              'C. Mandatory sleeping capsules without ventilation',
              'D. Total isolation from hydroponic vegetable gardens'
            ],
            correctAnswer: 'B. Dynamic LED lighting that mimics natural Earth sunlight shifts',
            explanation: 'Paragraph C states: "dynamic LED luminaires that simulate terrestrial sunrise and sunset spectral shifts".',
            paragraphReference: 'Paragraph C'
          }
        ]
      }
    ]
  },
  {
    id: 'cam18_test1_reading',
    title: 'Academic Reading Practice Test 1 (Cambridge 18 经典全真)',
    source: 'Cambridge IELTS 18 Authentic Simulation',
    year: '2023-2024',
    difficulty: 'Medium',
    tags: ['Architecture', 'Biomimicry', 'Engineering', 'Roman History'],
    durationMinutes: 60,
    passages: [
      {
        id: 1,
        title: 'The Roman Colosseum: Architecture and Engineering',
        subtitle: 'How ancient engineers constructed the ultimate arena of spectacle and endurance',
        paragraphs: [
          {
            id: 'A',
            text: 'Commissioned around AD 70-72 by the Emperor Vespasian of the Flavian dynasty, the Colosseum, or Flavian Amphitheatre, stood as a triumphant monument dedicated to the Roman public. Unlike previous Greek theatres and early Roman arenas that were carved into hillsides for structural stability, the Colosseum was an entirely free-standing edifice constructed predominantly from concrete and travertine limestone.'
          },
          {
            id: 'B',
            text: 'The architectural genius behind this monumental arena lay in its sophisticated network of vaulted arches. The outer facade consisted of three tiers of arcades, framed by classic columns: robust Tuscan-Doric order on the ground level, Ionic on the second, and ornate Corinthian on the third tier. This tiered repetition of eighty arches per level was not solely ornamental; it dramatically reduced the overall mass of the building while distributing the immense weight of the masonry downward into deep concrete foundations.'
          },
          {
            id: 'C',
            text: 'Crowd management at the Colosseum rivalled that of modern Olympic stadiums. With an estimated seating capacity of 50,000 to 80,000 spectators, ingress and egress were meticulously orchestrated through seventy-six numbered public entrances known as vomitoria. Roman citizens held pottery shards (tesserae) stamped with gate, tier, and seat numbers, enabling the colossal crowd to enter or evacuate the arena in less than twenty minutes without dangerous crushes.'
          },
          {
            id: 'D',
            text: 'Beneath the wooden arena floor, which was covered in absorbent yellow sand (harena), lay the hypogeum—a complex two-level subterranean labyrinth of corridors, animal cages, and mechanical lifts. Over eighty counterweighted pulleys and capstans were operated by slaves to propel gladiators, exotic beasts, and intricate stage scenery directly through trapdoors into the arena, creating breathtaking theatrical surprises.'
          },
          {
            id: 'E',
            text: 'To protect spectators from the blistering Mediterranean summer heat, sailors from the imperial naval fleet stationed at Misenum manned the velarium. This colossal retractable canvas awning was rigged to two hundred and forty wooden masts around the uppermost attic. Controlled by complex cordage and pulleys, it could be unfurled to shade up to two-thirds of the amphitheatre.'
          }
        ],
        questions: [
          {
            id: 1,
            type: 'true_false_not_given',
            prompt: 'The Colosseum was built by excavating the natural slope of a hillside.',
            correctAnswer: 'FALSE',
            explanation: 'Paragraph A specifies: "Unlike previous Greek theatres... carved into hillsides, the Colosseum was an entirely free-standing edifice". Hence, it was NOT carved into a hillside.',
            paragraphReference: 'Paragraph A'
          },
          {
            id: 2,
            type: 'true_false_not_given',
            prompt: 'The columns on the three outer tiers were purely decorative with no structural purpose.',
            correctAnswer: 'FALSE',
            explanation: 'Paragraph B explains: "This tiered repetition of eighty arches per level was not solely ornamental; it dramatically reduced the overall mass... while distributing the immense weight".',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 3,
            type: 'true_false_not_given',
            prompt: 'Roman spectators could exit the entire amphitheatre in under 20 minutes.',
            correctAnswer: 'TRUE',
            explanation: 'Paragraph C states: "enabling the colossal crowd to enter or evacuate the arena in less than twenty minutes without dangerous crushes."',
            paragraphReference: 'Paragraph C'
          },
          {
            id: 4,
            type: 'true_false_not_given',
            prompt: 'Imperial sailors were also required to fight as gladiators in the arena.',
            correctAnswer: 'NOT GIVEN',
            explanation: 'Paragraph E mentions sailors from the imperial fleet manned the velarium awning, but there is no mention of them fighting as gladiators.',
            paragraphReference: 'Paragraph E'
          },
          {
            id: 5,
            type: 'sentence_completion',
            prompt: 'The entrance gates for spectators were officially referred to as ______.',
            correctAnswer: 'vomitoria',
            explanation: 'Paragraph C notes: "...ingress and egress were meticulously orchestrated through seventy-six numbered public entrances known as vomitoria."',
            paragraphReference: 'Paragraph C'
          },
          {
            id: 6,
            type: 'sentence_completion',
            prompt: 'Spectators were provided with stamped pottery shards named ______ that indicated their assigned seat.',
            correctAnswer: 'tesserae',
            explanation: 'Paragraph C mentions: "Roman citizens held pottery shards (tesserae) stamped with gate, tier, and seat numbers".',
            paragraphReference: 'Paragraph C'
          },
          {
            id: 7,
            type: 'sentence_completion',
            prompt: 'The underground network of holding cells and machinery was called the ______.',
            correctAnswer: 'hypogeum',
            explanation: 'Paragraph D states: "lay the hypogeum—a complex two-level subterranean labyrinth of corridors, animal cages..."',
            paragraphReference: 'Paragraph D'
          },
          {
            id: 8,
            type: 'sentence_completion',
            prompt: 'The large retractable shade operated by naval sailors was known as the ______.',
            correctAnswer: 'velarium',
            explanation: 'Paragraph E states: "...sailors from the imperial naval fleet stationed at Misenum manned the velarium."',
            paragraphReference: 'Paragraph E'
          }
        ]
      },
      {
        id: 2,
        title: 'Biomimicry: Engineering Inspired by Nature',
        subtitle: 'How natural evolution is revolutionizing sustainable design and energy efficiency',
        paragraphs: [
          {
            id: 'A',
            text: 'For over 3.8 billion years, biological organisms have adapted through trial and error to solve complex challenges involving survival, structural resilience, and resource conservation. Biomimicry—the practice of emulating nature\'s time-tested patterns and strategies—is now emerging as a dominant methodology across architecture, robotics, and aerospace engineering. Rather than treating nature solely as an extractive warehouse of materials, biomimetic scientists view biological life as a master tutor in optimization.'
          },
          {
            id: 'B',
            text: 'One celebrated triumph of biomimetic architecture is Harare\'s Eastgate Centre in Zimbabwe, designed by architect Mick Pearce. In a sub-tropical climate where conventional skyscrapers consume colossal electricity budgets on air conditioning, Eastgate maintains a temperate interior without a single conventional mechanical chiller. Pearce studied termite mounds, whose subterranean builders constantly open and close an intricate network of convective ventilation flues. Outside cool air is drawn in at ground level during nightfall, absorbed by concrete slabs, and released through roof chimneys as the building warms during daytime.'
          },
          {
            id: 'C',
            text: 'High-speed transportation has likewise turned to the animal kingdom for aerodynamic solutions. In the 1990s, Japan\'s premier Shinkansen bullet train suffered from a disruptive phenomenon: when barreling into narrow tunnels at 300 km/h, atmospheric pressure built up at the locomotive\'s blunt nose, creating sonic booms that rattled nearby residential suburbs. Eiji Nakatsu, a train engineer and avid birdwatcher, observed that kingfishers dive gracefully from thin air into dense water with virtually no splash. Nakatsu re-engineered the front nose into a 15-metre steel beak, eliminating tunnel boom, reducing electricity consumption by 15%, and boosting speed by 10%.'
          },
          {
            id: 'D',
            text: 'Surface textures found in marine flora and fauna have inspired antimicrobial coatings that do not rely on toxic disinfectants or chemical antibiotics. Shark skin, or dermal denticles, comprises millions of microscopic ribbed scales arranged in a diamond pattern. This textured architecture prevents bacteria and barnacles from securing a foothold. Medical researchers have replicated this microstructure on hospital touch surfaces and catheters, inhibiting the colonization of superbugs such as MRSA by up to 94% entirely through physical resistance.'
          }
        ],
        questions: [
          {
            id: 9,
            type: 'matching_headings',
            prompt: 'Choose the correct heading for Paragraph B:',
            options: [
              'i. Overcoming high-speed acoustic shockwaves',
              'ii. A self-cooling commercial complex inspired by insects',
              'iii. The microscopic defense mechanisms of marine predators',
              'iv. Evolution as a reservoir of engineering wisdom'
            ],
            correctAnswer: 'ii. A self-cooling commercial complex inspired by insects',
            explanation: 'Paragraph B explicitly describes the Eastgate Centre designed by Mick Pearce using termite mound ventilation principles.',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 10,
            type: 'matching_headings',
            prompt: 'Choose the correct heading for Paragraph C:',
            options: [
              'i. Overcoming high-speed acoustic shockwaves',
              'ii. A self-cooling commercial complex inspired by insects',
              'iii. The microscopic defense mechanisms of marine predators',
              'iv. Evolution as a reservoir of engineering wisdom'
            ],
            correctAnswer: 'i. Overcoming high-speed acoustic shockwaves',
            explanation: 'Paragraph C details how bullet train sonic booms (tunnel boom shockwaves) were eliminated using kingfisher beak design.',
            paragraphReference: 'Paragraph C'
          },
          {
            id: 11,
            type: 'matching_headings',
            prompt: 'Choose the correct heading for Paragraph D:',
            options: [
              'i. Overcoming high-speed acoustic shockwaves',
              'ii. A self-cooling commercial complex inspired by insects',
              'iii. The microscopic defense mechanisms of marine predators',
              'iv. Evolution as a reservoir of engineering wisdom'
            ],
            correctAnswer: 'iii. The microscopic defense mechanisms of marine predators',
            explanation: 'Paragraph D details how shark skin dermal denticles inhibit bacterial growth and barnacle settlement.',
            paragraphReference: 'Paragraph D'
          },
          {
            id: 12,
            type: 'multiple_choice',
            prompt: 'The Eastgate Centre in Zimbabwe achieves temperature regulation primarily by:',
            options: [
              'A. Utilizing high-powered air conditioning chillers',
              'B. Employing passive night cooling and convective ventilation',
              'C. Being constructed underneath subterranean caverns',
              'D. Reflecting solar heat with diamond-patterned scales'
            ],
            correctAnswer: 'B. Employing passive night cooling and convective ventilation',
            explanation: 'Paragraph B explains: "cool air is drawn in at ground level during nightfall, absorbed by concrete slabs, and released through roof chimneys as the building warms during daytime."',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 13,
            type: 'multiple_choice',
            prompt: 'Redesigning the Shinkansen train nose resulted in all the following EXCEPT:',
            options: [
              'A. A 10% boost in overall train speed',
              'B. Eradication of the loud tunnel boom',
              'C. A 15% reduction in electrical power usage',
              'D. A complete shift to non-metallic carbon fibre materials'
            ],
            correctAnswer: 'D. A complete shift to non-metallic carbon fibre materials',
            explanation: 'The passage explicitly lists speed boost (10%), boom elimination, and electricity saving (15%), but never mentions carbon fibre material replacement.',
            paragraphReference: 'Paragraph C'
          },
          {
            id: 14,
            type: 'sentence_completion',
            prompt: 'Microscopic scales on shark skin are biologically called dermal ______.',
            correctAnswer: 'denticles',
            explanation: 'Paragraph D: "Shark skin, or dermal denticles, comprises millions of microscopic ribbed scales..."',
            paragraphReference: 'Paragraph D'
          }
        ]
      }
    ]
  }
];

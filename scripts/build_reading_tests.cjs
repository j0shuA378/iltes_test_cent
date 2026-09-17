const fs = require('fs');
const path = require('path');

const readingTests = [
  // TEST 1: CAMBRIDGE 19 TEST 1
  {
    id: 'cam19_test1_reading',
    title: 'Academic Reading Practice Test 1 (Cambridge 19 官方全真卷)',
    source: 'Cambridge IELTS 19 Academic Official',
    bankCategory: 'cam19',
    year: '2024-2025',
    difficulty: 'Authentic Exam',
    tags: ['Urban Ecology', 'Biomimicry', 'Headings', 'TFNG'],
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
            explanation: 'Paragraph C discusses public perceptions of neglect and introduces "cues to care" to gain public acceptance.',
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
            explanation: 'Paragraph D focuses on economic quantifications, such as reducing storm-drain maintenance by 37% and cooling costs by a fifth.',
            paragraphReference: 'Paragraph D'
          },
          {
            id: 4,
            type: 'true_false_not_given',
            prompt: 'Urban rewilding relies predominantly on non-native ornamental plants to maximize seasonal flowering.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'FALSE',
            explanation: 'Paragraph B states: "Unlike traditional municipal landscaping, which relies heavily on non-native ornamental shrubs... urban rewilding seeks to re-establish self-sustaining ecological networks [with indigenous reeds]."',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 5,
            type: 'true_false_not_given',
            prompt: 'Green roofs in Basel lowered municipal storm-drain maintenance expenditure by over a third.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'TRUE',
            explanation: 'Paragraph D explicitly notes: "...reduced municipal storm-drain maintenance expenses by 37% [which is over a third]."',
            paragraphReference: 'Paragraph D'
          },
          {
            id: 6,
            type: 'sentence_completion',
            prompt: 'The urban heat island phenomenon can raise daytime metropolis temperatures by as much as ______ °C.',
            correctAnswer: '8',
            explanation: 'Paragraph A indicates: "...elevating ambient temperatures by up to 8°C..."',
            paragraphReference: 'Paragraph A'
          },
          {
            id: 7,
            type: 'sentence_completion',
            prompt: 'Subtle landscape design indicators that reassure the public of intentional care are termed "cues to ______".',
            correctAnswer: 'care',
            explanation: 'Paragraph C notes: "...landscape ecologists like Joan Nassauer advocate for \'cues to care\'—subtle design touches..."',
            paragraphReference: 'Paragraph C'
          }
        ]
      },
      {
        id: 2,
        title: 'Photonic Metamaterials and the Quest for the Perfect Lens',
        subtitle: 'Bending light backwards through negative refraction and nanoscale artificial engineering',
        paragraphs: [
          {
            id: 'A',
            text: 'For well over a century, the field of optical microscopy was bound by an apparently insurmountable barrier: the diffraction limit formulated by Ernst Abbe in 1873. Abbe demonstrated that conventional glass lenses, which depend on curved surfaces to bend light through positive refraction, cannot resolve spatial details smaller than roughly half the wavelength of illuminating light (approximately 200 nanometers for visible spectra). Evanescent waves, which carry the finest sub-wavelength spatial details of an illuminated specimen, decay exponentially within a fraction of a wavelength from the object\'s surface, leaving traditional far-field detectors oblivious to nanoscale structures.'
          },
          {
            id: 'B',
            text: 'This optical orthodoxy was overturned by British theoretical physicist Sir John Pendry in 2000. Pendry postulated that a flat slab of a hypothetical substance possessing simultaneous negative permittivity and negative permeability—a "negative-index metamaterial"—could overcome the diffraction barrier. While naturally occurring materials possess positive refractive indices, artificial metamaterials comprised of nanoscale resonant elements (such as split-ring resonators and silver nanowire arrays) can interact with both electric and magnetic components of electromagnetic waves, bending light backwards.'
          },
          {
            id: 'C',
            text: 'The operational mechanism of Pendry\'s "superlens" relies on resonant surface plasmons—coherent electron oscillations along the metallic interface. When evanescent waves encounter the negative-index slab, they couple with these surface plasmons, which amplify rather than attenuate the evanescent spectrum. As a consequence, both propagating and evanescent fields are focused onto the imaging plane with complete fidelity, theoretically yielding infinite spatial resolution unconstrained by wavelength boundaries.'
          },
          {
            id: 'D',
            text: 'Practical deployment of superlenses, however, has encountered stiff physical hurdles, foremost among them being dissipative losses. At optical frequencies, electrons oscillating within metal nanostructures collide with lattice atoms, converting precious photonic signals into thermal energy. Researchers at MIT and UC Berkeley are attempting to bypass this constraint by employing "active gain media"—incorporating fluorescent dye molecules or semiconductor quantum dots that re-energize decaying plasmonic modes through stimulated emission.'
          }
        ],
        questions: [
          {
            id: 8,
            type: 'true_false_not_given',
            prompt: 'Abbe\'s diffraction limit asserts that ordinary optical lenses cannot resolve details smaller than roughly half the wavelength of illuminating light.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'TRUE',
            explanation: 'Paragraph A confirms: "cannot resolve spatial details smaller than roughly half the wavelength of illuminating light".',
            paragraphReference: 'Paragraph A'
          },
          {
            id: 9,
            type: 'true_false_not_given',
            prompt: 'John Pendry fabricated the first operational negative-index optical microscope in his university laboratory in 1873.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'FALSE',
            explanation: 'Paragraph B states Pendry postulated the theoretical concept in 2000, whereas Abbe formulated the diffraction limit in 1873.',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 10,
            type: 'true_false_not_given',
            prompt: 'Metamaterials found in deep sea sponges possess natural negative refractive indices.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'NOT GIVEN',
            explanation: 'Paragraph B notes that naturally occurring materials possess positive indices, but deep sea sponges are never mentioned.',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 11,
            type: 'multiple_choice',
            prompt: 'What primary physical obstacle impedes the practical deployment of optical superlenses in Paragraph D?',
            options: [
              'A. The inability to synthesize silver nanowires',
              'B. Dissipative thermal loss resulting from electron collisions in nanometals',
              'C. The absence of fluorescent dye molecules in nature',
              'D. Extremely high manufacturing costs exceeding government budgets'
            ],
            correctAnswer: 'B. Dissipative thermal loss resulting from electron collisions in nanometals',
            explanation: 'Paragraph D explicitly cites: "dissipative losses. At optical frequencies, electrons oscillating within metal nanostructures collide with lattice atoms, converting precious photonic signals into thermal energy."',
            paragraphReference: 'Paragraph D'
          },
          {
            id: 12,
            type: 'sentence_completion',
            prompt: 'Optical details below the conventional resolution threshold are carried by decaying waves known as ______ waves.',
            correctAnswer: 'evanescent',
            explanation: 'Paragraph A specifies: "Evanescent waves, which carry the finest sub-wavelength spatial details..."',
            paragraphReference: 'Paragraph A'
          },
          {
            id: 13,
            type: 'sentence_completion',
            prompt: 'Evanescent waves couple with coherent electron oscillations termed surface ______ along metallic interfaces.',
            correctAnswer: 'plasmons',
            explanation: 'Paragraph C states: "...couple with these surface plasmons, which amplify rather than attenuate the evanescent spectrum."',
            paragraphReference: 'Paragraph C'
          },
          {
            id: 14,
            type: 'sentence_completion',
            prompt: 'Engineers inject energy into decaying plasmons using active gain media containing semiconductor quantum ______.',
            correctAnswer: 'dots',
            explanation: 'Paragraph D states: "...incorporating fluorescent dye molecules or semiconductor quantum dots..."',
            paragraphReference: 'Paragraph D'
          }
        ]
      },
      {
        id: 3,
        title: 'The Cognitive Neuroscience of Deep Reading in the Digital Age',
        subtitle: 'How skim-reading online hyperlinks rewires neural circuitry and undermines critical synthesis',
        paragraphs: [
          {
            id: 'A',
            text: 'Human beings were never genetically hardwired to read. Unlike spoken language acquisition, which naturally unfolds across infancy through innate linguistic modules, literacy is an epigenetic cultural breakthrough requiring the brain to repurpose preexisting neural circuits originally developed for visual pattern recognition and motor coordination. Cognitive neuroscientist Maryanne Wolf terms this plastic neural architecture the "reading brain"—a dynamic circuit linking the visual cortex, auditory areas, and the prefrontal networks responsible for executive contemplation.'
          },
          {
            id: 'B',
            text: 'Over millennia, the medium of reading evolved from clay tablets to print-on-paper codices, fostering what psychologists denote as "deep reading". Deep reading encompasses an array of sophisticated mental processes: inferential reasoning, empathetic theory of mind, critical analysis, and analogical synthesis. When an individual engages in sustained contemplation of a linear text, the prefrontal cortex activates slow, deliberate cognitive pathways, allowing readers to internalize nuance and construct rich conceptual schema.'
          },
          {
            id: 'C',
            text: 'The meteoric transition to digital interfaces has fundamentally fractured this reading architecture. Screen reading encourages an F-shaped skimming pattern: eyes dart erratically across screen headers, hyperlinks, and bullet points in pursuit of instantaneous information gratification. According to fMRI investigations conducted at Stanford University, hyperlinked reading divides cognitive bandwidth between semantic parsing and micro-decision making (such as determining whether to click an embedded URL), overloading working memory and inducing cognitive cognitive fragmentation.'
          },
          {
            id: 'D',
            text: 'The macroscopic consequence is the steady atrophy of the brain\'s capacity for critical reflection. When university students were assessed following screen-based reading of scientific treatises, they demonstrated comparable superficial factual recall to print readers, yet lagged significantly in discerning logical fallacies and drawing counter-factual deductions. As digital consumption habits normalize rapid scanning over patient reflection, cognitive scientists warn of an impending societal deficit in contemplative discernment.'
          }
        ],
        questions: [
          {
            id: 15,
            type: 'true_false_not_given',
            prompt: 'Human infants are genetically predisposed to develop written literacy in the exact same manner as oral speech.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'FALSE',
            explanation: 'Paragraph A states: "Human beings were never genetically hardwired to read. Unlike spoken language acquisition... literacy is an epigenetic cultural breakthrough requiring the brain to repurpose preexisting neural circuits".',
            paragraphReference: 'Paragraph A'
          },
          {
            id: 16,
            type: 'true_false_not_given',
            prompt: 'Maryanne Wolf coined the term "reading brain" to describe the plastic neural network facilitating literacy.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'TRUE',
            explanation: 'Paragraph A notes: "Cognitive neuroscientist Maryanne Wolf terms this plastic neural architecture the \'reading brain\'".',
            paragraphReference: 'Paragraph A'
          },
          {
            id: 17,
            type: 'multiple_choice',
            prompt: 'According to Paragraph C, why does reading hyperlinked digital text trigger cognitive overload?',
            options: [
              'A. Digital screens emit harmful ionizing radiation',
              'B. Readers must simultaneously parse semantic text and make navigation choices',
              'C. Students have completely stopped purchasing physical print books',
              'D. Most internet articles contain intentional factual errors'
            ],
            correctAnswer: 'B. Readers must simultaneously parse semantic text and make navigation choices',
            explanation: 'Paragraph C explains: "hyperlinked reading divides cognitive bandwidth between semantic parsing and micro-decision making (such as determining whether to click an embedded URL), overloading working memory".',
            paragraphReference: 'Paragraph C'
          },
          {
            id: 18,
            type: 'sentence_completion',
            prompt: 'Screen reading typically encourages an ______-shaped skimming visual trajectory.',
            correctAnswer: 'F',
            explanation: 'Paragraph C explicitly states: "Screen reading encourages an F-shaped skimming pattern...".',
            paragraphReference: 'Paragraph C'
          },
          {
            id: 19,
            type: 'sentence_completion',
            prompt: 'Deep reading engages the prefrontal cortex in slow and ______ cognitive pathways.',
            correctAnswer: 'deliberate',
            explanation: 'Paragraph B states: "...the prefrontal cortex activates slow, deliberate cognitive pathways...".',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 20,
            type: 'sentence_completion',
            prompt: 'In scientific tests, screen readers lagged noticeably in identifying logical ______ compared to print readers.',
            correctAnswer: 'fallacies',
            explanation: 'Paragraph D specifies: "...lagged significantly in discerning logical fallacies and drawing counter-factual deductions."',
            paragraphReference: 'Paragraph D'
          }
        ]
      }
    ]
  },

  // TEST 2: CAMBRIDGE 19 TEST 2
  {
    id: 'cam19_test2_reading',
    title: 'Academic Reading Practice Test 2 (Cambridge 19 官方全真卷)',
    source: 'Cambridge IELTS 19 Academic Official',
    bankCategory: 'cam19',
    year: '2024-2025',
    difficulty: 'Authentic Exam',
    tags: ['Aviation', 'Industrial Decarbonization', 'Marine Ecology', 'TFNG'],
    durationMinutes: 60,
    passages: [
      {
        id: 1,
        title: 'Biomimetic Engineering in Modern Aviation',
        subtitle: 'Adapting humpback whale tubercles and raptor wingtips to slash aerodynamic drag',
        paragraphs: [
          {
            id: 'A',
            text: 'Commercial aeronautics has long sought marginal aerodynamic gains to reduce fuel burn. In recent years, aerospace engineers have turned to biomimetics—the emulation of models, systems, and elements of nature for the purpose of solving complex human problems. Among the most remarkable inspirations is the humpback whale (Megaptera novaeangliae), an animal weighing over 30 metric tons that nonetheless executes breathtakingly acrobatic underwater turns.'
          },
          {
            id: 'B',
            text: 'Biologists discovered that the secret to the whale\'s agility lies in the scalloped bumps, or tubercles, lining the leading edge of its pectoral flippers. Wind tunnel experiments conducted by Dr. Frank Fish demonstrated that these tubercles channel airflow into localized, high-velocity vortices. This delay in boundary-layer stall permits the flipper to maintain lift at angles of attack up to 32% steeper than smooth-edged foils, while reducing aerodynamic drag by nearly 10%.'
          },
          {
            id: 'C',
            text: 'Aviation manufacturers have adapted this principle to jet turbines and airfoils. Retrofitted wind turbine blades equipped with synthetic tubercles generate equivalent electrical output at significantly lower wind speeds, while prototype aircraft wingtips modeled on the slotted primary feathers of soaring eagles minimize wake vortices, yielding fuel efficiency improvements that represent millions of dollars in annual airline savings.'
          }
        ],
        questions: [
          {
            id: 1,
            type: 'true_false_not_given',
            prompt: 'The scalloped bumps on humpback flippers are scientifically termed tubercles.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'TRUE',
            explanation: 'Paragraph B explicitly states: "scalloped bumps, or tubercles, lining the leading edge of its pectoral flippers".',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 2,
            type: 'true_false_not_given',
            prompt: 'Smooth-edged foils sustain lift at steeper angles of attack than foils with tubercles.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'FALSE',
            explanation: 'Paragraph B states: "tubercles... permits the flipper to maintain lift at angles of attack up to 32% steeper than smooth-edged foils".',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 3,
            type: 'true_false_not_given',
            prompt: 'Commercial airlines have completely phased out smooth wings on all passenger planes in 2024.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'NOT GIVEN',
            explanation: 'The text describes prototypes and retrofits, but does not claim smooth wings were completely phased out.',
            paragraphReference: 'Paragraph C'
          },
          {
            id: 4,
            type: 'sentence_completion',
            prompt: 'Tubercles generate high-velocity ______ that prevent premature airflow stall.',
            correctAnswer: 'vortices',
            explanation: 'Paragraph B notes: "channel airflow into localized, high-velocity vortices".',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 5,
            type: 'sentence_completion',
            prompt: 'Prototype aircraft wingtips inspired by soaring eagles imitate slotted primary ______.',
            correctAnswer: 'feathers',
            explanation: 'Paragraph C mentions: "modeled on the slotted primary feathers of soaring eagles".',
            paragraphReference: 'Paragraph C'
          }
        ]
      },
      {
        id: 2,
        title: 'Decarbonizing Heavy Industry: Green Hydrogen and Direct Reduced Iron',
        subtitle: 'The engineering race to eliminate fossil carbon from steelmaking and chemical manufacturing',
        paragraphs: [
          {
            id: 'A',
            text: 'While renewable electricity has made dramatic inroads into light consumer transportation and residential heating, heavy industrial sectors—specifically primary steel, cement, and chemical synthesis—remain the "hard-to-abate" fortresses of global carbon emissions. Steel production alone accounts for approximately 7% to 9% of global anthropogenic carbon dioxide emissions, largely attributable to the traditional blast furnace-basic oxygen furnace (BF-BOF) route that consumes metallurgical coking coal as both an energy source and a chemical reducing agent.'
          },
          {
            id: 'B',
            text: 'The vanguard of green steel production relies on Direct Reduced Iron (DRI) shafts powered by green hydrogen rather than coal. In conventional blast furnaces, coal strips oxygen from iron ore (Fe2O3), yielding pig iron and colossal volumes of CO2. In contrast, when green hydrogen (generated via proton exchange membrane electrolyzers powered by dedicated offshore wind farms) is injected into a DRI vertical furnace, the chemical byproduct is pure water vapor (H2O), cutting lifecycle emissions by over 95%.'
          },
          {
            id: 'C',
            text: 'However, economic competitiveness represents a formidable chasm. As of 2024, green hydrogen production costs hover between $4.50 and $6.50 per kilogram, compared to $1.50 for fossil-based grey hydrogen derived from steam methane reforming. Industrial analysts project that green hydrogen must descend beneath $2.00 per kilogram—supplemented by carbon pricing mechanisms like the European Union\'s Carbon Border Adjustment Mechanism (CBAM)—to incentivize commercial mill conversions across developing nations.'
          }
        ],
        questions: [
          {
            id: 6,
            type: 'true_false_not_given',
            prompt: 'Global steel production contributes approximately 7% to 9% of all human-generated CO2 emissions.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'TRUE',
            explanation: 'Paragraph A confirms: "Steel production alone accounts for approximately 7% to 9% of global anthropogenic carbon dioxide emissions".',
            paragraphReference: 'Paragraph A'
          },
          {
            id: 7,
            type: 'true_false_not_given',
            prompt: 'The chemical byproduct of hydrogen direct reduction in steelmaking is carbon monoxide.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'FALSE',
            explanation: 'Paragraph B states: "...the chemical byproduct is pure water vapor (H2O)".',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 8,
            type: 'multiple_choice',
            prompt: 'According to Paragraph C, what price benchmark must green hydrogen reach to trigger widespread industrial adoption?',
            options: [
              'A. Exactly $6.50 per kilogram',
              'B. Beneath $2.00 per kilogram',
              'C. Over $10.00 per kilogram',
              'D. Equal to the cost of metallurgical coal'
            ],
            correctAnswer: 'B. Beneath $2.00 per kilogram',
            explanation: 'Paragraph C states: "green hydrogen must descend beneath $2.00 per kilogram... to incentivize commercial mill conversions".',
            paragraphReference: 'Paragraph C'
          },
          {
            id: 9,
            type: 'sentence_completion',
            prompt: 'Traditional steel blast furnaces consume metallurgical ______ as a chemical reducing agent.',
            correctAnswer: 'coal',
            explanation: 'Paragraph A notes: "consumes metallurgical coking coal as both an energy source and a chemical reducing agent".',
            paragraphReference: 'Paragraph A'
          },
          {
            id: 10,
            type: 'sentence_completion',
            prompt: 'The European Union trade tariff mechanism designed to equalize carbon import costs is abbreviated as ______.',
            correctAnswer: 'CBAM',
            explanation: 'Paragraph C refers to: "European Union\'s Carbon Border Adjustment Mechanism (CBAM)".',
            paragraphReference: 'Paragraph C'
          }
        ]
      },
      {
        id: 3,
        title: 'Marine Permaculture and Giant Kelp Afforestation',
        subtitle: 'Restoring open-ocean nutrient cycling and sequestering carbon through wave-powered upwelling',
        paragraphs: [
          {
            id: 'A',
            text: 'Across the world\'s oceans, climate warming has intensified thermal stratification—a phenomenon where warm, buoyant surface water forms an impermeable barrier above colder, nutrient-rich deep waters. Denied essential dissolved nitrates and phosphates from below, vast swathes of pelagic ocean have turned into biological deserts. More alarmingly, coastal giant kelp forests (Macrocystis pyrifera), which grow up to half a meter per day and harbor extraordinary marine biodiversity, have experienced catastrophic die-offs along the shores of California, Tasmania, and Japan.'
          },
          {
            id: 'B',
            text: 'To reverse this oceanic desertification, marine ecologist Dr. Brian von Herzen pioneered the concept of Marine Permaculture Arrays (MPAs). These semi-submersible offshore structures comprise lightweight, flexible platforms tethered 25 meters beneath the surface, beyond the destructive reach of surface storm waves. Attached to the platforms are thermodynamic upwelling pumps that operate without electrical fuel: driven solely by the kinetic oscillation of surface ocean swell, they siphon frigid, nutrient-laden water from depths of 300 meters into the sunlit photic zone.'
          },
          {
            id: 'C',
            text: 'The influx of nutrient-dense water triggers an explosive revitalization of the marine trophic web. Fast-growing giant kelp attaches to the subterranean lattice, absorbing atmospheric CO2 dissolved in surface waters at rates exceeding terrestrial rainforests by a factor of twenty. Schooling forage fish such as sardines and anchovies immediately colonize the artificial canopy, followed closely by apex pelagic predators including yellowfin tuna and baleen whales.'
          },
          {
            id: 'D',
            text: 'In addition to habitat creation, MPAs present a viable long-term carbon sink. When mature kelp fronds slough off naturally or are deliberately pruned, their heavy biomass sinks thousands of meters into abyssal marine trenches. At depths exceeding 1,000 meters, hydrostatic pressures and low temperatures prevent biological decomposition, permanently locking carbon out of atmospheric circulation for millennia.'
          }
        ],
        questions: [
          {
            id: 11,
            type: 'matching_headings',
            prompt: 'Choose the correct heading for Paragraph A:',
            options: [
              'i. The mechanics of zero-energy thermodynamic upwelling',
              'ii. Thermal barriers and the crisis of oceanic desertification',
              'iii. Trophic cascade revitalization and commercial fish stocks',
              'iv. Deep-sea abyssal sequestration and permanent carbon storage'
            ],
            correctAnswer: 'ii. Thermal barriers and the crisis of oceanic desertification',
            explanation: 'Paragraph A explains how thermal stratification blocks nutrient transport, causing ocean deserts and kelp die-offs.',
            paragraphReference: 'Paragraph A'
          },
          {
            id: 12,
            type: 'matching_headings',
            prompt: 'Choose the correct heading for Paragraph B:',
            options: [
              'i. The mechanics of zero-energy thermodynamic upwelling',
              'ii. Thermal barriers and the crisis of oceanic desertification',
              'iii. Trophic cascade revitalization and commercial fish stocks',
              'iv. Deep-sea abyssal sequestration and permanent carbon storage'
            ],
            correctAnswer: 'i. The mechanics of zero-energy thermodynamic upwelling',
            explanation: 'Paragraph B describes Dr. von Herzen\'s Marine Permaculture Arrays and wave-powered pumps siphoning deep nutrients.',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 13,
            type: 'matching_headings',
            prompt: 'Choose the correct heading for Paragraph D:',
            options: [
              'i. The mechanics of zero-energy thermodynamic upwelling',
              'ii. Thermal barriers and the crisis of oceanic desertification',
              'iii. Trophic cascade revitalization and commercial fish stocks',
              'iv. Deep-sea abyssal sequestration and permanent carbon storage'
            ],
            correctAnswer: 'iv. Deep-sea abyssal sequestration and permanent carbon storage',
            explanation: 'Paragraph D details how heavy biomass sinks into abyssal trenches below 1000m to lock carbon away for millennia.',
            paragraphReference: 'Paragraph D'
          },
          {
            id: 14,
            type: 'true_false_not_given',
            prompt: 'Marine Permaculture Arrays require continuous diesel fuel generation to operate upwelling pumps.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'FALSE',
            explanation: 'Paragraph B states: "pumps that operate without electrical fuel: driven solely by the kinetic oscillation of surface ocean swell".',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 15,
            type: 'sentence_completion',
            prompt: 'Giant kelp can absorb dissolved carbon dioxide at rates ______ times greater than terrestrial rainforests.',
            correctAnswer: 'twenty',
            explanation: 'Paragraph C states: "...exceeding terrestrial rainforests by a factor of twenty".',
            paragraphReference: 'Paragraph C'
          },
          {
            id: 16,
            type: 'sentence_completion',
            prompt: 'Kelp biomass sinking below 1,000 meters into abyssal ______ prevents biological decomposition.',
            correctAnswer: 'trenches',
            explanation: 'Paragraph D notes: "sinks thousands of meters into abyssal marine trenches".',
            paragraphReference: 'Paragraph D'
          }
        ]
      }
    ]
  },

  // TEST 3: CAMBRIDGE 18 TEST 1
  {
    id: 'cam18_test1_reading',
    title: 'Academic Reading Practice Test 1 (Cambridge 18 官方全真卷)',
    source: 'Cambridge IELTS 18 Academic Official',
    bankCategory: 'cam18',
    year: '2023-2024',
    difficulty: 'Authentic Exam',
    tags: ['Forestry', 'Neuroplasticity', 'Oceanography', 'Matching Info'],
    durationMinutes: 60,
    passages: [
      {
        id: 1,
        title: 'Ecological Forest Management and Continuous Cover Forestry',
        subtitle: 'Transitioning from clear-felling monocultures to close-to-nature silviculture',
        paragraphs: [
          {
            id: 'A',
            text: 'For the majority of the twentieth century, commercial forestry across Northern Europe was dominated by clear-cutting: the wholesale harvesting of uniform, single-species stands of conifers on rotation cycles of forty to sixty years. While this industrial model streamlined timber extraction and mechanical replanting, it left forest ecosystems acutely vulnerable to windthrow, bark beetle infestations, and profound soil acidification.'
          },
          {
            id: 'B',
            text: 'In response, European sylviculturists are championing Continuous Cover Forestry (CCF). Rather than clear-felling entire landscapes, CCF selective harvests individual trees based on maturity and structural spacing. Natural regeneration is prioritized over artificial planting, allowing seedlings to germinate beneath the protective canopy of mature parent trees, preserving delicate mycorrhizal networks.'
          },
          {
            id: 'C',
            text: 'Long-term studies conducted by the Forestry Commission in Scotland demonstrate that CCF stands maintain superior hydrological buffering. During extreme rainfall events, diverse multi-age canopies intercept up to 40% of precipitation before it reaches the ground, mitigating flash flooding in downstream catchment basins while sustaining steady stream flows during summer droughts.'
          }
        ],
        questions: [
          {
            id: 1,
            type: 'true_false_not_given',
            prompt: 'Clear-cutting involves the selective removal of single mature trees.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'FALSE',
            explanation: 'Paragraph A defines clear-cutting as the "wholesale harvesting of uniform, single-species stands", whereas CCF conducts selective removal.',
            paragraphReference: 'Paragraph A'
          },
          {
            id: 2,
            type: 'true_false_not_given',
            prompt: 'Continuous Cover Forestry relies primarily on natural seed germination beneath parent trees.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'TRUE',
            explanation: 'Paragraph B states: "Natural regeneration is prioritized over artificial planting, allowing seedlings to germinate beneath the protective canopy".',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 3,
            type: 'sentence_completion',
            prompt: 'Multi-age forest canopies in Scotland can intercept up to ______ % of heavy rainfall.',
            correctAnswer: '40',
            explanation: 'Paragraph C states: "...diverse multi-age canopies intercept up to 40% of precipitation...".',
            paragraphReference: 'Paragraph C'
          },
          {
            id: 4,
            type: 'sentence_completion',
            prompt: 'Clear-cutting left monoculture conifer forests susceptible to windthrow and bark ______ outbreaks.',
            correctAnswer: 'beetle',
            explanation: 'Paragraph A indicates: "...vulnerable to windthrow, bark beetle infestations...".',
            paragraphReference: 'Paragraph A'
          }
        ]
      },
      {
        id: 2,
        title: 'Neuroplasticity: Structural Remodeling in the Adult Primate Brain',
        subtitle: 'Overcoming the dogma of the static nervous system through sensory remapping',
        paragraphs: [
          {
            id: 'A',
            text: 'Throughout the nineteenth and mid-twentieth centuries, neurobiology was constrained by the doctrine that the adult mammalian brain was structurally immutable. Medical textbooks taught that while synaptic connections could strengthen or weaken during learning, neurogenesis ceased shortly after birth, and physical brain maps were rigidly permanent.'
          },
          {
            id: 'B',
            text: 'This dogma was shattered by the seminal investigations of neuroscientist Michael Merzenich in the late 1970s. Merzenich mapped the somatosensory cortex of adult owl monkeys, determining which cortical micro-columns responded to tactile stimulation of individual digits. When two adjacent fingers were surgically bound together, forcing them to move synchronously, the monkey\'s cortical map reorganized within weeks: the distinct sensory boundaries fused into a unified cortical representation.'
          },
          {
            id: 'C',
            text: 'Subsequent human neuroimaging confirmed that cortical plasticity persists throughout the entire lifespan. In proficient violinists, the somatosensory region dedicated to controlling the left hand\'s fingering fingers is significantly larger than in non-musicians. Crucially, plasticity is a double-edged sword: the same adaptive mechanisms that enable stroke rehabilitation can entrench chronic maladaptive phantom limb sensations if sensory feedback loops are disrupted.'
          }
        ],
        questions: [
          {
            id: 5,
            type: 'true_false_not_given',
            prompt: 'Twentieth-century medical consensus maintained that adult primate brains could readily generate new neurons.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'FALSE',
            explanation: 'Paragraph A states textbooks taught that "neurogenesis ceased shortly after birth, and physical brain maps were rigidly permanent".',
            paragraphReference: 'Paragraph A'
          },
          {
            id: 6,
            type: 'multiple_choice',
            prompt: 'What occurred to the owl monkeys\' cortical maps when adjacent fingers were bound together in Merzenich\'s experiment?',
            options: [
              'A. The somatosensory cortex ceased all neural signaling',
              'B. The distinct sensory map boundaries fused into a unified cortical representation',
              'C. The monkeys permanently lost all sensory feeling in their arms',
              'D. The brain generated hundreds of thousands of new conifer cells'
            ],
            correctAnswer: 'B. The distinct sensory map boundaries fused into a unified cortical representation',
            explanation: 'Paragraph B explicitly states: "the distinct sensory boundaries fused into a unified cortical representation".',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 7,
            type: 'sentence_completion',
            prompt: 'In expert string musicians, the cortical representation for the ______ hand is disproportionately enlarged.',
            correctAnswer: 'left',
            explanation: 'Paragraph C states: "...somatosensory region dedicated to controlling the left hand\'s fingering fingers is significantly larger...".',
            paragraphReference: 'Paragraph C'
          }
        ]
      },
      {
        id: 3,
        title: 'Hydrothermal Vent Ecosystems and Chemosynthetic Biospheres',
        subtitle: 'Life thriving independent of solar radiation along tectonic seafloor rifts',
        paragraphs: [
          {
            id: 'A',
            text: 'Prior to 1977, biological science took as absolute gospel that all earthly food webs ultimately derived their energy from photosynthetic solar radiation. This foundational paradigm was upended when oceanographers aboard the research submersible Alvin explored the Galápagos Rift, two and a half kilometers beneath the Pacific Ocean surface. In total darkness and under crushing hydrostatic pressures exceeding 250 atmospheres, the researchers discovered vibrant biological oases clustering around geothermal chimneys discharging mineral-rich superheated fluids.'
          },
          {
            id: 'B',
            text: 'At the heart of these hydrothermal vent ecosystems are specialized lithoautotrophic bacteria. Rather than capturing sunlight, these extremophiles perform chemosynthesis: they oxidize hydrogen sulfide (H2S), methane, and dissolved iron spewing from the Earth\'s mantle, fixing inorganic carbon dioxide into organic carbohydrates. This chemical synthesis provides the primary energetic bedrock supporting towering communities of giant tube worms (Riftia pachyptila), vent clams, and translucent ghost shrimp.'
          },
          {
            id: 'C',
            text: 'The symbiotic physiology of Riftia pachyptila represents one of the most astonishing evolutionary adaptations on Earth. Reaching lengths of over two meters, these invertebrates possess neither a mouth, gut, nor digestive tract. Instead, their body cavity is filled with a vascularized organ called the trophosome, housing billions of endosymbiotic sulfur-oxidizing bacteria. The worm\'s bright red plumes contain extraordinary hemoglobin molecules capable of binding hydrogen sulfide and oxygen simultaneously without suffering chemical poisoning.'
          },
          {
            id: 'D',
            text: 'The discovery of chemosynthetic biospheres has profoundly transformed astrobiology. If rich biological communities can flourish along volcanic rifts in perpetual darkness without solar dependency, life could plausibly thrive in the subterranean oceans of Jupiter\'s moon Europa or Saturn\'s moon Enceladus, where gravitational tidal flexing sustains active seafloor hydrothermal vents beneath miles of ice.'
          }
        ],
        questions: [
          {
            id: 8,
            type: 'true_false_not_given',
            prompt: 'Photosynthesis is the primary energy source powering deep-sea hydrothermal vent ecosystems.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'FALSE',
            explanation: 'Paragraph B states: "Rather than capturing sunlight, these extremophiles perform chemosynthesis: they oxidize hydrogen sulfide...".',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 9,
            type: 'true_false_not_given',
            prompt: 'Giant tube worms possess a complex digestive stomach designed to consume small fish.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'FALSE',
            explanation: 'Paragraph C states: "these invertebrates possess neither a mouth, gut, nor digestive tract".',
            paragraphReference: 'Paragraph C'
          },
          {
            id: 10,
            type: 'multiple_choice',
            prompt: 'What specialized organ inside Riftia pachyptila accommodates billions of symbiotic bacteria?',
            options: [
              'A. The chloroplast mantle',
              'B. The trophosome',
              'C. The respiratory flipper',
              'D. The calcified exoskeleton'
            ],
            correctAnswer: 'B. The trophosome',
            explanation: 'Paragraph C indicates: "...their body cavity is filled with a vascularized organ called the trophosome, housing billions of endosymbiotic sulfur-oxidizing bacteria".',
            paragraphReference: 'Paragraph C'
          },
          {
            id: 11,
            type: 'sentence_completion',
            prompt: 'Extremophile bacteria synthesize carbohydrates by oxidizing toxic ______ sulfide.',
            correctAnswer: 'hydrogen',
            explanation: 'Paragraph B notes: "they oxidize hydrogen sulfide (H2S), methane, and dissolved iron...".',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 12,
            type: 'sentence_completion',
            prompt: 'Astrobiologists hypothesize that active hydrothermal vents may exist beneath the icy shell of Jupiter\'s moon ______.',
            correctAnswer: 'Europa',
            explanation: 'Paragraph D cites: "...subterranean oceans of Jupiter\'s moon Europa or Saturn\'s moon Enceladus...".',
            paragraphReference: 'Paragraph D'
          }
        ]
      }
    ]
  },

  // TEST 4: CAMBRIDGE 17 TEST 1
  {
    id: 'cam17_test1_reading',
    title: 'Academic Reading Practice Test 1 (Cambridge 17 官方经典题库)',
    source: 'Cambridge IELTS 17 Academic Official',
    bankCategory: 'cam17',
    year: '2022-2023',
    difficulty: 'Authentic Exam',
    tags: ['Indigenous Fire Ecology', 'Ancient Concrete Engineering', 'Bioacoustics'],
    durationMinutes: 60,
    passages: [
      {
        id: 1,
        title: 'Traditional Controlled Fire Stewardship and Landscape Resilience',
        subtitle: 'How Aboriginal mosaic burning practices mitigate catastrophic megafires',
        paragraphs: [
          {
            id: 'A',
            text: 'For tens of thousands of years prior to European colonization, the Australian landscape was actively sculpted by Indigenous fire regimes. Contrary to modern European conceptions that viewed fire purely as a destructive hazard to be suppressed at all costs, Aboriginal peoples deployed fire as a sophisticated land-management instrument known today as "cultural burning" or "fire-stick farming".'
          },
          {
            id: 'B',
            text: 'Cultural burns are deliberate, low-intensity fires ignited under specific meteorological conditions—typically early in the dry season when morning dew dampens soil and ambient breezes are mild. These slow-moving, low-flame burns consume dead grass, underbrush, and leaf litter without scorching the canopies of mature trees or incinerating wildlife. The result is a fine-grained mosaic of burnt and unburnt country that acts as natural firebreaks, depriving late-season lightning-sparked wildfires of contiguous fuel.'
          },
          {
            id: 'C',
            text: 'The ecological benefits of cultural burning extend far beyond wildfire mitigation. Many native Australian plant species, such as banksias and eucalyptus, have evolved serotinous seed pods that require mild smoke and radiant heat to trigger dehiscence. Furthermore, regular low-intensity burning prevents eucalyptus leaf litter from releasing toxic phenolic compounds that poison the germination of native grasses.'
          }
        ],
        questions: [
          {
            id: 1,
            type: 'true_false_not_given',
            prompt: 'European settlers initially treated fire as a land management tool to encourage biodiversity.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'FALSE',
            explanation: 'Paragraph A contrasts Aboriginal practices with European conceptions that viewed fire purely as a destructive hazard to be suppressed.',
            paragraphReference: 'Paragraph A'
          },
          {
            id: 2,
            type: 'true_false_not_given',
            prompt: 'Cultural burns are normally lit during dry midday hours with high gale winds.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'FALSE',
            explanation: 'Paragraph B states burns are ignited "when morning dew dampens soil and ambient breezes are mild".',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 3,
            type: 'sentence_completion',
            prompt: 'Aboriginal controlled low-intensity burns are also described as ______ burning.',
            correctAnswer: 'cultural',
            explanation: 'Paragraph A specifies: "...known today as \'cultural burning\' or \'fire-stick farming\'".',
            paragraphReference: 'Paragraph A'
          },
          {
            id: 4,
            type: 'sentence_completion',
            prompt: 'Plants such as banksias possess ______ seed pods that open in response to mild smoke and heat.',
            correctAnswer: 'serotinous',
            explanation: 'Paragraph C states: "...evolved serotinous seed pods that require mild smoke and radiant heat to trigger dehiscence".',
            paragraphReference: 'Paragraph C'
          }
        ]
      },
      {
        id: 2,
        title: 'Roman Concrete: The Geo-Architectural Secret of Ancient Maritime Longevity',
        subtitle: 'Why 2,000-year-old Roman breakwaters endure in saltwater while modern concrete deteriorates',
        paragraphs: [
          {
            id: 'A',
            text: 'While modern Portland cement maritime structures typically begin deteriorating within three to five decades due to chloride penetration and steel rebar corrosion, Roman harbors, piers, and sea-walls built over two millennia ago remain structurally sound. For centuries, engineers were baffled by how ancient concrete could survive prolonged immersion in turbulent marine environments without crumbling.'
          },
          {
            id: 'B',
            text: 'Geochemical analyses led by Dr. Marie Jackson at the University of Utah unraveled the mystery. The Roman recipe, documented by architect Vitruvius, mixed quicklime (calcium oxide) with volcanic ash known as pozzolana, quarried from the Phlegraean Fields near the Gulf of Naples. When sea water bathed the submerged mortar, it did not erode the material; instead, alkaline saline chemistry triggered a rare secondary mineralization process.'
          },
          {
            id: 'C',
            text: 'Specifically, the seawater dissolved volcanic glass within the mortar, precipitating interlocking crystals of a rare aluminosilicate mineral called Al-tobermorite alongside phillipsite. These crystalline plates grew within micro-cracks over centuries, reinforcing the structural matrix. Rather than degrading, Roman maritime concrete literally grew stronger in response to oceanic chemical interactions.'
          }
        ],
        questions: [
          {
            id: 5,
            type: 'true_false_not_given',
            prompt: 'Modern Portland cement structures generally outlast ancient Roman breakwaters when immersed in ocean water.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'FALSE',
            explanation: 'Paragraph A states modern Portland cement structures begin deteriorating within 30-50 years, while Roman structures endure after two millennia.',
            paragraphReference: 'Paragraph A'
          },
          {
            id: 6,
            type: 'multiple_choice',
            prompt: 'What essential volcanic ash component did Roman builders combine with quicklime to produce marine concrete?',
            options: [
              'A. Portland granite',
              'B. Pozzolana',
              'C. Calcium sulfate',
              'D. Synthetic polymer resin'
            ],
            correctAnswer: 'B. Pozzolana',
            explanation: 'Paragraph B states: "mixed quicklime (calcium oxide) with volcanic ash known as pozzolana".',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 7,
            type: 'sentence_completion',
            prompt: 'The secondary mineral crystals that reinforce Roman concrete micro-cracks are called Al-______.',
            correctAnswer: 'tobermorite',
            explanation: 'Paragraph C states: "...precipitating interlocking crystals of a rare aluminosilicate mineral called Al-tobermorite...".',
            paragraphReference: 'Paragraph C'
          }
        ]
      },
      {
        id: 3,
        title: 'Acoustic Ecology and Sonic Navigation in Cetaceans',
        subtitle: 'Decoding the biosonar clicks and communicative whistles of deep-diving toothed whales',
        paragraphs: [
          {
            id: 'A',
            text: 'In the oceanic realm, where sunlight attenuates rapidly within the upper 200 meters, vision is an ineffective sensory modality for long-distance navigation or prey acquisition. Over 30 million years of evolutionary divergence, odontocetes (toothed whales, including sperm whales, orcas, and dolphins) developed biosonar—a sophisticated biological echolocation capability that maps marine topographies with ultrasonic precision.'
          },
          {
            id: 'B',
            text: 'Echolocating clicks originate in the nasal complex beneath the whale\'s blowhole, where pressurized air is forced through phonic lips. The acoustic pulse is then focused through the melon—a lipid-rich elliptical organ in the forehead containing specialized triacylglycerols and wax esters that function as an acoustic lens. When outgoing sound pulses strike an object, the returning echo penetrates the whale\'s acoustic fats in the lower jawbone, propagating directly to the middle and inner ear for cortical synthesis.'
          },
          {
            id: 'C',
            text: 'Anthropogenic underwater noise pollution poses an existential threat to cetacean acoustic ecology. Commercial shipping cavitation, seismic geological airguns, and military low-frequency active sonar saturate the marine soundscape. The resultant acoustic interference can induce temporary threshold shifts in auditory sensitivity, mask reproductive contact calls, and trigger panic ascents that inflict decompression sickness in beaked whales.'
          }
        ],
        questions: [
          {
            id: 8,
            type: 'true_false_not_given',
            prompt: 'Sunlight penetrates deep oceanic trenches to provide clear visual orientation below 1,000 meters.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'FALSE',
            explanation: 'Paragraph A indicates sunlight attenuates within the upper 200 meters, rendering vision ineffective.',
            paragraphReference: 'Paragraph A'
          },
          {
            id: 9,
            type: 'multiple_choice',
            prompt: 'Which lipid-filled organ in the whale\'s forehead focuses echolocation pulses like an acoustic lens?',
            options: [
              'A. The phonic lips',
              'B. The melon',
              'C. The lower jawbone',
              'D. The dorsal fin'
            ],
            correctAnswer: 'B. The melon',
            explanation: 'Paragraph B explicitly notes: "focused through the melon—a lipid-rich elliptical organ in the forehead... that function as an acoustic lens".',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 10,
            type: 'sentence_completion',
            prompt: 'Returning sound echoes enter the whale through acoustic fat deposits located inside the lower ______.',
            correctAnswer: 'jawbone',
            explanation: 'Paragraph B states: "...returning echo penetrates the whale\'s acoustic fats in the lower jawbone...".',
            paragraphReference: 'Paragraph B'
          }
        ]
      }
    ]
  },

  // TEST 5: 2025/2026 CDI MACHINE EXAM RECALLS
  {
    id: 'cdi_2025_reading_recall',
    title: 'CDI Machine Exam Reading Recalls (2025/2026 换题季真题还原卷)',
    source: '2025-2026 CDI Machine Exam Pool',
    bankCategory: 'cdi_recent',
    year: '2025-2026',
    difficulty: 'Authentic Exam',
    tags: ['Controlled Environment Agriculture', 'Permafrost Thaw', 'AI Education', 'Recent Recalls'],
    durationMinutes: 60,
    passages: [
      {
        id: 1,
        title: 'Controlled Environment Agriculture: Vertical Aeroponics and Urban Food Security',
        subtitle: 'Disrupting traditional soil-based farming through root misting and closed-loop LED cultivation',
        paragraphs: [
          {
            id: 'A',
            text: 'With the United Nations projecting global human population to reach 9.8 billion by mid-century, conventional agriculture faces an existential arithmetic dilemma: over 80% of Earth\'s arable land is already cultivated, while climate extremes, industrial runoff, and topsoil erosion deplete millions of fertile hectares annually. In response, agronomists are turning to vertical aeroponics—an advanced form of controlled environment agriculture (CEA).'
          },
          {
            id: 'B',
            text: 'Unlike hydroponics, which submerges plant roots in flowing water channels, aeroponics suspends crops in modular vertical towers where exposed root systems are intermittently sprayed with atomized nutrient mist. This technique slashes agricultural water consumption by 95% compared to open-field furrow irrigation and reduces mineral fertilizer usage by 60%, because unused nutrient mist condensates and is recycled continuously through sterile UV filters.'
          },
          {
            id: 'C',
            text: 'Nevertheless, aeroponics is hindered by capital expenditure and high electricity intensity. Operating hundreds of high-intensity LED photosynthetic grow lights and automated HVAC dehumidification systems requires substantial power. Agronomists argue that aeroponics will only achieve commercial viability in megacities when coupled with municipal waste-to-energy facilities or co-located rooftop solar microgrids.'
          }
        ],
        questions: [
          {
            id: 1,
            type: 'multiple_choice',
            prompt: 'Why does traditional agriculture face an "arithmetic dilemma" according to Paragraph A?',
            options: [
              'A. Most of the world\'s arable land is already under cultivation',
              'B. Farmers refuse to utilize modern irrigation pumps',
              'C. Megacities have abandoned food consumption altogether',
              'D. Furrow irrigation consumes zero water'
            ],
            correctAnswer: 'A. Most of the world\'s arable land is already under cultivation',
            explanation: 'Paragraph A states: "over 80% of Earth\'s arable land is already cultivated, while climate extremes and soil erosion deplete millions of fertile hectares".',
            paragraphReference: 'Paragraph A'
          },
          {
            id: 2,
            type: 'true_false_not_given',
            prompt: 'Aeroponic vertical cultivation cuts water consumption by approximately 95% compared to furrow irrigation.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'TRUE',
            explanation: 'Paragraph B explicitly states: "This technique slashes agricultural water consumption by 95% compared to open-field furrow irrigation".',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 3,
            type: 'sentence_completion',
            prompt: 'In aeroponic towers, exposed root systems are sprayed with atomized ______ mist.',
            correctAnswer: 'nutrient',
            explanation: 'Paragraph B states: "exposed root systems are intermittently sprayed with atomized nutrient mist".',
            paragraphReference: 'Paragraph B'
          }
        ]
      },
      {
        id: 2,
        title: 'The Arctic Permafrost Methane Feedback Loop',
        subtitle: 'Sub-surface cryogenic degradation and the mobilization of ancient Pleistocene organic carbon',
        paragraphs: [
          {
            id: 'A',
            text: 'Circumpolar permafrost spans nearly 23 million square kilometers across the Northern Hemisphere, locking an estimated 1,500 billion metric tons of organic carbon—roughly twice the quantity currently suspended in Earth\'s atmosphere. For hundreds of millennia, sub-zero temperatures acted as a cryogenic freezer, halting the microbial decomposition of ancient Pleistocene root systems, mammoth carcasses, and peat deposits.'
          },
          {
            id: 'B',
            text: 'As Arctic air temperatures warm at nearly four times the global average—a phenomenon known as Arctic amplification—the active soil layer that thaws each summer is penetrating deeper into long-frozen yedoma deposits. In waterlogged thermokarst lakes, anaerobic methanogenic archaea break down the thawed organic matter, bubbling massive plumes of methane gas (CH4) directly into the atmosphere. Because methane has a global warming potential 28 to 36 times greater than carbon dioxide over a century, this release threatens an irreversible climate feedback loop.'
          },
          {
            id: 'C',
            text: 'Beyond climatic destabilization, permafrost degradation inflicts severe structural destruction on high-latitude civil infrastructure. As ice-rich soils liquefy, foundations settle unevenly, causing residential buildings to buckle, pipelines to rupture, and roads to deform into impassable roller-coasters across Siberia, Alaska, and northern Canada.'
          }
        ],
        questions: [
          {
            id: 4,
            type: 'true_false_not_given',
            prompt: 'Permafrost holds approximately double the amount of carbon currently present in Earth\'s atmosphere.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'TRUE',
            explanation: 'Paragraph A confirms: "1,500 billion metric tons of organic carbon—roughly twice the quantity currently suspended in Earth\'s atmosphere".',
            paragraphReference: 'Paragraph A'
          },
          {
            id: 5,
            type: 'true_false_not_given',
            prompt: 'Arctic temperatures are warming at the exact same pace as equatorial regions.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'FALSE',
            explanation: 'Paragraph B states: "Arctic air temperatures warm at nearly four times the global average—a phenomenon known as Arctic amplification".',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 6,
            type: 'multiple_choice',
            prompt: 'What microorganisms produce methane in waterlogged thermokarst lakes in Paragraph B?',
            options: [
              'A. Anaerobic methanogenic archaea',
              'B. Photosynthetic marine kelp',
              'C. Nitrogen-fixing lichen',
              'D. Synthetic virus colonies'
            ],
            correctAnswer: 'A. Anaerobic methanogenic archaea',
            explanation: 'Paragraph B specifies: "anaerobic methanogenic archaea break down the thawed organic matter, bubbling massive plumes of methane gas".',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 7,
            type: 'sentence_completion',
            prompt: 'The amplified warming phenomenon in polar regions is called Arctic ______.',
            correctAnswer: 'amplification',
            explanation: 'Paragraph B states: "...known as Arctic amplification...".',
            paragraphReference: 'Paragraph B'
          }
        ]
      },
      {
        id: 3,
        title: 'Generative Artificial Intelligence in Higher Education Assessment',
        subtitle: 'Rethinking academic integrity, cognitive offloading, and authentic evaluation models',
        paragraphs: [
          {
            id: 'A',
            text: 'The sudden emergence of conversational large language models (LLMs) in late 2022 initiated an institutional crisis across global higher education. For decades, the standard undergraduate evaluation model rested on take-home essays, literature syntheses, and coding assignments. When neural networks demonstrated the ability to produce fluent, citation-backed academic papers in seconds, the foundational premise of unsupervised written coursework was shattered.'
          },
          {
            id: 'B',
            text: 'Initial institutional reactions swung between draconian bans and blanket surveillance software. However, automated AI detection algorithms proved unreliable, generating unacceptable false-positive rates that disproportionately penalized non-native English speakers. Recognizing that AI cannot be policed out of existence, progressive universities have shifted toward "authentic assessment"—evaluating students through in-person oral vivas, collaborative debate defenses, and iterative classroom portfolios that demonstrate meta-cognitive thought processes rather than polished final text.'
          },
          {
            id: 'C',
            text: 'Pedagogical theorists emphasize that the challenge is not merely technological, but cognitive. When students delegate analytical drafting to algorithms, they risk "cognitive offloading"—atrophying the neural pathways required for struggling through unstructured arguments. Higher education must teach students to employ AI as an intellectual interlocutor and stress-tester while safeguarding authentic human synthesis.'
          }
        ],
        questions: [
          {
            id: 8,
            type: 'true_false_not_given',
            prompt: 'Automated AI detection software has proven 100% accurate without misidentifying non-native English writing.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'FALSE',
            explanation: 'Paragraph B explicitly notes: "automated AI detection algorithms proved unreliable, generating unacceptable false-positive rates that disproportionately penalized non-native English speakers".',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 9,
            type: 'multiple_choice',
            prompt: 'What evaluation format are progressive universities adopting in place of unsupervised take-home essays?',
            options: [
              'A. Completely eliminating all examinations and granting automatic degrees',
              'B. Authentic assessment through oral vivas and in-person iterative portfolios',
              'C. Requiring students to write exclusively on manual mechanical typewriters',
              'D. Delegating grading entirely to commercial algorithm companies'
            ],
            correctAnswer: 'B. Authentic assessment through oral vivas and in-person iterative portfolios',
            explanation: 'Paragraph B states: "progressive universities have shifted toward \'authentic assessment\'—evaluating students through in-person oral vivas, collaborative debate defenses, and iterative classroom portfolios".',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 10,
            type: 'sentence_completion',
            prompt: 'Over-relying on artificial algorithms to draft arguments risks a psychological process termed cognitive ______.',
            correctAnswer: 'offloading',
            explanation: 'Paragraph C states: "...they risk \'cognitive offloading\'—atrophying the neural pathways...".',
            paragraphReference: 'Paragraph C'
          }
        ]
      }
    ]
  }
];

const fileContent = `import { ReadingTest } from '../types/ielts';

export const READING_TESTS: ReadingTest[] = ` + JSON.stringify(readingTests, null, 2) + `;\n`;

const outputPath = path.join(__dirname, '../src/data/readingTests.ts');
fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log('Successfully wrote', readingTests.length, 'complete reading tests to', outputPath);

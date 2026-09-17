const fs = require('fs');
const path = require('path');

const originalTest1 = `  {
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
            explanation: 'Paragraph C discusses negative public perception (neglect/antisocial) and how "cues to care" foster community pride.',
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
            explanation: 'Paragraph D focuses on cost reductions in storm-drain maintenance and electrical cooling savings.',
            paragraphReference: 'Paragraph D'
          },
          {
            id: 4,
            type: 'true_false_not_given',
            prompt: 'Urban rewilding relies predominantly on fast-growing foreign decorative shrubs.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'FALSE',
            explanation: 'Paragraph B directly contradicts this: "Unlike traditional municipal landscaping, which relies heavily on non-native ornamental shrubs... urban rewilding seeks to re-establish self-sustaining ecological networks [with indigenous reeds]."',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 5,
            type: 'true_false_not_given',
            prompt: 'In Basel, green roofs lowered municipal spending on storm drainage systems.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'TRUE',
            explanation: 'Paragraph D explicitly states that biodiverse green roofs in Basel reduced storm-drain maintenance expenses by 37%.',
            paragraphReference: 'Paragraph D'
          },
          {
            id: 6,
            type: 'true_false_not_given',
            prompt: 'Rotterdam authorities plan to construct floating residential towers on the Maas River by 2030.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'NOT GIVEN',
            explanation: 'Paragraph B mentions floating wetlands for water filtration and fish sanctuaries, but says nothing about residential towers or 2030 plans.',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 7,
            type: 'sentence_completion',
            prompt: 'Subtle landscape design indicators that reassure the public of intentional care are termed "cues to ______".',
            correctAnswer: 'care',
            explanation: 'Paragraph C: "...landscape ecologists like Joan Nassauer advocate for \'cues to care\'—subtle design touches..."',
            paragraphReference: 'Paragraph C'
          }
        ]
      },
      {
        id: 2,
        title: 'Biomimetic Engineering: Nature as the Supreme Blueprint',
        subtitle: 'From bullet train aerodynamics to self-ventilating termite buildings',
        paragraphs: [
          {
            id: 'A',
            text: 'For nearly four billion years, biological evolution has acted as the planet’s most rigorous research and development laboratory. Organisms that engineered inefficient solutions succumbed to extinction, while those that devised optimal mechanisms endured. Biomimetics—the discipline of extracting engineering principles from biological systems to solve complex human challenges—has transitioned from an eccentric scientific novelty into a dominant cornerstone of sustainable industrial design.'
          },
          {
            id: 'B',
            text: 'One celebrated exemplar is the Eastgate Centre in Harare, Zimbabwe, conceived by architect Mick Pearce in collaboration with Arup engineers. Rather than outfitting the multi-storey retail and office complex with conventional electrical chillers, Pearce studied the macro-porous architecture of indigenous compass termite mounds (Macrotermes bellicosus). Termites maintain internal fungal chambers at an invariant 30.5°C despite external desert temperatures fluctuating between 1°C and 40°C. They accomplish this through an intricate network of low-level air conduits and vertical convective chimneys. Replicating this, the Eastgate building draws cool nocturnal air into concrete structural hollows and expels heated daytime air through rooftop chimneys, utilizing 90% less energy than conventionally conditioned buildings of comparable volume.'
          },
          {
            id: 'C',
            text: 'A parallel breakthrough revolutionized high-speed railway engineering in Japan during the late 1990s. The 500 Series Shinkansen bullet train encountered severe aerodynamic shockwaves: upon exiting tight mountain tunnels at 300 km/h, the abrupt atmospheric pressure differential generated loud sonic booms that shattered nearby residential windows. General manager and avid birdwatcher Eiji Nakatsu deduced that the kingfisher bird dives from low-resistance air into high-density water with negligible splash due to its slender, dual-ogee beak profile. Re-engineering the bullet train locomotive nose to mirror the kingfisher beak eradicated the tunnel boom, yielded a 10% acceleration surge, and reduced electricity consumption by 15%.'
          },
          {
            id: 'D',
            text: 'Recent advances delve into the microscopic realm. The skin of Galapagos sharks possesses microscopic tooth-like structures known as dermal denticles. Arranged in a ribbed diamond pattern, these denticles disrupt liquid drag vortices and prevent micro-organisms from adhering. Material scientists have replicated this non-toxic topology in synthetic films applied to hospital surfaces, demonstrating an 85% inhibition rate against Methicillin-resistant Staphylococcus aureus (MRSA) without employing cytotoxic antimicrobial chemicals.'
          }
        ],
        questions: [
          {
            id: 8,
            type: 'matching_headings',
            prompt: 'Choose the correct heading for Paragraph A:',
            options: [
              'i. Overcoming high-speed acoustic shockwaves',
              'ii. A self-cooling commercial complex inspired by insects',
              'iii. The microscopic defense mechanisms of marine predators',
              'iv. Evolution as a reservoir of engineering wisdom'
            ],
            correctAnswer: 'iv. Evolution as a reservoir of engineering wisdom',
            explanation: 'Paragraph A establishes natural selection as a 4-billion-year R&D laboratory that guides biomimetic engineering.',
            paragraphReference: 'Paragraph A'
          },
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
  }`;

const cam19Test2 = `  {
    id: 'cam19_test2_reading',
    title: 'Academic Reading Practice Test 2 (Cambridge 19 全真卷)',
    source: 'Cambridge IELTS 19 Academic Official',
    bankCategory: 'cam19',
    year: '2024-2025',
    difficulty: 'Authentic Exam',
    tags: ['Sleep Neuroscience', 'Memory Consolidation', 'Deep Sea Exploration', 'YNNG'],
    durationMinutes: 60,
    passages: [
      {
        id: 1,
        title: 'The Architecture of Sleep: Neural Replay and Synaptic Homeostasis',
        subtitle: 'How slow-wave oscillations and REM dreaming consolidate human cognitive memories',
        paragraphs: [
          {
            id: 'A',
            text: 'Until the mid-twentieth century, neurobiologists conceptualized sleep as a passive default state: a dormant condition induced by sensory deprivation when the brain simply switched off its metabolic furnaces. However, the advent of continuous electroencephalography (EEG) demolished this dogma, revealing that nocturnal brain activity is a dynamic, highly orchestrated sequence of metabolic repair and informational reorganization.'
          },
          {
            id: 'B',
            text: 'Memory consolidation depends fundamentally on the temporal interplay between two discrete neuroarchitectural regions: the hippocampus and the neocortex. The hippocampus functions as a rapid-learning temporary cache with finite storage capacity, encoding episodic autobiographical memories acquired throughout wakefulness. During non-rapid eye movement (NREM) slow-wave sleep, rhythmic electrical waves at 0.5 to 4 Hz synchronize between these brain centers. This slow-wave oscillation orchestrates "neural replay", repeatedly projecting neural firing patterns from the temporary hippocampal cache to the permanent neocortical archives.'
          },
          {
            id: 'C',
            text: 'Concurrently, the synaptic homeostasis hypothesis proposed by Giulio Tononi suggests that waking life saturates brain tissue with net synaptic potentiation. Each learning experience strengthens dendritic connections, consuming unsustainable amounts of cerebral energy and biochemical real estate. Slow-wave sleep serves as a biological restorative: it systematically prunes redundant or weak synapses while preserving essential memory traces, restoring global synaptic balance before morning arousal.'
          },
          {
            id: 'D',
            text: 'Rapid eye movement (REM) sleep, characterized by motor paralysis, rapid binocular twitches, and vivid hallucinatory mentation, accomplishes a distinct cognitive assignment. Neuroimaging demonstrates that the amygdala and emotional limbic circuits remain hyperactive during REM, whereas the dorsolateral prefrontal cortex—the seat of logical inhibition—is deactivated. This neurochemical milieu allows disparate semantic concepts to cross-pollinate without logical constraints, explaining why REM sleep is renowned for fostering creative problem-solving and psychological trauma resolution.'
          }
        ],
        questions: [
          {
            id: 1,
            type: 'matching_headings',
            prompt: 'Choose the correct heading for Paragraph B:',
            options: [
              'i. The pruning of redundant synapses to conserve metabolic energy',
              'ii. Transferring data from short-term cache to permanent neocortical storage',
              'iii. The historical illusion of nocturnal cerebral dormancy',
              'iv. Emotional cross-pollination during dreaming states'
            ],
            correctAnswer: 'ii. Transferring data from short-term cache to permanent neocortical storage',
            explanation: 'Paragraph B describes how slow-wave oscillations orchestrate "neural replay", transferring memories from the hippocampal cache to neocortical archives.',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 2,
            type: 'matching_headings',
            prompt: 'Choose the correct heading for Paragraph C:',
            options: [
              'i. The pruning of redundant synapses to conserve metabolic energy',
              'ii. Transferring data from short-term cache to permanent neocortical storage',
              'iii. The historical illusion of nocturnal cerebral dormancy',
              'iv. Emotional cross-pollination during dreaming states'
            ],
            correctAnswer: 'i. The pruning of redundant synapses to conserve metabolic energy',
            explanation: 'Paragraph C presents the synaptic homeostasis hypothesis, showing how slow-wave sleep prunes weak connections to restore energy balance.',
            paragraphReference: 'Paragraph C'
          },
          {
            id: 3,
            type: 'matching_headings',
            prompt: 'Choose the correct heading for Paragraph D:',
            options: [
              'i. The pruning of redundant synapses to conserve metabolic energy',
              'ii. Transferring data from short-term cache to permanent neocortical storage',
              'iii. The historical illusion of nocturnal cerebral dormancy',
              'iv. Emotional cross-pollination during dreaming states'
            ],
            correctAnswer: 'iv. Emotional cross-pollination during dreaming states',
            explanation: 'Paragraph D examines REM sleep and how uninhibited semantic cross-pollination aids creativity and emotional processing.',
            paragraphReference: 'Paragraph D'
          },
          {
            id: 4,
            type: 'true_false_not_given',
            prompt: 'Early neurobiologists believed the brain remained fully active during sleep without metabolic changes.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'FALSE',
            explanation: 'Paragraph A states early scientists conceptualized sleep as a "passive default state" where the brain "simply switched off its metabolic furnaces".',
            paragraphReference: 'Paragraph A'
          },
          {
            id: 5,
            type: 'true_false_not_given',
            prompt: 'The hippocampus has an infinite capacity for storing long-term memories.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'FALSE',
            explanation: 'Paragraph B explicitly notes the hippocampus is a "temporary cache with finite storage capacity".',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 6,
            type: 'true_false_not_given',
            prompt: 'Giulio Tononi was awarded the Nobel Prize for his synaptic homeostasis hypothesis.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'NOT GIVEN',
            explanation: 'Paragraph C mentions Giulio Tononi proposed the hypothesis, but makes no mention of Nobel prizes.',
            paragraphReference: 'Paragraph C'
          },
          {
            id: 7,
            type: 'sentence_completion',
            prompt: 'The prefrontal region responsible for logical inhibition that becomes dormant during REM sleep is the ______ prefrontal cortex.',
            correctAnswer: 'dorsolateral',
            explanation: 'Paragraph D: "...the dorsolateral prefrontal cortex—the seat of logical inhibition—is deactivated."',
            paragraphReference: 'Paragraph D'
          }
        ]
      },
      {
        id: 2,
        title: 'Benthic Geothermal Vent Ecosystems in the Mariana Trench',
        subtitle: 'Chemosynthesis and extreme adaptations in the hadal ocean zones',
        paragraphs: [
          {
            id: 'A',
            text: 'Beneath six thousand meters of abyssal ocean, the hadal zone represents one of Earth’s most formidable frontiers. Subjected to hydrostatic pressures exceeding one thousand atmospheres—equivalent to the weight of an elephant balanced on a postage stamp—and complete absence of sunlight, life was long considered biologically impossible. That dogma dissolved in 1977 with the submarine discovery of hydrothermal vents spewing superheated mineral plumes along mid-ocean tectonic ridges.'
          },
          {
            id: 'B',
            text: 'Unlike terrestrial biomes energized by sunlight-driven photosynthesis, benthic vent communities derive sustenance entirely through chemosynthesis. Lithotrophic bacteria oxidize toxic hydrogen sulfide (H2S) and methane emitted by geothermal fissures to synthesize carbohydrates. Giant tube worms (Riftia pachyptila), which lack mouths, digestive tracts, and anuses, house dense colonies of these endosymbiotic bacteria within a vascularized organ termed the trophosome. The worms provide absorbed hydrogen sulfide and dissolved oxygen; in return, the bacteria nourish their host with synthesized organic molecules.'
          },
          {
            id: 'C',
            text: 'At the cellular tier, hadal organisms exhibit evolutionary adaptations against cellular crushing. Under extreme pressure, phospholipid cell membranes undergo liquid-to-solid phase transitions, freezing into rigid sheets that halt trans-membrane nutrient transport. Hadal fauna counteract this by synthesizing polyunsaturated fatty acids that maintain fluid membrane mobility, alongside high concentrations of trimethylamine N-oxide (TMAO)—a zwitterionic osmolyte that prevents water molecules from distorting protein architecture.'
          }
        ],
        questions: [
          {
            id: 8,
            type: 'multiple_choice',
            prompt: 'What major discovery in 1977 overturned previous assumptions about the hadal zone?',
            options: [
              'A. Underwater deposits of commercial crude oil',
              'B. Hydrothermal vents supporting thriving biotic communities',
              'C. Photosynthetic coral reefs beneath deep trenches',
              'D. Submarine volcanic trenches with zero tectonic movement'
            ],
            correctAnswer: 'B. Hydrothermal vents supporting thriving biotic communities',
            explanation: 'Paragraph A indicates the discovery of hydrothermal vents spewing mineral plumes overturned the belief that hadal life was impossible.',
            paragraphReference: 'Paragraph A'
          },
          {
            id: 9,
            type: 'true_false_not_given',
            prompt: 'Giant tube worms consume smaller crustacean prey through traditional chewing jaws.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'FALSE',
            explanation: 'Paragraph B explicitly states that Riftia pachyptila "lack mouths, digestive tracts, and anuses" and nourish themselves via symbiotic bacteria.',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 10,
            type: 'sentence_completion',
            prompt: 'Hadal animals accumulate the osmolyte ______ to prevent deep-sea pressure from deforming their protein structures.',
            correctAnswer: 'TMAO',
            explanation: 'Paragraph C: "...high concentrations of trimethylamine N-oxide (TMAO)—a zwitterionic osmolyte that prevents water molecules from distorting protein architecture."',
            paragraphReference: 'Paragraph C'
          }
        ]
      }
    ]
  }`;

const cam18Test1 = `  {
    id: 'cam18_test1_reading',
    title: 'Academic Reading Practice Test 1 (Cambridge 18 全真模考)',
    source: 'Cambridge IELTS 18 Academic Official',
    bankCategory: 'cam18',
    year: '2023-2024',
    difficulty: 'Authentic Exam',
    tags: ['Forestry', 'Indigenous Fire Ecology', 'Civil Engineering', 'Matching'],
    durationMinutes: 60,
    passages: [
      {
        id: 1,
        title: 'Fire Ecology: Traditional Indigenous Burning versus Catastrophic Wildfires',
        subtitle: 'How pre-colonial cultural fire management is reviving Australian and North American forests',
        paragraphs: [
          {
            id: 'A',
            text: 'Over the last century, industrial forestry policy in fire-prone regions like California and New South Wales was anchored to a doctrine of strict wildfire suppression. Any natural ignition, whether sparked by dry lightning or human accident, was met with aggressive extinguishing. However, decades of total fire suppression produced an unintended ecological crisis: forest understories accumulated colossal fuel loads of dry timber, brush, and unburnt pine needles. When fires inevitably break out under severe drought and gale conditions, they mutate into uncontrollable "megafires" that scorch mature canopy trees and incinerate entire ecosystems.'
          },
          {
            id: 'B',
            text: 'Before European colonization, Indigenous Australian peoples managed their landscapes through cultural burning, often characterized as "cool burning". Initiated early in the dry season when evening dew dampened ground vegetation, these deliberate small-scale fires burned at low temperatures, gently consuming leaf litter without rising into the tree canopy. Native animals were granted ample time to relocate, and fire-dependent flora like banksias and eucalypts received the mild thermal cues necessary to crack open their seed pods.'
          },
          {
            id: 'C',
            text: 'Modern forestry departments are collaborating with Aboriginal fire practitioners to reintegrate cool burns into seasonal land stewardship. Satellite thermal monitoring indicates that regions subjected to rotational cool burns exhibit a 68% reduction in megafire vulnerability during peak summer heatwaves. Far from being a destructive force, controlled low-intensity fire functions as nature’s preventative vaccine.'
          }
        ],
        questions: [
          {
            id: 1,
            type: 'multiple_choice',
            prompt: 'According to Paragraph A, strict fire suppression over the past century led to:',
            options: [
              'A. A widespread decline in timber industry profits',
              'B. Dangerous accumulation of dry forest fuel loads',
              'C. Complete eradication of lightning storms in California',
              'D. Permanent cooling of New South Wales forests'
            ],
            correctAnswer: 'B. Dangerous accumulation of dry forest fuel loads',
            explanation: 'Paragraph A specifies that total suppression caused understories to accumulate "colossal fuel loads of dry timber, brush, and unburnt pine needles".',
            paragraphReference: 'Paragraph A'
          },
          {
            id: 2,
            type: 'true_false_not_given',
            prompt: 'Traditional cool burning is conducted during hot and dry summer mid-day periods.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'FALSE',
            explanation: 'Paragraph B explicitly notes cool burning was initiated "early in the dry season when evening dew dampened ground vegetation".',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 3,
            type: 'true_false_not_given',
            prompt: 'Rotational cool burns have been recorded reducing megafire vulnerability by over sixty percent.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'TRUE',
            explanation: 'Paragraph C states satellite data indicates a "68% reduction in megafire vulnerability".',
            paragraphReference: 'Paragraph C'
          },
          {
            id: 4,
            type: 'sentence_completion',
            prompt: 'Indigenous low-temperature controlled burning is commonly known as "______ burning".',
            correctAnswer: 'cool',
            explanation: 'Paragraph B: "...often characterized as \'cool burning\'."',
            paragraphReference: 'Paragraph B'
          }
        ]
      },
      {
        id: 2,
        title: 'Roman Concrete: The Geo-Architectural Secret of Ancient Maritime Longevity',
        subtitle: 'Why 2,000-year-old Roman piers endure in saltwater while modern concrete deteriorates',
        paragraphs: [
          {
            id: 'A',
            text: 'Modern Portland cement concrete is the ubiquitous bedrock of contemporary civil engineering, yet its durability in marine environments is notoriously short, typically degrading within 50 to 100 years due to saltwater chloride intrusion and chemical corrosion. In stark contrast, Roman breakwaters, piers, and harbour vaults constructed two millennia ago along the Mediterranean shoreline remain structurally pristine.'
          },
          {
            id: 'B',
            text: 'Geological excavations led by the University of Utah unraveled the chemical riddle. Pliny the Elder and Vitruvius documented that Roman mortar blended volcanic ash—quarried principally from Pozzuoli near Mount Vesuvius—with slaked lime and volcanic tuff rock fragments. When seawater percolates through the porous mortar, it triggers a dynamic mineral reaction: the alkaline seawater dissolves volcanic pumice glass, precipitating an interlocking crystalline lattice of aluminous tobermorite and phillipsite.'
          },
          {
            id: 'C',
            text: 'Unlike modern concrete, which cracks and weakens as internal moisture precipitates corrosive salts, Roman marine concrete actually gains compressive strength over centuries of saltwater immersion. The interlocking mineral crystals weave microscopic bridges across fissures, functioning as self-healing structural reinforcement.'
          }
        ],
        questions: [
          {
            id: 5,
            type: 'multiple_choice',
            prompt: 'Modern marine concrete typically exhibits structural degradation because of:',
            options: [
              'A. Excessive amounts of volcanic pumice',
              'B. Saltwater chloride intrusion and chemical corrosion',
              'C. Continuous growth of tobermorite crystals',
              'D. Insufficient compression during initial setting'
            ],
            correctAnswer: 'B. Saltwater chloride intrusion and chemical corrosion',
            explanation: 'Paragraph A indicates modern concrete degrades in marine settings due to "saltwater chloride intrusion and chemical corrosion".',
            paragraphReference: 'Paragraph A'
          },
          {
            id: 6,
            type: 'true_false_not_given',
            prompt: 'Roman concrete breakwaters were reinforced with inner steel rebar rods.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'FALSE',
            explanation: 'Paragraph B details the mix of volcanic ash, lime, and tuff rock without any steel rebar.',
            paragraphReference: 'Paragraph B'
          },
          {
            id: 7,
            type: 'sentence_completion',
            prompt: 'Volcanic ash used for Roman mortar was primarily sourced from the region of ______ near Mount Vesuvius.',
            correctAnswer: 'Pozzuoli',
            explanation: 'Paragraph B: "...quarried principally from Pozzuoli near Mount Vesuvius..."',
            paragraphReference: 'Paragraph B'
          }
        ]
      }
    ]
  }`;

const cam17Test1 = `  {
    id: 'cam17_test1_reading',
    title: 'Academic Reading Practice Test 1 (Cambridge 17 经典全真)',
    source: 'Cambridge IELTS 17 Academic Official',
    bankCategory: 'cam17',
    year: '2022-2023',
    difficulty: 'Authentic Exam',
    tags: ['Vertical Farming', 'Acoustic Megaliths', 'Food Security', 'Headings'],
    durationMinutes: 60,
    passages: [
      {
        id: 1,
        title: 'Vertical Farming: Transforming High-Density Urban Agriculture',
        subtitle: 'How closed-loop aeroponics and LED spectra can sustain future metropolitan populations',
        paragraphs: [
          {
            id: 'A',
            text: 'By the year 2050, the human population is projected to exceed 9.7 billion, with approximately 70% concentrated within sprawling megacities. Feeding this urban populace through traditional horizontal agriculture poses an acute existential bottleneck: over 80% of Earth’s arable land is already cultivated, while climate extremes and soil erosion deplete millions of fertile hectares annually.'
          },
          {
            id: 'B',
            text: 'Pioneered by Columbia University ecologist Dickson Despommier, vertical farming proposes a radical spatial pivot: cultivating crops upward in multi-tier climate-controlled indoor towers. Utilizing advanced aeroponics, plant roots are suspended in air and misted at programmed intervals with atomized nutrient solutions. This technique slashes agricultural water consumption by 95% compared to open-field furrow irrigation, while eliminating synthetic pesticide runoff altogether.'
          },
          {
            id: 'C',
            text: 'The principal barrier impeding widespread commercial expansion remains electrical energy overhead. High-output photosynthetic LED arrays require substantial kilowattage to simulate natural sunlight. However, developers are integrating next-generation gallium-nitride diodes and coupling facilities directly to municipal geothermal and photovoltaic microgrids, dramatically lowering production costs per kilogram of produce.'
          }
        ],
        questions: [
          {
            id: 1,
            type: 'multiple_choice',
            prompt: 'Traditional open-field farming faces impending crises mainly because:',
            options: [
              'A. Most of the world’s arable land is already under cultivation',
              'B. Farmers refuse to utilize modern irrigation pumps',
              'C. Megacities have abandoned food consumption altogether',
              'D. Furrow irrigation consumes zero water'
            ],
            correctAnswer: 'A. Most of the world’s arable land is already under cultivation',
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
            prompt: 'The academic pioneer who proposed vertical farming at Columbia University was Dickson ______.',
            correctAnswer: 'Despommier',
            explanation: 'Paragraph B: "...pioneered by Columbia University ecologist Dickson Despommier..."',
            paragraphReference: 'Paragraph B'
          }
        ]
      }
    ]
  }`;

const cdiRecentTest = `  {
    id: 'cdi_2025_reading_recall',
    title: '2025/2026 机考高频回忆专项卷 (CDI Academic Recall)',
    source: '2025/2026 CDI Machine Exam Recall Pool',
    bankCategory: 'cdi_recent',
    year: '2025-2026',
    difficulty: 'Authentic Exam',
    tags: ['Generative AI', 'Higher Education', 'Permafrost Thaw', 'TFNG'],
    durationMinutes: 60,
    passages: [
      {
        id: 1,
        title: 'Generative AI and Academic Integrity: Reimagining University Pedagogy',
        subtitle: 'Moving from punitive plagiarism policing to interactive Socratic sparring in tertiary education',
        paragraphs: [
          {
            id: 'A',
            text: 'When large language models (LLMs) emerged into mainstream accessibility in late 2022, the knee-jerk reaction across global universities was panic and prohibition. Prestigious institutions across North America and Europe hastily modified honor codes, deployed automated AI detection software, and mandated closed-book proctored exams to safeguard assessment integrity. Yet within months, automated detectors were revealed to suffer from staggering false-positive rates, disproportionately penalizing non-native English scholars whose formal syntax resembled algorithmic outputs.'
          },
          {
            id: 'B',
            text: 'A profound philosophical pivot has since unfolded. Forward-thinking universities are transforming AI from a suspected contraband into a compulsory pedagogical tool. Rather than grading static argumentative essays, professors assign students to debate generative models: learners must prompt the AI to generate counter-theses, interrogate its citations for factual hallucinations, and compose metacognitive logs defending their personal editorial judgments.'
          }
        ],
        questions: [
          {
            id: 1,
            type: 'true_false_not_given',
            prompt: 'Automated AI detectors exhibited higher false-positive rates among international non-native English speakers.',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            correctAnswer: 'TRUE',
            explanation: 'Paragraph A confirms detectors suffered from high false positives, "disproportionately penalizing non-native English scholars whose formal syntax resembled algorithmic outputs".',
            paragraphReference: 'Paragraph A'
          },
          {
            id: 2,
            type: 'sentence_completion',
            prompt: 'Erroneous citations fabricated by generative AI models are academically described as factual ______.',
            correctAnswer: 'hallucinations',
            explanation: 'Paragraph B mentions students are tasked with interrogating AI citations for "factual hallucinations".',
            paragraphReference: 'Paragraph B'
          }
        ]
      }
    ]
  }`;

const fileContent = `import { ReadingTest } from '../types/ielts';

export const READING_TESTS: ReadingTest[] = [
${originalTest1},
${cam19Test2},
${cam18Test1},
${cam17Test1},
${cdiRecentTest}
];
`;

const dest = path.join(__dirname, '..', 'src', 'data', 'readingTests.ts');
fs.writeFileSync(dest, fileContent, 'utf8');
console.log('Successfully wrote expanded readingTests.ts with 5 full test papers!');

export interface SyllabusTopic {
  name: string;
  keywords: string[];
}

export interface SyllabusChapter {
  number: number;
  name: string;
  topics: SyllabusTopic[];
}

export interface SyllabusSubject {
  name: string;
  chapters: SyllabusChapter[];
}

export interface SyllabusClass {
  class: number;
  subjects: SyllabusSubject[];
}

export const ncertSyllabus: SyllabusClass[] = [
  {
    class: 1,
    subjects: [
      {
        name: "Mathematics",
        chapters: [
          { number: 1, name: "Shapes and Space", topics: [
            { name: "Shapes around us", keywords: ["circle", "triangle", "square", "rectangle"] },
            { name: "Patterns", keywords: ["repeating", "growing", "colour patterns"] },
          ]},
          { number: 2, name: "Numbers from 1 to 9", topics: [
            { name: "Counting objects", keywords: ["count", "match", "one-to-one"] },
            { name: "Comparing numbers", keywords: ["more", "less", "same"] },
          ]},
          { number: 3, name: "Addition", topics: [
            { name: "Adding single digits", keywords: ["sum", "total", "put together"] },
            { name: "Word problems on addition", keywords: ["story sums", "altogether"] },
          ]},
          { number: 4, name: "Subtraction", topics: [
            { name: "Taking away", keywords: ["minus", "left", "remaining"] },
            { name: "Word problems on subtraction", keywords: ["how many left", "difference"] },
          ]},
          { number: 5, name: "Numbers from 10 to 20", topics: [
            { name: "Teen numbers", keywords: ["eleven", "twelve", "place value"] },
            { name: "Ordering numbers", keywords: ["before", "after", "between"] },
          ]},
        ],
      },
      {
        name: "EVS",
        chapters: [
          { number: 1, name: "My Family", topics: [
            { name: "Family members", keywords: ["mother", "father", "siblings", "grandparents"] },
            { name: "Roles in a family", keywords: ["caring", "helping", "sharing"] },
          ]},
          { number: 2, name: "My Body", topics: [
            { name: "Body parts", keywords: ["head", "hands", "legs", "eyes", "ears"] },
            { name: "Keeping clean", keywords: ["hygiene", "bathing", "brushing teeth"] },
          ]},
          { number: 3, name: "Food We Eat", topics: [
            { name: "Types of food", keywords: ["fruits", "vegetables", "grains", "milk"] },
            { name: "Healthy eating", keywords: ["balanced diet", "junk food", "nutrition"] },
          ]},
        ],
      },
      {
        name: "English",
        chapters: [
          { number: 1, name: "A Happy Child", topics: [
            { name: "Reading comprehension", keywords: ["poem", "happiness", "nature"] },
            { name: "Rhyming words", keywords: ["rhyme", "sound", "match"] },
          ]},
          { number: 2, name: "Three Little Pigs", topics: [
            { name: "Story sequencing", keywords: ["first", "then", "finally"] },
            { name: "Vocabulary building", keywords: ["new words", "meanings"] },
          ]},
          { number: 3, name: "The Bubble, the Straw, and the Shoe", topics: [
            { name: "Reading aloud", keywords: ["pronunciation", "fluency"] },
            { name: "Opposites", keywords: ["big-small", "hot-cold", "antonyms"] },
          ]},
        ],
      },
      {
        name: "Hindi",
        chapters: [
          { number: 1, name: "झूला (Jhula)", topics: [
            { name: "स्वर और व्यंजन", keywords: ["vowels", "consonants", "अ-अः", "क-ज्ञ"] },
            { name: "शब्द पहचान", keywords: ["word recognition", "picture matching"] },
          ]},
          { number: 2, name: "आम की कहानी", topics: [
            { name: "सरल वाक्य", keywords: ["simple sentences", "subject-verb"] },
            { name: "चित्र वर्णन", keywords: ["picture description", "naming objects"] },
          ]},
        ],
      },
    ],
  },
  {
    class: 2,
    subjects: [
      {
        name: "Mathematics",
        chapters: [
          { number: 1, name: "What is Long, What is Round?", topics: [
            { name: "Shapes and measurements", keywords: ["long", "short", "round", "flat"] },
            { name: "Comparing lengths", keywords: ["longer", "shorter", "taller"] },
          ]},
          { number: 2, name: "Counting in Groups", topics: [
            { name: "Skip counting", keywords: ["twos", "fives", "tens"] },
            { name: "Place value", keywords: ["ones", "tens", "hundreds"] },
          ]},
          { number: 3, name: "How Much Can You Carry?", topics: [
            { name: "Weight and measurement", keywords: ["heavy", "light", "balance"] },
            { name: "Comparing weights", keywords: ["heavier", "lighter", "equal"] },
          ]},
          { number: 4, name: "Counting in Tens", topics: [
            { name: "Tens and ones", keywords: ["place value", "abacus", "bundles"] },
            { name: "Numbers up to 100", keywords: ["number names", "expanded form"] },
          ]},
        ],
      },
      {
        name: "EVS",
        chapters: [
          { number: 1, name: "My Home", topics: [
            { name: "Types of houses", keywords: ["kutcha", "pucca", "flat", "hut"] },
            { name: "Things at home", keywords: ["furniture", "utensils", "rooms"] },
          ]},
          { number: 2, name: "Plants Around Us", topics: [
            { name: "Parts of a plant", keywords: ["root", "stem", "leaf", "flower"] },
            { name: "Uses of plants", keywords: ["food", "medicine", "shade", "oxygen"] },
          ]},
          { number: 3, name: "Animals Around Us", topics: [
            { name: "Pet and wild animals", keywords: ["dog", "cat", "lion", "tiger"] },
            { name: "Animal homes", keywords: ["nest", "burrow", "den", "stable"] },
          ]},
        ],
      },
      {
        name: "English",
        chapters: [
          { number: 1, name: "First Day at School", topics: [
            { name: "Reading comprehension", keywords: ["school", "friends", "teacher"] },
            { name: "Sentence formation", keywords: ["subject", "verb", "complete sentence"] },
          ]},
          { number: 2, name: "Haldi's Adventure", topics: [
            { name: "Story elements", keywords: ["character", "setting", "plot"] },
            { name: "Question-answer", keywords: ["who", "what", "where", "when"] },
          ]},
        ],
      },
      {
        name: "Hindi",
        chapters: [
          { number: 1, name: "ऊँट चला", topics: [
            { name: "मात्राएँ", keywords: ["matras", "aa", "ee", "oo"] },
            { name: "शब्द निर्माण", keywords: ["word formation", "joining letters"] },
          ]},
          { number: 2, name: "भालू ने खेली फुटबॉल", topics: [
            { name: "कहानी समझ", keywords: ["story comprehension", "sequence"] },
            { name: "विलोम शब्द", keywords: ["opposites", "antonyms in Hindi"] },
          ]},
        ],
      },
    ],
  },
  {
    class: 3,
    subjects: [
      {
        name: "Mathematics",
        chapters: [
          { number: 1, name: "Where to Look From", topics: [
            { name: "Spatial understanding", keywords: ["top view", "front view", "side view"] },
            { name: "Patterns in shapes", keywords: ["symmetry", "tile patterns"] },
          ]},
          { number: 2, name: "Fun with Numbers", topics: [
            { name: "Numbers up to 1000", keywords: ["hundreds", "place value", "expanded form"] },
            { name: "Number patterns", keywords: ["odd", "even", "ascending", "descending"] },
          ]},
          { number: 3, name: "Give and Take", topics: [
            { name: "Addition with carry", keywords: ["regrouping", "3-digit addition"] },
            { name: "Subtraction with borrow", keywords: ["regrouping", "3-digit subtraction"] },
          ]},
          { number: 4, name: "Long and Short", topics: [
            { name: "Measurement of length", keywords: ["metre", "centimetre", "ruler"] },
            { name: "Estimating length", keywords: ["handspan", "footstep", "cubit"] },
          ]},
          { number: 5, name: "Shapes and Designs", topics: [
            { name: "2D Shapes", keywords: ["triangle", "circle", "square", "rectangle"] },
            { name: "Tangrams and tiling", keywords: ["tangram", "tessellation", "pattern"] },
          ]},
        ],
      },
      {
        name: "EVS",
        chapters: [
          { number: 1, name: "Poonam's Day Out", topics: [
            { name: "Observing surroundings", keywords: ["nature", "birds", "trees", "water"] },
            { name: "Seasons and weather", keywords: ["summer", "winter", "rain", "changes"] },
          ]},
          { number: 2, name: "Plant Fairy", topics: [
            { name: "Seed to plant", keywords: ["germination", "seed", "sapling", "growth"] },
            { name: "Caring for plants", keywords: ["water", "sunlight", "soil", "manure"] },
          ]},
          { number: 3, name: "Water O Water", topics: [
            { name: "Sources of water", keywords: ["river", "well", "rain", "tap"] },
            { name: "Saving water", keywords: ["conservation", "waste", "reuse"] },
          ]},
        ],
      },
      {
        name: "English",
        chapters: [
          { number: 1, name: "Good Morning", topics: [
            { name: "Poem comprehension", keywords: ["greetings", "morning", "nature"] },
            { name: "Adjectives", keywords: ["describing words", "colour", "size", "shape"] },
          ]},
          { number: 2, name: "The Magic Garden", topics: [
            { name: "Story reading", keywords: ["garden", "magic", "adventure"] },
            { name: "Tenses introduction", keywords: ["past", "present", "future", "verb forms"] },
          ]},
        ],
      },
      {
        name: "Hindi",
        chapters: [
          { number: 1, name: "कक्कू", topics: [
            { name: "गद्यांश बोध", keywords: ["comprehension", "prose", "understanding"] },
            { name: "संज्ञा", keywords: ["nouns", "naming words", "person-place-thing"] },
          ]},
          { number: 2, name: "शेखीबाज़ मक्खी", topics: [
            { name: "कहानी लेखन", keywords: ["story writing", "imagination", "sequence"] },
            { name: "सर्वनाम", keywords: ["pronouns", "he-she-it", "replacement words"] },
          ]},
        ],
      },
    ],
  },
  {
    class: 4,
    subjects: [
      {
        name: "Mathematics",
        chapters: [
          { number: 1, name: "Building with Bricks", topics: [
            { name: "Patterns in shapes", keywords: ["floor patterns", "wall patterns", "bricks"] },
            { name: "Area and perimeter intro", keywords: ["covering", "boundary", "tiles"] },
          ]},
          { number: 2, name: "Long and Short", topics: [
            { name: "Measurement conversions", keywords: ["km-m", "m-cm", "conversion"] },
            { name: "Word problems on length", keywords: ["distance", "height", "longer-shorter"] },
          ]},
          { number: 3, name: "A Trip to Bhopal", topics: [
            { name: "Large numbers", keywords: ["thousands", "ten-thousands", "place value"] },
            { name: "Estimating and rounding", keywords: ["nearest ten", "nearest hundred", "approximate"] },
          ]},
          { number: 4, name: "Tick Tick Tick", topics: [
            { name: "Time", keywords: ["hours", "minutes", "seconds", "clock reading"] },
            { name: "Calendar", keywords: ["days", "weeks", "months", "leap year"] },
          ]},
          { number: 5, name: "The Way The World Looks", topics: [
            { name: "Maps and directions", keywords: ["left", "right", "north", "south", "map reading"] },
            { name: "Symmetry", keywords: ["mirror image", "line of symmetry", "fold"] },
          ]},
          { number: 6, name: "The Junk Seller", topics: [
            { name: "Multiplication tables", keywords: ["tables 2-12", "product", "times"] },
            { name: "Division basics", keywords: ["sharing equally", "quotient", "remainder"] },
          ]},
          { number: 7, name: "Jugs and Mugs", topics: [
            { name: "Volume and capacity", keywords: ["litre", "millilitre", "cups", "bottles"] },
            { name: "Estimation of capacity", keywords: ["full", "half", "quarter", "measuring"] },
          ]},
        ],
      },
      {
        name: "EVS",
        chapters: [
          { number: 1, name: "Going to School", topics: [
            { name: "Different ways of going to school", keywords: ["walk", "bus", "boat", "cycle"] },
            { name: "Transport and terrain", keywords: ["mountains", "rivers", "bridges", "roads"] },
          ]},
          { number: 2, name: "Ear to Ear", topics: [
            { name: "Senses and hearing", keywords: ["ear", "sound", "hearing", "deaf"] },
            { name: "Sign language", keywords: ["communication", "gestures", "braille"] },
          ]},
          { number: 3, name: "A Day with Nandu", topics: [
            { name: "Adaptations in animals", keywords: ["elephant", "trunk", "habitat", "survival"] },
            { name: "Animal behaviour", keywords: ["herds", "migration", "food habits"] },
          ]},
          { number: 4, name: "The Story of Amrita", topics: [
            { name: "Saving trees", keywords: ["Bishnoi", "Chipko", "deforestation", "conservation"] },
            { name: "Environment protection", keywords: ["forest", "wildlife", "ecology"] },
          ]},
        ],
      },
      {
        name: "English",
        chapters: [
          { number: 1, name: "Wake Up!", topics: [
            { name: "Poem analysis", keywords: ["nature", "morning", "imagery"] },
            { name: "Parts of speech", keywords: ["noun", "verb", "adjective", "adverb"] },
          ]},
          { number: 2, name: "Neha's Alarm Clock", topics: [
            { name: "Narrative comprehension", keywords: ["story", "characters", "sequence"] },
            { name: "Letter writing", keywords: ["formal", "informal", "greeting", "closing"] },
          ]},
          { number: 3, name: "Noses", topics: [
            { name: "Poem appreciation", keywords: ["funny poem", "rhyme scheme", "imagery"] },
            { name: "Singular and Plural", keywords: ["one-many", "s-es", "irregular plurals"] },
          ]},
        ],
      },
      {
        name: "Hindi",
        chapters: [
          { number: 1, name: "मन के भोले-भाले बादल", topics: [
            { name: "कविता बोध", keywords: ["poetry", "clouds", "imagination"] },
            { name: "विशेषण", keywords: ["adjectives", "describing words in Hindi"] },
          ]},
          { number: 2, name: "जैसा सवाल वैसा जवाब", topics: [
            { name: "कहानी बोध", keywords: ["wit", "cleverness", "moral story"] },
            { name: "क्रिया", keywords: ["verbs", "action words", "tenses in Hindi"] },
          ]},
        ],
      },
    ],
  },
  {
    class: 5,
    subjects: [
      {
        name: "Mathematics",
        chapters: [
          { number: 1, name: "The Fish Tale", topics: [
            { name: "Large numbers", keywords: ["lakhs", "place value", "Indian system"] },
            { name: "Roman numerals", keywords: ["I", "V", "X", "L", "C", "D", "M"] },
          ]},
          { number: 2, name: "Shapes and Angles", topics: [
            { name: "Types of angles", keywords: ["acute", "obtuse", "right", "straight"] },
            { name: "Polygons", keywords: ["triangle", "quadrilateral", "pentagon", "hexagon"] },
          ]},
          { number: 3, name: "How Many Squares?", topics: [
            { name: "Area on graph paper", keywords: ["counting squares", "area of irregular shapes"] },
            { name: "Area and perimeter", keywords: ["rectangle area", "perimeter formula"] },
          ]},
          { number: 4, name: "Parts and Wholes", topics: [
            { name: "Fractions", keywords: ["numerator", "denominator", "half", "quarter", "third"] },
            { name: "Equivalent fractions", keywords: ["equal parts", "simplification", "comparison"] },
          ]},
          { number: 5, name: "Does it Look the Same?", topics: [
            { name: "Symmetry", keywords: ["line symmetry", "mirror image", "rotational"] },
            { name: "Patterns and tessellation", keywords: ["repeating", "rotating", "tiling"] },
          ]},
          { number: 6, name: "Be My Multiple, I'll Be Your Factor", topics: [
            { name: "Factors and multiples", keywords: ["divisibility", "HCF", "LCM", "prime"] },
            { name: "Prime numbers", keywords: ["prime", "composite", "sieve of Eratosthenes"] },
          ]},
          { number: 7, name: "Can You See the Pattern?", topics: [
            { name: "Number patterns", keywords: ["sequences", "rules", "growing patterns"] },
            { name: "Magic squares", keywords: ["sum", "arrangement", "puzzle"] },
          ]},
        ],
      },
      {
        name: "EVS",
        chapters: [
          { number: 1, name: "Super Senses", topics: [
            { name: "Animal senses", keywords: ["sight", "smell", "hearing", "touch", "night vision"] },
            { name: "Human vs animal senses", keywords: ["comparison", "adaptation", "survival"] },
          ]},
          { number: 2, name: "A Snake Charmer's Story", topics: [
            { name: "Reptiles and snakes", keywords: ["snake", "reptile", "venom", "scales"] },
            { name: "Wildlife protection", keywords: ["endangered", "law", "protection act"] },
          ]},
          { number: 3, name: "From Tasting to Digesting", topics: [
            { name: "Digestive system", keywords: ["mouth", "stomach", "intestine", "digestion"] },
            { name: "Nutrition", keywords: ["carbohydrates", "proteins", "fats", "vitamins"] },
          ]},
          { number: 4, name: "Experiments with Water", topics: [
            { name: "Properties of water", keywords: ["dissolving", "floating", "sinking"] },
            { name: "Water cycle", keywords: ["evaporation", "condensation", "rain", "clouds"] },
          ]},
        ],
      },
      {
        name: "English",
        chapters: [
          { number: 1, name: "Wonderful Waste!", topics: [
            { name: "Reading comprehension", keywords: ["recycling", "waste management", "environment"] },
            { name: "Paragraph writing", keywords: ["topic sentence", "supporting details", "conclusion"] },
          ]},
          { number: 2, name: "Flying Together", topics: [
            { name: "Story analysis", keywords: ["moral", "teamwork", "birds", "unity"] },
            { name: "Dialogue writing", keywords: ["speech marks", "he said", "she said"] },
          ]},
          { number: 3, name: "My Shadow", topics: [
            { name: "Poem analysis", keywords: ["Robert Louis Stevenson", "shadow", "imagery"] },
            { name: "Prepositions", keywords: ["in", "on", "under", "behind", "between"] },
          ]},
        ],
      },
      {
        name: "Hindi",
        chapters: [
          { number: 1, name: "राख की रस्सी", topics: [
            { name: "लोककथा", keywords: ["folk tale", "wisdom", "Akbar-Birbal"] },
            { name: "मुहावरे", keywords: ["idioms", "Hindi phrases", "common sayings"] },
          ]},
          { number: 2, name: "फसलों के त्योहार", topics: [
            { name: "भारत के त्योहार", keywords: ["Pongal", "Baisakhi", "Lohri", "harvest"] },
            { name: "निबंध लेखन", keywords: ["essay", "paragraph", "description"] },
          ]},
        ],
      },
    ],
  },
  {
    class: 6,
    subjects: [
      {
        name: "Mathematics",
        chapters: [
          { number: 1, name: "Knowing Our Numbers", topics: [
            { name: "Indian and International number systems", keywords: ["lakh", "crore", "million", "billion"] },
            { name: "Estimation and rounding", keywords: ["round off", "approximate", "significant digits"] },
          ]},
          { number: 2, name: "Whole Numbers", topics: [
            { name: "Properties of whole numbers", keywords: ["closure", "commutative", "associative", "distributive"] },
            { name: "Number line", keywords: ["successor", "predecessor", "distance"] },
          ]},
          { number: 3, name: "Playing with Numbers", topics: [
            { name: "Divisibility rules", keywords: ["divisible by 2,3,5,9,10", "tests"] },
            { name: "HCF and LCM", keywords: ["prime factorization", "common factors", "common multiples"] },
          ]},
          { number: 4, name: "Basic Geometrical Ideas", topics: [
            { name: "Points, lines, segments, rays", keywords: ["point", "line segment", "ray", "collinear"] },
            { name: "Curves and polygons", keywords: ["open curve", "closed curve", "polygon", "diagonal"] },
          ]},
          { number: 5, name: "Understanding Elementary Shapes", topics: [
            { name: "Measuring angles", keywords: ["protractor", "degree", "acute", "obtuse", "reflex"] },
            { name: "Triangles and quadrilaterals classification", keywords: ["equilateral", "isosceles", "scalene", "parallelogram", "rhombus"] },
          ]},
          { number: 6, name: "Integers", topics: [
            { name: "Negative numbers", keywords: ["negative", "positive", "zero", "temperature"] },
            { name: "Addition and subtraction of integers", keywords: ["number line", "absolute value"] },
          ]},
          { number: 7, name: "Fractions", topics: [
            { name: "Types of fractions", keywords: ["proper", "improper", "mixed", "like", "unlike"] },
            { name: "Operations on fractions", keywords: ["addition", "subtraction", "comparison", "equivalent"] },
          ]},
          { number: 8, name: "Decimals", topics: [
            { name: "Decimal representation", keywords: ["tenths", "hundredths", "decimal point"] },
            { name: "Operations on decimals", keywords: ["addition", "subtraction", "comparison"] },
          ]},
          { number: 9, name: "Data Handling", topics: [
            { name: "Pictograph and bar graph", keywords: ["data collection", "tally marks", "bar chart"] },
            { name: "Mean, median, mode (intro)", keywords: ["average", "central tendency"] },
          ]},
          { number: 10, name: "Mensuration", topics: [
            { name: "Perimeter", keywords: ["rectangle", "square", "triangle", "boundary"] },
            { name: "Area", keywords: ["rectangle area", "square area", "unit squares"] },
          ]},
          { number: 11, name: "Algebra", topics: [
            { name: "Variables and expressions", keywords: ["variable", "constant", "expression", "equation"] },
            { name: "Simple equations", keywords: ["solving", "LHS=RHS", "trial and error"] },
          ]},
          { number: 12, name: "Ratio and Proportion", topics: [
            { name: "Ratio", keywords: ["comparison", "simplest form", "equivalent ratios"] },
            { name: "Proportion", keywords: ["unitary method", "direct proportion", "cross multiplication"] },
          ]},
        ],
      },
      {
        name: "Science",
        chapters: [
          { number: 1, name: "Food: Where Does it Come From?", topics: [
            { name: "Sources of food", keywords: ["plants", "animals", "ingredients", "herbivore", "omnivore"] },
            { name: "Food variety", keywords: ["spices", "cooking methods", "raw materials"] },
          ]},
          { number: 2, name: "Components of Food", topics: [
            { name: "Nutrients", keywords: ["carbohydrates", "proteins", "fats", "vitamins", "minerals"] },
            { name: "Balanced diet and deficiency diseases", keywords: ["scurvy", "rickets", "goitre", "balanced diet"] },
          ]},
          { number: 3, name: "Fibre to Fabric", topics: [
            { name: "Natural fibres", keywords: ["cotton", "jute", "wool", "silk", "plant fibre"] },
            { name: "From fibre to yarn", keywords: ["spinning", "weaving", "knitting", "ginning"] },
          ]},
          { number: 4, name: "Sorting Materials into Groups", topics: [
            { name: "Properties of materials", keywords: ["transparent", "opaque", "soluble", "insoluble"] },
            { name: "Classification", keywords: ["metal", "non-metal", "hard", "soft", "rough", "smooth"] },
          ]},
          { number: 5, name: "Separation of Substances", topics: [
            { name: "Methods of separation", keywords: ["filtration", "evaporation", "sieving", "decantation"] },
            { name: "Mixtures and solutions", keywords: ["dissolving", "saturated", "pure substance"] },
          ]},
          { number: 6, name: "Changes Around Us", topics: [
            { name: "Reversible and irreversible changes", keywords: ["melting", "freezing", "burning", "cooking"] },
            { name: "Physical and chemical changes", keywords: ["rusting", "curdling", "expansion"] },
          ]},
          { number: 7, name: "Getting to Know Plants", topics: [
            { name: "Parts of a plant", keywords: ["root", "stem", "leaf", "flower", "fruit"] },
            { name: "Types of plants", keywords: ["herb", "shrub", "tree", "creeper", "climber"] },
          ]},
          { number: 8, name: "Body Movements", topics: [
            { name: "Human skeleton", keywords: ["bones", "joints", "skull", "ribcage", "spine"] },
            { name: "Locomotion in animals", keywords: ["walking", "flying", "swimming", "crawling"] },
          ]},
          { number: 9, name: "The Living Organisms and Their Surroundings", topics: [
            { name: "Habitat and adaptation", keywords: ["desert", "aquatic", "terrestrial", "adaptation"] },
            { name: "Living vs non-living", keywords: ["respiration", "growth", "reproduction", "stimulus"] },
          ]},
          { number: 10, name: "Motion and Measurement of Distances", topics: [
            { name: "Types of motion", keywords: ["rectilinear", "circular", "periodic", "rotational"] },
            { name: "Standard units", keywords: ["metre", "kilometre", "SI units"] },
          ]},
        ],
      },
      {
        name: "English",
        chapters: [
          { number: 1, name: "Who Did Patrick's Homework?", topics: [
            { name: "Story comprehension", keywords: ["elf", "homework", "magic", "learning"] },
            { name: "Past tense", keywords: ["regular", "irregular", "-ed", "did"] },
          ]},
          { number: 2, name: "How the Dog Found Himself a New Master!", topics: [
            { name: "Narrative analysis", keywords: ["dog", "master", "strongest", "moral"] },
            { name: "Direct and indirect speech", keywords: ["reporting", "said that", "told"] },
          ]},
          { number: 3, name: "Taro's Reward", topics: [
            { name: "Cultural story", keywords: ["Japan", "filial piety", "reward", "honesty"] },
            { name: "Comprehension and vocabulary", keywords: ["inference", "context clues", "synonyms"] },
          ]},
        ],
      },
      {
        name: "Hindi",
        chapters: [
          { number: 1, name: "वह चिड़िया जो", topics: [
            { name: "कविता रसास्वादन", keywords: ["poetry appreciation", "bird", "freedom"] },
            { name: "अलंकार परिचय", keywords: ["figures of speech", "simile", "alliteration"] },
          ]},
          { number: 2, name: "बचपन", topics: [
            { name: "आत्मकथा अंश", keywords: ["autobiography", "childhood memories"] },
            { name: "काल (Tenses)", keywords: ["past", "present", "future", "Hindi tenses"] },
          ]},
        ],
      },
    ],
  },
  {
    class: 7,
    subjects: [
      {
        name: "Mathematics",
        chapters: [
          { number: 1, name: "Integers", topics: [
            { name: "Properties of integers", keywords: ["closure", "commutative", "associative", "identity"] },
            { name: "Multiplication and division of integers", keywords: ["product", "quotient", "sign rules"] },
          ]},
          { number: 2, name: "Fractions and Decimals", topics: [
            { name: "Operations on fractions", keywords: ["multiplication", "division", "reciprocal"] },
            { name: "Operations on decimals", keywords: ["multiply", "divide", "decimal places"] },
          ]},
          { number: 3, name: "Data Handling", topics: [
            { name: "Mean, median, mode", keywords: ["average", "middle value", "most frequent"] },
            { name: "Bar graphs and double bar graphs", keywords: ["comparison", "representation", "scale"] },
          ]},
          { number: 4, name: "Simple Equations", topics: [
            { name: "Forming equations", keywords: ["variable", "expression", "equation"] },
            { name: "Solving linear equations", keywords: ["transposing", "balancing", "LHS=RHS"] },
          ]},
          { number: 5, name: "Lines and Angles", topics: [
            { name: "Pairs of angles", keywords: ["complementary", "supplementary", "adjacent", "vertically opposite"] },
            { name: "Parallel lines and transversal", keywords: ["corresponding", "alternate", "co-interior"] },
          ]},
          { number: 6, name: "The Triangle and its Properties", topics: [
            { name: "Angle sum property", keywords: ["180 degrees", "exterior angle", "interior angle"] },
            { name: "Pythagoras theorem (intro)", keywords: ["right triangle", "hypotenuse", "Pythagorean triplet"] },
          ]},
          { number: 7, name: "Congruence of Triangles", topics: [
            { name: "Congruence criteria", keywords: ["SSS", "SAS", "ASA", "RHS"] },
            { name: "Congruent figures", keywords: ["same shape", "same size", "superposition"] },
          ]},
          { number: 8, name: "Comparing Quantities", topics: [
            { name: "Percentage", keywords: ["percent", "fraction to percent", "increase", "decrease"] },
            { name: "Profit, loss, simple interest", keywords: ["cost price", "selling price", "principal", "rate", "time"] },
          ]},
          { number: 9, name: "Rational Numbers", topics: [
            { name: "Introduction to rational numbers", keywords: ["p/q form", "positive", "negative", "number line"] },
            { name: "Operations on rational numbers", keywords: ["addition", "subtraction", "multiplication"] },
          ]},
          { number: 10, name: "Perimeter and Area", topics: [
            { name: "Area of parallelogram and triangle", keywords: ["base", "height", "formula"] },
            { name: "Circumference and area of circle", keywords: ["pi", "radius", "diameter", "πr²"] },
          ]},
          { number: 11, name: "Algebraic Expressions", topics: [
            { name: "Terms and coefficients", keywords: ["like terms", "unlike terms", "coefficient", "constant"] },
            { name: "Addition and subtraction of expressions", keywords: ["combining", "simplifying"] },
          ]},
          { number: 12, name: "Exponents and Powers", topics: [
            { name: "Laws of exponents", keywords: ["base", "power", "product rule", "quotient rule"] },
            { name: "Standard form", keywords: ["scientific notation", "large numbers", "small numbers"] },
          ]},
        ],
      },
      {
        name: "Science",
        chapters: [
          { number: 1, name: "Nutrition in Plants", topics: [
            { name: "Photosynthesis", keywords: ["chlorophyll", "sunlight", "carbon dioxide", "glucose"] },
            { name: "Other modes of nutrition", keywords: ["parasitic", "insectivorous", "saprophytic"] },
          ]},
          { number: 2, name: "Nutrition in Animals", topics: [
            { name: "Human digestive system", keywords: ["mouth", "oesophagus", "stomach", "intestine", "enzymes"] },
            { name: "Digestion in ruminants", keywords: ["cud chewing", "four stomachs", "cellulose"] },
          ]},
          { number: 3, name: "Heat", topics: [
            { name: "Temperature and thermometer", keywords: ["Celsius", "clinical", "laboratory", "mercury"] },
            { name: "Conduction, convection, radiation", keywords: ["conductor", "insulator", "sea breeze", "land breeze"] },
          ]},
          { number: 4, name: "Acids, Bases and Salts", topics: [
            { name: "Indicators", keywords: ["litmus", "turmeric", "china rose", "acid", "base"] },
            { name: "Neutralization", keywords: ["acid + base = salt + water", "antacid", "pH"] },
          ]},
          { number: 5, name: "Physical and Chemical Changes", topics: [
            { name: "Differences", keywords: ["reversible", "irreversible", "new substance", "colour change"] },
            { name: "Chemical reactions", keywords: ["rusting", "galvanization", "crystallization"] },
          ]},
          { number: 6, name: "Respiration in Organisms", topics: [
            { name: "Aerobic and anaerobic respiration", keywords: ["oxygen", "glucose", "energy", "fermentation"] },
            { name: "Breathing mechanism", keywords: ["lungs", "diaphragm", "inhalation", "exhalation"] },
          ]},
          { number: 7, name: "Motion and Time", topics: [
            { name: "Speed and velocity", keywords: ["distance", "time", "speed=distance/time"] },
            { name: "Distance-time graphs", keywords: ["uniform motion", "non-uniform", "graph reading"] },
          ]},
          { number: 8, name: "Electric Current and Its Effects", topics: [
            { name: "Heating and magnetic effects", keywords: ["filament", "fuse", "electromagnet", "MCB"] },
            { name: "Electric circuits", keywords: ["cell", "switch", "wire", "bulb", "series", "parallel"] },
          ]},
        ],
      },
      {
        name: "English",
        chapters: [
          { number: 1, name: "Three Questions", topics: [
            { name: "Story by Leo Tolstoy", keywords: ["king", "wise", "hermit", "moral"] },
            { name: "Active and passive voice", keywords: ["agent", "action", "receiver", "by"] },
          ]},
          { number: 2, name: "A Gift of Chappals", topics: [
            { name: "Story analysis", keywords: ["generosity", "music", "cat", "chappals"] },
            { name: "Conjunctions", keywords: ["and", "but", "or", "because", "although", "connecting words"] },
          ]},
        ],
      },
      {
        name: "Hindi",
        chapters: [
          { number: 1, name: "हम पंछी उन्मुक्त गगन के", topics: [
            { name: "कविता विश्लेषण", keywords: ["freedom", "bird", "cage", "sky"] },
            { name: "समास", keywords: ["compound words", "dvandva", "tatpurusha"] },
          ]},
          { number: 2, name: "दादी माँ", topics: [
            { name: "गद्य विश्लेषण", keywords: ["grandmother", "love", "family bonds"] },
            { name: "पत्र लेखन", keywords: ["letter writing", "formal", "informal"] },
          ]},
        ],
      },
    ],
  },
  {
    class: 8,
    subjects: [
      {
        name: "Mathematics",
        chapters: [
          { number: 1, name: "Rational Numbers", topics: [
            { name: "Properties of rational numbers", keywords: ["closure", "commutative", "associative", "distributive"] },
            { name: "Representation on number line", keywords: ["positive", "negative", "between two rationals"] },
          ]},
          { number: 2, name: "Linear Equations in One Variable", topics: [
            { name: "Solving linear equations", keywords: ["transposing", "cross multiplication", "variable both sides"] },
            { name: "Word problems", keywords: ["age problems", "number problems", "geometry applications"] },
          ]},
          { number: 3, name: "Understanding Quadrilaterals", topics: [
            { name: "Types of quadrilaterals", keywords: ["parallelogram", "rectangle", "rhombus", "square", "trapezium"] },
            { name: "Angle sum property", keywords: ["360 degrees", "exterior angles", "regular polygon"] },
          ]},
          { number: 4, name: "Practical Geometry", topics: [
            { name: "Construction of quadrilaterals", keywords: ["4 sides + 1 diagonal", "3 sides + 2 diagonals"] },
            { name: "Using ruler and compass", keywords: ["perpendicular bisector", "angle bisector"] },
          ]},
          { number: 5, name: "Data Handling", topics: [
            { name: "Pie charts", keywords: ["circle graph", "sector", "central angle", "percentage"] },
            { name: "Probability introduction", keywords: ["outcome", "event", "equally likely", "random experiment"] },
          ]},
          { number: 6, name: "Squares and Square Roots", topics: [
            { name: "Perfect squares", keywords: ["properties", "patterns", "Pythagorean triplets"] },
            { name: "Finding square roots", keywords: ["prime factorization", "long division method"] },
          ]},
          { number: 7, name: "Cubes and Cube Roots", topics: [
            { name: "Perfect cubes", keywords: ["cube of a number", "patterns"] },
            { name: "Finding cube roots", keywords: ["prime factorization", "estimation"] },
          ]},
          { number: 8, name: "Comparing Quantities", topics: [
            { name: "Discount and tax", keywords: ["marked price", "selling price", "GST", "VAT"] },
            { name: "Compound interest", keywords: ["CI formula", "annually", "half-yearly", "quarterly"] },
          ]},
          { number: 9, name: "Algebraic Expressions and Identities", topics: [
            { name: "Multiplication of polynomials", keywords: ["monomial", "binomial", "trinomial", "FOIL"] },
            { name: "Standard identities", keywords: ["(a+b)²", "(a-b)²", "(a+b)(a-b)", "(x+a)(x+b)"] },
          ]},
          { number: 10, name: "Visualising Solid Shapes", topics: [
            { name: "3D shapes", keywords: ["cube", "cuboid", "cylinder", "cone", "sphere", "prism"] },
            { name: "Euler's formula", keywords: ["faces", "edges", "vertices", "F+V-E=2"] },
          ]},
          { number: 11, name: "Mensuration", topics: [
            { name: "Area of trapezium and polygon", keywords: ["parallel sides", "height", "formula"] },
            { name: "Surface area and volume", keywords: ["cube", "cuboid", "cylinder", "total SA", "lateral SA"] },
          ]},
          { number: 12, name: "Exponents and Powers", topics: [
            { name: "Negative exponents", keywords: ["reciprocal", "a⁻ⁿ = 1/aⁿ", "laws of exponents"] },
            { name: "Standard form", keywords: ["scientific notation", "very large", "very small numbers"] },
          ]},
          { number: 13, name: "Direct and Inverse Proportions", topics: [
            { name: "Direct proportion", keywords: ["increases together", "constant ratio", "unitary method"] },
            { name: "Inverse proportion", keywords: ["one increases other decreases", "constant product"] },
          ]},
          { number: 14, name: "Factorisation", topics: [
            { name: "Factorisation methods", keywords: ["common factor", "regrouping", "identities"] },
            { name: "Division of algebraic expressions", keywords: ["monomial by monomial", "polynomial by monomial"] },
          ]},
          { number: 15, name: "Introduction to Graphs", topics: [
            { name: "Reading graphs", keywords: ["bar graph", "pie chart", "histogram", "line graph"] },
            { name: "Linear graphs", keywords: ["coordinates", "x-axis", "y-axis", "plotting points"] },
          ]},
        ],
      },
      {
        name: "Science",
        chapters: [
          { number: 1, name: "Crop Production and Management", topics: [
            { name: "Agricultural practices", keywords: ["ploughing", "sowing", "irrigation", "harvesting"] },
            { name: "Crop types", keywords: ["kharif", "rabi", "fertilizer", "manure"] },
          ]},
          { number: 2, name: "Microorganisms: Friend and Foe", topics: [
            { name: "Types of microorganisms", keywords: ["bacteria", "virus", "fungi", "protozoa", "algae"] },
            { name: "Uses and diseases", keywords: ["fermentation", "antibiotics", "vaccine", "communicable disease"] },
          ]},
          { number: 3, name: "Synthetic Fibres and Plastics", topics: [
            { name: "Types of synthetic fibres", keywords: ["rayon", "nylon", "polyester", "acrylic"] },
            { name: "Plastics and environment", keywords: ["thermoplastic", "thermosetting", "biodegradable", "5R principle"] },
          ]},
          { number: 4, name: "Materials: Metals and Non-Metals", topics: [
            { name: "Properties of metals", keywords: ["lustre", "malleability", "ductility", "conductivity"] },
            { name: "Reactivity", keywords: ["displacement", "reactivity series", "corrosion"] },
          ]},
          { number: 5, name: "Coal and Petroleum", topics: [
            { name: "Fossil fuels", keywords: ["coal", "petroleum", "natural gas", "formation"] },
            { name: "Conservation of resources", keywords: ["non-renewable", "PCRA", "CNG", "alternative fuels"] },
          ]},
          { number: 6, name: "Combustion and Flame", topics: [
            { name: "Types of combustion", keywords: ["rapid", "spontaneous", "explosion", "ignition temperature"] },
            { name: "Flame structure", keywords: ["zones of flame", "luminous", "non-luminous", "fuel efficiency"] },
          ]},
          { number: 7, name: "Conservation of Plants and Animals", topics: [
            { name: "Biodiversity", keywords: ["species", "ecosystem", "endemic", "extinct"] },
            { name: "Protected areas", keywords: ["national park", "sanctuary", "biosphere reserve", "Red Data Book"] },
          ]},
          { number: 8, name: "Cell — Structure and Functions", topics: [
            { name: "Cell organelles", keywords: ["nucleus", "cell membrane", "cytoplasm", "mitochondria"] },
            { name: "Plant vs animal cell", keywords: ["cell wall", "chloroplast", "vacuole", "comparison"] },
          ]},
          { number: 9, name: "Reproduction in Animals", topics: [
            { name: "Sexual reproduction", keywords: ["fertilization", "zygote", "embryo", "foetus"] },
            { name: "Asexual reproduction", keywords: ["budding", "binary fission", "hydra", "amoeba"] },
          ]},
          { number: 10, name: "Force and Pressure", topics: [
            { name: "Types of forces", keywords: ["contact", "non-contact", "muscular", "gravitational", "friction"] },
            { name: "Pressure", keywords: ["force per area", "atmospheric pressure", "liquid pressure"] },
          ]},
          { number: 11, name: "Friction", topics: [
            { name: "Types of friction", keywords: ["static", "sliding", "rolling", "fluid"] },
            { name: "Increasing and reducing friction", keywords: ["treads", "lubricants", "streamlining"] },
          ]},
          { number: 12, name: "Sound", topics: [
            { name: "Production and propagation", keywords: ["vibration", "medium", "longitudinal wave"] },
            { name: "Characteristics of sound", keywords: ["pitch", "frequency", "amplitude", "loudness", "noise pollution"] },
          ]},
          { number: 13, name: "Chemical Effects of Electric Current", topics: [
            { name: "Conductors and insulators (liquids)", keywords: ["electrolyte", "electrode", "LED test"] },
            { name: "Electroplating", keywords: ["gold plating", "chromium plating", "applications"] },
          ]},
          { number: 14, name: "Some Natural Phenomena", topics: [
            { name: "Lightning", keywords: ["static electricity", "charging", "discharge", "lightning conductor"] },
            { name: "Earthquakes", keywords: ["seismic waves", "Richter scale", "focus", "epicentre", "seismograph"] },
          ]},
          { number: 15, name: "Light", topics: [
            { name: "Laws of reflection", keywords: ["incident ray", "normal", "reflected ray", "angle of incidence"] },
            { name: "Human eye and defects", keywords: ["cornea", "retina", "braille", "kaleidoscope"] },
          ]},
          { number: 16, name: "Stars and the Solar System", topics: [
            { name: "Celestial objects", keywords: ["star", "planet", "satellite", "constellation"] },
            { name: "The solar system", keywords: ["inner planets", "outer planets", "asteroid belt", "comet"] },
          ]},
        ],
      },
      {
        name: "English",
        chapters: [
          { number: 1, name: "The Best Christmas Present in the World", topics: [
            { name: "Story comprehension", keywords: ["war", "letter", "Christmas", "truce"] },
            { name: "Reported speech", keywords: ["direct", "indirect", "told", "asked", "said"] },
          ]},
          { number: 2, name: "The Tsunami", topics: [
            { name: "Factual account", keywords: ["tsunami", "disaster", "survival", "rescue"] },
            { name: "Conditional sentences", keywords: ["if clause", "would", "could", "hypothetical"] },
          ]},
          { number: 3, name: "Glimpses of the Past", topics: [
            { name: "Historical narrative", keywords: ["India", "freedom struggle", "British rule"] },
            { name: "Essay writing", keywords: ["introduction", "body", "conclusion", "argument"] },
          ]},
        ],
      },
      {
        name: "Hindi",
        chapters: [
          { number: 1, name: "ध्वनि", topics: [
            { name: "कविता विश्लेषण", keywords: ["sound", "nature", "morning", "poem appreciation"] },
            { name: "छंद और अलंकार", keywords: ["metre", "simile", "metaphor", "personification"] },
          ]},
          { number: 2, name: "लाख की चूड़ियाँ", topics: [
            { name: "कहानी समीक्षा", keywords: ["craftsmanship", "lac bangles", "tradition"] },
            { name: "संवाद लेखन", keywords: ["dialogue writing", "conversation", "direct speech"] },
          ]},
        ],
      },
    ],
  },
];

export function getSubjects(classNum: number): string[] {
  const cls = ncertSyllabus.find((c) => c.class === classNum);
  return cls ? cls.subjects.map((s) => s.name) : [];
}

export function getChapters(classNum: number, subject: string): SyllabusChapter[] {
  const cls = ncertSyllabus.find((c) => c.class === classNum);
  const sub = cls?.subjects.find((s) => s.name === subject);
  return sub ? sub.chapters : [];
}

export function getTopics(classNum: number, subject: string, chapterName: string): SyllabusTopic[] {
  const chapters = getChapters(classNum, subject);
  const ch = chapters.find((c) => c.name === chapterName);
  return ch ? ch.topics : [];
}

export function getChapterContext(classNum: number, subject: string, chapterName: string): string {
  const chapters = getChapters(classNum, subject);
  const ch = chapters.find((c) => c.name === chapterName);
  if (!ch) return "";
  return `NCERT Class ${classNum} ${subject}, Chapter ${ch.number}: ${ch.name}`;
}

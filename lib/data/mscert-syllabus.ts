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

export const mscertSyllabus: SyllabusClass[] = [
  {
    class: 1,
    subjects: [
      {
        name: "Mathematics",
        chapters: [
          { number: 1, name: "Numbers from 1 to 20", topics: [
            { name: "Counting and writing numbers", keywords: ["count", "write", "one to twenty", "मोजणे"] },
            { name: "Comparing numbers", keywords: ["more", "less", "same", "जास्त", "कमी"] },
          ]},
          { number: 2, name: "Addition (1 to 9)", topics: [
            { name: "Adding small numbers", keywords: ["sum", "plus", "बेरीज", "एकूण"] },
            { name: "Word problems", keywords: ["story sums", "altogether", "total"] },
          ]},
          { number: 3, name: "Subtraction (1 to 9)", topics: [
            { name: "Taking away", keywords: ["minus", "left", "remaining", "वजाबाकी"] },
            { name: "Difference", keywords: ["how many left", "difference", "फरक"] },
          ]},
          { number: 4, name: "Shapes and Patterns", topics: [
            { name: "Basic shapes", keywords: ["circle", "triangle", "square", "वर्तुळ", "त्रिकोण", "चौरस"] },
            { name: "Patterns", keywords: ["repeating", "colour patterns", "नमुने"] },
          ]},
          { number: 5, name: "Numbers from 21 to 50", topics: [
            { name: "Place value introduction", keywords: ["tens", "ones", "दशक", "एकक"] },
            { name: "Number names", keywords: ["number words", "अंकांची नावे"] },
          ]},
        ],
      },
      {
        name: "Marathi",
        chapters: [
          { number: 1, name: "बाराखडी आणि स्वर", topics: [
            { name: "स्वर ओळख", keywords: ["अ", "आ", "इ", "ई", "उ", "ऊ", "vowels", "स्वर"] },
            { name: "व्यंजन ओळख", keywords: ["क", "ख", "ग", "consonants", "व्यंजने"] },
          ]},
          { number: 2, name: "माझे कुटुंब", topics: [
            { name: "कुटुंबातील सदस्य", keywords: ["आई", "बाबा", "आजी", "आजोबा", "family"] },
            { name: "शब्द वाचन", keywords: ["word reading", "picture matching", "शब्द ओळख"] },
          ]},
          { number: 3, name: "प्राणी आणि पक्षी", topics: [
            { name: "प्राण्यांची नावे", keywords: ["कुत्रा", "मांजर", "गाय", "animals", "प्राणी"] },
            { name: "पक्ष्यांची नावे", keywords: ["कावळा", "चिमणी", "पोपट", "birds", "पक्षी"] },
          ]},
        ],
      },
      {
        name: "English",
        chapters: [
          { number: 1, name: "Alphabets and Sounds", topics: [
            { name: "Letter recognition", keywords: ["A to Z", "capital", "small", "phonics"] },
            { name: "Simple words", keywords: ["cat", "bat", "mat", "CVC words"] },
          ]},
          { number: 2, name: "My School", topics: [
            { name: "School vocabulary", keywords: ["teacher", "classroom", "bench", "blackboard"] },
            { name: "Simple sentences", keywords: ["This is", "I am", "sentence formation"] },
          ]},
        ],
      },
      {
        name: "EVS / परिसर अभ्यास",
        chapters: [
          { number: 1, name: "माझे कुटुंब", topics: [
            { name: "Family members", keywords: ["mother", "father", "siblings", "आई", "बाबा"] },
            { name: "Helping at home", keywords: ["caring", "sharing", "मदत करणे"] },
          ]},
          { number: 2, name: "माझे शरीर", topics: [
            { name: "Body parts", keywords: ["head", "hands", "legs", "डोके", "हात", "पाय"] },
            { name: "Cleanliness", keywords: ["hygiene", "bathing", "स्वच्छता"] },
          ]},
          { number: 3, name: "आपले अन्न", topics: [
            { name: "Types of food", keywords: ["fruits", "vegetables", "फळे", "भाज्या"] },
            { name: "Healthy eating", keywords: ["balanced diet", "nutrition", "आरोग्य"] },
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
          { number: 1, name: "Numbers up to 100", topics: [
            { name: "Counting and place value", keywords: ["tens", "ones", "place value", "दशक", "एकक"] },
            { name: "Skip counting", keywords: ["twos", "fives", "tens", "गणना"] },
          ]},
          { number: 2, name: "Addition (Two digits)", topics: [
            { name: "Adding without carry", keywords: ["sum", "addition", "बेरीज"] },
            { name: "Adding with carry", keywords: ["carry over", "regrouping", "हातचा"] },
          ]},
          { number: 3, name: "Subtraction (Two digits)", topics: [
            { name: "Subtraction without borrow", keywords: ["minus", "subtract", "वजाबाकी"] },
            { name: "Subtraction with borrow", keywords: ["borrowing", "regrouping"] },
          ]},
          { number: 4, name: "Measurement", topics: [
            { name: "Length", keywords: ["long", "short", "ruler", "लांबी"] },
            { name: "Weight", keywords: ["heavy", "light", "balance", "वजन"] },
          ]},
          { number: 5, name: "Time and Calendar", topics: [
            { name: "Reading clock", keywords: ["hours", "o'clock", "घड्याळ", "वेळ"] },
            { name: "Days and months", keywords: ["Monday", "January", "दिवस", "महिने"] },
          ]},
        ],
      },
      {
        name: "Marathi",
        chapters: [
          { number: 1, name: "मात्रा आणि जोडशब्द", topics: [
            { name: "मात्रा ओळख", keywords: ["आ-कार", "इ-कार", "उ-कार", "matras"] },
            { name: "जोडशब्द", keywords: ["compound words", "जोडाक्षरे"] },
          ]},
          { number: 2, name: "छोट्या गोष्टी", topics: [
            { name: "कथा वाचन", keywords: ["story reading", "गोष्ट", "कथा"] },
            { name: "प्रश्नोत्तरे", keywords: ["question-answer", "comprehension"] },
          ]},
          { number: 3, name: "कविता", topics: [
            { name: "कविता वाचन", keywords: ["poem", "rhythm", "कविता", "गाणे"] },
            { name: "कवितेचा अर्थ", keywords: ["meaning", "appreciation", "अर्थ"] },
          ]},
        ],
      },
      {
        name: "English",
        chapters: [
          { number: 1, name: "My Friends", topics: [
            { name: "Reading comprehension", keywords: ["friends", "play", "sharing"] },
            { name: "Sentence formation", keywords: ["subject", "verb", "sentence"] },
          ]},
          { number: 2, name: "Animals We Know", topics: [
            { name: "Animal vocabulary", keywords: ["pet", "wild", "farm animals"] },
            { name: "Singular and plural", keywords: ["one-many", "s-es"] },
          ]},
        ],
      },
      {
        name: "EVS / परिसर अभ्यास",
        chapters: [
          { number: 1, name: "आपले घर", topics: [
            { name: "Types of houses", keywords: ["कच्चे", "पक्के", "झोपडी", "इमारत"] },
            { name: "Things at home", keywords: ["furniture", "utensils", "भांडी"] },
          ]},
          { number: 2, name: "आपल्या सभोवतालची झाडे", topics: [
            { name: "Parts of a plant", keywords: ["root", "stem", "leaf", "मूळ", "खोड", "पान"] },
            { name: "Uses of plants", keywords: ["food", "medicine", "oxygen", "अन्न", "औषध"] },
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
          { number: 1, name: "Numbers up to 1000", topics: [
            { name: "Place value", keywords: ["hundreds", "tens", "ones", "शतक", "दशक"] },
            { name: "Number patterns", keywords: ["odd", "even", "ascending", "descending"] },
          ]},
          { number: 2, name: "Addition and Subtraction (3 digits)", topics: [
            { name: "Addition with carry", keywords: ["regrouping", "3-digit addition", "तीन अंकी बेरीज"] },
            { name: "Subtraction with borrow", keywords: ["regrouping", "3-digit subtraction"] },
          ]},
          { number: 3, name: "Multiplication", topics: [
            { name: "Multiplication tables (2-5)", keywords: ["tables", "product", "गुणाकार"] },
            { name: "Word problems", keywords: ["times", "groups of", "गट"] },
          ]},
          { number: 4, name: "Shapes and Measurement", topics: [
            { name: "2D Shapes", keywords: ["triangle", "circle", "rectangle", "आकार"] },
            { name: "Measurement of length", keywords: ["metre", "centimetre", "ruler", "मीटर"] },
          ]},
          { number: 5, name: "Division", topics: [
            { name: "Sharing equally", keywords: ["divide", "quotient", "remainder", "भागाकार"] },
            { name: "Division facts", keywords: ["inverse of multiplication", "sharing"] },
          ]},
        ],
      },
      {
        name: "Marathi",
        chapters: [
          { number: 1, name: "गोष्टी आणि कथा", topics: [
            { name: "गद्यांश आकलन", keywords: ["comprehension", "prose", "गद्य", "आकलन"] },
            { name: "नामे आणि सर्वनामे", keywords: ["nouns", "pronouns", "नाम", "सर्वनाम"] },
          ]},
          { number: 2, name: "बालकविता", topics: [
            { name: "कविता रसग्रहण", keywords: ["poem appreciation", "rhyme", "लय"] },
            { name: "विशेषणे", keywords: ["adjectives", "describing words", "विशेषण"] },
          ]},
          { number: 3, name: "पत्रलेखन", topics: [
            { name: "अनौपचारिक पत्र", keywords: ["informal letter", "friend", "family", "पत्र"] },
            { name: "शब्दसंपत्ती", keywords: ["vocabulary", "new words", "शब्दसंग्रह"] },
          ]},
        ],
      },
      {
        name: "English",
        chapters: [
          { number: 1, name: "Good Habits", topics: [
            { name: "Reading comprehension", keywords: ["habits", "morning routine", "hygiene"] },
            { name: "Adjectives", keywords: ["describing words", "colour", "size", "shape"] },
          ]},
          { number: 2, name: "The Clever Fox", topics: [
            { name: "Story comprehension", keywords: ["fox", "clever", "moral"] },
            { name: "Tenses introduction", keywords: ["past", "present", "future"] },
          ]},
        ],
      },
      {
        name: "EVS / परिसर अभ्यास",
        chapters: [
          { number: 1, name: "सजीव आणि निर्जीव", topics: [
            { name: "Living and non-living", keywords: ["living", "non-living", "सजीव", "निर्जीव"] },
            { name: "Characteristics of living things", keywords: ["growth", "respiration", "movement"] },
          ]},
          { number: 2, name: "पाणी", topics: [
            { name: "Sources of water", keywords: ["river", "well", "rain", "नदी", "विहीर", "पाऊस"] },
            { name: "Saving water", keywords: ["conservation", "पाणी बचत"] },
          ]},
          { number: 3, name: "हवा", topics: [
            { name: "Importance of air", keywords: ["breathing", "wind", "हवा", "वारा"] },
            { name: "Air pollution", keywords: ["pollution", "smoke", "clean air", "प्रदूषण"] },
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
          { number: 1, name: "Numbers up to 10,000", topics: [
            { name: "Place value and expanded form", keywords: ["thousands", "हजार", "विस्तारित रूप"] },
            { name: "Rounding and estimation", keywords: ["nearest ten", "nearest hundred", "अंदाज"] },
          ]},
          { number: 2, name: "Multiplication and Division", topics: [
            { name: "Tables 6-10", keywords: ["multiplication tables", "product", "पाढे"] },
            { name: "Division with remainder", keywords: ["quotient", "remainder", "भागाकार"] },
          ]},
          { number: 3, name: "Fractions", topics: [
            { name: "Introduction to fractions", keywords: ["half", "quarter", "अपूर्णांक", "अर्धा"] },
            { name: "Like fractions", keywords: ["same denominator", "comparison", "तुलना"] },
          ]},
          { number: 4, name: "Time and Money", topics: [
            { name: "Clock reading", keywords: ["hours", "minutes", "AM", "PM", "वेळ"] },
            { name: "Money operations", keywords: ["rupees", "paise", "रुपये", "पैसे", "bill"] },
          ]},
          { number: 5, name: "Geometry", topics: [
            { name: "Lines and angles", keywords: ["straight line", "right angle", "रेषा", "कोन"] },
            { name: "Perimeter", keywords: ["boundary", "perimeter of rectangle", "परिमिती"] },
          ]},
        ],
      },
      {
        name: "Marathi",
        chapters: [
          { number: 1, name: "गद्य पाठ", topics: [
            { name: "कथा आकलन", keywords: ["story comprehension", "characters", "moral", "बोधकथा"] },
            { name: "क्रियापदे", keywords: ["verbs", "action words", "क्रियापद"] },
          ]},
          { number: 2, name: "कविता", topics: [
            { name: "कविता रसग्रहण", keywords: ["poetry", "rhythm", "meaning", "काव्यरसग्रहण"] },
            { name: "अलंकार ओळख", keywords: ["figures of speech", "उपमा", "रूपक"] },
          ]},
          { number: 3, name: "निबंध लेखन", topics: [
            { name: "माझा आवडता सण", keywords: ["festival", "essay", "दिवाळी", "गणेशोत्सव"] },
            { name: "निबंध रचना", keywords: ["essay structure", "introduction", "conclusion"] },
          ]},
        ],
      },
      {
        name: "English",
        chapters: [
          { number: 1, name: "The Honest Woodcutter", topics: [
            { name: "Story comprehension", keywords: ["honesty", "moral story", "woodcutter"] },
            { name: "Parts of speech", keywords: ["noun", "verb", "adjective", "adverb"] },
          ]},
          { number: 2, name: "Our Environment", topics: [
            { name: "Paragraph reading", keywords: ["environment", "trees", "pollution"] },
            { name: "Letter writing", keywords: ["informal letter", "greeting", "closing"] },
          ]},
        ],
      },
      {
        name: "EVS / परिसर अभ्यास",
        chapters: [
          { number: 1, name: "अन्न आणि पोषण", topics: [
            { name: "Food groups", keywords: ["carbohydrates", "proteins", "vitamins", "पोषक तत्त्वे"] },
            { name: "Balanced diet", keywords: ["balanced diet", "junk food", "संतुलित आहार"] },
          ]},
          { number: 2, name: "प्राणी जगत", topics: [
            { name: "Animal classification", keywords: ["domestic", "wild", "पाळीव", "जंगली"] },
            { name: "Animal habitats", keywords: ["nest", "den", "burrow", "निवासस्थान"] },
          ]},
          { number: 3, name: "आपला महाराष्ट्र", topics: [
            { name: "Districts and cities", keywords: ["Mumbai", "Pune", "Nagpur", "जिल्हे", "शहरे"] },
            { name: "Culture of Maharashtra", keywords: ["festivals", "food", "संस्कृती", "सण"] },
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
          { number: 1, name: "Large Numbers", topics: [
            { name: "Numbers up to lakh", keywords: ["lakhs", "place value", "Indian system", "लाख"] },
            { name: "Roman numerals", keywords: ["I", "V", "X", "L", "C", "D", "M"] },
          ]},
          { number: 2, name: "Fractions and Decimals", topics: [
            { name: "Types of fractions", keywords: ["proper", "improper", "mixed", "अपूर्णांक"] },
            { name: "Decimal introduction", keywords: ["tenths", "hundredths", "दशांश"] },
          ]},
          { number: 3, name: "Area and Perimeter", topics: [
            { name: "Area of rectangle and square", keywords: ["length × breadth", "side²", "क्षेत्रफळ"] },
            { name: "Perimeter", keywords: ["boundary", "sum of sides", "परिमिती"] },
          ]},
          { number: 4, name: "Factors and Multiples", topics: [
            { name: "Factors", keywords: ["divisibility", "factors", "prime", "अवयव"] },
            { name: "Multiples and LCM", keywords: ["multiples", "common multiples", "LCM", "पट"] },
          ]},
          { number: 5, name: "Geometry", topics: [
            { name: "Types of angles", keywords: ["acute", "obtuse", "right", "straight", "कोन"] },
            { name: "Symmetry", keywords: ["line symmetry", "mirror image", "सममिती"] },
          ]},
          { number: 6, name: "Data Handling", topics: [
            { name: "Pictograph and bar graph", keywords: ["data", "tally marks", "bar chart", "आलेख"] },
            { name: "Average", keywords: ["mean", "average", "सरासरी"] },
          ]},
        ],
      },
      {
        name: "Marathi",
        chapters: [
          { number: 1, name: "गद्य पाठ", topics: [
            { name: "बोधकथा", keywords: ["moral story", "Panchatantra", "बोध", "शिकवण"] },
            { name: "म्हणी व वाक्प्रचार", keywords: ["proverbs", "idioms", "म्हणी", "वाक्प्रचार"] },
          ]},
          { number: 2, name: "व्याकरण", topics: [
            { name: "विभक्ती", keywords: ["case endings", "vibhakti", "प्रथमा", "द्वितीया"] },
            { name: "वचन बदला", keywords: ["singular", "plural", "एकवचन", "अनेकवचन"] },
          ]},
          { number: 3, name: "कविता", topics: [
            { name: "कविता आकलन", keywords: ["poem comprehension", "rhyme", "theme"] },
            { name: "स्वरचित कविता", keywords: ["creative writing", "poem writing", "स्वरचना"] },
          ]},
        ],
      },
      {
        name: "English",
        chapters: [
          { number: 1, name: "A Great Invention", topics: [
            { name: "Reading comprehension", keywords: ["invention", "science", "discovery"] },
            { name: "Paragraph writing", keywords: ["topic sentence", "supporting details"] },
          ]},
          { number: 2, name: "The Brave Girl", topics: [
            { name: "Story analysis", keywords: ["courage", "bravery", "moral"] },
            { name: "Dialogue writing", keywords: ["speech marks", "conversation"] },
          ]},
        ],
      },
      {
        name: "EVS / परिसर अभ्यास",
        chapters: [
          { number: 1, name: "आपल्या शरीराची काळजी", topics: [
            { name: "Digestive system", keywords: ["mouth", "stomach", "digestion", "पचनसंस्था"] },
            { name: "Nutrition", keywords: ["vitamins", "minerals", "proteins", "जीवनसत्त्वे"] },
          ]},
          { number: 2, name: "पाणी आणि हवा", topics: [
            { name: "Water cycle", keywords: ["evaporation", "condensation", "rain", "जलचक्र"] },
            { name: "Air composition", keywords: ["oxygen", "nitrogen", "carbon dioxide"] },
          ]},
          { number: 3, name: "आपला परिसर", topics: [
            { name: "Natural resources", keywords: ["soil", "water", "forest", "माती", "जंगल"] },
            { name: "Conservation", keywords: ["save", "protect", "recycle", "संवर्धन"] },
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
            { name: "Indian and International systems", keywords: ["lakh", "crore", "million", "billion", "लाख", "कोटी"] },
            { name: "Estimation", keywords: ["round off", "approximate", "अंदाज"] },
          ]},
          { number: 2, name: "Whole Numbers", topics: [
            { name: "Properties", keywords: ["closure", "commutative", "associative", "distributive"] },
            { name: "Number line", keywords: ["successor", "predecessor", "संख्यारेषा"] },
          ]},
          { number: 3, name: "Playing with Numbers", topics: [
            { name: "Divisibility rules", keywords: ["divisible by 2,3,5,9,10", "भाज्यता"] },
            { name: "HCF and LCM", keywords: ["prime factorization", "म.सा.वि.", "ल.सा.वि."] },
          ]},
          { number: 4, name: "Basic Geometrical Ideas", topics: [
            { name: "Points, lines, segments", keywords: ["point", "line", "ray", "बिंदू", "रेषा", "किरण"] },
            { name: "Angles and polygons", keywords: ["angle", "polygon", "triangle", "कोन", "बहुभुज"] },
          ]},
          { number: 5, name: "Integers", topics: [
            { name: "Negative numbers", keywords: ["negative", "positive", "zero", "ऋण संख्या"] },
            { name: "Operations on integers", keywords: ["addition", "subtraction", "number line"] },
          ]},
          { number: 6, name: "Fractions", topics: [
            { name: "Types of fractions", keywords: ["proper", "improper", "mixed", "equivalent"] },
            { name: "Operations", keywords: ["addition", "subtraction", "comparison"] },
          ]},
          { number: 7, name: "Decimals", topics: [
            { name: "Decimal operations", keywords: ["tenths", "hundredths", "addition", "subtraction"] },
            { name: "Conversion", keywords: ["fraction to decimal", "decimal to fraction"] },
          ]},
          { number: 8, name: "Data Handling", topics: [
            { name: "Bar graph", keywords: ["data", "tally", "bar chart", "pictograph"] },
            { name: "Mean", keywords: ["average", "central tendency", "सरासरी"] },
          ]},
          { number: 9, name: "Algebra", topics: [
            { name: "Variables and expressions", keywords: ["variable", "constant", "expression", "चल", "अचल"] },
            { name: "Simple equations", keywords: ["solving", "LHS=RHS", "समीकरण"] },
          ]},
          { number: 10, name: "Mensuration", topics: [
            { name: "Perimeter", keywords: ["rectangle", "square", "triangle", "परिमिती"] },
            { name: "Area", keywords: ["rectangle area", "square area", "क्षेत्रफळ"] },
          ]},
          { number: 11, name: "Ratio and Proportion", topics: [
            { name: "Ratio", keywords: ["comparison", "simplest form", "गुणोत्तर"] },
            { name: "Proportion", keywords: ["unitary method", "direct proportion", "प्रमाण"] },
          ]},
        ],
      },
      {
        name: "Science",
        chapters: [
          { number: 1, name: "Food: Where Does It Come From?", topics: [
            { name: "Sources of food", keywords: ["plants", "animals", "ingredients", "herbivore"] },
            { name: "Food variety", keywords: ["spices", "cooking", "raw materials"] },
          ]},
          { number: 2, name: "Components of Food", topics: [
            { name: "Nutrients", keywords: ["carbohydrates", "proteins", "fats", "vitamins", "minerals"] },
            { name: "Deficiency diseases", keywords: ["scurvy", "rickets", "goitre", "balanced diet"] },
          ]},
          { number: 3, name: "Fibre to Fabric", topics: [
            { name: "Natural fibres", keywords: ["cotton", "jute", "wool", "silk", "कापूस"] },
            { name: "Processing", keywords: ["spinning", "weaving", "ginning", "विणकाम"] },
          ]},
          { number: 4, name: "Sorting Materials", topics: [
            { name: "Properties", keywords: ["transparent", "opaque", "soluble", "insoluble"] },
            { name: "Classification", keywords: ["metal", "non-metal", "hard", "soft"] },
          ]},
          { number: 5, name: "Separation of Substances", topics: [
            { name: "Methods", keywords: ["filtration", "evaporation", "sieving", "decantation"] },
            { name: "Mixtures", keywords: ["dissolving", "saturated solution", "मिश्रण"] },
          ]},
          { number: 6, name: "Changes Around Us", topics: [
            { name: "Reversible and irreversible", keywords: ["melting", "freezing", "burning"] },
            { name: "Physical and chemical changes", keywords: ["rusting", "curdling", "expansion"] },
          ]},
          { number: 7, name: "Getting to Know Plants", topics: [
            { name: "Parts of a plant", keywords: ["root", "stem", "leaf", "flower", "fruit"] },
            { name: "Types of plants", keywords: ["herb", "shrub", "tree", "creeper"] },
          ]},
          { number: 8, name: "The Living Organisms", topics: [
            { name: "Habitat and adaptation", keywords: ["desert", "aquatic", "terrestrial"] },
            { name: "Living vs non-living", keywords: ["respiration", "growth", "reproduction"] },
          ]},
        ],
      },
      {
        name: "Marathi",
        chapters: [
          { number: 1, name: "गद्य पाठ", topics: [
            { name: "कथा आकलन", keywords: ["story comprehension", "characters", "गद्य"] },
            { name: "शब्दसिद्धी", keywords: ["word formation", "prefix", "suffix", "उपसर्ग", "प्रत्यय"] },
          ]},
          { number: 2, name: "व्याकरण", topics: [
            { name: "नाम आणि प्रकार", keywords: ["noun types", "सामान्य", "विशेष", "भाववाचक"] },
            { name: "काळ", keywords: ["tenses", "वर्तमानकाळ", "भूतकाळ", "भविष्यकाळ"] },
          ]},
        ],
      },
      {
        name: "English",
        chapters: [
          { number: 1, name: "Who Did Patrick's Homework?", topics: [
            { name: "Story comprehension", keywords: ["elf", "homework", "learning"] },
            { name: "Past tense", keywords: ["regular", "irregular", "-ed"] },
          ]},
          { number: 2, name: "A House, A Home", topics: [
            { name: "Poem comprehension", keywords: ["house", "home", "family", "love"] },
            { name: "Vocabulary building", keywords: ["synonyms", "antonyms", "context clues"] },
          ]},
        ],
      },
      {
        name: "Hindi",
        chapters: [
          { number: 1, name: "वह चिड़िया जो", topics: [
            { name: "कविता विश्लेषण", keywords: ["bird", "freedom", "poetry appreciation"] },
            { name: "अलंकार", keywords: ["figures of speech", "simile", "उपमा"] },
          ]},
          { number: 2, name: "बचपन", topics: [
            { name: "गद्यांश", keywords: ["autobiography", "childhood", "memories"] },
            { name: "काल", keywords: ["tenses", "past", "present", "future"] },
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
            { name: "Properties", keywords: ["closure", "commutative", "associative", "identity", "पूर्णांक"] },
            { name: "Multiplication and division", keywords: ["sign rules", "product", "quotient"] },
          ]},
          { number: 2, name: "Fractions and Decimals", topics: [
            { name: "Operations on fractions", keywords: ["multiplication", "division", "reciprocal"] },
            { name: "Decimal operations", keywords: ["multiply", "divide", "decimal places"] },
          ]},
          { number: 3, name: "Data Handling", topics: [
            { name: "Mean, median, mode", keywords: ["average", "middle value", "most frequent"] },
            { name: "Bar graphs", keywords: ["double bar", "comparison", "representation"] },
          ]},
          { number: 4, name: "Simple Equations", topics: [
            { name: "Forming equations", keywords: ["variable", "expression", "equation"] },
            { name: "Solving", keywords: ["transposing", "balancing", "LHS=RHS"] },
          ]},
          { number: 5, name: "Lines and Angles", topics: [
            { name: "Pairs of angles", keywords: ["complementary", "supplementary", "adjacent", "vertically opposite"] },
            { name: "Parallel lines", keywords: ["transversal", "corresponding", "alternate"] },
          ]},
          { number: 6, name: "Triangles", topics: [
            { name: "Angle sum property", keywords: ["180 degrees", "exterior angle", "interior angle"] },
            { name: "Pythagoras theorem", keywords: ["right triangle", "hypotenuse", "पायथागोरस"] },
          ]},
          { number: 7, name: "Comparing Quantities", topics: [
            { name: "Percentage", keywords: ["percent", "fraction to percent", "increase", "decrease"] },
            { name: "Profit, loss, SI", keywords: ["cost price", "selling price", "interest", "नफा", "तोटा"] },
          ]},
          { number: 8, name: "Perimeter and Area", topics: [
            { name: "Parallelogram and triangle", keywords: ["base", "height", "formula"] },
            { name: "Circle", keywords: ["circumference", "area", "pi", "radius", "वर्तुळ"] },
          ]},
          { number: 9, name: "Algebraic Expressions", topics: [
            { name: "Terms and coefficients", keywords: ["like terms", "unlike terms", "coefficient"] },
            { name: "Operations", keywords: ["addition", "subtraction", "simplifying"] },
          ]},
          { number: 10, name: "Exponents and Powers", topics: [
            { name: "Laws of exponents", keywords: ["base", "power", "product rule", "quotient rule"] },
            { name: "Standard form", keywords: ["scientific notation", "large numbers"] },
          ]},
        ],
      },
      {
        name: "Science",
        chapters: [
          { number: 1, name: "Nutrition in Plants", topics: [
            { name: "Photosynthesis", keywords: ["chlorophyll", "sunlight", "carbon dioxide", "glucose"] },
            { name: "Other modes", keywords: ["parasitic", "insectivorous", "saprophytic"] },
          ]},
          { number: 2, name: "Nutrition in Animals", topics: [
            { name: "Human digestive system", keywords: ["mouth", "stomach", "intestine", "enzymes"] },
            { name: "Digestion in ruminants", keywords: ["cud chewing", "cellulose"] },
          ]},
          { number: 3, name: "Heat", topics: [
            { name: "Temperature", keywords: ["Celsius", "thermometer", "mercury"] },
            { name: "Transfer of heat", keywords: ["conduction", "convection", "radiation"] },
          ]},
          { number: 4, name: "Acids, Bases and Salts", topics: [
            { name: "Indicators", keywords: ["litmus", "turmeric", "acid", "base"] },
            { name: "Neutralization", keywords: ["acid + base", "salt + water", "उदासिनीकरण"] },
          ]},
          { number: 5, name: "Respiration in Organisms", topics: [
            { name: "Aerobic and anaerobic", keywords: ["oxygen", "glucose", "energy", "fermentation"] },
            { name: "Breathing mechanism", keywords: ["lungs", "diaphragm", "inhalation"] },
          ]},
          { number: 6, name: "Motion and Time", topics: [
            { name: "Speed", keywords: ["distance", "time", "speed=distance/time"] },
            { name: "Graphs", keywords: ["distance-time graph", "uniform motion"] },
          ]},
        ],
      },
      {
        name: "Marathi",
        chapters: [
          { number: 1, name: "गद्य पाठ", topics: [
            { name: "कथा विश्लेषण", keywords: ["story analysis", "characters", "setting", "theme"] },
            { name: "समास", keywords: ["compound words", "समास प्रकार", "dvandva", "tatpurusha"] },
          ]},
          { number: 2, name: "कविता", topics: [
            { name: "काव्यरसग्रहण", keywords: ["poetry", "emotion", "imagery", "रस"] },
            { name: "वृत्त आणि छंद", keywords: ["metre", "rhythm", "ओवी", "अभंग"] },
          ]},
        ],
      },
      {
        name: "English",
        chapters: [
          { number: 1, name: "Three Questions", topics: [
            { name: "Story by Tolstoy", keywords: ["king", "wise", "hermit", "moral"] },
            { name: "Active and passive voice", keywords: ["agent", "action", "receiver"] },
          ]},
          { number: 2, name: "A Gift of Chappals", topics: [
            { name: "Story analysis", keywords: ["generosity", "music", "kindness"] },
            { name: "Conjunctions", keywords: ["and", "but", "or", "because", "although"] },
          ]},
        ],
      },
      {
        name: "Hindi",
        chapters: [
          { number: 1, name: "हम पंछी उन्मुक्त गगन के", topics: [
            { name: "कविता विश्लेषण", keywords: ["freedom", "bird", "cage", "sky"] },
            { name: "समास", keywords: ["compound words", "dvandva"] },
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
            { name: "Properties", keywords: ["closure", "commutative", "associative", "distributive"] },
            { name: "Number line", keywords: ["between two rationals", "परिमेय संख्या"] },
          ]},
          { number: 2, name: "Linear Equations", topics: [
            { name: "Solving", keywords: ["transposing", "variable both sides", "cross multiplication"] },
            { name: "Word problems", keywords: ["age problems", "number problems", "रेषीय समीकरणे"] },
          ]},
          { number: 3, name: "Quadrilaterals", topics: [
            { name: "Types", keywords: ["parallelogram", "rectangle", "rhombus", "trapezium"] },
            { name: "Properties", keywords: ["angle sum", "diagonals", "चतुर्भुज"] },
          ]},
          { number: 4, name: "Data Handling", topics: [
            { name: "Pie charts", keywords: ["circle graph", "sector", "percentage"] },
            { name: "Probability", keywords: ["outcome", "event", "equally likely", "संभाव्यता"] },
          ]},
          { number: 5, name: "Squares and Square Roots", topics: [
            { name: "Perfect squares", keywords: ["properties", "patterns", "वर्ग"] },
            { name: "Finding square roots", keywords: ["prime factorization", "long division", "वर्गमूळ"] },
          ]},
          { number: 6, name: "Cubes and Cube Roots", topics: [
            { name: "Perfect cubes", keywords: ["cube of a number", "patterns", "घन"] },
            { name: "Cube roots", keywords: ["prime factorization", "estimation", "घनमूळ"] },
          ]},
          { number: 7, name: "Comparing Quantities", topics: [
            { name: "Discount and tax", keywords: ["marked price", "GST", "सवलत"] },
            { name: "Compound interest", keywords: ["CI formula", "annually", "चक्रवाढ व्याज"] },
          ]},
          { number: 8, name: "Algebraic Expressions", topics: [
            { name: "Multiplication", keywords: ["monomial", "binomial", "polynomial", "बीजगणित"] },
            { name: "Standard identities", keywords: ["(a+b)²", "(a-b)²", "(a+b)(a-b)"] },
          ]},
          { number: 9, name: "Mensuration", topics: [
            { name: "Area of trapezium", keywords: ["parallel sides", "height", "formula"] },
            { name: "Surface area and volume", keywords: ["cube", "cuboid", "cylinder", "पृष्ठफळ", "घनफळ"] },
          ]},
          { number: 10, name: "Factorisation", topics: [
            { name: "Methods", keywords: ["common factor", "regrouping", "identities", "अवयवीकरण"] },
            { name: "Division of expressions", keywords: ["polynomial", "monomial"] },
          ]},
        ],
      },
      {
        name: "Science",
        chapters: [
          { number: 1, name: "Crop Production", topics: [
            { name: "Agricultural practices", keywords: ["ploughing", "sowing", "irrigation", "harvesting"] },
            { name: "Crop types", keywords: ["kharif", "rabi", "खरीप", "रब्बी"] },
          ]},
          { number: 2, name: "Microorganisms", topics: [
            { name: "Types", keywords: ["bacteria", "virus", "fungi", "protozoa", "सूक्ष्मजीव"] },
            { name: "Uses and diseases", keywords: ["fermentation", "antibiotics", "vaccine"] },
          ]},
          { number: 3, name: "Metals and Non-Metals", topics: [
            { name: "Properties of metals", keywords: ["lustre", "malleability", "ductility", "धातू"] },
            { name: "Reactivity", keywords: ["displacement", "reactivity series", "अधातू"] },
          ]},
          { number: 4, name: "Cell Structure", topics: [
            { name: "Cell organelles", keywords: ["nucleus", "cell membrane", "cytoplasm", "पेशी"] },
            { name: "Plant vs animal cell", keywords: ["cell wall", "chloroplast", "vacuole"] },
          ]},
          { number: 5, name: "Force and Pressure", topics: [
            { name: "Types of forces", keywords: ["contact", "non-contact", "friction", "gravity", "बल"] },
            { name: "Pressure", keywords: ["force per area", "atmospheric pressure", "दाब"] },
          ]},
          { number: 6, name: "Sound", topics: [
            { name: "Production", keywords: ["vibration", "medium", "longitudinal wave", "ध्वनी"] },
            { name: "Characteristics", keywords: ["pitch", "frequency", "amplitude", "loudness"] },
          ]},
          { number: 7, name: "Light", topics: [
            { name: "Reflection", keywords: ["incident ray", "normal", "reflected ray", "प्रकाश"] },
            { name: "Human eye", keywords: ["cornea", "retina", "lens", "डोळा"] },
          ]},
        ],
      },
      {
        name: "Marathi",
        chapters: [
          { number: 1, name: "गद्य पाठ", topics: [
            { name: "कथा समीक्षा", keywords: ["story review", "analysis", "critique", "समीक्षा"] },
            { name: "संवाद लेखन", keywords: ["dialogue writing", "conversation", "संवाद"] },
          ]},
          { number: 2, name: "व्याकरण", topics: [
            { name: "वाक्यप्रकार", keywords: ["sentence types", "विधानार्थी", "प्रश्नार्थी", "उद्गारार्थी"] },
            { name: "शब्दसिद्धी", keywords: ["word formation", "उपसर्ग", "प्रत्यय", "सामासिक शब्द"] },
          ]},
        ],
      },
      {
        name: "English",
        chapters: [
          { number: 1, name: "The Best Christmas Present", topics: [
            { name: "Story comprehension", keywords: ["war", "letter", "Christmas", "truce"] },
            { name: "Reported speech", keywords: ["direct", "indirect", "told", "said"] },
          ]},
          { number: 2, name: "The Tsunami", topics: [
            { name: "Factual account", keywords: ["tsunami", "disaster", "survival"] },
            { name: "Conditional sentences", keywords: ["if clause", "would", "hypothetical"] },
          ]},
        ],
      },
      {
        name: "Hindi",
        chapters: [
          { number: 1, name: "ध्वनि", topics: [
            { name: "कविता", keywords: ["sound", "nature", "morning"] },
            { name: "छंद और अलंकार", keywords: ["metre", "simile", "metaphor"] },
          ]},
        ],
      },
    ],
  },
  {
    class: 9,
    subjects: [
      {
        name: "Mathematics",
        chapters: [
          { number: 1, name: "Number Systems", topics: [
            { name: "Real numbers", keywords: ["rational", "irrational", "real", "वास्तव संख्या"] },
            { name: "Laws of exponents", keywords: ["fractional exponents", "rationalization"] },
          ]},
          { number: 2, name: "Polynomials", topics: [
            { name: "Types of polynomials", keywords: ["linear", "quadratic", "cubic", "बहुपद"] },
            { name: "Factor theorem", keywords: ["remainder theorem", "factorization"] },
          ]},
          { number: 3, name: "Coordinate Geometry", topics: [
            { name: "Cartesian plane", keywords: ["x-axis", "y-axis", "origin", "quadrant", "निर्देशक भूमिती"] },
            { name: "Plotting points", keywords: ["ordered pair", "coordinates"] },
          ]},
          { number: 4, name: "Linear Equations in Two Variables", topics: [
            { name: "Solutions", keywords: ["graph", "pair of equations", "दोन चलांतील रेषीय समीकरणे"] },
            { name: "Graph of linear equation", keywords: ["straight line", "slope", "intercept"] },
          ]},
          { number: 5, name: "Triangles", topics: [
            { name: "Congruence", keywords: ["SSS", "SAS", "ASA", "RHS", "एकरूपता"] },
            { name: "Properties", keywords: ["isosceles", "equilateral", "angle bisector"] },
          ]},
          { number: 6, name: "Statistics", topics: [
            { name: "Collection and presentation", keywords: ["frequency", "histogram", "polygon", "सांख्यिकी"] },
            { name: "Mean, median, mode", keywords: ["central tendency", "grouped data"] },
          ]},
        ],
      },
      {
        name: "Science",
        chapters: [
          { number: 1, name: "Matter in Our Surroundings", topics: [
            { name: "States of matter", keywords: ["solid", "liquid", "gas", "plasma", "पदार्थ"] },
            { name: "Changes of state", keywords: ["melting", "boiling", "evaporation", "sublimation"] },
          ]},
          { number: 2, name: "Is Matter Around Us Pure?", topics: [
            { name: "Mixtures and solutions", keywords: ["homogeneous", "heterogeneous", "colloid", "suspension"] },
            { name: "Separation techniques", keywords: ["chromatography", "distillation", "crystallization"] },
          ]},
          { number: 3, name: "Atoms and Molecules", topics: [
            { name: "Atomic theory", keywords: ["atom", "molecule", "अणू", "रेणू"] },
            { name: "Chemical formula", keywords: ["valency", "molecular mass", "formula unit"] },
          ]},
          { number: 4, name: "Motion", topics: [
            { name: "Distance and displacement", keywords: ["speed", "velocity", "acceleration", "गती"] },
            { name: "Equations of motion", keywords: ["v=u+at", "s=ut+½at²", "v²=u²+2as"] },
          ]},
          { number: 5, name: "Force and Laws of Motion", topics: [
            { name: "Newton's laws", keywords: ["inertia", "F=ma", "action-reaction", "न्यूटनचे नियम"] },
            { name: "Momentum", keywords: ["p=mv", "conservation", "संवेग"] },
          ]},
          { number: 6, name: "The Fundamental Unit of Life", topics: [
            { name: "Cell structure", keywords: ["nucleus", "organelles", "membrane", "पेशी"] },
            { name: "Cell division", keywords: ["mitosis", "meiosis"] },
          ]},
        ],
      },
      {
        name: "Marathi",
        chapters: [
          { number: 1, name: "गद्य", topics: [
            { name: "कादंबरी अंश", keywords: ["novel excerpt", "character study", "कादंबरी"] },
            { name: "वृत्तपत्रीय लेखन", keywords: ["journalism", "news writing", "बातमी लेखन"] },
          ]},
          { number: 2, name: "काव्य", topics: [
            { name: "आधुनिक कविता", keywords: ["modern poetry", "free verse", "आधुनिक काव्य"] },
            { name: "अलंकार", keywords: ["उपमा", "रूपक", "अनुप्रास", "यमक"] },
          ]},
        ],
      },
      {
        name: "English",
        chapters: [
          { number: 1, name: "The Fun They Had", topics: [
            { name: "Story comprehension", keywords: ["future", "school", "technology"] },
            { name: "Tenses", keywords: ["past", "present", "future", "perfect"] },
          ]},
        ],
      },
      {
        name: "Hindi",
        chapters: [
          { number: 1, name: "दो बैलों की कथा", topics: [
            { name: "कथा विश्लेषण", keywords: ["Premchand", "bulls", "freedom"] },
            { name: "मुहावरे", keywords: ["idioms", "phrases"] },
          ]},
        ],
      },
    ],
  },
  {
    class: 10,
    subjects: [
      {
        name: "Mathematics",
        chapters: [
          { number: 1, name: "Linear Equations in Two Variables", topics: [
            { name: "Pair of equations", keywords: ["graphical", "substitution", "elimination", "युगपत समीकरणे"] },
            { name: "Cross multiplication", keywords: ["consistent", "inconsistent", "dependent"] },
          ]},
          { number: 2, name: "Quadratic Equations", topics: [
            { name: "Solving", keywords: ["factorization", "formula", "discriminant", "वर्गसमीकरण"] },
            { name: "Nature of roots", keywords: ["D>0", "D=0", "D<0", "real roots"] },
          ]},
          { number: 3, name: "Arithmetic Progressions", topics: [
            { name: "nth term", keywords: ["common difference", "aₙ=a+(n-1)d", "समांतर श्रेढी"] },
            { name: "Sum of n terms", keywords: ["Sₙ=n/2[2a+(n-1)d]", "sum formula"] },
          ]},
          { number: 4, name: "Trigonometry", topics: [
            { name: "Trigonometric ratios", keywords: ["sin", "cos", "tan", "त्रिकोणमिती"] },
            { name: "Applications", keywords: ["height and distance", "angle of elevation", "depression"] },
          ]},
          { number: 5, name: "Coordinate Geometry", topics: [
            { name: "Distance formula", keywords: ["distance between points", "अंतर सूत्र"] },
            { name: "Section formula", keywords: ["internal division", "midpoint", "विभाजन सूत्र"] },
          ]},
          { number: 6, name: "Circle", topics: [
            { name: "Tangent to a circle", keywords: ["tangent", "secant", "स्पर्शरेषा"] },
            { name: "Number of tangents", keywords: ["external point", "theorem"] },
          ]},
          { number: 7, name: "Statistics", topics: [
            { name: "Mean of grouped data", keywords: ["direct", "assumed mean", "step deviation"] },
            { name: "Median and mode", keywords: ["cumulative frequency", "ogive", "बहुलक"] },
          ]},
          { number: 8, name: "Probability", topics: [
            { name: "Classical probability", keywords: ["outcome", "event", "P(E)", "संभाव्यता"] },
            { name: "Applications", keywords: ["dice", "cards", "coins", "complementary events"] },
          ]},
        ],
      },
      {
        name: "Science",
        chapters: [
          { number: 1, name: "Chemical Reactions and Equations", topics: [
            { name: "Types of reactions", keywords: ["combination", "decomposition", "displacement", "रासायनिक अभिक्रिया"] },
            { name: "Balancing equations", keywords: ["balanced", "reactant", "product"] },
          ]},
          { number: 2, name: "Acids, Bases and Salts", topics: [
            { name: "pH scale", keywords: ["pH", "indicator", "strong acid", "weak acid"] },
            { name: "Reactions", keywords: ["neutralization", "salt formation"] },
          ]},
          { number: 3, name: "Life Processes", topics: [
            { name: "Nutrition", keywords: ["autotrophic", "heterotrophic", "photosynthesis", "पोषण"] },
            { name: "Respiration and transport", keywords: ["aerobic", "blood", "heart", "श्वसन"] },
          ]},
          { number: 4, name: "Light — Reflection and Refraction", topics: [
            { name: "Reflection", keywords: ["mirror", "concave", "convex", "image", "परावर्तन"] },
            { name: "Refraction", keywords: ["lens", "focal length", "power", "अपवर्तन"] },
          ]},
          { number: 5, name: "Electricity", topics: [
            { name: "Ohm's law", keywords: ["V=IR", "resistance", "current", "voltage", "विद्युत"] },
            { name: "Power and energy", keywords: ["P=VI", "kWh", "series", "parallel"] },
          ]},
          { number: 6, name: "Heredity and Evolution", topics: [
            { name: "Mendel's laws", keywords: ["dominant", "recessive", "genotype", "अनुवंशिकता"] },
            { name: "Evolution", keywords: ["natural selection", "speciation", "उत्क्रांती"] },
          ]},
        ],
      },
      {
        name: "Marathi",
        chapters: [
          { number: 1, name: "गद्य", topics: [
            { name: "उतारा आकलन", keywords: ["passage comprehension", "analysis", "उतारा"] },
            { name: "सारांश लेखन", keywords: ["summary writing", "précis", "सारांश"] },
          ]},
          { number: 2, name: "काव्य", topics: [
            { name: "काव्य विश्लेषण", keywords: ["poem analysis", "theme", "imagery"] },
            { name: "काव्यसौंदर्य", keywords: ["aesthetic", "language", "expression"] },
          ]},
          { number: 3, name: "व्याकरण", topics: [
            { name: "अलंकार", keywords: ["उपमा", "रूपक", "अनुप्रास", "यमक", "अतिशयोक्ती"] },
            { name: "वाक्यरचना", keywords: ["sentence structure", "compound", "complex", "मिश्र वाक्य"] },
          ]},
        ],
      },
      {
        name: "English",
        chapters: [
          { number: 1, name: "A Letter to God", topics: [
            { name: "Story comprehension", keywords: ["faith", "letter", "God", "postmaster"] },
            { name: "Formal letter writing", keywords: ["format", "subject", "formal"] },
          ]},
        ],
      },
      {
        name: "Hindi",
        chapters: [
          { number: 1, name: "सूरदास के पद", topics: [
            { name: "काव्य विश्लेषण", keywords: ["Surdas", "Krishna", "devotion", "भक्ति"] },
            { name: "काव्य सौंदर्य", keywords: ["imagery", "metaphor"] },
          ]},
        ],
      },
    ],
  },
];

export function getSubjects(classNum: number): string[] {
  const cls = mscertSyllabus.find((c) => c.class === classNum);
  return cls ? cls.subjects.map((s) => s.name) : [];
}

export function getChapters(classNum: number, subject: string): SyllabusChapter[] {
  const cls = mscertSyllabus.find((c) => c.class === classNum);
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
  return `MSCERT Class ${classNum} ${subject}, Chapter ${ch.number}: ${ch.name}`;
}

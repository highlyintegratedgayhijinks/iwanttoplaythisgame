const items = {
	mentalize: {
		idea: "The idea of mentalizing something",
		thing: "The material reification of the idea of mentalizing",
		dust: "Mental dust",
		machineCostA: [1000, "ideas", "recursion"],
		machineCostB: [10, "dusts", "mentalize"],
		type: "impure",
		purified: "thought",
		machine: "Mind Palace",
		clicker: true,
	},
	reify: {
		idea: "The idea of reifying something",
		thing: "The material reification of the idea of reifying",
		dust: "Material dust",
		machineCostA: [25, "ideas", "idealSubstance"],
		machineCostB: [10, "dusts", "pulverize"],
		class: "reifyThings",
		type: "impure",
		purified: "primaMateria",
		machine: "Matter Lab",
		clicker: true,
	},
	want: {
		idea: "The idea of wanting to play this game",
		thing: "The material reification of the idea of wanting to play this game",
		dust: "Willing dust",
		machineCostA: [10, "ideas", "will"],
		machineCostB: [25, "dusts", "want"],
		type: "impure",
		purified: "will",
		machine: "Heart Complex",
	},
	pulverize: {
		idea: "The idea of pulverizing something",
		thing: "The material reification of the idea of pulverizing",
		dust: "Dust dust",
		type: "impure",
		purified: "shadow",
		clicker: true,
	},
	purify: {
		idea: "The idea of purifying something",
		thing: "The material reification of the idea of purifying",
		dust: "Pure dust",
		type: "impure",
		purified: "purity",
		clicker: true,
	},
	alchemize: {
		idea: "The idea of alchemizing something",
		thing: "The material reification of the idea of alchemizing",
		dust: "Alchemic dust",
		type: "impure",
		purified: "primaMateria",
	},
	destroy: {
		idea: "The idea of destroying something",
		thing: "The material reification of the idea of destroying",
		dust: "Entropic dust",
		type: "impure",
		purified: "entropy",
	},
	separate: {
		idea: "The idea of separating matter into its four components",
		thing: "The material reification of the idea of separating",
		dust: "Philosopher's dust",
		type: "impure",
		purified: "primaMateria",
	},
	machineU: {
		idea: "The idea that you have unlocked a machine",
		type: "impure",
		rarity: "unique",
		purified: "technology"
	},
	unlock: {
		idea: "The idea that you have unlocked something",
		type: "impure",
		rarity: "unique",
		purified: "progress"
	},
	mentAll: {
		idea: "The idea of collapsing everything into a generic idea",
		type: "impure",
		rarity: "unique",
		purified: "abstraction"
	},
	mind: {
		idea: "Mind",
		type: "pure",
		generator: true,
	},
	strength: {
		idea: "Strength",
		type: "pure",
		generator: true,
	},
	recursion: {
		idea: "Recursion",
		type: "pure"
	},
	idealSubstance: {
		idea: "Ideal Substance",
		type: "pure"
	},
	respect: {
		idea: "Respect",
		type: "pure"
	},
	matter: {
		thing: "Matter",
		type: "pure",
		generator: true,
	},
	fire: {
		thing: "Fire",
		type: "pure",
	},
	water: {
		thing: "Water",
		type: "pure",
	},
	air: {
		thing: "Air",
		type: "pure",
	},
	earth: {
		thing: "Earth",
		type: "pure",
	},
	thought: {
		idea: "Thought",
		type: "pure"
	},
	primaMateria: {
		idea: "Prima Materia",
		type: "pure"
	},
	shadow: {
		idea: "Shadow",
		type: "pure"
	},
	entropy: {
		idea: "Entropy",
		type: "pure"
	},
	purity: {
		idea: "Purity",
		type: "pure"
	},
	entropy: {
		idea: "Entropy",
		type: "pure"
	},
	will: {
		idea: "Will",
		type: "pure",
		generator: true,
	},
	technology: {
		idea: "Technology",
		type: "pure"
	},
	progress: {
		idea: "Progress",
		type: "pure"
	},
	abstraction: {
		idea: "Abstraction",
		type: "pure"
	},
	fortitude: {
		idea: "Fortitude",
		ingredients: ["mind", "strength"],
		type: "pure",
		subtype: "alchemified"
	},
	madness: {
		idea: "Madness",
		ingredients: ["mind", "recursion"],
		type: "pure",
		subtype: "alchemified"
	},
	loyalty: {
		idea: "Loyalty",
		ingredients: ["strength", "respect"],
		type: "pure",
		subtype: "alchemified"
	},
	problemSolving: {
		idea: "Problem Solving",
		ingredients: ["recursion", "thought"],
		type: "pure",
		subtype: "alchemified"
	},
	divinity: {
		idea: "Divinity",
		ingredients: ["recursion", "purity"],
		type: "pure",
		subtype: "alchemified"
	},
	idea: {
		idea: "Idea",
		ingredients: ["idealSubstance", "thought"],
		type: "pure",
		subtype: "alchemified"
	},
	faith: {
		idea: "Faith",
		ingredients: ["respect", "primaMateria"],
		type: "pure",
		subtype: "alchemified"
	},
	spark: {
		idea: "Spark",
		ingredients: ["thought", "primaMateria"],
		type: "pure",
		subtype: "alchemified"
	},
	philosophy: {
		idea: "Philosophy",
		ingredients: ["thought", "purity"],
		type: "pure",
		subtype: "alchemified"
	},
	void: {
		idea: "Void",
		ingredients: ["primaMateria", "shadow"],
		type: "pure",
		subtype: "alchemified"
	},
	creation: {
		idea: "Creation",
		ingredients: ["primaMateria", "purity"],
		type: "pure",
		subtype: "alchemified"
	},
	evil: {
		idea: "Evil",
		ingredients: ["shadow", "will"],
		type: "pure",
		subtype: "alchemified"
	},
	death: {
		idea: "Death",
		ingredients: ["shadow", "entropy"],
		type: "pure",
		subtype: "alchemified"
	},
	destruction: {
		idea: "Destruction",
		ingredients: ["strength", "shadow"],
		type: "pure",
		subtype: "alchemified"
	},
	awe: {
		idea: "Awe",
		ingredients: ["respect", "purity"],
		type: "pure",
		subtype: "alchemified"
	},
	fear: {
		idea: "Fear",
		ingredients: ["shadow", "mind"],
		type: "pure",
		subtype: "alchemified"
	},
	decay: {
		idea: "Decay",
		ingredients: ["entropy", "recursion"],
		type: "pure",
		subtype: "alchemified"
	},
	magma: {
		thing: "Magma",
		ingredients: ["earth", "fire"],
		type: "pure",
		subtype: "alchemified"
	},
	dream: {
		idea: "Dream",
		ingredients: ["air", "thought"],
		type: "pure",
		subtype: "alchemified"
	},
	light: {
		thing: "Light",
		ingredients: ["fire", "purity"],
		type: "pure",
		subtype: "alchemified"
	},
	steam: {
		thing: "Steam",
		ingredients: ["water", "fire"],
		type: "pure",
		subtype: "alchemified"
	},
	mud: {
		thing: "Mud",
		ingredients: ["water", "earth"],
		type: "pure",
		subtype: "alchemified"
	},
	storm: {
		thing: "Storm",
		ingredients: ["water", "air"],
		type: "pure",
		subtype: "alchemified"
	},
	blood: {
		thing: "Blood",
		ingredients: ["storm", "light"],
		type: "pure",
		subtype: "alchemified"
	},
	marrow: {
		thing: "Marrow",
		ingredients: ["mud", "magma"],
		type: "pure",
		subtype: "alchemified"
	},
	breath: {
		thing: "Breath",
		ingredients: ["steam", "storm"],
		type: "pure",
		subtype: "alchemified"
	},
	flesh: {
		thing: "Flesh",
		ingredients: ["blood", "marrow", "breath"],
		type: "pure",
		subtype: "alchemified"
	},
	consciousness: {
		idea: "Consciousness",
		ingredients: ["spark", "idea"],
		type: "pure",
		subtype: "alchemified"
	},
	reason: {
		idea: "Reason",
		ingredients: ["philosophy", "problemSolving"],
		type: "pure",
		subtype: "alchemified"
	},
	imagination: {
		idea: "Imagination",
		ingredients: ["dream", "madness"],
		type: "pure",
		subtype: "alchemified"
	},
	corruption: {
		idea: "Corruption",
		ingredients: ["evil", "decay"],
		type: "pure",
		subtype: "alchemified"
	},
	passion: {
		idea: "Passion",
		ingredients: ["fortitude", "spark"],
		type: "pure",
		subtype: "alchemified"
	},
	innocence: {
		idea: "Innocence",
		ingredients: ["faith", "light"],
		type: "pure",
		subtype: "alchemified"
	},
	devotion: {
		idea: "Devotion",
		ingredients: ["loyalty", "awe"],
		type: "pure",
		subtype: "alchemified"
	},
	grief: {
		idea: "Grief",
		ingredients: ["fear", "death"],
		type: "pure",
		subtype: "alchemified"
	},
	sacrifice: {
		idea: "Sacrifice",
		ingredients: ["faith", "death"],
		type: "pure",
		subtype: "alchemified"
	},
	rationalMind: {
		idea: "Rational Mind",
		ingredients: ["consciousness", "reason", "light"],
		type: "pure",
		subtype: "essence"
	},
	creativeMind: {
		idea: "Creative Mind",
		ingredients: ["consciousness", "imagination", "fire"],
		type: "pure",
		subtype: "essence"
	},
	madMind: {
		idea: "Mad Mind",
		ingredients: ["consciousness", "corruption", "storm"],
		type: "pure",
		subtype: "essence"
	},
	braveSoul: {
		idea: "Brave Soul",
		ingredients: ["passion", "sacrifice", "magma"],
		type: "pure",
		subtype: "essence"
	},
	lovingSoul: {
		idea: "Loving Soul",
		ingredients: ["devotion", "innocence", "air"],
		type: "pure",
		subtype: "essence"
	},
	darkSoul: {
		idea: "Dark Soul",
		ingredients: ["corruption", "grief", "void"],
		type: "pure",
		subtype: "essence"
	},
	life: {
		idea: "Life",
		ingredients: ["creation", "divinity", "destruction"],
		type: "pure",
		subtype: "alchemified"
	},
	liquor: {
		liquid: "Liquor",
		type: "pure",
		distilled: true,
		ingredients: ["mentalize", "separate"],
	},
	mana: {
		liquid: "Mana",
		type: "pure",
		distilled: true,
		ingredients: ["purify", "alchemize"],
	},
	preserver: {
		liquid: "Preserver",
		type: "pure",
		distilled: true,
		ingredients: ["reify", "destroy"],
	},
	crystal: {
		thing: "Crystal",
		ingredients: ["purity", "earth"],
		type: "pure",
		subtype: "alchemified"
	},
	obsidian: {
		thing: "Obsidian",
		ingredients: ["shadow", "fire"],
		type: "pure",
		subtype: "alchemified"
	},
	clay: {
		thing: "Clay",
		ingredients: ["will", "earth"],
		type: "pure",
		subtype: "alchemified"
	},
	incense: {
		thing: "Incense",
		ingredients: ["thought", "fire"],
		type: "pure",
		subtype: "alchemified"
	},
	relic: {
		thing: "Relic",
		ingredients: ["entropy", "earth"],
		type: "pure",
		subtype: "alchemified"
	},
	stone: {
		thing: "Stone",
		ingredients: ["strength", "earth"],
		type: "pure",
		subtype: "alchemified"
	},
	wax: {
		thing: "Wax",
		ingredients: ["purity", "fire"],
		type: "pure",
		subtype: "alchemified"
	},
	lightning: {
		thing: "Lightning",
		ingredients: ["fire", "air"],
		type: "pure",
		subtype: "alchemified"
	},
	dust: {
		thing: "Dust",
		ingredients: ["earth", "air"],
		type: "pure",
		subtype: "alchemified"
	},
	lens: {
		thing: "Lens",
		ingredients: ["incense", "dream"],
		type: "pure",
		subtype: "alchemified"
	},
	vessel: {
		thing: "Vessel",
		ingredients: ["relic", "light"],
		type: "pure",
		subtype: "alchemified"
	},
	monolith: {
		thing: "Monolith",
		ingredients: ["stone", "wax"],
		type: "pure",
		subtype: "alchemified"
	},
	luck: {
		idea: "Luck",
		type: "pure",
	},
	ash: {
		thing: "Ash",
		ingredients: ["fire", "shadow"],
		type: "pure",
		subtype: "alchemified"
	},
	resonance: {
		idea: "Resonance",
		ingredients: ["air", "thought"],
		type: "pure",
		subtype: "alchemified"
	},
	soil: {
		thing: "Soil",
		ingredients: ["earth", "entropy"],
		type: "pure",
		subtype: "alchemified"
	},
	dew: {
		thing: "Dew",
		ingredients: ["water", "purity"],
		type: "pure",
		subtype: "alchemified"
	},
	splinter: {
		thing: "Splinter",
		ingredients: ["earth", "shadow"],
		type: "pure",
		subtype: "alchemified"
	},
	glyph: {
		thing: "Glyph",
		ingredients: ["thought", "will"],
		type: "pure",
		subtype: "alchemified"
	},
	halo: {
		thing: "Halo",
		ingredients: ["fire", "purity"],
		type: "pure",
		subtype: "alchemified"
	},
	mist: {
		thing: "Mist",
		ingredients: ["water", "air"],
		type: "pure",
		subtype: "alchemified"
	},
	seed: {
		thing: "Seed",
		ingredients: ["earth", "will"],
		type: "pure",
		subtype: "alchemified"
	},
	// Prestige resources
	clarity: {
		idea: "Clarity",
		type: "pure",
		prestige: true
	},
	courage: {
		idea: "Courage",
		type: "pure",
		prestige: true
	},
	leather: {
		thing: "Leather",
		type: "pure",
		prestige: true
	},
	elixir: {
		thing: "Elixir",
		type: "pure",
		prestige: true
	},
	canvas: {
		thing: "Canvas",
		type: "pure",
		prestige: true
	},
	paint: {
		thing: "Paint",
		type: "pure",
		prestige: true
	},
	masterpiece: {
		thing: "Masterpiece",
		type: "pure",
		prestige: true
	},
	blessedOil: {
		liquid: "Blessed Oil",
		type: "pure",
		prestige: true
	},
	spirit: {
		idea: "Spirit",
		type: "pure",
		prestige: true
	},
	gold: {
		thing: "Gold",
		type: "pure",
		prestige: true
	},
	beads: {
		thing: "Beads",
		type: "pure",
		prestige: true
	},
	goo: {
		thing: "Goo",
		type: "pure",
		prestige: true
	},
	sin: {
		thing: "Sin",
		type: "pure",
		prestige: true
	},
	// Demon failure chain
	failAlchemize: {
		idea: "The idea of failing to alchemize",
		thing: "The reification of the idea of failing",
		dust: "Faildust",
		type: "impure",
		purified: "failure"
	},
	failure: {
		idea: "Failure",
		type: "pure",
		prestige: true
	},
	// Artifacts
	ember: {
		thing: "Ember",
		ingredients: ["ash", "spark", "thought", "clarity"],
		type: "artifact"
	},
	echo: {
		thing: "Echo",
		ingredients: ["resonance", "dream", "recursion", "spirit"],
		type: "artifact"
	},
	root: {
		thing: "Root",
		ingredients: ["soil", "loyalty", "faith", "leather"],
		type: "artifact"
	},
	tear: {
		thing: "Tear",
		ingredients: ["dew", "grief", "innocence", "elixir"],
		type: "artifact"
	},
	shard: {
		thing: "Shard",
		ingredients: ["splinter", "fear", "crystal", "sin"],
		type: "artifact"
	},
	sigil: {
		thing: "Sigil",
		ingredients: ["glyph", "evil", "obsidian", "beads"],
		type: "artifact"
	},
	crown: {
		thing: "Crown",
		ingredients: ["halo", "philosophy", "awe", "gold"],
		type: "artifact"
	},
	veil: {
		thing: "Veil",
		ingredients: ["mist", "madness", "storm", "courage"],
		type: "artifact"
	},
	wreath: {
		thing: "Wreath",
		ingredients: ["seed", "creation", "mud"],
		type: "artifact"
	},
	// New alchemified items for book crafting
	plant: {
		thing: "Plant",
		ingredients: ["seed", "water"],
		type: "pure",
		subtype: "alchemified"
	},
	paper: {
		thing: "Paper",
		ingredients: ["plant", "water"],
		type: "pure",
		subtype: "alchemified"
	},
	ink: {
		thing: "Ink",
		ingredients: ["shadow", "water"],
		type: "pure",
		subtype: "alchemified"
	},
	// Books (produced by Binder: Paper + Leather)
	book: {
		thing: "Book",
		type: "pure",
		subtype: "book"
	},
	// Written books (produced by Writer from Book)
	bookDistillery: {
		thing: "Book of Distillation",
		type: "pure",
		subtype: "book",
		bookTopic: "distillery",
		isBook: true
	},
	bookMind: {
		thing: "Book of Mind",
		type: "pure",
		subtype: "book",
		bookTopic: "mindForge",
		isBook: true
	},
	bookSoul: {
		thing: "Book of Soul",
		type: "pure",
		subtype: "book",
		bookTopic: "soulForge",
		isBook: true
	},
	bookFlesh: {
		thing: "Book of Flesh",
		type: "pure",
		subtype: "book",
		bookTopic: "fleshForge",
		isBook: true
	},
	bookArtifacts: {
		thing: "Book of Artifacts",
		type: "pure",
		subtype: "book",
		bookTopic: "artifacts",
		isBook: true
	},
	// Scrolls (produced by Writer from Paper, consumed after reading)
	scrollDistillery: {
		thing: "Scroll of Distillation",
		type: "pure",
		subtype: "book",
		bookTopic: "distillery",
		isBook: false
	},
	scrollMind: {
		thing: "Scroll of Mind",
		type: "pure",
		subtype: "book",
		bookTopic: "mindForge",
		isBook: false
	},
	scrollSoul: {
		thing: "Scroll of Soul",
		type: "pure",
		subtype: "book",
		bookTopic: "soulForge",
		isBook: false
	},
	scrollFlesh: {
		thing: "Scroll of Flesh",
		type: "pure",
		subtype: "book",
		bookTopic: "fleshForge",
		isBook: false
	},
	scrollArtifacts: {
		thing: "Scroll of Artifacts",
		type: "pure",
		subtype: "book",
		bookTopic: "artifacts",
		isBook: false
	}
}
const actions = {
	want: {
		log: "You want to play this game.",
		action: "want",
	},
	mentalize: {
		log: "You mentalized something.",
		action: "mentalize",
	},
	reify: {
		log: "You reified something.",
		logTooMany: "You reified a lot of stuff.",
		action: "reify",
	},
	pulverize: {
		log: "You pulverized something.",
		action: "pulverize",
		logTooMany: "You pulverized a lot of stuff.",
	},
	purify: {
		log: "You purified something.",
		action: "purify",
	},
	alchemize: {
		log: "You alchemized something.",
		action: "alchemize",
	},
	destroy: {
		log: "You destroyed something.",
		action: "destroy",
	},
	separate: {
		log: "You separated Matter into its four components.",
		action: "destroy",
	},
	luck: {
		log: "You just got lucky.",
	},
	machineU: {
		log: "You have unlocked a machine.",
	},
	unlock: {
		log: "You have unlocked something.",
	},
	respect: {
		log: "You have pressed F to pay respect.",
	},
	mentAll: {
		log: "You collapsed something into a generic idea.",
	},
	failAlchemize: {
		log: "You failed to alchemize.",
		action: "alchemize",
	},
}

const buttons = {
	want: {
		label: "I want to play this game",
		action: "want",
	},
	mentalize: {
		label: "Mentalize",
		action: "mentalize",
	},
	reify: {
		label: "Reify",
		action: "reify",
	},
	pulverize: {
		label: "Pulverize",
		action: "pulverize",
	},
	mentAll: {
		label: "MentAll",
		action: "mentalizeAll",
	},
	reifyMax: {
		label: "ReifyMax",
		action: "reifyMax",
	},
	pulverizeMax: {
		label: "PulverizeMax",
		action: "pulverizeMax",
	},
	mentalizeMax: {
		label: "MentalizeMax",
		action: "mentalizeMax",
	},
	purifyMax: {
		label: "PurifyMax",
		action: "purifyMax",
	},
	autoPulverize: {
		label: "AutoPulverize",
		action: "autoPulverize",
	},
	autoMentalize: {
		label: "AutoMentalize",
		action: "autoMentalize",
	},
	autoReify: {
		label: "AutoReify",
		action: "autoReify",
	},
	autoPurify: {
		label: "AutoPurify",
		action: "autoPurify",
	},
}

const nextAction = {
	ideas: "reify",
	things: "pulverize"
}

const buyables = {
	mindConv: {
		class: "conv",
		cost: [1, "dusts", "mentalize"],
		effect: [10, "ideas", "mind"],
		machine: "mentalize",
	},
	matterConv: {
		class: "conv",
		cost: [1, "dusts", "reify"],
		effect: [10, "things", "matter"],
		machine: "reify",
	},
	willConv: {
		class: "conv",
		cost: [1, "dusts", "want"],
		effect: [10, "ideas", "will"],
		machine: "want",
	},
	strengthConv: {
		class: "conv",
		cost: [1, "dusts", "want"],
		effect: [10, "ideas", "strength"],
		machine: "mentalize",
	},	
	mentAllUnlock: {
		name: "Unlock MentAll",
		cost: [10, "dusts", "mentalize"],
		class: "unlock",
		machine: "mentalize",
	},
	autoMindUnlock: {
		name: "Unlock MindGen",
		cost: [25, "dusts", "mentalize"],
		class: "unlock",
		subclass: "submachine",
		machine: "mentalize",
		unlocks: "autoMind",
	},
	autoStrengthUnlock: {
		name: "Unlock StrengthGen",
		cost: [30, "dusts", "want"],
		class: "unlock",
		subclass: "submachine",
		machine: "mentalize",
		unlocks: "autoStrength",
	},
	autoWillUnlock: {
		name: "Unlock WillGen",
		cost: [40, "dusts", "want"],
		class: "unlock",
		subclass: "submachine",
		machine: "want",
		unlocks: "autoWill",
	},
	purifyMaxUnlock: {
		name: "Unlock PurifyMax",
		class: "unlock",
		subclass: "button",
		cost: [250, "ideas", "idealSubstance"],
		machine: "mentalize",
	},	
	reifyMaxUnlock: {
		name: "Unlock ReifyMax",
		class: "unlock",
		subclass: "button",
		cost: [10, "dusts", "reify"],
		machine: "reify",
	},
	pulverizeMaxUnlock: {
		name: "Unlock PulverizeMax",
		class: "unlock",
		subclass: "button",
		cost: [25, "dusts", "pulverize"],
		machine: "reify",
	},
	mentalizeMaxUnlock: {
		name: "Unlock MentalizeMax",
		class: "unlock",
		subclass: "button",
		cost: [25, "ideas", "thought"],
		machine: "mentalize",
	},
	autoMatterUnlock: {
		name: "Unlock MatterGen",
		cost: [30, "dusts", "reify"],
		class: "unlock",
		subclass: "submachine",
		machine: "reify",
		unlocks: "autoMatter",
	},
	autoReifyUnlock: {
		name: "Unlock AutoReify",
		cost: [25, "ideas", "primaMateria"],
		class: "unlock",
		subclass: "button",
		machine: "want",
	},
	autoPurifyUnlock: {
		name: "Unlock AutoPurify",
		cost: [50, "ideas", "purity"],
		class: "unlock",
		subclass: "button",
		machine: "want",
	},
	autoMentalizeUnlock: {
		name: "Unlock AutoMentalize",
		cost: [100, "ideas", "thought"],
		class: "unlock",
		subclass: "button",
		machine: "want",
	},
	autoPulverizeUnlock: {
		name: "Unlock AutoPulverize",
		cost: [25, "ideas", "shadow"],
		class: "unlock",
		subclass: "button",
		machine: "want",
	},
	alchemindUnlock: {
		name: "Unlock Alcheminder",
		class: "unlock",
		subclass: "submachine",
		cost: [10000, "ideas", "recursion"],
		machine: "mentalize",
		unlocks: "alcheminder",
	},
	oracleUnlock: {
		name: "Unlock Athenaeum",
		class: "unlock",
		subclass: "submachine",
		cost: [25, "ideas", "idea"],
		machine: "mentalize",
		unlocks: "oracle",
	},
	alchematterUnlock: {
		name: "Unlock Alchematter",
		class: "unlock",
		subclass: "submachine",
		cost: [100000, "ideas", "recursion"],
		machine: "reify",
		unlocks: "alchematter",
	},
	alchemyUnlock: {
		name: "Unlock Alchemizer",
		class: "unlock",
		subclass: "submachine",
		cost: [1000000, "ideas", "recursion"],
		machine: "want",
		unlocks: "alchemizer",
	},
	alchemaxUnlock: {
		name: "Unlock Alchemaxer",
		class: "unlock",
		subclass: "submachine",
		cost: [10000000, "ideas", "recursion"],
		machine: "want",
		unlocks: "alchemaxer",
	},
	separatorUnlock: {
		name: "Unlock Separator",
		class: "unlock",
		subclass: "submachine",
		cost: [100, "ideas", "philosophy"],
		machine: "reify",
		unlocks: "separator",
	},
	destructorUnlock: {
		name: "Unlock Destructor",
		class: "unlock",
		subclass: "submachine",
		cost: [100, "ideas", "destruction"],
		machine: "reify",
		unlocks: "destructor",
	},
	distilleryUnlock: {
		name: "Unlock Distillery",
		class: "unlock",
		subclass: "submachine",
		cost: [100, "ideas", "problemSolving"],
		machine: "reify",
		unlocks: "distillery",
	},
	mindForgeUnlock: {
		name: "Unlock Mind Forge",
		class: "unlock",
		subclass: "submachine",
		cost: [10, "things", "crystal"],
		machine: "mentalize",
		unlocks: "mindForge",
	},
	soulForgeUnlock: {
		name: "Unlock Soul Forge",
		class: "unlock",
		subclass: "submachine",
		cost: [10, "things", "obsidian"],
		machine: "want",
		unlocks: "soulForge",
	},
	fleshForgeUnlock: {
		name: "Unlock Flesh Forge",
		class: "unlock",
		subclass: "submachine",
		cost: [10, "things", "clay"],
		machine: "reify",
		unlocks: "fleshForge",
	},
	lifeForgeUnlock: {
		name: "Unlock Life Forge",
		class: "unlock",
		subclass: "submachine",
		cost: [10, "things", "obsidian"],
		machine: "want",
		unlocks: "lifeForge",
	},
	theOracleUnlock: {
		name: "Unlock The Oracle",
		class: "unlock",
		subclass: "submachine",
		cost: [10, "things", "crystal"],
		machine: "mentalize",
		unlocks: "theOracle",
	},
	enminderUnlock: {
		name: "Unlock Enminder",
		class: "unlock",
		subclass: "finalMachine",
		cost: [10, "things", "lens"],
		machine: "mentalize",
		unlocks: "enminder",
	},
	ensoulerUnlock: {
		name: "Unlock Ensouler",
		class: "unlock",
		subclass: "finalMachine",
		cost: [10, "things", "vessel"],
		machine: "want",
		unlocks: "ensouler",
	},
	altarUnlock: {
		name: "Unlock Altar",
		class: "unlock",
		subclass: "finalMachine",
		cost: [10, "things", "monolith"],
		machine: "reify",
		unlocks: "altar",
	},
	articrafterUnlock: {
		name: "Unlock Articrafter",
		class: "unlock",
		subclass: "submachine",
		cost: [100, "ideas", "awe"],
		machine: "reify",
		unlocks: "articrafter",
	},
	atelierUnlock: {
		name: "Unlock Atelier",
		class: "unlock",
		subclass: "submachine",
		cost: [100, "ideas", "abstraction"],
		machine: "reify",
		unlocks: "atelier",
	},
	chapelUnlock: {
		name: "Unlock Chapel",
		class: "unlock",
		subclass: "submachine",
		cost: [100, "ideas", "divinity"],
		machine: "want",
		unlocks: "chapel",
	},
	abyssUnlock: {
		name: "Unlock Abyss",
		class: "unlock",
		subclass: "submachine",
		cost: [100, "ideas", "fear"],
		machine: "want",
		unlocks: "abyss",
	},
	binderUnlock: {
		name: "Unlock Binder",
		class: "unlock",
		subclass: "submachine",
		cost: [10, "things", "paper"],
		machine: "reify",
		unlocks: "binder",
	},
	writerUnlock: {
		name: "Unlock Writer",
		class: "unlock",
		subclass: "submachine",
		cost: [10, "things", "ink"],
		machine: "mentalize",
		unlocks: "writer",
	},
	learnerUnlock: {
		name: "Unlock Learner",
		class: "unlock",
		subclass: "submachine",
		cost: [5, "things", "book"],
		machine: "mentalize",
		unlocks: "learner",
	},
}

const subMachines = {
	autoMind: {
		name: "MindGen",
		desc: "Generate Mind.",
		machine: "mentalize",
		type: "idea",
		token: "mind",
		class: "generator"
	},
	autoMatter: {
		name: "MatterGen",
		desc: "Generate Matter.",
		machine: "reify",
		type: "thing",
		token: "matter",
		class: "generator"	
	},
	autoStrength: {
		name: "StrengthGen",
		desc: "Generate Strength.",
		machine: "mentalize",
		type: "idea",
		token: "strength",
		class: "generator"	
	},
	autoWill: {
		name: "WillGen",
		desc: "Generate Will.",
		machine: "want",
		type: "idea",
		token: "will",
		class: "generator"	
	},
	alcheminder: {
		name: "Alcheminder",
		desc: "Alchemize ideas.",
		machine: "mentalize",
		class: "alchemy"
	},
	oracle: {
		name: "Athenaeum",
		desc: "Study an element to learn what it pairs with.",
		machine: "mentalize",
		class: "athenaeum"
	},
	alchematter: {
		name: "Alchematter",
		desc: "Alchemize things.",
		machine: "reify",
		class: "alchemy"	
	},
	alchemizer: {
		name: "Alchemizer",
		desc: "Combine an idea with a thing.",
		machine: "want",
		class: "alchemy"	
	},
	alchemaxer: {
		name: "Alchemaxer",
		desc: "Alchemize stuff made with alchemy.",
		machine: "want",
		class: "alchemy"	
	},
	separator: {
		name: "Separator",
		desc: "Separate Matter into its four components.",
		machine: "reify",
		class: "separator"	
	},
	destructor: {
		name: "Destructor",
		desc: "Destroy anything.",
		machine: "reify",
		class: "destructor"
	},
	distillery: {
		name: "Distillery",
		desc: "Distill dusts into liquids using water.",
		machine: "reify",
		class: "distillery"
	},
	mindForge: {
		name: "Mind Forge",
		desc: "Forge Minds from tier 2 ideas.",
		machine: "mentalize",
		class: "forge"
	},
	soulForge: {
		name: "Soul Forge",
		desc: "Forge Souls from tier 2 ideas.",
		machine: "want",
		class: "forge"
	},
	fleshForge: {
		name: "Flesh Forge",
		desc: "Forge Flesh from tier 2 materials.",
		machine: "reify",
		class: "forge"
	},
	lifeForge: {
		name: "Life Forge",
		desc: "Create Life from creation, divinity and destruction.",
		machine: "want",
		class: "forge"
	},
	theOracle: {
		name: "The Oracle",
		desc: "Peer into the union of Mind and Soul. The Oracle speaks in riddles.",
		machine: "mentalize",
		class: "oracle"
	},
	articrafter: {
		name: "Articrafter",
		desc: "Craft artifacts from rare materials.",
		machine: "reify",
		class: "articrafter"
	},
	atelier: {
		name: "Atelier",
		desc: "Create masterpieces from canvas and paint.",
		machine: "reify",
		class: "atelier"
	},
	chapel: {
		name: "Chapel",
		desc: "Produce spirit from faith and devotion.",
		machine: "want",
		class: "chapel"
	},
	abyss: {
		name: "Abyss",
		desc: "Forge sin from failure.",
		machine: "want",
		class: "abyss"
	},
	market: {
		name: "Market",
		desc: "Spend gold to buy resources.",
		machine: "reify",
		class: "market"
	},
	binder: {
		name: "Binder",
		desc: "Bind paper and leather into a book.",
		machine: "reify",
		class: "binder"
	},
	writer: {
		name: "Writer",
		desc: "Write a topic onto paper or a book using ink.",
		machine: "mentalize",
		class: "writer"
	},
	learner: {
		name: "Learner",
		desc: "Study a written book to learn recipe secrets.",
		machine: "mentalize",
		class: "learner"
	},
}

const knowerRiddles = {
	rationalMind_braveSoul: "One touch fills what once took many -- the well overflows and the stream runs steady.",
	creativeMind_braveSoul: "All gates stand open from the start -- no toll is asked, no lock to part.",
	madMind_braveSoul: "Strength is free but nothing is safe -- the beast takes its share and leaves hide in its wake.",
	rationalMind_lovingSoul: "The vessel grows tenfold deep -- when it brims, the craft begins to reap.",
	creativeMind_lovingSoul: "Every union bears a twin -- and sometimes color spills from within.",
	madMind_lovingSoul: "The spiral's price is cut to a quarter -- and golden drops fall into the water.",
	rationalMind_darkSoul: "Each hour the throne demands its tithe -- your hoard shrinks but gleams with something bright.",
	creativeMind_darkSoul: "A deal you didn't ask for, a choice you can't ignore -- refuse and lose, accept and gain a little more.",
	madMind_darkSoul: "Every secret is laid bare, every path revealed -- but one in five attempts will yield nothing to wield.",
}

const fuelCost = {
	mind: [10, "dusts", "mentalize"],
	matter: [10, "dusts", "reify"],
	strength: [10, "dusts", "want"],
	will: [10, "dusts", "want"],
}

var ideas = {};
var things = {};
var dusts = {};
var liquids = {};

var itemCounter = {
	idea: ideas,
	thing: things,
	dust: dusts,
	liquid: liquids
}
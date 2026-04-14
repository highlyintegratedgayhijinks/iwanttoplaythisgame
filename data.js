const items = {
	want: {
		idea: "The idea of wanting to play this game",
		thing: "The material reification of the idea of wanting to play this game",
		dust: "Willing dust",
		liquid: "Willing liquid",
		machineCostA: [10, "ideas", "will"],
		machineCostB: [25, "dusts", "want"],		
		type: "impure",
		purified: "will",
		machine: "Heart Complex",
	},
	mentalize: {
		idea: "The idea of mentalizing something",
		thing: "The material reification of the idea of mentalizing",
		dust: "Mental dust",
		machine: "Mind machine",
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
	luck: {
		idea: "Luck",
		type: "pure",
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
	empowererUnlock: {
		name: "Unlock Empowerer",
		class: "unlock",
		subclass: "submachine",
		cost: [100, "ideas", "fortitude"],
		machine: "mentalize",
		unlocks: "empowerer",
	}			
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
	alchematter: {
		name: "Alchematter",
		desc: "Alchemize things.",
		machine: "reify",
		class: "alchemy"	
	},
	alchemizer: {
		name: "Alchemizer",
		desc: "Alchemize ideas and things.",
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
	empowerer: {
		name: "Empowerer",
		desc: "Empower stuff.",
		machine: "mentalize",
		class: ""	
	},
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
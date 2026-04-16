// VARIABLES //

var prestigeState = null;
var maxButtonUses = 0;
var modifierIntervals = {};

function startVar(){
	$.each(itemCounter, function(type, types){
		$.each(items, function(id, item){
			if(item[type]){
				types[id] = 0
			}
		});
	});

	impureItems = {};
	$.each(itemCounter, function(type, types){
		let word = type + 's';
		impureItems[word] = [];
		$.each(items, function(id, item){
			if(item.type == "impure"){
				impureItems[word].push(id);
			}
		});
	});

	ideas.mind = 300;
	ideas.strength = 300;
	things.matter = 300;

	itemUnlock = {}

	$.each(itemCounter, function(type, types){
		itemUnlock[type+'s'] = {};
		$.each(items, function(id, item){
			if(item[type]){
				itemUnlock[type+'s'][id] = "locked"
			}
		});
	});

	activeLogCounter = 0;
	seenFacts = {};
	seenNames = {};

	showStatus = {
		log: "locked",
		ideas: "locked",
		things: "locked",
		machines: "locked"
	}

	machineStatus = {}
	$.each(items, function(id){
		if(items[id].machine){
			machineStatus[id] = "locked";
		}
	});

	buyableStatus = {}
	$.each(buyables, function(id){
		buyableStatus[id] = "locked";
	})

	clickerStatus = {}
	$.each(items, function(id){
		if(items[id].clicker){
			clickerStatus[id] = "off";
		}
	});

	power = {}
	fuelGauge = {}
	fuelGaugeSize = {}
	$.each(items, function(id){
		if(items[id].generator){
			power[id] = 0;
			fuelGauge[id] = 0;
			fuelGaugeSize[id] = 1000;
		}
	});
	power.alchemy = 1;

	distilleryGauge = { water: 0 };
	distilleryGaugeSize = 100;
	distillingActive = null;

	oracleGauge = { mentalize: 0 };
	oracleGaugeSize = 25;
	consultingActive = null;

	theOracleGauge = { dream: 0 };
	theOracleGaugeSize = 100;
	divinedRiddles = {};

	alchemyDustGauge = { mentalize: 0, pulverize: 0, purify: 0, alchemize: 0 };
	alchemyDustGaugeSize = 100;

	finalMachineStatus = {};
	altarFuel = { preserver: 0, dust: 0, flesh: 0 };
	enminderFuel = { liquor: 0, lightning: 0 };
	ensoulerFuel = { mana: 0, life: 0 };
	enmindedMind = null;
	ensouledSoul = null;
	humanCreated = null;
	humansUnlocked = [];

	altarArtifact = null;

	atelierFuel = { imagination: 0 };
	chapelFuel = { blessedOil: 0 };
	abyssFuel = { evil: 0 };

	writerGauge = { ink: 0 };
	writerGaugeSize = 25;
	writingActive = null;

	learnerGauge = { separate: 0 };
	learnerGaugeSize = 25;
	learningActive = null;
	bookProgress = {};

	logCount = 0;
	logEntries = [];

	// Prestige state (persists across resets)
	if (!prestigeState) {
		prestigeState = {
			runNumber: 1,
			createdHumans: [],
			craftedArtifacts: [],
			activeModifiers: [],
			prestigeResources: {
				clarity: 0, courage: 0, leather: 0, elixir: 0,
				canvas: 0, paint: 0, masterpiece: 0,
				blessedOil: 0, spirit: 0,
				gold: 0, beads: 0,
				goo: 0, failure: 0, sin: 0
			}
		};
	}

	// Modifier runtime state
	maxButtonUses = 0;
	modifierIntervals = {};

	state = {
		logCount: logCount,
		ideas: ideas,
		things: things,
		dusts: dusts,
		liquids: liquids,
		machineStatus: machineStatus,
		showStatus: showStatus,
		clickerStatus: clickerStatus,
		buyableStatus: buyableStatus,
		power: power,
		fuelGauge: fuelGauge,
		fuelGaugeSize: fuelGaugeSize,
		itemUnlock: itemUnlock,
		itemCounter: itemCounter,
		seenFacts: seenFacts,
		logEntries: logEntries,
		distilleryGauge: distilleryGauge,
		oracleGauge: oracleGauge,
		theOracleGauge: theOracleGauge,
		divinedRiddles: divinedRiddles,
		alchemyDustGauge: alchemyDustGauge,
		finalMachineStatus: finalMachineStatus,
		altarFuel: altarFuel,
		enminderFuel: enminderFuel,
		ensoulerFuel: ensoulerFuel,
		enmindedMind: enmindedMind,
		ensouledSoul: ensouledSoul,
		humanCreated: humanCreated,
		humansUnlocked: humansUnlocked,
		altarArtifact: altarArtifact,
		seenNames: seenNames,
		atelierFuel: atelierFuel,
		chapelFuel: chapelFuel,
		abyssFuel: abyssFuel,
		writerGauge: writerGauge,
		learnerGauge: learnerGauge,
		bookProgress: bookProgress
	}
}

function updateState(){
	logCount = state.logCount;
	machineStatus = state.machineStatus;
	showStatus = state.showStatus;
	buyableStatus = state.buyableStatus;
	$.each(buyables, function(id){
		if(buyableStatus[id] === undefined) buyableStatus[id] = "locked";
	});
	clickerStatus = state.clickerStatus;
	things = state.things;
	ideas = state.ideas;
	dusts = state.dusts;
	power = state.power;
	itemCounter = state.itemCounter;
	fuelGauge = state.fuelGauge;
	fuelGaugeSize = state.fuelGaugeSize;
	itemUnlock = state.itemUnlock;
	seenFacts = state.seenFacts || {};
	logEntries = state.logEntries || [];
	seenNames = state.seenNames || {};
	distilleryGauge = state.distilleryGauge || { water: 0 };
	oracleGauge = state.oracleGauge || { mentalize: 0 };
	theOracleGauge = state.theOracleGauge || { dream: 0 };
	divinedRiddles = state.divinedRiddles || {};
	alchemyDustGauge = state.alchemyDustGauge || { mentalize: 0, pulverize: 0, purify: 0, alchemize: 0 };
	finalMachineStatus = state.finalMachineStatus || {};
	altarFuel = state.altarFuel || state.slabFuel || { preserver: 0, dust: 0 };
	if(buyableStatus.slabUnlock) {
		buyableStatus.altarUnlock = buyableStatus.slabUnlock;
		delete buyableStatus.slabUnlock;
	}
	if(finalMachineStatus.slab) {
		finalMachineStatus.altar = finalMachineStatus.slab;
		delete finalMachineStatus.slab;
	}
	// migrate altar→monolith item rename
	if(things.altar) {
		things.monolith = (things.monolith || 0) + things.altar;
		delete things.altar;
	}
	if(itemCounter.thing && itemCounter.thing.altar) {
		itemCounter.thing.monolith = (itemCounter.thing.monolith || 0) + itemCounter.thing.altar;
		delete itemCounter.thing.altar;
	}
	if(itemUnlock && itemUnlock.things && itemUnlock.things.altar) {
		itemUnlock.things.monolith = itemUnlock.things.altar;
		delete itemUnlock.things.altar;
	}
	// re-sync itemCounter references
	itemCounter = { idea: ideas, thing: things, dust: dusts, liquid: liquids };
	enminderFuel = state.enminderFuel || { liquor: 0, lightning: 0 };
	ensoulerFuel = state.ensoulerFuel || { mana: 0, life: 0 };
	enmindedMind = state.enmindedMind || null;
	ensouledSoul = state.ensouledSoul || null;
	humanCreated = state.humanCreated || null;
	humansUnlocked = state.humansUnlocked || [];
	altarArtifact = state.altarArtifact || null;
	liquids = state.liquids || {};
	atelierFuel = state.atelierFuel || { imagination: 0 };
	chapelFuel = state.chapelFuel || { blessedOil: 0 };
	abyssFuel = state.abyssFuel || { evil: 0 };
	writerGauge = state.writerGauge || { ink: 0 };
	learnerGauge = state.learnerGauge || { separate: 0 };
	bookProgress = state.bookProgress || {};
}

// LOCAL STORAGE //

function updateLocalStorage(){
	state.logCount = logCount;
	state.seenFacts = seenFacts;
	state.logEntries = logEntries;
	state.altarFuel = altarFuel;
	state.enminderFuel = enminderFuel;
	state.ensoulerFuel = ensoulerFuel;
	state.enmindedMind = enmindedMind;
	state.ensouledSoul = ensouledSoul;
	state.humanCreated = humanCreated;
	state.humansUnlocked = humansUnlocked;
	state.altarArtifact = altarArtifact;
	state.seenNames = seenNames;
	state.finalMachineStatus = finalMachineStatus;
	state.atelierFuel = atelierFuel;
	state.chapelFuel = chapelFuel;
	state.abyssFuel = abyssFuel;
	state.writerGauge = writerGauge;
	state.learnerGauge = learnerGauge;
	state.bookProgress = bookProgress;
	localStorage.setItem('gameState', JSON.stringify(state));
	savePrestigeState();
}

function savePrestigeState(){
	// Sync current run's prestige resources into prestigeState
	var pr = prestigeState.prestigeResources;
	$.each(pr, function(key){
		if (ideas[key] !== undefined) pr[key] = ideas[key];
		else if (things[key] !== undefined) pr[key] = things[key];
		else if (liquids[key] !== undefined) pr[key] = liquids[key];
		else if (dusts[key] !== undefined) pr[key] = dusts[key];
	});
	localStorage.setItem('prestigeState', JSON.stringify(prestigeState));
}

function loadPrestigeState(){
	var saved = localStorage.getItem('prestigeState');
	if (saved) {
		prestigeState = JSON.parse(saved);
		// Ensure new keys exist
		if (!prestigeState.prestigeResources) prestigeState.prestigeResources = {};
		var defaults = {
			clarity: 0, courage: 0, leather: 0, elixir: 0,
			canvas: 0, paint: 0, masterpiece: 0,
			blessedOil: 0, spirit: 0,
			gold: 0, beads: 0,
			goo: 0, failure: 0, sin: 0
		};
		$.each(defaults, function(key, val){
			if (prestigeState.prestigeResources[key] === undefined)
				prestigeState.prestigeResources[key] = val;
		});
		if (!prestigeState.createdHumans) prestigeState.createdHumans = [];
		if (!prestigeState.craftedArtifacts) prestigeState.craftedArtifacts = [];
		if (!prestigeState.activeModifiers) prestigeState.activeModifiers = [];
		if (!prestigeState.runNumber) prestigeState.runNumber = 1;
	}
}

function restorePrestigeResources(){
	// Inject prestige resources from prestigeState into live game counters
	var pr = prestigeState.prestigeResources;
	$.each(pr, function(key, val){
		if (items[key] && items[key].idea) ideas[key] = (ideas[key] || 0) + val;
		else if (items[key] && items[key].thing) things[key] = (things[key] || 0) + val;
		else if (items[key] && items[key].liquid) liquids[key] = (liquids[key] || 0) + val;
		else if (items[key] && items[key].dust) dusts[key] = (dusts[key] || 0) + val;
	});
}

function prestigeReset(){
	// Save current Human to prestige state
	if (humanCreated) {
		var profile = getProfileForHuman();
		if (profile && prestigeState.createdHumans.indexOf(profile.name) === -1) {
			prestigeState.createdHumans.push(profile.name);
			// Map human name to modifier key
			var modMap = {
				'The Commander': 'commander', 'The Hero': 'hero',
				'The Berserker': 'berserker', 'The Healer': 'healer',
				'The Artist': 'artist', 'The Saint': 'saint',
				'The Tyrant': 'tyrant', 'The Trickster': 'trickster',
				'The Demon': 'demon'
			};
			var modKey = modMap[profile.name];
			if (modKey && prestigeState.activeModifiers.indexOf(modKey) === -1) {
				prestigeState.activeModifiers.push(modKey);
			}
		}
	}

	prestigeState.runNumber++;
	savePrestigeState();

	// Clear run state — set flag to prevent unload handler from re-saving
	prestigeResetting = true;
	localStorage.removeItem('gameState');

	// Clear modifier intervals
	$.each(modifierIntervals, function(key, interval){
		if (interval) clearInterval(interval);
	});
	modifierIntervals = {};

	// Reload
	location.reload();
}

function loadState(){
	if (localStorage.getItem('gameState')) {
		state = JSON.parse(localStorage.getItem('gameState'))
		updateState();
	};
}

var prestigeResetting = false;

$( window ).on("unload", function() {
	if (!prestigeResetting) updateLocalStorage();
});

// READY //

$( document ).ready(function() {
	startup();
});

function startup(){
	loop();
	startVar();
	loadPrestigeState();
	loadState();
	// On prestige runs (2+), auto-show columns and machines
	if (prestigeState && prestigeState.runNumber > 1 && !localStorage.getItem('gameState')) {
		showStatus.log = "unlocked";
		showStatus.ideas = "unlocked";
		showStatus.things = "unlocked";
		showStatus.machines = "unlocked";
	}
	show();
	seedSeenNames();
	buildMachines();
	buildSubMachines();
	buildAllItems();
	buildBuyables();
	button("#header", null, "want");
	buyablesClick();
	machineUnlockClick();
	powerStart();
	clickStatus();
	clickerStart();
	clickStatus();
	impureStatus();
	rebuildLog();
	// Rebuild final machines from saved state
	$.each(finalMachineStatus, function(id){
		if(finalMachineStatus[id] == "unlocked"){
			unlockFinalMachine(id);
		}
	});
	settings();
	tree();
	applyModifiers();
	info();
	updateBuyableAffordability();
	// Spawn walkers and show humans button from prestige state
	if (window._stickman && window._stickman.refreshWalkers) {
		window._stickman.refreshWalkers();
	}
	if (typeof refreshHumansButton === 'function') refreshHumansButton();
}
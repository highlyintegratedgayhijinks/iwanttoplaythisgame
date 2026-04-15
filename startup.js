// VARIABLES //

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

	logCount = 0;
	logEntries = [];

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
		alchemyDustGauge: alchemyDustGauge,
		finalMachineStatus: finalMachineStatus,
		altarFuel: altarFuel,
		enminderFuel: enminderFuel,
		ensoulerFuel: ensoulerFuel,
		enmindedMind: enmindedMind,
		ensouledSoul: ensouledSoul,
		humanCreated: humanCreated,
		humansUnlocked: humansUnlocked,
		seenNames: seenNames
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
	liquids = state.liquids || {};
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
	state.seenNames = seenNames;
	state.finalMachineStatus = finalMachineStatus;
	localStorage.setItem('gameState', JSON.stringify(state));
}

function loadState(){
	if (localStorage.getItem('gameState')) {
		state = JSON.parse(localStorage.getItem('gameState'))
		updateState();
	};
}

$( window ).on("unload", function() {
	updateLocalStorage();
});

// READY //

$( document ).ready(function() {
	startup();
});

function startup(){
	loop();
	startVar();
	loadState();
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
	info();
	updateBuyableAffordability();
}
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

	logCount = 0;

	state = {
		logCount: logCount,
		ideas: ideas,
		things: things,
		dusts: dusts,
		machineStatus: machineStatus,
		showStatus: showStatus,
		clickerStatus: clickerStatus,
		buyableStatus: buyableStatus,
		power: power,
		fuelGauge: fuelGauge,
		fuelGaugeSize: fuelGaugeSize,
		itemUnlock: itemUnlock,
		itemCounter: itemCounter
	}
}

function updateState(){
	logCount = state.logCount;
	machineStatus = state.machineStatus;
	showStatus = state.showStatus;
	buyableStatus = state.buyableStatus;
	clickerStatus = state.clickerStatus;
	things = state.things;
	ideas = state.ideas;
	dusts = state.dusts;
	power = state.power;
	itemCounter = state.itemCounter;
	fuelGauge = state.fuelGauge;
	fuelGaugeSize = state.fuelGaugeSize;
	itemUnlock = state.itemUnlock;
}

// LOCAL STORAGE //

function updateLocalStorage(){
	state.logCount = logCount;
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
	settings();
	info();
}
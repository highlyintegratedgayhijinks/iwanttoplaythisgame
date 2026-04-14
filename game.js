function powerStart() {
	$.each(power, function(token){
		updatePowerCounter(token);
		updateFuelGaugeCounter(token);
		spendFuel(token);
		$('.subMachine.'+token+' .addFuel').on( "click", function() {
			powerIncrease(token);
		});
	});
}

var autoClickerInterval = {
	reify: null,
	mentalize: null,
	pulverize: null
};

function clickerStart() {
	$.each(clickerStatus, function(token){
		if(clickerStatus[token] == "on") {
			autoClickerPower(token, "on");
} else if (clickerStatus[token] == "off"){
	autoClickerPower(token, "off");
}
});
}

function autoClickerPower(token, state){
	if (state == "on"){
		clickerStatus[token] = "on";
		$('.clicker.'+token).addClass("on").removeClass("off");
		autoClickerInterval[token] = setInterval(() => {autoClicker(token)}, 1000);
	} else if (state == "off"){
		clickerStatus[token] = "off";
		$('.clicker.'+token).addClass("off").removeClass("on");
		clearInterval(autoClickerInterval[token]);		
	}
}

function clickStatus(){
	$.each(clickerStatus, function(token){
		$('.clicker.'+token).on("click", function() {
			if(clickerStatus[token] == "on"){
				autoClickerPower(token, "off");
			} else if (clickerStatus[token] == "off"){
				autoClickerPower(token, "on");
			}
		});
	});
}

function clicker(appendTo, buttonType, type){
	clickStatus();
	$(appendTo).append('<div class="clicker button off '+buttonType+' '+type+'">'+buttons[buttonType].label+'</div></div>')
	clickStatus();
}

function totalImpureIdeas(){
	let total = 0;
	$.each(ideas, function(id, amount){
		if(amount > 0 && items[id].type == "impure"){
			total = total + amount;
		}
	});
	return total;
}

function totalImpureThings(){
	let total = 0;
	$.each(things, function(id, amount){
		if(amount > 0 && items[id].type == "impure"){
			total = total + amount;
		}
	});
	return total;
}

function autoClicker(token){
	if (token == "reify"){
		if (pay("ideas", "will", totalImpureIdeas())){
			reifyMax();
		} else {
			autoClickerPower(token, "off");
		}	
	}
	if (token == "pulverize"){
		if (pay("ideas", "will", totalImpureThings())){
			pulverizeMax();
		} else {
			autoClickerPower(token, "off");
		}	
	}
	if (token == "mentalize"){
		if (pay("ideas", "will", activeLogCounter)){
			mentalizeMax();
		} else {
			autoClickerPower(token, "off");
		}	
	}
	if (token == "purify"){
		if (pay("ideas", "will", totalImpureIdeas())){
			purifyMax();
		} else {
			autoClickerPower(token, "off");
		}	
	}		
}

function buyablesClick(){
	$.each(buyables, function(id){
		$('#' + id).on( "click", function() {
			buyable(id);
		});
	});
}

function machineUnlockClick(){
	$.each(items, function(id, item){
		if(item.machine){
			$('.machineUnlock.'+id).on( "click", function() {
				unlockMachine(id);
			});
		}
	});
	}

	function evalType(item){
		if(items[item].type == "pure"){
			if(items[item].idea){
				return "ideas"
			} else if(items[item].thing){
				return "things"
			}
		}
	}

	function show(){
		$.each(showStatus, function(id){
			if(showStatus[id] == "unlocked"){
				$(`#${id}.main`).show();
	} else {
		$(`#${id}.main`).hide();
	}
});
	}

	function buildBuyables(){
		$.each(buyableStatus, function(id){
			if (buyableStatus[id] == "unlocked"){
				$('.buyable.'+id).hide();
		if (id == "mentAllUnlock"){
			button("#log .header .buttons", null, "mentAll")
			$(".button.mentAll").append('<span class="counter"> (<span class="number">'+activeLogCounter+'</span>)</span>')
		}
		if (id == "reifyMaxUnlock"){
			button("#ideas .header .buttons", null, "reifyMax")
		}
		if (id == "pulverizeMaxUnlock"){
			button("#things .header .buttons", null, "pulverizeMax")
		}
		if (id == "mentalizeMaxUnlock"){
			button("#log .header .buttons", null, "mentalizeMax")
		}
		if (id == "purifyMaxUnlock"){
			button("#ideas .header .buttons", null, "purifyMax")
		}
		if (id == "autoMentalizeUnlock"){
			clicker("#log .header .buttons", "autoMentalize", "mentalize")
		}
		if (id == "autoReifyUnlock"){
			clicker("#ideas .header .buttons", "autoReify", "reify")
		}	
		if (id == "autoPurifyUnlock"){
			clicker("#ideas .header .buttons", "autoPurify", "purify")
		}	
		if (id == "autoPulverizeUnlock"){
			clicker("#things .header .buttons", "autoPulverize", "pulverize")
		}			

		if(buyables[id].subclass == "submachine"){
			$('#'+buyables[id].unlocks).show();
		}
	}
});
}

function buildMachines(){
	$.each(items, function(token){
		if (items[token].machine){
			$('#machines .content').append(`
			<div class="machineUnlock box ${token}" style="display:none;">
			<div class="title">Unlock ${items[token].machine}</div>
			<div class="cost"><span class="${items[token].machineCostA[2]}">${items[token].machineCostA[0]} ${items[items[token].machineCostA[2]][items[token].machineCostA[1].slice(0, -1)]}</span>, <span class="${items[token].machineCostB[2]}">${items[token].machineCostB[0]} ${items[items[token].machineCostB[2]][items[token].machineCostB[1].slice(0, -1)]}</span></div></div>
			`)
			$('#machines .content').append(`
			<div class="machine box ${token}" style="display:none;">
			<div class="title">${items[token].machine}</div>
			</div>
			`)
			$('.machine.'+token).append(`
			<div class="container">
			<div class="stripContainer">
			<div class="subMachineContainer"></div>
			<div class="strip small"></div>
			<div class="strip big"></div>
			</div>
			</div>
			`);
$.each(buyables, function(buyable){
	if(buyables[buyable].machine == token) {
		if (buyables[buyable].class == "conv") {
			$('.machine.'+token+' .strip.small').append('<div id="'+buyable+'" class="tile small buyable '+buyable+'"><span class="name '+buyables[buyable].effect[2]+'">+'+buyables[buyable].effect[0]+' '+items[buyables[buyable].effect[2]][buyables[buyable].effect[1].slice(0, -1)]+'</span><span class="cost '+buyables[buyable].cost[2]+'">'+buyables[buyable].cost[0]+' '+items[buyables[buyable].cost[2]][buyables[buyable].cost[1].slice(0, -1)]+'</span></div>');
		} else if (buyables[buyable].class == "unlock") {
			$('.machine.'+token+' .strip.big').append('<div id="'+buyable+'" class="tile buyable '+buyable+'"><span class="name">'+buyables[buyable].name+'</span><span class="cost '+buyables[buyable].cost[2]+'">'+buyables[buyable].cost[0]+' '+items[buyables[buyable].cost[2]][buyables[buyable].cost[1].slice(0, -1)]+'</span></div>');
		}
	}
});
if(machineStatus[token] == "unlocked"){
	$('.machine.'+token).show();
	$('.machineUnlock.'+token).hide();
} else {
	$('.machine.'+token).hide();
	$('.machineUnlock.'+token).show();			
}
}
});
}

function buildSubMachines(){
	$.each(subMachines, function(sub){
		token = subMachines[sub].machine;
		$('.machine.'+token+' .subMachineContainer').append(`
			<div id="${sub}" class="subMachine ${sub} ${subMachines[sub].token} ${subMachines[sub].class}" style="display:none;">
				<div class="envelope">
					<div class="card-front">
						<div class="head">
							<div class="collapse"></div>
							<div class="name">${subMachines[sub].name}</div>
							<div class="settings"></div>
						</div>
						<div class="machinery"></div>
					</div>
					<div class="card-back">
						<div class="head">
							<div class=""></div>
							<div class="name">${subMachines[sub].name}</div>
							<div class="settings"></div>
						</div>
						<div class="desc text">${subMachines[sub].desc}</div>
					</div>
					</div>
			</div>
			`);

		if(subMachines[sub].class == "generator") {
			$(`.subMachine#${sub} .machinery`).append(`
			<div class="text">+<span class="info"></span> ${items[subMachines[sub].token][subMachines[sub].type]}/s</div>
			<div class="text"><span class="fuel"></span>/<span class="gauge"></span>  ${items[fuelCost[subMachines[sub].token][2]][fuelCost[subMachines[sub].token][1].slice(0, -1)]}</div>
			<div class="gaugeDraw"><div class="fuelDraw"></div></div>
			<div class="button addFuel ${fuelCost[subMachines[sub].token][2]}">Add ${fuelCost[subMachines[sub].token][0]} ${items[fuelCost[subMachines[sub].token][2]][fuelCost[subMachines[sub].token][1].slice(0, -1)]}</div>`);

		} else if(subMachines[sub].class == "alchemy") {
			$(`.subMachine#${sub} .machinery`).append('<div class="selectors"><select id="selector1" class="selector"></select> + <select id="selector2" class="selector"></select></div><div id="result">???</div><div id="alchemize" class="button"><span id="text">Can\'t Create</span><span id="alchemyDust"></span></div>');
			populateSelector(`#${sub} #selector1`, sub);
			populateSelector(`#${sub} #selector2`, sub);
			$( ".selector" ).on( "change", function() {
				let rec = recipe($(`#${sub} #selector1`).val(), $(`#${sub} #selector2`).val());
				if(rec){
					$(`#${sub} #result`).html(items[rec][evalType(rec).slice(0, -1)])
					$(`#${sub} #result`).removeClass().addClass(rec)
					$(`#${sub} #alchemyDust`).html(' for '+power.alchemy*10+' '+items[alchemyDust(rec)].dust)
					$(`#${sub} #alchemyDust`).addClass(alchemyDust(rec));
					$(`#${sub} #alchemize #text`).html('Create '+power.alchemy);
					$(`#${sub} #alchemize #text`).addClass(rec);
				} else {
					$(`#${sub} #result`).removeClass().html("???")
					$(`#${sub} #alchemyDust`).html('');
					$(`#${sub} #alchemize #text`).removeClass().html("Can\'t Create");
				}
			} );

				$(`#${sub} #alchemize`).on("click", function(){
				alchemy(recipe($(`#${sub} #selector1`).val(), $(`#${sub} #selector1`).val()))
			})
		} else if(subMachines[sub].class == "separator") {
			$(`.subMachine#${sub} .machinery`).append(`
			<div class="text">Separate 400 <span class="matter">Matter</span> into</div>
			<div class="text">1 <span class="fire">Fire</span>, 1 <span class="water">Water</span>,<br/> 1 <span class="earth">Earth</span>, 1 <span class="air">Air</span></div>
			<div id="separate" class="button"><span id="text">Separate</span></div>`);
			$('#separate').on("click", function(){
				separate();
			})

		} else if(subMachines[sub].class == "destructor") {
			$(`.subMachine#${sub} .machinery`).append(`
			<div class="selectors text">Destroy 1 <select id="selector" class="selector"></select></div><br/>
			<div id="destroy" class="button"><span id="text">Destroy</span></div>`);
			populateSelector('#selector', "all");

			$('#destroy').on("click", function(){
				destroy($(`#${sub} #selector`).val());
			})
		}
});

$('.subMachine .collapse').click(function() {
	$(this).parent().parent().parent().parent().toggleClass("collapsed");
});
$('.subMachine .settings').click(function() {
	$(this).parent().parent().parent().parent().toggleClass("flip");
});
$( "#wrapper" ).on( "mouseover", function() {
	$('.submachine').removeClass("flip");
} );
}

function populateSelector(selector, kind){
	$.each(itemCounter, function(type){
		$.each(items, function(id, item) {
			if(kind == "alcheminder" && item[type] && item.type == "pure" && item.subtype != "alchemified" && item.idea){
				$(selector).append($("<option /> ").val(id).text(item[type]));
			}
			if(kind == "alchematter" && item[type] && item.type == "pure" && item.subtype != "alchemified" && item.thing){
				$(selector).append($("<option />").val(id).text(item[type]));
			}
			if(kind == "alchemizer" && item[type] && item.type == "pure" && item.subtype != "alchemified"){
				$(selector).append($("<option />").val(id).text(item[type]));
			}
			if(kind == "alchemaxer" && item[type] && item.type == "pure" && item.subtype == "alchemified"){
				$(selector).append($("<option />").val(id).text(item[type]));
			}
			if(kind == "all" && item[type] && item.type == "pure"){
				$(selector).append($("<option />").val(id).text(item[type]));
			}
		});
	});
}

/* GENERATORS */

function updatePowerCounter(token){
	$('.subMachine.'+token+' .info').html(Math.floor(power[token]));
	if (power[token] > 0){	
		$('.item.'+token+' .rate').show();
		$('.item.'+token+' .rate .number').html(Math.floor(power[token]));
	} else {
		$('.item.'+token+' .rate').hide();	
	}
}

function updateFuelGaugeCounter(token){
	var fuelPercent = fuelGauge[token] / fuelGaugeSize[token] * 100;
	$('.subMachine.'+token+' .fuel').html(fuelGauge[token]);
	$('.subMachine.'+token+' .gauge').html(fuelGaugeSize[token]);
	$('.subMachine.'+token+' .fuelDraw').css("width", fuelPercent + "%");
}

function powerIncrease(token){
	addFuel(token, fuelCost[token][1], fuelCost[token][2], fuelCost[token][0]);
}

function addFuel(token, typeCost, tokenCost, amount){
	if (fuelGauge[token] + amount < fuelGaugeSize[token] && pay(typeCost, tokenCost, amount) == true){
		fuelGauge[token] = fuelGauge[token] + amount;
		updateFuelGaugeCounter(token);
	}
}

function spendFuel(token){
	setInterval(function(){
		if(fuelGauge[token] > 0){
			fuelGauge[token]--;
			power[token] = fuelGauge[token]*10;
			updateFuelGaugeCounter(token);
			updatePowerCounter(token);
		}
	}, 1000) 
}

function autoIncrease(){
	acquire("ideas", "mind", power.mind);
	acquire("things", "matter", power.matter);
	acquire("ideas", "strength", power.strength);
	acquire("ideas", "will", power.will);
}

function logClear(){
	$('.item.logMessage.inactive').fadeOut(300, function() { $(this).remove(); });
}

function loop(){
	setInterval(function(){
		autoIncrease();
		getLucky();
	}, 1000)
	setInterval(function(){
		logClear();
	}, 10000)

}

function impureStatus(){
	$.each(impureItems, function(type, types){
		$.each(types, function(id, item){
			if (window[type][item] == 0){
				$('.item.'+type+'.'+item).fadeOut();
			} else {
				$('.item.'+type+'.'+item).show();	
			}
		})
	});
}

/* ALCHEMY */

function recipe(...ingredients) {
	for (const [itemKey, item] of Object.entries(items)) {
		if (
			item.subtype == "alchemified" &&
			ingredients.every(ingredient => item.ingredients.includes(ingredient))
			) {
			return itemKey
	}
}
}

function alchemy(item){
	if (items[item].subtype == "alchemified"){
		if(pay(evalType(items[item].ingredients[0]), items[item].ingredients[0], power.alchemy) && pay(evalType(items[item].ingredients[1]), items[item].ingredients[1], power.alchemy) && pay("dusts", alchemyDust(item), power.alchemy*10)){
			acquire(evalType(item), item, power.alchemy)
			logMessage("alchemize");
		}
	}
}

function alchemyDust(item){
	if(evalType(items[item].ingredients[0]) == "ideas" && evalType(items[item].ingredients[1]) == "things"){
		return "reify";
	}
	if(evalType(items[item].ingredients[0]) == "ideas" && evalType(items[item].ingredients[1]) == "ideas"){
		return "mentalize";
	}
	if((evalType(items[item].ingredients[0]) == "ideas" && evalType(items[item].ingredients[1]) == "things") || (evalType(items[item].ingredients[0]) == "things" && evalType(items[item].ingredients[1]) == "ideas")){
		return "purify";
	}
}

function separate(){
	if(pay("things", "matter", 400)){
		acquire("things", "fire", 1)
		acquire("things", "water", 1)
		acquire("things", "air", 1)
		acquire("things", "earth", 1)
		logMessage('separate');
	}
}

function destroy(thing){
	if(pay(evalType(thing), thing, 1)){
		logMessage("destroy");
	}
}

function getLucky(){
	let shamrock = Math.random();
	if (shamrock <= 0.001){
		logMessage("luck");
	}
}

function purify(id, amount){
	if (pay("ideas", "recursion", amount) && pay("ideas", id, amount) == true){

		if (amount < 100){
			for (var i = 0; i < amount; i++) {
				logMessage("purify");
			}
		} else {
			logMessageTooMany("purify");
		}
		acquire("ideas", items[id].purified, amount)

		if (id == "purify") {
			acquire("ideas", "recursion", 10000)
		}
	}
}

/* MAX */

function purifyMax(){
	$.each(ideas, function(id, amount){
		if(amount > 0 && items[id].type == "impure"){
			purify(id, amount);
	}
});
}

	function reifyMax(){
		$.each(ideas, function(id, amount){
			if(amount > 0 && items[id].type == "impure" && items[id].rarity != "unique"){
				reify(id, amount);
	}
});
}

function pulverizeMax(){
	$.each(things, function(id, amount){
		if(amount > 0 && items[id].type == "impure"){
			pulverize(id, amount);
}
});
}

function mentalizeMax(){
	$.each(items, function(id, name){
		amount = $('.logMessage.active.'+id).length;
		if(amount > 0){
			mentalize(id, null, amount);
}
$('.logMessage.active.'+id+' .button').remove();
$('.logMessage.active.'+id).addClass("inactive").removeClass("active");
activeLogCounter = activeLogCounter - amount;
});
}

/* ITEMS */

function buildAllItems(){
	itemCounter = {
		idea: ideas,
		thing: things,
		dust: dusts,
		liquid: liquids
	}
	$.each(itemCounter, function(key, type){
		$.each(type, function(id){
			if(type[id] != 0){
				itemBuild(key+'s', id);
				itemUnlock[key+'s'][id] = "unlocked";
			}
		});
	});
}

function pay(type, token, price){
	if (window[type][token] >= price){
		window[type][token] = window[type][token] - price;
		updateCounter(type, token);
		return true;
	} else {
		return false;
	}
}

function acquire(type, item, amount){
	if ($('.item.'+type+'.'+item).length == 0){
		itemUnlock[type][item] = "unlocked";
		itemBuild(type, item);
	}

	window[type][item] = window[type][item] + amount;
	updateCounter(type, item);
}

function itemBuild(type, id){
	if (type != "dusts" && type != "liquids"){
		append = '#'+type+' #'+items[id].type;
	} else if (type == "dusts"){
		append = '#things #dusts'
	} else if (type == "liquids"){
		append = '#things #liquids'
	}
	$(append).append('<div class="item '+type+' '+id+'"><span class="name">' + items[id][type.slice(0, -1)] + ' </span><span class="counter"><span class="rate" style="display:none">+<span class="number"></span>/s</span> <span class="amount"></span></span></div>');
	if (items[id].type == "impure" && type != "dusts"  && type != "liquids" && items[id].rarity != "unique"){
		button('.'+type+'.' + id, id, nextAction[type]);
	}
	updateCounter(type, id);
}

function buyable(id){
	if (pay(buyables[id].cost[1], buyables[id].cost[2], buyables[id].cost[0]) == true){
		if (buyables[id].class == "unlock"){
			$('.buyable.'+id).hide();
			logMessage("unlock");
			buyableStatus[id] = "unlocked";

			if(buyables[id].subclass == "submachine"){
				$('#'+buyables[id].unlocks).show();
			}

			if (id == "mentAllUnlock"){
				button("#log .header .buttons", null, "mentAll")
				$(".button.mentAll").append('<span class="counter"> (<span class="number">'+activeLogCounter+'</span>)</span>')
			}
			if (id == "reifyMaxUnlock"){
				button("#ideas .header .buttons", null, "reifyMax")
			}
			if (id == "pulverizeMaxUnlock"){
				button("#things .header .buttons", null, "pulverizeMax")
			}
			if (id == "mentalizeMaxUnlock"){
				button("#log .header .buttons", null, "mentalizeMax")
			}
			if (id == "purifyMaxUnlock"){
				button("#ideas .header .buttons", null, "purifyMax")
			}
			if (id == "autoMentalizeUnlock"){
				clicker("#log .header .buttons", "autoMentalize", "mentalize")
			}
			if (id == "autoPurifyUnlock"){
				clicker("#ideas .header .buttons", "autoPurify", "purify")
			}	
			if (id == "autoReifyUnlock"){
				clicker("#ideas .header .buttons", "autoReify", "reify")
			}	
			if (id == "autoPulverizeUnlock"){
				clicker("#things .header .buttons", "autoPulverize", "pulverize")
			}	

		} else if (buyables[id].class == "conv"){
			acquire(buyables[id].effect[1], buyables[id].effect[2], buyables[id].effect[0]);
		}
	}
}

function unlockMachine(id){
	if (window[items[id].machineCostA[1]][items[id].machineCostA[2]]>= items[id].machineCostA[0] && window[items[id].machineCostB[1]][items[id].machineCostB[2]]>= items[id].machineCostB[0] ){
		pay(items[id].machineCostA[1], items[id].machineCostA[2], items[id].machineCostA[0]);
		pay(items[id].machineCostB[1], items[id].machineCostB[2], items[id].machineCostB[0]);
		$('.machineUnlock.'+id).hide();
		$('.machine.'+id).show();
		machineStatus[id] = "unlocked";
		logMessage("machineU");
	}
}

function logMessage(id){
	logCount++;
	activeLogCounter++;
	updateActiveLogCounter();
	$('#log .content').prepend('<div class="item logMessage '+ id +' logCount-'+logCount+' active"><span class="count">'+logCount+' </span><span class="name">'+ actions[id].log+'</span></div>');
	button('.logCount-' + logCount, id, "mentalize");
}

function logMessageTooMany(id){
	logCount++;
	activeLogCounter++;
	updateActiveLogCounter();
	$('#log .content').prepend('<div class="item logMessage '+ id +' logCount-'+logCount+' active"><span class="count">'+logCount+' </span><span class="name">'+ actions[id].logTooMany+'</span></div>');
	button('.logCount-' + logCount, id, "mentalize");
}

function mentalize(id, instance, amount){
	if(showStatus.ideas == "locked"){
		showStatus.ideas = "unlocked"
		$('#ideas').fadeIn();
	}
	if (pay("ideas", "mind", amount) == true){
		logMessage("mentalize");
		acquire("ideas", id, amount);

		$(instance + " .button").remove();
		$(instance).addClass("inactive").removeClass("active");
		activeLogCounter--;
		updateActiveLogCounter();
		if (id == "mentalize") {
			acquire("ideas", "recursion", 1)
		}
	}
}

function reify(id, amount){
	if(showStatus.things == "locked"){
		showStatus.things = "unlocked"
		$('#things').fadeIn();
	}
	if (pay("things", "matter", amount) && pay("ideas", id, amount) == true){
		
		if (amount < 100){
			for (var i = 0; i < amount; i++) {
				logMessage("reify");
			}
		} else {
			logMessageTooMany("reify");
		}
		acquire("things", id, amount)
		if (id == "reify") {
			acquire("ideas", "recursion", 10)
		}
	}
}

function pulverize(id, amount){
	if (showStatus.machines == "locked"){
		showStatus.machines = "unlocked";
		$('#machines').delay(2000).fadeIn();;
	}

	if (pay("ideas", "strength", amount) && pay("things", id, amount) == true){
		if (amount < 100){
			for (var i = 0; i < amount; i++) {
				logMessage("pulverize");
			}
		} else {
			logMessageTooMany("pulverize");
		}
		acquire("dusts", id, amount)		
		if (id == "pulverize") {
			acquire("ideas", "recursion", 100)
		}
	}
}

function mentalizeAll(){
	var counter = $('.logMessage.active').not('.machineU').not('.unlock').length;
	if (counter > 0 && counter <= ideas.mind){
		$('.logMessage.active .button').not('.machineU .button').not('.unlock .button').remove();
		$('.logMessage.active').not('.machineU').not('unlock').addClass("inactive").removeClass("active");
		pay("ideas", "mind", counter)
		acquire("ideas", "idealSubstance", counter)
		logMessage("mentAll");
		activeLogCounter = activeLogCounter - counter;
		updateActiveLogCounter();
	}
}

function button(appendTo, itemType, buttonType){
	$(appendTo).append('<div class="button '+buttonType+'">'+buttons[buttonType].label+'</div></div>')
	$(appendTo + ' .button').on( "click", function() {
		if(buttons[buttonType].action == "want"){
			logMessage("want");
	if(showStatus.log == "locked"){
		showStatus.log = "unlocked"
		$('#log').fadeIn();
	}
}
if(buttons[buttonType].action == "mentalize"){
	mentalize(itemType, appendTo, 1);
}
if(buttons[buttonType].action == "reify"){
	reify(itemType, 1);
}
if(buttons[buttonType].action == "pulverize"){
	pulverize(itemType, 1);
}
if(buttons[buttonType].action == "mentalizeAll"){
	mentalizeAll();
}
if(buttons[buttonType].action == "reifyMax"){
	reifyMax();
}
if(buttons[buttonType].action == "pulverizeMax"){
	pulverizeMax();
}
if(buttons[buttonType].action == "mentalizeMax"){
	mentalizeMax();
}
if(buttons[buttonType].action == "purifyMax"){
	purifyMax();
}
impureStatus();
});
}

function updateCounter(type, id){
	$('.'+type+'.'+id+' .counter .amount').html(Math.floor(window[type][id]));
}

function updateActiveLogCounter(){
	$('.mentAll .counter .number').html(Math.floor(activeLogCounter));
};

$(document).bind('keydown', function (event) {
	if (event.key == "f") {
		logMessage("respect");
	}
});
const baseRate = { mind: 0.3, matter: 0.3, strength: 0.3 };

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
		$('.clicker.'+token).off("click").on("click", function() {
			if(clickerStatus[token] == "on"){
				autoClickerPower(token, "off");
			} else if (clickerStatus[token] == "off"){
				autoClickerPower(token, "on");
			}
		});
	});
}

function clicker(appendTo, buttonType, type){
	if ($(appendTo + ' .clicker.' + buttonType).length > 0) return;
	clickStatus();
	$(appendTo).append('<div class="clicker button off '+buttonType+' '+type+'" data-btn-type="'+buttonType+'" data-item-type="">'+buttons[buttonType].label+'</div></div>')
	clickStatus();
}

function totalImpureIdeas(){
	let total = 0;
	$.each(ideas, function(id, amount){
		if(amount > 0 && items[id] && items[id].type == "impure" && items[id].rarity != "unique"){
			total = total + amount;
		}
	});
	return total;
}

function totalImpureThings(){
	let total = 0;
	$.each(things, function(id, amount){
		if(amount > 0 && items[id] && items[id].type == "impure"){
			total = total + amount;
		}
	});
	return total;
}

function autoClicker(token){
	let willBudget = Math.floor(ideas.will);
	if (willBudget <= 0) return;
	if (token == "reify"){
		let cost = Math.min(totalImpureIdeas(), things.matter, willBudget);
		if (cost > 0 && pay("ideas", "will", cost)){
			reifyMax();
		}
	}
	if (token == "pulverize"){
		let cost = Math.min(totalImpureThings(), willBudget);
		if (cost > 0 && pay("ideas", "will", cost)){
			pulverizeMax();
		}
	}
	if (token == "mentalize"){
		let cost = Math.min(activeLogCounter, willBudget);
		if (cost > 0 && pay("ideas", "will", cost)){
			mentalizeMax();
		}
	}
	if (token == "purify"){
		let cost = Math.min(totalImpureIdeas(), willBudget);
		if (cost > 0 && pay("ideas", "will", cost)){
			purifyMax();
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
		if(!items[item]) return undefined;
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
		if(buyables[id].subclass == "finalMachine"){
			unlockFinalMachine(buyables[id].unlocks);
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
			<div class="cost"><span class="${items[token].machineCostA[2]}"><span class="cost-number" data-type="${items[token].machineCostA[1]}" data-id="${items[token].machineCostA[2]}" data-amount="${items[token].machineCostA[0]}">${items[token].machineCostA[0]}</span> ${items[items[token].machineCostA[2]][items[token].machineCostA[1].slice(0, -1)]}</span>, <span class="${items[token].machineCostB[2]}"><span class="cost-number" data-type="${items[token].machineCostB[1]}" data-id="${items[token].machineCostB[2]}" data-amount="${items[token].machineCostB[0]}">${items[token].machineCostB[0]}</span> ${items[items[token].machineCostB[2]][items[token].machineCostB[1].slice(0, -1)]}</span></div></div>
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
			$('.machine.'+token+' .strip.small').append('<div id="'+buyable+'" class="tile small buyable '+buyable+'"><span class="name '+buyables[buyable].effect[2]+'">+'+buyables[buyable].effect[0]+' '+items[buyables[buyable].effect[2]][buyables[buyable].effect[1].slice(0, -1)]+'</span><span class="cost '+buyables[buyable].cost[2]+'"><span class="cost-number">'+buyables[buyable].cost[0]+'</span> '+items[buyables[buyable].cost[2]][buyables[buyable].cost[1].slice(0, -1)]+'</span></div>');
		} else if (buyables[buyable].class == "unlock") {
			$('.machine.'+token+' .strip.big').append('<div id="'+buyable+'" class="tile buyable '+buyable+'"><span class="name">'+buyables[buyable].name+'</span><span class="cost '+buyables[buyable].cost[2]+'"><span class="cost-number">'+buyables[buyable].cost[0]+'</span> '+items[buyables[buyable].cost[2]][buyables[buyable].cost[1].slice(0, -1)]+'</span></div>');
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
			var fixedDust = sub == "alcheminder" ? "mentalize" : sub == "alchematter" ? "pulverize" : sub == "alchemaxer" ? "alchemize" : "purify";
			$(`.subMachine#${sub} .machinery`).append(`
				<div class="selectors"><div id="selector1" class="selector custom-select"><div class="selected">---</div><div class="options"></div></div> + <div id="selector2" class="selector custom-select"><div class="selected">---</div><div class="options"></div></div></div>
				<div id="result">???</div>
				<div class="alchemy-dust-gauge ${fixedDust}" data-dust-type="${fixedDust}">
					<span class="dust-name ${fixedDust}">${items[fixedDust].dust}</span> <span class="fuel">${alchemyDustGauge[fixedDust]}</span>/<span class="gauge">${alchemyDustGaugeSize}</span>
					<div class="gaugeDraw"><div class="fuelDraw"></div></div>
					<div class="button addAlchemyDust small">+10</div>
				</div>
				<div id="alchemize" class="button"><span id="text">Can't Create</span></div>`);
			updateAlchemyDustGauge(sub, fixedDust);
			if(sub == "alchemizer"){
				populateSelector(`#${sub} #selector1`, sub, "idea");
				populateSelector(`#${sub} #selector2`, sub, "thing");
			} else {
				populateSelector(`#${sub} #selector1`, sub);
				populateSelector(`#${sub} #selector2`, sub);
			}
			$(`#${sub}`).on("customchange", ".selector", function() {
				let rec = recipe($(`#${sub} #selector1`).data('value'), $(`#${sub} #selector2`).data('value'));
				if(rec){
					let resultName = isNameKnown(rec) ? items[rec][evalType(rec).slice(0, -1)] : "Something...";
					$(`#${sub} #result`).html(resultName)
					$(`#${sub} #result`).removeClass().addClass(rec)
					let canAfford = canAlchemize(rec);
					if(canAfford){
						$(`#${sub} #alchemize #text`).html('Create '+power.alchemy);
						$(`#${sub} #alchemize #text`).removeClass().addClass(rec);
					} else {
						$(`#${sub} #alchemize #text`).removeClass().html("Can't Create");
					}
				} else {
					$(`#${sub} #result`).removeClass().html("???")
					$(`#${sub} #alchemize #text`).removeClass().html("Can't Create");
				}
			} );

			$(`#${sub} .addAlchemyDust`).on("click", function(){
				if (alchemyDustGauge[fixedDust] + 10 <= alchemyDustGaugeSize && pay("dusts", fixedDust, 10)) {
					alchemyDustGauge[fixedDust] += 10;
					updateAlchemyDustGauge(sub, fixedDust);
				}
			});

			$(`#${sub} #alchemize`).on("click", function(){
				alchemy(recipe($(`#${sub} #selector1`).data('value'), $(`#${sub} #selector2`).data('value')))
				updateAlchemyDustGauge(sub, fixedDust);
			})
		} else if(subMachines[sub].class == "separator") {
			$(`.subMachine#${sub} .machinery`).append(`
			<div class="text">Separate 400 <span class="matter">Matter</span> into</div>
			<div class="text">1 <span class="fire">Fire</span>, 1 <span class="water">Water</span>,<br/> 1 <span class="earth">Earth</span>, 1 <span class="air">Air</span></div>
			<div id="separate" class="button"><span id="text">Separate</span></div>`);
			$('#separate').on("click", function(){
				separate();
			})

		} else if(subMachines[sub].class == "distillery") {
			$(`.subMachine#${sub} .machinery`).append(`
			<div class="selectors"><div id="selector1" class="selector custom-select"><div class="selected">---</div><div class="options"></div></div> + <div id="selector2" class="selector custom-select"><div class="selected">---</div><div class="options"></div></div></div>
			<div id="result">???</div>
			<div class="distillery-gauge"><span class="water">W</span> <span class="fuel"></span>/<span class="gauge"></span> <div class="gaugeDraw"><div class="fuelDraw"></div></div> <div class="button addWater water small">+10</div></div>
			<div id="distill" class="button"><span id="text">Can't Distill</span></div>`);
			populateSelector(`#${sub} #selector1`, "dust");
			populateSelector(`#${sub} #selector2`, "dust");

			updateDistilleryGauge();

			$(`#${sub} .addWater`).on("click", function(){
				if(distilleryGauge.water + 10 <= distilleryGaugeSize && pay("things", "water", 10)){
					distilleryGauge.water += 10;
					updateDistilleryGauge();
				}
			});

			$(`#${sub}`).on("customchange", ".selector", function() {
				let rec = distillRecipe($(`#${sub} #selector1`).data('value'), $(`#${sub} #selector2`).data('value'));
				if(rec){
					$(`#${sub} #result`).html(items[rec].liquid).removeClass().addClass(rec);
					$(`#${sub} #distill #text`).html('Distill').removeClass().addClass(rec);
				} else {
					$(`#${sub} #result`).removeClass().html("???");
					$(`#${sub} #distill #text`).removeClass().html("Can't Distill");
				}
			});

			$(`#${sub} #distill`).on("click", function(){
				let rec = distillRecipe($(`#${sub} #selector1`).data('value'), $(`#${sub} #selector2`).data('value'));
				if(rec) distill(rec);
			});

		} else if(subMachines[sub].class == "forge") {
			$(`.subMachine#${sub} .machinery`).append('<div class="selectors forge-selectors"><div id="selector1" class="selector custom-select"><div class="selected">---</div><div class="options"></div></div> + <div id="selector2" class="selector custom-select"><div class="selected">---</div><div class="options"></div></div> + <div id="selector3" class="selector custom-select"><div class="selected">---</div><div class="options"></div></div></div><div id="result">???</div><div id="forge" class="button"><span id="text">Can\'t Forge</span></div>');
			if(sub == "fleshForge"){
				populateSelector(`#${sub} #selector1`, "forgeThingT2");
				populateSelector(`#${sub} #selector2`, "forgeThingT2");
				populateSelector(`#${sub} #selector3`, "forgeThingT2");
			} else if(sub == "soulForge"){
				populateSelector(`#${sub} #selector1`, "forgeIdea");
				populateSelector(`#${sub} #selector2`, "forgeIdea");
				populateSelector(`#${sub} #selector3`, "forgeSoulAny");
			} else if(sub == "lifeForge"){
				populateSelector(`#${sub} #selector1`, "forgeIdeaT1");
				populateSelector(`#${sub} #selector2`, "forgeIdeaT1");
				populateSelector(`#${sub} #selector3`, "forgeIdeaT1");
			} else {
				populateSelector(`#${sub} #selector1`, "forgeIdea");
				populateSelector(`#${sub} #selector2`, "forgeIdea");
				populateSelector(`#${sub} #selector3`, "forgeThing");
			}

			$(`#${sub}`).on("customchange", ".selector", function() {
				let rec = recipe($(`#${sub} #selector1`).data('value'), $(`#${sub} #selector2`).data('value'), $(`#${sub} #selector3`).data('value'));
				if(rec){
					let resultName = isNameKnown(rec) ? items[rec][evalType(rec).slice(0, -1)] : "Something...";
					$(`#${sub} #result`).html(resultName).removeClass().addClass(rec);
					$(`#${sub} #forge #text`).html('Forge').removeClass().addClass(rec);
				} else {
					$(`#${sub} #result`).removeClass().html("???");
					$(`#${sub} #forge #text`).removeClass().html("Can't Forge");
				}
			});

			$(`#${sub} #forge`).on("click", function(){
				let rec = recipe($(`#${sub} #selector1`).data('value'), $(`#${sub} #selector2`).data('value'), $(`#${sub} #selector3`).data('value'));
				if(rec) forge(rec);
			});

		} else if(subMachines[sub].class == "destructor") {
			$(`.subMachine#${sub} .machinery`).append(`
			<div class="selectors text">Destroy 1 <div id="selector" class="selector custom-select inline"><div class="selected">---</div><div class="options"></div></div></div><br/>
			<div id="destroy" class="button"><span id="text">Destroy</span></div>`);
			populateSelector(`#${sub} #selector`, "all");

			$('#destroy').on("click", function(){
				destroy($(`#${sub} #selector`).data('value'));
			})
		} else if(subMachines[sub].class == "oracle") {
			$(`.subMachine#${sub} .machinery`).append(`
			<div class="selectors text">Study <div id="selector" class="selector custom-select inline"><div class="selected">---</div><div class="options"></div></div></div>
			<div id="oracleResult" class="oracle-result">???</div>
			<div class="oracle-gauge"><span class="mentalize">${items.mentalize.dust}</span> <span class="fuel">${oracleGauge.mentalize}</span>/<span class="gauge">${oracleGaugeSize}</span> <div class="gaugeDraw"><div class="fuelDraw"></div></div> <div class="button addOracleFuel mentalize small">+5</div></div>
			<div id="consult" class="button"><span id="text">Can't Study</span></div>`);
			populateSelector(`#${sub} #selector`, "oracle");

			updateOracleGauge();

			$(`#${sub} .addOracleFuel`).on("click", function(){
				if(oracleGauge.mentalize + 5 <= oracleGaugeSize && pay("dusts", "mentalize", 5)){
					oracleGauge.mentalize += 5;
					updateOracleGauge();
				}
			});

			$(`#${sub}`).on("customchange", ".selector", function() {
				let selected = $(`#${sub} #selector`).data('value');
				if(selected && canStudy(selected)){
					$(`#${sub} #consult #text`).html('Study');
				} else {
					$(`#${sub} #consult #text`).html("Can't Study");
				}
			});

			$(`#${sub} #consult`).on("click", function(){
				let selected = $(`#${sub} #selector`).data('value');
				if(selected && canStudy(selected)) consult(selected);
			});
		}
});

$('.subMachine .collapse').click(function() {
	$(this).parent().parent().parent().parent().toggleClass("collapsed");
});
$('.machine.box').on('mouseenter', function() {
	if (!$(this).hasClass('dropdown-open')) {
		closeAllDropdowns();
	}
});
$('.subMachine .settings').click(function() {
	$(this).parent().parent().parent().parent().toggleClass("flip");
});
$( "#wrapper" ).on( "mouseover", function() {
	$('.submachine').removeClass("flip");
} );
}

function selectorPlaceholder(kind){
	if(kind == "alcheminder") return "Idea...";
	if(kind == "alchematter") return "Thing...";
	if(kind == "alchemizer") return "Item...";
	if(kind == "alchemaxer") return "Item...";
	if(kind == "all") return "Item...";
	if(kind == "dust") return "Dust...";
	if(kind == "forgeIdea") return "Idea...";
	if(kind == "forgeThing") return "Thing...";
	if(kind == "forgeSoulAny") return "Item...";
	if(kind == "forgeThingT2") return "Thing...";
	if(kind == "forgeIdeaT1") return "Idea...";
	if(kind == "oracle") return "Element...";
	if(kind == "enminderEssence") return "Mind Essence...";
	if(kind == "ensoulerEssence") return "Soul Essence...";
	return "---";
}

function itemMatchesSelector(id, item, type, kind){
	if(kind == "alcheminder" && item[type] && item.type == "pure" && item.subtype != "alchemified" && item.idea && isNameSeen(id)) return true;
	if(kind == "alchematter" && item[type] && item.type == "pure" && item.subtype != "alchemified" && item.thing && isNameSeen(id)) return true;
	if(kind == "alchemizer" && item[type] && item.type == "pure" && item.subtype != "alchemified" && isNameSeen(id)) return true;
	if(kind == "alchemaxer" && item[type] && item.type == "pure" && item.subtype == "alchemified" && isNameSeen(id)) return true;
	if(kind == "all" && item[type] && item.type == "pure" && isNameSeen(id)) return true;
	if(kind == "dust" && type == "dust" && item.dust && item.type == "impure") return true;
	if(kind == "forgeIdea" && type == "idea" && item.idea && item.type == "pure" && item.subtype == "alchemified" && isAlchemyTier(id) == 2) return true;
	if(kind == "forgeThing" && type == "thing" && item.thing && item.type == "pure" && isForgeThirdSlot(id)) return true;
	if(kind == "forgeSoulAny" && (type == "idea" || type == "thing") && item[type] && item.type == "pure" && isForgeThirdSlot(id)) return true;
	if(kind == "forgeThingT2" && type == "thing" && item.thing && item.type == "pure" && item.subtype == "alchemified" && isAlchemyTier(id) == 2 && isForgeIngredient(id)) return true;
	if(kind == "forgeIdeaT1" && type == "idea" && item.idea && item.type == "pure" && item.subtype == "alchemified" && isAlchemyTier(id) == 1) return true;
	if(kind == "enminderEssence" && type == "idea" && item.idea && id.includes("MindEssence")) return true;
	if(kind == "ensoulerEssence" && type == "idea" && item.idea && id.includes("SoulEssence")) return true;
	if(kind == "oracle" && item[type] && item.type == "pure" && isNameSeen(id)) return true;
	return false;
}

function populateSelector(selector, kind, category){
	let $sel = $(selector);
	let placeholder = selectorPlaceholder(kind);
	$sel.data('value', '').data('kind', kind).data('category', category || '');
	$sel.find('.selected').removeClass().addClass('selected placeholder').text(placeholder);
	$.each(itemCounter, function(type){
		if(category && type != category) return;
		$.each(items, function(id, item) {
			if(itemMatchesSelector(id, item, type, kind)){
				$sel.find('.options').append($('<div class="option"/>').attr('data-value', id).addClass(id).text(item[type]));
			}
		});
	});
	let $opts = $sel.find('.options');
	$opts.data('parent', $sel);
	$sel.find('.selected').on('click', function(e){
		e.stopPropagation();
		closeAllDropdowns();
		let rect = this.getBoundingClientRect();
		$opts.detach().appendTo('body');
		$opts.css({ left: rect.left + 'px', bottom: (window.innerHeight - rect.top) + 'px' });
		$opts.addClass('open');
		$sel.closest('.machine.box').addClass('dropdown-open');
	});
}

function closeAllDropdowns(){
	$('.machine.box').removeClass('dropdown-open');
	$('body > .options.open').each(function(){
		let $opts = $(this);
		let $sel = $opts.data('parent');
		$opts.removeClass('open').detach().appendTo($sel);
	});
}

$(document).on('click', '.options .option', function(e){
	e.stopPropagation();
	let $opt = $(this);
	let $opts = $opt.parent();
	let $sel = $opts.data('parent');
	let val = $opt.data('value');
	let text = $opt.text();
	let cls = $opt.attr('class').replace('option','').trim();
	$sel.data('value', val);
	$sel.find('.selected').removeClass().addClass('selected ' + cls).text(text);
	closeAllDropdowns();
	$sel.trigger('customchange');
});

$(document).on('click', function(){
	closeAllDropdowns();
});

/* GENERATORS */

function updatePowerCounter(token){
	var base = (showStatus && showStatus.log == "unlocked" && baseRate[token] !== undefined) ? baseRate[token] : 0;
	var total = power[token] + base;
	$('.subMachine.'+token+' .info').html(Math.floor(power[token]));
	if (total > 0){
		$('.item.'+token+' .rate').show();
		$('.item.'+token+' .rate .number').html(Number.isInteger(total) ? total : total.toFixed(1));
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
	if (showStatus.log == "unlocked") {
		acquire("ideas", "mind", 0.3);
		acquire("things", "matter", 0.3);
		acquire("ideas", "strength", 0.3);
	}
	acquire("ideas", "mind", power.mind);
	acquire("things", "matter", power.matter);
	acquire("ideas", "strength", power.strength);
	if (power.will > 0) acquire("ideas", "will", power.will);
}

function logClear(){
	$('.item.logMessage.inactive').fadeOut(300, function() { $(this).remove(); });
	logEntries = logEntries.filter(function(e) { return e.active; });
}

function rebuildLog(){
	if (!logEntries || !logEntries.length) return;
	activeLogCounter = 0;
	for (var i = 0; i < logEntries.length; i++) {
		var e = logEntries[i];
		var text = e.tooMany ? actions[e.id].logTooMany : actions[e.id].log;
		var cls = e.active ? "active" : "inactive";
		$('#log .content').append('<div class="item logMessage '+ e.id +' logCount-'+e.count+' '+cls+'"><span class="count">'+e.count+' </span><span class="name">'+ text +'</span></div>');
		if (e.active) {
			button('.logCount-' + e.count, e.id, "mentalize");
			activeLogCounter++;
		}
	}
	updateActiveLogCounter();
}

function updateBuyableAffordability(){
	$.each(buyables, function(id, b){
		if (buyableStatus[id] === 'unlocked') return;
		var el = $('#' + id);
		if (!el.length) return;
		var canAfford = window[b.cost[1]][b.cost[2]] >= b.cost[0];
		el.find('.cost-number').toggleClass('cant-afford', !canAfford);
		el.toggleClass('cant-afford', !canAfford);
	});
	$('.machineUnlock:visible').each(function(){
		var $unlock = $(this);
		var allAfford = true;
		$unlock.find('.cost-number').each(function(){
			var $el = $(this);
			var type = $el.data('type');
			var id = $el.data('id');
			var amount = $el.data('amount');
			var canAfford = window[type][id] >= amount;
			$el.toggleClass('cant-afford', !canAfford);
			$el.parent().toggleClass('cant-afford', !canAfford);
			if (!canAfford) allAfford = false;
		});
		$unlock.toggleClass('cant-afford', !allAfford);
	});
}

function loop(){
	setInterval(function(){
		autoIncrease();
		getLucky();
		updateBuyableAffordability();
	}, 1000)
	setInterval(function(){
		logClear();
	}, 10000)
	setInterval(function(){
		updateLocalStorage();
	}, 30000)
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
	let sorted = [...ingredients].sort();
	for (const [itemKey, item] of Object.entries(items)) {
		if (item.subtype == "alchemified" && item.ingredients.length == sorted.length) {
			let itemSorted = [...item.ingredients].sort();
			if (sorted.every((val, idx) => val === itemSorted[idx])) {
				return itemKey;
			}
		}
	}
}

function canAlchemize(item){
	if (!item || !items[item] || items[item].subtype != "alchemified") return false;
	var ing0Type = evalType(items[item].ingredients[0]);
	var ing1Type = evalType(items[item].ingredients[1]);
	var dust = alchemyDust(item);
	var dustCost = power.alchemy * 10;
	return window[ing0Type][items[item].ingredients[0]] >= power.alchemy &&
		window[ing1Type][items[item].ingredients[1]] >= power.alchemy &&
		alchemyDustGauge[dust] >= dustCost;
}

function alchemy(item){
	if (!item || !items[item]) return;
	if (items[item].subtype == "alchemified"){
		var ing0Type = evalType(items[item].ingredients[0]);
		var ing1Type = evalType(items[item].ingredients[1]);
		var dust = alchemyDust(item);
		var dustCost = power.alchemy * 10;
		if (window[ing0Type][items[item].ingredients[0]] >= power.alchemy &&
			window[ing1Type][items[item].ingredients[1]] >= power.alchemy &&
			alchemyDustGauge[dust] >= dustCost){
			pay(ing0Type, items[item].ingredients[0], power.alchemy);
			pay(ing1Type, items[item].ingredients[1], power.alchemy);
			alchemyDustGauge[dust] -= dustCost;
			acquire(evalType(item), item, power.alchemy)
			logMessage("alchemize");
		}
	}
}

function alchemyDust(item){
	var ing0 = items[item].ingredients[0];
	var ing1 = items[item].ingredients[1];
	if(items[ing0].subtype == "alchemified" || items[ing1].subtype == "alchemified") return "alchemize";
	var type0 = evalType(ing0);
	var type1 = evalType(ing1);
	if(type0 == "ideas" && type1 == "ideas") return "mentalize";
	if(type0 == "things" && type1 == "things") return "pulverize";
	return "purify";
}

/* ORACLE */

function seeName(id){
	if(seenNames[id]) return;
	seenNames[id] = true;
	// add newly seen items to all matching selectors
	let item = items[id];
	if(!item) return;
	$.each(itemCounter, function(type){
		if(!item[type]) return;
		let name = item[type];
		$('.selector.custom-select').each(function(){
			let $sel = $(this);
			let kind = $sel.data('kind');
			let category = $sel.data('category');
			if(!kind) return;
			if(category && type != category) return;
			if(!itemMatchesSelector(id, item, type, kind)) return;
			let $opts = $sel.find('.options');
			let $bodyOpts = $('body > .options').filter(function(){ return $(this).data('parent') && $(this).data('parent')[0] === $sel[0]; });
			let $allOpts = $opts.add($bodyOpts);
			$allOpts.each(function(){
				if($(this).find(`.option[data-value="${id}"]`).length == 0){
					$(this).append($('<div class="option"/>').attr('data-value', id).addClass(id).text(name));
				}
			});
		});
	});
}

function seedSeenNames(){
	// mark acquired items as seen
	$.each(itemUnlock, function(type, ids){
		$.each(ids, function(id, status){
			if(status == "unlocked") seeName(id);
		});
	});
}

function isCostItem(id){
	var found = false;
	$.each(buyables, function(bId, b){
		if(b.cost && b.cost[2] === id){ found = true; return false; }
	});
	return found;
}

function isNameSeen(id){
	return !!seenNames[id] || isCostItem(id);
}

function isNameKnown(id){
	return !!seenNames[id];
}

function findPairings(element){
	let pairings = [];
	$.each(items, function(key, item){
		if(item.subtype == "alchemified" && item.ingredients && item.ingredients.length == 2){
			let idx = item.ingredients.indexOf(element);
			if(idx !== -1){
				let partner = item.ingredients[1 - idx];
				pairings.push({ partner: partner, result: key });
			}
		}
	});
	return pairings;
}

function canStudy(element){
	if(findPairings(element).length > 0) return true;
	let el = items[element];
	if(el && el.subtype == "alchemified" && el.ingredients && el.ingredients.length >= 2) return true;
	return false;
}

var consultingActive = null;
var consultingInterval = null;

function consult(element) {
	if (consultingActive) return;
	if (!canStudy(element)) return;
	if (oracleGauge.mentalize >= oracleGaugeSize) {
		consultingActive = element;
		$('.subMachine.oracle .selector').addClass('disabled');
		$('#consult').addClass('disabled');
		updateOracleProgress();
		consultingInterval = setInterval(function(){
			if (oracleGauge.mentalize > 0) {
				oracleGauge.mentalize--;
				updateOracleGauge();
				updateOracleProgress();
			}
			if (oracleGauge.mentalize <= 0) {
				clearInterval(consultingInterval);
				consultingInterval = null;
				let pairings = findPairings(consultingActive);
				let selected = items[consultingActive];
				let isAlch = selected && selected.subtype == "alchemified" && selected.ingredients && selected.ingredients.length >= 2;
				let showCreatedFrom = isAlch && (pairings.length == 0 || Math.random() < 0.5);
				if(showCreatedFrom){
					let ing = selected.ingredients[Math.floor(Math.random() * selected.ingredients.length)];
					let t = evalType(ing);
					let name = items[ing][t.slice(0, -1)];
					seeName(ing);
					$('.subMachine.oracle #oracleResult').html(`<span class="oracle-label">Created from</span> <span class="${ing}">${name}</span>`);
				} else {
					let p = pairings[Math.floor(Math.random() * pairings.length)];
					let type = evalType(p.partner);
					let name = items[p.partner][type.slice(0, -1)];
					seeName(p.partner);
					$('.subMachine.oracle #oracleResult').html(`<span class="oracle-label">Pairs with</span> <span class="${p.partner}">${name}</span>`);
				}
				consultingActive = null;
				$('.subMachine.oracle .selector').removeClass('disabled');
				$('#consult').removeClass('disabled');
			}
		}, 1000);
	}
}

function updateOracleGauge() {
	var pct = oracleGauge.mentalize / oracleGaugeSize * 100;
	$('.subMachine.oracle .fuel').html(oracleGauge.mentalize);
	$('.subMachine.oracle .gauge').html(oracleGaugeSize);
	$('.subMachine.oracle .fuelDraw').css("width", pct + "%");
}

function updateOracleProgress() {
	if (consultingActive) {
		var pct = Math.floor((1 - oracleGauge.mentalize / oracleGaugeSize) * 100);
		$('.subMachine.oracle #oracleResult').html('<span class="oracle-pct">' + pct + '%</span>');
	}
}

/* FORGE */

function isAlchemyTier(id) {
	if (!items[id]) return 0;
	if (!items[id].ingredients) return 0;
	var maxIngTier = 0;
	for (var i = 0; i < items[id].ingredients.length; i++) {
		var ingTier = isAlchemyTier(items[id].ingredients[i]);
		if (ingTier > maxIngTier) maxIngTier = ingTier;
	}
	return maxIngTier + 1;
}

function isForgeThirdSlot(id) {
	for (var key in items) {
		var item = items[key];
		if (item.subtype == "alchemified" && item.ingredients && item.ingredients.length == 3) {
			if (item.ingredients[2] === id) return true;
		}
	}
	return false;
}

function isForgeIngredient(id) {
	for (var key in items) {
		var item = items[key];
		if (item.subtype == "alchemified" && item.ingredients && item.ingredients.length == 3) {
			if (item.ingredients.includes(id)) return true;
		}
	}
	return false;
}

function forge(item) {
	if (items[item].subtype == "alchemified" && items[item].ingredients.length == 3) {
		var ing = items[item].ingredients;
		if (pay(evalType(ing[0]), ing[0], 1) && pay(evalType(ing[1]), ing[1], 1) && pay(evalType(ing[2]), ing[2], 1)) {
			acquire(evalType(item), item, 1);
			logMessage("alchemize");
		}
	}
}

/* DISTILLERY */

function distillRecipe(dust1, dust2) {
	let sorted = [dust1, dust2].sort();
	for (const [itemKey, item] of Object.entries(items)) {
		if (item.distilled && item.ingredients && item.ingredients.length == 2) {
			let itemSorted = [...item.ingredients].sort();
			if (sorted[0] === itemSorted[0] && sorted[1] === itemSorted[1]) {
				return itemKey;
			}
		}
	}
	return null;
}

var distillingActive = null;
var distillingInterval = null;

function distill(item) {
	if (distillingActive) return;
	if (items[item].distilled && distilleryGauge.water >= distilleryGaugeSize) {
		if (pay("dusts", items[item].ingredients[0], 1) && pay("dusts", items[item].ingredients[1], 1)) {
			distillingActive = item;
			$('.subMachine.distillery .selector').addClass('disabled');
			$('#distill').addClass('disabled');
			updateDistilleryProgress();
			distillingInterval = setInterval(function(){
				if (distilleryGauge.water > 0) {
					distilleryGauge.water--;
					updateDistilleryGauge();
					updateDistilleryProgress();
				}
				if (distilleryGauge.water <= 0) {
					clearInterval(distillingInterval);
					distillingInterval = null;
					acquire("liquids", distillingActive, 1);
					logMessage("alchemize");
					distillingActive = null;
					$('.subMachine.distillery .selector').removeClass('disabled');
					$('#distill').removeClass('disabled');
					updateDistilleryProgress();
				}
			}, 1000);
		}
	}
}

function updateAlchemyDustGauge(sub, dustType) {
	var amount = alchemyDustGauge[dustType];
	var pct = amount / alchemyDustGaugeSize * 100;
	$(`#${sub} .alchemy-dust-gauge .fuel`).html(amount);
	$(`#${sub} .alchemy-dust-gauge .gauge`).html(alchemyDustGaugeSize);
	$(`#${sub} .alchemy-dust-gauge .fuelDraw`).css("width", pct + "%");
}

function updateDistilleryGauge() {
	var fuelPercent = distilleryGauge.water / distilleryGaugeSize * 100;
	$('.subMachine.distillery .fuel').html(distilleryGauge.water);
	$('.subMachine.distillery .gauge').html(distilleryGaugeSize);
	$('.subMachine.distillery .fuelDraw').css("width", fuelPercent + "%");
}

function updateDistilleryProgress() {
	if (distillingActive) {
		var pct = Math.floor((1 - distilleryGauge.water / distilleryGaugeSize) * 100);
		$('.subMachine.distillery #result').html(items[distillingActive].liquid + ' <span class="distill-pct">' + pct + '%</span>');
	} else {
		$('.subMachine.distillery .distill-pct').remove();
	}
}

/* FINAL MACHINES */

var finalMachineStatus = {};
var altarFuel = { preserver: 0, dust: 0, flesh: 0 };
var altarFuelSize = 100;
var altarFleshSize = 10;
var enminderFuel = { liquor: 0, lightning: 0 };
var enminderFuelSize = 100;
var enmindingActive = false;
var enmindingInterval = null;
var ensoulerFuel = { mana: 0, life: 0 };
var ensoulerFuelSize = 100;
var ensoulingActive = false;
var ensoulingInterval = null;

var essenceColors = {
	rationalMindEssence: '#a8c8e8',
	creativeMindEssence: '#d4a8e8',
	madMindEssence: '#e8a8a8',
	braveSoulEssence: '#e8cda8',
	lovingSoulEssence: '#e8a8c8',
	darkSoulEssence: '#a8a8b8'
};

// Particle ray system
var particleRays = [];
var particleAnimFrame = null;

function hexToRgb(hex) {
	var r = parseInt(hex.slice(1,3), 16);
	var g = parseInt(hex.slice(3,5), 16);
	var b = parseInt(hex.slice(5,7), 16);
	return { r: r, g: g, b: b };
}

function startParticleRay(fromEl, toEl, color, fromSide) {
	var canvas = document.getElementById('particleCanvas');
	var container = document.getElementById('finalMachines');
	canvas.width = container.offsetWidth;
	canvas.height = container.offsetHeight;

	var ray = {
		from: fromEl,
		to: toEl,
		fromSide: fromSide || null,
		color: hexToRgb(color),
		particles: [],
		active: true
	};
	particleRays.push(ray);
	if (!particleAnimFrame) tickParticles();
	return ray;
}

function stopParticleRay(ray) {
	ray.active = false;
}

function getElPos(el, side) {
	var container = document.getElementById('finalMachines');
	var cr = container.getBoundingClientRect();
	var er = el.getBoundingClientRect();
	if (side === 'right') {
		return { x: er.right - cr.left, y: er.top + er.height / 2 - cr.top };
	} else if (side === 'left') {
		return { x: er.left - cr.left, y: er.top + er.height / 2 - cr.top };
	}
	return { x: er.left + er.width / 2 - cr.left, y: er.top + er.height / 2 - cr.top };
}

function tickParticles() {
	var canvas = document.getElementById('particleCanvas');
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	var anyAlive = false;

	for (var r = 0; r < particleRays.length; r++) {
		var ray = particleRays[r];
		var from = getElPos(ray.from, ray.fromSide);
		var to = getElPos(ray.to, null);
		var dx = to.x - from.x;
		var dy = to.y - from.y;

		// Spawn new particles
		if (ray.active) {
			for (var i = 0; i < 3; i++) {
				ray.particles.push({
					t: 0,
					speed: 0.01 + Math.random() * 0.015,
					ox: (Math.random() - 0.5) * 8,
					oy: (Math.random() - 0.5) * 8,
					size: 1.5 + Math.random() * 2.5
				});
			}
		}

		// Update and draw
		for (var j = ray.particles.length - 1; j >= 0; j--) {
			var p = ray.particles[j];
			p.t += p.speed;
			if (p.t >= 1) {
				ray.particles.splice(j, 1);
				continue;
			}
			anyAlive = true;
			var x = from.x + dx * p.t + p.ox * (1 - p.t);
			var y = from.y + dy * p.t + p.oy * (1 - p.t);
			var alpha = p.t < 0.1 ? p.t / 0.1 : (p.t > 0.8 ? (1 - p.t) / 0.2 : 1);
			ctx.beginPath();
			ctx.arc(x, y, p.size, 0, Math.PI * 2);
			ctx.fillStyle = 'rgba(' + ray.color.r + ',' + ray.color.g + ',' + ray.color.b + ',' + (alpha * 0.8) + ')';
			ctx.fill();
		}

		if (!ray.active && ray.particles.length === 0) {
			particleRays.splice(r, 1);
			r--;
		} else {
			anyAlive = true;
		}
	}

	if (anyAlive) {
		particleAnimFrame = requestAnimationFrame(tickParticles);
	} else {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		particleAnimFrame = null;
	}
}

function unlockFinalMachine(id) {
	finalMachineStatus[id] = "unlocked";
	$('#finalMachines').show();
	$('#container').addClass('has-final-machines');
	$('#' + id).show();
	buildFinalMachine(id);
}

function buildFinalMachine(id) {
	var $content = $('#' + id + ' .content');
	if ($content.children().length > 0) return;

	if (id == "enminder") {
		$content.append(`
			<div class="fm-layout">
				<div class="fm-gauge-circle-side">
					<div class="fm-circle-gauge"><div class="fm-circle-fill liquor-fill"></div></div>
					<div class="fm-gauge-label"><span class="fm-fuel-amount liquor-amount">${enminderFuel.liquor}</span>/${enminderFuelSize}</div>
					<div class="fm-gauge-name">Liquor</div>
					<div class="button fm-add-fuel" data-fuel="liquor">+10</div>
				</div>
				<div class="fm-center">
					<div class="fm-triangle-wrap">
						<svg class="fm-triangle right" viewBox="-2 -2 91 104" preserveAspectRatio="xMidYMid meet">
							<defs>
								<clipPath id="enmindClip">
									<rect class="fm-triangle-clip" x="0" y="0" width="0" height="100"/>
								</clipPath>
							</defs>
							<polygon points="0,0 87,50 0,100" class="fm-triangle-shape"/>
							<polygon points="0,0 87,50 0,100" class="fm-triangle-fill" clip-path="url(#enmindClip)"/>
						</svg>
						<div class="fm-triangle-content">
							<div id="enminderEssence" class="selector custom-select"><div class="selected placeholder">Mind Essence...</div><div class="options"></div></div>
						</div>
						<div id="enmind" class="button fm-triangle-btn right">Can't Enmind</div>
					</div>
				</div>
			</div>
			<div class="fm-bottom-gauge right">
				<div class="fm-bottom-gauge-bar"><div class="gaugeDraw"><div class="fuelDraw enminder-lightning"></div></div></div>
				<div class="fm-bottom-gauge-info">
					<span class="fm-gauge-name">Lightning</span> <span class="fm-fuel-amount lightning-amount">${enminderFuel.lightning}</span>/${enminderFuelSize}
					<div class="button fm-add-fuel" data-fuel="lightning">+10</div>
				</div>
			</div>
		`);
		populateSelector('#enminderEssence', 'enminderEssence');
		updateEnminderGauge();
		if (enmindedMind) {
			$('#enminder').addClass('fm-done');
		}

		$('#enminder .fm-add-fuel').on('click', function(){
			if (enmindingActive) return;
			var fuel = $(this).data('fuel');
			if (fuel == "liquor" && enminderFuel.liquor < enminderFuelSize && pay("liquids", "liquor", 10)) {
				enminderFuel.liquor = Math.min(enminderFuel.liquor + 10, enminderFuelSize);
			} else if (fuel == "lightning" && enminderFuel.lightning < enminderFuelSize && pay("things", "lightning", 10)) {
				enminderFuel.lightning = Math.min(enminderFuel.lightning + 10, enminderFuelSize);
			}
			updateEnminderGauge();
			updateEnmindButton();
		});

		$('#enminderEssence').on('customchange', function(){
			var val = $('#enminderEssence').data('value');
			var clipEl = document.querySelector('#enmindClip .fm-triangle-clip');
			var fillEl = document.querySelector('#enminder .fm-triangle-fill');
			if (val && val.includes('MindEssence')) {
				clipEl.setAttribute('x', 0);
				clipEl.setAttribute('width', 87);
				fillEl.style.fill = essenceColors[val] || '#b8c4e0';
			} else {
				clipEl.setAttribute('width', 0);
			}
			updateEnmindButton();
		});

		$('#enmind').on('click', function(){
			if (enmindingActive) return;
			var essence = $('#enminderEssence').data('value');
			if (essence && essence.includes('MindEssence') && enminderFuel.liquor >= enminderFuelSize && enminderFuel.lightning >= enminderFuelSize) {
				enmind(essence);
			}
		});

	} else if (id == "ensouler") {
		$content.append(`
			<div class="fm-layout">
				<div class="fm-center">
					<div class="fm-triangle-wrap">
						<svg class="fm-triangle left" viewBox="-2 -2 91 104" preserveAspectRatio="xMidYMid meet">
							<defs>
								<clipPath id="ensoulClip">
									<rect class="fm-triangle-clip" x="87" y="0" width="0" height="100"/>
								</clipPath>
							</defs>
							<polygon points="87,0 0,50 87,100" class="fm-triangle-shape"/>
							<polygon points="87,0 0,50 87,100" class="fm-triangle-fill" clip-path="url(#ensoulClip)"/>
						</svg>
						<div class="fm-triangle-content">
							<div id="ensoulerEssence" class="selector custom-select"><div class="selected placeholder">Soul Essence...</div><div class="options"></div></div>
						</div>
						<div id="ensoul" class="button fm-triangle-btn left">Can't Ensoul</div>
					</div>
				</div>
				<div class="fm-gauge-circle-side">
					<div class="fm-circle-gauge"><div class="fm-circle-fill mana-fill"></div></div>
					<div class="fm-gauge-label"><span class="fm-fuel-amount mana-amount">${ensoulerFuel.mana}</span>/${ensoulerFuelSize}</div>
					<div class="fm-gauge-name">Mana</div>
					<div class="button fm-add-fuel" data-fuel="mana">+10</div>
				</div>
			</div>
			<div class="fm-bottom-gauge left">
				<div class="fm-bottom-gauge-info">
					<div class="button fm-add-fuel" data-fuel="life">+10</div>
					<span class="fm-gauge-name">Life</span> <span class="fm-fuel-amount life-amount">${ensoulerFuel.life}</span>/${ensoulerFuelSize}
				</div>
				<div class="fm-bottom-gauge-bar"><div class="gaugeDraw"><div class="fuelDraw ensouler-life"></div></div></div>
			</div>
		`);
		populateSelector('#ensoulerEssence', 'ensoulerEssence');
		updateEnsoulerGauge();
		if (ensouledSoul) {
			$('#ensouler').addClass('fm-done');
		}

		$('#ensouler .fm-add-fuel').on('click', function(){
			if (ensoulingActive) return;
			var fuel = $(this).data('fuel');
			if (fuel == "mana" && ensoulerFuel.mana < ensoulerFuelSize && pay("liquids", "mana", 10)) {
				ensoulerFuel.mana = Math.min(ensoulerFuel.mana + 10, ensoulerFuelSize);
			} else if (fuel == "life" && ensoulerFuel.life < ensoulerFuelSize && pay("ideas", "life", 10)) {
				ensoulerFuel.life = Math.min(ensoulerFuel.life + 10, ensoulerFuelSize);
			}
			updateEnsoulerGauge();
			updateEnsoulButton();
		});

		$('#ensoulerEssence').on('customchange', function(){
			var val = $('#ensoulerEssence').data('value');
			var clipEl = document.querySelector('#ensoulClip .fm-triangle-clip');
			var fillEl = document.querySelector('#ensouler .fm-triangle-fill');
			if (val && val.includes('SoulEssence')) {
				clipEl.setAttribute('x', 0);
				clipEl.setAttribute('width', 87);
				fillEl.style.fill = essenceColors[val] || '#e0b8b8';
			} else {
				clipEl.setAttribute('width', 0);
			}
			updateEnsoulButton();
		});

		$('#ensoul').on('click', function(){
			if (ensoulingActive) return;
			var essence = $('#ensoulerEssence').data('value');
			if (essence && essence.includes('SoulEssence') && ensoulerFuel.mana >= ensoulerFuelSize && ensoulerFuel.life >= ensoulerFuelSize) {
				ensoul(essence);
			}
		});

	} else if (id == "altar") {
		if (humanCreated) {
			humanCreationReveal(true);
			return;
		}
		$content.append(`
			<div class="fm-tank-gauge">
				<div class="fm-tank">
					<div class="fm-tank-fill altar-preserver-fill"></div>
				</div>
				<div class="fm-gauge-label"><span class="fm-fuel-amount preserver-amount">${altarFuel.preserver}</span>/${altarFuelSize}</div>
				<div class="fm-gauge-name">Preserver</div>
				<div class="button fm-add-fuel" data-fuel="preserver">+10</div>
			</div>
			<div class="fm-preserver-tube">
				<div class="fm-tube-flow-fill"></div>
			</div>
			<div class="fm-layout">
				<div class="fm-slot-side">
					<div id="altarMind" class="fm-slot"><div class="fm-slot-label">Mind</div><div class="fm-slot-value">—</div></div>
				</div>
				<div class="fm-connector"><div class="fm-connector-flow mind-flow"></div></div>
				<div class="fm-center">
					<div class="fm-flesh-gauge">
						<svg class="fm-flesh-silhouette" viewBox="-30 -70 700 1420" preserveAspectRatio="xMidYMid meet">
							<rect class="fm-flesh-pedestal" x="-20" y="-60" width="680" height="1400" rx="8"/>
							<defs>
								<clipPath id="fleshLevel">
									<rect class="fm-flesh-clip" x="0" y="1280" width="640" height="0"/>
								</clipPath>
								<clipPath id="decayLevel">
									<rect class="fm-decay-clip" x="0" y="0" width="640" height="0"/>
								</clipPath>
							</defs>
							<g transform="translate(0,1280) scale(0.1,-0.1)">
								<path class="fm-flesh-bg" d="M3027 12784 c-290 -52 -544 -220 -705 -463 -134 -204 -189 -425 -170 -681 30 -386 296 -743 659 -886 143 -56 212 -68 389 -69 168 0 209 6 340 47 263 83 515 309 630 562 124 273 129 581 13 856 -73 174 -231 368 -378 465 -233 154 -520 216 -778 169z"/>
								<path class="fm-flesh-bg" d="M1920 10435 c-8 -2 -49 -9 -90 -15 -106 -17 -265 -71 -371 -126 -394 -204 -653 -566 -731 -1024 -10 -59 -13 -445 -13 -1815 l0 -1740 22 -71 c71 -223 311 -355 546 -300 161 38 267 129 328 281 l24 60 3 1553 2 1552 110 0 110 0 2 -4152 3 -4153 21 -61 c59 -169 154 -284 295 -353 190 -93 392 -93 586 0 152 73 269 220 314 394 10 40 14 536 16 2472 l3 2423 105 0 105 0 0 -2407 c0 -2080 2 -2418 15 -2478 61 -293 341 -494 655 -471 260 18 457 165 538 401 l27 80 3 4153 2 4153 108 -3 107 -3 5 -1555 c4 -1101 8 -1564 16 -1585 75 -204 232 -315 447 -315 234 0 413 158 447 395 8 58 10 541 8 1770 -3 1588 -5 1696 -22 1785 -110 572 -500 992 -1046 1128 l-105 26 -1290 2 c-709 1 -1297 1 -1305 -1z"/>
							</g>
							<g clip-path="url(#fleshLevel)">
								<g transform="translate(0,1280) scale(0.1,-0.1)">
									<path class="fm-flesh-fill" d="M3027 12784 c-290 -52 -544 -220 -705 -463 -134 -204 -189 -425 -170 -681 30 -386 296 -743 659 -886 143 -56 212 -68 389 -69 168 0 209 6 340 47 263 83 515 309 630 562 124 273 129 581 13 856 -73 174 -231 368 -378 465 -233 154 -520 216 -778 169z"/>
									<path class="fm-flesh-fill" d="M1920 10435 c-8 -2 -49 -9 -90 -15 -106 -17 -265 -71 -371 -126 -394 -204 -653 -566 -731 -1024 -10 -59 -13 -445 -13 -1815 l0 -1740 22 -71 c71 -223 311 -355 546 -300 161 38 267 129 328 281 l24 60 3 1553 2 1552 110 0 110 0 2 -4152 3 -4153 21 -61 c59 -169 154 -284 295 -353 190 -93 392 -93 586 0 152 73 269 220 314 394 10 40 14 536 16 2472 l3 2423 105 0 105 0 0 -2407 c0 -2080 2 -2418 15 -2478 61 -293 341 -494 655 -471 260 18 457 165 538 401 l27 80 3 4153 2 4153 108 -3 107 -3 5 -1555 c4 -1101 8 -1564 16 -1585 75 -204 232 -315 447 -315 234 0 413 158 447 395 8 58 10 541 8 1770 -3 1588 -5 1696 -22 1785 -110 572 -500 992 -1046 1128 l-105 26 -1290 2 c-709 1 -1297 1 -1305 -1z"/>
								</g>
							</g>
							<g clip-path="url(#decayLevel)">
								<g transform="translate(0,1280) scale(0.1,-0.1)">
									<path class="fm-flesh-decay" d="M3027 12784 c-290 -52 -544 -220 -705 -463 -134 -204 -189 -425 -170 -681 30 -386 296 -743 659 -886 143 -56 212 -68 389 -69 168 0 209 6 340 47 263 83 515 309 630 562 124 273 129 581 13 856 -73 174 -231 368 -378 465 -233 154 -520 216 -778 169z"/>
									<path class="fm-flesh-decay" d="M1920 10435 c-8 -2 -49 -9 -90 -15 -106 -17 -265 -71 -371 -126 -394 -204 -653 -566 -731 -1024 -10 -59 -13 -445 -13 -1815 l0 -1740 22 -71 c71 -223 311 -355 546 -300 161 38 267 129 328 281 l24 60 3 1553 2 1552 110 0 110 0 2 -4152 3 -4153 21 -61 c59 -169 154 -284 295 -353 190 -93 392 -93 586 0 152 73 269 220 314 394 10 40 14 536 16 2472 l3 2423 105 0 105 0 0 -2407 c0 -2080 2 -2418 15 -2478 61 -293 341 -494 655 -471 260 18 457 165 538 401 l27 80 3 4153 2 4153 108 -3 107 -3 5 -1555 c4 -1101 8 -1564 16 -1585 75 -204 232 -315 447 -315 234 0 413 158 447 395 8 58 10 541 8 1770 -3 1588 -5 1696 -22 1785 -110 572 -500 992 -1046 1128 l-105 26 -1290 2 c-709 1 -1297 1 -1305 -1z"/>
								</g>
							</g>
							<g transform="translate(0,1280) scale(0.1,-0.1)">
								<path class="fm-flesh-outline" d="M3027 12784 c-290 -52 -544 -220 -705 -463 -134 -204 -189 -425 -170 -681 30 -386 296 -743 659 -886 143 -56 212 -68 389 -69 168 0 209 6 340 47 263 83 515 309 630 562 124 273 129 581 13 856 -73 174 -231 368 -378 465 -233 154 -520 216 -778 169z"/>
								<path class="fm-flesh-outline" d="M1920 10435 c-8 -2 -49 -9 -90 -15 -106 -17 -265 -71 -371 -126 -394 -204 -653 -566 -731 -1024 -10 -59 -13 -445 -13 -1815 l0 -1740 22 -71 c71 -223 311 -355 546 -300 161 38 267 129 328 281 l24 60 3 1553 2 1552 110 0 110 0 2 -4152 3 -4153 21 -61 c59 -169 154 -284 295 -353 190 -93 392 -93 586 0 152 73 269 220 314 394 10 40 14 536 16 2472 l3 2423 105 0 105 0 0 -2407 c0 -2080 2 -2418 15 -2478 61 -293 341 -494 655 -471 260 18 457 165 538 401 l27 80 3 4153 2 4153 108 -3 107 -3 5 -1555 c4 -1101 8 -1564 16 -1585 75 -204 232 -315 447 -315 234 0 413 158 447 395 8 58 10 541 8 1770 -3 1588 -5 1696 -22 1785 -110 572 -500 992 -1046 1128 l-105 26 -1290 2 c-709 1 -1297 1 -1305 -1z"/>
							</g>
						</svg>
					</div>
				</div>
				<div class="fm-connector"><div class="fm-connector-flow soul-flow"></div></div>
				<div class="fm-slot-side">
					<div id="altarSoul" class="fm-slot"><div class="fm-slot-label">Soul</div><div class="fm-slot-value">—</div></div>
				</div>
			</div>
			<div class="fm-flesh-controls">
				<div class="fm-gauge-label">Flesh <span id="fleshCount">${altarFuel.flesh}</span>/${altarFleshSize}</div>
				<div class="button fm-add-fuel" data-fuel="flesh">+1</div>
			</div>
			<div class="fm-create-controls">
				<div id="createHuman" class="button">Can't Create</div>
				<div class="fm-create-progress" style="display:none">0%</div>
			</div>
			<div class="fm-bowl-gauge">
				<div class="fm-bowl">
					<div id="dustParticles"></div>
				</div>
				<div class="fm-gauge-label"><span class="fm-fuel-amount dust-amount">${altarFuel.dust}</span>/${altarFuelSize}</div>
				<div class="fm-gauge-name">Dust</div>
				<div class="button fm-add-fuel" data-fuel="dust">+10</div>
			</div>
		`);
		updateAltarGauge();
		updateFleshCount();
		startAltarDecay();

		if (enmindedMind) {
			$('#altarMind .fm-slot-value').html(enmindedMind);
			$('#altarMind').css('background', essenceColors[enmindedMind + 'Essence'] || '#b8c4e0');
		}
		if (ensouledSoul) {
			$('#altarSoul .fm-slot-value').html(ensouledSoul);
			$('#altarSoul').css('background', essenceColors[ensouledSoul + 'Essence'] || '#e0b8b8');
		}
		updateCreateButton();

		$('#altar .fm-add-fuel').on('click', function(){
			var fuel = $(this).data('fuel');
			if (fuel == "preserver" && altarFuel.preserver < altarFuelSize && pay("liquids", "preserver", 10)) {
				altarFuel.preserver = Math.min(altarFuel.preserver + 10, altarFuelSize);
			} else if (fuel == "dust" && altarFuel.dust < altarFuelSize && pay("things", "dust", 10)) {
				altarFuel.dust = Math.min(altarFuel.dust + 10, altarFuelSize);
			} else if (fuel == "flesh" && altarFuel.flesh < altarFleshSize && pay("things", "flesh", 1)) {
				altarFuel.flesh = Math.min(altarFuel.flesh + 1, altarFleshSize);
			}
			updateAltarGauge();
			updateFleshCount();
			updateCreateButton();
		});

		$('#createHuman').on('click', function(){
			createHuman();
		});
	}
}

function updateEnmindButton() {
	var val = $('#enminderEssence').data('value');
	if (enmindingActive) {
		$('#enmind').html('Enminding...').addClass('disabled');
	} else if (val && val.includes('MindEssence') && enminderFuel.liquor >= enminderFuelSize && enminderFuel.lightning >= enminderFuelSize) {
		$('#enmind').html('Enmind').removeClass('disabled');
	} else {
		$('#enmind').html("Can't Enmind").addClass('disabled');
	}
}

function updateEnsoulButton() {
	var val = $('#ensoulerEssence').data('value');
	if (ensoulingActive) {
		$('#ensoul').html('Ensouling...').addClass('disabled');
	} else if (val && val.includes('SoulEssence') && ensoulerFuel.mana >= ensoulerFuelSize && ensoulerFuel.life >= ensoulerFuelSize) {
		$('#ensoul').html('Ensoul').removeClass('disabled');
	} else {
		$('#ensoul').html("Can't Ensoul").addClass('disabled');
	}
}

function enmind(essence) {
	if (enmindingActive) return;
	if (enminderFuel.liquor < enminderFuelSize || enminderFuel.lightning < enminderFuelSize) return;
	if (!pay("ideas", essence, 1)) return;

	enmindingActive = true;
	var mindKey = essence.replace('Essence', '');
	$('#enminderEssence').addClass('disabled');
	$('#enmind').hide();

	// Fill triangle gauge
	var clipEl = document.querySelector('#enmindClip .fm-triangle-clip');
	clipEl.setAttribute('x', 0);
	clipEl.setAttribute('width', 87);
	var fillColor = essenceColors[essence] || '#b8c4e0';

	// Start particle ray from triangle tip to altar circle
	var triSvg = document.querySelector('#enminder .fm-triangle');
	var ray = startParticleRay(triSvg, document.getElementById('altarMind'), fillColor, 'right');

	var drainRate = 5;
	enmindingInterval = setInterval(function(){
		enminderFuel.liquor = Math.max(0, enminderFuel.liquor - drainRate);
		enminderFuel.lightning = Math.max(0, enminderFuel.lightning - drainRate);
		updateEnminderGauge();

		// Drain triangle from base toward point (left to right)
		var pct = enminderFuel.liquor / enminderFuelSize;
		var w = 87 * pct;
		clipEl.setAttribute('x', 87 - w);
		clipEl.setAttribute('width', w);

		// Fill altar circle from below
		var fillPct = Math.round((1 - pct) * 100);
		$('#altarMind').css('background', 'linear-gradient(to top, ' + fillColor + ' ' + fillPct + '%, white ' + fillPct + '%)');

		if (enminderFuel.liquor <= 0 && enminderFuel.lightning <= 0) {
			clearInterval(enmindingInterval);
			enmindingInterval = null;
			enmindingActive = false;
			stopParticleRay(ray);
			enmindedMind = mindKey;
			$('#altarMind .fm-slot-value').html(mindKey);
			$('#altarMind').css('background', fillColor);
			$('#enminder').addClass('fm-done');
			updateCreateButton();
			logMessage("alchemize");
		}
	}, 500);
}

function ensoul(essence) {
	if (ensoulingActive) return;
	if (ensoulerFuel.mana < ensoulerFuelSize || ensoulerFuel.life < ensoulerFuelSize) return;
	if (!pay("ideas", essence, 1)) return;

	ensoulingActive = true;
	var soulKey = essence.replace('Essence', '');
	$('#ensoulerEssence').addClass('disabled');
	$('#ensoul').hide();

	// Fill triangle gauge
	var clipEl = document.querySelector('#ensoulClip .fm-triangle-clip');
	clipEl.setAttribute('x', 0);
	clipEl.setAttribute('width', 87);
	var fillColor = essenceColors[essence] || '#e0b8b8';

	// Start particle ray from triangle tip to altar circle
	var triSvg = document.querySelector('#ensouler .fm-triangle');
	var ray = startParticleRay(triSvg, document.getElementById('altarSoul'), fillColor, 'left');

	var drainRate = 5;
	ensoulingInterval = setInterval(function(){
		ensoulerFuel.mana = Math.max(0, ensoulerFuel.mana - drainRate);
		ensoulerFuel.life = Math.max(0, ensoulerFuel.life - drainRate);
		updateEnsoulerGauge();

		// Drain triangle from base toward point (right to left)
		var pct = ensoulerFuel.mana / ensoulerFuelSize;
		clipEl.setAttribute('width', 87 * pct);

		// Fill altar circle from below
		var fillPct = Math.round((1 - pct) * 100);
		$('#altarSoul').css('background', 'linear-gradient(to top, ' + fillColor + ' ' + fillPct + '%, white ' + fillPct + '%)');

		if (ensoulerFuel.mana <= 0 && ensoulerFuel.life <= 0) {
			clearInterval(ensoulingInterval);
			ensoulingInterval = null;
			ensoulingActive = false;
			stopParticleRay(ray);
			ensouledSoul = soulKey;
			$('#altarSoul .fm-slot-value').html(soulKey);
			$('#altarSoul').css('background', fillColor);
			$('#ensouler').addClass('fm-done');
			updateCreateButton();
			logMessage("alchemize");
		}
	}, 500);
}

var creatingHuman = false;
var createHumanInterval = null;
var createHumanProgress = 0;
var startingFlesh = 0;

function canCreateHuman() {
	return !creatingHuman
		&& altarFuel.flesh >= altarFleshSize
		&& altarFuel.dust >= altarFuelSize
		&& enmindedMind
		&& ensouledSoul;
}

function updateCreateButton() {
	if (creatingHuman) {
		$('#createHuman').hide();
		$('.fm-flesh-controls').hide();
		$('.fm-create-progress').show().html(Math.round(createHumanProgress * 100) + '%');
	} else {
		$('#createHuman').show();
		$('.fm-flesh-controls').show();
		$('.fm-create-progress').hide();
		if (canCreateHuman()) {
			$('#createHuman').html('Create Human').removeClass('disabled');
		} else {
			$('#createHuman').html("Can't Create").addClass('disabled');
		}
	}
}

function createHuman() {
	if (!canCreateHuman()) return;

	creatingHuman = true;
	startingFlesh = altarFuel.flesh;
	createHumanProgress = 0;
	updateCreateButton();

	// Disable fuel buttons during creation (except preserver)
	$('#altar .fm-add-fuel').not('[data-fuel="preserver"]').addClass('disabled');

	// Fill connector tubes immediately
	var mindColor = $('#altarMind').css('background-color') || '#b8c4e0';
	var soulColor = $('#altarSoul').css('background-color') || '#e0b8b8';
	$('.mind-flow').css('background-color', mindColor).css('width', '100%');
	$('.soul-flow').css('background-color', soulColor).css('width', '100%');

	// Hide dust add button during creation
	$('.fm-bowl-gauge .fm-add-fuel').hide();

	createHumanInterval = setInterval(function(){
		// Check if flesh decayed during process
		if (altarFuel.flesh < startingFlesh) {
			clearInterval(createHumanInterval);
			createHumanInterval = null;
			creatingHuman = false;
			createHumanProgress = 0;
			$('#altar .fm-add-fuel').removeClass('disabled');
			$('.fm-bowl-gauge .fm-add-fuel').show();
			// Reset tubes and circles
			$('.mind-flow').css('left', 'auto').css('right', '0').css('width', '0%');
			$('.soul-flow').css('right', 'auto').css('left', '0').css('width', '0%');
			updateCreateButton();
			return;
		}

		createHumanProgress += 1 / 1200;
		altarFuel.dust = Math.max(0, altarFuelSize * (1 - createHumanProgress));
		updateAltarGauge();

		// Drain mind and soul circles
		var drainPct = Math.round((1 - createHumanProgress) * 100);
		var mindBg = $('#altarMind').data('original-bg') || $('#altarMind').css('background-color');
		var soulBg = $('#altarSoul').data('original-bg') || $('#altarSoul').css('background-color');
		if (!$('#altarMind').data('original-bg')) {
			$('#altarMind').data('original-bg', mindBg);
			$('#altarSoul').data('original-bg', soulBg);
		}
		$('#altarMind').css('background', 'linear-gradient(to top, ' + mindBg + ' ' + drainPct + '%, white ' + drainPct + '%)');
		$('#altarSoul').css('background', 'linear-gradient(to top, ' + soulBg + ' ' + drainPct + '%, white ' + drainPct + '%)');

		if (createHumanProgress >= 1) {
			clearInterval(createHumanInterval);
			createHumanInterval = null;
			creatingHuman = false;
			createHumanProgress = 0;

			altarFuel.flesh = 0;
			altarFuel.dust = 0;
			updateAltarGauge();
			updateFleshCount();

			// Empty circles and drain tubes
			$('#altarMind').css('background', 'white');
			$('#altarSoul').css('background', 'white');
			$('.mind-flow').css('left', 'auto').css('right', '0').css('width', '0%');
			$('.soul-flow').css('right', 'auto').css('left', '0').css('width', '0%');

			logMessage("alchemize");

			// Save human created state
			humanCreated = { mind: enmindedMind, soul: ensouledSoul };

			// Unlock the human (add to persistent list + spawn walker)
			var profile = getProfileForHuman();
			if (profile && humansUnlocked.indexOf(profile.name) === -1) {
				humansUnlocked.push(profile.name);
				if (window._stickman && window._stickman.spawnWalker) {
					window._stickman.spawnWalker(profile.name);
				}
				if (typeof refreshHumansButton === 'function') refreshHumansButton();
			}

			// Wait for tubes to empty, then start the reveal
			setTimeout(function(){ humanCreationReveal(false); }, 1200);
		}

		updateCreateButton();
	}, 50);
}

function getProfileForHuman() {
	var S = window._stickman;
	var mindKey = enmindedMind ? enmindedMind.replace('Mind', '') + 'Mind' : null;
	var soulKey = ensouledSoul ? ensouledSoul.replace('Soul', '') + 'Soul' : null;
	for (var i = 0; i < S.profiles.length; i++) {
		if (S.profiles[i].mind === mindKey && S.profiles[i].soul === soulKey) return S.profiles[i];
	}
	return S.profiles[0];
}

function humanCreationReveal(instant) {
	var S = window._stickman;
	var profile = getProfileForHuman();
	var $altar = $('#altar');
	var $content = $altar.find('.content');

	// Stop decay
	if (fleshDecayInterval) { clearInterval(fleshDecayInterval); fleshDecayInterval = null; }

	function setupStickman() {
		$content.find('.fm-tank-gauge, .fm-preserver-tube, .fm-flesh-controls, .fm-create-controls, .fm-bowl-gauge, .fm-slot-side, .fm-connector, .fm-gauge-circle-side, .fm-gauge-side, .fm-bottom-gauge, .fm-layout').hide();

		var canvas = document.createElement('canvas');
		canvas.className = 'altar-stickman-canvas';
		var w = $altar.width();
		var h = $altar.height() - 40;
		canvas.width = w * 2;
		canvas.height = h * 2;
		canvas.style.width = w + 'px';
		canvas.style.height = h + 'px';
		$content.append(canvas);

		var ctx = canvas.getContext('2d');
		ctx.scale(2, 2);

		var stickHeight = 180;
		var man = new S.StickMan(stickHeight, profile);
		var groundY = h - 10;
		var walkTarget = 180;

		var posX = instant ? walkTarget : w / 2;
		var posY = instant ? groundY - stickHeight * 0.6 : h / 2 - stickHeight / 2;
		var velY = 0;
		var phase = instant ? 'idle' : 'fall';

		man.addAnimation(S.idleAnimation);
		man.updateBodyPositions();

		var $info = $('<div class="altar-human-info"' + (instant ? '' : ' style="display:none"') + '>' +
			'<div class="altar-human-name">' + profile.name + '</div>' +
			'<div class="altar-human-modifiers">Modifiers: —</div>' +
			'<div class="button" id="ascendButton">Ascend</div>' +
		'</div>');
		$content.append($info);

		function animate() {
			ctx.clearRect(0, 0, w, h);

			if (phase === 'fall') {
				velY += 0.5;
				posY += velY;
				if (posY >= groundY - stickHeight * 0.6) {
					posY = groundY - stickHeight * 0.6;
					velY = 0;
					phase = 'walk';
					man.addAnimation(S.makeWalk(profile.walkTime || 500));
				}
			} else if (phase === 'walk') {
				posX += -1.5;
				if (posX <= walkTarget) {
					posX = walkTarget;
					phase = 'idle';
					man.addAnimation(S.idleAnimation);
					$info.fadeIn(500);
				}
			}

			man.animate();
			man.updateBodyPositions();
			man.render(ctx, [posX, posY]);
			if (S.drawItem) S.drawItem(ctx, { profile: profile, man: man }, posX, posY);

			requestAnimationFrame(animate);
		}

		animate();
	}

	if (instant) {
		setupStickman();
	} else {
		$content.find('.fm-tank-gauge, .fm-preserver-tube, .fm-flesh-controls, .fm-create-controls, .fm-bowl-gauge, .fm-slot-side, .fm-connector, .fm-gauge-circle-side, .fm-gauge-side, .fm-bottom-gauge').fadeOut(1000);
		$content.find('.fm-layout').css('padding', '0');
		setTimeout(function(){
			$content.find('.fm-layout').hide();
			setupStickman();
		}, 1200);
	}
}

var fleshDecayInterval = null;
var fleshDecayProgress = 0;
var preserverSpent = 0;

function startAltarDecay() {
	if (fleshDecayInterval) return;
	fleshDecayInterval = setInterval(function(){
		if (altarFuel.flesh <= 0) return;

		if (altarFuel.preserver > 0) {
			fleshDecayProgress += 0.01;
			if (fleshDecayProgress >= (preserverSpent + 1) * 0.1) {
				altarFuel.preserver--;
				preserverSpent++;
				updateAltarGauge();
			}
			if (fleshDecayProgress >= 1) {
				fleshDecayProgress = 0;
				preserverSpent = 0;
			}
			updateFleshVisual();
		} else {
			if (fleshDecayProgress >= 1) {
				altarFuel.flesh--;
				$('#fleshCount').html(altarFuel.flesh);
				fleshDecayProgress = 0;
			} else {
				fleshDecayProgress += 0.01;
			}
			updateFleshVisual();
		}
	}, 50);
}

function updateFleshCount() {
	var count = altarFuel.flesh || 0;
	$('#fleshCount').html(count);
	updateFleshVisual();
}

function updateFleshVisual() {
	var count = altarFuel.flesh || 0;
	var unitH = 1280 / altarFleshSize;
	var fullH = count * unitH;

	// Main fill clip — show all filled flesh
	var clipEl = document.querySelector('.fm-flesh-clip');
	if (clipEl) {
		clipEl.setAttribute('y', 1280 - fullH);
		clipEl.setAttribute('height', fullH);
	}

	// Decay clip — always at top of fill
	var decayClip = document.querySelector('.fm-decay-clip');
	var decayPaths = document.querySelectorAll('.fm-flesh-decay');
	var decaying = altarFuel.preserver <= 0 && fleshDecayProgress > 0 && count > 0;

	if (decayClip) {
		if (decaying) {
			var topStripY = 1280 - fullH;
			decayClip.setAttribute('y', topStripY);
			decayClip.setAttribute('height', unitH);
		} else {
			decayClip.setAttribute('height', 0);
		}
	}

	decayPaths.forEach(function(el) {
		el.style.opacity = decaying ? fleshDecayProgress : 0;
	});

	// Tube flow animation
	var tubeFlow = document.querySelector('.fm-tube-flow-fill');
	if (tubeFlow) {
		var preserving = altarFuel.preserver > 0 && fleshDecayProgress > 0 && count > 0;
		if (preserving) {
			// Fill from top (left), stay filled
			tubeFlow.style.left = '0';
			tubeFlow.style.right = 'auto';
			tubeFlow.style.width = '100%';
			tubeFlow.style.transition = 'width 1s';
		} else if (fleshDecayProgress > 0 || altarFuel.preserver <= 0) {
			// Empty from bottom (right)
			tubeFlow.style.left = 'auto';
			tubeFlow.style.right = '0';
			tubeFlow.style.transition = 'width 1s';
			tubeFlow.style.width = '0%';
		}
	}
}

function updateEnminderGauge() {
	$('#enminder .liquor-amount').html(enminderFuel.liquor);
	$('.liquor-fill').css('height', (enminderFuel.liquor / enminderFuelSize * 100) + '%').toggleClass('empty', enminderFuel.liquor <= 0);
	$('#enminder .lightning-amount').html(enminderFuel.lightning);
	$('#enminder .enminder-lightning').css("width", (enminderFuel.lightning / enminderFuelSize * 100) + "%");
}

function updateEnsoulerGauge() {
	$('#ensouler .mana-amount').html(ensoulerFuel.mana);
	$('.mana-fill').css('height', (ensoulerFuel.mana / ensoulerFuelSize * 100) + '%').toggleClass('empty', ensoulerFuel.mana <= 0);
	$('#ensouler .life-amount').html(ensoulerFuel.life);
	$('#ensouler .ensouler-life').css("width", (ensoulerFuel.life / ensoulerFuelSize * 100) + "%");
}

var dustCanvasInit = false;
var dustGrains = [];
var dustCanvas, dustCtx;
var dustLevel = 0;
var dustSettledGrains = [];
var dustColors = ['#c4a46c', '#a0825a', '#d4b88c', '#8c6e4a', '#b89860', '#9c7e50'];

function initDustCanvas() {
	if (dustCanvasInit) return;
	var el = document.getElementById('dustParticles');
	if (!el) return;
	dustCanvasInit = true;
	dustCanvas = document.createElement('canvas');
	dustCanvas.width = 160;
	dustCanvas.height = 80;
	dustCanvas.style.width = '100%';
	dustCanvas.style.height = '100%';
	el.appendChild(dustCanvas);
	dustCtx = dustCanvas.getContext('2d');
	// Pre-fill settled grains based on current level
	dustLevel = Math.round((altarFuel.dust / altarFuelSize) * 80);
	fillDustTo(dustLevel);
	animateDust();
}

function fillDustTo(h) {
	for (var y = 80; y > 80 - h; y -= 1) {
		for (var x = 0; x < 160; x += 2) {
			dustSettledGrains.push({
				x: x + (Math.random() - 0.5) * 2,
				y: y + (Math.random() - 0.5) * 1,
				r: 1.2 + Math.random() * 1.3,
				color: dustColors[Math.floor(Math.random() * dustColors.length)]
			});
		}
	}
}

function spawnDustGrains(count) {
	for (var i = 0; i < count; i++) {
		dustGrains.push({
			x: Math.random() * 160,
			y: -Math.random() * 30,
			vy: 0.5 + Math.random() * 1.5,
			r: 1 + Math.random() * 1.5,
			color: dustColors[Math.floor(Math.random() * dustColors.length)]
		});
	}
}

function animateDust() {
	if (!dustCanvas) return;
	dustCtx.clearRect(0, 0, 160, 80);

	// Draw settled grains
	for (var s = 0; s < dustSettledGrains.length; s++) {
		var g = dustSettledGrains[s];
		dustCtx.beginPath();
		dustCtx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
		dustCtx.fillStyle = g.color;
		dustCtx.fill();
	}

	// Update falling grains
	var floor = 80 - dustLevel;
	var landed = false;
	for (var i = dustGrains.length - 1; i >= 0; i--) {
		var p = dustGrains[i];
		p.vy += 0.15;
		p.y += p.vy;

		if (p.y >= floor) {
			dustGrains.splice(i, 1);
			landed = true;
			continue;
		}

		dustCtx.beginPath();
		dustCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
		dustCtx.fillStyle = p.color;
		dustCtx.fill();
	}

	if (landed && dustGrains.length === 0) {
		dustSettledGrains = [];
		fillDustTo(dustLevel);
	}

	requestAnimationFrame(animateDust);
}

function updateAltarGauge() {
	$('#altar .preserver-amount').html(altarFuel.preserver);
	$('.altar-preserver-fill').css("height", (altarFuel.preserver / altarFuelSize * 100) + "%");
	$('#altar .dust-amount').html(Math.round(altarFuel.dust));
	initDustCanvas();
	var newLevel = Math.round((altarFuel.dust / altarFuelSize) * 80);
	if (newLevel > dustLevel) {
		spawnDustGrains((newLevel - dustLevel) * 8);
		dustLevel = newLevel;
	} else if (newLevel < dustLevel) {
		dustLevel = newLevel;
		dustSettledGrains = [];
		fillDustTo(dustLevel);
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
				let affordable = Math.min(amount, things.matter);
				if (affordable > 0) reify(id, affordable);
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
	if(showStatus.ideas == "locked"){
		showStatus.ideas = "unlocked";
		$('#ideas').fadeIn();
	}
	$.each(items, function(id, name){
		var amount = $('.logMessage.active.'+id).length;
		if(amount > 0 && pay("ideas", "mind", amount)){
			for (var i = 0; i < amount; i++) {
				logMessage("mentalize");
			}
			acquire("ideas", id, amount);
			if (id == "mentalize") {
				acquire("ideas", "recursion", 1);
			}
			$('.logMessage.active.'+id+' .button').remove();
			$('.logMessage.active.'+id).addClass("inactive").removeClass("active");
			activeLogCounter -= amount;
		}
	});
	updateActiveLogCounter();
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
			if(type[id] != 0 && items[id] && items[id][key]){
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
	} else {
		$('.item.'+type+'.'+item).stop(true).show();
	}
	seeName(item);

	window[type][item] = window[type][item] + amount;
	updateCounter(type, item);
}

function itemBuild(type, id){
	if ($('.item.' + type + '.' + id).length > 0) return;
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
			if(buyables[id].subclass == "finalMachine"){
				unlockFinalMachine(buyables[id].unlocks);
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
	if (typeof seenFacts !== "undefined") seenFacts[id] = true;
	logEntries.push({ id: id, count: logCount, active: true, tooMany: false });
	updateActiveLogCounter();
	$('#log .content').prepend('<div class="item logMessage '+ id +' logCount-'+logCount+' active"><span class="count">'+logCount+' </span><span class="name">'+ actions[id].log+'</span></div>');
	button('.logCount-' + logCount, id, "mentalize");
}

function logMessageTooMany(id){
	logCount++;
	activeLogCounter++;
	if (typeof seenFacts !== "undefined") seenFacts[id] = true;
	logEntries.push({ id: id, count: logCount, active: true, tooMany: true });
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
		var mentalizedCount = parseInt($(instance).find('.count').text());
		for (var i = 0; i < logEntries.length; i++) {
			if (logEntries[i].count === mentalizedCount) { logEntries[i].active = false; break; }
		}
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
	var counter = $('.logMessage.active').not('.machineU').not('.unlock').not('.mentAll').length;
	if (counter > 0 && counter <= ideas.mind){
		$('.logMessage.active .button').not('.machineU .button').not('.unlock .button').not('.mentAll .button').remove();
		$('.logMessage.active').not('.machineU').not('.unlock').not('.mentAll').addClass("inactive").removeClass("active");
		pay("ideas", "mind", counter)
		acquire("ideas", "idealSubstance", counter)
		logMessage("mentAll");
		activeLogCounter = activeLogCounter - counter;
		updateActiveLogCounter();
	}
}

function tooltipContent(itemType, buttonType){
	var spend = '';
	var produce = '';
	var cantAfford = false;

	if (buttonType == "mentalize" && itemType && items[itemType]) {
		cantAfford = ideas.mind < 1;
		spend = '-1 <span class="mind">Mind</span>';
		produce = '+1 <span class="'+itemType+'">'+items[itemType].idea+'</span>';
		if (itemType == "mentalize") produce += '<br>+1 <span class="recursion">Recursion</span>';
	} else if (buttonType == "reify" && itemType && items[itemType]) {
		cantAfford = things.matter < 1;
		spend = '-1 <span class="matter">Matter</span>';
		produce = '+1 <span class="'+itemType+'">'+items[itemType].thing+'</span>';
		if (itemType == "reify") produce += '<br>+10 <span class="recursion">Recursion</span>';
	} else if (buttonType == "pulverize" && itemType && items[itemType]) {
		cantAfford = ideas.strength < 1;
		spend = '-1 <span class="strength">Strength</span>';
		produce = '+1 <span class="'+itemType+'">'+items[itemType].dust+'</span>';
		if (itemType == "pulverize") produce += '<br>+100 <span class="recursion">Recursion</span>';
	} else if (buttonType == "purify" && itemType && items[itemType]) {
		cantAfford = ideas.recursion < 1;
		var purifiedKey = items[itemType].purified;
		var purifiedName = purifiedKey && items[purifiedKey] ? items[purifiedKey].idea : purifiedKey;
		spend = '-1 <span class="recursion">Recursion</span>';
		produce = '+1 <span class="'+(purifiedKey||'')+'">'+purifiedName+'</span>';
		if (itemType == "purify") produce += '<br>+10000 <span class="recursion">Recursion</span>';
	} else if (buttonType == "mentAll") {
		var n = $('.logMessage.active').not('.machineU').not('.unlock').length;
		cantAfford = ideas.mind < n;
		spend = '-'+n+' <span class="mind">Mind</span>';
		produce = '+'+n+' <span class="idealSubstance">Ideal Substance</span>';
	} else if (buttonType == "reifyMax") {
		var total = totalImpureIdeas();
		cantAfford = things.matter < total;
		spend = '-'+total+' <span class="matter">Matter</span>';
		var lines = [];
		$.each(ideas, function(id, amount){
			var affordable = Math.min(amount, things.matter);
			if(amount > 0 && items[id] && items[id].type == "impure" && items[id].rarity != "unique" && affordable > 0){
				lines.push('+'+affordable+' <span class="'+id+'">'+items[id].thing+'</span>');
			}
		});
		produce = lines.join('<br>') || '+0';
	} else if (buttonType == "pulverizeMax") {
		var total = totalImpureThings();
		cantAfford = ideas.strength < total;
		spend = '-'+total+' <span class="strength">Strength</span>';
		var lines = [];
		$.each(things, function(id, amount){
			if(amount > 0 && items[id] && items[id].type == "impure"){
				lines.push('+'+amount+' <span class="'+id+'">'+items[id].dust+'</span>');
			}
		});
		produce = lines.join('<br>') || '+0';
	} else if (buttonType == "mentalizeMax") {
		cantAfford = ideas.mind < activeLogCounter;
		spend = '-'+activeLogCounter+' <span class="mind">Mind</span>';
		var lines = [];
		$.each(items, function(id){
			var amount = $('.logMessage.active.'+id).length;
			if(amount > 0){
				lines.push('+'+amount+' <span class="'+id+'">'+items[id].idea+'</span>');
			}
		});
		produce = lines.join('<br>') || '&rarr; Ideas';
	} else if (buttonType == "purifyMax") {
		var total = totalImpureIdeas();
		cantAfford = ideas.recursion < total;
		spend = '-'+total+' <span class="recursion">Recursion</span>';
		var lines = [];
		$.each(ideas, function(id, amount){
			if(amount > 0 && items[id] && items[id].type == "impure" && items[id].rarity != "unique"){
				var purifiedKey = items[id].purified;
				var purifiedName = purifiedKey && items[purifiedKey] ? items[purifiedKey].idea : purifiedKey;
				lines.push('+'+amount+' <span class="'+(purifiedKey||'')+'">'+purifiedName+'</span>');
			}
		});
		produce = lines.join('<br>') || '+0';
	} else if (buttonType == "autoReify") {
		var total = totalImpureIdeas();
		spend = '-'+total+' <span class="will">Will</span>/s<br>-'+total+' <span class="matter">Matter</span>/s';
		var lines = [];
		$.each(ideas, function(id, amount){
			var affordable = Math.min(amount, things.matter);
			if(amount > 0 && items[id] && items[id].type == "impure" && items[id].rarity != "unique" && affordable > 0){
				lines.push('+'+affordable+' <span class="'+id+'">'+items[id].thing+'</span>/s');
			}
		});
		produce = lines.join('<br>') || 'Auto ReifyMax';
	} else if (buttonType == "autoMentalize") {
		spend = '-'+activeLogCounter+' <span class="will">Will</span>/s<br>-'+activeLogCounter+' <span class="mind">Mind</span>/s';
		var lines = [];
		$.each(items, function(id){
			var amount = $('.logMessage.active.'+id).length;
			if(amount > 0){
				lines.push('+'+amount+' <span class="'+id+'">'+items[id].idea+'</span>/s');
			}
		});
		produce = lines.join('<br>') || 'Auto MentalizeMax';
	} else if (buttonType == "autoPulverize") {
		var total = totalImpureThings();
		spend = '-'+total+' <span class="will">Will</span>/s<br>-'+total+' <span class="strength">Strength</span>/s';
		var lines = [];
		$.each(things, function(id, amount){
			if(amount > 0 && items[id] && items[id].type == "impure"){
				lines.push('+'+amount+' <span class="'+id+'">'+items[id].dust+'</span>/s');
			}
		});
		produce = lines.join('<br>') || 'Auto PulverizeMax';
	} else if (buttonType == "autoPurify") {
		var total = totalImpureIdeas();
		spend = '-'+total+' <span class="will">Will</span>/s<br>-'+total+' <span class="recursion">Recursion</span>/s';
		var lines = [];
		$.each(ideas, function(id, amount){
			if(amount > 0 && items[id] && items[id].type == "impure" && items[id].rarity != "unique"){
				var purifiedKey = items[id].purified;
				var purifiedName = purifiedKey && items[purifiedKey] ? items[purifiedKey].idea : purifiedKey;
				lines.push('+'+amount+' <span class="'+(purifiedKey||'')+'">'+purifiedName+'</span>/s');
			}
		});
		produce = lines.join('<br>') || 'Auto PurifyMax';
	} else {
		return { html: '', cantAfford: false };
	}

	var spendClass = 'btn-tooltip-spend' + (cantAfford ? ' cant-afford' : '');
	return { html: '<div class="'+spendClass+'">'+spend+'</div><div class="btn-tooltip-produce">'+produce+'</div>', cantAfford: cantAfford };
}

function showBtnTooltip(el, itemType, buttonType) {
	if (!gameSettings.tooltips) return;
	var result = tooltipContent(itemType, buttonType);
	if (!result.html) return;
	var rect = el.getBoundingClientRect();
	var scrollTop = window.scrollY || document.documentElement.scrollTop;
	$('#btn-tooltip').html(result.html).toggleClass('cant-afford', result.cantAfford).css({ top: 0, left: rect.right + 8 }).show();
	var tipHeight = $('#btn-tooltip').outerHeight();
	$('#btn-tooltip').css('top', rect.top + scrollTop + rect.height / 2 - tipHeight / 2);
}

function button(appendTo, itemType, buttonType){
	if ($(appendTo + ' .button.' + buttonType).length > 0) return;
	$(appendTo).append('<div class="button '+buttonType+'" data-btn-type="'+buttonType+'" data-item-type="'+(itemType||'')+'">'+buttons[buttonType].label+'</div></div>')
	$(appendTo + ' .button').on( "click", function() {
		if(buttons[buttonType].action == "want"){
			logMessage("want");
	if(showStatus.log == "locked"){
		showStatus.log = "unlocked"
		$('#log').fadeIn();
		updatePowerCounter("mind");
		updatePowerCounter("matter");
		updatePowerCounter("strength");
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
	$('.'+type+'.'+id+' .counter .amount').html(formatNumber(window[type][id]));
}

function updateActiveLogCounter(){
	$('.mentAll .counter .number').html(Math.floor(activeLogCounter));
};

$(document).bind('keydown', function (event) {
	if (event.key == "f") {
		logMessage("respect");
	}
});

$(function() {
	$('body').append('<div id="btn-tooltip" style="display:none;"></div>');
	$(document).on('mouseenter', '.button[data-btn-type]', function() {
		console.log('TOOLTIP hover:', $(this).data('btn-type'), $(this).data('item-type'), this);
		var btnType = $(this).data('btn-type');
		var itemType = $(this).data('item-type') || null;
		showBtnTooltip(this, itemType, btnType);
	}).on('mouseleave', '.button[data-btn-type]', function() {
		$('#btn-tooltip').hide().removeClass('cant-afford');
	});
});
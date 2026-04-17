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
		if (typeof mobileRefreshColumns === 'function') mobileRefreshColumns();
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
				<div class="oracle-gauge ${fixedDust}" data-dust-type="${fixedDust}"><span class="${fixedDust}">${items[fixedDust].dust}</span> <span class="fuel">${alchemyDustGauge[fixedDust]}</span>/<span class="gauge">${alchemyDustGaugeSize}</span> <div class="gaugeDraw"><div class="fuelDraw"></div></div> <div class="button addAlchemyDust small">+10</div></div>
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
			<div class="oracle-gauge water"><span class="water">W</span> <span class="fuel"></span>/<span class="gauge"></span> <div class="gaugeDraw"><div class="fuelDraw"></div></div> <div class="button addWater water small">+10</div></div>
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

		} else if(subMachines[sub].class == "binder") {
			$(`.subMachine#${sub} .machinery`).append(`
				<div class="text">Bind <span class="paper">Paper</span> + <span class="leather">Leather</span> into a <span class="book">Book</span></div>
				<div id="bind" class="button"><span id="text">Bind</span></div>`);

			$(`#${sub} #bind`).on("click", function(){
				bindBook();
			});

		} else if(subMachines[sub].class == "writer") {
			$(`.subMachine#${sub} .machinery`).append(`
				<div class="selectors">
					<div id="writerBaseSelector" class="selector custom-select"><div class="selected">Paper or Book...</div><div class="options"></div></div> +
					<div id="writerTopicSelector" class="selector custom-select"><div class="selected">Topic...</div><div class="options"></div></div>
				</div>
				<div id="writerResult">???</div>
				<div class="oracle-gauge ink" data-dust-type="ink"><span class="ink">Ink</span> <span class="fuel">${writerGauge.ink}</span>/<span class="gauge">${writerGaugeSize}</span> <div class="gaugeDraw"><div class="fuelDraw"></div></div> <div class="button addWriterFuel small">+5</div></div>
				<div id="writeBook" class="button"><span id="text">Can't Write</span></div>`);
			populateSelector(`#${sub} #writerBaseSelector`, "writerBase");

			updateWriterGauge();

			var $topicSel = $(`#${sub} #writerTopicSelector`);
			var writerTopics = [
				{ value: "distillery", label: "Distillation", ingredient: "water" },
				{ value: "mindForge", label: "Mind", ingredient: "thought" },
				{ value: "soulForge", label: "Soul", ingredient: "will" },
				{ value: "fleshForge", label: "Flesh", ingredient: "primaMateria" },
				{ value: "artifacts", label: "Artifacts", ingredient: "matter" }
			];
			$.each(writerTopics, function(i, t){
				$topicSel.find('.options').append('<div class="option" data-value="' + t.value + '">' + t.label + '</div>');
			});
			var $topicOpts = $topicSel.find('.options');
			$topicOpts.data('parent', $topicSel);
			$topicSel.find('.selected').on('click', function(e){
				e.stopPropagation();
				closeAllDropdowns();
				var rect = this.getBoundingClientRect();
				$topicOpts.detach().appendTo('body');
				$topicOpts.css({ left: rect.left + 'px', bottom: (window.innerHeight - rect.top) + 'px' });
				$topicOpts.addClass('open');
				$topicSel.closest('.machine.box').addClass('dropdown-open');
			});

			$(`#${sub} .addWriterFuel`).on("click", function(){
				if(writerGauge.ink + 5 <= writerGaugeSize && pay("things", "ink", 5)){
					writerGauge.ink += 5;
					updateWriterGauge();
				}
			});

			$(`#${sub}`).on("customchange", ".selector", function() {
				var baseId = $(`#${sub} #writerBaseSelector`).data('value');
				var topic = $(`#${sub} #writerTopicSelector`).data('value');
				if(baseId && topic){
					var prefix = (baseId == "book") ? "Book" : "Scroll";
					var topicLabel = writerTopics.find(function(t){ return t.value === topic; });
					$(`#${sub} #writerResult`).html(prefix + " of " + topicLabel.label);
					$(`#${sub} #writeBook #text`).html('Write');
				} else {
					$(`#${sub} #writerResult`).html("???");
					$(`#${sub} #writeBook #text`).html("Can't Write");
				}
			});

			$(`#${sub} #writeBook`).on("click", function(){
				var baseId = $(`#${sub} #writerBaseSelector`).data('value');
				var topic = $(`#${sub} #writerTopicSelector`).data('value');
				if(baseId && topic) writeBook(baseId, topic);
			});

		} else if(subMachines[sub].class == "learner") {
			$(`.subMachine#${sub} .machinery`).append(`
				<div class="selectors text">Study <div id="learnerSelector" class="selector custom-select inline"><div class="selected">Book or Scroll...</div><div class="options"></div></div></div>
				<div id="learnerResult" class="athenaeum-result">???</div>
				<div class="oracle-gauge separate" data-dust-type="separate"><span class="separate">${items.separate.dust}</span> <span class="fuel">${learnerGauge.separate}</span>/<span class="gauge">${learnerGaugeSize}</span> <div class="gaugeDraw"><div class="fuelDraw"></div></div> <div class="button addLearnerFuel small">+5</div></div>
				<div id="study" class="button"><span id="text">Can't Study</span></div>`);
			populateSelector(`#${sub} #learnerSelector`, "writtenItem");

			updateLearnerGauge();

			$(`#${sub} .addLearnerFuel`).on("click", function(){
				if(learnerGauge.separate + 5 <= learnerGaugeSize && pay("dusts", "separate", 5)){
					learnerGauge.separate += 5;
					updateLearnerGauge();
				}
			});

			$(`#${sub}`).on("customchange", ".selector", function() {
				var selected = $(`#${sub} #learnerSelector`).data('value');
				$(`#${sub} #learnerResult`).html('???');
				if(selected && canLearn(selected)){
					$(`#${sub} #study #text`).html('Study');
				} else {
					$(`#${sub} #study #text`).html("Can't Study");
				}
			});

			$(`#${sub} #study`).on("click", function(){
				var selected = $(`#${sub} #learnerSelector`).data('value');
				if(selected && canLearn(selected)) learnFromBook(selected);
			});

		} else if(subMachines[sub].class == "athenaeum") {
			$(`.subMachine#${sub} .machinery`).append(`
			<div class="selectors text">Study <div id="athenaeumSelector" class="selector custom-select inline"><div class="selected">---</div><div class="options"></div></div></div>
			<div id="athenaeumResult" class="oracle-result">???</div>
			<div class="oracle-gauge"><span class="mentalize">${items.mentalize.dust}</span> <span class="fuel">${oracleGauge.mentalize}</span>/<span class="gauge">${oracleGaugeSize}</span> <div class="gaugeDraw"><div class="fuelDraw"></div></div> <div class="button addAthenaeumFuel mentalize small">+5</div></div>
			<div id="athenaeumStudy" class="button"><span id="text">Can't Study</span></div>`);
			populateSelector(`#${sub} #athenaeumSelector`, "oracle");

			updateAthenaeumGauge();

			$(`#${sub} .addAthenaeumFuel`).on("click", function(){
				if(oracleGauge.mentalize + 5 <= oracleGaugeSize && pay("dusts", "mentalize", 5)){
					oracleGauge.mentalize += 5;
					updateAthenaeumGauge();
				}
			});

			$(`#${sub}`).on("customchange", ".selector", function() {
				var selected = $(`#${sub} #athenaeumSelector`).data('value');
				if(selected && canStudy(selected)){
					$(`#${sub} #athenaeumStudy #text`).html('Study');
				} else {
					$(`#${sub} #athenaeumStudy #text`).html("Can't Study");
				}
			});

			$(`#${sub} #athenaeumStudy`).on("click", function(){
				var selected = $(`#${sub} #athenaeumSelector`).data('value');
				if(selected && canStudy(selected)) consultAthenaeum(selected);
			});

		} else if(subMachines[sub].class == "articrafter") {
			$(`.subMachine#${sub} .machinery`).append(`
			<div class="selectors forge-selectors"><div id="selector1" class="selector custom-select"><div class="selected">---</div><div class="options"></div></div> + <div id="selector2" class="selector custom-select"><div class="selected">---</div><div class="options"></div></div> + <div id="selector3" class="selector custom-select"><div class="selected">---</div><div class="options"></div></div> + <div id="selector4" class="selector custom-select"><div class="selected">---</div><div class="options"></div></div></div>
			<div id="result">???</div>
			<div id="articraft" class="button"><span id="text">Can't Craft</span></div>`);
			populateSelector(`#${sub} #selector1`, "artifactIngredient");
			populateSelector(`#${sub} #selector2`, "artifactIngredient");
			populateSelector(`#${sub} #selector3`, "artifactIngredient");
			populateSelector(`#${sub} #selector4`, "artifactPrestige");

			$(`#${sub}`).on("customchange", ".selector", function() {
				var rec = artifactRecipe($(`#${sub} #selector1`).data('value'), $(`#${sub} #selector2`).data('value'), $(`#${sub} #selector3`).data('value'), $(`#${sub} #selector4`).data('value'));
				if(rec){
					var resultName = isNameKnown(rec) ? items[rec].thing : "Something...";
					$(`#${sub} #result`).html(resultName).removeClass().addClass(rec);
					$(`#${sub} #articraft #text`).html('Craft').removeClass().addClass(rec);
				} else {
					$(`#${sub} #result`).removeClass().html("???");
					$(`#${sub} #articraft #text`).removeClass().html("Can't Craft");
				}
			});

			$(`#${sub} #articraft`).on("click", function(){
				var rec = artifactRecipe($(`#${sub} #selector1`).data('value'), $(`#${sub} #selector2`).data('value'), $(`#${sub} #selector3`).data('value'), $(`#${sub} #selector4`).data('value'));
				if(rec) articraft(rec);
			});

		} else if(subMachines[sub].class == "atelier") {
			$(`.subMachine#${sub} .machinery`).append(`
			<div class="text"><span class="canvas">Canvas</span> + <span class="paint">Paint</span> → <span class="masterpiece">Masterpiece</span></div>
			<div class="oracle-gauge imagination"><span class="imagination">Imagination</span> <span class="fuel">${atelierFuel.imagination}</span>/<span class="gauge">10</span> <div class="gaugeDraw"><div class="fuelDraw"></div></div> <div class="button addAtelierFuel small">+1</div></div>
			<div id="atelierCraft" class="button"><span id="text">Can't Craft</span></div>`);

			updateAtelierGauge();

			$(`#${sub} .addAtelierFuel`).on("click", function(){
				if(atelierFuel.imagination < 10 && pay("ideas", "imagination", 1)){
					atelierFuel.imagination++;
					updateAtelierGauge();
				}
			});

			$(`#${sub} #atelierCraft`).on("click", function(){
				atelierCraft();
				updateAtelierGauge();
			});

		} else if(subMachines[sub].class == "chapel") {
			$(`.subMachine#${sub} .machinery`).append(`
			<div class="text"><span class="faith">Faith</span> + <span class="devotion">Devotion</span> → <span class="spirit">Spirit</span></div>
			<div class="oracle-gauge blessedOil"><span class="blessedOil">Blessed Oil</span> <span class="fuel">${chapelFuel.blessedOil}</span>/<span class="gauge">10</span> <div class="gaugeDraw"><div class="fuelDraw"></div></div> <div class="button addChapelFuel small">+1</div></div>
			<div id="chapelCraft" class="button"><span id="text">Can't Craft</span></div>`);

			updateChapelGauge();

			$(`#${sub} .addChapelFuel`).on("click", function(){
				if(chapelFuel.blessedOil < 10 && pay("liquids", "blessedOil", 1)){
					chapelFuel.blessedOil++;
					updateChapelGauge();
				}
			});

			$(`#${sub} #chapelCraft`).on("click", function(){
				chapelCraft();
				updateChapelGauge();
			});

		} else if(subMachines[sub].class == "abyss") {
			$(`.subMachine#${sub} .machinery`).append(`
			<div class="text"><span class="failAlchemize">Faildust</span> + <span class="goo">Goo</span> + <span class="failure">Failure</span> → <span class="sin">Sin</span></div>
			<div class="oracle-gauge evil"><span class="evil">Evil</span> <span class="fuel">${abyssFuel.evil}</span>/<span class="gauge">10</span> <div class="gaugeDraw"><div class="fuelDraw"></div></div> <div class="button addAbyssFuel small">+1</div></div>
			<div id="abyssCraft" class="button"><span id="text">Can't Craft</span></div>`);

			updateAbyssGauge();

			$(`#${sub} .addAbyssFuel`).on("click", function(){
				if(abyssFuel.evil < 10 && pay("ideas", "evil", 1)){
					abyssFuel.evil++;
					updateAbyssGauge();
				}
			});

			$(`#${sub} #abyssCraft`).on("click", function(){
				abyssCraft();
				updateAbyssGauge();
			});
		}
});

// Book modal handler
$('#bookPageClose').on("click", function(){ $('#bookPageModal').hide(); });

// Library button in header
$('#headerButtons').prepend('<div id="libraryButton" class="libraryIcon" style="display:none"></div>');
$('#libraryButton').on("click", function(){
	if(libraryPageStatus === 'hidden') openLibrary();
	else closeLibrary();
});
var hasBookProgress = false;
$.each(bookProgress, function(k, v){ if(v > 0) hasBookProgress = true; });
if(hasBookProgress) $('#libraryButton').show();

$('.subMachine .collapse').click(function() {
	$(this).parent().parent().parent().parent().toggleClass("collapsed");
});
$(document).on('click', '.fm-collapse', function(e) {
	e.stopPropagation();
	var $fm = $(this).closest('.finalMachine');
	var id = $fm.attr('id');
	if (id == 'enminder' && enmindingActive) return;
	if (id == 'ensouler' && ensoulingActive) return;
	if (id == 'altar' && creatingHuman) return;
	$fm.toggleClass('fm-collapsed');
});
$(document).on('click', '.finalMachine.fm-collapsed', function() {
	$(this).removeClass('fm-collapsed');
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

function selectorPlaceholder(kind, category){
	if(kind == "alcheminder") return "Idea...";
	if(kind == "alchematter") return "Thing...";
	if(kind == "alchemizer") return category == "idea" ? "Idea..." : "Thing...";
	if(kind == "alchemaxer") return "Item...";
	if(kind == "all") return "Item...";
	if(kind == "dust") return "Dust...";
	if(kind == "forgeIdea") return "Idea...";
	if(kind == "forgeThing") return "Thing...";
	if(kind == "forgeSoulAny") return "Item...";
	if(kind == "forgeThingT2") return "Thing...";
	if(kind == "forgeIdeaT1") return "Idea...";
	if(kind == "oracle") return "Element...";
	if(kind == "enminderMind") return "Mind...";
	if(kind == "ensoulerSoul") return "Soul...";
	if(kind == "writerBase") return "Paper or Book...";
	if(kind == "writtenItem") return "Book or Scroll...";
	if(kind == "artifact") return "Artifact...";
	if(kind == "artifactIngredient") return "Item...";
	if(kind == "artifactPrestige") return "Prestige...";
	return "---";
}

function itemMatchesSelector(id, item, type, kind){
	if(kind == "alcheminder" && type == "idea" && item.idea && item.type == "pure" && !item.subtype && !item.prestige && !item.distilled && isNameSeen(id)) return true;
	if(kind == "alchematter" && type == "thing" && item.thing && item.type == "pure" && !item.subtype && !item.prestige && !item.distilled && isNameSeen(id)) return true;
	if(kind == "alchemizer" && item[type] && (item.idea || item.thing) && item.type == "pure" && !item.subtype && !item.prestige && !item.distilled && isNameSeen(id)) return true;
	if(kind == "alchemaxer" && item[type] && (item.idea || item.thing) && item.type == "pure" && !item.prestige && !item.distilled && (!item.subtype || (item.subtype == "alchemified" && isAlchemyTier(id) == 1)) && isNameSeen(id)) return true;
	if(kind == "all" && item[type] && item.type == "pure" && isNameSeen(id)) return true;
	if(kind == "dust" && type == "dust" && item.dust && item.type == "impure") return true;
	if(kind == "forgeIdea" && type == "idea" && item.idea && item.type == "pure" && item.subtype == "alchemified" && isAlchemyTier(id) == 2) return true;
	if(kind == "forgeThing" && type == "thing" && item.thing && item.type == "pure" && isForgeThirdSlot(id)) return true;
	if(kind == "forgeSoulAny" && (type == "idea" || type == "thing") && item[type] && item.type == "pure" && isForgeThirdSlot(id)) return true;
	if(kind == "forgeThingT2" && type == "thing" && item.thing && item.type == "pure" && item.subtype == "alchemified" && isAlchemyTier(id) == 2 && isForgeIngredient(id)) return true;
	if(kind == "forgeIdeaT1" && type == "idea" && item.idea && item.type == "pure" && item.subtype == "alchemified" && isAlchemyTier(id) == 1) return true;
	if(kind == "enminderMind" && type == "idea" && item.idea && item.subtype == "essence" && id.includes("Mind")) return true;
	if(kind == "ensoulerSoul" && type == "idea" && item.idea && item.subtype == "essence" && id.includes("Soul")) return true;
	if(kind == "oracle" && item[type] && item.type == "pure" && isNameSeen(id)) return true;
	// Book system selectors
	if(kind == "writerBase" && type == "thing" && (id == "paper" || id == "book") && isNameSeen(id)) return true;
	if(kind == "writtenItem" && type == "thing" && item.subtype == "book" && item.bookTopic && isNameSeen(id)) return true;
	if(kind == "artifact" && type == "thing" && item.type == "artifact" && isNameSeen(id)) return true;
	if(kind == "artifactIngredient" && item[type] && item.type == "pure" && !item.prestige && isNameSeen(id) && isArtifactIngredient(id)) return true;
	if(kind == "artifactPrestige" && item[type] && item.type == "pure" && item.prestige && isNameSeen(id) && isArtifactIngredient(id)) return true;
	return false;
}

function populateSelector(selector, kind, category){
	let $sel = $(selector);
	let placeholder = selectorPlaceholder(kind, category);
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

/* ARTIFACT HELPERS */

function isArtifactIngredient(id) {
	for (var key in items) {
		if (items[key].type == "artifact" && items[key].ingredients && items[key].ingredients.indexOf(id) !== -1) return true;
	}
	return false;
}

function artifactRecipe(...ingredients) {
	var filled = ingredients.filter(function(v){ return v; });
	if (filled.length < 3) return null;
	var sorted = filled.slice().sort();
	for (var key in items) {
		if (items[key].type == "artifact" && items[key].ingredients) {
			var recSorted = items[key].ingredients.slice().sort();
			if (recSorted.length == sorted.length && sorted.every(function(v, i){ return v === recSorted[i]; })) {
				return key;
			}
		}
	}
	return null;
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
				logMessage("consult");
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

/* ATHENAEUM */

var athenaeumConsultingActive = null;
var athenaeumConsultingInterval = null;

function consultAthenaeum(element) {
	if (athenaeumConsultingActive) return;
	if (!canStudy(element)) return;
	if (oracleGauge.mentalize >= oracleGaugeSize) {
		athenaeumConsultingActive = element;
		$('#oracle .selector').addClass('disabled');
		$('#oracle #athenaeumStudy').addClass('disabled');
		updateAthenaeumProgress();
		athenaeumConsultingInterval = setInterval(function(){
			if (oracleGauge.mentalize > 0) {
				oracleGauge.mentalize--;
				updateAthenaeumGauge();
				updateAthenaeumProgress();
			}
			if (oracleGauge.mentalize <= 0) {
				clearInterval(athenaeumConsultingInterval);
				athenaeumConsultingInterval = null;
				let pairings = findPairings(athenaeumConsultingActive);
				let selected = items[athenaeumConsultingActive];
				let isAlch = selected && selected.subtype == "alchemified" && selected.ingredients && selected.ingredients.length >= 2;
				let showCreatedFrom = isAlch && (pairings.length == 0 || Math.random() < 0.5);
				if(showCreatedFrom){
					let ing = selected.ingredients[Math.floor(Math.random() * selected.ingredients.length)];
					let t = evalType(ing);
					let name = items[ing][t.slice(0, -1)];
					seeName(ing);
					$('#oracle #athenaeumResult').html(`<span class="oracle-label">Created from</span> <span class="${ing}">${name}</span>`);
				} else {
					let p = pairings[Math.floor(Math.random() * pairings.length)];
					let type = evalType(p.partner);
					let name = items[p.partner][type.slice(0, -1)];
					seeName(p.partner);
					$('#oracle #athenaeumResult').html(`<span class="oracle-label">Pairs with</span> <span class="${p.partner}">${name}</span>`);
				}
				logMessage("study");
				athenaeumConsultingActive = null;
				$('#oracle .selector').removeClass('disabled');
				$('#oracle #athenaeumStudy').removeClass('disabled');
			}
		}, 1000);
	}
}

function updateAthenaeumGauge() {
	var pct = oracleGauge.mentalize / oracleGaugeSize * 100;
	$('#oracle .fuel').html(oracleGauge.mentalize);
	$('#oracle .gauge').html(oracleGaugeSize);
	$('#oracle .fuelDraw').css("width", pct + "%");
}

function updateAthenaeumProgress() {
	if (athenaeumConsultingActive) {
		var pct = Math.floor((1 - oracleGauge.mentalize / oracleGaugeSize) * 100);
		$('#oracle #athenaeumResult').html('<span class="oracle-pct">' + pct + '%</span>');
	}
}

/* PRESTIGE MACHINE GAUGES */

function updateAtelierGauge() {
	var pct = atelierFuel.imagination / 10 * 100;
	$('.subMachine.atelier .fuel').html(atelierFuel.imagination);
	$('.subMachine.atelier .fuelDraw').css("width", pct + "%");
}

function updateChapelGauge() {
	var pct = chapelFuel.blessedOil / 10 * 100;
	$('.subMachine.chapel .fuel').html(chapelFuel.blessedOil);
	$('.subMachine.chapel .fuelDraw').css("width", pct + "%");
}

function updateAbyssGauge() {
	var pct = abyssFuel.evil / 10 * 100;
	$('.subMachine.abyss .fuel').html(abyssFuel.evil);
	$('.subMachine.abyss .fuelDraw').css("width", pct + "%");
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
			logMessage("forge");
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
					logMessage("distill");
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
	$(`#${sub} .oracle-gauge .fuel`).html(amount);
	$(`#${sub} .oracle-gauge .gauge`).html(alchemyDustGaugeSize);
	$(`#${sub} .oracle-gauge .fuelDraw`).css("width", pct + "%");
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

/* BINDER / WRITER / LEARNER */

var writerGauge = { ink: 0 };
var writerGaugeSize = 25;
var writingActive = null;
var writingInterval = null;

var learnerGauge = { separate: 0 };
var learnerGaugeSize = 25;
var learningActive = null;
var learningInterval = null;

var writerTopicMap = {
	distillery: { ingredient: "water", bookKey: "bookDistillery", scrollKey: "scrollDistillery" },
	mindForge: { ingredient: "thought", bookKey: "bookMind", scrollKey: "scrollMind" },
	soulForge: { ingredient: "will", bookKey: "bookSoul", scrollKey: "scrollSoul" },
	fleshForge: { ingredient: "primaMateria", bookKey: "bookFlesh", scrollKey: "scrollFlesh" },
	artifacts: { ingredient: "matter", bookKey: "bookArtifacts", scrollKey: "scrollArtifacts" }
};

var bookPages = {
	distillery: [
		{ result: "liquor", ingredients: ["mentalize", "separate"], desc: "When the dust of thought meets the dust of separation within the Distillery's waters, they dissolve into one another and yield a potent Liquor, the liquid residue of a mind taken apart and made whole again." },
		{ result: "mana", ingredients: ["purify", "alchemize"], desc: "Pour the dust of purity together with the dust of alchemy into the Distillery, and the waters will carry forth Mana, a luminous essence that hums with the memory of transformation itself." },
		{ result: "preserver", ingredients: ["reify", "destroy"], desc: "The dust of matter and the dust of entropy, when distilled through water, produce the Preserver. It is a heavy, still liquid that holds things exactly as they are, suspending decay in an embrace of permanence." }
	],
	mindForge: [
		{ result: "rationalMind", ingredients: ["consciousness", "reason", "light"], desc: "Bring Consciousness and Reason together in the Mind Forge, and illuminate them with Light. From this union emerges the Rational Mind, a crystalline thought that sees the world as it truly is, stripped of illusion." },
		{ result: "creativeMind", ingredients: ["consciousness", "imagination", "fire"], desc: "Set Consciousness alongside Imagination in the Mind Forge, and kindle them with Fire. The Creative Mind is born in the blaze, a restless spark that shapes the world not as it is, but as it could become." },
		{ result: "madMind", ingredients: ["consciousness", "corruption", "storm"], desc: "Let Consciousness be touched by Corruption within the Mind Forge, and unleash a Storm upon the union. What remains is the Mad Mind, a fractured brilliance that sees truths others cannot bear to look upon." }
	],
	soulForge: [
		{ result: "braveSoul", ingredients: ["passion", "sacrifice", "magma"], desc: "Feed Passion and Sacrifice into the Soul Forge, and let Magma be their crucible. From the molten heart of this offering rises the Brave Soul, the burning resolve of one who walks toward danger without flinching." },
		{ result: "lovingSoul", ingredients: ["devotion", "innocence", "air"], desc: "Place Devotion beside Innocence in the Soul Forge, and let the gentleness of Air carry them into unity. The Loving Soul drifts forth, tender, unwavering, and boundless in its quiet strength." },
		{ result: "darkSoul", ingredients: ["corruption", "grief", "void"], desc: "When Corruption and Grief are forged together in the presence of the Void, the Soul Forge yields the Dark Soul. It is a heavy, silent thing that has looked into the abyss and chosen to remain." }
	],
	fleshForge: [
		{ result: "flesh", ingredients: ["blood", "marrow", "breath"], desc: "The Flesh Forge demands three offerings: Blood to carry life, Marrow to give it structure, and Breath to set it in motion. Together they weave into Flesh, the vessel through which all mortal things walk the world." }
	],
	artifacts: [
		{ result: "ember", ingredients: ["ash", "spark", "thought", "clarity"], desc: "Gather the Ash of what has burned away, a single Spark of inspiration, a fragment of Thought, and the stillness of Clarity. The Articrafter will press them into the Ember, a glowing remnant that refuses to go cold." },
		{ result: "echo", ingredients: ["resonance", "dream", "recursion", "spirit"], desc: "Bring Resonance, Dream, Recursion and Spirit to the Articrafter. From their meeting comes the Echo, a sound that repeats long after its source has fallen silent, carrying meaning through the hollows of time." },
		{ result: "root", ingredients: ["soil", "loyalty", "faith", "leather"], desc: "Offer Soil, Loyalty, Faith and Leather to the Articrafter. The Root takes shape, deep and tenacious. It anchors itself in the earth and will not be moved, drawing strength from the ground beneath." },
		{ result: "tear", ingredients: ["dew", "grief", "innocence", "elixir"], desc: "Bring Dew, Grief, Innocence and Elixir together in the Articrafter. A single Tear forms, not of sorrow alone, but of the kind of feeling so vast it can only leave the body as water." },
		{ result: "shard", ingredients: ["splinter", "fear", "crystal", "sin"], desc: "Place a Splinter, Fear, Crystal and Sin upon the Articrafter's table. The Shard emerges, a jagged fragment of something once whole, sharp enough to cut through pretense and lay bare what lies beneath." },
		{ result: "sigil", ingredients: ["glyph", "evil", "obsidian", "beads"], desc: "Lay down a Glyph, Evil, Obsidian and Beads before the Articrafter. The Sigil is inscribed, a dark mark that binds power into form, ancient and deliberate in its purpose." },
		{ result: "crown", ingredients: ["halo", "philosophy", "awe", "gold"], desc: "Present a Halo, Philosophy, Awe and Gold to the Articrafter. The Crown is forged, not merely worn upon the head, but upon the spirit, a circle of authority earned through understanding." },
		{ result: "veil", ingredients: ["mist", "madness", "storm", "courage"], desc: "Gather Mist, Madness, Storm and Courage for the Articrafter. The Veil is woven, thin as breath. It hangs between what is seen and what is hidden, and only the bold may part it." },
		{ result: "wreath", ingredients: ["seed", "creation", "mud"], desc: "The Articrafter asks only for a Seed, the idea of Creation, and humble Mud. From these simple things the Wreath is formed, a circle of growth that honours the quiet persistence of life beginning again." }
	]
};

var bookTopicNames = {
	distillery: "Distillation",
	mindForge: "Mind",
	soulForge: "Soul",
	fleshForge: "Flesh",
	artifacts: "Artifacts"
};

var bookProgress = {};

function bindBook() {
	if(pay("things", "paper", 1) && pay("things", "leather", 1)) {
		acquire("things", "book", 1);
		logMessage("bind");
	}
}

function writeBook(baseId, topic) {
	if(writingActive) return;
	var topicInfo = writerTopicMap[topic];
	if(!topicInfo) return;
	if(writerGauge.ink < writerGaugeSize) return;
	var ingType = evalType(topicInfo.ingredient);
	if(pay("things", baseId, 1) && pay(ingType, topicInfo.ingredient, 1)) {
		writingActive = { baseId: baseId, topic: topic };
		$('.subMachine.writer .selector').addClass('disabled');
		$('#writeBook').addClass('disabled');
		updateWriterProgress();
		writingInterval = setInterval(function(){
			if(writerGauge.ink > 0) {
				writerGauge.ink--;
				updateWriterGauge();
				updateWriterProgress();
			}
			if(writerGauge.ink <= 0) {
				clearInterval(writingInterval);
				writingInterval = null;
				var isBook = (writingActive.baseId == "book");
				var resultKey = isBook ? topicInfo.bookKey : topicInfo.scrollKey;
				acquire("things", resultKey, 1);
				logMessage("write");
				writingActive = null;
				$('.subMachine.writer .selector').removeClass('disabled');
				$('#writeBook').removeClass('disabled');
			}
		}, 1000);
	}
}

function updateWriterGauge() {
	var pct = writerGauge.ink / writerGaugeSize * 100;
	$('.subMachine.writer .oracle-gauge .fuel').html(writerGauge.ink);
	$('.subMachine.writer .oracle-gauge .gauge').html(writerGaugeSize);
	$('.subMachine.writer .oracle-gauge .fuelDraw').css("width", pct + "%");
}

function updateWriterProgress() {
	if(writingActive) {
		var pct = Math.floor((1 - writerGauge.ink / writerGaugeSize) * 100);
		$('.subMachine.writer #writerResult').html('<span class="athenaeum-pct">' + pct + '%</span>');
	}
}

function canLearn(bookId) {
	if(!items[bookId] || !items[bookId].bookTopic) return false;
	var topic = items[bookId].bookTopic;
	var pages = bookPages[topic];
	if(!pages) return false;
	var progress = bookProgress[topic] || 0;
	if(progress >= pages.length) return false;
	return true;
}

function learnFromBook(bookId) {
	if(learningActive) return;
	if(!canLearn(bookId)) return;
	if(learnerGauge.separate >= learnerGaugeSize) {
		learningActive = bookId;
		$('.subMachine.learner .selector').addClass('disabled');
		$('#study').addClass('disabled');
		updateLearnerProgress();
		learningInterval = setInterval(function(){
			if(learnerGauge.separate > 0) {
				learnerGauge.separate--;
				updateLearnerGauge();
				updateLearnerProgress();
			}
			if(learnerGauge.separate <= 0) {
				clearInterval(learningInterval);
				learningInterval = null;
				var item = items[learningActive];
				var topic = item.bookTopic;
				var isBook = item.isBook;
				var pages = bookPages[topic];
				var progress = bookProgress[topic] || 0;
				if(progress < pages.length) {
					var page = pages[progress];
					page.ingredients.forEach(function(ing){ seeName(ing); });
					seeName(page.result);
					bookProgress[topic] = progress + 1;
					showBookPage(topic, page, progress + 1, pages.length);
					if(isBook) {
						// Track book-specific progress for library
						bookProgress[topic + '_book'] = (bookProgress[topic + '_book'] || 0) + 1;
						$('#libraryButton').show();
					}
					$('.subMachine.learner #learnerResult').html('<span class="athenaeum-label">Page learned!</span>');
				}
				logMessage("learn");
				// Consume scrolls but not books
				if(!isBook) {
					pay("things", learningActive, 1);
				}
				learningActive = null;
				$('.subMachine.learner .selector').removeClass('disabled');
				$('#study').removeClass('disabled');
			}
		}, 1000);
	}
}

function itemDisplayName(id) {
	var item = items[id];
	if(!item) return id;
	return item.idea || item.thing || item.liquid || item.dust || id;
}

function showBookPage(topic, page, pageNum, totalPages) {
	var topicName = bookTopicNames[topic] || topic;
	var resultName = itemDisplayName(page.result);
	$('#bookPageModal .book-page-topic').text("Book of " + topicName);
	$('#bookPageModal .book-page-title').html(resultName);
	$('#bookPageModal .book-page-desc').text(page.desc);
	$('#bookPageModal .book-page-number').text("Page " + pageNum + " of " + totalPages);
	$('#bookPageModal').css('display', 'flex');
}

function updateLearnerGauge() {
	var pct = learnerGauge.separate / learnerGaugeSize * 100;
	$('.subMachine.learner .oracle-gauge .fuel').html(learnerGauge.separate);
	$('.subMachine.learner .oracle-gauge .gauge').html(learnerGaugeSize);
	$('.subMachine.learner .oracle-gauge .fuelDraw').css("width", pct + "%");
}

function updateLearnerProgress() {
	if(learningActive) {
		var pct = Math.floor((1 - learnerGauge.separate / learnerGaugeSize) * 100);
		$('.subMachine.learner #learnerResult').html('<span class="athenaeum-pct">' + pct + '%</span>');
	}
}

/* LIBRARY PAGE */

var libraryPageStatus = 'hidden';
var libraryOpenBook = null;
var libraryOpenPage = 0;

var bookSpineColors = {
	distillery: '#1a5276',
	mindForge: '#1a6b5a',
	soulForge: '#6b1a4a',
	fleshForge: '#6b2a1a',
	artifacts: '#5a4a1a'
};

function buildLibraryPage() {
	$('#container').prepend('<div id="libraryPage" style="display:none"></div>');
}
buildLibraryPage();

function openLibrary() {
	if(typeof closeSettings === 'function') closeSettings();
	if(typeof closeTree === 'function') closeTree();
	if(typeof closeHumans === 'function') closeHumans();
	if(typeof closeArtifacts === 'function') closeArtifacts();
	libraryPageStatus = 'shown';
	$('#libraryButton').removeClass('libraryIcon').addClass('back');
	$('#wrapper').hide();
	$('#machines').hide();
	$('#finalMachines').hide();
	$('#stickmanCanvas').hide();
	$('#libraryPage').show();
	if (typeof mobileHideGameUI === 'function') mobileHideGameUI();
	renderBookcase();
}

function closeLibrary() {
	libraryPageStatus = 'hidden';
	$('#libraryButton').addClass('libraryIcon').removeClass('back');
	$('#libraryPage').hide();
	$('#wrapper').show();
	if(typeof showStatus !== 'undefined' && showStatus.machines === 'unlocked') $('#machines').show();
	if($('#container').hasClass('has-final-machines')) $('#finalMachines').show();
	$('#stickmanCanvas').show();
	if (typeof mobileShowGameUI === 'function') mobileShowGameUI();
}

window.closeLibrary = closeLibrary;

function renderBookcase() {
	var $page = $('#libraryPage');
	$page.empty();
	var $case = $('<div class="bookcase"></div>');
	var $shelf = $('<div class="bookcase-shelf"></div>');

	$.each(bookPages, function(topic, pages){
		var topicName = bookTopicNames[topic] || topic;
		var color = bookSpineColors[topic] || '#4a3a2a';
		var bookPagesLearned = getBookPagesLearned(topic);

		var $book = $('<div class="bookcase-book"></div>');
		var $spine = $('<div class="bookcase-spine"></div>').css('background', 'linear-gradient(to right, ' + color + ', ' + lightenColor(color, 20) + ', ' + color + ')');
		var $title = $('<div class="bookcase-spine-title"></div>').text(topicName);
		$spine.append($title);
		$book.append($spine);
		$book.append($('<div class="bookcase-label"></div>').text(topicName));
		$book.append($('<div class="bookcase-progress"></div>').text(bookPagesLearned + ' / ' + pages.length));

		if(bookPagesLearned > 0) {
			$book.css('cursor', 'pointer');
			$book.on('click', function(){ openBookView(topic); });
		} else {
			$book.css({ cursor: 'default', opacity: 0.4 });
		}

		$case.append($book);
	});

	$page.append($case);
	$page.append($shelf);
	$page.append('<div class="library-book-view"></div>');
}

function getBookPagesLearned(topic) {
	return (bookProgress[topic + '_book'] || 0);
}

function lightenColor(hex, amount) {
	var num = parseInt(hex.replace('#',''), 16);
	var r = Math.min(255, (num >> 16) + amount);
	var g = Math.min(255, ((num >> 8) & 0x00FF) + amount);
	var b = Math.min(255, (num & 0x0000FF) + amount);
	return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

function openBookView(topic) {
	libraryOpenBook = topic;
	libraryOpenPage = 0;
	renderLibraryBookPage();
}

function renderLibraryBookPage() {
	var topic = libraryOpenBook;
	var pages = bookPages[topic];
	var bookPagesLearned = getBookPagesLearned(topic);
	var topicName = bookTopicNames[topic] || topic;
	var idx = libraryOpenPage;

	var $view = $('#libraryPage .library-book-view');
	$view.empty();

	var $pg = $('<div class="library-book-page"></div>');
	$pg.append('<div class="library-book-close">Close</div>');
	$pg.append('<div class="library-book-topic">' + topicName + '</div>');

	if(idx < bookPagesLearned && idx < pages.length) {
		var page = pages[idx];
		var resultName = itemDisplayName(page.result);
		$pg.append('<div class="library-book-title">' + resultName + '</div>');
		$pg.append('<div class="library-book-desc">' + page.desc + '</div>');
	} else {
		$pg.append('<div class="library-book-empty">This page has not yet been revealed.</div>');
	}

	var $footer = $('<div class="library-book-footer"></div>');
	$footer.append('<div class="library-book-pagenum">Page ' + (idx + 1) + ' of ' + pages.length + '</div>');

	var $nav = $('<div class="library-book-nav"></div>');
	var $prev = $('<div class="btn">&larr;</div>');
	var $next = $('<div class="btn">&rarr;</div>');

	if(idx <= 0) $prev.addClass('disabled');
	else $prev.on('click', function(){ libraryOpenPage--; renderLibraryBookPage(); });

	if(idx >= bookPagesLearned - 1 || idx >= pages.length - 1) $next.addClass('disabled');
	else $next.on('click', function(){ libraryOpenPage++; renderLibraryBookPage(); });

	$nav.append($prev).append($next);
	$footer.append($nav);
	$pg.append($footer);

	$view.append($pg);
	$view.addClass('open');

	$pg.find('.library-book-close').on('click', function(){
		$view.removeClass('open').empty();
		libraryOpenBook = null;
	});
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
var altarMindBuzz = null;
var altarSoulBuzz = null;

function updateAltarBuzzes() {
	var mindEl = document.getElementById('altarMind');
	var soulEl = document.getElementById('altarSoul');
	// Mind circle buzz
	if (enmindedMind && !creatingHuman && mindEl) {
		if (!altarMindBuzz || !altarMindBuzz.active) {
			altarMindBuzz = startParticleBuzz(mindEl, essenceColors[enmindedMind] || '#b8c4e0');
		}
	} else if (altarMindBuzz) {
		stopParticleBuzz(altarMindBuzz);
		altarMindBuzz = null;
	}
	// Soul circle buzz
	if (ensouledSoul && !creatingHuman && soulEl) {
		if (!altarSoulBuzz || !altarSoulBuzz.active) {
			altarSoulBuzz = startParticleBuzz(soulEl, essenceColors[ensouledSoul] || '#e0b8b8');
		}
	} else if (altarSoulBuzz) {
		stopParticleBuzz(altarSoulBuzz);
		altarSoulBuzz = null;
	}
}

var essenceColors = {
	rationalMind: '#4682B4',
	creativeMind: '#FF6347',
	madMind: '#9932CC',
	braveSoul: '#B22222',
	lovingSoul: '#FF69B4',
	darkSoul: '#2F2F2F'
};

// Particle ray system
var particleRays = [];
var particleBuzzes = [];
var particleAnimFrame = null;

function hexToRgb(hex) {
	var r = parseInt(hex.slice(1,3), 16);
	var g = parseInt(hex.slice(3,5), 16);
	var b = parseInt(hex.slice(5,7), 16);
	return { r: r, g: g, b: b };
}

function startParticleRay(fromEl, toEl, color, fromSide) {
	var canvas = document.getElementById('particleCanvas');
	var container = document.getElementById('wrapper');
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

function startParticleBuzz(el, color) {
	var canvas = document.getElementById('particleCanvas');
	var container = document.getElementById('wrapper');
	canvas.width = container.offsetWidth;
	canvas.height = container.offsetHeight;

	var buzz = {
		el: el,
		color: hexToRgb(color),
		particles: [],
		active: true
	};
	particleBuzzes.push(buzz);
	if (!particleAnimFrame) tickParticles();
	return buzz;
}

function stopParticleBuzz(buzz) {
	buzz.active = false;
}

function getElPos(el, side) {
	var container = document.getElementById('wrapper');
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

	// Update and draw buzz particles
	for (var b = 0; b < particleBuzzes.length; b++) {
		var buzz = particleBuzzes[b];
		var container = document.getElementById('wrapper');
		var cr = container.getBoundingClientRect();
		var er = buzz.el.getBoundingClientRect();
		var cx = er.left + er.width / 2 - cr.left;
		var cy = er.top + er.height / 2 - cr.top;
		var rx = er.width / 2 + 6;
		var ry = er.height / 2 + 6;

		// Spawn new particles while active
		if (buzz.active) {
			var spawnCount = buzz.spawnRate !== undefined ? buzz.spawnRate : 2;
			// Handle fractional spawn rates with random chance
			var whole = Math.floor(spawnCount);
			if (Math.random() < (spawnCount - whole)) whole++;
			for (var i = 0; i < whole; i++) {
				var angle = Math.random() * Math.PI * 2;
				var dist = 0.4 + Math.random() * 0.6;
				buzz.particles.push({
					angle: angle,
					dist: dist,
					angSpeed: (0.02 + Math.random() * 0.03) * (Math.random() < 0.5 ? 1 : -1),
					wobbleX: (Math.random() - 0.5) * 4,
					wobbleY: (Math.random() - 0.5) * 4,
					wobbleSpeed: 0.05 + Math.random() * 0.08,
					wobbleT: Math.random() * Math.PI * 2,
					life: 0,
					maxLife: 40 + Math.random() * 60,
					size: 1.2 + Math.random() * 2
				});
			}
		}

		// Compute drift target if set
		var hasDrift = buzz.driftTo != null;
		var driftX, driftY;
		if (hasDrift) {
			var dr = buzz.driftTo.getBoundingClientRect();
			driftX = dr.left + dr.width / 2 - cr.left;
			driftY = dr.top + dr.height / 2 - cr.top;
		}

		// Update and draw
		for (var j = buzz.particles.length - 1; j >= 0; j--) {
			var p = buzz.particles[j];
			p.life++;
			if (p.life >= p.maxLife) {
				buzz.particles.splice(j, 1);
				continue;
			}
			anyAlive = true;
			p.angle += p.angSpeed;
			p.wobbleT += p.wobbleSpeed;
			var bx = cx + Math.cos(p.angle) * rx * p.dist + Math.sin(p.wobbleT) * p.wobbleX;
			var by = cy + Math.sin(p.angle) * ry * p.dist + Math.cos(p.wobbleT) * p.wobbleY;
			var lifeRatio = p.life / p.maxLife;
			// Drift toward target over lifetime
			var x, y;
			if (hasDrift) {
				x = bx + (driftX - bx) * lifeRatio;
				y = by;
			} else {
				x = bx;
				y = by;
			}
			var alpha = lifeRatio < 0.15 ? lifeRatio / 0.15 : (lifeRatio > 0.7 ? (1 - lifeRatio) / 0.3 : 1);
			ctx.beginPath();
			ctx.arc(x, y, p.size, 0, Math.PI * 2);
			ctx.fillStyle = 'rgba(' + buzz.color.r + ',' + buzz.color.g + ',' + buzz.color.b + ',' + (alpha * 0.75) + ')';
			ctx.fill();
		}

		if (!buzz.active && buzz.particles.length === 0) {
			particleBuzzes.splice(b, 1);
			b--;
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

var fmColumnMap = {
	enminder: '#log',
	altar: '#ideas',
	ensouler: '#things'
};

function unlockFinalMachine(id) {
	finalMachineStatus[id] = "unlocked";
	$('#container').addClass('has-final-machines');
	// Move particle canvas to wrapper if not already there
	if ($('#particleCanvas').parent().attr('id') !== 'wrapper') {
		$('#particleCanvas').appendTo('#wrapper');
	}
	// Move final machine into a column with its paired wrapper box
	var $fm = $('#' + id);
	var targetBox = fmColumnMap[id];
	if (targetBox && !$fm.parent().is('.column')) {
		var $target = $(targetBox);
		if (!$target.parent().is('.column')) {
			$target.wrap('<div class="column"></div>');
		}
		$target.parent().append($fm);
	}
	$fm.show();
	buildFinalMachine(id);
	if (typeof mobileRefreshFinalMachines === 'function') mobileRefreshFinalMachines();
}

function buildFinalMachine(id) {
	var $content = $('#' + id + ' .content');
	if ($content.children().length > 0) return;

	if (id == "enminder") {
		$content.append(`
			<div class="fm-layout">
				<div class="fm-gauge-circle-side">
					<div class="fm-circle-gauge"><div class="fm-circle-fill liquor-fill"></div></div>
					<div class="fm-circle-info">
						<div class="fm-gauge-label"><span class="fm-fuel-amount liquor-amount">${enminderFuel.liquor}</span>/${enminderFuelSize}</div>
						<div class="fm-gauge-name">Liquor</div>
						<div class="button fm-add-fuel" data-fuel="liquor">+10</div>
					</div>
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
							<div id="enminderMind" class="selector custom-select"><div class="selected placeholder">Mind...</div><div class="options"></div></div>
						</div>
					</div>
				</div>
				<div class="fm-action-side">
					<div id="enmind" class="button">Can't Enmind</div>
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
		populateSelector('#enminderMind', 'enminderMind');
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

		$('#enminderMind').on('customchange', function(){
			var val = $('#enminderMind').data('value');
			var clipEl = document.querySelector('#enmindClip .fm-triangle-clip');
			var fillEl = document.querySelector('#enminder .fm-triangle-fill');
			if (val && val.includes('Mind')) {
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
			var mind = $('#enminderMind').data('value');
			if (mind && mind.includes('Mind') && enminderFuel.liquor >= enminderFuelSize && enminderFuel.lightning >= enminderFuelSize) {
				enmind(mind);
			}
		});

	} else if (id == "ensouler") {
		$content.append(`
			<div class="fm-layout">
				<div class="fm-action-side">
					<div id="ensoul" class="button">Can't Ensoul</div>
				</div>
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
							<div id="ensoulerSoul" class="selector custom-select"><div class="selected placeholder">Soul...</div><div class="options"></div></div>
						</div>
					</div>
				</div>
				<div class="fm-gauge-circle-side">
					<div class="fm-circle-gauge"><div class="fm-circle-fill mana-fill"></div></div>
					<div class="fm-circle-info">
						<div class="fm-gauge-label"><span class="fm-fuel-amount mana-amount">${ensoulerFuel.mana}</span>/${ensoulerFuelSize}</div>
						<div class="fm-gauge-name">Mana</div>
						<div class="button fm-add-fuel" data-fuel="mana">+10</div>
					</div>
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
		populateSelector('#ensoulerSoul', 'ensoulerSoul');
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

		$('#ensoulerSoul').on('customchange', function(){
			var val = $('#ensoulerSoul').data('value');
			var clipEl = document.querySelector('#ensoulClip .fm-triangle-clip');
			var fillEl = document.querySelector('#ensouler .fm-triangle-fill');
			if (val && val.includes('Soul')) {
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
			var soul = $('#ensoulerSoul').data('value');
			if (soul && soul.includes('Soul') && ensoulerFuel.mana >= ensoulerFuelSize && ensoulerFuel.life >= ensoulerFuelSize) {
				ensoul(soul);
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
					<div id="altarMind" class="fm-slot"></div>
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
					<div id="altarSoul" class="fm-slot"></div>
				</div>
			</div>
			<div class="fm-flesh-controls">
				<div class="fm-gauge-label"><span id="fleshCount">${altarFuel.flesh}</span>/${altarFleshSize}</div>
				<div class="fm-gauge-name">Flesh</div>
				<div class="button fm-add-fuel" data-fuel="flesh">+1</div>
			</div>
			<div class="fm-create-controls">
				<div id="createHuman" class="button">Can't Create</div>
				<div class="fm-create-progress" style="display:none">0%</div>
			</div>
			<div class="fm-artifact-slot">
				<div id="altarArtifactHex" class="altar-artifact-hex${altarArtifact ? ' placed' : ''}">
					<svg viewBox="0 0 120 100" class="hex-svg">
						<defs>
							<linearGradient id="hexGrad" x1="0" y1="0" x2="0" y2="1"></linearGradient>
						</defs>
						<polygon class="hex-border" points="0,50 30,0 90,0 120,50 90,100 30,100"/>
						<circle class="hex-circle" cx="60" cy="50" r="28"/>
					</svg>
					<canvas class="hex-artifact-canvas" width="120" height="100"></canvas>
				</div>
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
		if (altarArtifact) {
			drawAltarArtifact(altarArtifact);
			setHexGradient(altarArtifact);
		}
		if (enmindedMind) {
			$('#altarMind').css('background', essenceColors[enmindedMind] || '#b8c4e0');
		}
		if (ensouledSoul) {
			$('#altarSoul').css('background', essenceColors[ensouledSoul] || '#e0b8b8');
		}
		updateAltarBuzzes();
		updateCreateButton();
		checkAlreadyCreated();
		positionAltarTubes();

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

		$('#altarArtifactHex').on('click', function(){
			if (creatingHuman) return;
			if (altarArtifact) {
				// Remove artifact from slot, return to inventory
				acquire("things", altarArtifact, 1);
				altarArtifact = null;
				$(this).removeClass('placed');

				clearAltarArtifact();
			clearHexGradient();
				updateCreateButton();
				return;
			}
			var art = getRunArtifact();
			if (!art || things[art] < 1) return;
			pay("things", art, 1);
			altarArtifact = art;
			$(this).addClass('placed');

			drawAltarArtifact(art);
			setHexGradient(art);
			updateCreateButton();
		});

		$('#createHuman').on('click', function(){
			createHuman();
		});
	}
}

function updateEnmindButton() {
	var val = $('#enminderMind').data('value');
	if (enmindingActive) {
		$('#enmind').html('Enminding...').addClass('disabled');
	} else if (val && val.includes('Mind') && enminderFuel.liquor >= enminderFuelSize && enminderFuel.lightning >= enminderFuelSize) {
		$('#enmind').html('Enmind').removeClass('disabled');
	} else {
		$('#enmind').html("Can't Enmind").addClass('disabled');
	}
}

function updateEnsoulButton() {
	var val = $('#ensoulerSoul').data('value');
	if (ensoulingActive) {
		$('#ensoul').html('Ensouling...').addClass('disabled');
	} else if (val && val.includes('Soul') && ensoulerFuel.mana >= ensoulerFuelSize && ensoulerFuel.life >= ensoulerFuelSize) {
		$('#ensoul').html('Ensoul').removeClass('disabled');
	} else {
		$('#ensoul').html("Can't Ensoul").addClass('disabled');
	}
}

function enmind(mindId) {
	if (enmindingActive) return;
	if (enminderFuel.liquor < enminderFuelSize || enminderFuel.lightning < enminderFuelSize) return;
	if (!pay("ideas", mindId, 1)) return;

	enmindingActive = true;
	$('#enminderMind').addClass('disabled');
	$('#enmind').hide();

	// Fill triangle gauge
	var clipEl = document.querySelector('#enmindClip .fm-triangle-clip');
	clipEl.setAttribute('x', 0);
	clipEl.setAttribute('width', 87);
	var fillColor = essenceColors[mindId] || '#b8c4e0';

	// Start particle ray from triangle tip to altar circle
	var triSvg = document.querySelector('#enminder .fm-triangle');
	var ray = startParticleRay(triSvg, document.getElementById('altarMind'), fillColor, 'right');

	var totalDrainTime = enminderFuelSize / 5 * 500; // same total duration as before
	var enmindStart = performance.now();
	var startLiquor = enminderFuel.liquor;
	var startLightning = enminderFuel.lightning;

	function enmindTick(now) {
		var elapsed = now - enmindStart;
		var t = Math.min(elapsed / totalDrainTime, 1);

		enminderFuel.liquor = Math.max(0, Math.round(startLiquor * (1 - t)));
		enminderFuel.lightning = Math.max(0, Math.round(startLightning * (1 - t)));
		updateEnminderGauge();

		// Drain triangle from base toward point (left to right)
		var pct = 1 - t;
		var w = 87 * pct;
		clipEl.setAttribute('x', 87 - w);
		clipEl.setAttribute('width', w);

		// Fill altar circle from below
		var fillPct = Math.round(t * 100);
		$('#altarMind').css('background', 'linear-gradient(to top, ' + fillColor + ' ' + fillPct + '%, white ' + fillPct + '%)');

		if (t >= 1) {
			enmindingInterval = null;
			enmindingActive = false;
			stopParticleRay(ray);
			enmindedMind = mindId;
			$('#altarMind').css('background', fillColor);
			$('#enminder').addClass('fm-done');
			updateAltarBuzzes();
			updateCreateButton();
			checkAlreadyCreated();
			logMessage("enmind");
		} else {
			enmindingInterval = requestAnimationFrame(enmindTick);
		}
	}
	enmindingInterval = requestAnimationFrame(enmindTick);
}

function ensoul(soulId) {
	if (ensoulingActive) return;
	if (ensoulerFuel.mana < ensoulerFuelSize || ensoulerFuel.life < ensoulerFuelSize) return;
	if (!pay("ideas", soulId, 1)) return;

	ensoulingActive = true;
	$('#ensoulerSoul').addClass('disabled');
	$('#ensoul').hide();

	// Fill triangle gauge
	var clipEl = document.querySelector('#ensoulClip .fm-triangle-clip');
	clipEl.setAttribute('x', 0);
	clipEl.setAttribute('width', 87);
	var fillColor = essenceColors[soulId] || '#e0b8b8';

	// Start particle ray from triangle tip to altar circle
	var triSvg = document.querySelector('#ensouler .fm-triangle');
	var ray = startParticleRay(triSvg, document.getElementById('altarSoul'), fillColor, 'left');

	var totalDrainTime = ensoulerFuelSize / 5 * 500; // same total duration as before
	var ensoulStart = performance.now();
	var startMana = ensoulerFuel.mana;
	var startLife = ensoulerFuel.life;

	function ensoulTick(now) {
		var elapsed = now - ensoulStart;
		var t = Math.min(elapsed / totalDrainTime, 1);

		ensoulerFuel.mana = Math.max(0, Math.round(startMana * (1 - t)));
		ensoulerFuel.life = Math.max(0, Math.round(startLife * (1 - t)));
		updateEnsoulerGauge();

		// Drain triangle from base toward point (right to left)
		var pct = 1 - t;
		clipEl.setAttribute('width', 87 * pct);

		// Fill altar circle from below
		var fillPct = Math.round(t * 100);
		$('#altarSoul').css('background', 'linear-gradient(to top, ' + fillColor + ' ' + fillPct + '%, white ' + fillPct + '%)');

		if (t >= 1) {
			ensoulingInterval = null;
			ensoulingActive = false;
			stopParticleRay(ray);
			ensouledSoul = soulId;
			$('#altarSoul').css('background', fillColor);
			$('#ensouler').addClass('fm-done');
			updateAltarBuzzes();
			updateCreateButton();
			checkAlreadyCreated();
			logMessage("ensoul");
		} else {
			ensoulingInterval = requestAnimationFrame(ensoulTick);
		}
	}
	ensoulingInterval = requestAnimationFrame(ensoulTick);
}

var creatingHuman = false;
var createHumanInterval = null;
var createHumanProgress = 0;
var startingFlesh = 0;

function isHumanAlreadyCreated() {
	if (!enmindedMind || !ensouledSoul) return false;
	if (!window._stickman) return false;
	var profile = getProfileForHuman();
	if (!profile) return false;
	var created = (typeof prestigeState !== 'undefined' && prestigeState.createdHumans) ? prestigeState.createdHumans : [];
	return created.indexOf(profile.name) !== -1;
}

function checkAlreadyCreated() {
	if (!enmindedMind || !ensouledSoul) {
		$('#altarWarning').remove();
		return;
	}
	if (isHumanAlreadyCreated()) {
		var profile = getProfileForHuman();
		if ($('#altarWarning').length === 0) {
			$('.fm-artifact-slot').before('<div id="altarWarning" style="position:absolute;top:45px;right:15px;text-align:center;color:#B22222;font-style:italic;z-index:3">' + profile.name + ' was already created</div>');
		}
		// Auto-empty everything with animation
		altarReject();
	} else {
		$('#altarWarning').remove();
	}
}

var altarRejecting = false;

function altarReject() {
	if (altarRejecting) return;
	altarRejecting = true;

	var duration = 1500;
	var startPreserver = altarFuel.preserver;
	var startDust = altarFuel.dust;
	var startFlesh = altarFuel.flesh;
	var startTime = Date.now();

	// Fade mind and soul circles
	var mindBg = $('#altarMind').css('background-color') || '#b8c4e0';
	var soulBg = $('#altarSoul').css('background-color') || '#e0b8b8';

	var rejectInterval = setInterval(function() {
		var elapsed = Date.now() - startTime;
		var t = Math.min(elapsed / duration, 1);
		var ease = t * t; // ease-in

		// Drain fuels
		altarFuel.preserver = Math.round(startPreserver * (1 - ease));
		altarFuel.dust = Math.round(startDust * (1 - ease));
		altarFuel.flesh = Math.round(startFlesh * (1 - ease));
		updateAltarGauge();
		updateFleshCount();

		// Fade circles to white
		var fadePct = Math.round((1 - ease) * 100);
		$('#altarMind').css('background', 'linear-gradient(to top, ' + mindBg + ' ' + fadePct + '%, white ' + fadePct + '%)');
		$('#altarSoul').css('background', 'linear-gradient(to top, ' + soulBg + ' ' + fadePct + '%, white ' + fadePct + '%)');

		if (t >= 1) {
			clearInterval(rejectInterval);

			// Empty mind
			enmindedMind = null;
			updateAltarBuzzes();
			$('#altarMind').css('background', '');
			$('#altarMind .fm-slot-value').html('—');
			$('#enminder').removeClass('fm-done');
			$('#enminderMind').removeClass('disabled');
			$('#enmind').show();

			// Empty soul
			ensouledSoul = null;
			updateAltarBuzzes();
			$('#altarSoul').css('background', '');
			$('#altarSoul .fm-slot-value').html('—');
			$('#ensouler').removeClass('fm-done');
			$('#ensoulerSoul').removeClass('disabled');
			$('#ensoul').show();

			// Empty artifact
			if (altarArtifact) {
				acquire("things", altarArtifact, 1);
				altarArtifact = null;
				$('#altarArtifactHex').removeClass('placed');
				clearAltarArtifact();
				clearHexGradient();
			}

			// Zero fuels
			altarFuel.preserver = 0;
			altarFuel.dust = 0;
			altarFuel.flesh = 0;
			updateAltarGauge();
			updateFleshCount();

			$('#altarWarning').remove();
			updateCreateButton();
			altarRejecting = false;
		}
	}, 30);
}

// Maps each Human to the artifact that uses their prestige resource
function drawAltarArtifact(artKey) {
	var canvas = document.querySelector('.hex-artifact-canvas');
	if (!canvas) return;
	var dpr = window.devicePixelRatio || 1;
	canvas.width = 120 * dpr;
	canvas.height = 100 * dpr;
	var ctx = canvas.getContext('2d');
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	ctx.clearRect(0, 0, 120, 100);
	if (!artKey || typeof artifactDrawers === 'undefined' || !artifactDrawers[artKey]) return;
	// Clip to hexagon
	ctx.save();
	ctx.beginPath();
	ctx.moveTo(0, 50);
	ctx.lineTo(30, 0);
	ctx.lineTo(90, 0);
	ctx.lineTo(120, 50);
	ctx.lineTo(90, 100);
	ctx.lineTo(30, 100);
	ctx.closePath();
	ctx.clip();
	// Draw artifact centered in hex, scale to fit
	drawArtifact(artifactDrawers[artKey], ctx, 60, 50, 1);
	ctx.restore();
}

function clearAltarArtifact() {
	var canvas = document.querySelector('.hex-artifact-canvas');
	if (!canvas) return;
	canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

var artifactGradients = {
	wreath: ['#6B8E23', '#3A5F0B', '#2E8B57'],
	ember: ['#FF4500', '#CC3300', '#5C1A00'],
	echo: ['#B0C4DE', '#8899AA', '#A8B8C8'],
	root: ['#6B4226', '#8B5E3C', '#4A2F1A'],
	tear: ['#87CEEB', '#5B9BD5', '#B0D4E8'],
	shard: ['#7B68EE', '#4B0082', '#9370DB'],
	sigil: ['#8B0000', '#4A0010', '#2A0008'],
	crown: ['#DAA520', '#B8860B', '#6A0DAD'],
	veil: ['#C8C8DC', '#9A8FBF', '#B0A8C8']
};

function setHexGradient(artKey) {
	var grad = document.getElementById('hexGrad');
	if (!grad) return;
	while (grad.firstChild) grad.removeChild(grad.firstChild);
	var colors = artifactGradients[artKey];
	if (!colors) return;
	var ns = 'http://www.w3.org/2000/svg';
	for (var i = 0; i < colors.length; i++) {
		var stop = document.createElementNS(ns, 'stop');
		stop.setAttribute('offset', (i / (colors.length - 1) * 100) + '%');
		stop.setAttribute('stop-color', colors[i]);
		stop.setAttribute('stop-opacity', '0.25');
		grad.appendChild(stop);
	}
	$('.hex-border').css('fill', 'url(#hexGrad)');
}

function clearHexGradient() {
	$('.hex-border').css('fill', '');
	var grad = document.getElementById('hexGrad');
	if (grad) while (grad.firstChild) grad.removeChild(grad.firstChild);
}

var humanArtifactMap = {
	'The Commander': 'ember',    // Clarity
	'The Hero': 'veil',          // Courage
	'The Berserker': 'root',     // Leather
	'The Healer': 'tear',        // Elixir
	'The Saint': 'echo',         // Spirit
	'The Tyrant': 'crown',       // Gold
	'The Trickster': 'sigil',    // Beads
	'The Demon': 'shard',        // Sin
};

function getRunArtifact() {
	if (!prestigeState || prestigeState.createdHumans.length === 0) return 'wreath';
	var lastHuman = prestigeState.createdHumans[prestigeState.createdHumans.length - 1];
	return humanArtifactMap[lastHuman] || 'wreath';
}

function canCreateHuman() {
	return !creatingHuman
		&& altarFuel.flesh >= altarFleshSize
		&& altarFuel.dust >= altarFuelSize
		&& enmindedMind
		&& ensouledSoul
		&& altarArtifact
		&& !isHumanAlreadyCreated();
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

	// Keep circle buzzes alive, add tube and body buzzes
	// Circle buzzes are already running from updateAltarBuzzes
	var fleshEl = document.querySelector('#altar .fm-flesh-gauge');
	var mindBuzzColor = essenceColors[enmindedMind] || '#b8c4e0';
	var soulBuzzColor = essenceColors[ensouledSoul] || '#e0b8b8';

	// Start tube buzzes that drift toward the body
	var mindTubeEl = document.querySelector('#altar .mind-flow');
	var soulTubeEl = document.querySelector('#altar .soul-flow');
	var mindTubeBuzz = mindTubeEl ? startParticleBuzz(mindTubeEl, mindBuzzColor) : null;
	var soulTubeBuzz = soulTubeEl ? startParticleBuzz(soulTubeEl, soulBuzzColor) : null;
	if (mindTubeBuzz) mindTubeBuzz.driftTo = fleshEl;
	if (soulTubeBuzz) soulTubeBuzz.driftTo = fleshEl;

	// Start body buzzes at 0 spawn rate, will ramp up
	var mindBodyBuzz = startParticleBuzz(fleshEl, mindBuzzColor);
	mindBodyBuzz.spawnRate = 0;
	var soulBodyBuzz = startParticleBuzz(fleshEl, soulBuzzColor);
	soulBodyBuzz.spawnRate = 0;

	createHumanInterval = setInterval(function(){
		// Check if flesh decayed during process
		if (altarFuel.flesh < startingFlesh) {
			clearInterval(createHumanInterval);
			createHumanInterval = null;
			creatingHuman = false;
			createHumanProgress = 0;
			$('#altar .fm-add-fuel').removeClass('disabled');
			$('.fm-bowl-gauge .fm-add-fuel').show();
			// Return artifact to inventory on failed creation
			if (altarArtifact) {
				acquire("things", altarArtifact, 1);
				altarArtifact = null;
				$('#altarArtifactHex').removeClass('placed');
	
				clearAltarArtifact();
			clearHexGradient();
			}
			// Stop all particle buzzes
			stopParticleBuzz(mindBodyBuzz);
			stopParticleBuzz(soulBodyBuzz);
			if (mindTubeBuzz) stopParticleBuzz(mindTubeBuzz);
			if (soulTubeBuzz) stopParticleBuzz(soulTubeBuzz);
			if (altarMindBuzz) { stopParticleBuzz(altarMindBuzz); altarMindBuzz = null; }
			if (altarSoulBuzz) { stopParticleBuzz(altarSoulBuzz); altarSoulBuzz = null; }
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

		// Ramp: circle buzzes fade out, body buzzes ramp up
		var t = createHumanProgress;
		var circleRate = Math.max(0, 2 * (1 - t));
		var bodyRate = 2 * t;
		if (altarMindBuzz) altarMindBuzz.spawnRate = circleRate;
		if (altarSoulBuzz) altarSoulBuzz.spawnRate = circleRate;
		mindBodyBuzz.spawnRate = bodyRate;
		soulBodyBuzz.spawnRate = bodyRate;

		if (createHumanProgress >= 1) {
			clearInterval(createHumanInterval);
			createHumanInterval = null;
			creatingHuman = false;
			createHumanProgress = 0;

			altarFuel.dust = 0;

			// Stop all particle buzzes
			stopParticleBuzz(mindBodyBuzz);
			stopParticleBuzz(soulBodyBuzz);
			if (mindTubeBuzz) stopParticleBuzz(mindTubeBuzz);
			if (soulTubeBuzz) stopParticleBuzz(soulTubeBuzz);
			if (altarMindBuzz) { stopParticleBuzz(altarMindBuzz); altarMindBuzz = null; }
			if (altarSoulBuzz) { stopParticleBuzz(altarSoulBuzz); altarSoulBuzz = null; }

			// Change flesh silhouette to created human's color
			var profile = getProfileForHuman();
			$('#altar .fm-flesh-fill').css('fill', profile ? profile.color : '#c4756b');

			// Empty circles and drain tubes
			$('#altarMind').css('background', 'white');
			$('#altarSoul').css('background', 'white');
			$('.mind-flow').css('left', 'auto').css('right', '0').css('width', '0%');
			$('.soul-flow').css('right', 'auto').css('left', '0').css('width', '0%');

			logMessage("createHuman");

			// Track the artifact (already consumed on placement)
			if (altarArtifact && prestigeState.craftedArtifacts.indexOf(altarArtifact) === -1) {
				prestigeState.craftedArtifacts.push(altarArtifact);
				if (typeof refreshArtifactsButton === 'function') refreshArtifactsButton();
			}

			// Save human created state and clear artifact slot
			humanCreated = { mind: enmindedMind, soul: ensouledSoul, artifact: altarArtifact };
			altarArtifact = null;
			$('#altarArtifactHex').removeClass('placed');

			clearAltarArtifact();
			clearHexGradient();

			// Unlock the human (add to persistent list, walker spawns after ascend/reload)
			var profile = getProfileForHuman();
			if (profile && humansUnlocked.indexOf(profile.name) === -1) {
				humansUnlocked.push(profile.name);
				if (typeof refreshHumansButton === 'function') refreshHumansButton();
			}

			// Wait for tubes to empty, then start the reveal
			setTimeout(function(){
				altarFuel.flesh = 0;
				humanCreationReveal(false);
			}, 1200);
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
		$content.find('.fm-tank-gauge, .fm-preserver-tube, .fm-flesh-controls, .fm-create-controls, .fm-bowl-gauge, .fm-slot-side, .fm-connector, .fm-gauge-circle-side, .fm-gauge-side, .fm-bottom-gauge, .fm-layout, .fm-artifact-slot').hide();

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
		var walkTarget = w * 0.35 - 40;

		var posX = instant ? walkTarget : w / 2;
		var posY = instant ? groundY - stickHeight * 0.6 : h / 2 - stickHeight / 2;
		var velY = 0;
		var phase = instant ? 'idle' : 'fall';

		man.addAnimation(S.idleAnimation);
		man.updateBodyPositions();

		var essenceColors = {
			braveSoul: '#B22222', lovingSoul: '#FF69B4', darkSoul: '#2F2F2F',
			rationalMind: '#4682B4', creativeMind: '#FF6347', madMind: '#9932CC'
		};
		var soulLabel = profile.soul.replace('Soul', '').replace(/^./, function(c) { return c.toUpperCase(); }) + ' Soul';
		var mindLabel = profile.mind.replace('Mind', '').replace(/^./, function(c) { return c.toUpperCase(); }) + ' Mind';
		var soulColor = essenceColors[profile.soul] || '#999';
		var mindColor = essenceColors[profile.mind] || '#999';

		var modifierDescriptions = {
			'The Commander': 'Base rates set to 5. Generator gauges fill in one click.',
			'The Hero': 'Start with all Max buttons unlocked.',
			'The Berserker': 'Pulverize costs no Strength. Randomly wrecks resources, gives Leather.',
			'The Healer': 'Alchemizer gauges 10x larger. Auto-alchemize when full.',
			'The Artist': 'Alchemy produces double output. Chance to produce Canvas or Paint.',
			'The Saint': 'Purify costs 25% Recursion. Chance to produce Blessed Oil.',
			'The Tyrant': 'Each hour takes 25% of all resources in exchange for Gold.',
			'The Trickster': 'Randomly offers to swap 2 resources. Decline = both halved.',
			'The Demon': 'All tree + dropdowns unlocked. 20% chance alchemy fails.'
		};
		var modDesc = modifierDescriptions[profile.name] || '';

		var $info = $('<div class="altar-human-info"' + (instant ? '' : ' style="display:none"') + '>' +
			'<div class="altar-human-name">' + profile.name + '</div>' +
			'<div class="altar-human-essence"><span style="color:' + soulColor + '">' + soulLabel + '</span> + <span style="color:' + mindColor + '">' + mindLabel + '</span></div>' +
			(modDesc ? '<div class="altar-human-modifiers">' + modDesc + '</div>' : '') +
			'<div class="button" id="ascendButton">Ascend</div>' +
		'</div>');
		$content.append($info);

		$info.on('click', '#ascendButton', function() {
			prestigeReset();
		});

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
		$content.find('.fm-tank-gauge, .fm-preserver-tube, .fm-flesh-controls, .fm-create-controls, .fm-bowl-gauge, .fm-slot-side, .fm-connector, .fm-gauge-circle-side, .fm-gauge-side, .fm-bottom-gauge, .fm-artifact-slot').fadeOut(1000);
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

function positionAltarTubes() {
	var container = document.querySelector('#altar .content');
	if (!container) return;
	var containerRect = container.getBoundingClientRect();

	function positionTube(tubeEl, startRect, startX, startY, endRect, endX, endY) {
		if (!tubeEl || !startRect || !endRect) return;
		var x1 = startX - containerRect.left;
		var y1 = startY - containerRect.top;
		var x2 = endX - containerRect.left;
		var y2 = endY - containerRect.top;
		var dx = x2 - x1;
		var dy = y2 - y1;
		var length = Math.sqrt(dx * dx + dy * dy);
		var angle = Math.atan2(dy, dx) * (180 / Math.PI);
		tubeEl.style.left = x1 + 'px';
		tubeEl.style.top = y1 + 'px';
		tubeEl.style.width = length + 'px';
		tubeEl.style.transform = 'rotate(' + angle + 'deg)';
	}

	var slab = document.querySelector('#altar .fm-flesh-silhouette');
	if (!slab) return;
	var slabRect = slab.getBoundingClientRect();
	var slabCX = slabRect.left + slabRect.width / 2;
	var slabCY = slabRect.top + slabRect.height / 2;

	// Preserver tube: tank bottom-right corner (offset 30px down) → slab center
	var tube = document.querySelector('.fm-preserver-tube');
	var tank = document.querySelector('#altar .fm-tank');
	if (tube && tank) {
		var tankRect = tank.getBoundingClientRect();
		positionTube(tube, tankRect, tankRect.right, tankRect.bottom + 30, slabRect, slabCX, slabCY);
	}

	// Mind connector: horizontal from mind circle center to slab vertical center
	var connectors = document.querySelectorAll('#altar .fm-connector');
	var mindSlot = document.querySelector('#altarMind');
	if (connectors[0] && mindSlot) {
		var mindRect = mindSlot.getBoundingClientRect();
		var mindCX = mindRect.left + mindRect.width / 2;
		var mindCY = mindRect.top + mindRect.height / 2;
		var tubeH = connectors[0].offsetHeight;
		var x1 = mindCX - containerRect.left;
		var x2 = slabCX - containerRect.left;
		connectors[0].style.left = (x1 + 20) + 'px';
		connectors[0].style.top = (mindCY - containerRect.top - tubeH / 2 + 48) + 'px';
		connectors[0].style.width = (x2 - x1) + 'px';
		connectors[0].style.transform = 'none';
	}

	// Soul connector: horizontal from soul circle center to slab vertical center
	var soulSlot = document.querySelector('#altarSoul');
	if (connectors[1] && soulSlot) {
		var soulRect = soulSlot.getBoundingClientRect();
		var soulCX = soulRect.left + soulRect.width / 2;
		var soulCY = soulRect.top + soulRect.height / 2;
		var tubeH = connectors[1].offsetHeight;
		var x1 = slabCX - containerRect.left;
		var x2 = soulCX - containerRect.left;
		connectors[1].style.left = x1 + 'px';
		connectors[1].style.top = (soulCY - containerRect.top - tubeH / 2 + 48) + 'px';
		connectors[1].style.width = (x2 - x1) + 'px';
		connectors[1].style.transform = 'none';
	}
}
window.addEventListener('resize', positionAltarTubes);

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
		if (typeof mobileRefreshColumns === 'function') mobileRefreshColumns();
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
	if (items[id].subtype == "book"){
		append = '#things #books';
	} else if (items[id].prestige){
		append = '#'+type+' #prestige';
	} else if (items[id].subtype == "essence"){
		append = id.indexOf('Soul') !== -1 ? '#ideas #souls' : '#ideas #minds';
	} else if (items[id].subtype == "alchemified"){
		var isTier2 = items[id].ingredients && items[id].ingredients.some(function(ing){ return items[ing] && items[ing].subtype == "alchemified"; });
		append = '#'+type+' #' + (isTier2 ? 'alchemized2' : 'alchemized1');
	} else if (type != "dusts" && type != "liquids"){
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
		if (typeof mobileRefreshMachines === 'function') mobileRefreshMachines();
	}
}

function logMessage(id){
	logCount++;
	activeLogCounter++;
	if (typeof seenFacts !== "undefined") seenFacts[id] = true;
	logEntries.push({ id: id, count: logCount, active: true, tooMany: false });
	updateActiveLogCounter();
	$('#log .content').prepend('<div class="item logMessage '+ id +' logCount-'+logCount+' active"><span class="count">'+logCount+' </span><span class="name">'+ actions[id].log+'</span></div>');
	if (items[id] && items[id].idea) button('.logCount-' + logCount, id, "mentalize");
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
		if (typeof mobileRefreshColumns === 'function') mobileRefreshColumns();
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
		if (typeof mobileRefreshColumns === 'function') mobileRefreshColumns();
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
		$('#machines').delay(2000).fadeIn();
		if (typeof mobileRefreshMachines === 'function') mobileRefreshMachines();
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
		if (typeof mobileRefreshColumns === 'function') mobileRefreshColumns();
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
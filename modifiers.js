// MODIFIER SYSTEM //
// Each modifier is activated when its Human has been created in a previous run.
// Modifiers stack across runs.

function hasModifier(name) {
	return prestigeState && prestigeState.activeModifiers.indexOf(name) !== -1;
}

function applyModifiers() {
	if (!prestigeState || !prestigeState.activeModifiers.length) return;

	if (hasModifier('commander')) applyCommander();
	if (hasModifier('hero'))      applyHero();
	if (hasModifier('berserker')) applyBerserker();
	if (hasModifier('healer'))    applyHealer();
	if (hasModifier('artist'))    applyArtist();
	if (hasModifier('saint'))     applySaint();
	if (hasModifier('tyrant'))    applyTyrant();
	if (hasModifier('trickster')) applyTrickster();
	if (hasModifier('demon'))     applyDemon();

	// Auto-show Market if Berserker modifier is active
	if (hasModifier('berserker')) {
		$('#market').show();
	}
}

// === 1. THE COMMANDER: Strategic Clarity ===
// Base generation rates set to 5 + generator gauges fill in one click
// Prestige resource: Clarity (pure idea) — every one-click fill

function applyCommander() {
	baseRate.mind = 5;
	baseRate.matter = 5;
	baseRate.strength = 5;
}

// Called from addFuel() in game.js when commander is active
function commanderFillGauge(token) {
	var remaining = fuelGaugeSize[token] - fuelGauge[token];
	if (remaining <= 0) return;
	var costType = fuelCost[token][1];
	var costToken = fuelCost[token][2];
	var costPer = fuelCost[token][0];
	var totalCost = remaining * costPer;
	var affordable = Math.floor(window[costType][costToken] / costPer);
	var toAdd = Math.min(remaining, affordable);
	if (toAdd <= 0) return;
	pay(costType, costToken, toAdd * costPer);
	fuelGauge[token] += toAdd;
	updateFuelGaugeCounter(token);
	// Produce Clarity
	acquire("ideas", "clarity", 1);
}

// === 2. THE HERO: Boldness ===
// Start with all Max buttons unlocked
// Prestige resource: Courage (pure idea) — every 10 Max button uses

function applyHero() {
	// Auto-unlock all Max buttons
	var maxUnlocks = ['reifyMaxUnlock', 'pulverizeMaxUnlock', 'mentalizeMaxUnlock', 'purifyMaxUnlock', 'mentAllUnlock'];
	$.each(maxUnlocks, function(i, id) {
		if (buyableStatus[id] !== "unlocked" && buyables[id]) {
			buyableStatus[id] = "unlocked";
			$('.buyable.' + id).hide();
			if (id === "mentAllUnlock") {
				button("#log .header .buttons", null, "mentAll");
				$(".button.mentAll").append('<span class="counter"> (<span class="number">' + activeLogCounter + '</span>)</span>');
			}
			if (id === "reifyMaxUnlock") button("#ideas .header .buttons", null, "reifyMax");
			if (id === "pulverizeMaxUnlock") button("#things .header .buttons", null, "pulverizeMax");
			if (id === "mentalizeMaxUnlock") button("#log .header .buttons", null, "mentalizeMax");
			if (id === "purifyMaxUnlock") button("#ideas .header .buttons", null, "purifyMax");
		}
	});
}

// Called from Max button handlers in game.js
function heroTrackMaxUse() {
	if (!hasModifier('hero')) return;
	maxButtonUses++;
	if (maxButtonUses >= 10) {
		maxButtonUses = 0;
		acquire("ideas", "courage", 1);
	}
}

// === 3. THE BERSERKER: Fury ===
// Pulverize costs no Strength + randomly wrecks 5 pure things/ideas to 25%, gives Leather

function applyBerserker() {
	// Start random wreck interval (5-15 minutes)
	var delay = (300 + Math.random() * 600) * 1000; // 5-15 min
	modifierIntervals.berserker = setTimeout(function berserkerWreck() {
		doBerserkerWreck();
		modifierIntervals.berserker = setTimeout(berserkerWreck, (300 + Math.random() * 600) * 1000);
	}, delay);
}

function doBerserkerWreck() {
	var targets = [];
	// Gather all pure ideas and things with quantity > 0
	$.each(ideas, function(id, amt) {
		if (amt > 1 && items[id] && items[id].type === "pure" && !items[id].prestige) targets.push({ type: "ideas", id: id });
	});
	$.each(things, function(id, amt) {
		if (amt > 1 && items[id] && items[id].type === "pure" && !items[id].prestige) targets.push({ type: "things", id: id });
	});

	if (targets.length === 0) return;

	// Pick up to 5 random targets
	var picked = [];
	var pool = targets.slice();
	for (var i = 0; i < Math.min(5, pool.length); i++) {
		var idx = Math.floor(Math.random() * pool.length);
		picked.push(pool.splice(idx, 1)[0]);
	}

	// Wreck each to 25%
	$.each(picked, function(i, t) {
		var current = window[t.type][t.id];
		var target = Math.floor(current * 0.25);
		window[t.type][t.id] = target;
		updateCounter(t.type, t.id);
	});

	// Give Leather as apology
	acquire("things", "leather", 1);
}

// === 4. THE HEALER: Restoration ===
// Alchemizer gauges 10x larger + auto-alchemize when full
// Prestige resource: Elixir (pure thing) — every auto-alchemize

function applyHealer() {
	// 10x alchemy dust gauge size
	alchemyDustGaugeSize = 1000;

	// Start auto-alchemize check interval (every 2 seconds)
	modifierIntervals.healer = setInterval(function() {
		healerAutoAlchemize();
	}, 2000);
}

function healerAutoAlchemize() {
	// Check each alchemy submachine for full gauge + valid selection
	$('.subMachine.alchemy').each(function() {
		var $sub = $(this);
		var subId = $sub.attr('id');
		var $sel1 = $sub.find('#selector1');
		var $sel2 = $sub.find('#selector2');
		var val1 = $sel1.data('value');
		var val2 = $sel2.data('value');
		if (!val1 || !val2 || val1 === '---' || val2 === '---') return;

		var item = recipe(val1, val2);
		if (!item) return;

		if (canAlchemize(item)) {
			alchemy(item);
			updateAlchemyDustGauge(subId, alchemyDust(item));
			// Produce Elixir
			acquire("things", "elixir", 1);
		}
	});
}

// === 5. THE ARTIST: Inspiration ===
// Alchemy produces double output + chance to produce Canvas or Paint

function applyArtist() {
	// Effects are applied inline in alchemy() via hooks
}

// Called after each successful alchemy in game.js
function artistAlchemyBonus(type, item, amount) {
	if (!hasModifier('artist')) return amount;
	// Double output
	var doubled = amount * 2;
	// 20% chance to produce Canvas or Paint
	if (Math.random() < 0.2) {
		acquire("things", Math.random() < 0.5 ? "canvas" : "paint", 1);
	}
	return doubled;
}

// === 6. THE SAINT: Grace ===
// Purify costs 25% Recursion + chance to produce Blessed Oil

function applySaint() {
	// Effects are applied inline in purify() via hooks
}

// Returns modified recursion cost for purify
function saintPurifyCost(amount) {
	if (!hasModifier('saint')) return amount;
	return Math.max(1, Math.ceil(amount * 0.25));
}

// Called after each successful purify
function saintPurifyBonus() {
	if (!hasModifier('saint')) return;
	if (Math.random() < 0.15) {
		acquire("liquids", "blessedOil", 1);
	}
}

// === 7. THE TYRANT: Domination ===
// Each hour takes 25% of all resources in exchange for Gold

function applyTyrant() {
	modifierIntervals.tyrant = setInterval(function() {
		doTyrantTax();
	}, 3600000); // 1 hour
}

function doTyrantTax() {
	var totalTaken = 0;
	// Tax ideas
	$.each(ideas, function(id, amt) {
		if (amt > 0 && items[id] && !items[id].prestige) {
			var tax = Math.floor(amt * 0.25);
			if (tax > 0) {
				ideas[id] -= tax;
				updateCounter("ideas", id);
				totalTaken += tax;
			}
		}
	});
	// Tax things
	$.each(things, function(id, amt) {
		if (amt > 0 && items[id] && !items[id].prestige) {
			var tax = Math.floor(amt * 0.25);
			if (tax > 0) {
				things[id] -= tax;
				updateCounter("things", id);
				totalTaken += tax;
			}
		}
	});
	// Tax dusts
	$.each(dusts, function(id, amt) {
		if (amt > 0) {
			var tax = Math.floor(amt * 0.25);
			if (tax > 0) {
				dusts[id] -= tax;
				updateCounter("dusts", id);
				totalTaken += tax;
			}
		}
	});
	// Tax liquids (non-prestige)
	$.each(liquids, function(id, amt) {
		if (amt > 0 && items[id] && !items[id].prestige) {
			var tax = Math.floor(amt * 0.25);
			if (tax > 0) {
				liquids[id] -= tax;
				updateCounter("liquids", id);
				totalTaken += tax;
			}
		}
	});

	// Convert to Gold (1 Gold per 100 total taxed)
	var goldAmount = Math.max(1, Math.floor(totalTaken / 100));
	acquire("things", "gold", goldAmount);
}

// === 8. THE TRICKSTER: Cunning ===
// Randomly offers to swap quantities of 2 resources (game-blocking prompt)
// Decline = both halved. Accept = swap + Beads

function applyTrickster() {
	var delay = (600 + Math.random() * 1200) * 1000; // 10-30 min
	modifierIntervals.trickster = setTimeout(function tricksterOffer() {
		doTricksterOffer();
		modifierIntervals.trickster = setTimeout(tricksterOffer, (600 + Math.random() * 1200) * 1000);
	}, delay);
}

function doTricksterOffer() {
	// Gather all resources with qty > 0
	var pool = [];
	$.each(ideas, function(id, amt) {
		if (amt > 0 && items[id] && !items[id].prestige) pool.push({ type: "ideas", id: id, amt: amt, name: items[id].idea });
	});
	$.each(things, function(id, amt) {
		if (amt > 0 && items[id] && !items[id].prestige) pool.push({ type: "things", id: id, amt: amt, name: items[id].thing });
	});

	if (pool.length < 2) return;

	// Pick 2 random different resources
	var idx1 = Math.floor(Math.random() * pool.length);
	var r1 = pool.splice(idx1, 1)[0];
	var idx2 = Math.floor(Math.random() * pool.length);
	var r2 = pool[idx2];

	showTricksterModal(r1, r2);
}

function showTricksterModal(r1, r2) {
	var $overlay = $('#tricksterModal');
	$overlay.find('.trickster-r1-name').text(r1.name);
	$overlay.find('.trickster-r1-amt').text(Math.floor(r1.amt));
	$overlay.find('.trickster-r2-name').text(r2.name);
	$overlay.find('.trickster-r2-amt').text(Math.floor(r2.amt));
	$overlay.show();

	$overlay.find('#tricksterAccept').off('click').on('click', function() {
		// Swap quantities
		var temp = window[r1.type][r1.id];
		window[r1.type][r1.id] = window[r2.type][r2.id];
		window[r2.type][r2.id] = temp;
		updateCounter(r1.type, r1.id);
		updateCounter(r2.type, r2.id);
		// Produce Beads
		acquire("things", "beads", 1);
		$overlay.hide();
	});

	$overlay.find('#tricksterDecline').off('click').on('click', function() {
		// Halve both
		window[r1.type][r1.id] = Math.floor(window[r1.type][r1.id] / 2);
		window[r2.type][r2.id] = Math.floor(window[r2.type][r2.id] / 2);
		updateCounter(r1.type, r1.id);
		updateCounter(r2.type, r2.id);
		$overlay.hide();
	});
}

// === 9. THE DEMON: Havoc ===
// All tree + all dropdowns unlocked + 20% chance alchemy fails

function applyDemon() {
	// Unlock all tree nodes
	if (window._tree && window._tree.setShowAll) {
		window._tree.setShowAll(true);
	}

	// Populate all dropdown options with all seen names
	$.each(items, function(id) {
		seeName(id);
	});
}

// Called from alchemy() in game.js — returns true if alchemy should fail
function demonAlchemyFail() {
	if (!hasModifier('demon')) return false;
	return Math.random() < 0.2;
}

// Called when demon causes alchemy failure
function demonProduceFailure() {
	acquire("things", "goo", 1);
	logMessage("failAlchemize");
}

// === PRESTIGE MACHINE FUNCTIONS ===

// Articrafter: craft artifacts (handled in game.js buildSubMachines)
function articraft(item) {
	if (!item || !items[item] || items[item].type !== "artifact") return;
	// Can't craft if already owned
	if (things[item] >= 1) return;
	var ings = items[item].ingredients;
	// Check all ingredients available
	for (var i = 0; i < ings.length; i++) {
		var ingType = evalType(ings[i]);
		if (!window[ingType][ings[i]] || window[ingType][ings[i]] < 1) return;
	}
	// Pay all ingredients
	for (var i = 0; i < ings.length; i++) {
		var ingType = evalType(ings[i]);
		pay(ingType, ings[i], 1);
	}
	acquire("things", item, 1);
	// Track crafted artifact
	if (prestigeState.craftedArtifacts.indexOf(item) === -1) {
		prestigeState.craftedArtifacts.push(item);
	}
	logMessage("articraft");
	if (typeof refreshArtifactsButton === 'function') refreshArtifactsButton();
}

// Atelier: Canvas + Paint + Imagination (fuel) -> Masterpiece
function atelierCraft() {
	if (things.canvas < 1 || things.paint < 1) return;
	// Check imagination fuel gauge
	if (typeof atelierFuel === 'undefined' || atelierFuel.imagination < 10) return;
	pay("things", "canvas", 1);
	pay("things", "paint", 1);
	atelierFuel.imagination -= 10;
	$('.subMachine.atelier .oracle-gauge .fuel').text(atelierFuel.imagination);
	$('.subMachine.atelier .oracle-gauge .fuelDraw').css('width', (atelierFuel.imagination / 10 * 100) + '%');
	acquire("things", "masterpiece", 1);
	logMessage("painting");
}

// Chapel: Faith + Devotion + Blessed Oil (fuel) -> Spirit
function chapelCraft() {
	if (ideas.faith < 1 || ideas.devotion < 1) return;
	if (typeof chapelFuel === 'undefined' || chapelFuel.blessedOil < 10) return;
	pay("ideas", "faith", 1);
	pay("ideas", "devotion", 1);
	chapelFuel.blessedOil -= 10;
	$('.subMachine.chapel .oracle-gauge .fuel').text(chapelFuel.blessedOil);
	$('.subMachine.chapel .oracle-gauge .fuelDraw').css('width', (chapelFuel.blessedOil / 10 * 100) + '%');
	acquire("ideas", "spirit", 1);
	logMessage("pray");
}

// Abyss: Faildust + Goo + Failure + Evil (fuel) -> Sin
function abyssCraft() {
	if (dusts.failAlchemize < 1 || things.goo < 1 || ideas.failure < 1) return;
	if (typeof abyssFuel === 'undefined' || abyssFuel.evil < 10) return;
	pay("dusts", "failAlchemize", 1);
	pay("things", "goo", 1);
	pay("ideas", "failure", 1);
	abyssFuel.evil -= 10;
	$('.subMachine.abyss .oracle-gauge .fuel').text(abyssFuel.evil);
	$('.subMachine.abyss .oracle-gauge .fuelDraw').css('width', (abyssFuel.evil / 10 * 100) + '%');
	acquire("things", "sin", 1);
	logMessage("sinning");
}

// Market: Spend Gold to buy resources
var marketPrices = {
	mind: 1, matter: 1, strength: 1, will: 2,
	recursion: 2, fire: 3, water: 3, earth: 3, air: 3
};

function marketBuy(resourceId, amount) {
	if (!amount) amount = 1;
	var price = marketPrices[resourceId] || 5;
	var totalCost = price * amount;
	if (things.gold < totalCost) return;
	pay("things", "gold", totalCost);
	var type = evalType(resourceId);
	acquire(type, resourceId, amount);
	logMessage("buy");
}

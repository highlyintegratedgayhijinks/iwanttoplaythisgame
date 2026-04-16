function earn(){
	$.each(itemCounter, function(key, type){
		$.each(type, function(id){
			$('.'+key+'s.'+id).remove();
			type[id] = type[id] + 1500;
		});
	});
	// Ensure all liquids are earned too
	$.each(items, function(id, item){
		if(item.liquid){
			if(!liquids[id]) liquids[id] = 0;
			liquids[id] += 1500;
		}
	});
	buildAllItems();
}

function unlock(){
	earn();
	unlockMachine("mentalize");
	unlockMachine("reify");
	unlockMachine("want");
	earn();
	buildBuyables();

}


$(document).bind('keydown', function (event) {
	if (event.key == "s") {
		$('#wrapper .box').show();
		$('.machineUnlock').show();
		$('#machines').show();
		$.each(showStatus, function(id){
			showStatus[id] = "unlocked";
		});
	}
});

$(document).bind('keydown', function (event) {
	if (event.key == "e") {
		earn();
	}
});

$(document).bind('keydown', function (event) {
	if (event.key == "u") {
		$('#wrapper .box.main').show();
		$('.machineUnlock').show();
		$('#machines').show();
		$.each(showStatus, function(id){
			showStatus[id] = "unlocked";
		});
		$.each(buyables, function(id){
			buyableStatus[id] = "unlocked";
		});
		// Unlock all item types (ideas, things, dusts)
		$.each(itemUnlock, function(type){
			$.each(itemUnlock[type], function(id){
				itemUnlock[type][id] = "unlocked";
			});
		});
		// Give some of every pure idea, thing, dust, and liquid
		$.each(items, function(id, item){
			if (item.idea && item.type === "pure") ideas[id] = (ideas[id] || 0) + 100;
			if (item.thing && item.type === "pure") things[id] = (things[id] || 0) + 100;
			if (item.dust && item.type === "impure") dusts[id] = (dusts[id] || 0) + 100;
			if (item.liquid && item.type === "pure") liquids[id] = (liquids[id] || 0) + 100;
		});
		// Mark all facts seen
		if (typeof seenFacts !== "undefined") {
			$.each(actions, function(id){ seenFacts[id] = true; });
		}
		// Unlock all machines
		$.each(machineStatus, function(id){
			machineStatus[id] = "unlocked";
		});
		unlock();
		buildAllItems();
		updateLocalStorage();
	}
});

$(document).bind('keydown', function (event) {
	if (event.key == "H") {
		// Unlock all humans
		if (typeof prestigeState === 'undefined') window.prestigeState = {};
		if (!prestigeState.createdHumans) prestigeState.createdHumans = [];
		var profiles = window._stickman ? window._stickman.profiles : [];
		for (var i = 0; i < profiles.length; i++) {
			if (prestigeState.createdHumans.indexOf(profiles[i].name) === -1) {
				prestigeState.createdHumans.push(profiles[i].name);
			}
		}
		if (typeof refreshHumansButton === 'function') refreshHumansButton();

		// Unlock all books
		$.each(bookPages, function(topic, pages){
			bookProgress[topic] = pages.length;
			pages.forEach(function(page){
				page.ingredients.forEach(function(ing){ seeName(ing); });
				seeName(page.result);
			});
		});
		$('#libraryButton').show();
		if(libraryPageStatus === 'shown') renderLibrary();

		// Unlock all artifacts
		if (!prestigeState.craftedArtifacts) prestigeState.craftedArtifacts = [];
		var allArtifacts = ['wreath', 'ember', 'echo', 'root', 'tear', 'shard', 'sigil', 'crown', 'veil'];
		for (var i = 0; i < allArtifacts.length; i++) {
			if (prestigeState.craftedArtifacts.indexOf(allArtifacts[i]) === -1) {
				prestigeState.craftedArtifacts.push(allArtifacts[i]);
			}
			things[allArtifacts[i]] = (things[allArtifacts[i]] || 0) + 1;
			seeName(allArtifacts[i]);
		}
		buildAllItems();
		if (typeof refreshArtifactsButton === 'function') refreshArtifactsButton();
		updateLocalStorage();
	}
});

$(document).bind('keydown', function (event) {
	if (event.key == "0") {
		prestigeResetting = true;
		localStorage.removeItem('gameState');
		localStorage.removeItem('prestigeState');
		location.reload();
	}
});
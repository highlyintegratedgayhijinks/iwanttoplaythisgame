/* Mobile tab system for columns, machines, and final machines */

(function() {

var isMobile = function() {
	return window.innerWidth <= 768;
};

var columnTabsBuilt = false;
var machineTabsBuilt = false;
var settingsTabsBuilt = false;
var fmBarBuilt = false;
var activeColumnId = null;
var activeMachineToken = null;
var activeFmId = null;
var activeSettingsTab = null;

// ── Column tabs (Facts / Ideas / Things) ──

function buildColumnTabs() {
	if (columnTabsBuilt) return;
	if (!isMobile()) return;

	var $tabs = $('<div class="mobile-column-tabs"></div>');
	$tabs.append('<div class="mobile-tab" data-target="log">Facts</div>');
	$tabs.append('<div class="mobile-tab" data-target="ideas">Ideas</div>');
	$tabs.append('<div class="mobile-tab" data-target="things">Things</div>');
	$('#wrapper').before($tabs);

	$tabs.on('click', '.mobile-tab', function() {
		switchColumnTab($(this).data('target'));
	});

	columnTabsBuilt = true;

	var activated = false;
	$tabs.find('.mobile-tab').each(function() {
		var id = $(this).data('target');
		if (!activated && typeof showStatus !== 'undefined' && showStatus[id] === 'unlocked') {
			switchColumnTab(id);
			activated = true;
		}
	});
	if (!activated) switchColumnTab('log');
}

function switchColumnTab(id) {
	activeColumnId = id;
	$('.mobile-column-tabs .mobile-tab').removeClass('active');
	$('.mobile-column-tabs .mobile-tab[data-target="' + id + '"]').addClass('active');
	$('#wrapper .box.main').removeClass('mobile-active');
	$('#' + id + '.main').addClass('mobile-active');
}

// ── Machine bottom tabs ──

function buildMachineTabs() {
	if (machineTabsBuilt) return;
	if (!isMobile()) return;

	var $tabs = $('<div class="mobile-machine-tabs"></div>');
	var machines = ['mentalize', 'reify', 'want'];
	var labels = { mentalize: 'Mind Palace', reify: 'Matter Lab', want: 'Heart Complex' };

	$.each(machines, function(i, token) {
		$tabs.append('<div class="mobile-tab ' + token + '" data-target="' + token + '">' + labels[token] + '</div>');
	});

	$('#machines').prepend($tabs);

	$tabs.on('click', '.mobile-tab', function() {
		var target = $(this).data('target');
		if (target === activeMachineToken) {
			closeMachinePanel();
		} else {
			switchMachineTab(target);
		}
	});

	machineTabsBuilt = true;
}

function switchMachineTab(token) {
	activeMachineToken = token;
	$('.mobile-machine-tabs .mobile-tab').removeClass('active');
	$('.mobile-machine-tabs .mobile-tab[data-target="' + token + '"]').addClass('active');
	$('#machines .machine.box, #machines .machineUnlock.box').removeClass('mobile-active');
	if (typeof machineStatus !== 'undefined' && machineStatus[token] === 'unlocked') {
		$('#machines .machine.' + token).addClass('mobile-active');
	} else {
		$('#machines .machineUnlock.' + token).addClass('mobile-active');
	}
	// Close FM panel
	closeFmPanel();
}

function closeMachinePanel() {
	activeMachineToken = null;
	$('.mobile-machine-tabs .mobile-tab').removeClass('active');
	$('#machines .machine.box, #machines .machineUnlock.box').removeClass('mobile-active');
	repositionFmBar();
}

// ── FM bar (independent fixed div above machines) ──

function buildFmBar() {
	if (fmBarBuilt) return;
	if (!isMobile()) return;
	if (!$('#container').hasClass('has-final-machines')) return;

	var fms = ['enminder', 'altar', 'ensouler'];
	var labels = { enminder: 'Enminder', altar: 'Altar', ensouler: 'Ensouler' };

	var available = [];
	$.each(fms, function(i, id) {
		if (typeof finalMachineStatus !== 'undefined' && finalMachineStatus[id] === 'unlocked') {
			if ($('#' + id).length) {
				available.push(id);
			}
		}
	});

	if (available.length === 0) return;

	var $bar = $('<div id="mobileFmBar" class="visible"></div>');
	var $tabs = $('<div class="mobile-fm-tabs"></div>');
	var $content = $('<div class="mobile-fm-content"></div>');

	$.each(available, function(i, id) {
		$tabs.append('<div class="mobile-tab ' + id + '" data-target="' + id + '">' + labels[id] + '</div>');
	});

	$bar.append($tabs);
	$bar.append($content);
	$('body').append($bar);

	// Move FM elements after the bar is in DOM
	$.each(available, function(i, id) {
		var $fm = $('#' + id);
		$fm.attr('style', '');
		$fm.appendTo($content);
	});

	$tabs.on('click', '.mobile-tab', function(e) {
		e.stopPropagation();
		var target = $(this).data('target');
		if (target === activeFmId) {
			closeFmPanel();
		} else {
			switchFmTab(target);
		}
	});

	fmBarBuilt = true;
	repositionFmBar();
}

function switchFmTab(id) {
	if (!id) return;
	activeFmId = id;
	$('#mobileFmBar .mobile-fm-tabs .mobile-tab').removeClass('active');
	$('#mobileFmBar .mobile-fm-tabs .mobile-tab[data-target="' + id + '"]').addClass('active');
	$('#mobileFmBar .mobile-fm-content').children().removeClass('mobile-active');
	$('#' + id).addClass('mobile-active');
	$('#mobileFmBar').addClass('visible');
	// Close machine panel
	closeMachinePanel();
	repositionFmBar();
}

function closeFmPanel() {
	activeFmId = null;
	$('#mobileFmBar .mobile-fm-tabs .mobile-tab').removeClass('active');
	$('#mobileFmBar .mobile-fm-content').children().removeClass('mobile-active');
	repositionFmBar();
}

function repositionFmBar() {
	if (!fmBarBuilt) return;
	var machinesH = $('#machines').outerHeight() || 0;
	$('#mobileFmBar').css('bottom', machinesH + 'px');
}

// ── Settings tabs ──

function buildSettingsTabs() {
	if (settingsTabsBuilt) return;
	if (!isMobile()) return;
	if (!$('#settings').length) return;

	var $tabs = $('<div class="mobile-settings-tabs"></div>');
	$tabs.append('<div class="mobile-tab" data-target="settingspanel">Settings</div>');
	$tabs.append('<div class="mobile-tab" data-target="stats">Stats</div>');
	$tabs.append('<div class="mobile-tab" data-target="credits">Credits</div>');
	$('#settings').prepend($tabs);

	$tabs.on('click', '.mobile-tab', function() {
		switchSettingsTab($(this).data('target'));
	});

	settingsTabsBuilt = true;
	switchSettingsTab('settingspanel');
}

function switchSettingsTab(id) {
	activeSettingsTab = id;
	$('.mobile-settings-tabs .mobile-tab').removeClass('active');
	$('.mobile-settings-tabs .mobile-tab[data-target="' + id + '"]').addClass('active');
	$('#settings .box').removeClass('mobile-active');
	$('#' + id).addClass('mobile-active');
}

// ── Layout management ──

var prevMobile = null;

function onResize() {
	var mobile = isMobile();
	if (prevMobile !== mobile) {
		if (mobile) {
			buildColumnTabs();
			buildMachineTabs();
			buildSettingsTabs();
			// Defer FM bar build to ensure DOM is settled
			setTimeout(function() {
				if ($('#container').hasClass('has-final-machines')) {
					buildFmBar();
				}
			}, 50);
		} else {
			$('.mobile-active').removeClass('mobile-active');
			if (fmBarBuilt) {
				var fmColumnMap = { enminder: '#log', altar: '#ideas', ensouler: '#things' };
				['enminder', 'altar', 'ensouler'].forEach(function(id) {
					var $fm = $('#' + id);
					var targetBox = fmColumnMap[id];
					if ($fm.length && targetBox) {
						var $target = $(targetBox);
						if ($target.parent().is('.column')) {
							$target.parent().append($fm);
							$fm.show();
						}
					}
				});
				$('#mobileFmBar').remove();
				fmBarBuilt = false;
				activeFmId = null;
			}
		}
		prevMobile = mobile;
	}
	if (mobile) repositionFmBar();
}

// ── Public API ──

window.initMobile = function() {
	onResize();
	$(window).on('resize', onResize);
};

window.mobileRefreshMachines = function() {
	if (!isMobile()) return;
	if (!machineTabsBuilt) buildMachineTabs();
	if (activeMachineToken) switchMachineTab(activeMachineToken);
};

window.mobileRefreshFinalMachines = function() {
	if (!isMobile()) return;
	// Always defer slightly to ensure buildFinalMachine has populated content
	setTimeout(function() {
		if (!fmBarBuilt) {
			buildFmBar();
		} else {
			var fms = ['enminder', 'altar', 'ensouler'];
			var labels = { enminder: 'Enminder', altar: 'Altar', ensouler: 'Ensouler' };
			fms.forEach(function(id) {
				if (typeof finalMachineStatus !== 'undefined' && finalMachineStatus[id] === 'unlocked') {
					if (!$('#mobileFmBar .mobile-fm-tabs .mobile-tab[data-target="' + id + '"]').length) {
						$('#mobileFmBar .mobile-fm-tabs').append(
							'<div class="mobile-tab ' + id + '" data-target="' + id + '">' + labels[id] + '</div>'
						);
						var $fm = $('#' + id);
						$fm.attr('style', '');
						$fm.appendTo('#mobileFmBar .mobile-fm-content');
					}
				}
			});
			var newId = null;
			fms.forEach(function(id) {
				if (typeof finalMachineStatus !== 'undefined' && finalMachineStatus[id] === 'unlocked') {
					newId = id;
				}
			});
			if (newId) switchFmTab(newId);
		}
	}, 50);
};

window.mobileRefreshColumns = function() {
	if (!isMobile()) return;
	if (!columnTabsBuilt) return;

	$('.mobile-column-tabs .mobile-tab').each(function() {
		var id = $(this).data('target');
		if (typeof showStatus !== 'undefined' && showStatus[id] === 'unlocked') {
			$(this).show();
		} else {
			$(this).hide();
		}
	});

	var $active = $('.mobile-column-tabs .mobile-tab.active');
	if (!$active.length || !$active.is(':visible')) {
		var $first = $('.mobile-column-tabs .mobile-tab:visible').first();
		if ($first.length) switchColumnTab($first.data('target'));
	}
};

window.mobileShowSettings = function() {
	if (!isMobile()) return;
	if (!settingsTabsBuilt) buildSettingsTabs();
	switchSettingsTab(activeSettingsTab || 'settingspanel');
};

window.mobileHideGameUI = function() {
	if (!isMobile()) return;
	$('.mobile-column-tabs').hide();
	$('#wrapper').hide();
	$('#machines').hide();
	$('#mobileFmBar').hide();
};

window.mobileShowGameUI = function() {
	if (!isMobile()) return;
	$('.mobile-column-tabs').show();
	$('#wrapper').show();
	if (typeof showStatus !== 'undefined' && showStatus.machines === 'unlocked') {
		$('#machines').show();
	}
	if (fmBarBuilt) {
		$('#mobileFmBar').show();
		repositionFmBar();
	}
	if (activeColumnId) switchColumnTab(activeColumnId);
};

})();

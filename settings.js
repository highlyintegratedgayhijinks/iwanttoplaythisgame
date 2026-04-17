var gameSettings = {
    numberFormat: 'raw',
    tooltips: true,
    animations: true
};

function loadGameSettings(){
    var saved = localStorage.getItem('gameSettings');
    if (saved) {
        try { $.extend(gameSettings, JSON.parse(saved)); } catch(e) {}
    }
    applyGameSettings();
}

function saveGameSettings(){
    localStorage.setItem('gameSettings', JSON.stringify(gameSettings));
}

function applyGameSettings(){
    if (gameSettings.animations) {
        $('body').removeClass('no-animations');
        $.fx.off = false;
    } else {
        $('body').addClass('no-animations');
        $.fx.off = true;
    }
}

function formatNumber(n){
    n = Math.floor(n);
    if (gameSettings.numberFormat === 'abbreviated') {
        if (n >= 1e12) return (n / 1e12).toFixed(1) + 'T';
        if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
        if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
        if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    }
    return n;
}

function showDialog(message, onConfirm, onCancel){
    var overlay = $('<div class="dialog-overlay"></div>');
    var dialog = $(`
        <div class="dialog-box">
            <div class="dialog-message">${message}</div>
            <div class="dialog-buttons"></div>
        </div>
    `);
    if (onConfirm) {
        var confirmBtn = $('<div class="button dialog-confirm">Confirm</div>');
        var cancelBtn = $('<div class="button dialog-cancel">Cancel</div>');
        dialog.find('.dialog-buttons').append(cancelBtn).append(confirmBtn);
        confirmBtn.on('click', function(){ overlay.remove(); onConfirm(); });
        cancelBtn.on('click', function(){ overlay.remove(); if (onCancel) onCancel(); });
    } else {
        var okBtn = $('<div class="button dialog-confirm">OK</div>');
        dialog.find('.dialog-buttons').append(okBtn);
        okBtn.on('click', function(){ overlay.remove(); });
    }
    overlay.append(dialog);
    $('body').append(overlay);
}

function settings(){
    loadGameSettings();
    buildSettings();
    bindSettingsEvents();
    var settingsStatus = "hidden";
    var statsInterval = null;

    $('#headerButtons').append('<div id="settingsButton" class="settings"></div>');
    $('#settingsButton').on( "click", function() {
        showSettings();
    });

    function bindSettingsEvents(){
        $('#wipeSave').on("click", function() { wipeSave(); });
        $('#exportSave').on("click", function() { exportSave(); });
        $('#importSave').on("click", function() { importSave(); });

        $('#numberFormat').val(gameSettings.numberFormat);
        $('#numberFormat').on("change", function(){
            gameSettings.numberFormat = $(this).val();
            saveGameSettings();
        });

        $('#toggleTooltips').prop('checked', gameSettings.tooltips);
        $('#toggleTooltips').on("change", function(){
            gameSettings.tooltips = $(this).is(':checked');
            saveGameSettings();
        });

        $('#toggleAnimations').prop('checked', gameSettings.animations);
        $('#toggleAnimations').on("change", function(){
            gameSettings.animations = $(this).is(':checked');
            saveGameSettings();
            applyGameSettings();
        });

        $('#creditsWant').on("click", function(){
            logMessage("want");
        });
    }

    function wipeSave(){
        showDialog("Wipe save and restart? This cannot be undone.", function(){
            localStorage.removeItem('gameState');
            localStorage.removeItem('gameSettings');
            location.reload();
        });
    }

    function exportSave(){
        updateLocalStorage();
        var data = localStorage.getItem('gameState') || '{}';
        var encoded = btoa(data);
        $('#importExportArea').val(encoded).select();
        document.execCommand('copy');
        $('#exportStatus').text('Copied!').fadeIn().delay(1500).fadeOut();
    }

    function importSave(){
        var encoded = $('#importExportArea').val().trim();
        if (!encoded) return;
        try {
            var decoded = atob(encoded);
            JSON.parse(decoded);
            showDialog("Import this save? Current progress will be overwritten.", function(){
                localStorage.setItem('gameState', decoded);
                location.reload();
            });
        } catch(e) {
            showDialog("Invalid save data.");
        }
    }

    function buildSettings(){
        $('#container').prepend(`
        <div id="settings" style="display: none">
        <div id="settingspanel" class="box">
            <div class="header"><strong>Settings</strong></div>
            <div class="content">
                <div class="section"><div class="title">Display</div>
                    <div class="setting">Number format <span class="counter"><select id="numberFormat"><option value="raw">Raw (1000000)</option><option value="abbreviated">Abbreviated (1M)</option></select></span></div>
                    <div class="setting"><label><input type="checkbox" id="toggleTooltips"> Show button tooltips</label></div>
                    <div class="setting"><label><input type="checkbox" id="toggleAnimations"> Animations</label></div>
                </div>
                <div class="section"><div class="title">Save</div>
                    <div class="setting"><textarea id="importExportArea" rows="3" placeholder="Paste save data here to import..."></textarea></div>
                    <div class="setting" style="display:flex;gap:5px;flex-wrap:wrap;">
                        <div id="exportSave" class="button">Export Save</div>
                        <div id="importSave" class="button">Import Save</div>
                        <div id="wipeSave" class="button">Wipe Save</div>
                        <span id="exportStatus" style="display:none;font-size:12px;color:#888;align-self:center;"></span>
                    </div>
                </div>
            </div>
        </div>
        <div id="stats" class="box">
            <div class="header"><strong>Stats</strong></div>
            <div class="content">
                <div class="section"><div class="title">Resources</div>
                    <div class="stat">Total Ideas <span class="counter" id="stat-ideas">0</span></div>
                    <div class="stat">Total Things <span class="counter" id="stat-things">0</span></div>
                    <div class="stat">Total Dusts <span class="counter" id="stat-dusts">0</span></div>
                    <div class="stat">Total Liquids <span class="counter" id="stat-liquids">0</span></div>
                </div>
                <div class="section"><div class="title">Rates</div>
                    <div class="stat">Mind/s <span class="counter" id="stat-mind-rate">0</span></div>
                    <div class="stat">Matter/s <span class="counter" id="stat-matter-rate">0</span></div>
                    <div class="stat">Strength/s <span class="counter" id="stat-strength-rate">0</span></div>
                    <div class="stat">Will/s <span class="counter" id="stat-will-rate">0</span></div>
                </div>
                <div class="section"><div class="title">Activity</div>
                    <div class="stat">Total facts <span class="counter" id="stat-logcount">0</span></div>
                    <div class="stat">Pending facts <span class="counter" id="stat-activelog">0</span></div>
                </div>
                <div class="section"><div class="title">Progress</div>
                    <div class="stat">Facts seen <span class="counter" id="stat-facts-seen">0</span></div>
                    <div class="stat">Items discovered <span class="counter" id="stat-items">0</span></div>
                    <div class="stat">Buyables unlocked <span class="counter" id="stat-buyables">0</span></div>
                    <div class="stat">Machines unlocked <span class="counter" id="stat-machines">0</span></div>
                </div>
            </div>
        </div>
        <div id="credits" class="box">
            <div class="header"><strong>Credits</strong></div>
            <div class="content">
            <div class="text">
            <div class="button want" id="creditsWant">I want to play this game</div>
            <br/>
            made by <a href="https://hijinks.uno"><img src="img/highlogo.svg" class="high"></img></a>
            <div class="credits-links">
                <a href="https://discord.gg/" target="_blank" class="button credits-link">Join our Discord</a>
                <a href="https://patreon.com/" target="_blank" class="button credits-link">Support us on Patreon</a>
            </div>
            </div>
            
            </div>
        </div>
        </div>`)
    }

    function updateStats(){
        var sumOf = function(obj){ var s = 0; $.each(obj, function(k,v){ s += Math.floor(v); }); return s; };
        var countVal = function(obj, val){ var c = 0; $.each(obj, function(k,v){ if(v === val) c++; }); return c; };
        var totalKeys = function(obj){ return Object.keys(obj).length; };

        $('#stat-ideas').text(formatNumber(sumOf(ideas)));
        $('#stat-things').text(formatNumber(sumOf(things)));
        $('#stat-dusts').text(formatNumber(sumOf(dusts)));
        $('#stat-liquids').text(formatNumber(sumOf(liquids)));

        var mindRate = (showStatus && showStatus.log === "unlocked" && baseRate.mind !== undefined) ? baseRate.mind : 0;
        var matterRate = (showStatus && showStatus.log === "unlocked" && baseRate.matter !== undefined) ? baseRate.matter : 0;
        var strengthRate = (showStatus && showStatus.log === "unlocked" && baseRate.strength !== undefined) ? baseRate.strength : 0;
        $('#stat-mind-rate').text((power.mind + mindRate).toFixed(1));
        $('#stat-matter-rate').text((power.matter + matterRate).toFixed(1));
        $('#stat-strength-rate').text((power.strength + strengthRate).toFixed(1));
        $('#stat-will-rate').text(power.will ? power.will.toFixed(1) : '0');

        $('#stat-logcount').text(logCount);
        $('#stat-activelog').text(activeLogCounter);

        $('#stat-facts-seen').text(Object.keys(seenFacts).length + ' / ' + totalKeys(actions));

        var itemsUnlocked = 0, itemsTotal = 0;
        $.each(itemUnlock, function(type, entries){
            $.each(entries, function(k,v){ itemsTotal++; if(v === "unlocked") itemsUnlocked++; });
        });
        $('#stat-items').text(itemsUnlocked + ' / ' + itemsTotal);
        $('#stat-buyables').text(countVal(buyableStatus, "unlocked") + ' / ' + totalKeys(buyableStatus));
        $('#stat-machines').text(countVal(machineStatus, "unlocked") + ' / ' + totalKeys(machineStatus));
    }

    window.closeSettings = function(){
        if (settingsStatus === "shown") {
            settingsStatus = "hidden";
            $('#settingsButton').addClass("settings").removeClass("back");
            $('#settings').hide();
            clearInterval(statsInterval);
        }
    };

    function showSettings(){
        if (settingsStatus == "hidden"){
            if (typeof closeTree === 'function') closeTree();
            if (typeof closeHumans === 'function') closeHumans();
            settingsStatus = "shown";
            $('#settingsButton').removeClass("settings").addClass("back");
            $('#wrapper').hide();
            $('#machines').hide();
            $('#finalMachines').hide();
            $('#settings').show();
            if (typeof mobileHideGameUI === 'function') mobileHideGameUI();
            if (typeof mobileShowSettings === 'function') mobileShowSettings();
            updateStats();
            statsInterval = setInterval(updateStats, 1000);
    } else if
            (settingsStatus == "shown"){
            settingsStatus = "hidden";
            $('#settingsButton').addClass("settings").removeClass("back");
            $('#wrapper').show();
            if (showStatus && showStatus.machines === "unlocked") $('#machines').show();
            if ($('#container').hasClass('has-final-machines')) $('#finalMachines').show();
            $('#settings').hide();
            if (typeof mobileShowGameUI === 'function') mobileShowGameUI();
            clearInterval(statsInterval);
    }
    }

}


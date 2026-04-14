function settings(){
    buildSettings();
    $('#wipeSave').on("click", function() { wipeSave(); });
    var settingsStatus = "hidden";

    $('#header').append('<div id="settingsButton" class="settings"></div>');
    $('#settingsButton').on( "click", function() {
        showSettings();
    });

    function wipeSave(){
        if (confirm("Wipe save and restart? This cannot be undone.")) {
            localStorage.removeItem('gameState');
            location.reload();
        }
    }

    function buildSettings(){
        $('#container').prepend(`
        <div id="settings" style="display: none">
        <div id="settingspanel" class="box">
            <div class="header"><strong>Settings</strong></div>
            <div class="content">
                <div id="wipeSave" class="button">Wipe Save</div>
            </div>
        </div>
        <div id="stats" class="box">
            <div class="header"><strong>Stats</strong></div>
            <div class="content"></div>

        </div>
        <div id="credits" class="box">
            <div class="header"><strong>Credits</strong></div>
            <div class="content">
            <div class="text">
            I want to play this game
            <br/>
            made in 2023 by Manfredi Pumo @ <a href="https://high.pumo.mp"><img src="img/highlogo.svg" class="high"></img></a>
            <br/>
            <a href="https://galaxy.click/play/105"><img src="img/galaxy.svg" class="galaxy"></a>
            </div>
            
            </div>
        </div>
        </div>`)
    }

    function showSettings(){
        if (settingsStatus == "hidden"){
            settingsStatus = "shown";
            $('#settingsButton').removeClass("settings").addClass("back");
            $('#wrapper').hide();
            $('#settings').show();
    } else if
            (settingsStatus == "shown"){
            settingsStatus = "hidden";
            $('#settingsButton').addClass("settings").removeClass("back");
            $('#wrapper').show();
            $('#settings').hide();
    }
    }

}


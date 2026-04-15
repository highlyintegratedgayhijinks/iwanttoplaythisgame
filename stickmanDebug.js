// Humans page: 3x3 grid showing all 9 humans with special animations
(function () {
  var pageStatus = 'hidden';
  var animFrame = null;

  $('#headerButtons').prepend('<div id="humansButton" class="humansIcon" style="display:none"></div>');

  $('#humansButton').on('click', function () {
    if (pageStatus === 'hidden') showHumans();
    else hideHumans();
  });

  function buildPage() {
    $('#container').prepend(
      '<div id="humansPage" style="display:none">' +
        '<canvas id="humansCanvas"></canvas>' +
      '</div>'
    );
  }
  buildPage();

  window.closeHumans = function () {
    if (pageStatus === 'shown') hideHumans();
  };

  // Show/refresh the humans button when a human is unlocked
  window.refreshHumansButton = function () {
    var unlocked = (typeof humansUnlocked !== 'undefined') ? humansUnlocked : [];
    if (unlocked.length > 0) {
      $('#humansButton').show();
      // Reset men so they get recreated with updated unlock list
      men = [];
    }
  };

  // Check on load after a short delay (state may not be restored yet)
  setTimeout(function () {
    var unlocked = (typeof humansUnlocked !== 'undefined') ? humansUnlocked : [];
    if (unlocked.length > 0) $('#humansButton').show();
  }, 100);

  function showHumans() {
    if (typeof closeSettings === 'function') closeSettings();
    if (typeof closeTree === 'function') closeTree();
    pageStatus = 'shown';
    $('#humansButton').removeClass('humansIcon').addClass('back');
    $('#wrapper').hide();
    $('#machines').hide();
    $('#humansPage').show();
    $('#stickmanCanvas').hide();
    startLoop();
  }

  function hideHumans() {
    pageStatus = 'hidden';
    $('#humansButton').addClass('humansIcon').removeClass('back');
    $('#humansPage').hide();
    $('#wrapper').show();
    if (typeof showStatus !== 'undefined' && showStatus.machines === 'unlocked') $('#machines').show();
    $('#stickmanCanvas').show();
    if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
  }

  // ===== Rendering =====
  var S = window._stickman;
  var men = [];
  var canvas, ctx, dpr;

  function createMen() {
    if (!S) return;
    men = [];
    var unlocked = (typeof humansUnlocked !== 'undefined') ? humansUnlocked : [];
    for (var i = 0; i < S.profiles.length; i++) {
      var p = S.profiles[i];
      if (unlocked.indexOf(p.name) === -1) continue;
      var man = new S.StickMan(p.height * 2.5, p);
      var anim = S.specialAnims[p.special];
      if (anim) {
        var looping = JSON.parse(JSON.stringify(anim));
        delete looping.numRuns;
        man.addAnimation(looping);
      } else {
        man.addAnimation(S.idleAnimation);
      }
      man.updateBodyPositions();
      men.push({
        man: man,
        profile: p,
        name: p.name,
        specialActive: true,
        dir: 1
      });
    }
  }

  function startLoop() {
    canvas = document.getElementById('humansCanvas');
    if (!canvas || !S) return;

    dpr = window.devicePixelRatio || 1;
    var page = document.getElementById('humansPage');
    var w = page.offsetWidth;
    var h = page.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (men.length === 0) createMen();

    function loop() {
      animFrame = requestAnimationFrame(loop);
      if (pageStatus !== 'shown') return;

      var page = document.getElementById('humansPage');
      var w = page.offsetWidth;
      var h = page.offsetHeight;

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      ctx.clearRect(0, 0, w, h);

      var cols = 3, rows = 3;
      var cellW = w / cols;
      var cellH = h / rows;

      for (var i = 0; i < men.length && i < 9; i++) {
        var col = i % cols;
        var row = Math.floor(i / cols);
        var cx = cellW * col + cellW / 2;
        var cy = cellH * row + cellH * 0.55;

        var entry = men[i];
        var man = entry.man;
        var p = entry.profile;

        man.animate();

        if (!S.specialAnims[p.special]) {
          if (Object.keys(man.animations).length === 0) {
            man.addAnimation(S.idleAnimation);
          }
        } else {
          if (Object.keys(man.animations).length === 0) {
            var looping = JSON.parse(JSON.stringify(S.specialAnims[p.special]));
            delete looping.numRuns;
            man.addAnimation(looping);
          }
        }

        var drawX = cx;
        var drawY = cy;

        if (p.special === 'rage') {
          drawX += (Math.random() - 0.5) * 6;
          drawY += (Math.random() - 0.5) * 3;
        }

        var skipRender = false;
        if (p.special === 'flicker') {
          if (Math.random() < 0.3) skipRender = true;
        }

        if (!skipRender) {
          man.render(ctx, [drawX, drawY]);
          S.drawItem(ctx, entry, drawX, drawY);

          if (p.special === 'juggle') {
            var b = man.body;
            var now = Date.now() * 0.005;
            ctx.fillStyle = man.color;
            for (var j = 0; j < 3; j++) {
              var phase = now + j * Math.PI * 2 / 3;
              var jx = drawX + Math.sin(phase) * 10;
              var jy = drawY + b.torso.startY - 6 + Math.cos(phase) * 6;
              ctx.beginPath();
              ctx.arc(jx, jy, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        ctx.font = "700 14px 'EB Garamond'";
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(entry.name, cx, cellH * row + cellH * 0.82);

        var soulLabel = p.soul.replace('Soul', ' Soul').replace(/([A-Z])/g, ' $1').trim();
        var mindLabel = p.mind.replace('Mind', ' Mind').replace(/([A-Z])/g, ' $1').trim();
        ctx.font = "400 11px 'EB Garamond'";
        ctx.fillStyle = '#999';
        ctx.fillText(soulLabel + ' + ' + mindLabel, cx, cellH * row + cellH * 0.88);

        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        if (col > 0) {
          ctx.beginPath();
          ctx.moveTo(cellW * col, cellH * row + 10);
          ctx.lineTo(cellW * col, cellH * (row + 1) - 10);
          ctx.stroke();
        }
        if (row > 0) {
          ctx.beginPath();
          ctx.moveTo(cellW * col + 10, cellH * row);
          ctx.lineTo(cellW * (col + 1) - 10, cellH * row);
          ctx.stroke();
        }
      }
    }
    loop();
  }
})();

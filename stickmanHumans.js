// Humans page: 3x3 grid showing all 9 humans with special animations
(function () {
  var pageStatus = 'hidden';
  var animFrame = null;

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

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    for (var n = 0; n < words.length; n++) {
      var test = line + words[n] + ' ';
      if (ctx.measureText(test).width > maxWidth && line !== '') {
        ctx.fillText(line.trim(), x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = test;
      }
    }
    ctx.fillText(line.trim(), x, y);
  }

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
    var unlocked = (typeof prestigeState !== 'undefined' && prestigeState.createdHumans) ? prestigeState.createdHumans : [];
    if (unlocked.length > 0) {
      $('#humansButton').show();
      // Reset men so they get recreated with updated unlock list
      men = [];
    }
  };

  // Check on load after a short delay (state may not be restored yet)
  setTimeout(function () {
    var unlocked = (typeof prestigeState !== 'undefined' && prestigeState.createdHumans) ? prestigeState.createdHumans : [];
    if (unlocked.length > 0) $('#humansButton').show();
  }, 100);

  function showHumans() {
    if (typeof closeSettings === 'function') closeSettings();
    if (typeof closeTree === 'function') closeTree();
    if (typeof closeLibrary === 'function') closeLibrary();
    if (typeof closeArtifacts === 'function') closeArtifacts();
    pageStatus = 'shown';
    $('#humansButton').removeClass('humansIcon').addClass('back');
    $('#wrapper').hide();
    $('#machines').hide();
    $('#finalMachines').hide();
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
    if ($('#container').hasClass('has-final-machines')) $('#finalMachines').show();
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
    var unlocked = (typeof prestigeState !== 'undefined' && prestigeState.createdHumans) ? prestigeState.createdHumans : [];
    for (var i = 0; i < S.profiles.length; i++) {
      var p = S.profiles[i];
      var isUnlocked = unlocked.indexOf(p.name) !== -1;
      if (isUnlocked) {
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
          unlocked: true,
          specialActive: true,
          dir: 1
        });
      } else {
        men.push({
          man: null,
          profile: p,
          name: p.name,
          unlocked: false,
          specialActive: false,
          dir: 1
        });
      }
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

      for (var i = 0; i < 9 && i < men.length; i++) {
        var col = i % cols;
        var row = Math.floor(i / cols);
        var cx = cellW * col + cellW / 2;
        var cy = cellH * row + cellH * 0.55 - 40;

        var entry = men[i];
        var p = entry.profile;

        // Grid lines
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

        if (entry.unlocked) {
          var man = entry.man;

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

          man.render(ctx, [drawX, drawY]);
          S.drawItem(ctx, entry, drawX, drawY);
          S.drawJuggle(ctx, p, man, true, drawX, drawY);

          ctx.font = "700 18px 'EB Garamond'";
          ctx.fillStyle = '#333';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(entry.name, cx, cellH * row + cellH * 0.80 - 40);

          var soulLabel = p.soul.replace('Soul', '').replace(/^./, function(c) { return c.toUpperCase(); }) + ' Soul';
          var mindLabel = p.mind.replace('Mind', '').replace(/^./, function(c) { return c.toUpperCase(); }) + ' Mind';
          var essenceColors = {
            braveSoul: '#B22222', lovingSoul: '#FF69B4', darkSoul: '#2F2F2F',
            rationalMind: '#4682B4', creativeMind: '#FF6347', madMind: '#9932CC'
          };
          ctx.font = "400 14px 'EB Garamond'";
          var plusW = ctx.measureText(' + ').width;
          var soulW = ctx.measureText(soulLabel).width;
          var mindW = ctx.measureText(mindLabel).width;
          var totalW = soulW + plusW + mindW;
          var startX = cx - totalW / 2;
          var lineY = cellH * row + cellH * 0.87 - 40;
          ctx.textAlign = 'left';
          ctx.fillStyle = essenceColors[p.soul] || '#999';
          ctx.fillText(soulLabel, startX, lineY);
          ctx.fillStyle = '#999';
          ctx.fillText(' + ', startX + soulW, lineY);
          ctx.fillStyle = essenceColors[p.mind] || '#999';
          ctx.fillText(mindLabel, startX + soulW + plusW, lineY);
          ctx.textAlign = 'center';

          // Modifier description
          var modDesc = modifierDescriptions[entry.name];
          if (modDesc) {
            ctx.font = "italic 12px 'EB Garamond'";
            ctx.fillStyle = '#bbb';
            wrapText(ctx, modDesc, cx, cellH * row + cellH * 0.98 - 40, cellW - 20, 16);
          }
        } else {
          // Locked slot — show placeholder
          ctx.font = "700 24px 'EB Garamond'";
          ctx.fillStyle = '#ddd';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('?', cx, cellH * row + cellH / 2);
        }
      }
    }
    loop();
  }
})();

// Artifacts page: 3x3 grid showing all 9 artifacts with SVG icons
(function () {
  var pageStatus = 'hidden';

  var artifactOrder = ['wreath', 'ember', 'echo', 'root', 'tear', 'shard', 'sigil', 'crown', 'veil'];

  var artifactDescriptions = {
    wreath: 'A circle of growth that honours the quiet persistence of life beginning again.',
    ember: 'A glowing remnant that refuses to go cold.',
    echo: 'A sound that repeats long after its source has fallen silent.',
    root: 'Deep and tenacious. It anchors itself in the earth and will not be moved.',
    tear: 'Not of sorrow alone, but of feeling so vast it can only leave the body as water.',
    shard: 'A jagged fragment, sharp enough to cut through pretense.',
    sigil: 'A dark mark that binds power into form, ancient and deliberate.',
    crown: 'Not merely worn upon the head, but upon the spirit.',
    veil: 'Thin as breath. It hangs between what is seen and what is hidden.'
  };

  // All drawings use coordinates in a -1..1 box (normalized).
  // drawArtifact() scales them to the target square size.
  var BOX = 28; // half-size of the draw box in s-units

  function drawArtifact(drawer, ctx, cx, cy, s) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(s * BOX, s * BOX);
    drawer(ctx);
    ctx.restore();
  }

  var artifactDrawers = {
    wreath: function(ctx) {
      var r = 0.7;
      ctx.strokeStyle = '#4a7a3b';
      ctx.lineWidth = 0.06;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
      for (var i = 0; i < 12; i++) {
        var a = (i / 12) * Math.PI * 2;
        ctx.save();
        ctx.translate(Math.cos(a) * r, Math.sin(a) * r);
        ctx.rotate(a + Math.PI / 2);
        ctx.fillStyle = '#5a9a48';
        ctx.beginPath();
        ctx.ellipse(0, 0, 0.1, 0.22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      for (var i = 0; i < 6; i++) {
        var a = (i / 6) * Math.PI * 2 + 0.3;
        ctx.fillStyle = '#c44';
        ctx.beginPath();
        ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 0.07, 0, Math.PI * 2);
        ctx.fill();
      }
    },

    ember: function(ctx) {
      var grd = ctx.createRadialGradient(0, 0.05, 0.15, 0, 0, 0.95);
      grd.addColorStop(0, 'rgba(255, 120, 20, 0.6)');
      grd.addColorStop(0.5, 'rgba(200, 60, 10, 0.3)');
      grd.addColorStop(1, 'rgba(100, 20, 0, 0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(0, 0.05, 0.95, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3a1505';
      ctx.beginPath();
      ctx.moveTo(-0.48, 0.25);
      ctx.quadraticCurveTo(-0.65, -0.16, -0.26, -0.52);
      ctx.quadraticCurveTo(0.06, -0.65, 0.39, -0.45);
      ctx.quadraticCurveTo(0.71, -0.13, 0.52, 0.32);
      ctx.quadraticCurveTo(0.26, 0.58, -0.06, 0.52);
      ctx.quadraticCurveTo(-0.39, 0.45, -0.48, 0.25);
      ctx.fill();
      ctx.strokeStyle = '#ff6820';
      ctx.lineWidth = 0.05;
      ctx.beginPath();
      ctx.moveTo(-0.26, -0.26);
      ctx.lineTo(-0.06, 0);
      ctx.lineTo(-0.19, 0.32);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0.13, -0.39);
      ctx.lineTo(0.06, -0.06);
      ctx.lineTo(0.26, 0.26);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-0.13, 0.06);
      ctx.lineTo(0.19, 0);
      ctx.stroke();
    },

    echo: function(ctx) {
      ctx.strokeStyle = '#6a7aaa';
      ctx.lineWidth = 0.05;
      ctx.fillStyle = '#4a5a8a';
      ctx.beginPath();
      ctx.arc(0, 0, 0.1, 0, Math.PI * 2);
      ctx.fill();
      for (var i = 1; i <= 4; i++) {
        var r = i * 0.22;
        ctx.globalAlpha = 1 - (i * 0.2);
        ctx.beginPath();
        ctx.arc(0, 0, r, -Math.PI * 0.7, Math.PI * 0.7);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, r, Math.PI * 0.3, Math.PI * 1.7);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    },

    root: function(ctx) {
      ctx.strokeStyle = '#5a3a1a';
      ctx.lineCap = 'round';
      ctx.lineWidth = 0.12;
      ctx.beginPath();
      ctx.moveTo(0, -0.78);
      ctx.quadraticCurveTo(-0.07, -0.28, 0, 0.18);
      ctx.quadraticCurveTo(0.07, 0.52, 0, 0.82);
      ctx.stroke();
      ctx.lineWidth = 0.07;
      ctx.beginPath();
      ctx.moveTo(0, -0.18);
      ctx.quadraticCurveTo(0.4, 0.07, 0.68, 0.48);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -0.07);
      ctx.quadraticCurveTo(-0.48, 0.14, -0.62, 0.55);
      ctx.stroke();
      ctx.lineWidth = 0.04;
      ctx.strokeStyle = '#7a5a3a';
      ctx.beginPath();
      ctx.moveTo(0.68, 0.48);
      ctx.quadraticCurveTo(0.75, 0.68, 0.62, 0.82);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-0.62, 0.55);
      ctx.quadraticCurveTo(-0.75, 0.75, -0.55, 0.88);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 0.18);
      ctx.quadraticCurveTo(0.28, 0.42, 0.42, 0.75);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 0.28);
      ctx.quadraticCurveTo(-0.2, 0.55, -0.34, 0.82);
      ctx.stroke();
      ctx.fillStyle = '#4a2a0a';
      ctx.beginPath();
      ctx.ellipse(0, -0.62, 0.17, 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
    },

    tear: function(ctx) {
      var grd = ctx.createRadialGradient(0, 0.1, 0.06, 0, 0.1, 0.9);
      grd.addColorStop(0, 'rgba(100, 160, 220, 0.3)');
      grd.addColorStop(1, 'rgba(100, 160, 220, 0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(0, 0.1, 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#b8d8f0';
      ctx.strokeStyle = '#6a9ac0';
      ctx.lineWidth = 0.05;
      ctx.beginPath();
      ctx.moveTo(0, -0.78);
      ctx.bezierCurveTo(-0.1, -0.52, -0.58, 0, -0.58, 0.32);
      ctx.bezierCurveTo(-0.58, 0.72, -0.32, 0.9, 0, 0.9);
      ctx.bezierCurveTo(0.32, 0.9, 0.58, 0.72, 0.58, 0.32);
      ctx.bezierCurveTo(0.58, 0, 0.1, -0.52, 0, -0.78);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.beginPath();
      ctx.ellipse(-0.16, 0.13, 0.13, 0.32, -0.3, 0, Math.PI * 2);
      ctx.fill();
    },

    shard: function(ctx) {
      ctx.fillStyle = '#8a7aaa';
      ctx.strokeStyle = '#4a3a6a';
      ctx.lineWidth = 0.05;
      ctx.beginPath();
      ctx.moveTo(0, -0.9);
      ctx.lineTo(0.26, -0.39);
      ctx.lineTo(0.45, -0.13);
      ctx.lineTo(0.32, 0.52);
      ctx.lineTo(0.13, 0.84);
      ctx.lineTo(-0.06, 0.65);
      ctx.lineTo(-0.26, 0.26);
      ctx.lineTo(-0.39, -0.19);
      ctx.lineTo(-0.19, -0.58);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 0.035;
      ctx.beginPath();
      ctx.moveTo(0, -0.9);
      ctx.lineTo(0.06, 0.19);
      ctx.lineTo(0.13, 0.84);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-0.39, -0.19);
      ctx.lineTo(0.06, 0.19);
      ctx.lineTo(0.45, -0.13);
      ctx.stroke();
      ctx.fillStyle = 'rgba(40, 20, 60, 0.25)';
      ctx.beginPath();
      ctx.moveTo(0, -0.9);
      ctx.lineTo(-0.19, -0.58);
      ctx.lineTo(-0.39, -0.19);
      ctx.lineTo(0.06, 0.19);
      ctx.closePath();
      ctx.fill();
    },

    sigil: function(ctx) {
      ctx.strokeStyle = '#3a3a3a';
      ctx.lineWidth = 0.05;
      ctx.beginPath();
      ctx.arc(0, 0, 0.85, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = '#6a2a4a';
      ctx.lineWidth = 0.065;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, -0.58);
      ctx.lineTo(0, 0.58);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -0.26);
      ctx.lineTo(0.39, -0.52);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -0.26);
      ctx.lineTo(-0.39, -0.52);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 0.19);
      ctx.lineTo(0.45, 0.39);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 0.19);
      ctx.lineTo(-0.45, 0.39);
      ctx.stroke();
      ctx.fillStyle = '#6a2a4a';
      ctx.beginPath();
      ctx.moveTo(0, -0.13);
      ctx.lineTo(0.13, 0);
      ctx.lineTo(0, 0.13);
      ctx.lineTo(-0.13, 0);
      ctx.closePath();
      ctx.fill();
    },

    crown: function(ctx) {
      ctx.fillStyle = '#d4a840';
      ctx.strokeStyle = '#8a6a10';
      ctx.lineWidth = 0.05;
      ctx.beginPath();
      ctx.moveTo(-0.75, 0.45);
      ctx.lineTo(-0.75, -0.05);
      ctx.lineTo(-0.48, -0.48);
      ctx.lineTo(-0.27, -0.0);
      ctx.lineTo(0, -0.75);
      ctx.lineTo(0.27, -0.0);
      ctx.lineTo(0.48, -0.48);
      ctx.lineTo(0.75, -0.05);
      ctx.lineTo(0.75, 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#c09830';
      ctx.fillRect(-0.75, 0.22, 1.5, 0.22);
      ctx.strokeRect(-0.75, 0.22, 1.5, 0.22);
      ctx.fillStyle = '#c44';
      ctx.beginPath();
      ctx.arc(-0.48, -0.35, 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#48c';
      ctx.beginPath();
      ctx.arc(0, -0.6, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#c44';
      ctx.beginPath();
      ctx.arc(0.48, -0.35, 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff8dc';
      for (var i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.arc(i * 0.27, 0.33, 0.05, 0, Math.PI * 2);
        ctx.fill();
      }
    },

    veil: function(ctx) {
      for (var layer = 3; layer >= 0; layer--) {
        var off = layer * 0.08;
        var alpha = 0.15 + layer * 0.08;
        ctx.fillStyle = 'rgba(180, 180, 210, ' + alpha + ')';
        ctx.strokeStyle = 'rgba(120, 120, 160, ' + (alpha + 0.1) + ')';
        ctx.lineWidth = 0.025;
        ctx.beginPath();
        ctx.moveTo(-0.52 + off, -0.78);
        ctx.quadraticCurveTo(-0.65 + off, -0.26, -0.72 + off / 2, 0.26);
        ctx.quadraticCurveTo(-0.58, 0.65, -0.26, 0.84);
        ctx.quadraticCurveTo(0, 0.9, 0.26, 0.84);
        ctx.quadraticCurveTo(0.58, 0.65, 0.72 - off / 2, 0.26);
        ctx.quadraticCurveTo(0.65 - off, -0.26, 0.52 - off, -0.78);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.strokeStyle = '#888';
      ctx.lineWidth = 0.065;
      ctx.beginPath();
      ctx.moveTo(-0.58, -0.78);
      ctx.lineTo(0.58, -0.78);
      ctx.stroke();
      ctx.fillStyle = '#999';
      ctx.beginPath();
      ctx.arc(-0.58, -0.78, 0.065, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0.58, -0.78, 0.065, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Header button
  $('#headerButtons').prepend('<div id="artifactsButton" class="artifactsIcon" style="display:none"></div>');

  $('#artifactsButton').on('click', function () {
    if (pageStatus === 'hidden') showArtifacts();
    else hideArtifacts();
  });

  // Build page
  $('#container').prepend(
    '<div id="artifactsPage" style="display:none">' +
      '<canvas id="artifactsCanvas"></canvas>' +
    '</div>'
  );

  // Expose for altar hex drawing
  window.artifactDrawers = artifactDrawers;
  window.drawArtifact = drawArtifact;

  window.closeArtifacts = function () {
    if (pageStatus === 'shown') hideArtifacts();
  };

  window.refreshArtifactsButton = function () {
    var crafted = (typeof prestigeState !== 'undefined' && prestigeState.craftedArtifacts) ? prestigeState.craftedArtifacts : [];
    var articrafterOpen = (typeof buyableStatus !== 'undefined' && buyableStatus.articrafterUnlock === 'unlocked');
    if (crafted.length > 0 || articrafterOpen) {
      $('#artifactsButton').show();
    }
  };

  setTimeout(function () {
    var crafted = (typeof prestigeState !== 'undefined' && prestigeState.craftedArtifacts) ? prestigeState.craftedArtifacts : [];
    var articrafterOpen = (typeof buyableStatus !== 'undefined' && buyableStatus.articrafterUnlock === 'unlocked');
    if (crafted.length > 0 || articrafterOpen) $('#artifactsButton').show();
  }, 100);

  function showArtifacts() {
    if (typeof closeSettings === 'function') closeSettings();
    if (typeof closeTree === 'function') closeTree();
    if (typeof closeLibrary === 'function') closeLibrary();
    if (typeof closeHumans === 'function') closeHumans();
    pageStatus = 'shown';
    $('#artifactsButton').removeClass('artifactsIcon').addClass('back');
    $('#wrapper').hide();
    $('#machines').hide();
    $('#finalMachines').hide();
    $('#artifactsPage').show();
    $('#stickmanCanvas').hide();
    if (typeof mobileHideGameUI === 'function') mobileHideGameUI();
    drawArtifacts();
  }

  function hideArtifacts() {
    pageStatus = 'hidden';
    $('#artifactsButton').addClass('artifactsIcon').removeClass('back');
    $('#artifactsPage').hide();
    $('#wrapper').show();
    if (typeof showStatus !== 'undefined' && showStatus.machines === 'unlocked') $('#machines').show();
    if ($('#container').hasClass('has-final-machines')) $('#finalMachines').show();
    $('#stickmanCanvas').show();
    if (typeof mobileShowGameUI === 'function') mobileShowGameUI();
  }

  function drawArtifacts() {
    var canvas = document.getElementById('artifactsCanvas');
    if (!canvas) return;

    var dpr = window.devicePixelRatio || 1;
    var page = document.getElementById('artifactsPage');
    var w = page.offsetWidth;
    var h = page.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, w, h);

    var crafted = (typeof prestigeState !== 'undefined' && prestigeState.craftedArtifacts) ? prestigeState.craftedArtifacts : [];

    var cols = 3, rows = 3;
    var cellW = w / cols;
    var cellH = h / rows;

    for (var i = 0; i < 9; i++) {
      var col = i % cols;
      var row = Math.floor(i / cols);
      var cx = cellW * col + cellW / 2;
      var cy = cellH * row + cellH * 0.42;
      var artKey = artifactOrder[i];
      var isCrafted = crafted.indexOf(artKey) !== -1;

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

      if (isCrafted) {
        // Draw the artifact — all fit in same square
        var scale = Math.min(cellW, cellH) / 140;
        drawArtifact(artifactDrawers[artKey], ctx, cx, cy, scale);

        // Name
        var mob = window.innerWidth <= 768;
        ctx.font = (mob ? "700 14px" : "700 18px") + " 'EB Garamond'";
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(items[artKey].thing, cx, cellH * row + cellH * 0.72);

        // Ingredients
        var ings = items[artKey].ingredients;
        var ingNames = ings.map(function(ing) {
          var t = evalType(ing);
          return items[ing][t.slice(0, -1)];
        });
        ctx.font = (mob ? "400 10px" : "400 13px") + " 'EB Garamond'";
        ctx.fillStyle = '#999';
        ctx.fillText(ingNames.join(' + '), cx, cellH * row + cellH * 0.79);

        // Description
        var desc = artifactDescriptions[artKey];
        if (desc) {
          ctx.font = (mob ? "italic 10px" : "italic 12px") + " 'EB Garamond'";
          ctx.fillStyle = '#bbb';
          wrapText(ctx, desc, cx, cellH * row + cellH * 0.87, cellW - 24, mob ? 12 : 15);
        }
      } else {
        // Locked: hexagon outline with ?
        ctx.save();
        ctx.translate(cx, cy);
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1.5;
        var hr = 26;
        ctx.beginPath();
        for (var p = 0; p < 6; p++) {
          var angle = (p / 6) * Math.PI * 2 - Math.PI / 6;
          var hx = Math.cos(angle) * hr;
          var hy = Math.sin(angle) * hr;
          if (p === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.font = (window.innerWidth <= 768 ? "700 18px" : "700 24px") + " 'EB Garamond'";
        ctx.fillStyle = '#ddd';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', 0, 0);
        ctx.restore();
      }
    }
  }

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
})();

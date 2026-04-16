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

  // SVG drawing functions for each artifact
  var artifactDrawers = {
    wreath: function(ctx, cx, cy, s) {
      // Wreath: a circle of leaves/vines
      ctx.save();
      ctx.translate(cx, cy);
      var r = 28 * s;
      ctx.strokeStyle = '#4a7a3b';
      ctx.lineWidth = 2 * s;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
      // Leaves around the ring
      for (var i = 0; i < 12; i++) {
        var angle = (i / 12) * Math.PI * 2;
        var lx = Math.cos(angle) * r;
        var ly = Math.sin(angle) * r;
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(angle + Math.PI / 2);
        ctx.fillStyle = '#5a9a48';
        ctx.beginPath();
        ctx.ellipse(0, 0, 4 * s, 8 * s, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      // Small berries
      for (var i = 0; i < 6; i++) {
        var angle = (i / 6) * Math.PI * 2 + 0.3;
        ctx.fillStyle = '#c44';
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * r, Math.sin(angle) * r, 2.5 * s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    },

    ember: function(ctx, cx, cy, s) {
      // Ember: a glowing coal shape
      ctx.save();
      ctx.translate(cx, cy);
      // Outer glow
      var grd = ctx.createRadialGradient(0, 2 * s, 5 * s, 0, 0, 30 * s);
      grd.addColorStop(0, 'rgba(255, 120, 20, 0.6)');
      grd.addColorStop(0.5, 'rgba(200, 60, 10, 0.3)');
      grd.addColorStop(1, 'rgba(100, 20, 0, 0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(0, 2 * s, 30 * s, 0, Math.PI * 2);
      ctx.fill();
      // Core shape - irregular coal
      ctx.fillStyle = '#3a1505';
      ctx.beginPath();
      ctx.moveTo(-15 * s, 8 * s);
      ctx.quadraticCurveTo(-20 * s, -5 * s, -8 * s, -16 * s);
      ctx.quadraticCurveTo(2 * s, -20 * s, 12 * s, -14 * s);
      ctx.quadraticCurveTo(22 * s, -4 * s, 16 * s, 10 * s);
      ctx.quadraticCurveTo(8 * s, 18 * s, -2 * s, 16 * s);
      ctx.quadraticCurveTo(-12 * s, 14 * s, -15 * s, 8 * s);
      ctx.fill();
      // Cracks with glow
      ctx.strokeStyle = '#ff6820';
      ctx.lineWidth = 1.5 * s;
      ctx.beginPath();
      ctx.moveTo(-8 * s, -8 * s);
      ctx.lineTo(-2 * s, 0);
      ctx.lineTo(-6 * s, 10 * s);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(4 * s, -12 * s);
      ctx.lineTo(2 * s, -2 * s);
      ctx.lineTo(8 * s, 8 * s);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-4 * s, 2 * s);
      ctx.lineTo(6 * s, 0);
      ctx.stroke();
      ctx.restore();
    },

    echo: function(ctx, cx, cy, s) {
      // Echo: concentric sound waves emanating from a point
      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = '#6a7aaa';
      ctx.lineWidth = 1.5 * s;
      // Central dot
      ctx.fillStyle = '#4a5a8a';
      ctx.beginPath();
      ctx.arc(0, 0, 3 * s, 0, Math.PI * 2);
      ctx.fill();
      // Concentric arcs
      for (var i = 1; i <= 4; i++) {
        var r = i * 8 * s;
        var alpha = 1 - (i * 0.2);
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(0, 0, r, -Math.PI * 0.7, Math.PI * 0.7);
        ctx.stroke();
        // Mirror arcs
        ctx.beginPath();
        ctx.arc(0, 0, r, Math.PI * 0.3, Math.PI * 1.7);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    },

    root: function(ctx, cx, cy, s) {
      // Root: tangled root system
      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = '#5a3a1a';
      ctx.lineCap = 'round';
      // Main root
      ctx.lineWidth = 3.5 * s;
      ctx.beginPath();
      ctx.moveTo(0, -22 * s);
      ctx.quadraticCurveTo(-2 * s, -8 * s, 0, 5 * s);
      ctx.quadraticCurveTo(2 * s, 15 * s, 0, 24 * s);
      ctx.stroke();
      // Branch roots
      ctx.lineWidth = 2 * s;
      ctx.beginPath();
      ctx.moveTo(0, -5 * s);
      ctx.quadraticCurveTo(12 * s, 2 * s, 20 * s, 14 * s);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -2 * s);
      ctx.quadraticCurveTo(-14 * s, 4 * s, -18 * s, 16 * s);
      ctx.stroke();
      // Thin tendrils
      ctx.lineWidth = 1.2 * s;
      ctx.strokeStyle = '#7a5a3a';
      ctx.beginPath();
      ctx.moveTo(20 * s, 14 * s);
      ctx.quadraticCurveTo(22 * s, 20 * s, 18 * s, 24 * s);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-18 * s, 16 * s);
      ctx.quadraticCurveTo(-22 * s, 22 * s, -16 * s, 26 * s);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 5 * s);
      ctx.quadraticCurveTo(8 * s, 12 * s, 12 * s, 22 * s);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 8 * s);
      ctx.quadraticCurveTo(-6 * s, 16 * s, -10 * s, 24 * s);
      ctx.stroke();
      // Knot at top
      ctx.fillStyle = '#4a2a0a';
      ctx.beginPath();
      ctx.ellipse(0, -18 * s, 5 * s, 6 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },

    tear: function(ctx, cx, cy, s) {
      // Tear: a teardrop with inner shimmer
      ctx.save();
      ctx.translate(cx, cy);
      // Drop shadow / glow
      var grd = ctx.createRadialGradient(0, 4 * s, 2 * s, 0, 4 * s, 28 * s);
      grd.addColorStop(0, 'rgba(100, 160, 220, 0.3)');
      grd.addColorStop(1, 'rgba(100, 160, 220, 0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(0, 4 * s, 28 * s, 0, Math.PI * 2);
      ctx.fill();
      // Teardrop shape
      ctx.fillStyle = '#b8d8f0';
      ctx.strokeStyle = '#6a9ac0';
      ctx.lineWidth = 1.5 * s;
      ctx.beginPath();
      ctx.moveTo(0, -24 * s);
      ctx.bezierCurveTo(-3 * s, -16 * s, -18 * s, 0, -18 * s, 10 * s);
      ctx.bezierCurveTo(-18 * s, 22 * s, -10 * s, 28 * s, 0, 28 * s);
      ctx.bezierCurveTo(10 * s, 28 * s, 18 * s, 22 * s, 18 * s, 10 * s);
      ctx.bezierCurveTo(18 * s, 0, 3 * s, -16 * s, 0, -24 * s);
      ctx.fill();
      ctx.stroke();
      // Inner highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.beginPath();
      ctx.ellipse(-5 * s, 4 * s, 4 * s, 10 * s, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },

    shard: function(ctx, cx, cy, s) {
      // Shard: a jagged crystal fragment
      ctx.save();
      ctx.translate(cx, cy);
      // Main shard
      ctx.fillStyle = '#8a7aaa';
      ctx.strokeStyle = '#4a3a6a';
      ctx.lineWidth = 1.5 * s;
      ctx.beginPath();
      ctx.moveTo(0, -28 * s);
      ctx.lineTo(8 * s, -12 * s);
      ctx.lineTo(14 * s, -4 * s);
      ctx.lineTo(10 * s, 16 * s);
      ctx.lineTo(4 * s, 26 * s);
      ctx.lineTo(-2 * s, 20 * s);
      ctx.lineTo(-8 * s, 8 * s);
      ctx.lineTo(-12 * s, -6 * s);
      ctx.lineTo(-6 * s, -18 * s);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Facet lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1 * s;
      ctx.beginPath();
      ctx.moveTo(0, -28 * s);
      ctx.lineTo(2 * s, 6 * s);
      ctx.lineTo(4 * s, 26 * s);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-12 * s, -6 * s);
      ctx.lineTo(2 * s, 6 * s);
      ctx.lineTo(14 * s, -4 * s);
      ctx.stroke();
      // Darker facet
      ctx.fillStyle = 'rgba(40, 20, 60, 0.25)';
      ctx.beginPath();
      ctx.moveTo(0, -28 * s);
      ctx.lineTo(-6 * s, -18 * s);
      ctx.lineTo(-12 * s, -6 * s);
      ctx.lineTo(2 * s, 6 * s);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },

    sigil: function(ctx, cx, cy, s) {
      // Sigil: a mystical rune / glyph in a circle
      ctx.save();
      ctx.translate(cx, cy);
      // Outer circle
      ctx.strokeStyle = '#3a3a3a';
      ctx.lineWidth = 1.5 * s;
      ctx.beginPath();
      ctx.arc(0, 0, 26 * s, 0, Math.PI * 2);
      ctx.stroke();
      // Inner rune lines
      ctx.strokeStyle = '#6a2a4a';
      ctx.lineWidth = 2 * s;
      ctx.lineCap = 'round';
      // Vertical line
      ctx.beginPath();
      ctx.moveTo(0, -18 * s);
      ctx.lineTo(0, 18 * s);
      ctx.stroke();
      // Diagonal branches
      ctx.beginPath();
      ctx.moveTo(0, -8 * s);
      ctx.lineTo(12 * s, -16 * s);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -8 * s);
      ctx.lineTo(-12 * s, -16 * s);
      ctx.stroke();
      // Lower arms
      ctx.beginPath();
      ctx.moveTo(0, 6 * s);
      ctx.lineTo(14 * s, 12 * s);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 6 * s);
      ctx.lineTo(-14 * s, 12 * s);
      ctx.stroke();
      // Small diamond at center
      ctx.fillStyle = '#6a2a4a';
      ctx.beginPath();
      ctx.moveTo(0, -4 * s);
      ctx.lineTo(4 * s, 0);
      ctx.lineTo(0, 4 * s);
      ctx.lineTo(-4 * s, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },

    crown: function(ctx, cx, cy, s) {
      // Crown: a royal crown with points
      ctx.save();
      ctx.translate(cx, cy);
      // Crown body
      ctx.fillStyle = '#d4a840';
      ctx.strokeStyle = '#8a6a10';
      ctx.lineWidth = 1.5 * s;
      ctx.beginPath();
      ctx.moveTo(-22 * s, 10 * s);
      ctx.lineTo(-22 * s, -4 * s);
      ctx.lineTo(-14 * s, -16 * s);
      ctx.lineTo(-8 * s, -2 * s);
      ctx.lineTo(0, -22 * s);
      ctx.lineTo(8 * s, -2 * s);
      ctx.lineTo(14 * s, -16 * s);
      ctx.lineTo(22 * s, -4 * s);
      ctx.lineTo(22 * s, 10 * s);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Band at bottom
      ctx.fillStyle = '#c09830';
      ctx.fillRect(-22 * s, 4 * s, 44 * s, 6 * s);
      ctx.strokeRect(-22 * s, 4 * s, 44 * s, 6 * s);
      // Jewels on points
      ctx.fillStyle = '#c44';
      ctx.beginPath();
      ctx.arc(-14 * s, -12 * s, 2.5 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#48c';
      ctx.beginPath();
      ctx.arc(0, -18 * s, 3 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#c44';
      ctx.beginPath();
      ctx.arc(14 * s, -12 * s, 2.5 * s, 0, Math.PI * 2);
      ctx.fill();
      // Band jewels
      ctx.fillStyle = '#fff8dc';
      for (var i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.arc(i * 8 * s, 7 * s, 1.5 * s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    },

    veil: function(ctx, cx, cy, s) {
      // Veil: a flowing, translucent fabric
      ctx.save();
      ctx.translate(cx, cy);
      // Multiple layers of translucent fabric
      for (var layer = 3; layer >= 0; layer--) {
        var offset = layer * 3 * s;
        var alpha = 0.15 + layer * 0.08;
        ctx.fillStyle = 'rgba(180, 180, 210, ' + alpha + ')';
        ctx.strokeStyle = 'rgba(120, 120, 160, ' + (alpha + 0.1) + ')';
        ctx.lineWidth = 0.8 * s;
        ctx.beginPath();
        ctx.moveTo(-16 * s + offset, -24 * s);
        ctx.quadraticCurveTo(-20 * s + offset, -8 * s, -22 * s + offset / 2, 8 * s);
        ctx.quadraticCurveTo(-18 * s, 20 * s, -8 * s, 26 * s);
        ctx.quadraticCurveTo(0, 28 * s, 8 * s, 26 * s);
        ctx.quadraticCurveTo(18 * s, 20 * s, 22 * s - offset / 2, 8 * s);
        ctx.quadraticCurveTo(20 * s - offset, -8 * s, 16 * s - offset, -24 * s);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      // Top rod
      ctx.strokeStyle = '#888';
      ctx.lineWidth = 2 * s;
      ctx.beginPath();
      ctx.moveTo(-18 * s, -24 * s);
      ctx.lineTo(18 * s, -24 * s);
      ctx.stroke();
      // Small circles at rod ends
      ctx.fillStyle = '#999';
      ctx.beginPath();
      ctx.arc(-18 * s, -24 * s, 2 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(18 * s, -24 * s, 2 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
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
        // Draw the artifact SVG
        var scale = Math.min(cellW, cellH) / 140;
        artifactDrawers[artKey](ctx, cx, cy, scale);

        // Name
        ctx.font = "700 18px 'EB Garamond'";
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
        ctx.font = "400 13px 'EB Garamond'";
        ctx.fillStyle = '#999';
        ctx.fillText(ingNames.join(' + '), cx, cellH * row + cellH * 0.79);

        // Description
        var desc = artifactDescriptions[artKey];
        if (desc) {
          ctx.font = "italic 12px 'EB Garamond'";
          ctx.fillStyle = '#bbb';
          wrapText(ctx, desc, cx, cellH * row + cellH * 0.87, cellW - 24, 15);
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
        ctx.font = "700 24px 'EB Garamond'";
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

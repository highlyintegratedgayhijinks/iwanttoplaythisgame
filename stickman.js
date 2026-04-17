// Stickman walking on top of the column bounds
// Animation system from zmcgohan/Stick-Figure-Animation-System (MIT-style)
(function () {

  /* ===== zmcgohan Stick Figure Animation System ===== */

  var SM_AR = 1;

  function StickMan(height, style) {
    this.height = height;
    // Per-instance proportions (allow customization)
    this.ratios = {
      lineWidth:  style.lineWidth  || 0.028,
      headRadius: style.headRadius || 0.07,
      neck:       style.neck       || 0.08,
      torso:      style.torso      || 0.40,
      upperArm:   style.upperArm   || 0.13,
      lowerArm:   style.lowerArm   || 0.12,
      upperLeg:   style.upperLeg   || 0.215,
      lowerLeg:   style.lowerLeg   || 0.235
    };
    this.color = style.color || '#333';

    this.body = {
      torso: {}, neck: {},
      leftUpperArm: {}, leftLowerArm: {},
      rightUpperArm: {}, rightLowerArm: {},
      leftUpperLeg: {}, leftLowerLeg: {},
      rightUpperLeg: {}, rightLowerLeg: {}
    };

    this.bodyAngles = {
      torso: Math.PI / 2, neck: 0,
      leftUpperArm: Math.PI / 1.3,
      leftLowerArm: Math.PI - Math.PI / 1.3,
      rightUpperArm: -Math.PI / 1.3,
      rightLowerArm: -Math.PI + Math.PI / 1.3,
      leftUpperLeg: -Math.PI / 4, leftLowerLeg: Math.PI / 4,
      rightUpperLeg: Math.PI / 4, rightLowerLeg: -Math.PI / 4
    };

    var r = this.ratios;

    this.updateBodyPositions = function () {
      var h = this.height, a = this.bodyAngles;
      this.body.torso.startX =  Math.cos(a.torso) * h * r.torso / 2;
      this.body.torso.startY = -Math.sin(a.torso) * h * r.torso / 2;
      this.body.torso.endX   = -Math.cos(a.torso) * h * r.torso / 2;
      this.body.torso.endY   =  Math.sin(a.torso) * h * r.torso / 2;

      this.body.neck.endX = this.body.torso.startX + Math.cos(a.torso + a.neck) * h * r.neck;
      this.body.neck.endY = this.body.torso.startY - Math.sin(a.torso + a.neck) * h * r.neck;

      this.body.leftUpperArm.endX  = this.body.torso.startX + Math.cos(a.torso + a.leftUpperArm) * h * r.upperArm;
      this.body.leftUpperArm.endY  = this.body.torso.startY - Math.sin(a.torso + a.leftUpperArm) * h * r.upperArm;
      this.body.rightUpperArm.endX = this.body.torso.startX + Math.cos(a.torso + a.rightUpperArm) * h * r.upperArm;
      this.body.rightUpperArm.endY = this.body.torso.startY - Math.sin(a.torso + a.rightUpperArm) * h * r.upperArm;

      this.body.leftLowerArm.endX  = this.body.leftUpperArm.endX  + Math.cos(a.torso + a.leftUpperArm  + a.leftLowerArm)  * h * r.lowerArm;
      this.body.leftLowerArm.endY  = this.body.leftUpperArm.endY  - Math.sin(a.torso + a.leftUpperArm  + a.leftLowerArm)  * h * r.lowerArm;
      this.body.rightLowerArm.endX = this.body.rightUpperArm.endX + Math.cos(a.torso + a.rightUpperArm + a.rightLowerArm) * h * r.lowerArm;
      this.body.rightLowerArm.endY = this.body.rightUpperArm.endY - Math.sin(a.torso + a.rightUpperArm + a.rightLowerArm) * h * r.lowerArm;

      this.body.leftUpperLeg.endX  = this.body.torso.endX - Math.cos(a.torso + a.leftUpperLeg)  * h * r.upperLeg;
      this.body.leftUpperLeg.endY  = this.body.torso.endY + Math.sin(a.torso + a.leftUpperLeg)  * h * r.upperLeg;
      this.body.rightUpperLeg.endX = this.body.torso.endX - Math.cos(a.torso + a.rightUpperLeg) * h * r.upperLeg;
      this.body.rightUpperLeg.endY = this.body.torso.endY + Math.sin(a.torso + a.rightUpperLeg) * h * r.upperLeg;

      this.body.leftLowerLeg.endX  = this.body.leftUpperLeg.endX  - Math.cos(a.torso + a.leftUpperLeg  + a.leftLowerLeg)  * h * r.lowerLeg;
      this.body.leftLowerLeg.endY  = this.body.leftUpperLeg.endY  + Math.sin(a.torso + a.leftUpperLeg  + a.leftLowerLeg)  * h * r.lowerLeg;
      this.body.rightLowerLeg.endX = this.body.rightUpperLeg.endX - Math.cos(a.torso + a.rightUpperLeg + a.rightLowerLeg) * h * r.lowerLeg;
      this.body.rightLowerLeg.endY = this.body.rightUpperLeg.endY + Math.sin(a.torso + a.rightUpperLeg + a.rightLowerLeg) * h * r.lowerLeg;
    };

    this.getMaxY = function () {
      var maxY = this.body.torso.startY;
      for (var key in this.body) {
        if (typeof this.body[key].endY !== 'undefined' && this.body[key].endY > maxY)
          maxY = this.body[key].endY;
      }
      return maxY;
    };

    this.getMinY = function () {
      var minY = this.body.torso.startY;
      for (var key in this.body) {
        if (typeof this.body[key].endY !== 'undefined' && this.body[key].endY < minY)
          minY = this.body[key].endY;
      }
      // Include head circle
      var headY = this.body.neck.endY - this.height * r.headRadius;
      if (headY < minY) minY = headY;
      return minY;
    };

    this.render = function (ctx, pos) {
      var lineWidth = this.height * r.lineWidth * SM_AR;
      var b = this.body, px = pos[0], py = pos[1];

      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.strokeStyle = this.color;
      ctx.fillStyle = this.color;

      ctx.beginPath();
      ctx.moveTo(b.torso.startX + px, b.torso.startY + py);
      ctx.lineTo(b.torso.endX + px, b.torso.endY + py);
      // Left leg
      ctx.lineTo(b.leftUpperLeg.endX + px, b.leftUpperLeg.endY + py);
      ctx.lineTo(b.leftLowerLeg.endX + px, b.leftLowerLeg.endY + py);
      // Right leg
      ctx.moveTo(b.torso.endX + px, b.torso.endY + py);
      ctx.lineTo(b.rightUpperLeg.endX + px, b.rightUpperLeg.endY + py);
      ctx.lineTo(b.rightLowerLeg.endX + px, b.rightLowerLeg.endY + py);
      // Left arm
      ctx.moveTo(b.torso.startX + px, b.torso.startY + py);
      ctx.lineTo(b.leftUpperArm.endX + px, b.leftUpperArm.endY + py);
      ctx.lineTo(b.leftLowerArm.endX + px, b.leftLowerArm.endY + py);
      // Right arm
      ctx.moveTo(b.torso.startX + px, b.torso.startY + py);
      ctx.lineTo(b.rightUpperArm.endX + px, b.rightUpperArm.endY + py);
      ctx.lineTo(b.rightLowerArm.endX + px, b.rightLowerArm.endY + py);
      // Neck
      ctx.moveTo(b.torso.startX + px, b.torso.startY + py);
      ctx.lineTo(b.neck.endX + px, b.neck.endY + py);
      ctx.stroke();

      // Head
      ctx.beginPath();
      ctx.arc(b.neck.endX + px, b.neck.endY + py, this.height * r.headRadius, 0, 2 * Math.PI);
      ctx.fill();
    };

    this.animations = {};
    this.lastAnimationTime = Date.now();

    this.addAnimation = function (anim) {
      for (var key in anim) {
        if (key === 'numRuns') continue;
        this.animations[key] = {
          numRuns: typeof anim.numRuns !== 'undefined' ? anim.numRuns : Infinity,
          sequence: anim[key], sequencePos: 0, elapsedTime: 0,
          lastAngle: this.bodyAngles[key]
        };
      }
    };

    this.animate = function () {
      var elapsedTime = Date.now() - this.lastAnimationTime;
      if (elapsedTime > 500) elapsedTime = 200;
      this.lastAnimationTime = Date.now();
      for (var key in this.animations) {
        var a = this.animations[key];
        a.elapsedTime += elapsedTime;
        if (a.elapsedTime >= a.sequence[a.sequencePos].time) {
          this.bodyAngles[key] = a.lastAngle = a.sequence[a.sequencePos].endAngle;
          if (a.sequencePos === a.sequence.length - 1) {
            if (!(--a.numRuns)) { delete this.animations[key]; continue; }
          }
          a.elapsedTime -= a.sequence[a.sequencePos].time;
          a.sequencePos = a.sequencePos === a.sequence.length - 1 ? 0 : a.sequencePos + 1;
        } else {
          var t = a.elapsedTime / a.sequence[a.sequencePos].time;
          this.bodyAngles[key] = a.lastAngle + (a.sequence[a.sequencePos].endAngle - a.lastAngle) * t;
        }
      }
      this.updateBodyPositions();
    };
  }

  // Walk animation template (parameterized by speed)
  function makeWalk(t) {
    return {
      'neck': [{ time: 0, endAngle: -Math.PI / 24 }],
      'torso': [
        { time: 0, endAngle: Math.PI / 2.3 },
        { time: t * 0.5, endAngle: Math.PI / 2.4 },
        { time: t * 0.5, endAngle: Math.PI / 2.3 }
      ],
      'rightUpperLeg': [
        { time: 0, endAngle: Math.PI / 3.5 },
        { time: t * 0.5, endAngle: Math.PI / 20 },
        { time: t * 0.5, endAngle: -Math.PI / 14 }
      ],
      'rightLowerLeg': [
        { time: 0, endAngle: -Math.PI / 9 },
        { time: t * 0.5, endAngle: -Math.PI / 40 },
        { time: t * 0.5, endAngle: -Math.PI / 10 }
      ],
      'leftUpperLeg': [
        { time: 0, endAngle: -Math.PI / 14 },
        { time: t * 0.5, endAngle: Math.PI / 5 },
        { time: t * 0.5, endAngle: Math.PI / 3.5 }
      ],
      'leftLowerLeg': [
        { time: 0, endAngle: -Math.PI / 10 },
        { time: t * 0.5, endAngle: -Math.PI / 3 },
        { time: t * 0.5, endAngle: -Math.PI / 9 }
      ],
      'leftUpperArm': [
        { time: 0, endAngle: 4 * Math.PI / 5 },
        { time: t, endAngle: 5.5 * Math.PI / 5 }
      ],
      'leftLowerArm': [
        { time: 0, endAngle: Math.PI / 3 },
        { time: t, endAngle: Math.PI / 2.3 }
      ],
      'rightUpperArm': [
        { time: 0, endAngle: -4 * Math.PI / 5 },
        { time: t, endAngle: -5.5 * Math.PI / 5 }
      ],
      'rightLowerArm': [
        { time: 0, endAngle: Math.PI / 2.3 },
        { time: t, endAngle: Math.PI / 3 }
      ]
    };
  }

  // Idle pose: upright torso, arms and legs relaxed
  var IDLE_TRANSITION = 400;
  var idleAnimation = {
    numRuns: 1,
    'neck': [{ time: IDLE_TRANSITION, endAngle: 0 }],
    'torso': [{ time: IDLE_TRANSITION, endAngle: Math.PI / 2 }],
    'leftUpperArm': [{ time: IDLE_TRANSITION, endAngle: 4 * Math.PI / 5 }],
    'leftLowerArm': [{ time: IDLE_TRANSITION, endAngle: 0 }],
    'rightUpperArm': [{ time: IDLE_TRANSITION, endAngle: -4 * Math.PI / 5 }],
    'rightLowerArm': [{ time: IDLE_TRANSITION, endAngle: 0 }],
    'leftUpperLeg': [{ time: IDLE_TRANSITION, endAngle: -Math.PI / 14 }],
    'leftLowerLeg': [{ time: IDLE_TRANSITION, endAngle: 0 }],
    'rightUpperLeg': [{ time: IDLE_TRANSITION, endAngle: Math.PI / 14 }],
    'rightLowerLeg': [{ time: IDLE_TRANSITION, endAngle: 0 }]
  };

  function reverseAnimationX(anim) {
    anim = JSON.parse(JSON.stringify(anim));
    for (var key in anim) {
      switch (key) {
        case 'neck': case 'leftUpperArm': case 'leftLowerArm':
        case 'rightUpperArm': case 'rightLowerArm':
        case 'leftUpperLeg': case 'leftLowerLeg':
        case 'rightUpperLeg': case 'rightLowerLeg':
          for (var i = 0; i < anim[key].length; ++i)
            anim[key][i].endAngle = -anim[key][i].endAngle;
          break;
        case 'torso':
          for (var i = 0; i < anim[key].length; ++i)
            anim[key][i].endAngle = Math.PI - anim[key][i].endAngle;
          break;
      }
    }
    return anim;
  }

  /* ===== 9 humans: 3 minds x 3 souls ===== */
  // Minds: rationalMind, creativeMind, madMind
  // Souls: braveSoul, lovingSoul, darkSoul

  // Behaviour keys:
  //   climbChance: 0-1, how often they climb instead of jump
  //   idleMin/idleMax: seconds between stops
  //   idleDurMin/idleDurMax: how long they stand still
  //   neverIdle: true = never stops (restless types)

  var profiles = [
    // 1. The Commander — Brave + Rational
    // Tall, broad, military posture. Marches at a steady pace. Never climbs (always jumps).
    // Rarely stops, and when he does it's brief — surveying the field.
    { name: 'The Commander',  mind: 'rationalMind', soul: 'braveSoul',
      height: 21, speed: 26, color: '#1a3a5c', headRadius: 0.10, torso: 0.44, upperLeg: 0.22, lowerLeg: 0.24, upperArm: 0.18, lowerArm: 0.17, lineWidth: 0.042, walkTime: 580,
      climbChance: 0, idleMin: 10, idleMax: 18, idleDurMin: 1, idleDurMax: 2, item: 'sword', special: 'salute' },

    // 2. The Hero — Brave + Creative
    // Athletic, well-proportioned. Fast and energetic. Always jumps — never climbs.
    // Stops occasionally to strike a pose.
    { name: 'The Hero',       mind: 'creativeMind', soul: 'braveSoul',
      height: 20, speed: 34, color: '#3a7d44', headRadius: 0.11, torso: 0.40, upperLeg: 0.22, lowerLeg: 0.23, upperArm: 0.18, lowerArm: 0.17, lineWidth: 0.035, walkTime: 440,
      climbChance: 0, idleMin: 6, idleMax: 12, idleDurMin: 1.5, idleDurMax: 3, item: 'shield', special: 'fistPump' },

    // 3. The Berserker — Brave + Mad
    // Compact, stocky, thick. Charges fast. Never stops. Always jumps.
    { name: 'The Berserker',  mind: 'madMind', soul: 'braveSoul',
      height: 18, speed: 42, color: '#8b1a1a', headRadius: 0.12, torso: 0.38, upperLeg: 0.19, lowerLeg: 0.20, upperArm: 0.16, lowerArm: 0.15, lineWidth: 0.045, walkTime: 340,
      climbChance: 0, neverIdle: true, item: 'axe', special: 'rage' },

    // 4. The Healer — Loving + Rational
    // Gentle build, balanced proportions, soft blue. Walks calmly.
    // Stops often and for longer — tending to others.
    { name: 'The Healer',     mind: 'rationalMind', soul: 'lovingSoul',
      height: 20, speed: 20, color: '#2e86c1', headRadius: 0.11, torso: 0.42, upperLeg: 0.22, lowerLeg: 0.24, upperArm: 0.18, lowerArm: 0.17, lineWidth: 0.028, walkTime: 680,
      climbChance: 0.3, idleMin: 4, idleMax: 8, idleDurMin: 2.5, idleDurMax: 5, item: 'staff', special: 'kneel' },

    // 5. The Artist — Loving + Creative
    // Graceful, long arms, thin lines. Purple/violet. Moves expressively.
    // Stops frequently to contemplate. Prefers climbing — takes the scenic route.
    { name: 'The Artist',     mind: 'creativeMind', soul: 'lovingSoul',
      height: 20, speed: 21, color: '#e8709a', headRadius: 0.11, torso: 0.40, upperLeg: 0.22, lowerLeg: 0.24, upperArm: 0.22, lowerArm: 0.21, lineWidth: 0.022, walkTime: 700,
      climbChance: 0.7, idleMin: 4, idleMax: 10, idleDurMin: 3, idleDurMax: 6, item: 'quill', special: 'bow' },

    // 6. The Saint — Loving + Mad
    // Serene, slightly ethereal, teal. Slow wanderer. Stops very often and long.
    // Sometimes climbs — patient and deliberate.
    { name: 'The Saint',      mind: 'madMind', soul: 'lovingSoul',
      height: 19, speed: 16, color: '#5cdbbe', headRadius: 0.12, torso: 0.41, upperLeg: 0.22, lowerLeg: 0.24, upperArm: 0.18, lowerArm: 0.17, lineWidth: 0.024, walkTime: 800,
      climbChance: 0.5, idleMin: 3, idleMax: 7, idleDurMin: 4, idleDurMax: 8, item: 'halo', special: 'pray' },

    // 7. The Tyrant — Dark + Rational
    // Tall, imposing, sharp thin lines. Dark grey. Walks with deliberate authority.
    // Rarely stops — and only briefly. Never climbs (too proud).
    { name: 'The Tyrant',     mind: 'rationalMind', soul: 'darkSoul',
      height: 22, speed: 24, color: '#2c2c2c', headRadius: 0.12, torso: 0.46, upperLeg: 0.24, lowerLeg: 0.26, upperArm: 0.18, lowerArm: 0.17, lineWidth: 0.02, walkTime: 640,
      climbChance: 0, idleMin: 12, idleMax: 20, idleDurMin: 1, idleDurMax: 1.5, item: 'crown', special: 'point' },

    // 8. The Trickster — Dark + Creative
    // Wiry, big head, quick and unpredictable. Muted olive. Changes direction a lot.
    // Stops briefly but often. Loves climbing — sneaky route.
    { name: 'The Trickster',  mind: 'creativeMind', soul: 'darkSoul',
      height: 19, speed: 32, color: '#ff8c00', headRadius: 0.13, torso: 0.38, upperLeg: 0.21, lowerLeg: 0.22, upperArm: 0.19, lowerArm: 0.18, lineWidth: 0.028, walkTime: 460,
      climbChance: 0.8, idleMin: 3, idleMax: 6, idleDurMin: 2.5, idleDurMax: 4, item: 'jesterHat', special: 'juggle', alwaysSpecial: true },

    // 9. The Demon — Dark + Mad
    // Ghostly, faint, thin lines. Very light grey — almost invisible.
    // Erratic speed. Never stops (restless). Always climbs (lurks in the gaps).
    { name: 'The Demon',      mind: 'madMind', soul: 'darkSoul',
      height: 20, speed: 28, color: '#ff1a1a',  headRadius: 0.10, torso: 0.42, upperLeg: 0.23, lowerLeg: 0.25, upperArm: 0.17, lowerArm: 0.16, lineWidth: 0.016, walkTime: 500,
      climbChance: 1.0, neverIdle: true, item: 'horns', special: 'writhe' }
  ];

  var walkers = []; // {man, x, dir, segIdx, walkR, walkL, speed}

  function createWalkerFromProfile(p) {
    var man = new StickMan(p.height, p);
    var walkR = makeWalk(p.walkTime);
    var walkL = reverseAnimationX(walkR);
    var dir = Math.random() < 0.5 ? 1 : -1;
    man.addAnimation(dir === 1 ? walkR : walkL);
    man.updateBodyPositions();
    var idleMin = p.idleMin || 4;
    var idleMax = p.idleMax || 12;
    var nextIdle = p.neverIdle ? Infinity : (idleMin + Math.random() * (idleMax - idleMin));
    walkers.push({
      man: man, name: p.name, x: 0, drawY: 0, dir: dir, segIdx: 0, placed: false,
      hovered: false, profile: p,
      walkR: walkR, walkL: walkL, speed: p.speed,
      jumping: false, jumpT: 0, jumpDur: 0,
      jumpFromX: 0, jumpToX: 0, jumpFromY: 0, jumpToY: 0, jumpHeight: 0,
      climbing: false, climbPhase: 0, climbT: 0, climbNextSeg: 0, climbGapIdx: -1,
      idle: false, idleTimer: 0, idleDur: 0, walkTimer: nextIdle,
      specialActive: false, specialTimer: 5 + Math.random() * 10, flickerT: 0
    });
  }

  function createWalkers() {
    var created = (typeof prestigeState !== 'undefined' && prestigeState && prestigeState.createdHumans) ? prestigeState.createdHumans : [];
    for (var i = 0; i < profiles.length; i++) {
      if (created.indexOf(profiles[i].name) === -1) continue;
      // Skip if already walking
      var alreadyExists = false;
      for (var j = 0; j < walkers.length; j++) {
        if (walkers[j].name === profiles[i].name) { alreadyExists = true; break; }
      }
      if (!alreadyExists) createWalkerFromProfile(profiles[i]);
    }
  }

  /* ===== Canvas & segments ===== */

  var canvas, ctx, dpr, tooltip;
  var segments = [];
  var initialized = false;
  var mouseX = -1, mouseY = -1;
  var hoveredIdx = -1;

  function init() {
    if (initialized) return;

    canvas = document.createElement('canvas');
    canvas.id = 'stickmanCanvas';
    canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100vw;height:100vh;' +
      'pointer-events:none;z-index:9999;';
    document.body.appendChild(canvas);

    // Tooltip element
    tooltip = document.createElement('div');
    tooltip.id = 'stickmanTooltip';
    tooltip.style.cssText =
      'position:fixed;padding:3px 7px;background:#FAFBFA;border:1px solid #333;' +
      'border-radius:2px;font-family:"EB Garamond";font-size:12px;color:#333;' +
      'pointer-events:none;z-index:10000;display:none;white-space:nowrap;';
    document.body.appendChild(tooltip);

    initialized = true;

    dpr = window.devicePixelRatio || 1;
    SM_AR = dpr;

    createWalkers();
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);

    requestAnimationFrame(loop);
  }

  function resize() {
    if (!canvas) return;
    var w = window.innerWidth, h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildSegments();
  }

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Hit-test against all walkers
    var hitRadius = 15;
    var found = -1;
    for (var i = 0; i < walkers.length; i++) {
      var wk = walkers[i];
      if (!wk.placed) continue;
      var dx = mouseX - wk.x;
      var dy = mouseY - wk.drawY;
      if (Math.abs(dx) < hitRadius && Math.abs(dy) < wk.man.height * 0.5 + hitRadius) {
        found = i;
        break;
      }
    }

    if (found !== hoveredIdx) {
      // Un-hover previous
      if (hoveredIdx >= 0 && hoveredIdx < walkers.length) {
        var prev = walkers[hoveredIdx];
        prev.hovered = false;
        // Restore animation based on current state
        if (prev.climbing) {
          // Re-enter climb anim — recalculate arm angle
          var gSeg = segments[prev.climbGapIdx];
          var gNext = segments[prev.climbGapIdx + 1];
          if (gSeg && gNext) {
            var gapW = gNext.x1 - gSeg.x2;
            var armReach = prev.man.height * (prev.man.ratios.upperArm + prev.man.ratios.lowerArm);
            var ratio = Math.min((gapW / 2) / Math.max(armReach, 1), 0.95);
            prev.man.addAnimation(makeClimbAnim(Math.asin(ratio)));
          }
        } else if (prev.idle) {
          // Stay idle, animation will resume via timer
        } else {
          prev.man.addAnimation(prev.dir === 1 ? prev.walkR : prev.walkL);
        }
      }
      hoveredIdx = found;
      // Hover new
      if (hoveredIdx >= 0) {
        var wk = walkers[hoveredIdx];
        wk.hovered = true;
        // If climbing, freeze in place (don't change pose)
        // Otherwise, transition to idle front-facing pose
        if (!wk.climbing) {
          wk.man.addAnimation(idleAnimation);
        }
      }
    }

    // Update cursor and tooltip
    if (hoveredIdx >= 0) {
      document.body.style.cursor = 'pointer';
      tooltip.textContent = walkers[hoveredIdx].name;
      tooltip.style.display = 'block';
    } else {
      document.body.style.cursor = '';
      tooltip.style.display = 'none';
    }
  }

  function buildSegments() {
    var wrapper = document.getElementById('wrapper');
    if (!wrapper) return;

    // If wrapper is hidden (settings/tree page), keep last known segments
    if (window.getComputedStyle(wrapper).display === 'none') return;

    var newSegs = [];

    // On mobile, walk above the column tabs
    var tabStrip = document.querySelector('.mobile-column-tabs');
    if (tabStrip && window.innerWidth <= 768) {
      var br = tabStrip.getBoundingClientRect();
      if (br.width > 0) {
        newSegs.push({ x1: br.left, x2: br.right, groundY: br.top, bottomY: br.top });
      }
    } else {
      var boxes = wrapper.querySelectorAll('.box.main');
      for (var i = 0; i < boxes.length; i++) {
        if (window.getComputedStyle(boxes[i]).display === 'none') continue;
        var br = boxes[i].getBoundingClientRect();
        newSegs.push({ x1: br.left, x2: br.right, groundY: br.top, bottomY: br.bottom });
      }
    }
    if (newSegs.length === 0) return; // keep old segments
    segments = newSegs;
    segments.sort(function (a, b) { return a.x1 - b.x1; });

    // Place walkers spread out across all segments
    if (segments.length > 0) {
      var totalW = 0;
      for (var i = 0; i < segments.length; i++) totalW += segments[i].x2 - segments[i].x1;

      for (var i = 0; i < walkers.length; i++) {
        if (walkers[i].placed) continue;
        // Spread evenly across total walkable width
        var targetOffset = (totalW / (walkers.length + 1)) * (i + 1);
        var accum = 0;
        for (var s = 0; s < segments.length; s++) {
          var segW = segments[s].x2 - segments[s].x1;
          if (accum + segW >= targetOffset) {
            walkers[i].segIdx = s;
            walkers[i].x = segments[s].x1 + (targetOffset - accum);
            break;
          }
          accum += segW;
        }
        walkers[i].placed = true;
      }
    }
  }

  var lastTime = 0;
  var rebuildTimer = 0;

  function loop(now) {
    requestAnimationFrame(loop);
    if (!ctx) return;

    var dt = lastTime ? (now - lastTime) / 1000 : 0.016;
    if (dt > 0.1) dt = 0.1;
    lastTime = now;

    rebuildTimer += dt;
    if (rebuildTimer > 0.5) {
      rebuildTimer = 0;
      buildSegments();
    }

    if (segments.length === 0) return;

    var w = window.innerWidth, h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < walkers.length; i++) {
      updateWalker(walkers[i], dt);
      drawWalker(walkers[i]);
    }
  }

  function startJump(wk, fromX, fromY, toX, toY, nextSegIdx) {
    var gapDist = Math.abs(toX - fromX);
    wk.jumping = true;
    wk.jumpT = 0;
    wk.jumpDur = gapDist / (wk.speed * 1.2);
    wk.jumpFromX = fromX;
    wk.jumpToX = toX;
    wk.jumpFromY = fromY;
    wk.jumpToY = toY;
    wk.jumpHeight = Math.max(15, gapDist * 0.4);
    wk.jumpNextSeg = nextSegIdx;
  }

  // Build a climbing animation where arms reach out to touch the gap walls
  // armAngle: how far the arms spread outward (depends on gap width vs arm length)
  function makeClimbAnim(armAngle) {
    var CLIMB_STEP = 350;
    // Arms spread to walls, alternating up/down reach
    var armHi = armAngle * 0.7;  // arm reaching up
    var armLo = armAngle * 1.1;  // arm pressing down
    return {
      'torso': [{ time: 0, endAngle: Math.PI / 2 }],
      'neck': [{ time: 0, endAngle: 0 }],
      'leftUpperArm': [
        { time: 0, endAngle: armHi },
        { time: CLIMB_STEP, endAngle: armLo },
        { time: CLIMB_STEP, endAngle: armHi }
      ],
      'leftLowerArm': [
        { time: 0, endAngle: 0 },
        { time: CLIMB_STEP, endAngle: Math.PI / 8 },
        { time: CLIMB_STEP, endAngle: 0 }
      ],
      'rightUpperArm': [
        { time: 0, endAngle: -armLo },
        { time: CLIMB_STEP, endAngle: -armHi },
        { time: CLIMB_STEP, endAngle: -armLo }
      ],
      'rightLowerArm': [
        { time: 0, endAngle: Math.PI / 8 },
        { time: CLIMB_STEP, endAngle: 0 },
        { time: CLIMB_STEP, endAngle: Math.PI / 8 }
      ],
      'leftUpperLeg': [
        { time: 0, endAngle: 0 },
        { time: CLIMB_STEP * 2, endAngle: Math.PI / 20 },
        { time: CLIMB_STEP * 2, endAngle: 0 }
      ],
      'leftLowerLeg': [
        { time: 0, endAngle: 0 },
        { time: CLIMB_STEP * 2, endAngle: -Math.PI / 16 },
        { time: CLIMB_STEP * 2, endAngle: 0 }
      ],
      'rightUpperLeg': [
        { time: 0, endAngle: Math.PI / 20 },
        { time: CLIMB_STEP * 2, endAngle: 0 },
        { time: CLIMB_STEP * 2, endAngle: Math.PI / 20 }
      ],
      'rightLowerLeg': [
        { time: 0, endAngle: -Math.PI / 16 },
        { time: CLIMB_STEP * 2, endAngle: 0 },
        { time: CLIMB_STEP * 2, endAngle: -Math.PI / 16 }
      ]
    };
  }

  // Check if any walker is currently climbing in a given gap
  function isGapOccupied(gapIdx) {
    // gapIdx = index of the gap between segments[gapIdx] and segments[gapIdx+1]
    for (var i = 0; i < walkers.length; i++) {
      var wk = walkers[i];
      if (!wk.climbing) continue;
      if (wk.climbGapIdx === gapIdx) return true;
    }
    return false;
  }

  function startClimb(wk, fromSegIdx, toSegIdx) {
    var fromSeg = segments[fromSegIdx];
    var toSeg = segments[toSegIdx];
    var goingRight = toSegIdx > fromSegIdx;

    // Gap edges: inner edges of the two columns
    var leftEdge = goingRight ? fromSeg.x2 : toSeg.x2;
    var rightEdge = goingRight ? toSeg.x1 : fromSeg.x1;
    var gapW = rightEdge - leftEdge;

    wk.climbing = true;
    wk.climbPhase = 0; // 0=descend, 1=ascend
    wk.climbT = 0;
    wk.climbNextSeg = toSegIdx;
    wk.climbGapIdx = Math.min(fromSegIdx, toSegIdx);

    // Center of the gap
    wk.climbCenterX = (leftEdge + rightEdge) / 2;

    // Y bounds
    wk.climbTopY = Math.max(fromSeg.groundY, toSeg.groundY);
    var climbH = Math.min(fromSeg.bottomY, toSeg.bottomY) - wk.climbTopY;
    wk.climbBotY = wk.climbTopY + climbH;

    var climbSpeed = wk.speed * 0.7;
    wk.climbDescDur = climbH / climbSpeed;
    wk.climbAscDur = climbH / climbSpeed;

    wk.x = wk.climbCenterX;

    // Calculate arm angle to reach the walls
    // Total arm reach = height * (upperArm + lowerArm)
    var armReach = wk.man.height * (wk.man.ratios.upperArm + wk.man.ratios.lowerArm);
    var halfGap = gapW / 2;
    // armAngle from vertical: asin(halfGap / armReach), clamped
    var ratio = Math.min(halfGap / Math.max(armReach, 1), 0.95);
    var armAngle = Math.asin(ratio);

    wk.man.addAnimation(makeClimbAnim(armAngle));
  }

  function updateWalker(wk, dt) {
    if (segments.length === 0 || !wk.placed) return;
    if (wk.segIdx >= segments.length) wk.segIdx = segments.length - 1;

    // Hovered: if climbing, freeze completely; otherwise let idle animation play
    if (wk.hovered) {
      if (wk.climbing) return; // freeze mid-climb
      wk.man.animate(); // let idle transition animate
      return;
    }

    wk.man.animate();

    // Idle: standing still
    if (wk.idle) {
      wk.idleTimer += dt;
      if (wk.idleTimer >= wk.idleDur) {
        // Resume walking
        wk.idle = false;
        wk.specialActive = false;
        wk.man.addAnimation(wk.dir === 1 ? wk.walkR : wk.walkL);
        var im = wk.profile.idleMin || 4, ix = wk.profile.idleMax || 12;
        wk.walkTimer = wk.profile.neverIdle ? Infinity : (im + Math.random() * (ix - im));
      }
      return;
    }

    // Climbing: descend in gap center, then ascend
    if (wk.climbing) {
      wk.climbT += dt;
      wk.x = wk.climbCenterX;
      if (wk.climbPhase === 0) {
        if (wk.climbT >= wk.climbDescDur) {
          wk.climbPhase = 1;
          wk.climbT = 0;
        }
      } else {
        if (wk.climbT >= wk.climbAscDur) {
          wk.climbing = false;
          wk.climbGapIdx = -1;
          wk.segIdx = wk.climbNextSeg;
          var nextSeg = segments[wk.climbNextSeg];
          wk.x = wk.dir === 1 ? nextSeg.x1 + 10 : nextSeg.x2 - 10;
          wk.man.addAnimation(wk.dir === 1 ? wk.walkR : wk.walkL);
        }
      }
      return;
    }

    // For neverIdle types (Berserker, Demon): trigger special in bursts while walking
    if (wk.profile.neverIdle && wk.profile.special) {
      wk.specialTimer -= dt;
      if (wk.specialTimer <= 0) {
        wk.specialActive = true;
        wk.specialTimer = 6 + Math.random() * 10;
        setTimeout(function () { wk.specialActive = false; }, 1500);
      }
    }

    // Count down to next idle stop
    wk.walkTimer -= dt;
    if (wk.walkTimer <= 0 && !wk.jumping) {
      wk.idle = true;
      wk.idleTimer = 0;
      var dm = wk.profile.idleDurMin || 1.5, dx = wk.profile.idleDurMax || 4;
      wk.idleDur = dm + Math.random() * (dx - dm);
      // Play special animation during idle
      var sp = wk.profile.special;
      if (sp && specialAnims[sp] && (wk.profile.alwaysSpecial || Math.random() < 0.5)) {
        wk.specialActive = true;
        wk.man.addAnimation(specialAnims[sp]);
      } else {
        wk.man.addAnimation(idleAnimation);
      }
      return;
    }

    // Mid-jump: follow the arc
    if (wk.jumping) {
      wk.jumpT += dt;
      var t = Math.min(wk.jumpT / wk.jumpDur, 1);
      wk.x = wk.jumpFromX + (wk.jumpToX - wk.jumpFromX) * t;
      wk.jumpArcY = -4 * wk.jumpHeight * t * (t - 1);
      if (t >= 1) {
        wk.jumping = false;
        wk.segIdx = wk.jumpNextSeg;
        wk.x = wk.jumpToX;
      }
      return;
    }

    var seg = segments[wk.segIdx];
    wk.x += wk.dir * wk.speed * dt;

    // Reached right edge
    if (wk.dir === 1 && wk.x >= seg.x2 - 5) {
      if (wk.segIdx < segments.length - 1) {
        var next = segments[wk.segIdx + 1];
        var gapIdx = wk.segIdx;
        if (Math.random() < (wk.profile.climbChance || 0) && !isGapOccupied(gapIdx)) {
          startClimb(wk, wk.segIdx, wk.segIdx + 1);
        } else {
          startJump(wk, seg.x2 - 5, seg.groundY, next.x1 + 5, next.groundY, wk.segIdx + 1);
        }
      } else {
        wk.x = seg.x2 - 5;
        wk.dir = -1;
        wk.man.addAnimation(wk.walkL);
      }
    // Reached left edge
    } else if (wk.dir === -1 && wk.x <= seg.x1 + 5) {
      if (wk.segIdx > 0) {
        var prev = segments[wk.segIdx - 1];
        var gapIdx = wk.segIdx - 1;
        if (Math.random() < (wk.profile.climbChance || 0) && !isGapOccupied(gapIdx)) {
          startClimb(wk, wk.segIdx, wk.segIdx - 1);
        } else {
          startJump(wk, seg.x1 + 5, seg.groundY, prev.x2 - 5, prev.groundY, wk.segIdx - 1);
        }
      } else {
        wk.x = seg.x1 + 5;
        wk.dir = 1;
        wk.man.addAnimation(wk.walkR);
      }
    }
  }

  // ===== Juggle balls drawn above stickman =====
  function drawJuggle(ctx, profile, man, specialActive, px, py) {
    if (profile.special !== 'juggle' || !specialActive) return;
    var now = Date.now() * 0.008;
    ctx.fillStyle = man.color;
    for (var j = 0; j < 3; j++) {
      var phase = now + j * Math.PI * 2 / 3;
      var jx = px + Math.sin(phase) * 10;
      var jy = py + man.getMinY() - 10 + Math.cos(phase) * 6;
      ctx.beginPath();
      ctx.arc(jx, jy, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ===== Items drawn on each stickman =====
  function drawItem(ctx, wk, px, py) {
    var man = wk.man, b = man.body, h = man.height;
    var hr = man.ratios.headRadius;
    var headX = b.neck.endX + px, headY = b.neck.endY + py;
    var headR = h * hr;
    // Right hand position
    var rHandX = b.rightLowerArm.endX + px, rHandY = b.rightLowerArm.endY + py;
    // Left hand position
    var lHandX = b.leftLowerArm.endX + px, lHandY = b.leftLowerArm.endY + py;
    var color = man.color;
    var lw = h * man.ratios.lineWidth * SM_AR;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineCap = 'round';
    ctx.lineWidth = lw * 0.7;

    switch (wk.profile.item) {
      case 'sword':
        // Diagonal line from right hand
        var sLen = h * 0.35;
        ctx.beginPath();
        ctx.moveTo(rHandX, rHandY);
        ctx.lineTo(rHandX + wk.dir * sLen * 0.5, rHandY - sLen);
        ctx.stroke();
        // Small crossguard
        var gx = rHandX + wk.dir * sLen * 0.1, gy = rHandY - sLen * 0.25;
        ctx.beginPath();
        ctx.moveTo(gx - 2, gy);
        ctx.lineTo(gx + 2, gy);
        ctx.stroke();
        break;

      case 'shield':
        // Empty circle at left hand
        var shR = h * 0.24;
        ctx.beginPath();
        ctx.arc(lHandX, lHandY, shR, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case 'axe':
        // Line + angled head from right hand
        var aLen = h * 0.25;
        var tipX = rHandX + wk.dir * aLen * 0.3, tipY = rHandY - aLen;
        ctx.beginPath();
        ctx.moveTo(rHandX, rHandY);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();
        // Axe head
        ctx.beginPath();
        ctx.moveTo(tipX - wk.dir * 3, tipY - 2);
        ctx.lineTo(tipX + wk.dir * 1, tipY);
        ctx.lineTo(tipX - wk.dir * 3, tipY + 2);
        ctx.stroke();
        break;

      case 'staff':
        // Fixed-length staff held from the middle, perpendicular to lower arm
        var stHalf = h * 0.4;
        // Direction along lower arm (elbow to hand)
        var elbX = b.rightUpperArm.endX + px, elbY = b.rightUpperArm.endY + py;
        var adx = rHandX - elbX, ady = rHandY - elbY;
        var ad = Math.sqrt(adx * adx + ady * ady) || 1;
        // Rotate 180 degrees from 90-right: (dx, dy) -> (-dy, dx)
        var anx = -ady / ad, any = adx / ad;
        ctx.beginPath();
        ctx.moveTo(rHandX - anx * stHalf, rHandY - any * stHalf);
        ctx.lineTo(rHandX + anx * stHalf, rHandY + any * stHalf);
        ctx.stroke();
        // Small orb on top end
        ctx.beginPath();
        ctx.arc(rHandX - anx * (stHalf + 1.5), rHandY - any * (stHalf + 1.5), 1.5, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case 'quill':
        // Thin diagonal from right hand with slight curve
        var qLen = h * 0.2;
        ctx.lineWidth = lw * 0.5;
        ctx.beginPath();
        ctx.moveTo(rHandX, rHandY);
        ctx.quadraticCurveTo(rHandX + wk.dir * qLen * 0.6, rHandY - qLen * 0.8,
                             rHandX + wk.dir * qLen * 0.3, rHandY - qLen);
        ctx.stroke();
        ctx.lineWidth = lw * 0.7;
        break;

      case 'halo':
        // Horizontal oval floating above head
        ctx.lineWidth = lw * 0.5;
        ctx.beginPath();
        ctx.ellipse(headX, headY - headR - headR * 0.7, headR * 0.9, headR * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.lineWidth = lw * 0.7;
        break;

      case 'crown':
        // Crown with vertical sides and zigzag points
        var cw = headR * 0.8, ch = headR * 0.4;
        var cy = headY - headR - 4;
        var baseY = headY - headR * 0.3 - 1;
        ctx.beginPath();
        // Left vertical (into head)
        ctx.moveTo(headX - cw, baseY);
        ctx.lineTo(headX - cw, cy - ch);
        // Inner zigzag (tighter central peak)
        ctx.lineTo(headX - cw * 0.35, baseY);
        ctx.lineTo(headX, cy - ch);
        ctx.lineTo(headX + cw * 0.35, baseY);
        // Right vertical (into head)
        ctx.lineTo(headX + cw, cy - ch);
        ctx.lineTo(headX + cw, baseY);
        ctx.stroke();
        break;

      case 'jesterHat':
        // Three-pronged floppy cap with circles at tips
        var jw = headR * 1.3, jh = headR * 1.2;
        var jy = headY - headR;
        ctx.lineWidth = lw * 0.5;
        // Left prong
        ctx.beginPath();
        ctx.moveTo(headX - headR * 0.3, jy);
        ctx.quadraticCurveTo(headX - jw * 1.2, jy - jh * 0.5, headX - jw, jy - jh);
        ctx.stroke();
        ctx.beginPath(); ctx.arc(headX - jw, jy - jh, 1.2, 0, Math.PI * 2); ctx.fill();
        // Middle prong
        ctx.beginPath();
        ctx.moveTo(headX, jy - headR * 0.2);
        ctx.quadraticCurveTo(headX, jy - jh * 1.2, headX + headR * 0.2, jy - jh * 1.4);
        ctx.stroke();
        ctx.beginPath(); ctx.arc(headX + headR * 0.2, jy - jh * 1.4, 1.2, 0, Math.PI * 2); ctx.fill();
        // Right prong
        ctx.beginPath();
        ctx.moveTo(headX + headR * 0.3, jy);
        ctx.quadraticCurveTo(headX + jw * 1.2, jy - jh * 0.5, headX + jw, jy - jh);
        ctx.stroke();
        ctx.beginPath(); ctx.arc(headX + jw, jy - jh, 1.2, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = lw * 0.7;
        break;

      case 'horns':
        // Two narrow filled triangles
        var hLen = headR * 0.9;
        var hw = headR * 0.22;
        // Left horn
        ctx.beginPath();
        ctx.moveTo(headX - headR * 0.5 - hw, headY - headR * 0.7);
        ctx.lineTo(headX - headR * 0.7, headY - headR - hLen);
        ctx.lineTo(headX - headR * 0.5 + hw, headY - headR * 0.7);
        ctx.closePath();
        ctx.fill();
        // Right horn
        ctx.beginPath();
        ctx.moveTo(headX + headR * 0.5 - hw, headY - headR * 0.7);
        ctx.lineTo(headX + headR * 0.7, headY - headR - hLen);
        ctx.lineTo(headX + headR * 0.5 + hw, headY - headR * 0.7);
        ctx.closePath();
        ctx.fill();
        break;
    }
  }

  // ===== Special animations =====
  var T = 400; // base transition time

  var specialAnims = {
    // Commander: arm raises to forehead
    salute: {
      numRuns: 1,
      'torso': [{ time: T * 0.5, endAngle: Math.PI / 2 }],
      'rightUpperArm': [
        { time: T, endAngle: -Math.PI / 3 },
        { time: T * 2, endAngle: -Math.PI / 3 },
        { time: T, endAngle: -4 * Math.PI / 5 }
      ],
      'rightLowerArm': [
        { time: T, endAngle: Math.PI / 2 },
        { time: T * 2, endAngle: Math.PI / 2 },
        { time: T, endAngle: 0 }
      ],
      'leftUpperLeg': [{ time: T * 0.5, endAngle: -Math.PI / 14 }],
      'rightUpperLeg': [{ time: T * 0.5, endAngle: Math.PI / 14 }],
      'leftLowerLeg': [{ time: T * 0.5, endAngle: 0 }],
      'rightLowerLeg': [{ time: T * 0.5, endAngle: 0 }]
    },
    // Hero: shield parry — left arm swings across to block
    fistPump: {
      numRuns: 2,
      'torso': [{ time: T * 0.3, endAngle: Math.PI / 2 }],
      'leftUpperArm': [
        { time: T * 0.4, endAngle: Math.PI / 3 },
        { time: T * 0.4, endAngle: Math.PI / 1.8 },
        { time: T * 0.4, endAngle: 4 * Math.PI / 5 }
      ],
      'leftLowerArm': [
        { time: T * 0.4, endAngle: Math.PI / 4 },
        { time: T * 0.4, endAngle: Math.PI / 6 },
        { time: T * 0.4, endAngle: 0 }
      ],
      'leftUpperLeg': [{ time: T * 0.3, endAngle: -Math.PI / 14 }],
      'rightUpperLeg': [{ time: T * 0.3, endAngle: Math.PI / 14 }],
      'leftLowerLeg': [{ time: T * 0.3, endAngle: 0 }],
      'rightLowerLeg': [{ time: T * 0.3, endAngle: -Math.PI / 4 }, { time: T * 0.5, endAngle: 0 }]
    },
    // Berserker: rapid body shake (handled in draw, not keyframes)
    rage: null,
    // Healer: healing — upright, feet planted, both arms raised high with staff
    kneel: {
      numRuns: 1,
      'torso': [
        { time: T, endAngle: Math.PI / 2 },
        { time: T * 3, endAngle: Math.PI / 2 },
        { time: T, endAngle: Math.PI / 2 }
      ],
      'leftUpperLeg': [
        { time: T * 0.5, endAngle: -Math.PI / 14 }
      ],
      'leftLowerLeg': [
        { time: T * 0.5, endAngle: 0 }
      ],
      'rightUpperLeg': [
        { time: T * 0.5, endAngle: Math.PI / 14 }
      ],
      'rightLowerLeg': [
        { time: T * 0.5, endAngle: 0 }
      ],
      'leftUpperArm': [
        { time: T, endAngle: Math.PI / 5 },
        { time: T * 1.5, endAngle: Math.PI / 4 },
        { time: T * 1.5, endAngle: Math.PI / 5 },
        { time: T, endAngle: 4 * Math.PI / 5 }
      ],
      'leftLowerArm': [
        { time: T, endAngle: 0 },
        { time: T * 3, endAngle: 0 },
        { time: T, endAngle: 0 }
      ],
      'rightUpperArm': [
        { time: T, endAngle: -Math.PI / 5 },
        { time: T * 1.5, endAngle: -Math.PI / 4 },
        { time: T * 1.5, endAngle: -Math.PI / 5 },
        { time: T, endAngle: -4 * Math.PI / 5 }
      ],
      'rightLowerArm': [
        { time: T, endAngle: 0 },
        { time: T * 3, endAngle: 0 },
        { time: T, endAngle: 0 }
      ]
    },
    // Artist: painting — arm sweeps back and forth like brushstrokes
    bow: {
      numRuns: 3,
      'rightUpperArm': [
        { time: T * 1.2, endAngle: -Math.PI / 3 },
        { time: T * 1.2, endAngle: -Math.PI / 1.8 }
      ],
      'rightLowerArm': [
        { time: T * 1.2, endAngle: Math.PI / 6 },
        { time: T * 1.2, endAngle: -Math.PI / 6 }
      ]
    },
    // Saint: hands together, head bows
    pray: {
      numRuns: 1,
      'torso': [{ time: T * 0.5, endAngle: Math.PI / 2 }],
      'neck': [
        { time: T, endAngle: -Math.PI / 5 },
        { time: T * 3, endAngle: -Math.PI / 5 },
        { time: T, endAngle: 0 }
      ],
      'leftUpperArm': [
        { time: T, endAngle: Math.PI / 3 },
        { time: T * 3, endAngle: Math.PI / 3 },
        { time: T, endAngle: 4 * Math.PI / 5 }
      ],
      'leftLowerArm': [
        { time: T, endAngle: Math.PI / 3 },
        { time: T * 3, endAngle: Math.PI / 3 },
        { time: T, endAngle: 0 }
      ],
      'rightUpperArm': [
        { time: T, endAngle: -Math.PI / 3 },
        { time: T * 3, endAngle: -Math.PI / 3 },
        { time: T, endAngle: -4 * Math.PI / 5 }
      ],
      'rightLowerArm': [
        { time: T, endAngle: Math.PI / 3 },
        { time: T * 3, endAngle: Math.PI / 3 },
        { time: T, endAngle: 0 }
      ]
    },
    // Tyrant: one arm extends straight forward
    point: {
      numRuns: 1,
      'torso': [{ time: T * 0.3, endAngle: Math.PI / 2 }],
      'rightUpperArm': [
        { time: T, endAngle: -Math.PI / 2.2 },
        { time: T * 2, endAngle: -Math.PI / 2.2 },
        { time: T, endAngle: -4 * Math.PI / 5 }
      ],
      'rightLowerArm': [
        { time: T, endAngle: 0 },
        { time: T * 2, endAngle: 0 },
        { time: T, endAngle: 0 }
      ]
    },
    // Trickster: hands alternate up/down (juggle dots drawn separately)
    juggle: {
      numRuns: 3,
      'leftUpperArm': [
        { time: 0, endAngle: Math.PI / 4 },
        { time: T * 0.6, endAngle: Math.PI / 2.5 },
        { time: T * 0.6, endAngle: Math.PI / 4 }
      ],
      'rightUpperArm': [
        { time: 0, endAngle: -Math.PI / 2.5 },
        { time: T * 0.6, endAngle: -Math.PI / 4 },
        { time: T * 0.6, endAngle: -Math.PI / 2.5 }
      ],
      'leftLowerArm': [
        { time: 0, endAngle: Math.PI / 4 },
        { time: T * 0.6, endAngle: 0 },
        { time: T * 0.6, endAngle: Math.PI / 4 }
      ],
      'rightLowerArm': [
        { time: 0, endAngle: 0 },
        { time: T * 0.6, endAngle: Math.PI / 4 },
        { time: T * 0.6, endAngle: 0 }
      ]
    },
    // Demon: writhe — torso twists, limbs contort
    writhe: {
      numRuns: 2,
      'torso': [
        { time: T * 1.2, endAngle: Math.PI / 2.6 },
        { time: T * 1.2, endAngle: Math.PI / 1.7 },
        { time: T * 1.2, endAngle: Math.PI / 2 }
      ],
      'neck': [
        { time: T * 0.8, endAngle: Math.PI / 5 },
        { time: T * 0.8, endAngle: -Math.PI / 4 },
        { time: T * 0.8, endAngle: 0 }
      ],
      'leftUpperArm': [
        { time: T, endAngle: Math.PI / 2 },
        { time: T, endAngle: Math.PI / 1.3 },
        { time: T, endAngle: 4 * Math.PI / 5 }
      ],
      'leftLowerArm': [
        { time: T, endAngle: -Math.PI / 3 },
        { time: T, endAngle: Math.PI / 2 },
        { time: T, endAngle: 0 }
      ],
      'rightUpperArm': [
        { time: T, endAngle: -Math.PI / 1.3 },
        { time: T, endAngle: -Math.PI / 2 },
        { time: T, endAngle: -4 * Math.PI / 5 }
      ],
      'rightLowerArm': [
        { time: T, endAngle: Math.PI / 2 },
        { time: T, endAngle: -Math.PI / 3 },
        { time: T, endAngle: 0 }
      ]
    }
  };

  function drawWalker(wk) {
    if (segments.length === 0 || !wk.placed) return;

    var posY;
    if (wk.jumping) {
      var t = Math.min(wk.jumpT / wk.jumpDur, 1);
      var groundY = wk.jumpFromY + (wk.jumpToY - wk.jumpFromY) * t;
      posY = groundY - wk.jumpArcY - wk.man.getMaxY();
    } else if (wk.climbing) {
      var groundY;
      if (wk.climbPhase === 0) {
        var t = Math.min(wk.climbT / wk.climbDescDur, 1);
        groundY = wk.climbTopY + (wk.climbBotY - wk.climbTopY) * t;
      } else {
        var t = Math.min(wk.climbT / wk.climbAscDur, 1);
        groundY = wk.climbBotY + (wk.climbTopY - wk.climbBotY) * t;
      }
      posY = groundY - wk.man.getMaxY();
    } else {
      var seg = segments[wk.segIdx];
      posY = seg.groundY - wk.man.getMaxY();
    }

    wk.drawY = posY;

    var drawX = wk.x;

    // Berserker rage: shake position
    if (wk.profile.special === 'rage' && wk.specialActive) {
      drawX += (Math.random() - 0.5) * 4;
      posY += (Math.random() - 0.5) * 2;
    }

    wk.man.render(ctx, [drawX, posY]);

    // Draw item
    drawItem(ctx, wk, drawX, posY);

    drawJuggle(ctx, wk.profile, wk.man, wk.specialActive, drawX, posY);

    // Position tooltip above the walker, clear of the body
    if (wk.hovered && tooltip) {
      var headTopY = posY + wk.man.getMinY();
      var tipH = tooltip.offsetHeight || 20;
      tooltip.style.left = (drawX - tooltip.offsetWidth / 2) + 'px';
      tooltip.style.top = (headTopY - tipH - 6) + 'px';
    }
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  var obs = new MutationObserver(function () {
    if (!initialized) init();
    buildSegments();
  });
  obs.observe(document.body, {
    childList: true, subtree: true,
    attributes: true, attributeFilter: ['style']
  });

  // Expose for humans page
  window._stickman = {
    StickMan: StickMan, profiles: profiles, specialAnims: specialAnims,
    makeWalk: makeWalk, reverseAnimationX: reverseAnimationX,
    idleAnimation: idleAnimation, drawItem: drawItem, drawJuggle: drawJuggle, SM_AR: function() { return SM_AR; },
    spawnWalker: function(name) {
      for (var i = 0; i < profiles.length; i++) {
        if (profiles[i].name === name) {
          // Don't spawn if already walking
          for (var j = 0; j < walkers.length; j++) {
            if (walkers[j].name === name) return;
          }
          createWalkerFromProfile(profiles[i]);
          return;
        }
      }
    },
    refreshWalkers: function() {
      createWalkers();
      console.log('[stickman] refreshWalkers: walkers=' + walkers.length + ', segments=' + segments.length + ', placed=' + walkers.map(function(w){return w.placed}).join(','));
      // Force segment rebuild and placement
      buildSegments();
      console.log('[stickman] after buildSegments: segments=' + segments.length + ', placed=' + walkers.map(function(w){return w.placed}).join(','));
    }
  };
})();

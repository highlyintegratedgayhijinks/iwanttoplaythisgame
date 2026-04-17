// Text crumble-to-dust effect — applies to any element
function applyCrumble(el) {
	if (!el || el.dataset.crumbleInit) return;
	el.dataset.crumbleInit = '1';

	html2canvas(el, {
		backgroundColor: null,
		scale: 2
	}).then(function(sourceCanvas) {
		if (sourceCanvas.width === 0 || sourceCanvas.height === 0) return;
		var srcCtx = sourceCanvas.getContext('2d');
		var imgData = srcCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
		var pixels = [];
		var step = 2;

		for (var y = 0; y < sourceCanvas.height; y += step) {
			for (var x = 0; x < sourceCanvas.width; x += step) {
				var i = (y * sourceCanvas.width + x) * 4;
				if (imgData.data[i + 3] > 50) {
					pixels.push({
						homeX: x / 2,
						homeY: y / 2,
						r: imgData.data[i],
						g: imgData.data[i + 1],
						b: imgData.data[i + 2],
						a: imgData.data[i + 3] / 255
					});
				}
			}
		}

		if (pixels.length === 0) return;

		var w = el.offsetWidth;
		var h = el.offsetHeight;
		var baseline = h;

		var canvas = document.createElement('canvas');
		canvas.className = 'dust-canvas';
		canvas.width = w;
		canvas.height = h;
		canvas.style.width = w + 'px';
		canvas.style.height = h + 'px';
		el.appendChild(canvas);

		el.style.color = 'transparent';
		el.style.webkitTextFillColor = 'transparent';

		var dustCtx = canvas.getContext('2d');

		var particles = pixels.map(function(p) {
			return {
				homeX: p.homeX,
				homeY: p.homeY,
				x: p.homeX,
				y: p.homeY,
				vx: 0,
				vy: 0,
				r: p.r,
				g: p.g,
				b: p.b,
				a: p.a,
				detachTime: p.homeY * 0.1 + Math.random() * 70,
				settled: false,
				detached: false,
				settledTime: 0,
				gone: false
			};
		});

		var gravity = 0.003;
		var friction = 0.995;
		var elapsed = 0;
		var cycleDuration = 90;
		var textFadeDuration = 5;
		var totalCycle = cycleDuration + textFadeDuration;
		var lastTime = performance.now();

		function animate(now) {
			var dt = (now - lastTime) / 1000;
			lastTime = now;
			elapsed += dt;

			var cycleTime = elapsed % totalCycle;

			dustCtx.clearRect(0, 0, canvas.width, canvas.height);

			if (cycleTime < cycleDuration) {
				for (var i = 0; i < particles.length; i++) {
					var p = particles[i];

					if (cycleTime >= p.detachTime && !p.detached) {
						p.detached = true;
						p.vx = (Math.random() - 0.5) * 0.2;
						p.vy = 0;
					}

					if (p.detached && !p.settled) {
						p.vy += gravity;
						p.vx *= friction;
						p.x += p.vx;
						p.y += p.vy;

						if (p.y >= baseline - 1) {
							p.y = baseline - 1 - Math.random() * 2;
							p.settled = true;
							p.settledTime = cycleTime;
							p.vx = 0;
							p.vy = 0;
						}
					}

					if (p.gone) continue;

					var alpha = p.a;
					if (p.settled) {
						var sinceLanded = cycleTime - p.settledTime;
						alpha = p.a * Math.max(0, 1 - sinceLanded / 0.3);
						if (alpha <= 0) { p.gone = true; continue; }
					}

					dustCtx.globalAlpha = alpha;
					dustCtx.fillStyle = 'rgb(' + p.r + ',' + p.g + ',' + p.b + ')';
					dustCtx.fillRect(p.x, p.y, 1, 1);
				}

			} else {
				var fadeInProgress = (cycleTime - cycleDuration) / textFadeDuration;
				fadeInProgress = Math.min(fadeInProgress, 1);

				for (var i = 0; i < particles.length; i++) {
					var p = particles[i];
					dustCtx.globalAlpha = p.a * fadeInProgress;
					dustCtx.fillStyle = 'rgb(' + p.r + ',' + p.g + ',' + p.b + ')';
					dustCtx.fillRect(p.homeX, p.homeY, 1, 1);

					if (fadeInProgress >= 1) {
						p.x = p.homeX;
						p.y = p.homeY;
						p.vx = 0;
						p.vy = 0;
						p.settled = false;
						p.detached = false;
						p.gone = false;
						p.settledTime = 0;
					}
				}
			}

			requestAnimationFrame(animate);
		}

		requestAnimationFrame(animate);
	});
}

function initDecayCrumble() {
	document.querySelectorAll('.decay').forEach(function(el) {
		if (el.closest('#athenaeumResult')) return;
		if (el.classList.contains('item')) {
			var name = el.querySelector('.name');
			var counter = el.querySelector('.counter');
			if (name) applyCrumble(name);
			if (counter) applyCrumble(counter);
		} else {
			applyCrumble(el);
		}
	});
}

// Spark particle effect for spark resource
function initSparkEffect() {
	var itemEl = document.querySelector('.item.spark');
	if (!itemEl || itemEl.dataset.sparkInit) return;
	itemEl.dataset.sparkInit = '1';
	itemEl.style.position = 'relative';

	var nameEl = itemEl.querySelector('.name');
	var container = document.createElement('span');
	container.className = 'spark-container';
	itemEl.appendChild(container);

	var maxSparks = 3;

	function spawnSpark() {
		var el = document.createElement('span');
		el.className = 'spark-particle';
		// Position within the name span area
		var x = Math.random() * nameEl.offsetWidth;
		var y = Math.random() * nameEl.offsetHeight;
		el.style.left = x + 'px';
		el.style.top = y + 'px';
		// Random warm spark color
		var colors = ['#FFD700', '#FFA500', '#FF6347', '#FFEC8B', '#FFF8DC'];
		el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
		// Random size
		var size = 1 + Math.random() * 2;
		el.style.width = size + 'px';
		el.style.height = size + 'px';
		container.appendChild(el);

		el.addEventListener('animationend', function() {
			el.remove();
		});
	}

	setInterval(function() {
		if (container.children.length < maxSparks) {
			spawnSpark();
		}
	}, 800 + Math.random() * 1200);
}

// Abstraction text effect: each letter shifts size and color between magenta and cyan
function applyAbstractionLetters(el) {
	if (el.dataset.abstractionInit) return;
	el.dataset.abstractionInit = '1';

	var text = el.textContent.trim();
	el.textContent = '';
	var letters = [];
	for (var i = 0; i < text.length; i++) {
		var span = document.createElement('span');
		span.textContent = text[i];
		span.className = 'abstraction-letter';
		span.style.animationDelay = (Math.random() * 4).toFixed(2) + 's';
		span.style.animationDuration = (3 + Math.random() * 3).toFixed(2) + 's';
		span.style.fontSize = '0.85em';
		el.appendChild(span);
		letters.push({ el: span, big: false, timer: 0, char: text[i], square: false });
	}

	function tickSizes() {
		for (var i = 0; i < letters.length; i++) {
			var l = letters[i];
			l.timer--;
			if (l.timer <= 0) {
				l.big = !l.big;
				l.timer = l.big ? 2 + Math.floor(Math.random() * 4) : 4 + Math.floor(Math.random() * 8);
			}
		}
		var anyBig = false;
		for (var i = 0; i < letters.length; i++) { if (letters[i].big) { anyBig = true; break; } }
		if (!anyBig) {
			var pick = Math.floor(Math.random() * letters.length);
			letters[pick].big = true;
			letters[pick].timer = 2 + Math.floor(Math.random() * 4);
		}
		for (var i = 0; i < letters.length; i++) {
			var l = letters[i];
			l.el.style.fontSize = l.big ? '1.1em' : '0.85em';
			if (!l.square && Math.random() < 0.03) {
				l.square = true;
				l.el.textContent = '\u25A0';
				(function(letter) {
					setTimeout(function() {
						letter.el.textContent = letter.char;
						letter.square = false;
					}, 300 + Math.random() * 400);
				})(l);
			}
		}
	}

	for (var i = 0; i < letters.length; i++) {
		letters[i].big = Math.random() < 0.2;
		letters[i].timer = 2 + Math.floor(Math.random() * 6);
	}
	if (!letters.some(function(l) { return l.big; })) {
		letters[Math.floor(Math.random() * letters.length)].big = true;
	}
	tickSizes();
	setInterval(tickSizes, 500);
}

function initAbstractionEffects() {
	document.querySelectorAll('.abstraction').forEach(function(el) {
		if (el.classList.contains('item')) {
			var name = el.querySelector('.name');
			var amount = el.querySelector('.counter .amount');
			if (name && !name.dataset.abstractionInit) applyAbstractionLetters(name);
			if (amount && !amount.dataset.abstractionInit) applyAbstractionLetters(amount);
		} else {
			// dropdown elements -> target directly
			if (!el.dataset.abstractionInit) applyAbstractionLetters(el);
		}
	});
}

// Madness text effect: randomly swap inner letters briefly
function applyMadnessSwap(el) {
	if (el.dataset.madnessInit) return;
	el.dataset.madnessInit = '1';

	var original = el.textContent.trim();
	if (original.length < 4) return;
	var scrambled = false;

	el._madnessInterval = setInterval(function() {
		if (!el.dataset.madnessInit) { clearInterval(el._madnessInterval); return; }
		if (!scrambled && Math.random() < 0.08) {
			var inner = original.split('');
			var a = 1 + Math.floor(Math.random() * (inner.length - 2));
			var b = 1 + Math.floor(Math.random() * (inner.length - 2));
			while (b === a) { b = 1 + Math.floor(Math.random() * (inner.length - 2)); }
			var tmp = inner[a];
			inner[a] = inner[b];
			inner[b] = tmp;
			el.textContent = inner.join('');
			scrambled = true;
			setTimeout(function() {
				el.textContent = original;
				scrambled = false;
			}, 200 + Math.random() * 300);
		}
	}, 500);
}

function initMadnessEffects() {
	document.querySelectorAll('.madness').forEach(function(el) {
		var target = el.querySelector('.name') || el;
		if (!target.dataset.madnessInit) applyMadnessSwap(target);
	});
}

// Magma crack overlay — generates cracks as a background layer, clipped by background-clip: text
function applyMagmaCracks(el) {
	if (el.dataset.magmaInit) return;
	el.dataset.magmaInit = '1';

	var gradient = 'linear-gradient(90deg, #1a0000, #8B0000, #FF4500, #FF8C00, #FF4500, #8B0000, #1a0000)';

	function generateCracks() {
		var w = el.offsetWidth;
		var h = el.offsetHeight;
		if (w === 0 || h === 0) return;

		var dpr = window.devicePixelRatio || 1;
		var c = document.createElement('canvas');
		c.width = w * dpr;
		c.height = h * dpr;
		var ctx = c.getContext('2d');
		ctx.scale(dpr, dpr);

		var numCracks = 2 + Math.floor(Math.random() * 3);
		for (var i = 0; i < numCracks; i++) {
			ctx.beginPath();
			var x = Math.random() * w;
			var y = Math.random() * h * 0.3;
			ctx.moveTo(x, y);

			var segments = 4 + Math.floor(Math.random() * 5);
			for (var s = 0; s < segments; s++) {
				x += (Math.random() - 0.5) * (w * 0.3);
				y += Math.random() * (h / segments) + 2;
				ctx.lineTo(x, y);

				if (Math.random() < 0.4) {
					var bx = x, by = y;
					var bLen = 1 + Math.floor(Math.random() * 3);
					ctx.moveTo(bx, by);
					for (var b = 0; b < bLen; b++) {
						bx += (Math.random() - 0.5) * 12;
						by += Math.random() * 6 + 1;
						ctx.lineTo(bx, by);
					}
					ctx.moveTo(x, y);
				}
			}

			ctx.strokeStyle = 'rgba(30, 10, 0, ' + (0.3 + Math.random() * 0.4) + ')';
			ctx.lineWidth = 0.5 + Math.random() * 1;
			ctx.stroke();
		}

		// Set cracks + gradient as background layers, both clipped to text
		el.style.backgroundImage = 'url(' + c.toDataURL() + '), ' + gradient;
		el.style.backgroundSize = w + 'px ' + h + 'px, 300% 100%';
	}

	generateCracks();
	setInterval(generateCracks, 5000 + Math.random() * 3000);
}

function initMagmaEffects() {
	document.querySelectorAll('.magma').forEach(function(el) {
		if (el.classList.contains('item')) {
			var name = el.querySelector('.name');
			var counter = el.querySelector('.counter');
			if (name) applyMagmaCracks(name);
			if (counter) applyMagmaCracks(counter);
		} else {
			applyMagmaCracks(el);
		}
	});
}

// Clean up stale effects on .selected and .option elements when class changes
function cleanupStaleEffects() {
	document.querySelectorAll('.selected, #result, #text').forEach(function(el) {
		// magma: clear inline background if no longer .magma
		if (!el.classList.contains('magma') && el.dataset.magmaInit) {
			el.style.backgroundImage = '';
			el.style.backgroundSize = '';
			delete el.dataset.magmaInit;
		}
		// madness: clear interval if no longer .madness
		if (!el.classList.contains('madness') && el.dataset.madnessInit) {
			delete el.dataset.madnessInit;
		}
		// abstraction: restore plain text if no longer .abstraction
		if (!el.classList.contains('abstraction') && el.dataset.abstractionInit) {
			delete el.dataset.abstractionInit;
		}
		// decay: remove canvas if no longer .decay
		if (!el.classList.contains('decay') && el.dataset.crumbleInit) {
			var dustCanvas = el.querySelector('.dust-canvas');
			if (dustCanvas) dustCanvas.remove();
			el.style.color = '';
			el.style.webkitTextFillColor = '';
			delete el.dataset.crumbleInit;
		}
	});
}

// Lightning beam effect for the enminder lightning gauge
// Adapted from diwsi/Javascript-Lightning-Effect (MIT)
// https://github.com/diwsi/Javascript-Lightning-Effect

var LightningVector = function(x, y, x1, y1) {
	this.X = x; this.Y = y; this.X1 = x1; this.Y1 = y1;
};
LightningVector.prototype.dX = function() { return this.X1 - this.X; };
LightningVector.prototype.dY = function() { return this.Y1 - this.Y; };
LightningVector.prototype.Length = function() { return Math.sqrt(this.dX()*this.dX() + this.dY()*this.dY()); };
LightningVector.prototype.Multiply = function(n) { return new LightningVector(this.X, this.Y, this.X + this.dX()*n, this.Y + this.dY()*n); };

function lightningCast(ctx, from, to, cfg) {
	ctx.save();
	var v = new LightningVector(from.X1, from.Y1, to.X1, to.Y1);
	var vLen = v.Length();
	var lR = vLen / ctx.canvas.width;
	var segments = Math.floor(cfg.Segments * lR);
	if (segments < 2) segments = 2;
	var l = vLen / segments;
	var refv = from;
	for (var i = 1; i <= segments; i++) {
		var dv = v.Multiply((1 / segments) * i);
		if (i != segments) {
			dv.Y1 += l * (Math.random() - 0.5) * 2;
			dv.X1 += l * (Math.random() - 0.5);
		}
		var r = new LightningVector(refv.X1, refv.Y1, dv.X1, dv.Y1);
		// glow
		ctx.beginPath();
		ctx.strokeStyle = cfg.GlowColor;
		ctx.lineWidth = cfg.GlowWidth * lR;
		ctx.globalAlpha = (Math.floor(Math.random() * cfg.GlowAlpha) + cfg.GlowAlpha) / 100;
		ctx.shadowBlur = cfg.GlowBlur * lR;
		ctx.shadowColor = cfg.GlowColor;
		ctx.moveTo(r.X, r.Y);
		ctx.lineTo(r.X1, r.Y1);
		ctx.stroke();
		// core
		ctx.beginPath();
		ctx.strokeStyle = cfg.Color;
		ctx.lineWidth = cfg.Width;
		ctx.globalAlpha = cfg.Alpha;
		ctx.shadowBlur = cfg.Blur;
		ctx.shadowColor = cfg.BlurColor;
		ctx.moveTo(r.X, r.Y);
		ctx.lineTo(r.X1, r.Y1);
		ctx.stroke();
		refv = r;
	}
	ctx.restore();
}

var lightningCyan = {
	Segments: 20, Color: '#fff', Width: 1, Blur: 2, BlurColor: '#7df9ff',
	Alpha: 0.8, GlowColor: '#00bfff', GlowWidth: 6, GlowBlur: 8, GlowAlpha: 15
};
var lightningYellow = {
	Segments: 20, Color: '#fff', Width: 1, Blur: 2, BlurColor: '#ffe066',
	Alpha: 0.8, GlowColor: '#ffcc00', GlowWidth: 6, GlowBlur: 8, GlowAlpha: 15
};

function initLightningBeams() {
	var el = document.querySelector('.enminder-lightning');
	if (!el || el.dataset.lightningInit) return;
	el.dataset.lightningInit = '1';

	var canvas = document.createElement('canvas');
	el.appendChild(canvas);
	var ctx = canvas.getContext('2d');
	var PAD_X = 4, PAD_Y = 10;
	var timer = 0;

	var dpr = window.devicePixelRatio || 1;

	function animate(ts) {
		var w = el.offsetWidth;
		var h = el.offsetHeight;
		var cw = w + PAD_X * 2;
		var ch = h + PAD_Y * 2;
		if (canvas.width !== Math.round(cw * dpr) || canvas.height !== Math.round(ch * dpr)) {
			canvas.width = Math.round(cw * dpr);
			canvas.height = Math.round(ch * dpr);
			canvas.style.width = cw + 'px';
			canvas.style.height = ch + 'px';
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		}

		// fade previous frame
		ctx.globalCompositeOperation = 'destination-out';
		ctx.fillStyle = 'rgba(0,0,0,0.3)';
		ctx.fillRect(0, 0, cw, ch);
		ctx.globalCompositeOperation = 'source-over';

		var fillWidth = parseFloat(el.style.width) || 0;
		if (fillWidth > 0 && ts - timer > 80) {
			timer = ts;
			// cyan bolt
			var from = new LightningVector(0, 0, Math.random() * cw * 0.2, Math.random() * ch);
			var to = new LightningVector(0, 0, cw * 0.8 + Math.random() * cw * 0.2, Math.random() * ch);
			lightningCast(ctx, from, to, lightningCyan);
			// yellow bolt
			var from2 = new LightningVector(0, 0, Math.random() * cw * 0.2, Math.random() * ch);
			var to2 = new LightningVector(0, 0, cw * 0.8 + Math.random() * cw * 0.2, Math.random() * ch);
			lightningCast(ctx, from2, to2, lightningYellow);
		}

		requestAnimationFrame(animate);
	}

	requestAnimationFrame(animate);
}

// Watch for elements appearing in the DOM
var effectsObserver = new MutationObserver(function() {
	cleanupStaleEffects();
	initDecayCrumble();
	if (document.querySelector('.item.spark') && !document.querySelector('.item.spark').dataset.sparkInit) {
		initSparkEffect();
	}
	initAbstractionEffects();
	initMadnessEffects();
	initMagmaEffects();
	initLightningBeams();
});
effectsObserver.observe(document.body, { childList: true, subtree: true });

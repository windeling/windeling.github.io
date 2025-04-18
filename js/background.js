// 背景线条 bynote.cn
(function () {
  function getAttributeOrDefault(element, attribute, defaultValue) {
      return element.getAttribute(attribute) || defaultValue;
  }

  function getElementsByTagName(tagName) {
      return document.getElementsByTagName(tagName);
  }

  function getOptions() {
      var scripts = getElementsByTagName("script");
      var scriptCount = scripts.length;
      var script = scripts[scriptCount - 1];
      return {
          count: getAttributeOrDefault(script, "count", 99),
          color: getAttributeOrDefault(script, "color", "255,255,255"),
          opacity: getAttributeOrDefault(script, "opacity", 0.5),
          zIndex: getAttributeOrDefault(script, "zIndex", -1),
      };
  }

  function resizeCanvas() {
      canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  }

  function draw() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      var particles = [mainParticle].concat(otherParticles);
      var particle, otherParticle, distance, xDiff, yDiff, alpha, lineWidth, strokeStyle;
      otherParticles.forEach(function (otherParticle) {
          otherParticle.x += otherParticle.xa;
          otherParticle.y += otherParticle.ya;
          otherParticle.xa *= otherParticle.x > canvas.width || otherParticle.x < 0 ? -1 : 1;
          otherParticle.ya *= otherParticle.y > canvas.height || otherParticle.y < 0 ? -1 : 1;
          context.beginPath();
          context.arc(otherParticle.x, otherParticle.y, 2, 0, 2 * Math.PI);
          context.fillStyle = "rgb(235, 235, 235)";
          context.fill();
          for (var i = 0; i < particles.length; i++) {
              particle = particles[i];
              if (otherParticle !== particle && particle.x !== null && particle.y !== null) {
                  xDiff = otherParticle.x - particle.x;
                  yDiff = otherParticle.y - particle.y;
                  distance = xDiff * xDiff + yDiff * yDiff;
                  if (distance < particle.max) {
                      if (particle === mainParticle && distance >= particle.max / 2) {
                          otherParticle.x -= 0.03 * xDiff;
                          otherParticle.y -= 0.03 * yDiff;
                      }
                      alpha = (particle.max - distance) / particle.max;
                      lineWidth = alpha;
                      strokeStyle = "rgba(" + options.color + "," + (alpha + 0.2) + ")";
                      context.beginPath();
                      context.lineWidth = lineWidth;
                      context.strokeStyle = strokeStyle;
                      context.moveTo(otherParticle.x, otherParticle.y);
                      context.lineTo(particle.x, particle.y);
                      context.stroke();
                  }
              }
          }
          particles.splice(particles.indexOf(otherParticle), 1);
      });
      requestAnimationFrame(draw);
  }

  var canvas = document.createElement("canvas");
  var options = getOptions();
  var canvasId = "c_n" + options.count;
  var context = canvas.getContext("2d");
  var mainParticle = { x: null, y: null, max: 50000 };
  var otherParticles = [];
  var requestAnimationFrame =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
          window.setTimeout(callback, 1000 / 45);
      };
  var random = Math.random;

  canvas.id = canvasId;
  canvas.style.cssText =
      "position: fixed; top: 0; left: 0; z-index: " +
      options.zIndex +
      "; opacity: " +
      options.opacity +
      ";";
  getElementsByTagName("body")[0].appendChild(canvas);

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("mousemove", function (event) {
      mainParticle.x = event.clientX;
      mainParticle.y = event.clientY;
  });
  window.addEventListener("mouseout", function () {
      mainParticle.x = null;
      mainParticle.y = null;
  });

  for (var i = 0; i < options.count; i++) {
      var x = random() * canvas.width;
      var y = random() * canvas.height;
      var xa = 2 * random() - 1;
      var ya = 2 * random() - 1;
      otherParticles.push({ x: x, y: y, xa: xa, ya: ya, max: 6000 });
  }

  setTimeout(function () {
      draw();
  }, 100);
})();
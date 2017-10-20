var fireworks= (function () {
    var tap = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? 'touchstart' : 'mousedown';
    var colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'];
    var numberOfParticles = 40;
    var particleIds = new Array(numberOfParticles);
    var i = 0;

    while(i <= numberOfParticles){
       particleIds.push(i++);
    }

    function createParticle(x, y) {
        var radius = 16 + (16 * Math.random());
        var p = document.createElement("div");
        p.className = "particle";
        p.x = x;
        p.y = y;
        p.style.background = colors[Math.round(Math.random() * 3)];
        p.style.width = radius + "px";
        p.style.height = radius + "px";
        p.style.borderRadius = radius + "px";

        return p;
    }

    function createBlastRadius(x, y) {
        var radius = 0.1;
        var p = document.createElement("div");
        p.className = "blast-radius";
        p.x = x;
        p.y = y;
        p.style.top = y + "px";
        p.style.left = x + "px";
        p.style.opacity = 0.5;
        p.style.width = radius + "px";
        p.style.height = radius + "px";
        p.style.borderRadius = radius + "px";

        return p;
    }

    function setParticleDirection(p) {
        var angle = (360 * Math.random()) * Math.PI / 180;
        var value = 50 + (130 * Math.random());
        var radius = [-1, 1][Math.round(Math.random())] * value;
        return {
            x: p.x + radius * Math.cos(angle),
            y: p.y + radius * Math.sin(angle)
        };
    }

    function animateParticles(x, y, container) {
        var fireworkTl = new TimelineLite();
        var particles = particleIds.map(function () {
            var p = createParticle(x, y);
            container.appendChild(p);
            return p;
        });
        particles.forEach(function(p) {
            var radius = 16 + (16 * Math.random());
            var startProps = {
                x: x,
                y: y,
                scale: 1
            };
            var finalProps = setParticleDirection(p);
            finalProps.scale = 0;
            finalProps.ease = Expo.easeOut;
            fireworkTl.fromTo(
                p,
                1.2 + (0.6 * Math.random()),
                startProps,
                finalProps,
                0
            );
        });

        var blastRadius = createBlastRadius(x, y);
        container.appendChild(blastRadius);
        var blastRadiusValue = 80 + (80 * Math.random());

        fireworkTl.fromTo(
            blastRadius,
            1.2 + (0.6 * Math.random()),
            {
                width: 0.1,
                height: 0.1,
                borderRadius: 0.1,
                opacity: 0.5
            },
            {
                width: blastRadiusValue,
                height: blastRadiusValue,
                borderRadius: blastRadiusValue,
                marginTop: -blastRadiusValue/2,
                marginLeft: -blastRadiusValue/2,
                opacity: 0,
                ease: Expo.easeOut
            },
            0
        );

        fireworkTl.play();

        return {
            then: function (fn) {
                fireworkTl.eventCallback("onComplete", function () {
                    fn(fireworkTl, particles.concat([blastRadius]));
                });
            }
        };
    }


    document.addEventListener(tap, function(e) {
        var pointerX = e.clientX || e.touches[0].clientX;
        var pointerY = e.clientY || e.touches[0].clientY;
        var container = document.querySelector("#fireworks-container");
        animateParticles(pointerX, pointerY, container).then(function (tl, particles) {
            particles.forEach(function (p) {
                container.removeChild(p);
            });
        });
    }, false);
}());

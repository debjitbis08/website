(function () {

    function createCircle(radius) {
        var p = document.createElement("div");
        p.className = "circle";
        p.style.position = "absolute";
        p.style.top = "50%";
        p.style.left = "50%";
        p.style.marginTop = "-" + radius / 2 + "px";
        p.style.marginLeft = "-" + radius / 2 + "px";
        p.style.width = radius + "px";
        p.style.height = radius + "px";
        p.style.borderRadius = radius + "px";
        p.style.border = "2px solid #444";

        return p;
    }

    function createHorizontalLine(height, spacing) {
        var l = document.createElement("div");
        l.className = "line__horizontal";
        l.style.width = "100%";
        l.style.height = height + "px";
        l.style.marginTop = spacing / 2 + "px";
        l.style.marginBottom = spacing / 2 + "px";
        l.style.background = "#444";

        return l;
    }

    function horizontalLines(container) {
        var step = 10;
        var radii = new Array(160).fill().map(function (x, idx) { return 10 * (idx + 1); });
        radii.forEach(function(r) {
            var c = createHorizontalLine(2, 2);
            container.appendChild(c);
        });
    };

    function concentricCircles(container) {
        var step = 10;
        var radii = new Array(40).fill().map(function (x, idx) { return 10 * (idx + 1); });
        radii.forEach(function(r) {
            var c = createCircle(r);
            container.appendChild(c);
        });
    }

    concentricCircles(document.querySelector("#circles-on-horizontal-lines"));
    horizontalLines(document.querySelector("#circles-on-horizontal-lines"));

    document.querySelector("#line-pitch").addEventListener("input", function (e) {
        var value = e.target.value;
        document.querySelector("#line-pitch-value").innerHTML = value;
        document.querySelectorAll("#circles-on-horizontal-lines .line__horizontal").forEach(function (l) {
            l.style.marginTop = value / 2 + "px";
            l.style.marginBottom = value / 2 + "px";
        });
    });

    concentricCircles(document.querySelector("#circles-on-circles .first-set"));
    concentricCircles(document.querySelector("#circles-on-circles .second-set"));
    document.querySelector("#circles-on-circles .second-set").style.marginLeft = "40px";

    document.querySelector("#center-distance").addEventListener("input", function (e) {
        var value = e.target.value;
        document.querySelector("#center-distance-value").innerHTML = value;
        document.querySelector("#circles-on-circles .second-set").style.marginLeft = value + "px";
    });
}());
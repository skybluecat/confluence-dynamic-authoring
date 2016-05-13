define("log", ["jquery"], function (e) {
    var t, n, r = {}, i = "", s = function (r, s, a) {
        i = r;
        if (i === "REACT") {
            t = s, n = a;
            var f = e("#logControlsArea");
            for (var l = 0; l < n.length; l++) {
                var c = n[l], h = c[0], p = c[1];
                f.append("<input id='box_" + h + "' type='checkbox' " + (p ? "checked" : "") + " value='" + h + "'> " + h + "<br/>")
            }
        }
        e("#logControlsArea input").change(function (e) {
            console.log("e", e, "this", this), e.target.checked === !0 ? o(e.target.value) : u(e.target.value)
        })
    }, o = function (e) {
        r[e] = !0
    }, u = function (e) {
        r[e] = !1
    }, a = function (e) {
        return r[e] === !0
    }, f = function () {
        for (var t = 0; t < n.length; t++) {
            var r = n[t];
            o(r[0]), e("#box_" + r[0]).prop("checked", !0)
        }
    }, l = function () {
        r = {};
        for (var t = 0; t < n.length; t++) {
            var i = n[t];
            i[1] = !1, u(i[0]), e("#box_" + i[0]).prop("checked", !1)
        }
    }, c = function (t, n, s) {
        if (r[t] === !0 || s)if (i === "REACT")e("#logWindow").append("<p class='log_" + t + "'>" + n + "</p>"); else {
            var o = "<div class='logmsg log_" + t + "'>" + n + "</div>";
            e(i).append(o)
        }
    }, h = function (e, t) {
        console.log("ERROR " + e + ": " + t), console.log("Additional error info follows:");
        for (var n = 2; n <= arguments.length; n++)console.log(arguments[n]);
        i === "REACT" && c("error", "ERROR: Additional info on Javascript console.", !0)
    }, p = function (e, t) {
        throw h(e, t), console.log("Stack trace follows:"), console.trace(), new Error("Halting execution.")
    };
    return {init: s, log: c, error: h, fatalError: p, on: o, off: u, areTracking: a, all: f, reset: l}
});
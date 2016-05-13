define("test", ["util", "underscore", "jquery"], function (e, t, n) {
    var r, i, s = 0, o = 0, u, a, f = function (e, t) {
        return n("<div/>", {"class": t, html: e})
    }, l = function (e) {
        f(e, "testFileHeader").appendTo("#testResults")
    }, c = function () {
        s += 1
    }, h = function (e, t, n, r) {
        var i = "Failed '" + n + "'. " + r;
        a.append(f(i, "testFailed")), o += 1
    }, p = function (t, n) {
        if (e.isArray(t)) {
            if (!e.isArray(n))return !1;
            if (t.length !== n.length)return !1;
            for (var r = 0; r < t.length; r++)if (t[r] !== n[r])return !1
        } else {
            if (typeof t === Object || typeof n === Object)return !1;
            if (t !== n)return !1
        }
        return !0
    }, d = function (e, t) {
        e !== r && (r = e, l(e)), i = t, s = 0, o = 0, u = n("<div/>", {"class": "groupBox"}), n("<div/>", {
            "class": "testGroupHeader",
            html: i
        }).appendTo(u), a = n("<div/>", {"class": "testGroupBody"}), a.appendTo(u)
    }, v = function () {
        var e = o === 0;
        e ? u.addClass("testPassed") : u.addClass("testFailed");
        var t = n("<div/>", {"class": "testGroupSummary", html: s + "/" + (s + o) + " tests passed."});
        a.append(t), n("#testResults").append(u)
    }, m = function (e, t, n) {
        var r = p(e, t);
        r ? c() : h(e, t, n, "Was '" + e + "', expected '" + t + "'.")
    }, g = function (e, t, n) {
        var r = !p(e, t);
        r ? c() : h(e, t, n, "Was '" + e + "', expected not equal to '" + t + "'.")
    }, y = function (e, t, n, r) {
        (typeof e != "number" || typeof e != "number") && h(e, n, r, "Expected '" + e + "' < '" + n + "' but one of those was not a number."), e < n ? c() : h(e, n, r, "Expected '" + e + "' < '" + n + "'.")
    }, b = function (e, t, n) {
        (typeof e != "number" || typeof e != "number") && h(e, t, n, "Expected '" + e + "' > '" + t + "' but one of those was not a number."), e > t ? c() : h(e, t, n, "Expected '" + e + "' > '" + t + "'.")
    }, w = function (e, t, n, r) {
        (typeof e != "number" || typeof e != "number") && h(e, n, r, "Expected '" + e + "' <= '" + n + "' but one of those was not a number."), e <= n ? c() : h(e, n, r, "Expected '" + e + "' <= '" + n + "'.")
    }, E = function (e, t, n) {
        (typeof e != "number" || typeof e != "number") && h(e, t, n, "Expected '" + e + "' >= '" + t + "' but one of those was not a number."), e >= t ? c() : h(e, t, n, "Expected '" + e + "' >= '" + t + "'.")
    };
    return {assert: m, assertNEQ: g, assertLT: y, assertGT: b, assertLTE: w, assertGTE: E, start: d, finish: v}
});
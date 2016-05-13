define("util", [], function() {
    var e = function(e) {
            return toString.call(e) === "[object Array]"
        },
        t = function(e) {
            return parseFloat(e) == parseInt(e) && !isNaN(e) ? !0 : !1
        },
        n = function(e, t) {
            var n = t || typeof t == "undefined" ? "<br />" : "<br>";
            return (e + "").replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, "$1" + n + "$2")
        },
        r = function(e, t) {
            return e === undefined ? !1 : e.indexOf(t) > -1
        },
        i = function(e) {
            return h(Object.keys(e))
        },
        s = function(e, t) {
            return t === undefined ? e <= 1 || typeof e != "number" ? 1 : Math.floor(Math.random() * Math.round(e)) + 1 : e <= 1 || typeof e != "number" || e <= t || typeof t != "number" ? 1 : Math.floor(Math.random() * (e - t + 1)) + t
        },
        o = {},
        u = function(e, t) {
            var n = 0,
                r = o[e];
            if (typeof t != "number") throw new Error("util.randomNoRepeat(): called with max of " + t + " which is " + typeof t + " instead of number.");
            return t <= 1 ? 1 : (r === undefined ? n = s(t) : (n = s(t - 1), n >= r && (n += 1)), o[e] = n, n)
        },
        a = function(e, t) {
            if (t <= 1) return e;
            var n = e / t,
                r = e * t,
                i = r - n,
                s = Math.random() * (i / 3) + Math.random() * (i / 3) + Math.random() * (i / 3);
            return s + n
        },
        f = {},
        l = function(e) {
            return f[e] === undefined && (f[e] = 0), f[e] += 1, f[e]
        },
        c = function(e) {
            f[e] = 0
        },
        h = function(e) {
            return e[s(e.length) - 1]
        },
        p = function(t, n) {
            return !e(n) || n.length === 0 ? undefined : n.length === 1 ? n[0] : n[u(t, n.length) - 1]
        },
        d = function(t, n, r) {
            var i = n || "and",
                s = r || "",
                o = "",
                u = D(t),
                a = u.length;
            while (u.length > 0) {
                var f = u.shift();
                o += s + f + s, u.length == 1 ? a == 2 ? o += " " + i + " " : o += ", " + i + " " : u.length !== 0 && (o += ", ")
            }
            return o
        },
        v = function(t) {
            var n = [],
                r = [],
                i = -1;
            if (!e(t)) throw new Error("util.randomOrder: Called randomOrder on " + t + " which is not an array.");
            if (t.length <= 1) return t;
            n = t.slice(0);
            while (n.length > 0) i = s(n.length) - 1, r.push(n[i]), n.splice(i, 1);
            return r
        },
        m = function(e, t, n, r) {
            if (typeof e != "number" || typeof t != "number" || n !== undefined && typeof n != "number" || r !== undefined && typeof r != "number") throw new Error("util.safeAdd: called with non-numeric value (parameters were " + e + ", " + t + ", " + n + ")");
            return e += t, e > n && (e = n), r !== undefined && e < r && (e = r), e
        },
        g = function(e, t, n, r, i) {
            if (typeof e != "number" || typeof t != "number" || typeof i != "number" && i !== undefined || typeof r != "number" && r !== undefined) throw new Error("util.safeOp: called with non-numeric value (parameters were num:" + e + ", val:" + t + ", min:" + r + ", max:" + i + ")");
            switch (n) {
                case "+":
                    e += t;
                    break;
                case "*":
                    e *= t;
                    break;
                case "-":
                    e -= t;
                    break;
                case "/":
                    t === 0 ? (e = e, console.log("util.safeOp: divide by 0, returning num instead. (num=" + e + ", val=" + t + ", op=" + n + ", min=" + r + ", max=" + i)) : e /= t
            }
            return i !== undefined && e > i && (e = i), e < r && (e = r), e
        },
        y = function(e, t, n) {
            return g(e, t, "*", 0, n)
        },
        m = function(e, t, n) {
            return g(e, t, "+", 0, n)
        },
        b = function(e, t, n) {
            return g(e, t, "-", n, undefined)
        },
        w = function(e, t, n) {
            return g(e, t, "/", n, undefined)
        },
        E = function(e) {
            if (typeof e != "string") throw new Error("util.iCap(): called iCap on " + e + " which is not a string.");
            return e.charAt(0).toUpperCase() + e.slice(1)
        },
        S = function(e) {
            if (typeof e != "string") throw new Error("util.iLower: called iLower on " + e + " which is not a string.");
            return e.charAt(0).toLowerCase() + e.slice(1)
        },
        x = function(e) {
            var t = [],
                n = "",
                r = 0;
            if (typeof e != "string") throw new Error("util.titleCase(): called titleCase on " + e + " which is not a string.");
            t = e.trim().split(" ");
            for (r in t) n += E(t[r]) + " ";
            return n.trim()
        },
        T = function(t, n) {
            var r = "",
                i = "";
            if (typeof t != "string" || !e(n) || typeof n[0] != "string") throw new Error("util.isOneOf:Called isOneOf with wrong type of inputs (should be string, array of strings; instead was " + t + " (" + typeof t + "), " + n + " (" + typeof n + ")");
            r = t.toLowerCase();
            for (i in n)
                if (r === n[i].toLowerCase()) return !0;
            return !1
        },
        N = function(e) {
            var t = "",
                n = 0,
                r = "";
            for (r in e) n === 0 ? t += r : t += ", " + r, n += 1;
            return t
        },
        C = function(t, n) {
            var r = 0,
                i = [];
            if (!e(t) || !e(n)) throw new Error("util.haveSameContents(): called with a non-array parameter.");
            if (t.length !== n.length) return !1;
            i = n.slice(0);
            for (r in t) {
                var s = i.indexOf(t[r]);
                if (!(s >= 0)) return !1;
                i.splice(s, 1)
            }
            return i.length === 0 ? !0 : !1
        },
        k = function(e) {
            return e * (Math.PI / 180)
        },
        L = function(e) {
            return e * (180 / Math.PI)
        },
        A = function(e, t) {
            var n = Math.round(e * Math.pow(10, t)) / Math.pow(10, t);
            return n
        },
        O = function(e, t, n, r, i) {
            return (e - t) / (n - t) * (i - r) + r
        },
        M = function(e) {
            if (typeof e == "string") return e;
            var t = "";
            if (e < 20) switch (e) {
                case 0:
                    t = "zero";
                    break;
                case 1:
                    t = "one";
                    break;
                case 2:
                    t = "two";
                    break;
                case 3:
                    t = "three";
                    break;
                case 4:
                    t = "four";
                    break;
                case 5:
                    t = "five";
                    break;
                case 6:
                    t = "six";
                    break;
                case 7:
                    t = "seven";
                    break;
                case 8:
                    t = "eight";
                    break;
                case 9:
                    t = "nine";
                    break;
                case 10:
                    t = "ten";
                    break;
                case 11:
                    t = "eleven";
                    break;
                case 12:
                    t = "twelve";
                    break;
                case 13:
                    t = "thirteen";
                    break;
                case 14:
                    t = "fourteen";
                    break;
                case 15:
                    t = "fifteen";
                    break;
                case 16:
                    t = "sixteen";
                    break;
                case 17:
                    t = "seventeen";
                    break;
                case 18:
                    t = "eighteen";
                    break;
                case 19:
                    t = "nineteen";
                    break;
                default:
                    t = "less than zero"
            } else if (e < 100) {
                switch (Math.floor(e / 10)) {
                    case 2:
                        t = "twenty";
                        break;
                    case 3:
                        t = "thirty";
                        break;
                    case 4:
                        t = "forty";
                        break;
                    case 5:
                        t = "fifty";
                        break;
                    case 6:
                        t = "sixty";
                        break;
                    case 7:
                        t = "seventy";
                        break;
                    case 8:
                        t = "eighty";
                        break;
                    case 9:
                        t = "ninety"
                }
                e % 10 != 0 && (t = t + "-" + M(e % 10))
            } else e < 200 ? (t = "a hundred", e - 100 > 0 && (t = t + " and " + M(e - 100))) : e < 1e3 ? (t = M(Math.floor(e / 100)) + " hundred", e % 100 != 0 && (t = t + " and " + M(e % 100))) : e < 9999 ? (t = M(Math.floor(e / 100)), e % 100 != 0 ? t = t + " " + M(e % 100) : t += " hundred") : t = "at least ten thousand";
            return t
        },
        _ = function(e) {
            if (typeof e == "string") return e;
            var t = M(e) + "th";
            switch (e) {
                case 0:
                    t = "zeroth";
                    break;
                case 1:
                    t = "first";
                    break;
                case 2:
                    t = "second";
                    break;
                case 3:
                    t = "third";
                    break;
                case 5:
                    t = "fifth";
                    break;
                case 8:
                    t = "eighth";
                    break;
                case 9:
                    t = "ninth";
                    break;
                case 12:
                    t = "twelfth";
                    break;
                case 20:
                    t = "twentieth"
            }
            if (e > 20) {
                var n = "" + e,
                    r = n[n.length - 1];
                switch (r) {
                    case "1":
                        t = e + "st";
                        break;
                    case "2":
                        t = e + "nd";
                        break;
                    case "3":
                        t = e + "rd";
                        break;
                    default:
                        t = e + "th"
                }
            }
            return t
        },
        D = function(e) {
            if (null === e || "object" != typeof e) return e;
            if (e instanceof Array) {
                var t = [];
                for (var n = 0, r = e.length; n < r; n++) t[n] = D(e[n]);
                return t
            }
            if (e instanceof Object) {
                var t = {};
                for (var i in e) e.hasOwnProperty(i) && (t[i] = D(e[i]));
                return t
            }
            throw new Error("Unable to copy obj! Its type isn't supported.")
        },
        P = function(e, t) {
            if (e) console.log("Passed");
            else {
                console.log("FAILED: " + t);
                for (var n = 2; n <= arguments.length; n++) console.log(arguments[n])
            }
        },
        H = function(e, t) {
            t === undefined && (t = 0);
            var n = "",
                r = Array(t + 1).join(" ");
            for (var i in e) typeof e[i] == "object" ? (n += r + i + ": " + "\n", n += H(e[i], t + 2)) : n += r + i + ": " + e[i] + "\n";
            return n
        };
    return String.prototype.trim || (String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, "")
    }), {
        randomKey: i,
        isArray: e,
        isInt: t,
        has: r,
        randomNumber: s,
        randomNoRepeat: u,
        randomJitter: a,
        iterator: l,
        resetIterator: c,
        oneOf: h,
        oneOfNoRepeat: p,
        randomOrder: v,
        safeAdd: m,
        safeMultiply: y,
        safeSubtract: b,
        safeDivide: w,
        iCap: E,
        iUpper: E,
        iLower: S,
        titleCase: x,
        isOneOf: T,
        listify: N,
        haveSameContents: C,
        degToRad: k,
        radToDeg: L,
        roundTo: A,
        remap: O,
        listWriter: d,
        clone: D,
        printedNumber: M,
        ordinalNumber: _,
        nl2br: n,
        objToText: H,
        assert: P
    }
});
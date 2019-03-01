
/**
 * This file has been auto-generated using in order to prepare external projects using NPM dependencies etc
 * in the [js] and [jsui] object in Max MSP. Any manual changes might be overwritten when regenerating this
 * file. In case you'd like to learn more, report issues etc - pleaser refer to the Project on GitHub
 *
 * https://github.com/fde31/n4m_transpile_js
 *
 */
var NAMES = "C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B".split(" ");

var names = function names(accTypes) {
  return typeof accTypes !== "string" ? NAMES.slice() : NAMES.filter(function (n) {
    var acc = n[1] || " ";
    return accTypes.indexOf(acc) !== -1;
  });
};

var SHARPS = names(" #");
var FLATS = names(" b");
var REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;

function tokenize(str) {
  if (typeof str !== "string") str = "";
  var m = REGEX.exec(str);
  return [m[1].toUpperCase(), m[2].replace(/x/g, "##"), m[3], m[4]];
}

var NO_NOTE = Object.freeze({
  pc: null,
  name: null,
  step: null,
  alt: null,
  oct: null,
  octStr: null,
  chroma: null,
  midi: null,
  freq: null
});
var SEMI = [0, 2, 4, 5, 7, 9, 11];

var properties = function properties(str) {
  var tokens = tokenize(str);
  if (tokens[0] === "" || tokens[3] !== "") return NO_NOTE;
  var letter = tokens[0],
      acc = tokens[1],
      octStr = tokens[2];
  var p = {
    letter: letter,
    acc: acc,
    octStr: octStr,
    pc: letter + acc,
    name: letter + acc + octStr,
    step: (letter.charCodeAt(0) + 3) % 7,
    alt: acc[0] === "b" ? -acc.length : acc.length,
    oct: octStr.length ? +octStr : null,
    chroma: 0,
    midi: null,
    freq: null
  };
  p.chroma = (SEMI[p.step] + p.alt + 120) % 12;
  p.midi = p.oct !== null ? SEMI[p.step] + p.alt + 12 * (p.oct + 1) : null;
  p.freq = midiToFreq(p.midi);
  return Object.freeze(p);
};

var memo = function memo(fn, cache) {
  if (cache === void 0) {
    cache = {};
  }

  return function (str) {
    return cache[str] || (cache[str] = fn(str));
  };
};

var props = memo(properties);

var name = function name(str) {
  return props(str).name;
};

var pc = function pc(str) {
  return props(str).pc;
};

var isMidiRange = function isMidiRange(m) {
  return m >= 0 && m <= 127;
};

var midi = function midi(note) {
  if (typeof note !== "number" && typeof note !== "string") {
    return null;
  }

  var midi = props(note).midi;
  var value = midi || midi === 0 ? midi : +note;
  return isMidiRange(value) ? value : null;
};

var midiToFreq = function midiToFreq(midi, tuning) {
  if (tuning === void 0) {
    tuning = 440;
  }

  return typeof midi === "number" ? Math.pow(2, (midi - 69) / 12) * tuning : null;
};

var freq = function freq(note) {
  return props(note).freq || midiToFreq(note);
};

var L2 = Math.log(2);
var L440 = Math.log(440);

var freqToMidi = function freqToMidi(freq) {
  var v = 12 * (Math.log(freq) - L440) / L2 + 69;
  return Math.round(v * 100) / 100;
};

var chroma = function chroma(str) {
  return props(str).chroma;
};

var oct = function oct(str) {
  return props(str).oct;
};

var LETTERS = "CDEFGAB";

var stepToLetter = function stepToLetter(step) {
  return LETTERS[step];
};

var fillStr = function fillStr(s, n) {
  return Array(n + 1).join(s);
};

var numToStr = function numToStr(num, op) {
  return typeof num !== "number" ? "" : op(num);
};

var altToAcc = function altToAcc(alt) {
  return numToStr(alt, function (alt) {
    return alt < 0 ? fillStr("b", -alt) : fillStr("#", alt);
  });
};

var from = function from(fromProps, baseNote) {
  if (fromProps === void 0) {
    fromProps = {};
  }

  if (baseNote === void 0) {
    baseNote = null;
  }

  var _a = baseNote ? Object.assign({}, props(baseNote), fromProps) : fromProps,
      step = _a.step,
      alt = _a.alt,
      oct = _a.oct;

  if (typeof step !== "number") return null;
  var letter = stepToLetter(step);
  if (!letter) return null;
  var pc = letter + altToAcc(alt);
  return oct || oct === 0 ? pc + oct : pc;
};

var build = from;

function fromMidi(num, sharps) {
  if (sharps === void 0) {
    sharps = false;
  }

  num = Math.round(num);
  var pcs = sharps === true ? SHARPS : FLATS;
  var pc = pcs[num % 12];
  var o = Math.floor(num / 12) - 1;
  return pc + o;
}

var simplify = function simplify(note, sameAcc) {
  if (sameAcc === void 0) {
    sameAcc = true;
  }

  var _a = props(note),
      alt = _a.alt,
      chroma = _a.chroma,
      midi = _a.midi;

  if (chroma === null) return null;
  var alteration = alt;
  var useSharps = sameAcc === false ? alteration < 0 : alteration > 0;
  return midi === null ? pc(fromMidi(chroma, useSharps)) : fromMidi(midi, useSharps);
};

var enharmonic = function enharmonic(note) {
  return simplify(note, false);
};

/**
 * [![npm version](https://img.shields.io/npm/v/tonal-array.svg?style=flat-square)](https://www.npmjs.com/package/tonal-array)
 *
 * Tonal array utilities. Create ranges, sort notes, ...
 *
 * @example
 * import * as Array;
 * Array.sort(["f", "a", "c"]) // => ["C", "F", "A"]
 *
 * @example
 * const Array = require("tonal-array")
 * Array.range(1, 4) // => [1, 2, 3, 4]
 *
 * @module Array
 */

function ascR(b, n) {
  for (var a = []; n--; a[n] = n + b) {
    ;
  }

  return a;
} // descending range


function descR(b, n) {
  for (var a = []; n--; a[n] = b - n) {
    ;
  }

  return a;
}
/**
 * Create a numeric range
 *
 * @param {Number} from
 * @param {Number} to
 * @return {Array}
 *
 * @example
 * Array.range(-2, 2) // => [-2, -1, 0, 1, 2]
 * Array.range(2, -2) // => [2, 1, 0, -1, -2]
 */


function range(a, b) {
  return a === null || b === null ? [] : a < b ? ascR(a, b - a + 1) : descR(a, a - b + 1);
}
/**
 *
 * Rotates a list a number of times. It"s completly agnostic about the
 * contents of the list.
 *
 * @param {Integer} times - the number of rotations
 * @param {Array} array
 * @return {Array} the rotated array
 * @example
 * Array.rotate(1, [1, 2, 3]) // => [2, 3, 1]
 */

function rotate(times, arr) {
  var len = arr.length;
  var n = (times % len + len) % len;
  return arr.slice(n, len).concat(arr.slice(0, n));
}
/**
 * Return a copy of the array with the null values removed
 * @function
 * @param {Array} array
 * @return {Array}
 *
 * @example
 * Array.compact(["a", "b", null, "c"]) // => ["a", "b", "c"]
 */

var compact = function compact(arr) {
  return arr.filter(function (n) {
    return n === 0 || n;
  });
}; // a function that get note heights (with negative number for pitch classes)

var height = function height(name) {
  var m = props(name).midi;
  return m !== null ? m : props(name + "-100").midi;
};
/**
 * Sort an array of notes in ascending order
 *
 * @param {String|Array} notes
 * @return {Array} sorted array of notes
 */


function sort(src) {
  return compact(src.map(name)).sort(function (a, b) {
    return height(a) > height(b);
  });
}
/**
 * Get sorted notes with duplicates removed
 *
 * @function
 * @param {Array} notes
 */

function unique(arr) {
  return sort(arr).filter(function (n, i, a) {
    return i === 0 || n !== a[i - 1];
  });
}
/**
 * Randomizes the order of the specified array in-place, using the Fisher–Yates shuffle.
 *
 * @private
 * @function
 * @param {Array|String} arr - the array
 * @return {Array} the shuffled array
 *
 * @example
 * Array.shuffle(["C", "D", "E", "F"])
 */

var shuffle = function shuffle(arr, rnd) {
  if (rnd === void 0) rnd = Math.random;
  var i, t;
  var m = arr.length;

  while (m) {
    i = rnd() * m-- | 0;
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }

  return arr;
};
/**
 * Get all permutations of an array
 * http://stackoverflow.com/questions/9960908/permutations-in-javascript
 *
 * @param {Array} array - the array
 * @return {Array<Array>} an array with all the permutations
 */

var permutations = function permutations(arr) {
  if (arr.length === 0) {
    return [[]];
  }

  return permutations(arr.slice(1)).reduce(function (acc, perm) {
    return acc.concat(arr.map(function (e, pos) {
      var newPerm = perm.slice();
      newPerm.splice(pos, 0, arr[0]);
      return newPerm;
    }));
  }, []);
};

var IVL_TNL = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})";
var IVL_STR = "(AA|A|P|M|m|d|dd)([-+]?\\d+)";
var REGEX$1 = new RegExp("^" + IVL_TNL + "|" + IVL_STR + "$");
var SIZES = [0, 2, 4, 5, 7, 9, 11];
var TYPES = "PMMPPMM";
var CLASSES = [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];
var NAMES$1 = "1P 2m 2M 3m 3M 4P 5P 6m 6M 7m 7M 8P".split(" ");

var names$1 = function names(types) {
  return typeof types !== "string" ? NAMES$1.slice() : NAMES$1.filter(function (n) {
    return types.indexOf(n[1]) !== -1;
  });
};

var tokenize$1 = function tokenize(str) {
  var m = REGEX$1.exec("" + str);
  if (m === null) return null;
  return m[1] ? [m[1], m[2]] : [m[4], m[3]];
};

var NO_IVL = Object.freeze({
  name: null,
  num: null,
  q: null,
  step: null,
  alt: null,
  dir: null,
  type: null,
  simple: null,
  semitones: null,
  chroma: null,
  oct: null
});

var fillStr$1 = function fillStr(s, n) {
  return Array(Math.abs(n) + 1).join(s);
};

var qToAlt = function qToAlt(type, q) {
  if (q === "M" && type === "M") return 0;
  if (q === "P" && type === "P") return 0;
  if (q === "m" && type === "M") return -1;
  if (/^A+$/.test(q)) return q.length;
  if (/^d+$/.test(q)) return type === "P" ? -q.length : -q.length - 1;
  return null;
};

var altToQ = function altToQ(type, alt) {
  if (alt === 0) return type === "M" ? "M" : "P";else if (alt === -1 && type === "M") return "m";else if (alt > 0) return fillStr$1("A", alt);else if (alt < 0) return fillStr$1("d", type === "P" ? alt : alt + 1);else return null;
};

var numToStep = function numToStep(num) {
  return (Math.abs(num) - 1) % 7;
};

var properties$1 = function properties(str) {
  var t = tokenize$1(str);
  if (t === null) return NO_IVL;
  var p = {
    num: 0,
    q: "d",
    name: "",
    type: "M",
    step: 0,
    dir: -1,
    simple: 1,
    alt: 0,
    oct: 0,
    semitones: 0,
    chroma: 0,
    ic: 0
  };
  p.num = +t[0];
  p.q = t[1];
  p.step = numToStep(p.num);
  p.type = TYPES[p.step];
  if (p.type === "M" && p.q === "P") return NO_IVL;
  p.name = "" + p.num + p.q;
  p.dir = p.num < 0 ? -1 : 1;
  p.simple = p.num === 8 || p.num === -8 ? p.num : p.dir * (p.step + 1);
  p.alt = qToAlt(p.type, p.q);
  p.oct = Math.floor((Math.abs(p.num) - 1) / 7);
  p.semitones = p.dir * (SIZES[p.step] + p.alt + 12 * p.oct);
  p.chroma = (p.dir * (SIZES[p.step] + p.alt) % 12 + 12) % 12;
  return Object.freeze(p);
};

var cache = {};

function props$1(str) {
  if (typeof str !== "string") return NO_IVL;
  return cache[str] || (cache[str] = properties$1(str));
}

var num = function num(str) {
  return props$1(str).num;
};

var name$1 = function name(str) {
  return props$1(str).name;
};

var semitones = function semitones(str) {
  return props$1(str).semitones;
};

var chroma$1 = function chroma(str) {
  return props$1(str).chroma;
};

var ic = function ic(ivl) {
  if (typeof ivl === "string") ivl = props$1(ivl).chroma;
  return typeof ivl === "number" ? CLASSES[ivl % 12] : null;
};

var build$1 = function build(_a) {
  var _b = _a === void 0 ? {} : _a,
      num = _b.num,
      step = _b.step,
      alt = _b.alt,
      _c = _b.oct,
      oct = _c === void 0 ? 1 : _c,
      dir = _b.dir;

  if (step !== undefined) num = step + 1 + 7 * oct;
  if (num === undefined) return null;
  if (typeof alt !== "number") return null;
  var d = typeof dir !== "number" ? "" : dir < 0 ? "-" : "";
  var type = TYPES[numToStep(num)];
  return d + num + altToQ(type, alt);
};

var simplify$1 = function simplify(str) {
  var p = props$1(str);
  if (p === NO_IVL) return null;
  var intervalProps = p;
  return intervalProps.simple + intervalProps.q;
};

var invert = function invert(str) {
  var p = props$1(str);
  if (p === NO_IVL) return null;
  var intervalProps = p;
  var step = (7 - intervalProps.step) % 7;
  var alt = intervalProps.type === "P" ? -intervalProps.alt : -(intervalProps.alt + 1);
  return build$1({
    step: step,
    alt: alt,
    oct: intervalProps.oct,
    dir: intervalProps.dir
  });
};

var IN = [1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7];
var IQ = "P m M m M P d P m M m M".split(" ");

var fromSemitones = function fromSemitones(num) {
  var d = num < 0 ? -1 : 1;
  var n = Math.abs(num);
  var c = n % 12;
  var o = Math.floor(n / 12);
  return d * (IN[c] + 7 * o) + IQ[c];
};

/**
 * [![npm version](https://img.shields.io/npm/v/tonal-distance.svg)](https://www.npmjs.com/package/tonal-distance)
 * [![tonal](https://img.shields.io/badge/tonal-distance-yellow.svg)](https://github.com/danigb/tonal/tree/master/packages/tonal/distance)
 *
 * Transpose notes by intervals and find distances between notes
 *
 * @example
 * // es6
 * import * as Distance from "tonal-distance"
 * Distance.interval("C3", "C4") // => "1P"
 *
 * @example
 * // es6 import selected functions
 * import { interval, semitones, transpose } from "tonal-distance"
 *
 * semitones("C" ,"D") // => 2
 * interval("C4", "G4") // => "5P"
 * transpose("C4", "P5") // => "G4"
 *
 * @example
 * // included in tonal facade
 * const Tonal = require("tonal");
 * Tonal.Distance.transpose("C4", "P5")
 * Tonal.Distance.transposeBy("P5", "C4")
 *
 * @module Distance
 */
// { C: 0, D: 2, E: 4, F: -1, G: 1, A: 3, B: 5 }

var FIFTHS = [0, 2, 4, -1, 1, 3, 5]; // Given a number of fifths, return the octaves they span

var fOcts = function fOcts(f) {
  return Math.floor(f * 7 / 12);
}; // Get the number of octaves it span each step


var FIFTH_OCTS = FIFTHS.map(fOcts);

var encode = function encode(ref) {
  var step = ref.step;
  var alt = ref.alt;
  var oct = ref.oct;
  var dir = ref.dir;
  if (dir === void 0) dir = 1;
  var f = FIFTHS[step] + 7 * alt;

  if (oct === null) {
    return [dir * f];
  }

  var o = oct - FIFTH_OCTS[step] - 4 * alt;
  return [dir * f, dir * o];
}; // We need to get the steps from fifths
// Fifths for CDEFGAB are [ 0, 2, 4, -1, 1, 3, 5 ]
// We add 1 to fifths to avoid negative numbers, so:
// for ["F", "C", "G", "D", "A", "E", "B"] we have:


var STEPS = [3, 0, 4, 1, 5, 2, 6]; // Return the number of fifths as if it were unaltered

function unaltered(f) {
  var i = (f + 1) % 7;
  return i < 0 ? 7 + i : i;
}

var decode = function decode(f, o, dir) {
  var step = STEPS[unaltered(f)];
  var alt = Math.floor((f + 1) / 7);

  if (o === undefined) {
    return {
      step: step,
      alt: alt,
      dir: dir
    };
  }

  var oct = o + 4 * alt + FIFTH_OCTS[step];
  return {
    step: step,
    alt: alt,
    oct: oct,
    dir: dir
  };
};

var memo$1 = function memo(fn, cache) {
  if (cache === void 0) cache = {};
  return function (str) {
    return cache[str] || (cache[str] = fn(str));
  };
};

var encoder = function encoder(props) {
  return memo$1(function (str) {
    var p = props(str);
    return p.name === null ? null : encode(p);
  });
};

var encodeNote = encoder(props);
var encodeIvl = encoder(props$1);
/**
 * Transpose a note by an interval. The note can be a pitch class.
 *
 * This function can be partially applied.
 *
 * @param {String} note
 * @param {String} interval
 * @return {String} the transposed note
 * @example
 * import { tranpose } from "tonal-distance"
 * transpose("d3", "3M") // => "F#3"
 * // it works with pitch classes
 * transpose("D", "3M") // => "F#"
 * // can be partially applied
 * ["C", "D", "E", "F", "G"].map(transpose("M3)) // => ["E", "F#", "G#", "A", "B"]
 */

function transpose(note, interval) {
  if (arguments.length === 1) {
    return function (i) {
      return transpose(note, i);
    };
  }

  var n = encodeNote(note);
  var i = encodeIvl(interval);

  if (n === null || i === null) {
    return null;
  }

  var tr = n.length === 1 ? [n[0] + i[0]] : [n[0] + i[0], n[1] + i[1]];
  return build(decode(tr[0], tr[1]));
}
/**
 * Transpose a pitch class by a number of perfect fifths.
 *
 * It can be partially applied.
 *
 * @function
 * @param {String} pitchClass - the pitch class
 * @param {Integer} fifhts - the number of fifths
 * @return {String} the transposed pitch class
 *
 * @example
 * import { trFifths } from "tonal-transpose"
 * [0, 1, 2, 3, 4].map(trFifths("C")) // => ["C", "G", "D", "A", "E"]
 * // or using tonal
 * Distance.trFifths("G4", 1) // => "D"
 */

function trFifths(note, fifths) {
  if (arguments.length === 1) {
    return function (f) {
      return trFifths(note, f);
    };
  }

  var n = encodeNote(note);

  if (n === null) {
    return null;
  }

  return build(decode(n[0] + fifths));
}
/**
 * Get the distance in fifths between pitch classes
 *
 * Can be partially applied.
 *
 * @param {String} to - note or pitch class
 * @param {String} from - note or pitch class
 */

function fifths(from, to) {
  if (arguments.length === 1) {
    return function (to) {
      return fifths(from, to);
    };
  }

  var f = encodeNote(from);
  var t = encodeNote(to);

  if (t === null || f === null) {
    return null;
  }

  return t[0] - f[0];
}
/**
 * The same as transpose with the arguments inverted.
 *
 * Can be partially applied.
 *
 * @param {String} note
 * @param {String} interval
 * @return {String} the transposed note
 * @example
 * import { tranposeBy } from "tonal-distance"
 * transposeBy("3m", "5P") // => "7m"
 */

function transposeBy(interval, note) {
  if (arguments.length === 1) {
    return function (n) {
      return transpose(n, interval);
    };
  }

  return transpose(note, interval);
}

var isDescending = function isDescending(e) {
  return e[0] * 7 + e[1] * 12 < 0;
};

var decodeIvl = function decodeIvl(i) {
  return isDescending(i) ? decode(-i[0], -i[1], -1) : decode(i[0], i[1], 1);
};

function addIntervals(ivl1, ivl2, dir) {
  var i1 = encodeIvl(ivl1);
  var i2 = encodeIvl(ivl2);

  if (i1 === null || i2 === null) {
    return null;
  }

  var i = [i1[0] + dir * i2[0], i1[1] + dir * i2[1]];
  return build$1(decodeIvl(i));
}
/**
 * Add two intervals
 *
 * Can be partially applied.
 *
 * @param {String} interval1
 * @param {String} interval2
 * @return {String} the resulting interval
 * @example
 * import { add } from "tonal-distance"
 * add("3m", "5P") // => "7m"
 */

function add(ivl1, ivl2) {
  if (arguments.length === 1) {
    return function (i2) {
      return add(ivl1, i2);
    };
  }

  return addIntervals(ivl1, ivl2, 1);
}
/**
 * Subtract two intervals
 *
 * Can be partially applied
 *
 * @param {String} minuend
 * @param {String} subtrahend
 * @return {String} interval diference
 */

function subtract(ivl1, ivl2) {
  if (arguments.length === 1) {
    return function (i2) {
      return add(ivl1, i2);
    };
  }

  return addIntervals(ivl1, ivl2, -1);
}
/**
 * Find the interval between two pitches. It works with pitch classes
 * (both must be pitch classes and the interval is always ascending)
 *
 * Can be partially applied
 *
 * @param {String} from - distance from
 * @param {String} to - distance to
 * @return {String} the interval distance
 *
 * @example
 * import { interval } from "tonal-distance"
 * interval("C2", "C3") // => "P8"
 * interval("G", "B") // => "M3"
 *
 * @example
 * import * as Distance from "tonal-distance"
 * Distance.interval("M2", "P5") // => "P4"
 */

function interval(from, to) {
  if (arguments.length === 1) {
    return function (t) {
      return interval(from, t);
    };
  }

  var f = encodeNote(from);
  var t = encodeNote(to);

  if (f === null || t === null || f.length !== t.length) {
    return null;
  }

  var d = f.length === 1 ? [t[0] - f[0], -Math.floor((t[0] - f[0]) * 7 / 12)] : [t[0] - f[0], t[1] - f[1]];
  return build$1(decodeIvl(d));
}
/**
 * Get the distance between two notes in semitones
 *
 * @param {String|Pitch} from - first note
 * @param {String|Pitch} to - last note
 * @return {Integer} the distance in semitones or null if not valid notes
 * @example
 * import { semitones } from "tonal-distance"
 * semitones("C3", "A2") // => -3
 * // or use tonal
 * Tonal.Distance.semitones("C3", "G3") // => 7
 */

function semitones$1(from, to) {
  if (arguments.length === 1) {
    return function (t) {
      return semitones$1(from, t);
    };
  }

  var f = props(from);
  var t = props(to);
  return f.midi !== null && t.midi !== null ? t.midi - f.midi : f.chroma !== null && t.chroma !== null ? (t.chroma - f.chroma + 12) % 12 : null;
}

var chromatic = [
	"1P 2m 2M 3m 3M 4P 4A 5P 6m 6M 7m 7M"
];
var lydian = [
	"1P 2M 3M 4A 5P 6M 7M"
];
var major = [
	"1P 2M 3M 4P 5P 6M 7M",
	[
		"ionian"
	]
];
var mixolydian = [
	"1P 2M 3M 4P 5P 6M 7m",
	[
		"dominant"
	]
];
var dorian = [
	"1P 2M 3m 4P 5P 6M 7m"
];
var aeolian = [
	"1P 2M 3m 4P 5P 6m 7m",
	[
		"minor"
	]
];
var phrygian = [
	"1P 2m 3m 4P 5P 6m 7m"
];
var locrian = [
	"1P 2m 3m 4P 5d 6m 7m"
];
var altered = [
	"1P 2m 3m 3M 5d 6m 7m",
	[
		"super locrian",
		"diminished whole tone",
		"pomeroy"
	]
];
var diminished = [
	"1P 2M 3m 4P 5d 6m 6M 7M",
	[
		"whole-half diminished"
	]
];
var iwato = [
	"1P 2m 4P 5d 7m"
];
var hirajoshi = [
	"1P 2M 3m 5P 6m"
];
var kumoijoshi = [
	"1P 2m 4P 5P 6m"
];
var pelog = [
	"1P 2m 3m 5P 6m"
];
var prometheus = [
	"1P 2M 3M 4A 6M 7m"
];
var ritusen = [
	"1P 2M 4P 5P 6M"
];
var scriabin = [
	"1P 2m 3M 5P 6M"
];
var piongio = [
	"1P 2M 4P 5P 6M 7m"
];
var augmented = [
	"1P 2A 3M 5P 5A 7M"
];
var neopolitan = [
	"1P 2m 3m 4P 5P 6m 7M"
];
var egyptian = [
	"1P 2M 4P 5P 7m"
];
var oriental = [
	"1P 2m 3M 4P 5d 6M 7m"
];
var flamenco = [
	"1P 2m 3m 3M 4A 5P 7m"
];
var balinese = [
	"1P 2m 3m 4P 5P 6m 7M"
];
var persian = [
	"1P 2m 3M 4P 5d 6m 7M"
];
var bebop = [
	"1P 2M 3M 4P 5P 6M 7m 7M"
];
var enigmatic = [
	"1P 2m 3M 5d 6m 7m 7M"
];
var ichikosucho = [
	"1P 2M 3M 4P 5d 5P 6M 7M"
];
var sdata = {
	chromatic: chromatic,
	lydian: lydian,
	major: major,
	mixolydian: mixolydian,
	dorian: dorian,
	aeolian: aeolian,
	phrygian: phrygian,
	locrian: locrian,
	"melodic minor": [
	"1P 2M 3m 4P 5P 6M 7M"
],
	"melodic minor second mode": [
	"1P 2m 3m 4P 5P 6M 7m"
],
	"lydian augmented": [
	"1P 2M 3M 4A 5A 6M 7M"
],
	"lydian dominant": [
	"1P 2M 3M 4A 5P 6M 7m",
	[
		"lydian b7"
	]
],
	"melodic minor fifth mode": [
	"1P 2M 3M 4P 5P 6m 7m",
	[
		"hindu",
		"mixolydian b6M"
	]
],
	"locrian #2": [
	"1P 2M 3m 4P 5d 6m 7m",
	[
		"half-diminished"
	]
],
	altered: altered,
	"harmonic minor": [
	"1P 2M 3m 4P 5P 6m 7M"
],
	"phrygian dominant": [
	"1P 2m 3M 4P 5P 6m 7m",
	[
		"spanish",
		"phrygian major"
	]
],
	"half-whole diminished": [
	"1P 2m 3m 3M 4A 5P 6M 7m",
	[
		"dominant diminished"
	]
],
	diminished: diminished,
	"major pentatonic": [
	"1P 2M 3M 5P 6M",
	[
		"pentatonic"
	]
],
	"lydian pentatonic": [
	"1P 3M 4A 5P 7M",
	[
		"chinese"
	]
],
	"mixolydian pentatonic": [
	"1P 3M 4P 5P 7m",
	[
		"indian"
	]
],
	"locrian pentatonic": [
	"1P 3m 4P 5d 7m",
	[
		"minor seven flat five pentatonic"
	]
],
	"minor pentatonic": [
	"1P 3m 4P 5P 7m"
],
	"minor six pentatonic": [
	"1P 3m 4P 5P 6M"
],
	"minor hexatonic": [
	"1P 2M 3m 4P 5P 7M"
],
	"flat three pentatonic": [
	"1P 2M 3m 5P 6M",
	[
		"kumoi"
	]
],
	"flat six pentatonic": [
	"1P 2M 3M 5P 6m"
],
	"major flat two pentatonic": [
	"1P 2m 3M 5P 6M"
],
	"whole tone pentatonic": [
	"1P 3M 5d 6m 7m"
],
	"ionian pentatonic": [
	"1P 3M 4P 5P 7M"
],
	"lydian #5P pentatonic": [
	"1P 3M 4A 5A 7M"
],
	"lydian dominant pentatonic": [
	"1P 3M 4A 5P 7m"
],
	"minor #7M pentatonic": [
	"1P 3m 4P 5P 7M"
],
	"super locrian pentatonic": [
	"1P 3m 4d 5d 7m"
],
	"in-sen": [
	"1P 2m 4P 5P 7m"
],
	iwato: iwato,
	hirajoshi: hirajoshi,
	kumoijoshi: kumoijoshi,
	pelog: pelog,
	"vietnamese 1": [
	"1P 3m 4P 5P 6m"
],
	"vietnamese 2": [
	"1P 3m 4P 5P 7m"
],
	prometheus: prometheus,
	"prometheus neopolitan": [
	"1P 2m 3M 4A 6M 7m"
],
	ritusen: ritusen,
	scriabin: scriabin,
	piongio: piongio,
	"major blues": [
	"1P 2M 3m 3M 5P 6M"
],
	"minor blues": [
	"1P 3m 4P 5d 5P 7m",
	[
		"blues"
	]
],
	"composite blues": [
	"1P 2M 3m 3M 4P 5d 5P 6M 7m"
],
	augmented: augmented,
	"augmented heptatonic": [
	"1P 2A 3M 4P 5P 5A 7M"
],
	"dorian #4": [
	"1P 2M 3m 4A 5P 6M 7m"
],
	"lydian diminished": [
	"1P 2M 3m 4A 5P 6M 7M"
],
	"whole tone": [
	"1P 2M 3M 4A 5A 7m"
],
	"leading whole tone": [
	"1P 2M 3M 4A 5A 7m 7M"
],
	"lydian minor": [
	"1P 2M 3M 4A 5P 6m 7m"
],
	"locrian major": [
	"1P 2M 3M 4P 5d 6m 7m",
	[
		"arabian"
	]
],
	neopolitan: neopolitan,
	"neopolitan minor": [
	"1P 2m 3m 4P 5P 6m 7M"
],
	"neopolitan major": [
	"1P 2m 3m 4P 5P 6M 7M",
	[
		"dorian b2"
	]
],
	"neopolitan major pentatonic": [
	"1P 3M 4P 5d 7m"
],
	"romanian minor": [
	"1P 2M 3m 5d 5P 6M 7m"
],
	"double harmonic lydian": [
	"1P 2m 3M 4A 5P 6m 7M"
],
	"harmonic major": [
	"1P 2M 3M 4P 5P 6m 7M"
],
	"double harmonic major": [
	"1P 2m 3M 4P 5P 6m 7M",
	[
		"gypsy"
	]
],
	egyptian: egyptian,
	"hungarian minor": [
	"1P 2M 3m 4A 5P 6m 7M"
],
	"hungarian major": [
	"1P 2A 3M 4A 5P 6M 7m"
],
	oriental: oriental,
	"spanish heptatonic": [
	"1P 2m 3m 3M 4P 5P 6m 7m"
],
	flamenco: flamenco,
	balinese: balinese,
	"todi raga": [
	"1P 2m 3m 4A 5P 6m 7M"
],
	"malkos raga": [
	"1P 3m 4P 6m 7m"
],
	"kafi raga": [
	"1P 3m 3M 4P 5P 6M 7m 7M"
],
	"purvi raga": [
	"1P 2m 3M 4P 4A 5P 6m 7M"
],
	persian: persian,
	bebop: bebop,
	"bebop dominant": [
	"1P 2M 3M 4P 5P 6M 7m 7M"
],
	"bebop minor": [
	"1P 2M 3m 3M 4P 5P 6M 7m"
],
	"bebop major": [
	"1P 2M 3M 4P 5P 5A 6M 7M"
],
	"bebop locrian": [
	"1P 2m 3m 4P 5d 5P 6m 7m"
],
	"minor bebop": [
	"1P 2M 3m 4P 5P 6m 7m 7M"
],
	"mystery #1": [
	"1P 2m 3M 5d 6m 7m"
],
	enigmatic: enigmatic,
	"minor six diminished": [
	"1P 2M 3m 4P 5P 6m 6M 7M"
],
	"ionian augmented": [
	"1P 2M 3M 4P 5A 6M 7M"
],
	"lydian #9": [
	"1P 2m 3M 4A 5P 6M 7M"
],
	ichikosucho: ichikosucho,
	"six tone symmetric": [
	"1P 2m 3M 4P 5A 6M"
]
};

var M = [
	"1P 3M 5P",
	[
		"Major",
		""
	]
];
var M13 = [
	"1P 3M 5P 7M 9M 13M",
	[
		"maj13",
		"Maj13"
	]
];
var M6 = [
	"1P 3M 5P 13M",
	[
		"6"
	]
];
var M69 = [
	"1P 3M 5P 6M 9M",
	[
		"69"
	]
];
var M7add13 = [
	"1P 3M 5P 6M 7M 9M"
];
var M7b5 = [
	"1P 3M 5d 7M"
];
var M7b6 = [
	"1P 3M 6m 7M"
];
var M7b9 = [
	"1P 3M 5P 7M 9m"
];
var M7sus4 = [
	"1P 4P 5P 7M"
];
var M9 = [
	"1P 3M 5P 7M 9M",
	[
		"maj9",
		"Maj9"
	]
];
var M9b5 = [
	"1P 3M 5d 7M 9M"
];
var M9sus4 = [
	"1P 4P 5P 7M 9M"
];
var Madd9 = [
	"1P 3M 5P 9M",
	[
		"2",
		"add9",
		"add2"
	]
];
var Maj7 = [
	"1P 3M 5P 7M",
	[
		"maj7",
		"M7"
	]
];
var Mb5 = [
	"1P 3M 5d"
];
var Mb6 = [
	"1P 3M 13m"
];
var Msus2 = [
	"1P 2M 5P",
	[
		"add9no3",
		"sus2"
	]
];
var Msus4 = [
	"1P 4P 5P",
	[
		"sus",
		"sus4"
	]
];
var Maddb9 = [
	"1P 3M 5P 9m"
];
var m = [
	"1P 3m 5P"
];
var m11 = [
	"1P 3m 5P 7m 9M 11P",
	[
		"_11"
	]
];
var m11b5 = [
	"1P 3m 7m 12d 2M 4P",
	[
		"h11",
		"_11b5"
	]
];
var m13 = [
	"1P 3m 5P 7m 9M 11P 13M",
	[
		"_13"
	]
];
var m6 = [
	"1P 3m 4P 5P 13M",
	[
		"_6"
	]
];
var m69 = [
	"1P 3m 5P 6M 9M",
	[
		"_69"
	]
];
var m7 = [
	"1P 3m 5P 7m",
	[
		"minor7",
		"_",
		"_7"
	]
];
var m7add11 = [
	"1P 3m 5P 7m 11P",
	[
		"m7add4"
	]
];
var m7b5 = [
	"1P 3m 5d 7m",
	[
		"half-diminished",
		"h7",
		"_7b5"
	]
];
var m9 = [
	"1P 3m 5P 7m 9M",
	[
		"_9"
	]
];
var m9b5 = [
	"1P 3m 7m 12d 2M",
	[
		"h9",
		"-9b5"
	]
];
var mMaj7 = [
	"1P 3m 5P 7M",
	[
		"mM7",
		"_M7"
	]
];
var mMaj7b6 = [
	"1P 3m 5P 6m 7M",
	[
		"mM7b6"
	]
];
var mM9 = [
	"1P 3m 5P 7M 9M",
	[
		"mMaj9",
		"-M9"
	]
];
var mM9b6 = [
	"1P 3m 5P 6m 7M 9M",
	[
		"mMaj9b6"
	]
];
var mb6M7 = [
	"1P 3m 6m 7M"
];
var mb6b9 = [
	"1P 3m 6m 9m"
];
var o = [
	"1P 3m 5d",
	[
		"mb5",
		"dim"
	]
];
var o7 = [
	"1P 3m 5d 13M",
	[
		"diminished",
		"m6b5",
		"dim7"
	]
];
var o7M7 = [
	"1P 3m 5d 6M 7M"
];
var oM7 = [
	"1P 3m 5d 7M"
];
var sus24 = [
	"1P 2M 4P 5P",
	[
		"sus4add9"
	]
];
var madd4 = [
	"1P 3m 4P 5P"
];
var madd9 = [
	"1P 3m 5P 9M"
];
var cdata = {
	"4": [
	"1P 4P 7m 10m",
	[
		"quartal"
	]
],
	"5": [
	"1P 5P"
],
	"7": [
	"1P 3M 5P 7m",
	[
		"Dominant",
		"Dom"
	]
],
	"9": [
	"1P 3M 5P 7m 9M",
	[
		"79"
	]
],
	"11": [
	"1P 5P 7m 9M 11P"
],
	"13": [
	"1P 3M 5P 7m 9M 13M",
	[
		"13_"
	]
],
	"64": [
	"5P 8P 10M"
],
	M: M,
	"M#5": [
	"1P 3M 5A",
	[
		"augmented",
		"maj#5",
		"Maj#5",
		"+",
		"aug"
	]
],
	"M#5add9": [
	"1P 3M 5A 9M",
	[
		"+add9"
	]
],
	M13: M13,
	"M13#11": [
	"1P 3M 5P 7M 9M 11A 13M",
	[
		"maj13#11",
		"Maj13#11",
		"M13+4",
		"M13#4"
	]
],
	M6: M6,
	"M6#11": [
	"1P 3M 5P 6M 11A",
	[
		"M6b5",
		"6#11",
		"6b5"
	]
],
	M69: M69,
	"M69#11": [
	"1P 3M 5P 6M 9M 11A"
],
	"M7#11": [
	"1P 3M 5P 7M 11A",
	[
		"maj7#11",
		"Maj7#11",
		"M7+4",
		"M7#4"
	]
],
	"M7#5": [
	"1P 3M 5A 7M",
	[
		"maj7#5",
		"Maj7#5",
		"maj9#5",
		"M7+"
	]
],
	"M7#5sus4": [
	"1P 4P 5A 7M"
],
	"M7#9#11": [
	"1P 3M 5P 7M 9A 11A"
],
	M7add13: M7add13,
	M7b5: M7b5,
	M7b6: M7b6,
	M7b9: M7b9,
	M7sus4: M7sus4,
	M9: M9,
	"M9#11": [
	"1P 3M 5P 7M 9M 11A",
	[
		"maj9#11",
		"Maj9#11",
		"M9+4",
		"M9#4"
	]
],
	"M9#5": [
	"1P 3M 5A 7M 9M",
	[
		"Maj9#5"
	]
],
	"M9#5sus4": [
	"1P 4P 5A 7M 9M"
],
	M9b5: M9b5,
	M9sus4: M9sus4,
	Madd9: Madd9,
	Maj7: Maj7,
	Mb5: Mb5,
	Mb6: Mb6,
	Msus2: Msus2,
	Msus4: Msus4,
	Maddb9: Maddb9,
	"11b9": [
	"1P 5P 7m 9m 11P"
],
	"13#11": [
	"1P 3M 5P 7m 9M 11A 13M",
	[
		"13+4",
		"13#4"
	]
],
	"13#9": [
	"1P 3M 5P 7m 9A 13M",
	[
		"13#9_"
	]
],
	"13#9#11": [
	"1P 3M 5P 7m 9A 11A 13M"
],
	"13b5": [
	"1P 3M 5d 6M 7m 9M"
],
	"13b9": [
	"1P 3M 5P 7m 9m 13M"
],
	"13b9#11": [
	"1P 3M 5P 7m 9m 11A 13M"
],
	"13no5": [
	"1P 3M 7m 9M 13M"
],
	"13sus4": [
	"1P 4P 5P 7m 9M 13M",
	[
		"13sus"
	]
],
	"69#11": [
	"1P 3M 5P 6M 9M 11A"
],
	"7#11": [
	"1P 3M 5P 7m 11A",
	[
		"7+4",
		"7#4",
		"7#11_",
		"7#4_"
	]
],
	"7#11b13": [
	"1P 3M 5P 7m 11A 13m",
	[
		"7b5b13"
	]
],
	"7#5": [
	"1P 3M 5A 7m",
	[
		"+7",
		"7aug",
		"aug7"
	]
],
	"7#5#9": [
	"1P 3M 5A 7m 9A",
	[
		"7alt",
		"7#5#9_",
		"7#9b13_"
	]
],
	"7#5b9": [
	"1P 3M 5A 7m 9m"
],
	"7#5b9#11": [
	"1P 3M 5A 7m 9m 11A"
],
	"7#5sus4": [
	"1P 4P 5A 7m"
],
	"7#9": [
	"1P 3M 5P 7m 9A",
	[
		"7#9_"
	]
],
	"7#9#11": [
	"1P 3M 5P 7m 9A 11A",
	[
		"7b5#9"
	]
],
	"7#9#11b13": [
	"1P 3M 5P 7m 9A 11A 13m"
],
	"7#9b13": [
	"1P 3M 5P 7m 9A 13m"
],
	"7add6": [
	"1P 3M 5P 7m 13M",
	[
		"67",
		"7add13"
	]
],
	"7b13": [
	"1P 3M 7m 13m"
],
	"7b5": [
	"1P 3M 5d 7m"
],
	"7b6": [
	"1P 3M 5P 6m 7m"
],
	"7b9": [
	"1P 3M 5P 7m 9m"
],
	"7b9#11": [
	"1P 3M 5P 7m 9m 11A",
	[
		"7b5b9"
	]
],
	"7b9#9": [
	"1P 3M 5P 7m 9m 9A"
],
	"7b9b13": [
	"1P 3M 5P 7m 9m 13m"
],
	"7b9b13#11": [
	"1P 3M 5P 7m 9m 11A 13m",
	[
		"7b9#11b13",
		"7b5b9b13"
	]
],
	"7no5": [
	"1P 3M 7m"
],
	"7sus4": [
	"1P 4P 5P 7m",
	[
		"7sus"
	]
],
	"7sus4b9": [
	"1P 4P 5P 7m 9m",
	[
		"susb9",
		"7susb9",
		"7b9sus",
		"7b9sus4",
		"phryg"
	]
],
	"7sus4b9b13": [
	"1P 4P 5P 7m 9m 13m",
	[
		"7b9b13sus4"
	]
],
	"9#11": [
	"1P 3M 5P 7m 9M 11A",
	[
		"9+4",
		"9#4",
		"9#11_",
		"9#4_"
	]
],
	"9#11b13": [
	"1P 3M 5P 7m 9M 11A 13m",
	[
		"9b5b13"
	]
],
	"9#5": [
	"1P 3M 5A 7m 9M",
	[
		"9+"
	]
],
	"9#5#11": [
	"1P 3M 5A 7m 9M 11A"
],
	"9b13": [
	"1P 3M 7m 9M 13m"
],
	"9b5": [
	"1P 3M 5d 7m 9M"
],
	"9no5": [
	"1P 3M 7m 9M"
],
	"9sus4": [
	"1P 4P 5P 7m 9M",
	[
		"9sus"
	]
],
	m: m,
	"m#5": [
	"1P 3m 5A",
	[
		"m+",
		"mb6"
	]
],
	m11: m11,
	"m11A 5": [
	"1P 3m 6m 7m 9M 11P"
],
	m11b5: m11b5,
	m13: m13,
	m6: m6,
	m69: m69,
	m7: m7,
	"m7#5": [
	"1P 3m 6m 7m"
],
	m7add11: m7add11,
	m7b5: m7b5,
	m9: m9,
	"m9#5": [
	"1P 3m 6m 7m 9M"
],
	m9b5: m9b5,
	mMaj7: mMaj7,
	mMaj7b6: mMaj7b6,
	mM9: mM9,
	mM9b6: mM9b6,
	mb6M7: mb6M7,
	mb6b9: mb6b9,
	o: o,
	o7: o7,
	o7M7: o7M7,
	oM7: oM7,
	sus24: sus24,
	"+add#9": [
	"1P 3M 5A 9A"
],
	madd4: madd4,
	madd9: madd9
};

/**
 * [![npm version](https://img.shields.io/npm/v/tonal-pcset.svg?style=flat-square)](https://www.npmjs.com/package/tonal-pcset)
 * [![tonal](https://img.shields.io/badge/tonal-pcset-yellow.svg?style=flat-square)](https://www.npmjs.com/browse/keyword/tonal)
 *
 * `tonal-pcset` is a collection of functions to work with pitch class sets, oriented
 * to make comparations (isEqual, isSubset, isSuperset)
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
 *
 * You can install via npm: `npm i --save tonal-pcset`
 *
 * ```js
 * // es6
 * import PcSet from "tonal-pcset"
 * var PcSet = require("tonal-pcset")
 *
 * PcSet.isEqual("c2 d5 e6", "c6 e3 d1") // => true
 * ```
 *
 * ## API documentation
 *
 * @module PcSet
 */

var chr = function chr(str) {
  return chroma(str) || chroma$1(str) || 0;
};

var pcsetNum = function pcsetNum(set) {
  return parseInt(chroma$2(set), 2);
};

var clen = function clen(chroma) {
  return chroma.replace(/0/g, "").length;
};
/**
 * Get chroma of a pitch class set. A chroma identifies each set uniquely.
 * It"s a 12-digit binary each presenting one semitone of the octave.
 *
 * Note that this function accepts a chroma as parameter and return it
 * without modification.
 *
 * @param {Array|String} set - the pitch class set
 * @return {String} a binary representation of the pitch class set
 * @example
 * PcSet.chroma(["C", "D", "E"]) // => "1010100000000"
 */


function chroma$2(set) {
  if (isChroma(set)) {
    return set;
  }

  if (!Array.isArray(set)) {
    return "";
  }

  var b = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  set.map(chr).forEach(function (i) {
    b[i] = 1;
  });
  return b.join("");
}
var all = null;
/**
 * Get a list of all possible chromas (all possible scales)
 * More information: http://allthescales.org/
 * @return {Array} an array of possible chromas from '10000000000' to '11111111111'
 *
 */

function chromas(n) {
  all = all || range(2048, 4095).map(function (n) {
    return n.toString(2);
  });
  return typeof n === "number" ? all.filter(function (chroma) {
    return clen(chroma) === n;
  }) : all.slice();
}
/**
 * Given a a list of notes or a pcset chroma, produce the rotations
 * of the chroma discarding the ones that starts with "0"
 *
 * This is used, for example, to get all the modes of a scale.
 *
 * @param {Array|String} set - the list of notes or pitchChr of the set
 * @param {Boolean} normalize - (Optional, true by default) remove all
 * the rotations that starts with "0"
 * @return {Array<String>} an array with all the modes of the chroma
 *
 * @example
 * PcSet.modes(["C", "D", "E"]).map(PcSet.intervals)
 */

function modes(set, normalize) {
  normalize = normalize !== false;
  var binary = chroma$2(set).split("");
  return compact(binary.map(function (_, i) {
    var r = rotate(i, binary);
    return normalize && r[0] === "0" ? null : r.join("");
  }));
}
var REGEX$2 = /^[01]{12}$/;
/**
 * Test if the given string is a pitch class set chroma.
 * @param {String} chroma - the pitch class set chroma
 * @return {Boolean} true if its a valid pcset chroma
 * @example
 * PcSet.isChroma("101010101010") // => true
 * PcSet.isChroma("101001") // => false
 */

function isChroma(set) {
  return REGEX$2.test(set);
}
var IVLS = "1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M".split(" ");
/**
 * Given a pcset (notes or chroma) return it"s intervals
 * @param {String|Array} pcset - the pitch class set (notes or chroma)
 * @return {Array} intervals or empty array if not valid pcset
 * @example
 * PcSet.intervals("1010100000000") => ["1P", "2M", "3M"]
 */

function intervals(set) {
  if (!isChroma(set)) {
    return [];
  }

  return compact(set.split("").map(function (d, i) {
    return d === "1" ? IVLS[i] : null;
  }));
}
/**
 * Test if two pitch class sets are identical
 *
 * @param {Array|String} set1 - one of the pitch class sets
 * @param {Array|String} set2 - the other pitch class set
 * @return {Boolean} true if they are equal
 * @example
 * PcSet.isEqual(["c2", "d3"], ["c5", "d2"]) // => true
 */

function isEqual(s1, s2) {
  if (arguments.length === 1) {
    return function (s) {
      return isEqual(s1, s);
    };
  }

  return chroma$2(s1) === chroma$2(s2);
}
/**
 * Create a function that test if a collection of notes is a
 * subset of a given set
 *
 * The function can be partially applied
 *
 * @param {Array|String} set - an array of notes or a chroma set string to test against
 * @param {Array|String} notes - an array of notes or a chroma set
 * @return {boolean} true if notes is a subset of set, false otherwise
 * @example
 * const inCMajor = PcSet.isSubsetOf(["C", "E", "G"])
 * inCMajor(["e6", "c4"]) // => true
 * inCMajor(["e6", "c4", "d3"]) // => false
 */

function isSubsetOf(set, notes) {
  if (arguments.length > 1) {
    return isSubsetOf(set)(notes);
  }

  set = pcsetNum(set);
  return function (notes) {
    notes = pcsetNum(notes);
    return notes !== set && (notes & set) === notes;
  };
}
/**
 * Create a function that test if a collectio of notes is a
 * superset of a given set (it contains all notes and at least one more)
 *
 * @param {Array|String} set - an array of notes or a chroma set string to test against
 * @param {Array|String} notes - an array of notes or a chroma set
 * @return {boolean} true if notes is a superset of set, false otherwise
 * @example
 * const extendsCMajor = PcSet.isSupersetOf(["C", "E", "G"])
 * extendsCMajor(["e6", "a", "c4", "g2"]) // => true
 * extendsCMajor(["c6", "e4", "g3"]) // => false
 */

function isSupersetOf(set, notes) {
  if (arguments.length > 1) {
    return isSupersetOf(set)(notes);
  }

  set = pcsetNum(set);
  return function (notes) {
    notes = pcsetNum(notes);
    return notes !== set && (notes | set) === notes;
  };
}
/**
 * Test if a given pitch class set includes a note
 * @param {Array|String} set - the base set to test against
 * @param {String|Pitch} note - the note to test
 * @return {Boolean} true if the note is included in the pcset
 * @example
 * PcSet.includes(["C", "D", "E"], "C4") // => true
 * PcSet.includes(["C", "D", "E"], "C#4") // => false
 */

function includes(set, note) {
  if (arguments.length > 1) {
    return includes(set)(note);
  }

  set = chroma$2(set);
  return function (note) {
    return set[chr(note)] === "1";
  };
}
/**
 * Filter a list with a pitch class set
 *
 * @param {Array|String} set - the pitch class set notes
 * @param {Array|String} notes - the note list to be filtered
 * @return {Array} the filtered notes
 *
 * @example
 * PcSet.filter(["C", "D", "E"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "d2", "c3", "d3" ])
 * PcSet.filter(["C2"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "c3" ])
 */

function filter(set, notes) {
  if (arguments.length === 1) {
    return function (n) {
      return filter(set, n);
    };
  }

  return notes.filter(includes(set));
}

/**
 * [![npm version](https://img.shields.io/npm/v/tonal-dictionary.svg)](https://www.npmjs.com/package/tonal-dictionary)
 *
 * `tonal-dictionary` contains a dictionary of musical scales and chords
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
 *
 * @example
 * // es6
 * import * as Dictionary from "tonal-dictionary"
 * // es5
 * const Dictionary = require("tonal-dictionary")
 *
 * @example
 * Dictionary.chord("Maj7") // => ["1P", "3M", "5P", "7M"]
 *
 * @module Dictionary
 */
var dictionary = function dictionary(raw) {
  var keys = Object.keys(raw).sort();
  var data = [];
  var index = [];

  var add = function add(name, ivls, chroma) {
    data[name] = ivls;
    index[chroma] = index[chroma] || [];
    index[chroma].push(name);
  };

  keys.forEach(function (key) {
    var ivls = raw[key][0].split(" ");
    var alias = raw[key][1];
    var chr = chroma$2(ivls);
    add(key, ivls, chr);

    if (alias) {
      alias.forEach(function (a) {
        return add(a, ivls, chr);
      });
    }
  });
  var allKeys = Object.keys(data).sort();

  var dict = function dict(name) {
    return data[name];
  };

  dict.names = function (p) {
    if (typeof p === "string") {
      return (index[p] || []).slice();
    } else {
      return (p === true ? allKeys : keys).slice();
    }
  };

  return dict;
};
var combine = function combine(a, b) {
  var dict = function dict(name) {
    return a(name) || b(name);
  };

  dict.names = function (p) {
    return a.names(p).concat(b.names(p));
  };

  return dict;
};
/**
 * A dictionary of scales: a function that given a scale name (without tonic)
 * returns an array of intervals
 *
 * @function
 * @param {String} name
 * @return {Array} intervals
 * @example
 * import { scale } from "tonal-dictionary"
 * scale("major") // => ["1P", "2M", ...]
 * scale.names(); // => ["major", ...]
 */

var scale = dictionary(sdata);
/**
 * A dictionary of chords: a function that given a chord type
 * returns an array of intervals
 *
 * @function
 * @param {String} type
 * @return {Array} intervals
 * @example
 * import { chord } from "tonal-dictionary"
 * chord("Maj7") // => ["1P", "3M", ...]
 * chord.names(); // => ["Maj3", ...]
 */

var chord = dictionary(cdata);
var pcset = combine(scale, chord);

/**
 * [![npm version](https://img.shields.io/npm/v/tonal-scale.svg?style=flat-square)](https://www.npmjs.com/package/tonal-scale)
 *
 * A scale is a collection of pitches in ascending or descending order.
 *
 * This module provides functions to get and manipulate scales.
 *
 * @example
 * // es6
 * import * as Scale from "tonal-scale"
 * // es5
 * const Scale = require("tonal-scale");
 *
 * @example
 * Scale.notes("Ab bebop") // => [ "Ab", "Bb", "C", "Db", "Eb", "F", "Gb", "G" ]
 * Scale.names() => ["major", "minor", ...]
 * @module Scale
 */
var NO_SCALE = Object.freeze({
  name: null,
  intervals: [],
  names: [],
  chroma: null,
  setnum: null
});

var properties$2 = function properties(name) {
  var intervals = scale(name);

  if (!intervals) {
    return NO_SCALE;
  }

  var s = {
    intervals: intervals,
    name: name
  };
  s.chroma = chroma$2(intervals);
  s.setnum = parseInt(s.chroma, 2);
  s.names = scale.names(s.chroma);
  return Object.freeze(s);
};

var memoize = function memoize(fn, cache) {
  return function (str) {
    return cache[str] || (cache[str] = fn(str));
  };
};
/**
 * Get scale properties. It returns an object with:
 * - name: the scale name
 * - names: a list with all possible names (includes the current)
 * - intervals: an array with the scale intervals
 * - chroma:  scale croma (see pcset)
 * - setnum: scale chroma number
 *
 * @function
 * @param {string} name - the scale name (without tonic)
 * @return {Object}
 */


var props$2 = memoize(properties$2, {});
/**
 * Return the available scale names
 *
 * @function
 * @param {boolean} [aliases=false] - true to include aliases
 * @return {Array} the scale names
 *
 * @example
 * Scale.names() // => ["maj7", ...]
 */

var names$2 = scale.names;
/**
 * Given a scale name, return its intervals. The name can be the type and
 * optionally the tonic (which is ignored)
 *
 * It retruns an empty array when no scale found
 *
 * @function
 * @param {string} name - the scale name (tonic and type, tonic is optional)
 * @return {Array<string>} the scale intervals if is a known scale or an empty
 * array if no scale found
 * @example
 * Scale.intervals("major") // => [ "1P", "2M", "3M", "4P", "5P", "6M", "7M" ]
 */

var intervals$1 = function intervals(name) {
  var p = tokenize$2(name);
  return props$2(p[1]).intervals;
};
/**
 * Get the notes (pitch classes) of a scale.
 *
 * Note that it always returns an array, and the values are only pitch classes.
 *
 * @function
 * @param {string} tonic
 * @param {string} nameOrTonic - the scale name or tonic (if 2nd param)
 * @param {string} [name] - the scale name without tonic
 * @return {Array} a pitch classes array
 *
 * @example
 * Scale.notes("C", "major") // => [ "C", "D", "E", "F", "G", "A", "B" ]
 * Scale.notes("C major") // => [ "C", "D", "E", "F", "G", "A", "B" ]
 * Scale.notes("C4", "major") // => [ "C", "D", "E", "F", "G", "A", "B" ]
 * Scale.notes("A4", "no-scale") // => []
 * Scale.notes("blah", "major") // => []
 */

function notes(nameOrTonic, name) {
  var p = tokenize$2(nameOrTonic);
  name = name || p[1];
  return intervals$1(name).map(transpose(p[0]));
}
/**
 * Check if the given name is a known scale from the scales dictionary
 *
 * @function
 * @param {string} name - the scale name
 * @return {Boolean}
 */

function exists(name) {
  var p = tokenize$2(name);
  return scale(p[1]) !== undefined;
}
/**
 * Given a string with a scale name and (optionally) a tonic, split
 * that components.
 *
 * It retuns an array with the form [ name, tonic ] where tonic can be a
 * note name or null and name can be any arbitrary string
 * (this function doesn"t check if that scale name exists)
 *
 * @function
 * @param {string} name - the scale name
 * @return {Array} an array [tonic, name]
 * @example
 * Scale.tokenize("C mixolydean") // => ["C", "mixolydean"]
 * Scale.tokenize("anything is valid") // => ["", "anything is valid"]
 * Scale.tokenize() // => ["", ""]
 */

function tokenize$2(str) {
  if (typeof str !== "string") {
    return ["", ""];
  }

  var i = str.indexOf(" ");
  var tonic = name(str.substring(0, i)) || name(str) || "";
  var name$1 = tonic !== "" ? str.substring(tonic.length + 1) : str;
  return [tonic, name$1.length ? name$1 : ""];
}
/**
 * Find mode names of a scale
 *
 * @function
 * @param {string} name - scale name
 * @example
 * Scale.modeNames("C pentatonic") // => [
 *   ["C", "major pentatonic"],
 *   ["D", "egyptian"],
 *   ["E", "malkos raga"],
 *   ["G", "ritusen"],
 *   ["A", "minor pentatonic"]
 * ]
 */

var modeNames = function modeNames(name) {
  var ivls = intervals$1(name);
  var tonics = notes(name);
  return modes(ivls).map(function (chroma, i) {
    var name = scale.names(chroma)[0];

    if (name) {
      return [tonics[i] || ivls[i], name];
    }
  }).filter(function (x) {
    return x;
  });
};
/**
 * Get all chords that fits a given scale
 *
 * @function
 * @param {string} name - the scale name
 * @return {Array<string>} - the chord names
 *
 * @example
 * Scale.chords("pentatonic") // => ["5", "64", "M", "M6", "Madd9", "Msus2"]
 */

var chords = function chords(name) {
  var inScale = isSubsetOf(intervals$1(name));
  return chord.names().filter(function (name) {
    return inScale(chord(name));
  });
};
/**
 * Given an array of notes, return the scale: a pitch class set starting from
 * the first note of the array
 *
 * @function
 * @param {Array} notes
 * @return {Array}
 * @example
 * Scale.toScale(['C4', 'c3', 'C5', 'C4', 'c4']) // => ["C"]
 * Scale.toScale(['D4', 'c#5', 'A5', 'F#6']) // => ["D", "F#", "A", "C#"]
 */

var toScale = function toScale(notes) {
  var pcset = compact(notes.map(pc));

  if (!pcset.length) {
    return pcset;
  }

  var tonic = pcset[0];
  var scale = unique(pcset);
  return rotate(scale.indexOf(tonic), scale);
};
/**
 * Get all scales names that are a superset of the given one
 * (has the same notes and at least one more)
 *
 * @function
 * @param {string} name
 * @return {Array} a list of scale names
 * @example
 * Scale.supersets("major") // => ["bebop", "bebop dominant", "bebop major", "chromatic", "ichikosucho"]
 */

var supersets = function supersets(name) {
  if (!intervals$1(name).length) {
    return [];
  }

  var isSuperset = isSupersetOf(intervals$1(name));
  return scale.names().filter(function (name) {
    return isSuperset(scale(name));
  });
};
/**
 * Find all scales names that are a subset of the given one
 * (has less notes but all from the given scale)
 *
 * @function
 * @param {string} name
 * @return {Array} a list of scale names
 *
 * @example
 * Scale.subsets("major") // => ["ionian pentatonic", "major pentatonic", "ritusen"]
 */

var subsets = function subsets(name) {
  var isSubset = isSubsetOf(intervals$1(name));
  return scale.names().filter(function (name) {
    return isSubset(scale(name));
  });
};

/**
 * [![npm version](https://img.shields.io/npm/v/tonal-chord.svg)](https://www.npmjs.com/package/tonal-chord)
 * [![tonal](https://img.shields.io/badge/tonal-chord-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)
 *
 * `tonal-chord` is a collection of functions to manipulate musical chords
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
 *
 * @example
 * // es6
 * import * as Chord from "tonal-chord"
 * // es5
 * const Chord = require("tonal-chord")
 *
 * @example
 * Chord.notes("CMaj7") // => ["C", "E", "G", "B"]
 *
 * @module Chord
 */
/**
 * Return the available chord names
 *
 * @function
 * @param {boolean} aliases - true to include aliases
 * @return {Array} the chord names
 *
 * @example
 * Chord.names() // => ["maj7", ...]
 */

var names$3 = chord.names;
var NO_CHORD = Object.freeze({
  name: null,
  names: [],
  intervals: [],
  chroma: null,
  setnum: null
});

var properties$3 = function properties(name) {
  var intervals = chord(name);

  if (!intervals) {
    return NO_CHORD;
  }

  var s = {
    intervals: intervals,
    name: name
  };
  s.chroma = chroma$2(intervals);
  s.setnum = parseInt(s.chroma, 2);
  s.names = chord.names(s.chroma);
  return s;
};

var memo$2 = function memo(fn, cache) {
  if (cache === void 0) cache = {};
  return function (str) {
    return cache[str] || (cache[str] = fn(str));
  };
};
/**
 * Get chord properties. It returns an object with:
 *
 * - name: the chord name
 * - names: a list with all possible names (includes the current)
 * - intervals: an array with the chord intervals
 * - chroma:  chord croma (see pcset)
 * - setnum: chord chroma number
 *
 * @function
 * @param {String} name - the chord name (without tonic)
 * @return {Object} an object with the properties or a object with all properties
 * set to null if not valid chord name
 */


var props$3 = memo$2(properties$3);
/**
 * Get chord intervals. It always returns an array
 *
 * @function
 * @param {String} name - the chord name (optionally a tonic and type)
 * @return {Array<String>} a list of intervals or null if the type is not known
 */

var intervals$2 = function intervals(name) {
  return props$3(tokenize$3(name)[1]).intervals;
};
/**
 * Get the chord notes of a chord. This function accepts either a chord name
 * (for example: "Cmaj7") or a list of notes.
 *
 * It always returns an array, even if the chord is not found.
 *
 * @function
 * @param {String} nameOrTonic - name of the chord or the tonic (if the second parameter is present)
 * @param {String} [name] - (Optional) name if the first parameter is the tonic
 * @return {Array} an array of notes or an empty array
 *
 * @example
 * Chord.notes("Cmaj7") // => ["C", "E", "G", "B"]
 * Chord.notes("C", "maj7") // => ["C", "E", "G", "B"]
 */

function notes$1(nameOrTonic, name) {
  if (name) {
    return props$3(name).intervals.map(transpose(nameOrTonic));
  }

  var ref = tokenize$3(nameOrTonic);
  var tonic = ref[0];
  var type = ref[1];
  return props$3(type).intervals.map(transpose(tonic));
}
/**
 * Check if a given name correspond to a chord in the dictionary
 *
 * @function
 * @param {String} name
 * @return {Boolean}
 * @example
 * Chord.exists("CMaj7") // => true
 * Chord.exists("Maj7") // => true
 * Chord.exists("Ablah") // => false
 */

var exists$1 = function exists(name) {
  return chord(tokenize$3(name)[1]) !== undefined;
};
/**
 * Get all chords names that are a superset of the given one
 * (has the same notes and at least one more)
 *
 * @function
 * @param {String} name
 * @return {Array} a list of chord names
 */

var supersets$1 = function supersets(name) {
  if (!intervals$2(name).length) {
    return [];
  }

  var isSuperset = isSupersetOf(intervals$2(name));
  return chord.names().filter(function (name) {
    return isSuperset(chord(name));
  });
};
/**
 * Find all chords names that are a subset of the given one
 * (has less notes but all from the given chord)
 *
 * @function
 * @param {String} name
 * @return {Array} a list of chord names
 */

var subsets$1 = function subsets(name) {
  var isSubset = isSubsetOf(intervals$2(name));
  return chord.names().filter(function (name) {
    return isSubset(chord(name));
  });
}; // 6, 64, 7, 9, 11 and 13 are consider part of the chord
// (see https://github.com/danigb/tonal/issues/55)

var NUM_TYPES = /^(6|64|7|9|11|13)$/;
/**
 * Tokenize a chord name. It returns an array with the tonic and chord type
 * If not tonic is found, all the name is considered the chord name.
 *
 * This function does NOT check if the chord type exists or not. It only tries
 * to split the tonic and chord type.
 *
 * @function
 * @param {String} name - the chord name
 * @return {Array} an array with [tonic, type]
 * @example
 * Chord.tokenize("Cmaj7") // => [ "C", "maj7" ]
 * Chord.tokenize("C7") // => [ "C", "7" ]
 * Chord.tokenize("mMaj7") // => [ "", "mMaj7" ]
 * Chord.tokenize("Cnonsense") // => [ "C", "nonsense" ]
 */

function tokenize$3(name) {
  var p = tokenize(name);

  if (p[0] === "") {
    return ["", name];
  } // aug is augmented (see https://github.com/danigb/tonal/issues/55)


  if (p[0] === "A" && p[3] === "ug") {
    return ["", "aug"];
  }

  if (NUM_TYPES.test(p[2])) {
    return [p[0] + p[1], p[2] + p[3]];
  } else {
    return [p[0] + p[1] + p[2], p[3]];
  }
}

/**
 * [![npm version](https://img.shields.io/npm/v/tonal-key.svg?style=flat-square)](https://www.npmjs.com/package/tonal-key)
 *
 * The `Tonal` module is a facade to the rest of the modules. They are namespaced,
 * so for example to use `pc` function from `tonal-note` you have to write:
 * `Tonal.Note.pc`
 *
 * It exports the following modules:
 * - Note
 * - Interval
 * - Distance
 * - Scale
 * - Chord
 * - PcSet
 *
 * Additionally this facade exports some functions without namespace (see "Methods" below)
 *
 * @example
 * // es6 modules
 * import * as Tonal from "tonal"
 * Tonal.Note.name("cx") // => "C##"
 *
 * @example
 * import { Note } from "tonal"
 * Note.name("bb") // => "Bb"
 *
 * @example
 * // es5 node modules
 * var Tonal = require("tonal");
 * Tonal.Distance.transpose(Tonal.Note.pc("C#2"), "M3") // => "E#"
 * Tonal.Chord.notes("Dmaj7") // => ["D", "F#", "A", "C#"]
 *
 * @module Tonal
 */
/**
 * Transpose a note by an interval
 * @function
 * @param {string} note
 * @param {string} interval
 * @return {string} the transported note
 * @see Distance.transpose
 */

var transpose$1 = transpose;
/**
 * Get the interval from two notes
 * @function
 * @param {string} from
 * @param {string} to
 * @return {string} the interval in reverse shorthand notation
 * @see Distance.interval
 */

var interval$1 = interval;
/**
 * Get note properties
 * @function
 * @param {string} note - the note name
 * @return {Object}
 * @see Note.props
 * @example
 * Tonal.note("A4").chroma // => 9
 */

var note = props;
/**
 * Get midi note number
 * @function
 * @param {string} note
 * @return {Number}
 * @see Note.midi
 * @example
 * Tonal.midi("A4") // => 49
 */

var midi$1 = midi;
/**
 * Get note frequency using equal tempered tuning at 440
 * @function
 * @param {string} note
 * @return {Number}
 * @see Note.freq
 * @example
 * Tonal.freq("A4") // => 440
 */

var freq$1 = freq;
/**
 * Get intervals from a chord type
 * @function
 * @param {string} type - the chord type (no tonic)
 * @return {Array} an array of intervals or undefined if the chord type is not known
 * @see Dictionary.chord
 * @example
 * Tonal.chord("m7b5") // => ["1P", "3m", "5d", "7m"]
 */

var chord$1 = chord;
/**
 * Get intervals from scale name
 * @function
 * @param {string} name - the scale name (without tonic)
 * @return {Array} an array of intervals or undefiend if the scale is not kown
 * @example
 * Tonal.scale("major") // => ["1P", "2M", "3M"...]
 */

var scale$1 = scale;

var log = function log() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  post("".concat(args.join(", "), "\n"));
};

var bang = function bang() {
  post(midi$1("c4"));
};

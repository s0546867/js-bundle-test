
/**
 * This file has been auto-generated using in order to prepare external projects using NPM dependencies etc
 * in the [js] and [jsui] object in Max MSP. Any manual changes might be overwritten when regenerating this
 * file. In case you'd like to learn more, report issues etc - pleaser refer to the Project on GitHub
 *
 * https://github.com/fde31/n4m_transpile_js
 *
 */
var log = function log() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  post("".concat(args.join(", "), "\n"));
};

var bang = function bang() {
  post(tonal.midi("c4"));
};

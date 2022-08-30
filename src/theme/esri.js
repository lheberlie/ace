exports.isDark = false;
exports.cssClass = "ace-esri";
exports.cssText = require("./esri.css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);

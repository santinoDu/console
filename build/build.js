/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	__webpack_require__(1);

	var _index = __webpack_require__(5);

	var _index2 = _interopRequireDefault(_index);

	var _dom = __webpack_require__(6);

	var _dom2 = _interopRequireDefault(_dom);

	var _drag = __webpack_require__(7);

	var _drag2 = _interopRequireDefault(_drag);

	var _xhr = __webpack_require__(8);

	var _xhr2 = _interopRequireDefault(_xhr);

	var _fetch = __webpack_require__(9);

	var _fetch2 = _interopRequireDefault(_fetch);

	var _type = __webpack_require__(10);

	var _type2 = _interopRequireDefault(_type);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var logBoxSelector = '.-c-content';
	var switchBtnSelector = '.-c-switch';
	var toolBarSelector = '.-c-toolbar';
	var clearClass = '-c-clear';
	var hideClass = '-c-hide';
	var ajaxClass = '-c-ajax';
	var logItemClass = '-c-log';
	var consoleMethods = ['debug', 'error', 'info', 'log', 'warn'];

	var Console = function () {
	    function Console() {
	        _classCallCheck(this, Console);

	        this.render();
	        this.prepareProperty();
	        this.bindEvent();
	        this.catchAjax();
	        this.core();
	    }

	    _createClass(Console, [{
	        key: 'render',
	        value: function render() {
	            var ele = _dom2.default.createElement('div', null, _index2.default);
	            _dom2.default.append(_dom2.default.$('body'), ele);
	        }
	    }, {
	        key: 'prepareProperty',
	        value: function prepareProperty() {
	            this.ajaxEnable = false;
	            this.switchBtn = _dom2.default.$(switchBtnSelector);
	            // 设置 Switch Button 初始位置, 并使其可以 Drag
	            this.switchBtn.style.left = document.documentElement.clientWidth - this.switchBtn.offsetWidth - 10 + "px";
	            this.switchBtn.style.top = document.documentElement.clientHeight - this.switchBtn.offsetHeight - 10 + "px";
	            (0, _drag2.default)(this.switchBtn);
	            this.toolBar = _dom2.default.$(toolBarSelector);
	            this.logBox = _dom2.default.$(logBoxSelector);
	        }
	    }, {
	        key: 'bindEvent',
	        value: function bindEvent() {
	            var _this2 = this;

	            this.toolBar.addEventListener('click', function (e) {
	                var target = e.target;
	                if (target.classList.contains(clearClass)) {
	                    _dom2.default.html(_this2.logBox, '');
	                } else if (target.classList.contains(hideClass)) {
	                    _dom2.default.hide(_this2.logBox, _this2.toolBar).show(_this2.switchBtn);
	                }
	                if (target.classList.contains(ajaxClass)) {
	                    _this2.ajaxEnable = !_this2.ajaxEnable;
	                    if (_this2.ajaxEnable) {
	                        target.innerText = 'AJAX(ON)';
	                    } else {
	                        target.innerText = 'AJAX(OFF)';
	                    }
	                }
	            });

	            this.switchBtn.addEventListener('click', function () {
	                _dom2.default.hide(_this2.switchBtn).show(_this2.logBox, _this2.toolBar);
	            });

	            // 捕获页面错误
	            var _onerror = window.onerror || function noop() {};

	            window.onerror = function (msg, url, lineNo, columnNo, error) {
	                _onerror();
	                var message = ['Message: ' + msg, 'URL: ' + url, 'Line: ' + lineNo, 'Column: ' + columnNo, 'Error object: ' + error].join(' <br/> ');

	                _this2.pushLog([message], 'Exception');
	            };
	        }
	    }, {
	        key: 'catchAjax',
	        value: function catchAjax() {
	            // 捕获 xhr 错误
	            // TODO 添加 REQUEST BODY 和 RESPONSE DATA
	            var _this = this;
	            _xhr2.default.fn = function (xhr) {
	                if (!_this.ajaxEnable) return;
	                if (xhr.readyState === XMLHttpRequest.DONE) {
	                    if (xhr.status >= 200 && xhr.status <= 299) {
	                        _this.pushLog(['[AJAX] ' + xhr.open_fn_parmas.method + ' ' + xhr.open_fn_parmas.url + ' ' + xhr.status + ' (' + xhr.statusText + ')'], 'AJAXSUCCESS');
	                        xhr.send_fn_params.data && _this.pushLog(['[REQUEST BODY] ' + xhr.send_fn_params.data], 'AJAXSUCCESS');
	                        xhr.responseText && _this.pushLog(['[RESPONSE DATA] ' + xhr.responseText], 'AJAXSUCCESS');
	                    } else {
	                        _this.pushLog(['[AJAX] ' + xhr.open_fn_parmas.method + ' ' + xhr.open_fn_parmas.url + ' ' + xhr.status + ' (' + xhr.statusText + ')'], 'AJAXFAILURE');
	                        xhr.send_fn_params.data && _this.pushLog(['[REQUEST BODY] ' + xhr.send_fn_params.data], 'AJAXFAILURE');
	                        xhr.responseText && _this.pushLog(['[RESPONSE DATA] ' + xhr.responseText], 'AJAXFAILURE');
	                    }
	                }
	            };

	            window.XMLHttpRequest = _xhr2.default;
	            // 捕获 fetch 错误
	            var unregister = _fetch2.default.register({
	                response: function response(_ref) {
	                    var request = _ref.request,
	                        _response = _ref.response;

	                    if (_this.ajaxEnable) {
	                        if (_response.status >= 200 && _response.status <= 299) {
	                            _this.pushFetchLog(request, _response, 'AJAXSUCCESS');
	                        } else {
	                            _this.pushFetchLog(request, _response, 'AJAXFAILURE');
	                        }
	                    }
	                    return _response;
	                },
	                responseError: function responseError(_ref2) {
	                    var request = _ref2.request,
	                        _responseError = _ref2.responseError;

	                    // TODO 待确定
	                    if (_this.ajaxEnable) {
	                        _this.pushLog(['[AJAX] ' + request.method + ' ' + request.url + ' ' + _responseError.status + ' (' + _responseError.statusText + ')'], 'AJAXFAILURE');
	                    }
	                    return Promise.reject(_responseError);
	                }
	            });
	        }
	    }, {
	        key: 'pushFetchLog',
	        value: function pushFetchLog(request, response, type) {
	            var _this3 = this;

	            try {
	                request = request.clone();
	                response = response.clone();
	                Promise.all([request.text(), response.text()]).then(function (data) {
	                    _this3.pushLog(['[AJAX] ' + request.method + ' ' + request.url + ' ' + response.status + ' (' + response.statusText + ')'], type);
	                    data[0] && _this3.pushLog(['[REQUEST BODY] ' + data[0]], type);
	                    data[1] && _this3.pushLog(['[RESPONSE DATA] ' + data[1]], type);
	                }).catch(function (err) {
	                    _this3.pushLog(['[AJAX] ' + request.method + ' ' + request.url + ' ' + response.status + ' (' + response.statusText + ')'], type);
	                });
	            } catch (err) {
	                this.pushLog(['[AJAX] ' + request.method + ' ' + request.url + ' ' + response.status + ' (' + response.statusText + ')'], type);
	            }
	        }
	    }, {
	        key: 'pushLog',
	        value: function pushLog(msg, type) {
	            var text = msg.map(function (val) {
	                return (0, _type2.default)(val) ? '' + val.stack : JSON.stringify(val);
	            }).join(' '),
	                log = _dom2.default.createElement('div', { class: logItemClass + ' ' + type }, text);
	            _dom2.default.append(this.logBox, log);
	            this.logBox.scrollTop = this.logBox.scrollHeight;
	        }
	    }, {
	        key: 'core',
	        value: function core() {
	            var _this4 = this;

	            consoleMethods.forEach(function (method) {
	                var original = window.console[method];
	                window.console[method] = function () {
	                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	                        args[_key] = arguments[_key];
	                    }

	                    _this4.pushLog(args, method);
	                    original.apply(console, args);
	                };
	            });
	        }
	    }]);

	    return Console;
	}();

	exports.default = Console;


	window.MobileConsole = Console;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../node_modules/css-loader/index.js!./style.css", function() {
				var newContent = require("!!../../node_modules/css-loader/index.js!./style.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "#__console{\n    position: relative;\n    z-index: 2147483647;\n}\n\n#__console .debug {\n    color: #465ed1;\n}\n\n#__console .error {\n    color: #465ed1;\n    background: #ffe6e3;\n}\n\n#__console .Exception {\n    color: #d10a0d;\n    background: #ffe6e3;\n}\n\n#__console .AJAXSUCCESS {\n    color: #20d10d;\n    background: #ddffc8;\n}\n\n#__console .AJAXFAILURE {\n    color: #d10a0d;\n    background: #ffe6e3;\n}\n\n#__console .info {\n    color: #465ed1;\n    background: #ffffff;\n}\n\n#__console .log {\n    color: #000000;\n    background: #ffffff;\n}\n\n#__console .warn {\n    color: #465ed1;\n    background: #fff7db;\n}\n\n.-c-switch{\n    display: block;\n    position: fixed;\n    border-radius: 4px;\n    box-shadow: 0 0 8px rgba( 0, 0, 0, .4);\n    padding: 8px 16px;\n    line-height: 1;\n    font-size: 14px;\n    color: #fff;\n    background-color: #04be02;\n}\n\n.-c-content{\n    display: none;\n    position: fixed;\n    left: 0;\n    right: 0;\n    bottom: 40px;\n    border-top: 1px solid #eee;\n    overflow-x: hidden;\n    overflow-y: auto;\n    max-height: 50%;\n    background-color: #fff;\n    -webkit-overflow-scrolling: touch;\n}\n\n.-c-log{\n    margin: 0;\n    border-bottom: 1px solid #eee;\n    padding: 6px 8px;\n    overflow: hidden;\n    line-height: 1.3;\n    -webkit-user-select: text;\n    word-break: break-word;\n}\n\n.-c-toolbar{\n    display: none;\n    position: fixed;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    line-height: 40px;\n    background-color: #fff;\n}\n\n.-c-tool{\n    position: relative;\n    float: left;\n    width: 33.33333%;\n    text-align: center;\n    text-decoration: none;\n    color: #000;\n}\n\n.-c-clear::before{\n    content: \"\";\n    position: absolute;\n    top: 7px;\n    bottom: 7px;\n    right: 0;\n    border-left: 1px solid #d9d9d9;\n}\n\n.-c-ajax::before{\n    content: \"\";\n    position: absolute;\n    top: 7px;\n    bottom: 7px;\n    right: 0;\n    border-left: 1px solid #d9d9d9;\n}", ""]);

	// exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function () {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	module.exports = "<div id=\"__console\">\n    <div class=\"-c-switch\">Console</div>\n    <div class=\"-c-content\"></div>\n    <div class=\"-c-toolbar\">\n        <div class=\"-c-tool -c-clear\">Clear</div>\n        <div class=\"-c-tool -c-ajax\">AJAX(OFF)</div>\n        <div class=\"-c-tool -c-hide\">Hide</div>\n    </div>\n</div>\n";

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    $: function $(selector) {
	        return document.querySelector(selector);
	    },
	    createElement: function createElement(tag, attrs, content) {
	        var el = document.createElement(tag),
	            i = void 0;
	        for (i in attrs) {
	            if (attrs.hasOwnProperty(i)) {
	                el.setAttribute(i, attrs[i]);
	            }
	        }
	        if (content) {
	            el.innerHTML = content;
	        }
	        return el;
	    },
	    show: function show() {
	        for (var _len = arguments.length, els = Array(_len), _key = 0; _key < _len; _key++) {
	            els[_key] = arguments[_key];
	        }

	        els.forEach(function (el) {
	            el.style.display = 'block';
	        });
	        return this;
	    },
	    hide: function hide() {
	        for (var _len2 = arguments.length, els = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	            els[_key2] = arguments[_key2];
	        }

	        els.forEach(function (el) {
	            el.style.display = 'none';
	        });
	        return this;
	    },
	    append: function append(parent) {
	        for (var _len3 = arguments.length, els = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
	            els[_key3 - 1] = arguments[_key3];
	        }

	        els.forEach(function (el) {
	            parent.appendChild(el);
	        });
	        return this;
	    },
	    html: function html(el, content) {
	        el.innerHTML = content;
	    }
	};

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = drag;
	function drag(obj) {

		obj.ontouchstart = function (evt) {

			var e = evt.targetTouches[0];
			var disX = e.clientX - this.offsetLeft;
			var disY = e.clientY - this.offsetTop;

			var handleMove = function handleMove(evt) {
				evt.preventDefault();
				var e = evt.targetTouches[0];

				var L = e.clientX - disX;
				var T = e.clientY - disY;

				if (T < 0) {
					T = 0;
				} else if (T > document.documentElement.clientHeight - obj.offsetHeight) {
					T = document.documentElement.clientHeight - obj.offsetHeight;
				}

				if (L < 0) {
					L = 0;
				} else if (L > document.documentElement.clientWidth - obj.offsetWidth) {
					L = document.documentElement.clientWidth - obj.offsetWidth;
				}

				obj.style.left = L + "px";
				obj.style.top = T + "px";
			};

			document.addEventListener("touchmove", handleMove, false);

			var handleEnd = function handleEnd() {
				document.removeEventListener("touchmove", handleMove, false);
				document.removeEventListener("touchend", handleEnd, false);
			};

			document.addEventListener("touchend", handleEnd, false);
		};
	}

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = ProxyXMLHttpRequest;
	var originXMLHttpRequest = window.XMLHttpRequest;
	var getOwnPropertyNames = Object.getOwnPropertyNames,
	    getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	/*
	* polyfill for Object.getOwnPropertyDescriptors 未考虑 symbol 属性
	* */

	function getOwnPropertyDescriptors(obj) {
		var descs = {};

		getOwnPropertyNames(obj).forEach(function (key) {
			descs[key] = getOwnPropertyDescriptor(obj, key);
		});

		return descs;
	}

	var propertyDescriptors = Object.getOwnPropertyDescriptors ? Object.getOwnPropertyDescriptors(originXMLHttpRequest) : getOwnPropertyDescriptors(originXMLHttpRequest);

	function ProxyXMLHttpRequest() {
		var xhr = new originXMLHttpRequest();

		xhr.onreadystatechange = function () {
			xhr.originOnreadystatechange && xhr.originOnreadystatechange();
			ProxyXMLHttpRequest.fn.call(null, xhr);
		};

		Object.defineProperty(xhr, 'onreadystatechange', {
			set: function set(value) {
				xhr.originOnreadystatechange = value;
			}
		});

		var originOpen = xhr.open.bind(xhr);
		var originSend = xhr.send.bind(xhr);

		xhr.open = function (method, url, asynchronous, username, password) {
			xhr.open_fn_parmas = {
				method: method,
				url: url,
				asynchronous: asynchronous
			};
			originOpen(method, url, asynchronous, username, password);
		};

		xhr.send = function (data) {
			xhr.send_fn_params = {
				data: data
			};
			originSend(data);
		};

		return xhr;
	}

	for (var key in propertyDescriptors) {
		Object.defineProperty(ProxyXMLHttpRequest, key, propertyDescriptors[key]);
	}

	ProxyXMLHttpRequest.fn = function () {};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	/*
	* https://github.com/werk85/fetch-intercept/blob/develop/src/index.js
	* 对改代码进行修改, 用以支持拦截 fetch 请求, 记录请求
	* */
	attach(window);

	function attach(env) {
		env.fetch = function (fetch) {
			return function () {
				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}

				var req = new (Function.prototype.bind.apply(Request, [null].concat(args)))();
				return interceptor(fetch, req);
			};
		}(env.fetch);
	}

	var interceptors = [];

	function interceptor(fetch, req) {
		var cloneReq = req.clone();
		var reversedInterceptors = interceptors.reduce(function (array, interceptor) {
			return [interceptor].concat(array);
		}, []);
		var promise = Promise.resolve(req);

		// Register request interceptors
		reversedInterceptors.forEach(function (_ref) {
			var request = _ref.request,
			    requestError = _ref.requestError;

			if (request || requestError) {
				promise = promise.then(function (req) {
					return request(req);
				}, requestError);
			}
		});

		// Register fetch call
		promise = promise.then(function (req) {
			return new Promise(function (resolve, reject) {
				fetch(req).then(function (res) {
					resolve({ request: cloneReq, response: res });
				}).catch(function (err) {
					reject({ request: cloneReq, responseError: err });
				});
			});
		});

		// Register response interceptors
		reversedInterceptors.forEach(function (_ref2) {
			var response = _ref2.response,
			    responseError = _ref2.responseError;

			if (response || responseError) {
				promise = promise.then(response, responseError);
			}
		});

		return promise;
	}

	exports.default = {
		register: function register(interceptor) {
			interceptors.push(interceptor);
			return function () {
				var index = interceptors.indexOf(interceptor);
				if (index >= 0) {
					interceptors.splice(index, 1);
				}
			};
		},
		clear: function clear() {
			interceptors = [];
		}
	};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = isError;
	function isError(value) {
		return Object.prototype.toString.call(value) === '[object Error]';
	}

/***/ })
/******/ ]);
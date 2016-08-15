/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/public/assets/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["BubbleSdk"] = __webpack_require__(2);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _SodaMessage = __webpack_require__(4);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	(function (global, factory) {
	    "use strict";
	
	    if (( false ? "undefined" : _typeof(module)) === "object" && _typeof(module.exports) === "object") {
	
	        // For CommonJS and CommonJS-like environments where a proper `window`
	        // is present, execute the factory and get BubbleSdk.
	        // For environments that do not have a `window` with a `document`
	        // (such as Node.js), expose a factory as module.exports.
	        // This accentuates the need for the creation of a real `window`.
	        // e.g. var BubbleSdk = require("BubbleSdk")(window);
	        module.exports = global.document ? factory(global, true) : function (w) {
	            if (!w.document) {
	                throw new Error("BubbleSdk requires a window with a document");
	            }
	            return factory(w);
	        };
	    } else {
	        factory(global);
	    }
	
	    // Pass this if window is not defined yet
	})(typeof window !== "undefined" ? window : undefined, function (window, noGlobal) {
	
	    "use strict";
	
	    var BubbleSdk = function () {
	        function BubbleSdk() {
	            _classCallCheck(this, BubbleSdk);
	
	            this.sodaMessage = new _SodaMessage.SodaMessage("123");
	        }
	
	        _createClass(BubbleSdk, [{
	            key: "toString",
	            value: function toString() {
	                return this.sodaMessage.toString();
	            }
	        }]);
	
	        return BubbleSdk;
	    }();
	
	    var BubbleSdkVar = function BubbleSdkVar() {
	        var that = this;
	
	        // getPayload
	        // getContext
	        // closeBubble
	
	        // API:
	        this.getMyLastSession = function () {
	            var lastSessionString = window.BubbleAPI.getLastSession();
	            if (lastSessionString) {
	                var lastSession = that.getSuccessfulResultFromJson(that.parseJSON(lastSessionString), 'sessionId');
	                if (lastSession) {
	                    return lastSession;
	                }
	            }
	            return null;
	        };
	
	        this.getPayload = function (sessionId) {
	            var payloadString = window.BubbleAPI.getPayload(sessionId);
	            if (payloadString) {
	                var payload = that.getSuccessfulResultFromJson(that.parseJSON(payloadString), 'payload');
	                if (payload) {
	                    return payload;
	                }
	            }
	            return null;
	        };
	
	        // UTILS:
	
	        // Return a regular string or null.
	        this.utf8_to_b64 = function (str) {
	            try {
	                return window.btoa(encodeURIComponent(str));
	            } catch (e) {
	                return null;
	            }
	        };
	
	        // Return a base64 string or null.
	        this.b64_to_utf8 = function (str) {
	            try {
	                return decodeURIComponent(window.atob(str));
	            } catch (e) {
	                return null;
	            }
	        };
	
	        // Return the parsed JSON or "".
	        this.parseJSON = function (json) {
	            try {
	                return JSON.parse(json);
	            } catch (e) {
	                return "";
	            }
	        };
	
	        // Return the stringified JSON or null.
	        this.stringifyJSON = function (str) {
	            try {
	                return JSON.stringify(str);
	            } catch (e) {
	                return null;
	            }
	        };
	
	        this.getSuccessfulResultFromJson = function (json, field) {
	            var res = null;
	            if (json.success && json.result && field === 'wholeObject') {
	                return json.result;
	            }
	
	            if (json.success && json.result && json['result'][field]) {
	                res = json['result'][field];
	                if (field === 'payload') {
	                    return that.b64_to_utf8(res);
	                }
	            } else {
	                if (field === 'picture') {
	                    res = "";
	                }
	            }
	            return res;
	        };
	
	        this.generateUUID = function () {
	            var uuid;
	            var d = new Date().getTime();
	            //noinspection JSUnresolvedVariable
	            if (window.performance && typeof window.performance.now === "function") {
	                //noinspection JSUnresolvedVariable
	                d += performance.now(); //use high-precision timer if available
	            }
	            //noinspection SpellCheckingInspection
	            uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	                var r = (d + Math.random() * 16) % 16 | 0;
	                d = Math.floor(d / 16);
	                return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
	            });
	            return uuid;
	        };
	
	        this.createUniqueSessionIdIfOldNotFound = function () {
	            return that.getMyLastSession() || that.generateUUID();
	        };
	    };
	
	    var SodaDeviceData = function SodaDeviceData() {
	        var that = this;
	
	        this.lastLocation = {};
	
	        // getLastKnownLocation
	        // copyToClipboard
	        // openInExternalBrowser
	        // getCurrentLocationAsync
	    };
	
	    var SodaUserData = function SodaUserData() {
	        var that = this;
	
	        this.me = {};
	        this.contacts = [];
	
	        // getUserDetails
	        // getFriendsDetails
	        // getUserPicture
	    };
	
	    if (!noGlobal) {
	        window.BubbleSdk = BubbleSdk;
	    }
	
	    return BubbleSdk;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var SodaMessage = exports.SodaMessage = function () {
	    function SodaMessage(sessionId) {
	        _classCallCheck(this, SodaMessage);
	
	        // Mandatory message fields:
	        this.sessionId = sessionId;
	        this.priority = 2;
	
	        // Non mandatory fields:
	        this.payload = "";
	        this.actionType = null;
	        this.title = null;
	        this.subTitle = null;
	        this.text = null;
	        this.iconUrl = null;
	        this.bannerUrl = null;
	        this.bubbleAppUrl = null;
	        this.updateMsg = true;
	
	        this.success = true;
	        this.msg = "";
	    }
	
	    _createClass(SodaMessage, [{
	        key: "toObject",
	        value: function toObject() {
	            function isInArray(value, array) {
	                return array.indexOf(value) > -1;
	            }
	
	            var res = {};
	            var that = this;
	            for (var prop in that) {
	                if (that.hasOwnProperty(prop) && !isInArray(prop, ['toObject', 'success', 'msg']) && that[prop] !== null) {
	                    res[prop] = that[prop];
	                }
	            }
	
	            return res;
	        }
	    }, {
	        key: "toString",
	        value: function toString() {
	            return JSON.stringify(this.toObject());
	        }
	    }]);
	
	    return SodaMessage;
	}();
	
	SodaMessage.prototype.setSessionId = function (sessionId) {
	    this.sessionId = sessionId;
	    return this;
	};
	
	SodaMessage.prototype.setPriority = function (priority) {
	    this.priority = priority;
	    return this;
	};
	
	SodaMessage.prototype.setPayload = function (payload) {
	    var bubbleSdk = new BubbleSdkVar();
	
	    var myPayload = bubbleSdk.b64_to_utf8(bubbleSdk.stringifyJSON(payload));
	    if (myPayload !== null) {
	        this.success = true;
	        this.payload = myPayload;
	    } else {
	        this.success = false;
	        this.msg = "Payload is not in the correct format";
	        this.payload = "";
	    }
	
	    return this;
	};
	
	SodaMessage.prototype.setActionType = function (actionType) {
	    var ACTION_TYPES = ["OPEN", "PLAY", "INSTALL", "ACCEPT", "DOWNLOAD", "PAY NOW", "SHOP NOW", "SIGN UP", "BOOK NOW", "VOTE"];
	    var flag = false;
	
	    if (actionType === null) {
	        flag = true;
	    } else {
	        for (var i = 0; i < ACTION_TYPES.length; i++) {
	            if (ACTION_TYPES[i] === actionType) flag = true;
	        }
	    }
	
	    this.success = flag;
	    if (!flag) {
	        this.msg = "No such action type";
	    }
	    this.actionType = actionType;
	    return this;
	};
	
	SodaMessage.prototype.setTitle = function (title) {
	    this.title = title;
	    return this;
	};
	
	SodaMessage.prototype.setSubTitle = function (subTitle) {
	    this.subTitle = subTitle;
	    return this;
	};
	
	SodaMessage.prototype.setText = function (text) {
	    this.text = text;
	    return this;
	};
	
	SodaMessage.prototype.setIconUrl = function (iconUrl) {
	    this.iconUrl = iconUrl;
	    return this;
	};
	
	SodaMessage.prototype.setBannerUrl = function (bannerUrl) {
	    this.bannerUrl = bannerUrl;
	    return this;
	};
	
	SodaMessage.prototype.setBubbleAppUrl = function (bubbleAppUrl) {
	    this.bubbleAppUrl = bubbleAppUrl;
	    return this;
	};
	
	SodaMessage.prototype.setUpdateMsg = function (updateMsg) {
	    this.updateMsg = updateMsg;
	    return this;
	};
	
	SodaMessage.prototype.sendLocalMessage = function () {
	    if (!this.success) return { success: false, msg: this.msg };
	    var bubbleSdk = new BubbleSdkVar();
	    var metadata = bubbleSdk.parseJSON(this.toObject());
	    if (metadata) {
	        BubbleAPI.sendLocalMessage(metadata);
	    } else {
	        return { success: false, msg: this.msg };
	    }
	    return { success: true };
	};
	
	SodaMessage.prototype.sendRemoteMessage = function () {
	    if (!this.success) return { success: false, msg: this.msg };
	
	    var bubbleSdk = new BubbleSdkVar();
	    var metadata = bubbleSdk.parseJSON(this.toObject());
	    if (metadata) {
	        BubbleAPI.sendMessage(metadata);
	    } else {
	        return { success: false, msg: this.msg };
	    }
	    return { success: true };
	};

/***/ }
/******/ ]);
//# sourceMappingURL=bubble_sdk_bundle.js.map
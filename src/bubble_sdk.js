"use strict";

import {SodaMessage} from "./SodaMessage.class";

( function( global, factory ) {
    "use strict";

    if ( typeof module === "object" && typeof module.exports === "object" ) {

        // For CommonJS and CommonJS-like environments where a proper `window`
        // is present, execute the factory and get BubbleSdk.
        // For environments that do not have a `window` with a `document`
        // (such as Node.js), expose a factory as module.exports.
        // This accentuates the need for the creation of a real `window`.
        // e.g. var BubbleSdk = require("BubbleSdk")(window);
        module.exports = global.document ?
            factory( global, true ) :
            function( w ) {
                if ( !w.document ) {
                    throw new Error( "BubbleSdk requires a window with a document" );
                }
                return factory( w );
            };
    } else {
        factory( global );
    }

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

    "use strict";
    class BubbleSdk {
        constructor() {
            this.sodaMessage = new SodaMessage("123");
        }
        toString() {
            return this.sodaMessage.toString();
        }
    }

    var BubbleSdkVar = function() {
        var that = this;

        // getPayload
        // getContext
        // closeBubble

        // API:
        this.getMyLastSession = function (){
            var lastSessionString = window.BubbleAPI.getLastSession();
            if (lastSessionString) {
                var lastSession = that.getSuccessfulResultFromJson(that.parseJSON(lastSessionString), 'sessionId');
                if (lastSession) {
                    return lastSession;
                }
            }
            return null;
        };

        this.getPayload = function (sessionId){
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
        this.utf8_to_b64 = function(str) {
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
        this.parseJSON = function(json) {
            try {
                return JSON.parse(json);
            } catch (e) {
                return "";
            }
        };

        // Return the stringified JSON or null.
        this.stringifyJSON = function(str) {
            try {
                return JSON.stringify(str)
            } catch (e) {
                return null;
            }
        };

        this.getSuccessfulResultFromJson = function (json, field) {
            var res = null;
            if (json.success && json.result && field === 'wholeObject'){
                return json.result
            }

            if (json.success && json.result && json['result'][field] ){
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
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        };

        this.createUniqueSessionIdIfOldNotFound = function (){
            return that.getMyLastSession() || that.generateUUID();
        };

    };

    var SodaDeviceData = function() {
        var that = this;

        this.lastLocation = {};

        // getLastKnownLocation
        // copyToClipboard
        // openInExternalBrowser
        // getCurrentLocationAsync
    };

    var SodaUserData = function() {
        var that = this;

        this.me = {};
        this.contacts = [];

        // getUserDetails
        // getFriendsDetails
        // getUserPicture
    };


    if ( !noGlobal ) {
        window.BubbleSdk = BubbleSdk;
    }

    return BubbleSdk;
});

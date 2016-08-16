"use strict";

import {SodaMessage} from "./SodaMessage.class";
import {parseJSON, generateUUID, b64ToUtf8} from './utils.js';

( function( global, factory ) {
    "use strict";

    if ( typeof module === "object" && typeof module.exports === "object" ) {

        // For CommonJS and CommonJS-like environments where a proper `window`
        // is present, execute the factory and get BubbleSdk.
        // For environments that do not have a `window` with a `document`
        // (such as Node.js), expose a factory as module.exports.
        // This accentuates the need for the creation of a real `window`.
        // e.g. let BubbleSdk = require("BubbleSdk")(window);
        //noinspection JSUnresolvedVariable
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

    let extractResultFromJson = function (json) {
        return new Promise((resolve, reject) => {
            if (json.success && json.result) {
                return resolve(json['result']);
            } else {
                if (json['result'] && json['result']['errorId']) {
                    return reject(json['result']['errorId']);
                } else {
                    return reject("No result from BubbleApi");
                }
            }
        });
    };

    // let extractResultFromJson2 = function (json, field) {
    //     let res = null;
    //     if (json.success && json.result && field === 'wholeObject'){
    //         return json.result
    //     }
    //
    //     if (json.success && json.result && json['result'][field] ){
    //         res = json['result'][field];
    //         if (field === 'payload') {
    //             return that.b64_to_utf8(res);
    //         }
    //     } else {
    //         if (field === 'picture') {
    //             res = "";
    //         }
    //     }
    //     return res;
    // };

    let getPromisedValueFromSdk = function (field, call, args) {
        return parseJSON(window.BubbleAPI[call](args))
            .then((sdkResultJson) => {
                if (field) {
                    return extractResultFromJson(sdkResultJson);
                } else {
                    throw new Error("Promise Chain break");
                }
            })
            .then((resultObj)=> {
                return resultObj[field];
            })
            .catch((error) => {
                if (error.message === "Promise Chain break") {
                    return Promise.resolve();
                } else {
                    throw new Error(error);
                }
            });
    };

    class BubbleSdk {
        constructor() {
            // this.sodaMessage = null; // new SodaMessage("123")
        }

        static getMyLastSession(){
            return getPromisedValueFromSdk('sessionId', 'getLastSession');
        }

        static closeBubble(){
            return getPromisedValueFromSdk(null, 'closeBubble');
        }

        static getContext(){
            return getPromisedValueFromSdk('context', 'getContext');
        }

        static getPayload(sessionId){
            return getPromisedValueFromSdk('payload', 'getPayload', sessionId)
                .then((base64Json) => {
                    if (base64Json === null) {
                        return Promise.resolve(null);
                    } else {
                        return b64ToUtf8(base64Json);
                    }
                })
                .then((jsonAsString) => {
                    return parseJSON(jsonAsString);
                });
        }

        static createUniqueSessionIdIfOldNotFound(){
            return this.getMyLastSession()
                .catch(() => {
                    return Promise.resolve(generateUUID());
            });
        };

        static getMessageInstance(sessionId){
            return new SodaMessage(sessionId);
        };
    }

    let SodaDeviceData = function() {

        this.lastLocation = {};

        // getLastKnownLocation
        // copyToClipboard
        // openInExternalBrowser
        // getCurrentLocationAsync
    };

    let SodaUserData = function() {

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

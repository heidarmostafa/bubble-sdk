'use strict';

import {SodaMessage} from './SodaMessage.class';
import {parseJSON, generateUUID, b64ToUtf8} from './utils.js';

//noinspection JSUnusedLocalSymbols
module.exports = class BubbleSDK {
    constructor() {}

    static _extractResultFromJson(json) {
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

    static _getPromisedValueFromSdk(field, call, args) {
        return parseJSON(window.BubbleAPI[call](...args))
            .then((sdkResultJson) => {
                return this._extractResultFromJson(sdkResultJson);
            })
            .then((resultObj)=> {
                if (field) {
                    return resultObj[field];
                } else {
                    return resultObj;
                }
            });
    }

    static getMyLastSession(){
        return this._getPromisedValueFromSdk('sessionId', 'getLastSession');
    }

    static closeBubble(){
        window.BubbleAPI.closeBubble();
        return Promise.resolve('');
    }

    static getContext(){
        return this._getPromisedValueFromSdk('context', 'getContext');
    }

    static getPayload(sessionId){
        return this._getPromisedValueFromSdk('payload', 'getPayload', [sessionId])
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

    static getLastKnownLocation(){
        return this._getPromisedValueFromSdk(null, 'getLastKnownLocation');
    };

    static copyToClipboard(url){
        return this._getPromisedValueFromSdk(null, 'copyToClipboard', [url]);
    };

    static openInExternalBrowser(url){
        return this._getPromisedValueFromSdk(null, 'openInExternalBrowser', [url]);
    };

    static getUserDetails(){
        return this._getPromisedValueFromSdk(null, 'getUserDetails');
    };

    static getFriendsDetails(){
        return this._getPromisedValueFromSdk(null, 'getFriendsDetails');
    };

    static getUserPicture(userId){
        return this._getPromisedValueFromSdk('picture', 'getUserPicture', [userId]);
    };

    static getCurrentLocationAsync(cb){
        window.BubbleAPI.getCurrentLocationAsync(cb);
    };

    static registerToPayloadEvent(cb){
        window.setPayload = function(payload) {
            try {
                var jsonResult = JSON.parse(decodeURIComponent(window.atob(payload)));
                cb(jsonResult, null);
            } catch (e) {
                cb(null, e);
            }
        };
    };

    static registerToBubbleClosedEvent(cb){
        window.bubbleClosed = function() {
            cb();
        };
    };
};

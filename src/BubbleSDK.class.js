'use strict';

import {SodaMessage} from './SodaMessage.class';
import {LeaderBoard} from './LeaderBoard.class';
import {parseJSON, generateUUID, b64ToUtf8} from './utils.js';

//noinspection JSUnusedLocalSymbols
module.exports = class BubbleSDK {

    //Private functions
    static _extractResultFromJson(json) {
        return new Promise((resolve, reject) => {
            if (json.success && json.result) {
                return resolve(json['result']);
            } else {
                if (json['result'] && json['result']['errorId']) {
                    return reject(json['result']['errorId']);
                } else {
                    return reject('No result from BubbleApi');
                }
            }
        });
    };

    static _getPromisedValueFromSdk(field, call, args) {

        if (typeof args === 'undefined') {
            args = [];
        }

        return parseJSON(window.BubbleAPI[call](...args))
            .then((sdkResultJson) => {
                return this._extractResultFromJson(sdkResultJson);
            })
            .then((resultObj) => {
                if (field) {
                    return resultObj[field];
                } else {
                    return resultObj;
                }
            });
    }

    /**
     * Get the last received sessionId.
     * You can use this id to restore the last payload in case the bubble was lunched without a sessionId
     * {@link https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getlastsession}
     * @returns {Promise.<string>}
     * */
    static getMyLastSession() {
        return this._getPromisedValueFromSdk('sessionId', 'getLastSession');
    }

    /**
     * Close bubble
     * {@link https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#bubble-to-sdk}
     * @returns {Promise.<string>}
     */
    static closeBubble() {
        window.BubbleAPI.closeBubble();
        return Promise.resolve('');
    }

    /**
     * Get the context of the hosting container (conversation, page, etc.).
     * You can use this context if you save external state for your bubble per context.
     * @returns {Promise.<string>}
     */
    static getContext() {
        return this._getPromisedValueFromSdk('context', 'getContext');
    }

    /**
     * Get the last payload of a given session
     * {@link https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getpayload}
     * @param sessionId
     * @returns {Promise.<json>}
     */
    static getPayload(sessionId) {
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

    /**
     * Generate a random session id
     * @returns {Promise.<string>}
     */
    static createUniqueSessionIdIfOldNotFound() {
        return this.getMyLastSession()
            .catch(() => {
                return Promise.resolve(generateUUID());
        });
    };

    /**
     * Get last known location of the current user (doesn't query the GPS directly)
     * {@link https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getlastknownlocation}
     * @returns {Promise.<json>}
     */
    static getLastKnownLocation() {
        return this._getPromisedValueFromSdk(null, 'getLastKnownLocation');
    };

    /**
     * Returns the current bubble's product ID
     * @returns {Promise.<json>}
     */
    static getProductId() {
        return this._getPromisedValueFromSdk(null, 'getProductId');
    };

    /**
     * Adds any give text to the device's clipboard, ready for pasting anywhere and outside the app
     * @param {string} text - The string we want to send to the clipboard
     * @returns {Promise.<json>}
     */
    static copyToClipboard(text) {
        return this._getPromisedValueFromSdk(null, 'copyToClipboard', [text]);
    };

    /**
     * Open a given URL in the device's default web browser
     * @param {string} URL - The URL to be opened
     * @returns {Promise.<string>}
     */
    static openInExternalBrowser(url) {
        return this._getPromisedValueFromSdk(null, 'openInExternalBrowser', [url]);
    };

    /**
     * Get details of the current user
     * {@link https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getuserdetails}
     * @returns {Promise.<json>}
     */
    static getUserDetails() {
        return this._getPromisedValueFromSdk(null, 'getUserDetails');
    };

    /**
     * Details of all friends active on the current chat. Requires extra permission.
     * {@link https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getfriendsdetails}
     * @returns {Promise.<json>}
     */
    static getFriendsDetails() {
        return this._getPromisedValueFromSdk(null, 'getFriendsDetails');
    };

    /**
     * Get user profile picture
     * Might be returned using the following sources:
     * 1. base64 encoded image
     * 2. image URL
     * 3. path to a local picture
     * {@link https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getuserpicture}
     * @param userId
     * @returns {Promise.<json>}
     */
    static getUserPicture(userId) {
        return this._getPromisedValueFromSdk('picture', 'getUserPicture', [userId]);
    };

    /**
     * Get active location of the current user (query the GPS directly)
     * {@link https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getcurrentlocationasync}
     * @param {function} callback - The callback function
     */
    static getCurrentLocationAsync(cb) {
        window.BubbleAPI.getCurrentLocationAsync(cb);
    };

    /**
     * The SDK calls the provided callback function method whenever a new payload is available for the bubble (for example, when a new message arrives)
     * {@link https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#sdk-to-bubble}
     * @param {function} callback -  The function that will called on payload event
     */
    static registerToPayloadEvent(cb) {
        window.setPayload = function(payload) {
            try {
                var jsonResult = JSON.parse(decodeURIComponent(window.atob(payload)));
                cb(jsonResult, null);
            } catch (e) {
                cb(null, e);
            }
        };
    };

    /**
     * The SDK will call the provided callback function when a bubble is being terminated by the container application
     * {@link https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#sdk-to-bubble}
     * @param {function} callback - The callback function
     */
    static registerToBubbleClosedEvent(cb) {
        window.bubbleClosed = function() {
            cb();
        };
    };

    //Services

    /**
     * Returns a new instance of the SodaMessage class
     * @param {string} sessionId
     * @returns {SodaMessage}
     */
    static getMessageInstance(sessionId) {
        return new SodaMessage(sessionId);
    };

    /**
     * Returns a new instance of LeaderBoard class
     * @param {string} bubbleId
     * @param {string} productId - Decided an supplied by StartApp
     * @param {string} contextId - The context id
     * @param {enum} order - asc/desc string. Dictates what accounts for a better score - lower or higher numbers
     * @returns {LeaderBoard}
     */
    static getLeaderboardInstance(bubbleId, productId, contextId, order) {
        return new LeaderBoard(bubbleId, productId, contextId, order);
    };

};

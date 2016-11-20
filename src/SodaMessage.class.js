'use strict';

import {stringifyJSON, isInArray} from './utils.js';

export class SodaMessage {

    /**
     * Creates an instance of SodaMessage
     * {@link https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#the-msg-json-object}
     * @constructor
     * @param {string} sessionId
     */
    constructor(sessionId) {
        // Mandatory message fields:
        this.sessionId = sessionId;
        this.priority = 2;

        // Non mandatory fields:
        this.payload = '';
        this.updateMsg = false;
        this.actionType = null;
        this.title = null;
        this.subTitle = null;
        this.text = null;
        this.iconUrl = null;
        this.bannerUrl = null;
        this.bubbleAppUrl = null;

        // local vars for relaying problematic handling.
        this.success = true;
        this.msg = '';
    }

    toObject() {
        let res = {};
        for (let prop in this) {
            if (this.hasOwnProperty(prop) && (!isInArray(prop, ['toObject', 'toString', 'success', 'msg'])) && (this[prop] !== null)) {
                res[prop] = this[prop];
            }
        }

        return res;
    };

    toString() {
        return stringifyJSON(this.toObject())
            .then((str) => {
                return str;
        });
    }
}

/**
 * The session Id of your message
 * @param {string} sessionId
 * @returns {SodaMessage}
 */
SodaMessage.prototype.setSessionId = function(sessionId) {
    this.sessionId = sessionId;
    return this;
};

/**
 * Priority is the "level of urgency" of this notification, by which it will be treated by the container application. Possible values:
 * 0. Silent - use this option to send in-bubble messages that won't be displayed on the container app
 * 1. Low
 * 2. Medium
 * 3. High
 * @param {string} priority
 * @returns {SodaMessage}
 */
SodaMessage.prototype.setPriority = function(priority) {
    this.priority = priority;
    return this;
};

/**
 * The message content
 * @param {string} payload
 * @returns {SodaMessage}
 */
SodaMessage.prototype.setPayload = function(payload) {
    try {
        var jsonAsBase64 = window.btoa(encodeURIComponent(JSON.stringify(payload)));
        this.success = true;
        this.payload = jsonAsBase64;
    } catch (error) {
        this.success = false;
        this.msg = error.message;
        this.payload = '';
    } finally {
        //noinspection ReturnInsideFinallyBlockJS
        /* eslint-disable no-unsafe-finally */
        return this;
    }
};

/**
 * The action performed by clicking this message.
 * @param {enum} actionType - Options are OPEN, PLAY, INSTALL, ACCEPT, DOWNLOAD, PAY NOW, SHOP NOW, SIGN UP, BOOK NOW, VOTE
 * @returns {SodaMessage}
 */
SodaMessage.prototype.setActionType = function(actionType) {
    const ACTION_TYPES = ['OPEN', 'PLAY', 'INSTALL', 'ACCEPT', 'DOWNLOAD', 'PAY NOW', 'SHOP NOW', 'SIGN UP', 'BOOK NOW', 'VOTE', 'READ'];

    if (actionType === null || isInArray(actionType, ACTION_TYPES)) {
        this.actionType = actionType;
    } else {
        this.msg = 'No such action type';
        this.success = false;
    }

    return this;
};

/**
 * The notification title
 * @param {string} title
 * @returns {SodaMessage}
 */
SodaMessage.prototype.setTitle = function(title) {
    this.title = title;
    return this;
};

/**
 * The notification sub-title
 * @param {string} subTitle
 * @returns {SodaMessage}
 */
SodaMessage.prototype.setSubTitle = function(subTitle) {
    this.subTitle = subTitle;
    return this;
};

/**
 * The notification text
 * @param {string} text
 * @returns {SodaMessage}
 */
SodaMessage.prototype.setText = function(text) {
    this.text = text;
    return this;
};

/**
 * The URL for a notification preview icon (square)
 * @param {string} iconUrl
 * @returns {SodaMessage}
 */
SodaMessage.prototype.setIconUrl = function(iconUrl) {
    this.iconUrl = iconUrl;
    return this;
};

/**
 * The URL for a notification preview banner
 * @param {string} bannerUrl
 * @returns {SodaMessage}
 */
SodaMessage.prototype.setBannerUrl = function(bannerUrl) {
    this.bannerUrl = bannerUrl;
    return this;
};

/**
 * The "base URL" of the Bubble. This URL will be used by the SDK to open the Bubble on the other side. Leave this parameter blank to use the bubble's default URL.
 * @param {string} bubbleAppUrl
 * @returns {SodaMessage}
 */
SodaMessage.prototype.setBubbleAppUrl = function(bubbleAppUrl) {
    this.bubbleAppUrl = bubbleAppUrl;
    return this;
};

/**
 * Use this parameter to ask the container application to override the last native massage with new data.
 * @param {string} updateMsg
 * @returns {SodaMessage}
 */
SodaMessage.prototype.setUpdateMsg = function(updateMsg) {
    this.updateMsg = updateMsg;
    return this;
};

/**
 * After the message values are set - execute this function to actually send it locally
 * @returns {Promise}
 */
SodaMessage.prototype.sendLocalMessage = function() {
    return new Promise((resolve, reject) => {
        if (!this.success) return reject(new Error(this.msg));
        stringifyJSON(this.toObject())
            .then((metadata) => {
                window.BubbleAPI.sendLocalMessage(metadata);
        });
    });
};

/**
 *  After the message values are set - execute this function to actually send it locally
 * @returns {Promise}
 */
SodaMessage.prototype.sendRemoteMessage = function() {
    return new Promise((resolve, reject) => {
        if (!this.success) return reject(new Error(this.msg));
        stringifyJSON(this.toObject())
            .then((metadata) => {
                window.BubbleAPI.sendMessage(metadata);
            });
    });
};

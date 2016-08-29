'use strict';

import {stringifyJSON, isInArray} from './utils.js';

export class SodaMessage {
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

SodaMessage.prototype.setSessionId = function(sessionId) {
    this.sessionId = sessionId;
    return this;
};

SodaMessage.prototype.setPriority = function(priority) {
    this.priority = priority;
    return this;
};

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

SodaMessage.prototype.setActionType = function(actionType) {
    const ACTION_TYPES = ['OPEN', 'PLAY', 'INSTALL', 'ACCEPT', 'DOWNLOAD', 'PAY NOW', 'SHOP NOW', 'SIGN UP', 'BOOK NOW', 'VOTE'];

    if (actionType === null || isInArray(actionType, ACTION_TYPES)) {
        this.actionType = actionType;
    } else {
        this.msg = 'No such action type';
        this.success = false;
    }

    return this;
};

SodaMessage.prototype.setTitle = function(title) {
    this.title = title;
    return this;
};

SodaMessage.prototype.setSubTitle = function(subTitle) {
    this.subTitle = subTitle;
    return this;
};

SodaMessage.prototype.setText = function(text) {
    this.text = text;
    return this;
};

SodaMessage.prototype.setIconUrl = function(iconUrl) {
    this.iconUrl = iconUrl;
    return this;
};

SodaMessage.prototype.setBannerUrl = function(bannerUrl) {
    this.bannerUrl = bannerUrl;
    return this;
};

SodaMessage.prototype.setBubbleAppUrl = function(bubbleAppUrl) {
    this.bubbleAppUrl = bubbleAppUrl;
    return this;
};

SodaMessage.prototype.setUpdateMsg = function(updateMsg) {
    this.updateMsg = updateMsg;
    return this;
};

SodaMessage.prototype.sendLocalMessage = function() {
    return new Promise((resolve, reject) => {
        if (!this.success) return reject(new Error(this.msg));
        stringifyJSON(this.toObject())
            .then((metadata) => {
                window.BubbleAPI.sendLocalMessage(metadata);
        });
    });
};

SodaMessage.prototype.sendRemoteMessage = function() {
    return new Promise((resolve, reject) => {
        if (!this.success) return reject(new Error(this.msg));
        stringifyJSON(this.toObject())
            .then((metadata) => {
                window.BubbleAPI.sendMessage(metadata);
            });
    });
};

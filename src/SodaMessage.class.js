"use strict";

export class SodaMessage {
    constructor(sessionId) {
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

    toObject() {
        function isInArray(value, array) {
            return array.indexOf(value) > -1;
        }

        var res = {};
        var that = this;
        for (var prop in that) {
            if (that.hasOwnProperty(prop) && (!isInArray(prop, ['toObject', 'success', 'msg'])) && (that[prop] !== null)) {
                res[prop] = that[prop];
            }
        }

        return res;
    };

    toString() {
        return JSON.stringify(this.toObject());
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

SodaMessage.prototype.setActionType = function(actionType) {
    var ACTION_TYPES = ["OPEN", "PLAY", "INSTALL", "ACCEPT", "DOWNLOAD", "PAY NOW", "SHOP NOW", "SIGN UP", "BOOK NOW", "VOTE"];
    var flag = false;

    if (actionType === null) {
        flag = true;
    } else {
        for (var i=0; i < ACTION_TYPES.length; i++){
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
    if (!this.success) return {success: false, msg: this.msg};
    var bubbleSdk = new BubbleSdkVar();
    var metadata = bubbleSdk.parseJSON(this.toObject());
    if (metadata) {
        BubbleAPI.sendLocalMessage(metadata);
    } else {
        return {success: false, msg: this.msg};
    }
    return {success: true};
};

SodaMessage.prototype.sendRemoteMessage = function() {
    if (!this.success)
        return {success: false, msg: this.msg};

    var bubbleSdk = new BubbleSdkVar();
    var metadata = bubbleSdk.parseJSON(this.toObject());
    if (metadata) {
        BubbleAPI.sendMessage(metadata);
    } else {
        return {success: false, msg: this.msg};
    }
    return {success: true};
};
'use strict';

let reqwest = require('reqwest');

export class LeaderBoard {
    constructor(bubbleId, productId, order) {
        this.bubbleId = bubbleId;
        this.productId = productId;
        if (typeof order !== 'undefined' && order === 'desc') {
            this.ascending = false;
        } else {
            this.ascending = true;
        }
    }
}

LeaderBoard.prototype.getBoard = function(contextId) {

    return new Promise((resolve, reject) => {
        reqwest({
            url: 'https://leaderboard.startappnetwork.com/leaderboard-service/leaderboard/getboard',
            method: 'get',
            data: {
                bubbleid: this.bubbleId,
                productid: this.productId,
                contextid: contextId
            },
            success: function (resp) {
                resolve(resp);
            },
            error: function(err) {
                reject(err);
            }
        });
    });

};

LeaderBoard.prototype.getUserBestScore = function(userId) {

    return new Promise((resolve, reject) => {
        reqwest({
            url: 'https://leaderboard.startappnetwork.com/leaderboard-service/leaderboard/getuserbestscore',
            method: 'get',
            data: {
                bubbleid: this.bubbleId,
                productid: this.productId,
                contextid: userId
            },
            success: function (resp) {
                resolve(resp);
            },
            error: function(err) {
                reject(err);
            }
        });
    });

};

LeaderBoard.prototype.submitScore = function(userId, userName, score) {

    return new Promise((resolve, reject) => {
        reqwest({
            url: 'https://leaderboard.startappnetwork.com/leaderboard-service/leaderboard/submitscore',
            method: 'post',
            data: {
                bubbleid: this.bubbleId,
                productid: this.productId,
                userId: userId,
                userName: userName,
                score: score,
                ascending: this.ascending
            },
            success: function (resp) {
                resolve(resp);
            },
            error: function(err) {
                reject(err);
            }
        });
    });

};

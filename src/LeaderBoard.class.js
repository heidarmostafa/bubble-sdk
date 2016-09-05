'use strict';

let reqwest = require('reqwest');

export class LeaderBoard {

    /**
     * Constructor of Leaderboard
     * @constructor
     * @param {string} bubbleId
     * @param {string} productId - Decided an supplied by StartApp
     * @param {string} contextId - The context id
     * @param {enum} order - asc/desc string. Dictates what accounts for a better score - lower or higher numbers
     */
    constructor(bubbleId, productId, contextId, order = 'desc') {
        this.bubbleId = bubbleId;
        this.productId = productId;
        this.contextId = contextId;
        this.ascending = (order === 'asc');

    }
}

/**
 * Return the board of a specific context
 * @param {string} contextId
 * @returns {Promise}
 */
LeaderBoard.prototype.getBoard = function() {

    return new Promise((resolve, reject) => {
        reqwest({
            url: 'https://leaderboard.startappnetwork.com/leaderboard-service/leaderboard/getboard',
            method: 'get',
            data: {
                bubbleid: this.bubbleId,
                productid: this.productId,
                contextid: this.contextId
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

/**
 * Get user's best score for current bubble
 * @param {string} userId
 * @returns {Promise}
 */
LeaderBoard.prototype.getUserBestScore = function(userId) {

    return new Promise((resolve, reject) => {
        reqwest({
            url: 'https://leaderboard.startappnetwork.com/leaderboard-service/leaderboard/getuserbestscore',
            method: 'get',
            data: {
                bubbleid: this.bubbleId,
                productid: this.productId,
                userid: userId
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

/**
 * Submit new score
 * @param {string} userId
 * @param {string} userName
 * @param {int} score
 * @returns {Promise}
 */
LeaderBoard.prototype.submitScore = function(userId, userName, score) {

    return new Promise((resolve, reject) => {
        reqwest({
            url: 'https://leaderboard.startappnetwork.com/leaderboard-service/leaderboard/submitscore',
            method: 'post',
            data: {
                bubbleid: this.bubbleId,
                productid: this.productId,
                contextId: this.contextId,
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

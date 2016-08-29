'use strict';

export function utf8ToB64(str) {
    return new Promise((resolve, reject) => {
        try {
            resolve(window.btoa(encodeURIComponent(str)));
        } catch (e) {
            reject(e);
        }
    });
}

export function b64ToUtf8(str) {
    return new Promise((resolve, reject) => {
        try {
            resolve(decodeURIComponent(window.atob(str)));
        } catch (e) {
            reject(e);
        }
    });
}

export function stringifyJSON(json) {
    return new Promise((resolve, reject) => {
        try {
            resolve(JSON.stringify(json));
        } catch (e) {
            reject(e);
        }
    });
}

export function parseJSON(str) {
    return new Promise((resolve, reject) => {
        try {
            resolve(JSON.parse(str));
        } catch (e) {
            reject(e);
        }
    });
}

export function generateUUID() {
    let uuid;
    let d = new Date().getTime();
    //noinspection JSUnresolvedVariable
    if (window.performance && typeof window.performance.now === 'function') {
        //noinspection JSUnresolvedVariable
        d += window.performance.now(); //use high-precision timer if available
    }
    //noinspection SpellCheckingInspection
    uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

export function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

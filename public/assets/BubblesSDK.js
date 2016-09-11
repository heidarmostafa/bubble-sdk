/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/public/assets/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(2);


/***/ },
/* 1 */
/***/ function(module, exports) {

	var windowsObjectReference = {};
	
	function SodaSandbox() {
	
	    var me = {};
	    var contacts = [];
	    var userPictures = {};
	    var location = null;
	    var sessionId = "";
	    var conversationId = "";
	    var payloads = {};
	    var that = this;
	    var storage = localStorage;
	
	    function getMyUrl(){
	        return window.location.href
	    }
	
	    function receiveMessageFromOtherWindow(event)
	    {
	        // Do we trust the sender of this message?
	        if (event.origin !== window.location.origin)
	            return;
	
	        windowsObjectReference[event.data] = event.source;
	    }
	
	    window.addEventListener("message", receiveMessageFromOtherWindow, false);
	
	    function getURLParameter(name) {
	        var where = (window.location.search === "") ? window.location.hash : window.location.search;
	        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(where)||[,""])[1].replace(/\+/g, '%20'))||null;
	    }
	
	    function createUrl(url, newSessionId, newUserId, newConversationId) {
	        var result = null;
	        if (url && newSessionId && newUserId && newConversationId) {
	            //var loc = url.indexOf('sessionId=');
	            if (getURLParameter('sessionId')) {
	                result = url.replace(/(sessionId=)[^&]+/, '$1' + newSessionId);
	            } else {
	                if (url.indexOf('?') > -1) {
	                    result = url + "&sessionId=" + newSessionId;
	                } else {
	                    result = url + "?sessionId=" + newSessionId;
	                }
	            }
	            if (getURLParameter('userId')) {
	                result = result.replace(/(&userId=)[^&]+/, '$1' + newUserId);
	            } else {
	                result += "&userId=" + newUserId;
	            }
	            if (getURLParameter('conversationId')) {
	                result = result.replace(/(&conversationId=)[^&]+/, '$1' + newConversationId);
	            } else {
	                result += "&conversationId=" + newConversationId;
	            }
	        }
	        return result;
	    }
	
	    function saveMessage(metadata, isLocal) {
	        var jsonData = decryptMsg(metadata);
	
	        function storeUserPayload(userId) {
	            var storageItem = decryptMsg(storage.getItem('SODA_ITEM'));
	            if (storageItem === null) {
	                storageItem = {};
	            } else {
	                storage.removeItem('SODA_ITEM');
	            }
	            if (!storageItem.hasOwnProperty(sessionId)){
	                storageItem[sessionId] = {};
	            }
	            storageItem[sessionId][userId] = jsonData.payload;
	            storageItem[sessionId]['whoChanged'] = userId;
	            storage.setItem("SODA_ITEM", encryptMsg(storageItem));
	        }
	
	        if (jsonData !== null && jsonData.sessionId && jsonData.sessionId !== "") {
	            sessionId = jsonData.sessionId;
	            storage.setItem("SODA_LAST_SESSION", sessionId);
	
	            var url = (typeof jsonData.bubbleAppUrl === "undefined") ? getMyUrl(): decodeURIComponent(jsonData.bubbleAppUrl);
	
	            if (isLocal) {
	                payloads[sessionId] = jsonData.payload;
	                storeUserPayload(me.userId);
	                if (!getURLParameter('sessionId')) {
	                    history.pushState("Rewriting URL to add params", "localPage", createUrl(url, sessionId, me.userId, conversationId));
	                }
	
	            } else {
	                contacts.forEach(function(elem){
	                    storeUserPayload(elem.userId);
	                    if (!windowsObjectReference.hasOwnProperty(elem.userId) || windowsObjectReference[elem.userId].closed) {
	                        /* if the pointer to the window object in memory does not exist
	                         or if such pointer exists but the window was closed */
	                        var fullUrl = createUrl(url, sessionId, elem.userId, conversationId);
	                        windowsObjectReference[elem.userId] = window.open(fullUrl, elem.userId); // The second param will cause it to only open in new tab if it doesn't exist.
	
	                        if(typeof windowsObjectReference[elem.userId] !== 'undefined') {
	                            setTimeout(function() {
	                                windowsObjectReference[elem.userId].postMessage(me.userId, fullUrl);
	                            }, 3000);
	                        }
	
	                    }
	                });
	            }
	        }
	    }
	
	    addEventListener('storage', storageListenerFunc);
	
	    function storageListenerFunc(event) {
	        if (event.key === "SODA_ITEM" && event.newValue) {
	            if (typeof setPayload === 'function') {
	                var newVal = decryptMsg(event.newValue);
	                if (newVal && newVal[sessionId] && newVal[sessionId]['whoChanged'] === me.userId) {
	                    setPayload(newVal[sessionId][me.userId]);
	                }
	            } else {
	                console.log('no setPayload function declared');
	            }
	        }
	    }
	
	    function decryptMsg(msg) {
	        try {
	            return JSON.parse(msg)
	        } catch (ex) {
	            return null;
	        }
	    }
	
	    function encryptMsg(msg) {
	        try {
	            return JSON.stringify(msg)
	        } catch (ex) {
	            return null;
	        }
	    }
	
	    function generateUUID() {
	        var d = new Date().getTime();
	        if (window.performance && typeof window.performance.now === "function") {
	            d += performance.now(); //use high-precision timer if available
	        }
	        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	            var r = (d + Math.random() * 16) % 16 | 0;
	            d = Math.floor(d / 16);
	            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	        });
	    }
	
	    function errorMsgGenerator(err) {
	        try {
	            return JSON.stringify({
	                "success": false,
	                "result": {
	                    "errorId": err
	                }
	            });
	        } catch (e) {
	            return '{ \
	                "success": false,\
	                "result": {\
	                "errorId": "bad parameter to function"\
	                }\
	            }'
	        }
	    }
	
	    function msgGenerator(content) {
	        try {
	            return JSON.stringify({
	                "success": true,
	                "result": content
	            });
	        } catch (e) {
	            return '{ \
	                "success": false,\
	                "result": {\
	                "errorId": "bad parameter to function"\
	                }\
	            }'
	        }
	
	    }
	
	    function getUserPic(userId) {
	        if (userPictures.hasOwnProperty(userId)) {
	            return userPictures[userId];
	        }
	        return null;
	    }
	
	    //////////////////// PUBLIC METHODS ///////////////////////////////////////
	
	    ////////////// SDK functions start: ///////////////////////////////////////
	
	    this.sendMessage = function(metadata) {
	        saveMessage(metadata, false);
	    };
	
	    this.sendLocalMessage = function(metadata) {
	        saveMessage(metadata, true);
	    };
	
	    // All these functions accept another parameter called err,
	    // if numeric gte 0, will return an error message of that value.
	
	    this.getLastSession = function(err) {
	        if (typeof err === "number" && err >= 0) return errorMsgGenerator(err);
	
	        sessionId = sessionId ? sessionId : storage.getItem('SODA_LAST_SESSION');
	        if (!sessionId) return errorMsgGenerator(5);
	        return msgGenerator({sessionId : sessionId});
	    };
	
	    this.getUserDetails = function(err) {
	        if (typeof err === "number" && err >= 0) return errorMsgGenerator(err);
	        return msgGenerator(me);
	    };
	
	    this.getFriendsDetails = function(err) {
	        if (typeof err === "number" && err >= 0) return errorMsgGenerator(err);
	        return msgGenerator(contacts);
	    };
	
	    this.getLastKnownLocation = function(err) {
	        if (typeof err === "number" && err >= 0) return errorMsgGenerator(err);
	        return msgGenerator(location);
	    };
	
	    this.getUserPicture = function(userId, err) {
	        if (typeof err === "number" && err >= 0) return errorMsgGenerator(err);
	        var userPic = getUserPic(userId);
	        return (userPic === null) ? errorMsgGenerator(5) : msgGenerator(userPic);
	    };
	
	    this.getPayload = function(sessionId, err) {
	        if (typeof err === "number" && err >= 0) return errorMsgGenerator(err);
	        var res = {"payload": null};
	        if (payloads.hasOwnProperty(sessionId)) {
	            res.payload = payloads[sessionId];
	        }
	        return msgGenerator(res);
	    };
	
	    this.getContext = function(err) {
	        if (typeof err === "number" && err >= 0) return errorMsgGenerator(err);
	        return msgGenerator({"context": conversationId});
	    };
	
	    this.copyToClipboard = function(err) {
	        if (typeof err === "number" && err >= 0) return errorMsgGenerator(err);
	        return msgGenerator({});
	    };
	
	    this.openInExternalBrowser = function(url, err) {
	        if (typeof err === "number" && err >= 0) return errorMsgGenerator(err);
	        var windowId = window.open(url);
	        return msgGenerator({'windowId' : windowId});
	    };
	
	    this.getProductId = function() {
	        return msgGenerator({"productId":"123"});
	    };
	
	    // Async
	    this.getCurrentLocationAsync = function(listener_name, err) {
	        if (typeof err === "number" && err >= 0) return errorMsgGenerator(err);
	        if (typeof listener_name !== "function") return errorMsgGenerator("callback function not supplied");
	        that.setLastLocation(null, listener_name);
	    };
	
	    this.closeBubble = function() {
	        window.close();
	    };
	
	    ////////////// SDK functions end //////////////////////////////////////////
	
	    // Helper functions, not part of SDK:
	
	    // init - Used by SodaSandbox class to initialize it - Don't use.
	    this.init = function () {
	        var firstUser = "Dima-123";
	        var otherUser = "Andrea-123";
	        var mockItem = {
	            context: generateUUID(),
	            members: [{
	                userId: firstUser,
	                firstName: "Dima",
	                lastName: "Nemetz",
	                userName: "diman"
	            },{
	                userId: otherUser,
	                firstName: "Andrea",
	                lastName: "Alkalay",
	                userName: "andrea"
	            }],
	            userPictures: {}
	        };
	        mockItem.userPictures[firstUser] = {
	            type: "base64",
	            picture: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAEAAQADASIAAhEBAxEB/8QAHAAAAQQDAQAAAAAAAAAAAAAAAAQFBgcBAgMI/8QAPhAAAQMCBAQEBAQEBQMFAAAAAQACAwQRBRIhMQZBUWEHEyJxgZGhsRQyQsEVI1LwJDNi0eEWgrIINHKS8f/EABkBAQADAQEAAAAAAAAAAAAAAAACAwQBBf/EACMRAAICAwACAgMBAQAAAAAAAAABAhEDITEEEhNRIjJBQmH/2gAMAwEAAhEDEQA/AL/QhCAEIQgBCEIAWFlNeKYkMOpfNDWueTla1z8o9/ZcboVY4ue1jS5zgGjckqN47xXR4XTPFPLFNUgaNDhlb3Pt0Ve8R8b19bO5tOaZ0LDluS4Zj2BP10VU13EOITzF8zmvbc5WusRb/hVub/hYofZKeM+NY6iWUfxCWeqcLBrBZrTp/eij+F45LPLerL5GAal+t+5UZc10tW2drS8ix0OoPNOesFOM0nl5tiQPkVWTRPcC4wbg9XkifMYSczWsdub6JJxjxjNjBeKSdzonu18xuum33+igJrZGNkaJW7WuLbJrlxWUNDAbOaV1W+BnWvgkY/V1wTv1K408ZLS6x9JtbqlcDn1xZJKRqdB2SjI2M2NszzcpdaBv5xbEwEm2hHZSPDuNK/BKKSLD62Rr5Y/WWEgtN+v97qLB/mQDLuXCx+ASQtc2Vw0LbXuuIUW5wn4uYrhUjIMUc+upSQCX/nA7G/3V34HxLhfENI2egqmPJ/NGXDO09CF4+hlcIbm+rrAKY8O01cyb8RQVMsU7Ggs8p1i472t8FKMmiLjZ6qQozwnjcmL4DST1QDKh7bEf1Ec/fspMFcnZW1QIQhdOAhCEAIQhACEIQAhCLaoAQhCAEIQgMAWWUJNUTx0tNJUTPDIomF73HZoAuSgE+JYlBhtK+eeQMYzru49AOZVIcTcStxGoIqax7nZwbB5Plh36W8hyubdEj4r4ulxTEqolz3MY93ktB/I08rbe5UEZUSSl8hmu95ObX91RJ2XRVEgnfRRUDpIql5lcdy4X+SiE8b3Oc4PD2lxPulM7zBG1+hHN290ile7ISCACeR5/sotkqO9OIII3HN6xrumyuxCSf0ZvQNh0WJpy5uoB6X5JH5by4aEg7d1KK+yVGhndprYjYhavAe4Ha5XY0cl7ZTdbtpXtZqNttFL2iuEfVvouppWMmsw3a1uVvxNlzle98z8zrFwOt9r8/uuUUT4wbtOg17IgimnkzmNxadyen99FH/p2qOkk3l5LAtaz8vVcBUufJlcNLa2SioaHH8unJu3zSKUtAswtb7G5K6tnOCxlQJHtaNGNO6kuGV/luBDQ+wsCf791EaWF7gHEER/dO0Mxju0XBPRRa2cstTB+Ko6FtM2B8zCXgvDdRfsOX+6urh3FxitA3Mf58bQJNLXPVeWKecZGvLiMjgRqdPZXBw3xNPQ1jX2cad7GZS52rm317OOp17qadMi1aLiQuFPM2eCOZl8kjQ5t+hF13VpUCEIQAhCEAIQhACEIQAhCEAIQhACrDxPx+QkYHBUCCFsYnrZr6hpNmsA5k729lY80rIIXzSuDI2NLnOOwA1JXkbjPimfG8erp/MLGTTOcB22bf2bYKE3/AAlHpyxKrFQHU8LsrSbE7uPS5SaGndTxOLi06aApso2SzyF9rtHM80txF7HMaw3BA3I0H7hUstQ2TVL2zODtQT6mFaw2mOWIODjvfYrVkbp5GtDi9xNhp+6nWB8KXa10rC9x1s1RnNQRox43N6ItBhb5SARc9k/0fDMmQOYD19lYOH8NMhY3M1t76NLbp5jwkReoC32WSfkfRrh4y/0V7T8Kl4uWW2JWJuFC07WJ1A6DqrOZQsyn0g66lYfQs1PlX77qv5pFvwQKll4bcXhrIiW8yRuk1Tgc0UZ9HuAFbbqSInRtvYJvqqBhH5QR0UlnZx+LFlMPwiYXDrWJ1I3XI0DICc3rI5W/dWxV4RE4EhtuiiuKYVlJG4WiGZMy5fGlEg00jg++d/Y7WWrJQxwaHa8zf6p2rMMB+B562THJaKQgDUHUEaLRF+xkkqHukL35S0Fwvz2KlNC6pgEb/MsY3Z2xkG/y+aglNUywSB7HNA30Nvmpjg+JmuqMzp5POecpc535r73J/ddIHpjhOqmq+HqWSfLnAy3btbl9LJ8CgXhpUVf8ENHURBkcB9DtbuuTv9Pop8ro8KpLYIQhdOAhCEAIQhACEIQAhCEAIQhARfxAdO3gPGDTyGOT8ORmBsbXGYfEXHxXjyq/9wcxNxfldewuPMTw/C+Ea6oxJjJIi3KyJ+0j92i3PUX9gV4/qpPxFUXt9GYnQaKuXSUR6wdueFzbNAPLmUnrKeZr3OLjG0bkndJcOMrTezms523KUTxzVZ1DmxN5XsFSy9DpwnRfxDFY89zG08xqVc1HQtiY2zMpVc8CRxtqczbWB5BWqzVoPVYPIlcj0/HVRNmNDSOqUMbcbIjjvoUrZHm9NtOyz0TlKhIYrmxstDADpcA+6d/w4HT5rjJEADqFP1ZBZRmfFY3CRzMubFPEzco3b80hkDXEuFlA0RkNNREA1Rqvps1w7nsplLGHiw2TFiNPlBKnB0yU17RIPVU+rgRdRLHKF0T/ADmjsbdFYVXT3aTz3UbxWnzxEELfimeXmgRSkEMsLg4Wc3VLKaYxvBYS1h5DY/VJImCCoJHI6jt1W0N2VJsNSdhsVoZkZevhRxc6HEW4XVSOMNQA2MHUNkvoewI0V5rzP4WwsquM8OaG6teXnX+kE/svTAVkOFUughCFMiCEIQAhCEAIQhACEIQAhC1dfKbboCjPHvG4ZWUmExVAL4CZJoxyJAtf4X+aocG8jLH4DkpTx1LVzcRV0ldmbOahwcHX010CikfrkAZckaXA5Knuy2KH2kfni1B00FtrLtNEWty2CaqOqdHLaxIB3B29k/Uzop3NNxl3t3VbLEtj9wVEWTNBNtbWVtQtGQW1VacE03m1t+6tGNtmjovOzfseni1A7RMIOyUM0Gq1BAFui18xuci40UDj2Lc2Yc1xlBBuFza8HZZkbdgvv1Ur0VpUzhJYhN0rB6tLWS+Q9vdI5m2uRoq2aYDdOcrtE31Jzjr7pdO03Jum6bouxNH8GWph3tzCjGJRgMfophVflI52UYxOO8L+dlqxMxeRHRC3xNdMXW1AObuklITnLHEXdsSnEjLOSOdwkEcNpXMIBANwei2x4eXItDwlkdHxvRiSJzrBwJH6dCL/ADXpULzZ4SvfHxfR5WglwLc1+Vj/ALL0kFbEqkZQhCmRBCEIAQhCAEIQgBCEIAXGZhkhewOLC5pGZu47rshAeVPFWR9bxLUPmjayoY90cuS+UlpIuPgFAWtdDNmvZptqN16M8WOCG19LJjdGGtkY288ZNs9gfUO9vn7rz9UZQ1pkYco0FtwqJaLYsTzPcW5mekbmyc8Jk9Zc42YwG/cppnIOWwAsOu/ulVNIGsjhvqXXdZQlwuiXH4fUl6CSufu9xaz2Cm7Ha3TNw3Sfg+H6OEC1ogT7lLqvznQ+XAbSO0BC8ubuR6cVSo44jjUUF4mPHmbW5BN//UEUUd3usO+67N4fiJMlU4nmTeySV2G4S2L1A5euYrqUSS+kdoeMqUvyZT7tUgosXhq42vadCq/jwvDHzWpqhzHf0uH2upJhtNJTuDWvDm9l2VLhz0v9iRTuGhadCklU5rdiAuU7nxwgG9gdL81G8cxN0bC1r8rjuoJezo6l6qzrX41R0hyyzNDjyvqmaXHKacF0Ul/ZMX8Kkxeos6exJ1cAT9k6M4Poo2t/x5bJbbT99VeoQj1kfkm+I5uxJspyk6pJOPNY4dVwxDAqqhnuJBIzcOaV0pczmtDt1dGKW0Uym3qREHN/x8sXNpXDyR+KeCfynSyWzxGLiCtebBrG3+iU8N4VNjWOQU0IGapkDLkXDbnda4o86fS2vBfBhLPU4rLALRNEcbnD9R3I+H3V0Jj4bwCm4bwaLD6YlwaS58hFi9x3P99E+K5KkUsEIQunAQhCAEIQgBCEIAQhCAEIQgGLi6jjr+E8TppHljXU73ZrXtlGb9l5kwHhKTH5KkyTiGGnIzOI3JNgB8l6wnhbPTyQvALJGlrgeYIsqP4BoH0eJ4vhVVFkmgqo3vB5j1D7hZvJbjG0aPGUXOpcK24h4ExHBcj5nMdC/wDK9hKbMMoHPxFkZIBLh8iV6bxHCYsRw/JIwEBx3Gx2BVITYM+h47NGWWa2bNpzG6zRytqmanCNpxLcpWZaeNgFrNASnyw1uZw2HVcoDYgJW9rXDXnyCw9Zslojc8tRiGKx0okEEBOr3ch2HVRXijD5KarrIoxUSVDZ2CAOdmY6MjVxJO+23dWLNQtkcHsDRbuuNVQNnhySQtLrWDsoNvorscklVEZpTqnRDqXCYX4PHUPtFJnysN7Zh1/5Ulw6mfBEBI7Mb8lxjwNzpQ5ws0HmnVzWxMZE0AW6BQk72XWox9U7NMSePw57KpMeq3y4mGvc4RC+YjkFaOISAU77220VV4jcYhnsHC/NTwrbIZNQRLnYdHFw/h1VJPLFSTZvNFMQXM9N2A9STe90wYFh8lbpXRFrgxxeWvILOhv1UiwiZhpBHLGPLcP0tCWSUVIxrzEHAHXK0AAq33S/hD4W92RendKJn0cjzLE2+Qu3HZYkg8qckCwKXfhHnEGy5bC9gu1dGGvAO/NPbZxw0V7jjHfxmpiYSHSBp06WU68McPkwjibDpnlznzOLAOgI1Ki+IQCTidn+lrSVZHAVM+t4upXbtp43Su+Vh9SFp9naSMfoqlJl0hZQELYYAQhCAEIQgBCEIAQhCAEIQgBCEIDCi+L4AxuMHGqRjRO6Ly522t5gBBab9Ra3t7KUKG8ccb0PClGY5Y3T1MrDljBsLdSeSrypOLTJ421JNCqJ7W0Zc9ujyXZfimDFqSnm8mtfTNFRpZ5GoB5JVT4rBW0tFPc+RNE14PYi60xVwfSxFpBba1wvIkz1YRqSf2JIHeoa8k4NFwLHRNdO4ZhdOYdlAsqS+ZvbL7rmZDfZd2tJbe61czlzUypUcSXZdLBI5H2dfe6XlgynMeVykrWlzswbpy0XHssjSGbGQ8UrnNFwByVczWdISdweatXEInOjcMu42Va4xCYK0lo9JPRWYu0SybimOeESOZEGtN29FIWEystpruolhFRldlupXEQ5gI+KT0y2CuJq5gZ0JTRWO8yqaAl1bK6LVNLZTJU5ipYlbK8zSiNOIvho8XncW5i4AZjy0/4VteF+HMZh02KEgvqCI29mt/5P0VP40BM90YI8yVwAJ5WV4+GlDLQcHwRzXzukc7dbcW52ednfrjpf0miEIWw88EIQgBCEIAQhCAEIQgBCEIAQhCA4VDiyneRcG2lhdebvESlqKnFI2MqJaiIlxBLnm1uXqA97WXpR7GvaWuALSLEHYqs/Efgimq8NnxKhhkNW27pLzEi1twCd+WirnGycHWiN+GWLw4hhT8Flfmmon6NJ/Mzlb21HyU0xSFkNGI4xlYDcBeccCxqo4V4gjrYAS+MlsjDs9nMX/vZXpScTYTj2G3pK1jpzY+S42e3rovNzY6do9PDP2rfDvCbOCXQO172TbCS5yXxm+izNGqQ4NdpqtXyADfRcw7TRJ5JM7t/SPquWytRO8gvCX787drpPBiWeQfyHsbe19CFpLUktIvouURNy4KSJUq2d8VxSmipnSPAFhyCr5lTTY1LPaKRgY4hz3gNaPqpcKaOtMrntLgDZuqh2JYX5VZJkBaxxuW30PwVkTtKKpCDDYHyYi7ytYr6HqphE3y2i/RMmHvbTztGUC26f5bSRGRh1G4UZttl2OlGhsxVwMRKaqc3PdK62UPiI5JFBoyQ3DbNJuToNFoxLRlzu3QvwbCIMaxinpwM0mfXtrur5pKWKjpY4IWhscYs0BV14W4BCyB+NGXzHOvHGBsNiT9bfNWYtuCFK2eb5ORSlS4jZCEK8zAhCEAIQhACEIQAhCEAIQhACEIQGAoL4h8Wy8L08DZaJtRQVjHxSEH1NNunSxU6CrrxVwE4lw0K+EuFRQkkBvNjrB37G/uoy4dXTz9jVdhVTUmSlikdG0WBeA12XkDYnXulXB0jI+K6KdoyseXM+bSPuUlOCyPjM7nREEGwJGqUYTA7C8WozKLWla8Aalvq5+6zTVxZpxOpIummOqWg5XglN8JyPHYpc4EtBB5rzGj1ZHSVx8nc3c4D2XGaohic2MyNbfTeyyXZ4SNbhYbhtJVsLpY2ud1IUVoKl04Olpr28xrjztqVkzRuY4FxBI0NkhloBTyFkZc1g2DVr+EkkF2zvHuVYlZpWODV2LoKplNCA4stfU3THXuZNM57diei6zUNRq0zEDu3dNVXTzNcXfiZdrACwH2XVGifxR6hHUNdE8OB1UhpA8Mpn39Mgyn5KDTRVlVVNEtVKGNN/TYXU+wzyzQQlzifLAIJPRSmqSMqe2RrEP5VXNFyDrpDXEswWreN3NDfm4BKayT8RiEr+TnLliFDW4hBS4bh9O+epqZdGMHIDU9twtOJcMWeXWWJ4R8S4hi+HvoJKKJlFRRhjJ2Ny5jfY8r7lWkotwTw0zhTh2Cg9Lpz/ADJ3Dm8/sNlKVvXDzH0EIQunAQhCAEIQgBCEIAQhCAEIQgBCEIAXGaJk8TopGNexwILXC4IXZCAg+O8C0mIQtjoxDTWNy8xh1vYW305lVxH4e1UmEMxzzXvL52GCAC+WIG5c7oSNbKzOM+N4ODoWOfRS1kjm5yyNwblbtcm3v8lAqfxjo8R8vD6XBRFHUPEQLqi4ZfQWFuXRVTiqLcblaHb8rweR0SxrrtGqTGMytsNCRcHuuccpDjG82cN15HT2mLNnXF78wu7HZR6VxYQ5o1JKyCQVw4di1sjbOFykc7DCf8vMF2bIQ8nS3JZdIZBYorJxbQ1VFQSR6AB0um6dkkpsI7DqU6VdO0NzAG45XTLUYiYJGxOOr9AVJbLPfQ3VMDY3X3K7vqzSUAiv63D5LWQBrsz3X03TXPMZqg32V0VZmnOuHSFhcRpclXXwpgsWDYPDI+ECqlZmkeR6tdQ3/jqoTwDw2MRrvx9S3/D07gQ0/qdy+Ct4BbcMK2zzPIyX+KMoQhaDMCEIQGLarKEIAQhCAEIQgBCEIAQhCAEIQgBYKymrHq38Bg9RM11pC3KzXXMdAfhv8EBV/FFWzFscqnyeqBx8tgvf0jT67/FVq7hKfB+LsPq6cZsPdUsc7X/L159lYs0AnY54FjyXOCwAjkF2nkQr54lONGiOmmPsYANuX2WKuk85mdhyyDZJabzaW2S8sX9JOrfbqE7xOjnjJidmI3B3avDyYJ4n+SPTWSM9oZIKp0chjlFilrJQ45lrXUYnbcCzgmn8RLRuyyAlvXoqKss6PwGh5lEeUEjmEgpsRjcNwV3dUMPqB1HRDhmotmc02JPNQrG4ycQitoLhSepq25Xkm2m6YZZIXRebIbm1rlTh0S5Qir35YAP1bJHCBGPNk1J2C51FaJJiTqBskwqg+TM46DdaoqkZJy9mXx4eU7oeFo5X/mqJHSfD8o/8VLVW3hPxZHj+Cz0DsrZaGQhltM8RJsfncfJWStseI86f7MyhCFIiCEIQAhCEAIQhACEIQAhCEAIQhACEXUIx3xI4cwGpq6WorfMqqdoJhiGYucf0g7X632uuXQJbV1cFDSS1VTI2KCJpe97jYABeUeJeNMRxPimrxWKpljY+YmNhdfLH+kW22S7jjxKxTi4uhD/wuHt2poybOI5uPM/ZQPzg8HX1clBy3omkWzwpxIMXpyZHATs/Mw8+4UtiEczBe4J36qhsFxmXCMVhrI7u8s+tpP5mncK9cNmpcSo4qyjmD2PAItuD0I6rXin7KmWJimIObIGjl9Uomhz+phLJOTmmxWuXM2xFiurSd1KUVJUySbW0N8lbXUv+bGJ2f1N0cstq6HEPS14D+bXaFL3Ma4a6lNdbg8VSM4AY8bPGlivPzeCnuBqx+S1qRrNgrLZoy5hOzmnRJnYXiDbiOcEf6mpJhmKV2SZ9I9tZBDIY3a2dcdORCcafiGB78kzTE/m14t91588eTH+yNUZRnxjVUYbibswdIwAdkyVVFOwfzZCbclYj5oZ6YOa5trKvOJcRbHM+KM3tq49F3G23RzJFKNsYppgH5Aeaa8WxA09G8MNnEWFltC4yF0h1uldHw+MYLfNjllfLJkiij3d7fI/Ja4RtmGTpEi8LMQdw/wAUUEj3FsFQ0QS62FnaAn2IBXpkLyvxQyo4Rq6KGoopGxSgnMXXtlI/KRoTrspfw34zSYRisWH8QONVhlS1slNXtHrY08nDmAbjqO61cMci+kJLTVUFZTR1NPKyWGVocx7DcOB2ISpdIghCEAIQhACEIQAhCEAIQhACasWxnD8Eon1eJVcdPC0Xu86nsBuT7Jn4045w/g7DxJP/ADayUHyKdp1d3PQLzNxLxPiPEuJPrMSqHOe6+VuzWDo0cgotnUi0OLvGx72y0fD0XlNILTVTWz/9rdh7lUpUzySyPe8hxJJvuk0lQI9XNuSbXR5rD6rjUbEbqPSSD1NBc4XYTqRyWls8hy6AnTS62JBGW9huCfqk5f5TrBwcx3X9KI6do5GxABx1PNp/vupJwzxRPgFb5ud0lLI60sY2I6joQou4iUhrALuOotsu0bmxhwykX3A/v2XVp2jqPR9BilPiVIyop5GyxPtZ7fsehSnM0kahUZwlxTNw/VgkulopTaVhO1v1DurqgmhqYWT08gfHI3M1zTcWWqE/ZHbFZd0TRxXiLsM4TxCqj9MjYSGnoT6R9045yCOqY+MoZKzhDEoWXz+VmsO1j+yk+CyJ+GbmOocjiHEuJ15aqdV2Fx1o1Y0WGhY6/wB9lXPhrI4ROZbUEjdWQ5+UgljwP9LSVyMVKNMRbW0Q+vrMR4dqPJmDn07/APLeNj2PQqH4piH4hzzfV5uVZ2NCkxPCpaRzZfMc05HGMmx5fVUlikddhte6lrI3RyN1seYOxCw5PG9JXHho+ZyVSHqF7WU4aNXdApjw3i3/AE/iWH1UkRlbFFmLBuQ8G9u/q+irqGtDYwBqToPdTCse4SwguaDDCyJwbtma0NP2XcMe2V5ZaNPFniqPiOpw2Glgcymp2vc1z7Bz3OtfQaACwUZxigdBwfhkstxKyZ7B/wDFwzfcH5rerh/HcR0UABcBd1u17pd4h1UbHYfhsQDfJjMrwORdoB8hf4rQoqMWZhdwH4qY1wmwULHNqqIG4p5th1yncH6dlevC3i7wvxK5kDqn+H1p0MFUQ0E9nbH42PZeQwS0gg2IW73kkSAkO5nuqzh73a5rmhzSCDqCOa3Xh7DeLsdwqwo8VrIQNhHM5tvkVL8I8a+NMPe0S4hHWRDUsqYw6/xFj9UsHrJCpPBP/UFSzeWzGcKdDc2M1M/MP/qf91ZuA8W4FxLHmwvEYZ32zGK9ntHdp1SwP6EIXQCEIQAhCEB4wxnG6/GK2etr53zTPN3SPN/kBsEz+cx7ibC3QD7ru+VnlkE3ud90llaya7rEna9rKsmYcxkocL5SOdkieJITY7ELrkmaXFoJ+Gq188SACQXPMnddQZ0bUGSNrC4g39hZYe1r8xabE23XBzCLuZte1kNmNwNgBY912hf2bBxie17SS0LoHCQF5d/ugENYWt2IvmO/dcz/ACwC112ncW2Q7wUXLXDyydNweSm3AvFxwep/BVsh/BynRx2Y4/sVBmOD7n9Ntt/72Q83cTsCdATdIycXaJWemWPZKwPaQWuFwRzRLCJYXxuGZj2kEe4VZ+HvGYa1mEYlJl1tBK7Yf6SfsrWAAuRpbmtSkpK0CufD6hEdRXNcLOhmdG6w5g2+ynl3M6FQrhVhbxJjrmuIa+reRba91NTc6afBdi9BB5jgCcoOxVb+LeHCWgocTjYAYnmGQga2dqL/ABB+asZj7u79E3cR4SzGeH62gsM8kZyHo8at+oSatUCj8EpJZ6qGreMlNDIHku/WQb5R1/ZP89WBE4uvlvrbc9h3KRvkjo4mwgBuXS3Sy3pnNld5j3Dy4vUXHZqpiqISbYq4bhAxPEMUrbNjgF3/AOlobewUOxWukxTFKitl/NK8ut/SOQ+AsFJMYxSI8Jt8iEQyV0xDrE3cxh1J+OVQlJPVEWCzrbssDdbuA1sCAoHDRbtPVaLYC2t0ApidexJI1uNE40GK1OGzR1FJUSQTMN2ujcWkH3CbM4LALAAdN1u64sLE9L7lQJF6YB4+1VPTxR41h7KqwyumhdkeT1IOh+FlZHD/AIo8LcQyMggrXU9Q/RsVU3ISexuR9V5G8wluWwsNwtoZnQyXB22sV2zh7tusqkPCnxS89seBY9UuLyQKWpldf/scfsfh0V3Xuup2cMoQhdB4UDxuSQ0DYaFaCW/pG1uY2Vh4/wCGVVTwvlo5WzNYL+rQkKB1dHPRu8qoiLHC3JRcWullHF8mQeWL5LLk6HPGXZQAOZ3WHPvaxuRpqN1tG6QWJJ2NlwCZzXxGxOgPIrAaHAkOAPRLHwh4e4aNA1A6/wD6kTmlp19lJMi1QNeW8yugHmbMueQC42ut2vLDoSOtilBMyx+R97XHS66mUvZYc9d1yu0k6Xv3WpBYbckO3QoEjmuaAbFvq05HdXJwDxr/ABOnZheISXqo2+h7jbO3p7qli5psW6G3NdYaiSlmbNC50cjTcPboQuxk4slZcuAXoY5Kp0ofDVzOlbK3UNJcbtPe6mbT5jGuzA3F9Duq24BxqlkoThVSPS4k+rmSpL+Km4drmQTuL6KU/wAt5/SehK0xao6mSHUEFzbe5WznuvYNvfULLHRzQBwN76gha/h3NF2vPpCkdKm8SMElpK9uJ07C2nqX5Xgfpf8A8/7pJR07G00dN11cOpVtYvhzcVw2akla0iRvpdbZw1BVQYY6VuOT00wyvgeWOHcbqqSpkGhhx6rbUVwgiaWxU7TGB3uS4/P7JlS3EmkYnWdpn/8AkkjRe/sqmVmBobhbuOmoPzWmlud1sed1w6jRZCwsg2N0OHRpAvc8ui3zkkZjoFzbveyCfVlB0vookzqCAL/G46rD7ZQ4Ek227LAcMwFhcdt10DQTlGovbMRogZ0pqt8cjHscQ5vfdX3wL4lVNDHSRYnK+ow6cZWvdq6Fw0IB5jt8l55JyusDdoNwplw3NJU4DiEN7/hy2aM9DzUkjh7BhnjqIWTRPbJG9oc1zTcEHYhKFQvhtxtLhWIR0FbO52HT6DMbiFx2I6Dqr5BBFwbhCJ//2SAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA="
	
	        };
	        mockItem.userPictures[otherUser] = {
	            type: "image/jpeg",
	            picture: "http://lp.startapp.com/BreakTheIce/images/bar.jpeg"
	        };
	
	        var paramUserId = getURLParameter('userId');
	        var paramContextId = getURLParameter('conversationId');
	        var currentUser = firstUser;
	        if (paramUserId && paramContextId){
	            currentUser = paramUserId;
	            conversationId = paramContextId;
	            var allConversations = decryptMsg(storage.getItem("SODA_conversations"));
	            mockItem = allConversations[paramContextId];
	            var myNewUser = mockItem.members[0];
	            var redoMembers = mockItem.members.filter(function(elem){
	                if (elem.userId !== paramUserId) {
	                    return true;
	                } else {
	                    myNewUser = elem;
	                }
	            });
	            redoMembers.unshift(myNewUser);
	            mockItem.members = redoMembers;
	        }
	        that.mockContextAndMembers(mockItem);
	        var paramSessionId = getURLParameter('sessionId');
	        if (paramSessionId){
	            sessionId = paramSessionId;
	            var a = decryptMsg(storage.getItem("SODA_ITEM"));
	            if (a && a.hasOwnProperty(paramSessionId) && a[paramSessionId].hasOwnProperty(currentUser)) {
	                payloads[paramSessionId] = a[paramSessionId][currentUser];
	            }
	        }
	        that.setLastLocation({
	            coords: {
	                accuracy: 1194,
	                altitude: null,
	                altitudeAccuracy: null,
	                heading: null,
	                latitude: 37.810977,
	                longitude: -122.477301,
	                speed: null
	            },
	            timestamp: Date.now()
	        });
	    };
	
	    // setLastLocation - Use this function with coords of your choice to alter the last location found.
	    this.setLastLocation = function (myLocation, cb) {
	        if (myLocation) {
	            location = myLocation;
	        } else {
	            if (navigator.geolocation) {
	                navigator.geolocation.getCurrentPosition(function (position) {
	                    location = position;
	                    if (typeof cb === 'function') cb(position);
	                });
	            }
	        }
	    };
	
	    // mockContextAndMembers - Use this function to dictate all meta objects:
	    //      ** context - Make it unique
	    //      ** members array - containing all the users in the conversation - The first one will be the user of this tab.
	    //      ** userPictures object - each key is a userId, each value an object of userPicture: {"picture": ""}.
	    this.mockContextAndMembers = function(details) {
	        if (details.context && details.members && details.members.length > 1) {
	            var context = details.context;
	            if (conversationId !== context){
	                var allConversations = decryptMsg(storage.getItem("SODA_conversations")) || {};
	                if (!allConversations.hasOwnProperty(context)) {
	                    allConversations[context] = details;
	                    storage.setItem("SODA_conversations", encryptMsg(allConversations));
	                }
	            }
	            conversationId = context;
	            me = details.members[0];
	            window.name = me.userId;
	            details.members.shift();
	            contacts = details.members;
	            userPictures = details.userPictures;
	        }
	    };
	}
	
	var BubbleAPI = new SodaSandbox();
	BubbleAPI.init();
	
	//Export sandbox for package usage
	if (typeof module !== 'undefined' && module.exports) {
	    module.exports = BubbleAPI;
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["BubbleSDK"] = __webpack_require__(3);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__webpack_provided_window_dot_BubbleAPI) {'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _SodaMessage = __webpack_require__(4);
	
	var _LeaderBoard = __webpack_require__(6);
	
	var _utils = __webpack_require__(5);
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	//noinspection JSUnusedLocalSymbols
	module.exports = function () {
	    function BubbleSDK() {
	        _classCallCheck(this, BubbleSDK);
	    }
	
	    _createClass(BubbleSDK, null, [{
	        key: '_extractResultFromJson',
	
	
	        //Private functions
	        value: function _extractResultFromJson(json) {
	            return new Promise(function (resolve, reject) {
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
	        }
	    }, {
	        key: '_getPromisedValueFromSdk',
	        value: function _getPromisedValueFromSdk(field, call, args) {
	            var _window$BubbleAPI,
	                _this = this;
	
	            if (typeof args === 'undefined') {
	                args = [];
	            }
	
	            return (0, _utils.parseJSON)((_window$BubbleAPI = __webpack_provided_window_dot_BubbleAPI)[call].apply(_window$BubbleAPI, _toConsumableArray(args))).then(function (sdkResultJson) {
	                return _this._extractResultFromJson(sdkResultJson);
	            }).then(function (resultObj) {
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
	
	    }, {
	        key: 'getMyLastSession',
	        value: function getMyLastSession() {
	            return this._getPromisedValueFromSdk('sessionId', 'getLastSession');
	        }
	
	        /**
	         * Close bubble
	         * {@link https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#bubble-to-sdk}
	         * @returns {Promise.<string>}
	         */
	
	    }, {
	        key: 'closeBubble',
	        value: function closeBubble() {
	            __webpack_provided_window_dot_BubbleAPI.closeBubble();
	            return Promise.resolve('');
	        }
	
	        /**
	         * Get the context of the hosting container (conversation, page, etc.).
	         * You can use this context if you save external state for your bubble per context.
	         * @returns {Promise.<string>}
	         */
	
	    }, {
	        key: 'getContext',
	        value: function getContext() {
	            return this._getPromisedValueFromSdk('context', 'getContext');
	        }
	
	        /**
	         * Get the last payload of a given session
	         * {@link https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getpayload}
	         * @param sessionId
	         * @returns {Promise.<json>}
	         */
	
	    }, {
	        key: 'getPayload',
	        value: function getPayload(sessionId) {
	            return this._getPromisedValueFromSdk('payload', 'getPayload', [sessionId]).then(function (base64Json) {
	                if (base64Json === null) {
	                    return Promise.resolve(null);
	                } else {
	                    return (0, _utils.b64ToUtf8)(base64Json);
	                }
	            }).then(function (jsonAsString) {
	                return (0, _utils.parseJSON)(jsonAsString);
	            });
	        }
	
	        /**
	         * Generate a random session id
	         * @returns {Promise.<string>}
	         */
	
	    }, {
	        key: 'createUniqueSessionIdIfOldNotFound',
	        value: function createUniqueSessionIdIfOldNotFound() {
	            return this.getMyLastSession().catch(function () {
	                return Promise.resolve((0, _utils.generateUUID)());
	            });
	        }
	    }, {
	        key: 'getLastKnownLocation',
	
	
	        /**
	         * Get last known location of the current user (doesn't query the GPS directly)
	         * {@link https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getlastknownlocation}
	         * @returns {Promise.<json>}
	         */
	        value: function getLastKnownLocation() {
	            return this._getPromisedValueFromSdk(null, 'getLastKnownLocation');
	        }
	    }, {
	        key: 'getProductId',
	
	
	        /**
	         * Returns the current bubble's product ID
	         * @returns {Promise.<json>}
	         */
	        value: function getProductId() {
	            return this._getPromisedValueFromSdk('productId', 'getProductId');
	        }
	    }, {
	        key: 'copyToClipboard',
	
	
	        /**
	         * Adds any give text to the device's clipboard, ready for pasting anywhere and outside the app
	         * @param {string} text - The string we want to send to the clipboard
	         * @returns {Promise.<json>}
	         */
	        value: function copyToClipboard(text) {
	            return this._getPromisedValueFromSdk(null, 'copyToClipboard', [text]);
	        }
	    }, {
	        key: 'openInExternalBrowser',
	
	
	        /**
	         * Open a given URL in the device's default web browser
	         * @param {string} URL - The URL to be opened
	         * @returns {Promise.<string>}
	         */
	        value: function openInExternalBrowser(url) {
	            return this._getPromisedValueFromSdk(null, 'openInExternalBrowser', [url]);
	        }
	    }, {
	        key: 'getUserDetails',
	
	
	        /**
	         * Get details of the current user
	         * {@link https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getuserdetails}
	         * @returns {Promise.<json>}
	         */
	        value: function getUserDetails() {
	            return this._getPromisedValueFromSdk(null, 'getUserDetails');
	        }
	    }, {
	        key: 'getFriendsDetails',
	
	
	        /**
	         * Details of all friends active on the current chat. Requires extra permission.
	         * {@link https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getfriendsdetails}
	         * @returns {Promise.<json>}
	         */
	        value: function getFriendsDetails() {
	            return this._getPromisedValueFromSdk(null, 'getFriendsDetails');
	        }
	    }, {
	        key: 'getUserPicture',
	
	
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
	        value: function getUserPicture(userId) {
	            return this._getPromisedValueFromSdk('picture', 'getUserPicture', [userId]);
	        }
	    }, {
	        key: 'getCurrentLocationAsync',
	
	
	        /**
	         * Get active location of the current user (query the GPS directly)
	         * {@link https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getcurrentlocationasync}
	         * @param {function} callback - The callback function
	         */
	        value: function getCurrentLocationAsync(cb) {
	            __webpack_provided_window_dot_BubbleAPI.getCurrentLocationAsync(cb);
	        }
	    }, {
	        key: 'registerToPayloadEvent',
	
	
	        /**
	         * The SDK calls the provided callback function method whenever a new payload is available for the bubble (for example, when a new message arrives)
	         * {@link https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#sdk-to-bubble}
	         * @param {function} callback -  The function that will called on payload event
	         */
	        value: function registerToPayloadEvent(cb) {
	            window.setPayload = function (payload) {
	                try {
	                    var jsonResult = JSON.parse(decodeURIComponent(window.atob(payload)));
	                    cb(jsonResult, null);
	                } catch (e) {
	                    cb(null, e);
	                }
	            };
	        }
	    }, {
	        key: 'registerToBubbleClosedEvent',
	
	
	        /**
	         * The SDK will call the provided callback function when a bubble is being terminated by the container application
	         * {@link https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#sdk-to-bubble}
	         * @param {function} callback - The callback function
	         */
	        value: function registerToBubbleClosedEvent(cb) {
	            window.bubbleClosed = function () {
	                cb();
	            };
	        }
	    }, {
	        key: 'getMessageInstance',
	
	
	        //Services
	
	        /**
	         * Returns a new instance of the SodaMessage class
	         * @param {string} sessionId
	         * @returns {SodaMessage}
	         */
	        value: function getMessageInstance(sessionId) {
	            return new _SodaMessage.SodaMessage(sessionId);
	        }
	    }, {
	        key: 'getLeaderboardInstance',
	
	
	        /**
	         * Returns a new instance of LeaderBoard class
	         * @param {string} bubbleId
	         * @param {string} productId - Decided an supplied by StartApp
	         * @param {string} contextId - The context id
	         * @param {enum} order - asc/desc string. Dictates what accounts for a better score - lower or higher numbers
	         * @returns {LeaderBoard}
	         */
	        value: function getLeaderboardInstance(bubbleId, productId, contextId, order) {
	            return new _LeaderBoard.LeaderBoard(bubbleId, productId, contextId, order);
	        }
	    }]);
	
	    return BubbleSDK;
	}();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__webpack_provided_window_dot_BubbleAPI) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.SodaMessage = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _utils = __webpack_require__(5);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var SodaMessage = exports.SodaMessage = function () {
	
	    /**
	     * Creates an instance of SodaMessage
	     * {@link https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#the-msg-json-object}
	     * @constructor
	     * @param {string} sessionId
	     */
	    function SodaMessage(sessionId) {
	        _classCallCheck(this, SodaMessage);
	
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
	
	    _createClass(SodaMessage, [{
	        key: 'toObject',
	        value: function toObject() {
	            var res = {};
	            for (var prop in this) {
	                if (this.hasOwnProperty(prop) && !(0, _utils.isInArray)(prop, ['toObject', 'toString', 'success', 'msg']) && this[prop] !== null) {
	                    res[prop] = this[prop];
	                }
	            }
	
	            return res;
	        }
	    }, {
	        key: 'toString',
	        value: function toString() {
	            return (0, _utils.stringifyJSON)(this.toObject()).then(function (str) {
	                return str;
	            });
	        }
	    }]);
	
	    return SodaMessage;
	}();
	
	/**
	 * The session Id of your message
	 * @param {string} sessionId
	 * @returns {SodaMessage}
	 */
	
	
	SodaMessage.prototype.setSessionId = function (sessionId) {
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
	SodaMessage.prototype.setPriority = function (priority) {
	    this.priority = priority;
	    return this;
	};
	
	/**
	 * The message content
	 * @param {string} payload
	 * @returns {SodaMessage}
	 */
	SodaMessage.prototype.setPayload = function (payload) {
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
	SodaMessage.prototype.setActionType = function (actionType) {
	    var ACTION_TYPES = ['OPEN', 'PLAY', 'INSTALL', 'ACCEPT', 'DOWNLOAD', 'PAY NOW', 'SHOP NOW', 'SIGN UP', 'BOOK NOW', 'VOTE'];
	
	    if (actionType === null || (0, _utils.isInArray)(actionType, ACTION_TYPES)) {
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
	SodaMessage.prototype.setTitle = function (title) {
	    this.title = title;
	    return this;
	};
	
	/**
	 * The notification sub-title
	 * @param {string} subTitle
	 * @returns {SodaMessage}
	 */
	SodaMessage.prototype.setSubTitle = function (subTitle) {
	    this.subTitle = subTitle;
	    return this;
	};
	
	/**
	 * The notification text
	 * @param {string} text
	 * @returns {SodaMessage}
	 */
	SodaMessage.prototype.setText = function (text) {
	    this.text = text;
	    return this;
	};
	
	/**
	 * The URL for a notification preview icon (square)
	 * @param {string} iconUrl
	 * @returns {SodaMessage}
	 */
	SodaMessage.prototype.setIconUrl = function (iconUrl) {
	    this.iconUrl = iconUrl;
	    return this;
	};
	
	/**
	 * The URL for a notification preview banner
	 * @param {string} bannerUrl
	 * @returns {SodaMessage}
	 */
	SodaMessage.prototype.setBannerUrl = function (bannerUrl) {
	    this.bannerUrl = bannerUrl;
	    return this;
	};
	
	/**
	 * The "base URL" of the Bubble. This URL will be used by the SDK to open the Bubble on the other side. Leave this parameter blank to use the bubble's default URL.
	 * @param {string} bubbleAppUrl
	 * @returns {SodaMessage}
	 */
	SodaMessage.prototype.setBubbleAppUrl = function (bubbleAppUrl) {
	    this.bubbleAppUrl = bubbleAppUrl;
	    return this;
	};
	
	/**
	 * Use this parameter to ask the container application to override the last native massage with new data.
	 * @param {string} updateMsg
	 * @returns {SodaMessage}
	 */
	SodaMessage.prototype.setUpdateMsg = function (updateMsg) {
	    this.updateMsg = updateMsg;
	    return this;
	};
	
	/**
	 * After the message values are set - execute this function to actually send it locally
	 * @returns {Promise}
	 */
	SodaMessage.prototype.sendLocalMessage = function () {
	    var _this = this;
	
	    return new Promise(function (resolve, reject) {
	        if (!_this.success) return reject(new Error(_this.msg));
	        (0, _utils.stringifyJSON)(_this.toObject()).then(function (metadata) {
	            __webpack_provided_window_dot_BubbleAPI.sendLocalMessage(metadata);
	        });
	    });
	};
	
	/**
	 *  After the message values are set - execute this function to actually send it locally
	 * @returns {Promise}
	 */
	SodaMessage.prototype.sendRemoteMessage = function () {
	    var _this2 = this;
	
	    return new Promise(function (resolve, reject) {
	        if (!_this2.success) return reject(new Error(_this2.msg));
	        (0, _utils.stringifyJSON)(_this2.toObject()).then(function (metadata) {
	            __webpack_provided_window_dot_BubbleAPI.sendMessage(metadata);
	        });
	    });
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.utf8ToB64 = utf8ToB64;
	exports.b64ToUtf8 = b64ToUtf8;
	exports.stringifyJSON = stringifyJSON;
	exports.parseJSON = parseJSON;
	exports.generateUUID = generateUUID;
	exports.isInArray = isInArray;
	function utf8ToB64(str) {
	    return new Promise(function (resolve, reject) {
	        try {
	            resolve(window.btoa(encodeURIComponent(str)));
	        } catch (e) {
	            reject(e);
	        }
	    });
	}
	
	function b64ToUtf8(str) {
	    return new Promise(function (resolve, reject) {
	        try {
	            resolve(decodeURIComponent(window.atob(str)));
	        } catch (e) {
	            reject(e);
	        }
	    });
	}
	
	function stringifyJSON(json) {
	    return new Promise(function (resolve, reject) {
	        try {
	            resolve(JSON.stringify(json));
	        } catch (e) {
	            reject(e);
	        }
	    });
	}
	
	function parseJSON(str) {
	    return new Promise(function (resolve, reject) {
	        try {
	            resolve(JSON.parse(str));
	        } catch (e) {
	            reject(e);
	        }
	    });
	}
	
	function generateUUID() {
	    var uuid = void 0;
	    var d = new Date().getTime();
	    //noinspection JSUnresolvedVariable
	    if (window.performance && typeof window.performance.now === 'function') {
	        //noinspection JSUnresolvedVariable
	        d += window.performance.now(); //use high-precision timer if available
	    }
	    //noinspection SpellCheckingInspection
	    uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	        var r = (d + Math.random() * 16) % 16 | 0;
	        d = Math.floor(d / 16);
	        return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
	    });
	    return uuid;
	}
	
	function isInArray(value, array) {
	    return array.indexOf(value) > -1;
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var reqwest = __webpack_require__(7);
	
	var LeaderBoard =
	
	/**
	 * Constructor of Leaderboard
	 * @constructor
	 * @param {string} bubbleId
	 * @param {string} productId - Decided an supplied by StartApp
	 * @param {string} contextId - The context id
	 * @param {enum} order - asc/desc string. Dictates what accounts for a better score - lower or higher numbers
	 */
	exports.LeaderBoard = function LeaderBoard(bubbleId, productId, contextId) {
	    var order = arguments.length <= 3 || arguments[3] === undefined ? 'asc' : arguments[3];
	
	    _classCallCheck(this, LeaderBoard);
	
	    this.bubbleId = bubbleId;
	    this.productId = productId;
	    this.contextId = contextId;
	    this.ascending = order === 'asc';
	};
	
	/**
	 * Return the board of a specific context
	 * @returns {Promise}
	 */
	
	
	LeaderBoard.prototype.getBoard = function () {
	    var _this = this;
	
	    return new Promise(function (resolve, reject) {
	        reqwest({
	            url: 'https://leaderboard.startappnetwork.com/leaderboard-service/leaderboard/getboard',
	            method: 'get',
	            data: {
	                bubbleId: _this.bubbleId,
	                productId: _this.productId,
	                contextId: _this.contextId
	            },
	            success: function success(resp) {
	                resolve(resp);
	            },
	            error: function error(err) {
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
	LeaderBoard.prototype.getUserBestScore = function (userId) {
	    var _this2 = this;
	
	    return new Promise(function (resolve, reject) {
	        reqwest({
	            url: 'https://leaderboard.startappnetwork.com/leaderboard-service/leaderboard/getuserbestscore',
	            method: 'get',
	            data: {
	                bubbleId: _this2.bubbleId,
	                productId: _this2.productId,
	                userId: userId
	            },
	            success: function success(resp) {
	                resolve(resp);
	            },
	            error: function error(err) {
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
	LeaderBoard.prototype.submitScore = function (userId, userName, score) {
	    var _this3 = this;
	
	    return new Promise(function (resolve, reject) {
	
	        reqwest({
	            url: 'https://leaderboard.startappnetwork.com/leaderboard-service/leaderboard/submitscore',
	            method: 'POST',
	            crossOrigin: true,
	            processData: false,
	            headers: {
	                'Accept': 'application/json',
	                'Content-Type': 'application/json'
	            },
	            data: JSON.stringify({
	                bubbleId: _this3.bubbleId,
	                productId: _this3.productId,
	                contextId: _this3.contextId,
	                userId: userId,
	                userName: userName,
	                score: score,
	                ascending: _this3.ascending
	            }),
	            success: function success(resp) {
	                resolve(resp);
	            },
	            error: function error(err) {
	                reject(err);
	            }
	        });
	    });
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  * Reqwest! A general purpose XHR connection manager
	  * license MIT (c) Dustin Diaz 2015
	  * https://github.com/ded/reqwest
	  */
	
	!function (name, context, definition) {
	  if (typeof module != 'undefined' && module.exports) module.exports = definition()
	  else if (true) !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	  else context[name] = definition()
	}('reqwest', this, function () {
	
	  var context = this
	
	  if ('window' in context) {
	    var doc = document
	      , byTag = 'getElementsByTagName'
	      , head = doc[byTag]('head')[0]
	  } else {
	    var XHR2
	    try {
	      XHR2 = __webpack_require__(8)
	    } catch (ex) {
	      throw new Error('Peer dependency `xhr2` required! Please npm install xhr2')
	    }
	  }
	
	
	  var httpsRe = /^http/
	    , protocolRe = /(^\w+):\/\//
	    , twoHundo = /^(20\d|1223)$/ //http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
	    , readyState = 'readyState'
	    , contentType = 'Content-Type'
	    , requestedWith = 'X-Requested-With'
	    , uniqid = 0
	    , callbackPrefix = 'reqwest_' + (+new Date())
	    , lastValue // data stored by the most recent JSONP callback
	    , xmlHttpRequest = 'XMLHttpRequest'
	    , xDomainRequest = 'XDomainRequest'
	    , noop = function () {}
	
	    , isArray = typeof Array.isArray == 'function'
	        ? Array.isArray
	        : function (a) {
	            return a instanceof Array
	          }
	
	    , defaultHeaders = {
	          'contentType': 'application/x-www-form-urlencoded'
	        , 'requestedWith': xmlHttpRequest
	        , 'accept': {
	              '*':  'text/javascript, text/html, application/xml, text/xml, */*'
	            , 'xml':  'application/xml, text/xml'
	            , 'html': 'text/html'
	            , 'text': 'text/plain'
	            , 'json': 'application/json, text/javascript'
	            , 'js':   'application/javascript, text/javascript'
	          }
	      }
	
	    , xhr = function(o) {
	        // is it x-domain
	        if (o['crossOrigin'] === true) {
	          var xhr = context[xmlHttpRequest] ? new XMLHttpRequest() : null
	          if (xhr && 'withCredentials' in xhr) {
	            return xhr
	          } else if (context[xDomainRequest]) {
	            return new XDomainRequest()
	          } else {
	            throw new Error('Browser does not support cross-origin requests')
	          }
	        } else if (context[xmlHttpRequest]) {
	          return new XMLHttpRequest()
	        } else if (XHR2) {
	          return new XHR2()
	        } else {
	          return new ActiveXObject('Microsoft.XMLHTTP')
	        }
	      }
	    , globalSetupOptions = {
	        dataFilter: function (data) {
	          return data
	        }
	      }
	
	  function succeed(r) {
	    var protocol = protocolRe.exec(r.url)
	    protocol = (protocol && protocol[1]) || context.location.protocol
	    return httpsRe.test(protocol) ? twoHundo.test(r.request.status) : !!r.request.response
	  }
	
	  function handleReadyState(r, success, error) {
	    return function () {
	      // use _aborted to mitigate against IE err c00c023f
	      // (can't read props on aborted request objects)
	      if (r._aborted) return error(r.request)
	      if (r._timedOut) return error(r.request, 'Request is aborted: timeout')
	      if (r.request && r.request[readyState] == 4) {
	        r.request.onreadystatechange = noop
	        if (succeed(r)) success(r.request)
	        else
	          error(r.request)
	      }
	    }
	  }
	
	  function setHeaders(http, o) {
	    var headers = o['headers'] || {}
	      , h
	
	    headers['Accept'] = headers['Accept']
	      || defaultHeaders['accept'][o['type']]
	      || defaultHeaders['accept']['*']
	
	    var isAFormData = typeof FormData !== 'undefined' && (o['data'] instanceof FormData);
	    // breaks cross-origin requests with legacy browsers
	    if (!o['crossOrigin'] && !headers[requestedWith]) headers[requestedWith] = defaultHeaders['requestedWith']
	    if (!headers[contentType] && !isAFormData) headers[contentType] = o['contentType'] || defaultHeaders['contentType']
	    for (h in headers)
	      headers.hasOwnProperty(h) && 'setRequestHeader' in http && http.setRequestHeader(h, headers[h])
	  }
	
	  function setCredentials(http, o) {
	    if (typeof o['withCredentials'] !== 'undefined' && typeof http.withCredentials !== 'undefined') {
	      http.withCredentials = !!o['withCredentials']
	    }
	  }
	
	  function generalCallback(data) {
	    lastValue = data
	  }
	
	  function urlappend (url, s) {
	    return url + (/\?/.test(url) ? '&' : '?') + s
	  }
	
	  function handleJsonp(o, fn, err, url) {
	    var reqId = uniqid++
	      , cbkey = o['jsonpCallback'] || 'callback' // the 'callback' key
	      , cbval = o['jsonpCallbackName'] || reqwest.getcallbackPrefix(reqId)
	      , cbreg = new RegExp('((^|\\?|&)' + cbkey + ')=([^&]+)')
	      , match = url.match(cbreg)
	      , script = doc.createElement('script')
	      , loaded = 0
	      , isIE10 = navigator.userAgent.indexOf('MSIE 10.0') !== -1
	
	    if (match) {
	      if (match[3] === '?') {
	        url = url.replace(cbreg, '$1=' + cbval) // wildcard callback func name
	      } else {
	        cbval = match[3] // provided callback func name
	      }
	    } else {
	      url = urlappend(url, cbkey + '=' + cbval) // no callback details, add 'em
	    }
	
	    context[cbval] = generalCallback
	
	    script.type = 'text/javascript'
	    script.src = url
	    script.async = true
	    if (typeof script.onreadystatechange !== 'undefined' && !isIE10) {
	      // need this for IE due to out-of-order onreadystatechange(), binding script
	      // execution to an event listener gives us control over when the script
	      // is executed. See http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
	      script.htmlFor = script.id = '_reqwest_' + reqId
	    }
	
	    script.onload = script.onreadystatechange = function () {
	      if ((script[readyState] && script[readyState] !== 'complete' && script[readyState] !== 'loaded') || loaded) {
	        return false
	      }
	      script.onload = script.onreadystatechange = null
	      script.onclick && script.onclick()
	      // Call the user callback with the last value stored and clean up values and scripts.
	      fn(lastValue)
	      lastValue = undefined
	      head.removeChild(script)
	      loaded = 1
	    }
	
	    // Add the script to the DOM head
	    head.appendChild(script)
	
	    // Enable JSONP timeout
	    return {
	      abort: function () {
	        script.onload = script.onreadystatechange = null
	        err({}, 'Request is aborted: timeout', {})
	        lastValue = undefined
	        head.removeChild(script)
	        loaded = 1
	      }
	    }
	  }
	
	  function getRequest(fn, err) {
	    var o = this.o
	      , method = (o['method'] || 'GET').toUpperCase()
	      , url = typeof o === 'string' ? o : o['url']
	      // convert non-string objects to query-string form unless o['processData'] is false
	      , data = (o['processData'] !== false && o['data'] && typeof o['data'] !== 'string')
	        ? reqwest.toQueryString(o['data'])
	        : (o['data'] || null)
	      , http
	      , sendWait = false
	
	    // if we're working on a GET request and we have data then we should append
	    // query string to end of URL and not post data
	    if ((o['type'] == 'jsonp' || method == 'GET') && data) {
	      url = urlappend(url, data)
	      data = null
	    }
	
	    if (o['type'] == 'jsonp') return handleJsonp(o, fn, err, url)
	
	    // get the xhr from the factory if passed
	    // if the factory returns null, fall-back to ours
	    http = (o.xhr && o.xhr(o)) || xhr(o)
	
	    http.open(method, url, o['async'] === false ? false : true)
	    setHeaders(http, o)
	    setCredentials(http, o)
	    if (context[xDomainRequest] && http instanceof context[xDomainRequest]) {
	        http.onload = fn
	        http.onerror = err
	        // NOTE: see
	        // http://social.msdn.microsoft.com/Forums/en-US/iewebdevelopment/thread/30ef3add-767c-4436-b8a9-f1ca19b4812e
	        http.onprogress = function() {}
	        sendWait = true
	    } else {
	      http.onreadystatechange = handleReadyState(this, fn, err)
	    }
	    o['before'] && o['before'](http)
	    if (sendWait) {
	      setTimeout(function () {
	        http.send(data)
	      }, 200)
	    } else {
	      http.send(data)
	    }
	    return http
	  }
	
	  function Reqwest(o, fn) {
	    this.o = o
	    this.fn = fn
	
	    init.apply(this, arguments)
	  }
	
	  function setType(header) {
	    // json, javascript, text/plain, text/html, xml
	    if (header === null) return undefined; //In case of no content-type.
	    if (header.match('json')) return 'json'
	    if (header.match('javascript')) return 'js'
	    if (header.match('text')) return 'html'
	    if (header.match('xml')) return 'xml'
	  }
	
	  function init(o, fn) {
	
	    this.url = typeof o == 'string' ? o : o['url']
	    this.timeout = null
	
	    // whether request has been fulfilled for purpose
	    // of tracking the Promises
	    this._fulfilled = false
	    // success handlers
	    this._successHandler = function(){}
	    this._fulfillmentHandlers = []
	    // error handlers
	    this._errorHandlers = []
	    // complete (both success and fail) handlers
	    this._completeHandlers = []
	    this._erred = false
	    this._responseArgs = {}
	
	    var self = this
	
	    fn = fn || function () {}
	
	    if (o['timeout']) {
	      this.timeout = setTimeout(function () {
	        timedOut()
	      }, o['timeout'])
	    }
	
	    if (o['success']) {
	      this._successHandler = function () {
	        o['success'].apply(o, arguments)
	      }
	    }
	
	    if (o['error']) {
	      this._errorHandlers.push(function () {
	        o['error'].apply(o, arguments)
	      })
	    }
	
	    if (o['complete']) {
	      this._completeHandlers.push(function () {
	        o['complete'].apply(o, arguments)
	      })
	    }
	
	    function complete (resp) {
	      o['timeout'] && clearTimeout(self.timeout)
	      self.timeout = null
	      while (self._completeHandlers.length > 0) {
	        self._completeHandlers.shift()(resp)
	      }
	    }
	
	    function success (resp) {
	      var type = o['type'] || resp && setType(resp.getResponseHeader('Content-Type')) // resp can be undefined in IE
	      resp = (type !== 'jsonp') ? self.request : resp
	      // use global data filter on response text
	      var filteredResponse = globalSetupOptions.dataFilter(resp.responseText, type)
	        , r = filteredResponse
	      try {
	        resp.responseText = r
	      } catch (e) {
	        // can't assign this in IE<=8, just ignore
	      }
	      if (r) {
	        switch (type) {
	        case 'json':
	          try {
	            resp = context.JSON ? context.JSON.parse(r) : eval('(' + r + ')')
	          } catch (err) {
	            return error(resp, 'Could not parse JSON in response', err)
	          }
	          break
	        case 'js':
	          resp = eval(r)
	          break
	        case 'html':
	          resp = r
	          break
	        case 'xml':
	          resp = resp.responseXML
	              && resp.responseXML.parseError // IE trololo
	              && resp.responseXML.parseError.errorCode
	              && resp.responseXML.parseError.reason
	            ? null
	            : resp.responseXML
	          break
	        }
	      }
	
	      self._responseArgs.resp = resp
	      self._fulfilled = true
	      fn(resp)
	      self._successHandler(resp)
	      while (self._fulfillmentHandlers.length > 0) {
	        resp = self._fulfillmentHandlers.shift()(resp)
	      }
	
	      complete(resp)
	    }
	
	    function timedOut() {
	      self._timedOut = true
	      self.request.abort()
	    }
	
	    function error(resp, msg, t) {
	      resp = self.request
	      self._responseArgs.resp = resp
	      self._responseArgs.msg = msg
	      self._responseArgs.t = t
	      self._erred = true
	      while (self._errorHandlers.length > 0) {
	        self._errorHandlers.shift()(resp, msg, t)
	      }
	      complete(resp)
	    }
	
	    this.request = getRequest.call(this, success, error)
	  }
	
	  Reqwest.prototype = {
	    abort: function () {
	      this._aborted = true
	      this.request.abort()
	    }
	
	  , retry: function () {
	      init.call(this, this.o, this.fn)
	    }
	
	    /**
	     * Small deviation from the Promises A CommonJs specification
	     * http://wiki.commonjs.org/wiki/Promises/A
	     */
	
	    /**
	     * `then` will execute upon successful requests
	     */
	  , then: function (success, fail) {
	      success = success || function () {}
	      fail = fail || function () {}
	      if (this._fulfilled) {
	        this._responseArgs.resp = success(this._responseArgs.resp)
	      } else if (this._erred) {
	        fail(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
	      } else {
	        this._fulfillmentHandlers.push(success)
	        this._errorHandlers.push(fail)
	      }
	      return this
	    }
	
	    /**
	     * `always` will execute whether the request succeeds or fails
	     */
	  , always: function (fn) {
	      if (this._fulfilled || this._erred) {
	        fn(this._responseArgs.resp)
	      } else {
	        this._completeHandlers.push(fn)
	      }
	      return this
	    }
	
	    /**
	     * `fail` will execute when the request fails
	     */
	  , fail: function (fn) {
	      if (this._erred) {
	        fn(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
	      } else {
	        this._errorHandlers.push(fn)
	      }
	      return this
	    }
	  , 'catch': function (fn) {
	      return this.fail(fn)
	    }
	  }
	
	  function reqwest(o, fn) {
	    return new Reqwest(o, fn)
	  }
	
	  // normalize newline variants according to spec -> CRLF
	  function normalize(s) {
	    return s ? s.replace(/\r?\n/g, '\r\n') : ''
	  }
	
	  function serial(el, cb) {
	    var n = el.name
	      , t = el.tagName.toLowerCase()
	      , optCb = function (o) {
	          // IE gives value="" even where there is no value attribute
	          // 'specified' ref: http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-862529273
	          if (o && !o['disabled'])
	            cb(n, normalize(o['attributes']['value'] && o['attributes']['value']['specified'] ? o['value'] : o['text']))
	        }
	      , ch, ra, val, i
	
	    // don't serialize elements that are disabled or without a name
	    if (el.disabled || !n) return
	
	    switch (t) {
	    case 'input':
	      if (!/reset|button|image|file/i.test(el.type)) {
	        ch = /checkbox/i.test(el.type)
	        ra = /radio/i.test(el.type)
	        val = el.value
	        // WebKit gives us "" instead of "on" if a checkbox has no value, so correct it here
	        ;(!(ch || ra) || el.checked) && cb(n, normalize(ch && val === '' ? 'on' : val))
	      }
	      break
	    case 'textarea':
	      cb(n, normalize(el.value))
	      break
	    case 'select':
	      if (el.type.toLowerCase() === 'select-one') {
	        optCb(el.selectedIndex >= 0 ? el.options[el.selectedIndex] : null)
	      } else {
	        for (i = 0; el.length && i < el.length; i++) {
	          el.options[i].selected && optCb(el.options[i])
	        }
	      }
	      break
	    }
	  }
	
	  // collect up all form elements found from the passed argument elements all
	  // the way down to child elements; pass a '<form>' or form fields.
	  // called with 'this'=callback to use for serial() on each element
	  function eachFormElement() {
	    var cb = this
	      , e, i
	      , serializeSubtags = function (e, tags) {
	          var i, j, fa
	          for (i = 0; i < tags.length; i++) {
	            fa = e[byTag](tags[i])
	            for (j = 0; j < fa.length; j++) serial(fa[j], cb)
	          }
	        }
	
	    for (i = 0; i < arguments.length; i++) {
	      e = arguments[i]
	      if (/input|select|textarea/i.test(e.tagName)) serial(e, cb)
	      serializeSubtags(e, [ 'input', 'select', 'textarea' ])
	    }
	  }
	
	  // standard query string style serialization
	  function serializeQueryString() {
	    return reqwest.toQueryString(reqwest.serializeArray.apply(null, arguments))
	  }
	
	  // { 'name': 'value', ... } style serialization
	  function serializeHash() {
	    var hash = {}
	    eachFormElement.apply(function (name, value) {
	      if (name in hash) {
	        hash[name] && !isArray(hash[name]) && (hash[name] = [hash[name]])
	        hash[name].push(value)
	      } else hash[name] = value
	    }, arguments)
	    return hash
	  }
	
	  // [ { name: 'name', value: 'value' }, ... ] style serialization
	  reqwest.serializeArray = function () {
	    var arr = []
	    eachFormElement.apply(function (name, value) {
	      arr.push({name: name, value: value})
	    }, arguments)
	    return arr
	  }
	
	  reqwest.serialize = function () {
	    if (arguments.length === 0) return ''
	    var opt, fn
	      , args = Array.prototype.slice.call(arguments, 0)
	
	    opt = args.pop()
	    opt && opt.nodeType && args.push(opt) && (opt = null)
	    opt && (opt = opt.type)
	
	    if (opt == 'map') fn = serializeHash
	    else if (opt == 'array') fn = reqwest.serializeArray
	    else fn = serializeQueryString
	
	    return fn.apply(null, args)
	  }
	
	  reqwest.toQueryString = function (o, trad) {
	    var prefix, i
	      , traditional = trad || false
	      , s = []
	      , enc = encodeURIComponent
	      , add = function (key, value) {
	          // If value is a function, invoke it and return its value
	          value = ('function' === typeof value) ? value() : (value == null ? '' : value)
	          s[s.length] = enc(key) + '=' + enc(value)
	        }
	    // If an array was passed in, assume that it is an array of form elements.
	    if (isArray(o)) {
	      for (i = 0; o && i < o.length; i++) add(o[i]['name'], o[i]['value'])
	    } else {
	      // If traditional, encode the "old" way (the way 1.3.2 or older
	      // did it), otherwise encode params recursively.
	      for (prefix in o) {
	        if (o.hasOwnProperty(prefix)) buildParams(prefix, o[prefix], traditional, add)
	      }
	    }
	
	    // spaces should be + according to spec
	    return s.join('&').replace(/%20/g, '+')
	  }
	
	  function buildParams(prefix, obj, traditional, add) {
	    var name, i, v
	      , rbracket = /\[\]$/
	
	    if (isArray(obj)) {
	      // Serialize array item.
	      for (i = 0; obj && i < obj.length; i++) {
	        v = obj[i]
	        if (traditional || rbracket.test(prefix)) {
	          // Treat each array item as a scalar.
	          add(prefix, v)
	        } else {
	          buildParams(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v, traditional, add)
	        }
	      }
	    } else if (obj && obj.toString() === '[object Object]') {
	      // Serialize object item.
	      for (name in obj) {
	        buildParams(prefix + '[' + name + ']', obj[name], traditional, add)
	      }
	
	    } else {
	      // Serialize scalar item.
	      add(prefix, obj)
	    }
	  }
	
	  reqwest.getcallbackPrefix = function () {
	    return callbackPrefix
	  }
	
	  // jQuery and Zepto compatibility, differences can be remapped here so you can call
	  // .ajax.compat(options, callback)
	  reqwest.compat = function (o, fn) {
	    if (o) {
	      o['type'] && (o['method'] = o['type']) && delete o['type']
	      o['dataType'] && (o['type'] = o['dataType'])
	      o['jsonpCallback'] && (o['jsonpCallbackName'] = o['jsonpCallback']) && delete o['jsonpCallback']
	      o['jsonp'] && (o['jsonpCallback'] = o['jsonp'])
	    }
	    return new Reqwest(o, fn)
	  }
	
	  reqwest.ajaxSetup = function (options) {
	    options = options || {}
	    for (var k in options) {
	      globalSetupOptions[k] = options[k]
	    }
	  }
	
	  return reqwest
	});


/***/ },
/* 8 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ }
/******/ ]);
//# sourceMappingURL=BubblesSDK.js.map
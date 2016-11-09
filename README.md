# Overview
Bubbles are “mini apps” that live inside a hosted app and provide an on-demand experience. 

This document contains all the relevant information and API’s in order to enable a Bubble developer to develop a Bubble, using SODA platform.

# Definitions
**Container Application -** The hosting application that embeds StartApp SDK. The application controls the position and size of the Bubble's view in addition to Bubble’s discovery.

**StartApp SDK -** StartApp Software Development Kit. A reusable library integrated into the container app to enable StartApp Bubbles. (communication, persistence, life cycle, etc.)

**Bubble App -** Bubble App - An HTML based application that sits elegantly inside the container application.
For example: A social game, service application, etc.



# bubble-sdk
This is a Promise based interface to the SDK's BubbleAPI

To use with any bubble just use the minified bubelified version in:
public/assets/BubbleSDK.min.js

If you want to compile the entire thing for development:
`npm run dev-build` or `npm run win-build` on Windows

**Usage examples:**  
*Get last payload.*
~~~~
BubbleSDK.getLastSession()
  .then(function(sessionId) {
      return BubbleSDK.getPayload(sessionId);
  }).then(function(payloadObj) {
      ... Do something with the payload
  }).catch(function(error) {
      ... Do something with the error
  });
~~~~


*Create a new message and send it.*
~~~~
let a = BubbleSDK.getMessageInstance('abcd-1234');
a.setPriority(1).setPayload({a:1, b:'hello'});
a.sendRemoteMessage()
  .then(function() {
      ... Do something on success
  }).catch(function(error) {
      ... Do something with the error
  });
~~~~

### [Click here for full API documentation](API.md)

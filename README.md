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
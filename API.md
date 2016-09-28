## Classes

<dl>
<dt><a href="#LeaderBoard">LeaderBoard</a></dt>
<dd></dd>
<dt><a href="#SodaMessage">SodaMessage</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#getMyLastSession">getMyLastSession()</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Get the last received sessionId.
You can use this id to restore the last payload in case the bubble was lunched without a sessionId
<a href="https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getlastsession">https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getlastsession</a></p>
</dd>
<dt><a href="#closeBubble">closeBubble()</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Close bubble
<a href="https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#bubble-to-sdk">https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#bubble-to-sdk</a></p>
</dd>
<dt><a href="#getContext">getContext()</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Get the context of the hosting container (conversation, page, etc.).
You can use this context if you save external state for your bubble per context.</p>
</dd>
<dt><a href="#getPayload">getPayload(sessionId)</a> ⇒ <code>Promise.&lt;json&gt;</code></dt>
<dd><p>Get the last payload of a given session
<a href="https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getpayload">https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getpayload</a></p>
</dd>
<dt><a href="#createUniqueSessionIdIfOldNotFound">createUniqueSessionIdIfOldNotFound()</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Generate a random session id</p>
</dd>
<dt><a href="#getLastKnownLocation">getLastKnownLocation()</a> ⇒ <code>Promise.&lt;json&gt;</code></dt>
<dd><p>Get last known location of the current user (doesn&#39;t query the GPS directly)
<a href="https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getlastknownlocation">https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getlastknownlocation</a></p>
</dd>
<dt><a href="#getProductId">getProductId()</a> ⇒ <code>Promise.&lt;json&gt;</code></dt>
<dd><p>Returns the current bubble&#39;s product ID</p>
</dd>
<dt><a href="#copyToClipboard">copyToClipboard(text)</a> ⇒ <code>Promise.&lt;json&gt;</code></dt>
<dd><p>Adds any give text to the device&#39;s clipboard, ready for pasting anywhere and outside the app</p>
</dd>
<dt><a href="#openInExternalBrowser">openInExternalBrowser(URL)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Open a given URL in the device&#39;s default web browser</p>
</dd>
<dt><a href="#getUserDetails">getUserDetails()</a> ⇒ <code>Promise.&lt;json&gt;</code></dt>
<dd><p>Get details of the current user
<a href="https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getuserdetails">https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getuserdetails</a></p>
</dd>
<dt><a href="#getFriendsDetails">getFriendsDetails()</a> ⇒ <code>Promise.&lt;json&gt;</code></dt>
<dd><p>Details of all friends active on the current chat. Requires extra permission.
<a href="https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getfriendsdetails">https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getfriendsdetails</a></p>
</dd>
<dt><a href="#getUserPicture">getUserPicture(userId)</a> ⇒ <code>Promise.&lt;json&gt;</code></dt>
<dd><p>Get user profile picture
Might be returned using the following sources:</p>
<ol>
<li>base64 encoded image</li>
<li>image URL</li>
<li>path to a local picture
<a href="https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getuserpicture">https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getuserpicture</a></li>
</ol>
</dd>
<dt><a href="#getCurrentLocationAsync">getCurrentLocationAsync(callback)</a></dt>
<dd><p>Get active location of the current user (query the GPS directly)
<a href="https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getcurrentlocationasync">https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getcurrentlocationasync</a></p>
</dd>
<dt><a href="#registerToPayloadEvent">registerToPayloadEvent(callback)</a></dt>
<dd><p>The SDK calls the provided callback function method whenever a new payload is available for the bubble (for example, when a new message arrives)
<a href="https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#sdk-to-bubble">https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#sdk-to-bubble</a></p>
</dd>
<dt><a href="#registerToBubbleClosedEvent">registerToBubbleClosedEvent(callback)</a></dt>
<dd><p>The SDK will call the provided callback function when a bubble is being terminated by the container application
<a href="https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#sdk-to-bubble">https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#sdk-to-bubble</a></p>
</dd>
<dt><a href="#registerToBubbleBackHandler">registerToBubbleBackHandler(callback)</a></dt>
<dd><p>Register to native back button event
<a href="https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#sdk-to-bubble">https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#sdk-to-bubble</a></p>
</dd>
<dt><a href="#getMessageInstance">getMessageInstance(sessionId)</a> ⇒ <code><a href="#SodaMessage">SodaMessage</a></code></dt>
<dd><p>Returns a new instance of the SodaMessage class</p>
</dd>
<dt><a href="#getLeaderboardInstance">getLeaderboardInstance(bubbleId, productId, contextId, order)</a> ⇒ <code><a href="#LeaderBoard">LeaderBoard</a></code></dt>
<dd><p>Returns a new instance of LeaderBoard class</p>
</dd>
<dt><a href="#isSocial">isSocial()</a> ⇒ <code>Promise.&lt;json&gt;</code></dt>
<dd><p>Returns true if current bubble is taking place in social app, means more than one person in current session, otherwise false.
<a href="https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-issocial">https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-issocial</a></p>
</dd>
</dl>

<a name="LeaderBoard"></a>

## LeaderBoard
**Kind**: global class  

* [LeaderBoard](#LeaderBoard)
    * [new LeaderBoard(bubbleId, productId, contextId, order)](#new_LeaderBoard_new)
    * [.getBoard()](#LeaderBoard+getBoard) ⇒ <code>Promise</code>
    * [.getUserBestScore(userId)](#LeaderBoard+getUserBestScore) ⇒ <code>Promise</code>
    * [.submitScore(userId, userName, score)](#LeaderBoard+submitScore) ⇒ <code>Promise</code>

<a name="new_LeaderBoard_new"></a>

### new LeaderBoard(bubbleId, productId, contextId, order)
Constructor of Leaderboard


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bubbleId | <code>string</code> |  |  |
| productId | <code>string</code> |  | Decided an supplied by StartApp |
| contextId | <code>string</code> |  | The context id |
| order | <code>enum</code> | <code>asc</code> | asc/desc string. Dictates what accounts for a better score - lower or higher numbers |

<a name="LeaderBoard+getBoard"></a>

### leaderBoard.getBoard() ⇒ <code>Promise</code>
Return the board of a specific context

**Kind**: instance method of <code>[LeaderBoard](#LeaderBoard)</code>  
<a name="LeaderBoard+getUserBestScore"></a>

### leaderBoard.getUserBestScore(userId) ⇒ <code>Promise</code>
Get user's best score for current bubble

**Kind**: instance method of <code>[LeaderBoard](#LeaderBoard)</code>  

| Param | Type |
| --- | --- |
| userId | <code>string</code> | 

<a name="LeaderBoard+submitScore"></a>

### leaderBoard.submitScore(userId, userName, score) ⇒ <code>Promise</code>
Submit new score

**Kind**: instance method of <code>[LeaderBoard](#LeaderBoard)</code>  

| Param | Type |
| --- | --- |
| userId | <code>string</code> | 
| userName | <code>string</code> | 
| score | <code>int</code> | 

<a name="SodaMessage"></a>

## SodaMessage
**Kind**: global class  

* [SodaMessage](#SodaMessage)
    * [new SodaMessage(sessionId)](#new_SodaMessage_new)
    * [.setSessionId(sessionId)](#SodaMessage+setSessionId) ⇒ <code>[SodaMessage](#SodaMessage)</code>
    * [.setPriority(priority)](#SodaMessage+setPriority) ⇒ <code>[SodaMessage](#SodaMessage)</code>
    * [.setPayload(payload)](#SodaMessage+setPayload) ⇒ <code>[SodaMessage](#SodaMessage)</code>
    * [.setActionType(actionType)](#SodaMessage+setActionType) ⇒ <code>[SodaMessage](#SodaMessage)</code>
    * [.setTitle(title)](#SodaMessage+setTitle) ⇒ <code>[SodaMessage](#SodaMessage)</code>
    * [.setSubTitle(subTitle)](#SodaMessage+setSubTitle) ⇒ <code>[SodaMessage](#SodaMessage)</code>
    * [.setText(text)](#SodaMessage+setText) ⇒ <code>[SodaMessage](#SodaMessage)</code>
    * [.setIconUrl(iconUrl)](#SodaMessage+setIconUrl) ⇒ <code>[SodaMessage](#SodaMessage)</code>
    * [.setBannerUrl(bannerUrl)](#SodaMessage+setBannerUrl) ⇒ <code>[SodaMessage](#SodaMessage)</code>
    * [.setBubbleAppUrl(bubbleAppUrl)](#SodaMessage+setBubbleAppUrl) ⇒ <code>[SodaMessage](#SodaMessage)</code>
    * [.setUpdateMsg(updateMsg)](#SodaMessage+setUpdateMsg) ⇒ <code>[SodaMessage](#SodaMessage)</code>
    * [.sendLocalMessage()](#SodaMessage+sendLocalMessage) ⇒ <code>Promise</code>
    * [.sendRemoteMessage()](#SodaMessage+sendRemoteMessage) ⇒ <code>Promise</code>

<a name="new_SodaMessage_new"></a>

### new SodaMessage(sessionId)
Creates an instance of SodaMessage
[https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#the-msg-json-object](https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#the-msg-json-object)


| Param | Type |
| --- | --- |
| sessionId | <code>string</code> | 

<a name="SodaMessage+setSessionId"></a>

### sodaMessage.setSessionId(sessionId) ⇒ <code>[SodaMessage](#SodaMessage)</code>
The session Id of your message

**Kind**: instance method of <code>[SodaMessage](#SodaMessage)</code>  

| Param | Type |
| --- | --- |
| sessionId | <code>string</code> | 

<a name="SodaMessage+setPriority"></a>

### sodaMessage.setPriority(priority) ⇒ <code>[SodaMessage](#SodaMessage)</code>
Priority is the "level of urgency" of this notification, by which it will be treated by the container application. Possible values:
0. Silent - use this option to send in-bubble messages that won't be displayed on the container app
1. Low
2. Medium
3. High

**Kind**: instance method of <code>[SodaMessage](#SodaMessage)</code>  

| Param | Type |
| --- | --- |
| priority | <code>string</code> | 

<a name="SodaMessage+setPayload"></a>

### sodaMessage.setPayload(payload) ⇒ <code>[SodaMessage](#SodaMessage)</code>
The message content

**Kind**: instance method of <code>[SodaMessage](#SodaMessage)</code>  

| Param | Type |
| --- | --- |
| payload | <code>string</code> | 

<a name="SodaMessage+setActionType"></a>

### sodaMessage.setActionType(actionType) ⇒ <code>[SodaMessage](#SodaMessage)</code>
The action performed by clicking this message.

**Kind**: instance method of <code>[SodaMessage](#SodaMessage)</code>  

| Param | Type | Description |
| --- | --- | --- |
| actionType | <code>enum</code> | Options are OPEN, PLAY, INSTALL, ACCEPT, DOWNLOAD, PAY NOW, SHOP NOW, SIGN UP, BOOK NOW, VOTE |

<a name="SodaMessage+setTitle"></a>

### sodaMessage.setTitle(title) ⇒ <code>[SodaMessage](#SodaMessage)</code>
The notification title

**Kind**: instance method of <code>[SodaMessage](#SodaMessage)</code>  

| Param | Type |
| --- | --- |
| title | <code>string</code> | 

<a name="SodaMessage+setSubTitle"></a>

### sodaMessage.setSubTitle(subTitle) ⇒ <code>[SodaMessage](#SodaMessage)</code>
The notification sub-title

**Kind**: instance method of <code>[SodaMessage](#SodaMessage)</code>  

| Param | Type |
| --- | --- |
| subTitle | <code>string</code> | 

<a name="SodaMessage+setText"></a>

### sodaMessage.setText(text) ⇒ <code>[SodaMessage](#SodaMessage)</code>
The notification text

**Kind**: instance method of <code>[SodaMessage](#SodaMessage)</code>  

| Param | Type |
| --- | --- |
| text | <code>string</code> | 

<a name="SodaMessage+setIconUrl"></a>

### sodaMessage.setIconUrl(iconUrl) ⇒ <code>[SodaMessage](#SodaMessage)</code>
The URL for a notification preview icon (square)

**Kind**: instance method of <code>[SodaMessage](#SodaMessage)</code>  

| Param | Type |
| --- | --- |
| iconUrl | <code>string</code> | 

<a name="SodaMessage+setBannerUrl"></a>

### sodaMessage.setBannerUrl(bannerUrl) ⇒ <code>[SodaMessage](#SodaMessage)</code>
The URL for a notification preview banner

**Kind**: instance method of <code>[SodaMessage](#SodaMessage)</code>  

| Param | Type |
| --- | --- |
| bannerUrl | <code>string</code> | 

<a name="SodaMessage+setBubbleAppUrl"></a>

### sodaMessage.setBubbleAppUrl(bubbleAppUrl) ⇒ <code>[SodaMessage](#SodaMessage)</code>
The "base URL" of the Bubble. This URL will be used by the SDK to open the Bubble on the other side. Leave this parameter blank to use the bubble's default URL.

**Kind**: instance method of <code>[SodaMessage](#SodaMessage)</code>  

| Param | Type |
| --- | --- |
| bubbleAppUrl | <code>string</code> | 

<a name="SodaMessage+setUpdateMsg"></a>

### sodaMessage.setUpdateMsg(updateMsg) ⇒ <code>[SodaMessage](#SodaMessage)</code>
Use this parameter to ask the container application to override the last native massage with new data.

**Kind**: instance method of <code>[SodaMessage](#SodaMessage)</code>  

| Param | Type |
| --- | --- |
| updateMsg | <code>string</code> | 

<a name="SodaMessage+sendLocalMessage"></a>

### sodaMessage.sendLocalMessage() ⇒ <code>Promise</code>
After the message values are set - execute this function to actually send it locally

**Kind**: instance method of <code>[SodaMessage](#SodaMessage)</code>  
<a name="SodaMessage+sendRemoteMessage"></a>

### sodaMessage.sendRemoteMessage() ⇒ <code>Promise</code>
After the message values are set - execute this function to actually send it locally

**Kind**: instance method of <code>[SodaMessage](#SodaMessage)</code>  
<a name="getMyLastSession"></a>

## getMyLastSession() ⇒ <code>Promise.&lt;string&gt;</code>
Get the last received sessionId.
You can use this id to restore the last payload in case the bubble was lunched without a sessionId
[https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getlastsession](https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getlastsession)

**Kind**: global function  
<a name="closeBubble"></a>

## closeBubble() ⇒ <code>Promise.&lt;string&gt;</code>
Close bubble
[https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#bubble-to-sdk](https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#bubble-to-sdk)

**Kind**: global function  
<a name="getContext"></a>

## getContext() ⇒ <code>Promise.&lt;string&gt;</code>
Get the context of the hosting container (conversation, page, etc.).
You can use this context if you save external state for your bubble per context.

**Kind**: global function  
<a name="getPayload"></a>

## getPayload(sessionId) ⇒ <code>Promise.&lt;json&gt;</code>
Get the last payload of a given session
[https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getpayload](https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getpayload)

**Kind**: global function  

| Param |
| --- |
| sessionId | 

<a name="createUniqueSessionIdIfOldNotFound"></a>

## createUniqueSessionIdIfOldNotFound() ⇒ <code>Promise.&lt;string&gt;</code>
Generate a random session id

**Kind**: global function  
<a name="getLastKnownLocation"></a>

## getLastKnownLocation() ⇒ <code>Promise.&lt;json&gt;</code>
Get last known location of the current user (doesn't query the GPS directly)
[https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getlastknownlocation](https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getlastknownlocation)

**Kind**: global function  
<a name="getProductId"></a>

## getProductId() ⇒ <code>Promise.&lt;json&gt;</code>
Returns the current bubble's product ID

**Kind**: global function  
<a name="copyToClipboard"></a>

## copyToClipboard(text) ⇒ <code>Promise.&lt;json&gt;</code>
Adds any give text to the device's clipboard, ready for pasting anywhere and outside the app

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | The string we want to send to the clipboard |

<a name="openInExternalBrowser"></a>

## openInExternalBrowser(URL) ⇒ <code>Promise.&lt;string&gt;</code>
Open a given URL in the device's default web browser

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| URL | <code>string</code> | The URL to be opened |

<a name="getUserDetails"></a>

## getUserDetails() ⇒ <code>Promise.&lt;json&gt;</code>
Get details of the current user
[https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getuserdetails](https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getuserdetails)

**Kind**: global function  
<a name="getFriendsDetails"></a>

## getFriendsDetails() ⇒ <code>Promise.&lt;json&gt;</code>
Details of all friends active on the current chat. Requires extra permission.
[https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getfriendsdetails](https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getfriendsdetails)

**Kind**: global function  
<a name="getUserPicture"></a>

## getUserPicture(userId) ⇒ <code>Promise.&lt;json&gt;</code>
Get user profile picture
Might be returned using the following sources:
1. base64 encoded image
2. image URL
3. path to a local picture
[https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getuserpicture](https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getuserpicture)

**Kind**: global function  

| Param |
| --- |
| userId | 

<a name="getCurrentLocationAsync"></a>

## getCurrentLocationAsync(callback)
Get active location of the current user (query the GPS directly)
[https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getcurrentlocationasync](https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-getcurrentlocationasync)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | The callback function |

<a name="registerToPayloadEvent"></a>

## registerToPayloadEvent(callback)
The SDK calls the provided callback function method whenever a new payload is available for the bubble (for example, when a new message arrives)
[https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#sdk-to-bubble](https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#sdk-to-bubble)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | The function that will called on payload event |

<a name="registerToBubbleClosedEvent"></a>

## registerToBubbleClosedEvent(callback)
The SDK will call the provided callback function when a bubble is being terminated by the container application
[https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#sdk-to-bubble](https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#sdk-to-bubble)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | The callback function |

<a name="registerToBubbleBackHandler"></a>

## registerToBubbleBackHandler(callback)
Register to native back button event
[https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#sdk-to-bubble](https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#sdk-to-bubble)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | The callback function that handles the back action |

<a name="getMessageInstance"></a>

## getMessageInstance(sessionId) ⇒ <code>[SodaMessage](#SodaMessage)</code>
Returns a new instance of the SodaMessage class

**Kind**: global function  

| Param | Type |
| --- | --- |
| sessionId | <code>string</code> | 

<a name="getLeaderboardInstance"></a>

## getLeaderboardInstance(bubbleId, productId, contextId, order) ⇒ <code>[LeaderBoard](#LeaderBoard)</code>
Returns a new instance of LeaderBoard class

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| bubbleId | <code>string</code> |  |
| productId | <code>string</code> | Decided an supplied by StartApp |
| contextId | <code>string</code> | The context id |
| order | <code>enum</code> | asc/desc string. Dictates what accounts for a better score - lower or higher numbers |

<a name="isSocial"></a>

## isSocial() ⇒ <code>Promise.&lt;json&gt;</code>
Returns true if current bubble is taking place in social app, means more than one person in current session, otherwise false.
[https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-issocial](https://github.com/StartApp-SDK/SODA/wiki/Bubbles-Integration#-issocial)

**Kind**: global function  

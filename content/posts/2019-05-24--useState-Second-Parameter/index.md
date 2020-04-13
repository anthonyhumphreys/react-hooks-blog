---
title: useDocumentation
category: "oops"
cover: facepalm.jpg
author: Anthony Humphreys
---

# useDocumentation

## Setting the scene

Between talks at React Europe Conference I was working on a chat interface in React Native, backed by Amazon Lex. I encountered a fun bug, where the message typed by the user was rendering very briefly, only to be mysteriously whisked away again when the response came back from Lex and the message was supposedly appended to the array of sent and received messages.

<div style="width:100%; display: flex; flex-direction: row; justify-content: center;">
<img height="500" style="align-self:center" alt="GIF Showing a message typed by the user disappearing when the response is rendered" src="./fail.gif">
</div>

## The broken code

```javascript
const appendMessage = ({ message, from }) => {
  setMessages([...messages, { message, from }]);
  if (from === "me") {
    sendToLex(message);
  }
};
```

For a little context - this function takes an object which contains a message and the sender (either 'me', or 'bot'). If `from` is set to `me` then the `message` is sent to Lex as well as being set in the component's state.

## The fix

Okay, so first thing is to actually _read_ the [documentation](https://reactjs.org/docs/hooks-reference.html#usestate). That doesn't mean opening it and scrolling for a bit, but actually reading it. If I'd done this, i'd have spotted:

> Functional updates
> If the new state is computed using the previous state, you can pass a function to setState. The function will receive the previous value, and return an updated value. Here’s an example of a counter component that uses both forms of `setState`:

Ah. So by simply changing

```javascript
setMessages([...messages, { message, from }]);
```

to

```javascript
setMessages(oldMessages => [...oldMessages, { message, from }]);
```

This now works, producing the following behaviour

<div style="width:100%; display: flex; flex-direction: row; justify-content: center;">
<img height="500" alt="GIF Showing a message typed by the user persisting when the response is rendered" src="./success.gif">
</div>

That's all there is to it. This is analagous to the 'old' way of setting state using:

```javascript
this.setState(oldState => ({ value: oldState.value }));
```

...which I should've really thought about when writing the function in the first place!

## TL;DR

![RTFM XKCD Web Comic](https://imgs.xkcd.com/comics/rtfm.png)

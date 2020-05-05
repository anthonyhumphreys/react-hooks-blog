---
title: useGeolocation
category: "Utility"
cover: compass.jpg
author: Anthony Humphreys
---

One of the first custom hooks I wrote was to grab the user's location using the Geolocation API. I wrote it for a project with two requirements - to get a user's location on a button press, and to 'watch' a user's location to keep a map preview up to date.

Let's cut straight to the code:

### Usage (Single Location):

```TypeScript
  const [position, error] = useGeolocation(GeolocationMode.SINGLE);
```

### Usage (Watch Location):

```TypeScript
  const [position, error, locationHistory] = useGeolocation(GeolocationMode.WATCH);
```

<br>

The hook is super simple to use. The first call returns a [position object](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPosition) or an [error](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPositionError), the second call will update 'position' every time the underlying hook receives an updated position from the Geolocation API, and will maintain an array of all positions observed in 'locationHistory'.

You can check out the full code in this blog's repo over at [GitHub](https://github.com/anthonyhumphreys/hooks) or install it from [npm](https://www.npmjs.com/package/@anthonyhumphreys/hooks)

The design of the underlying hook allows you to seamlessly switch between 'modes' too - so you could seamlessly transition between displaying a user's initial location and showing a user's journey as the follow directions, for example.

Its that simple. This is one of the most attractive value propositions offered by hooks - abstracting away logic in an easily reusable and easy to consume manner.

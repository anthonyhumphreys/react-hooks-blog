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

You can check out the code over at [GitHub](https://github.com/anthonyhumphreys/hooks) or install it from [npm](https://www.npmjs.com/package/@anthonyhumphreys/hooks)

The design of the underlying hook allows you to seamlessly switch between 'modes' too - so you could seamlessly transition between displaying a user's initial location and showing a user's journey as they follow directions, for example.

Its that simple. This is one of the most attractive value propositions offered by hooks - abstracting away logic in an easily reusable and easy to consume manner.

### The full hook code

This is still a work in progress, types are incomplete etc.

```TypeScript
  import { useCallback, useEffect, useState } from 'react';

  export enum GeolocationMode {
    SINGLE = 'single',
    WATCH = 'watch',
  }

  type GeolocationCoordinates = {
    accuracy: number | null;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    latitude: number | null;
    longitude: number | null;
    speed: number | null;
  };

  type GeolocationResponse = {
    coords: GeolocationCoordinates;
    timestamp: number;
  };

  type GeolocationError = {};

  type GeolocationConfig = {};

  interface IPositionState {
    position: GeolocationResponse | null;
    positionError: GeolocationError | null;
    positionLoading: Boolean;
    previousPositions: Array<GeolocationResponse | null> | null;
  }

  const defaultGeolocationConfig: GeolocationConfig = {
    timeout: 12000,
    maximumAge: 60000,
    enableHighAccuracy: true,
  };

  export function useGeolocation(
    mode: GeolocationMode = GeolocationMode.SINGLE,
    stop: Boolean = false,
    config: GeolocationConfig = defaultGeolocationConfig
  ) {
    const [positionState, setPositionState] = useState<IPositionState>({
      position: null,
      positionError: null,
      positionLoading: true,
      previousPositions: [],
    });

    const onGeolocationSuccess = useCallback(
      position => {
        if (!stop) {
          setPositionState(oldState => ({
            ...oldState,
            position,
            previousPositions:
              mode === GeolocationMode.SINGLE
                ? [oldState.position]
                : [
                    ...(oldState.previousPositions
                      ? oldState.previousPositions
                      : []),
                    oldState.position,
                  ],
          }));
        }
      },
      [setPositionState]
    );

    const onGeolocationError = useCallback(
      error => setPositionState(oldState => ({ ...oldState, error })),
      [setPositionState]
    );

    useEffect(() => {
      if (mode === GeolocationMode.SINGLE) {
        navigator.geolocation.getCurrentPosition(
          onGeolocationSuccess,
          onGeolocationError,
          config
        );
      } else if (mode === GeolocationMode.WATCH) {
        navigator.geolocation.watchPosition(
          onGeolocationSuccess,
          onGeolocationError,
          config
        );
      }
    }, [mode, stop]);

    return positionState;
  }

```

---
title: useFakeAsync
category: "100 Days of Code"
cover: time.jpg
author: Anthony Humphreys
---

You can see the hook takes a few simple parameters, including the familiar pairing of a callback function and a delay in milliseconds. This follows the shape of JavaScript's setTimeout and setInterval methods.

```TypeScript
import { useEffect, useState } from 'react';

enum FakeAsyncState {
  PENDING = 'PENDING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}

export const useFakeAsync: Function = (
  callback: Function,
  delay: number = 3000,
  shouldError: boolean = false,
  chaos: boolean = false
) => {
  const [state, setState] = useState<FakeAsyncState>(FakeAsyncState.PENDING);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fail = chaos ? Math.random() <= 0.5 : shouldError;
    if (fail) {
      timer = setTimeout(() => {
        setState(FakeAsyncState.COMPLETE);
        callback();
      }, delay);
    } else {
      setState(FakeAsyncState.ERROR);
    }
    return () => clearTimeout(timer);
  }, [delay, callback, chaos, shouldError]);

  return [state];
};
```

The hook also takes a 'shouldError' parameter so that an error condition can be forced.

The fourth parameter is a little more interesting, 'chaos'. I added this to randomise a success or error condition.

The state returned by the hook mimics a promise, it can either be pending, complete or in an error condition.

Hopefully this will help testing behaviour across components, and avoiding those inevitable bugs that creep in when integrating a UI with an API, like stutters between loading and success states, for example.

That's all! Go checkout the code on [GitHub](https://github.com/anthonyhumphreys/hooks/) or install my handy hooks library from [npm](https://www.npmjs.com/package/@anthonyhumphreys/hooks)

This post was for day 1 of my [#100DaysOfCode](https://twitter.com/hashtag/100DaysOfCode) challenge. [Follow me on Twitter](https://twitter.com/aphumphreys) for more.

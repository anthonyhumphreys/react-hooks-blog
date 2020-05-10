---
title: useProgressiveLoading
category: "Utility"
cover: spinner.jpg
author: Anthony Humphreys
---

If you've ever worked with a slow moving API that you just can't work around, you've probably written something along these lines already. I thought it would be handy to have this as a hook, to drop into loading components and not have to rewrite the same piece of logic umpteen times.

There are definitely better UX patterns than this, and I am in no way advocating this as a good practice for loading behaviour, but sometimes you can't avoid unsavoury bits of UI like this.

```TSX
const text = useProgressiveLoading([3, 10, 15], ['Loading your profile is taking a litle longer than normal, please wait',
    'Still loading, please wait a while longer...',
    'Still loading your profile, thank you for your patience...']);

return (
  ...
  <LoadingText>{text}</LoadingText>
  ...
)
```

The hook takes two parameters, the first is an array of times in seconds, the second is an array of strings. The principle is really simple, the hook creates a timeout for each timing passed, and will update the `text` value each time the timeout fires. The two arrays must be 'balanced' in terms of length, or the hook will throw an error.

```TypeScript
import { useEffect, useState } from 'react';

export const useProgressiveLoading: Function = (
  timings: number[] = [5, 15, 30],
  strings: string[] = [
    'Still loading, please wait...',
    'Still loading, please wait a while longer...',
    'Still loading, thank you for your patience...',
  ]
): string => {
  if (timings.length !== strings.length) {
    throw new Error(
      `You passed ${timings.length} times and ${strings.length} - there should be the same number of each.`
    );
  }
  const [text, setText] = useState<string>('');
  const [timers, setTimers] = useState<number[]>([]);

  useEffect(() => {
    timings.forEach((delay: number, index: number) => {
      const timer: number = window.setTimeout(
        () => setText(strings[index]),
        delay * 1000
      );
      setTimers(oldTimers => [...oldTimers, timer]);
    });
    return () => {
      timers.forEach(timer => window.clearTimeout(timer));
      setText('');
    };
  }, [timings, strings]);

  return text;
};
```

That's all there is to this one, its pretty simple!

You can install this from [npm](https://www.npmjs.com/package/@anthonyhumphreys/hooks) or check out the repo on [GitHub](https://github.com/anthonyhumphreys/hooks)

As always, suggestions, improvements etc all welcome!

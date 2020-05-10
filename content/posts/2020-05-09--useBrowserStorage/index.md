---
title: useBrowserStorage
category: "Utility"
cover: storage.jpg
author: Anthony Humphreys
---

For day 3 of my #100DaysOfCode challenge I thought I would expand and polish a hook I previously wrote (adapted from several examples online such as [this one](https://medium.com/@andrewgbliss/react-custom-hook-uselocalstorage-afbde976c72b)) which wraps the useState hook and persists state in localStorage or sessionStorage depending on use case.

The hook conforms to a mix of the localStorage and useState API.

`const [state, setState] = useBrowserStorage("key", "value", StorageType.LOCAL_STORAGE)`

This is so simple to use, virtually a drop in replacement for useState and gives you state persistance and restoration. You can use `state` as an ordinary state variable, and call `setState` with either a string or a function, just like the setter for `useState`.

That's it! Full hook code below, and published over at [npm](https://www.npmjs.com/package/@anthonyhumphreys/hooks) with the code available on [GitHub](https://github.com/anthonyhumphreys/hooks)

```TypeScript
import { useState } from "react";
import { name as packageName } from "../../package.json";

enum StorageType {
  LOCAL_STORAGE = "LOCAL_STORAGE",
  SESSION_STORAGE = "SESSION_STORAGE",
}

const useBrowserStorage = (
  key: string,
  initialValue: string,
  type: StorageType
) => {
  const storageProvider =
    type === Type.LOCAL_STORAGE ? window.localStorage : window.sessionStorage;

  const fullKey = `${packageName}:${key}`;

  const [storedValue, setStoredValue] = useState<string>(() => {
    try {
      const storedItem = storageProvider.getItem(fullKey);
      return storedItem ? JSON.parse(storedItem) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: string | Function) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storageProvider.setItem(fullKey, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

export default useBrowserStorage;
```

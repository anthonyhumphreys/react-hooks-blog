---
title: useSyncedState
category: "100 Days of Code"
cover: sync.jpg
author: Anthony Humphreys
---

# Synced State Experiment

After working on useLocalStorage, I wondered how hard it would be to sync state to persistent, distributed storage. For my 5th Day of 100 Days of code I decided to make a first attempt at this idea.

I followed the same pattern as for building the useLocalStorage hook, extending the useState API, and triggering a useEffect on the state update to handle the state synchronization...asynchronously.

Without further ado, here's the code...I'll be working more on this. At the moment, this might be useful for a use case such as building a user profile. A common poor experience is filling out some information and _boom_ you've hit refresh, or swiped back on the trackpad...this scenario is already resolved by the localStorage hook, but I thought it would be cool to explore binding state to an API. The current implementation is geared around a REST API, so next steps will be to look at passing a query/mutation to the hook.

I'm also thinking about how to hook this up to a useReducer, passing in the reducer function to determine how to manage state.

```TypeScript
import { useState, useCallback, useReducer, useEffect } from "react";

type State = {
  success: boolean;
  loading: boolean;
  error: boolean;
};

type Action = {
  type: "loading" | "success" | "error";
  syncedState?: object;
};

const initialState: State = {
  success: false,
  loading: false,
  error: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "success":
      return { success: true, loading: false, error: false };
    case "loading":
      return { success: false, loading: true, error: false };
    case "error":
      return { success: false, loading: false, error: true };
    default:
      return state;
  }
};

const SYNC_URL = "https://localhost:3000";

export const useSyncedState = (
  key: string,
  initialValue: string,
  delay: number = 1000,
  syncUrl: string
): [State, any, Function] => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const syncToServer = useCallback(async (valueToStore: object) => {
    dispatch({ type: "loading" });
    const response = await fetch(SYNC_URL, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(valueToStore),
    });
    response.ok ? dispatch({ type: "success" }) : dispatch({ type: "error" });
  }, []);

  const syncToClient = useCallback(async () => {
    dispatch({ type: "loading" });
    const response = await fetch(SYNC_URL, {
      method: "GET",
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    response.ok
      ? dispatch({ type: "success", syncedState: await response.json() })
      : dispatch({ type: "error" });
    return response.json();
  }, []);

  const [syncedValue, setSyncedValue] = useState<object>(async () => {
    try {
      const syncedState = await syncToClient();
      return syncedState ?? initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      const valueToStore =
        value instanceof Function ? value(syncedValue) : value;
      setSyncedValue(valueToStore);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      syncToServer(syncedValue);
    }, delay);
    return () => clearTimeout(timeout);
  }, [syncedValue, delay, syncToServer]);

  return [state, syncedValue, setValue];
};
```

Would be curious to hear anyone's thoughts on this, I can imagine lots of questions about the motivation and to be perfectly honest...it just seemed like a cool thing to put together 🤷‍♂️

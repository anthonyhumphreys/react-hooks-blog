---
title: useTheme
category: "UI"
cover: paintbrushes.jpg
author: Anthony Humphreys
---

Recently I was working on a React Native project and I was asked to come up with an a dark theme for the app and make that the default, with an option for the user to switch to light theme at any time without having to restart the app (looking at you Microsoft Teams...). In order to do this, and to tidy up the styling of the app in general, I decided to create a theme context for the app. We are using vanilla React Native styling for this project, so I decided to roll my own theme context provider solution.

# Context Provider

For my use case I came up with the following provider:

```typescript
interface IThemeContext {
  theme: Theme;
  activeTheme: Mode;
  setTheme: Function;
}

export default createContext<IThemeContext>({
  theme: lightTheme,
  activeTheme: null,
  setTheme: (mode: Mode) => null
});
```

`theme` being the object representing the currently active theme.

`activeTheme` is an enum, `Mode` which is either `DARK` or `LIGHT`.

`setTheme` calls a setter for a useState hook which drives the value of `theme` based on the current `Mode`.

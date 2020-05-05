---
title: useTSDX
category: "Utility"
cover: fireworks.jpg
author: Anthony Humphreys
---

# Publishing hooks

One of the main outcomes I wanted from building this blog was to maintain a companion library of useful hooks. I'm writing most things in TypeScript these days (yeah I jumped on that hype train pretty hard, and haven't looked back...)

Publishing a custom hook is as easy as publishing a component for react. That being said, I'd never published a library built with TypeScript so wasn't entirely sure what was needed. That's when I remembered [Jared Palmer's](https://twitter.com/jaredpalmer) amazing TSDX CLI, I think I first heard about it on the [SyntaxFM](https://syntax.fm/) podcast.

I simply ran `npx tsdx create hooks`, dropped my code in the `src` directory, modified the github action included and hey presto, I've got a library live.

I'll certainly be making more use of this tool, for libraries and React Components.

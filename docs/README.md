# AGiXT Chat

[![GitHub](https://img.shields.io/badge/GitHub-AGiXT%20Core-blue?logo=github&style=plastic)](https://github.com/Josh-XT/AGiXT) [![GitHub](https://img.shields.io/badge/GitHub-AGiXT%20Hub-blue?logo=github&style=plastic)](https://github.com/AGiXT/hub) [![GitHub](https://img.shields.io/badge/GitHub-AGiXT%20NextJS%20Web%20UI-blue?logo=github&style=plastic)](https://github.com/AGiXT/nextjs)

[![GitHub](https://img.shields.io/badge/GitHub-AGiXT%20Python%20SDK-blue?logo=github&style=plastic)](https://github.com/AGiXT/python-sdk) [![pypi](https://img.shields.io/badge/pypi-AGiXT%20Python%20SDK-blue?logo=pypi&style=plastic)](https://pypi.org/project/agixtsdk/)

[![GitHub](https://img.shields.io/badge/GitHub-AGiXT%20TypeScript%20SDK-blue?logo=github&style=plastic)](https://github.com/AGiXT/typescript-sdk) [![npm](https://img.shields.io/badge/npm-AGiXT%20TypeScript%20SDK-blue?logo=npm&style=plastic)](https://www.npmjs.com/package/agixt)

[![Discord](https://img.shields.io/discord/1097720481970397356?label=Discord&logo=discord&logoColor=white&style=plastic&color=5865f2)](https://discord.gg/d3TkHRZcjD) 
[![Twitter](https://img.shields.io/badge/Twitter-Follow_@Josh_XT-blue?logo=twitter&style=plastic)](https://twitter.com/Josh_XT) 

[![Logo](https://josh-xt.github.io/AGiXT/images/AGiXT-gradient-flat.svg)](https://josh-xt.github.io/AGiXT/)

AGiXT is an Artificial Intelligence Automation Platform designed to power efficient AI instruction management across multiple providers. Our agents are equipped with adaptive memory, and this versatile solution offers a powerful plugin system that supports a wide range of commands, including web browsing. With growing support for numerous AI providers and models, AGiXT is constantly evolving to empower diverse applications.

## Run AGiXT Chat front end

- If you don't already have AGiXT, [follow this link for instructions to set it up.](https://github.com/Josh-XT/AGiXT#quick-start-guide)
- After you have run the AGiXT back end, follow these instructions below:

```bash
git clone https://github.com/AGiXT/chat
cd chat
npm install
npm run dev
```

Access at http://localhost:3000

## Use as a React Component

```javascript
import AGiXTChat from "agixtchat";
export default function Home() {
  return (
    <AGiXTChat
      baseUri={"http://localhost:7437"} // Base URI
      apiKey={""} // API Key
      dark={true} // Set dark mode by default
      agentName={"gpt4free"} // Agent name
      mode={"prompt"} // Modes are prompt or chain
      conversationName={"Convert Extensions to new ones"}
      enableFileUpload={false} // Enable file upload button
      // If mode is prompt, set promptName and promptCategory
      promptName={"Chat"} // Only matters if mode is prompt
      promptCategory={"Default"} // Only matters if mode is prompt
      // If mode is chain, set the remaining args
      selectedChain={"Smart Chat"} // Only matters if mode is chain
      chainArgs={{}} // Only matters if mode is chain, these are chain arg overrides
      useSelectedAgent={true} // Only matters if mode is chain, this will force the selected agent to run all chain steps
    />
  );
}
```

## Contributing

[![Contribute](https://img.shields.io/github/issues/Josh-XT/AGiXT/help%20wanted?color=purple&label=Quick%20Contribute&logo=github&style=plastic)](https://github.com/Josh-XT/AGiXT/labels/help%20wanted)

We welcome contributions to AGiXT! If you're interested in contributing, please check out our [contributions guide](https://github.com/Josh-XT/AGiXT/tree/main/.github/CONTRIBUTING.md) the [open issues on the backend](https://github.com/Josh-XT/AGiXT/issues), [open issues on the frontend](https://github.com/AGiXT/nextjs/issues) and [pull requests](https://github.com/Josh-XT/AGiXT/pulls), submit a [pull request](https://github.com/Josh-XT/AGiXT/pulls/new), or [suggest new features](https://github.com/Josh-XT/AGiXT/issues/new). To stay updated on the project's progress, [![Twitter](https://img.shields.io/badge/Twitter-Follow_@Josh_XT-blue?logo=twitter&style=plastic)](https://twitter.com/Josh_XT) and [![Twitter](https://img.shields.io/badge/Twitter-Follow_@JamesonRGrieve-blue?logo=twitter&style=plastic)](https://twitter.com/JamesonRGrieve). Also feel free to join our [![Discord](https://img.shields.io/discord/1097720481970397356?label=Discord&logo=discord&logoColor=white&style=plastic&color=5865f2)](https://discord.gg/d3TkHRZcjD).

## Donations and Sponsorships

We appreciate any support for AGiXT's development, including donations, sponsorships, and any other kind of assistance. If you would like to support us, please use one of the various methods listed at the top of the repository or contact us through our [![Discord](https://img.shields.io/discord/1097720481970397356?label=Discord&logo=discord&logoColor=white&style=plastic&color=5865f2)](https://discord.gg/d3TkHRZcjD) or [![Twitter](https://img.shields.io/badge/Twitter-Follow_@Josh_XT-blue?logo=twitter&style=plastic)](https://twitter.com/Josh_XT).

We're always looking for ways to improve AGiXT and make it more useful for our users. Your support will help us continue to develop and enhance the application. Thank you for considering to support us!

## Our Team 🧑‍💻

| Josh (@Josh-XT)                    | James (@JamesonRGrieve) | 
|-----------------------------------|-----------------------------------|
|[![GitHub](https://img.shields.io/badge/GitHub-Follow_@Josh--XT-white?logo=github&style=plastic)](https://github.com/Josh-XT)|[![GitHub](https://img.shields.io/badge/GitHub-Follow_@JamesonRGrieve-white?logo=github&style=plastic)](https://github.com/JamesonRGrieve)|
|[![Twitter](https://img.shields.io/badge/Twitter-Follow_@Josh__XT-blue?logo=twitter&style=plastic)](https://twitter.com/Josh_XT)|[![Twitter](https://img.shields.io/badge/Twitter-Follow_@JamesonRGrieve-blue?logo=twitter&style=plastic)](https://twitter.com/JamesonRGrieve)|
|[![LinkedIn](https://img.shields.io/badge/LinkedIn-Follow_@JoshXT-blue?logo=linkedin&style=plastic)](https://www.linkedin.com/in/joshxt/)|[![LinkedIn](https://img.shields.io/badge/LinkedIn-Follow_@JamesonRGrieve-blue?logo=linkedin&style=plastic)](https://www.linkedin.com/in/jamesonrgrieve/)|

## History

![Star History Chart](https://api.star-history.com/svg?repos=Josh-XT/AGiXT&type=Dat)


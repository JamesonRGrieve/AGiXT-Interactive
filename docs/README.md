# AGiXT Chat

[![GitHub](https://img.shields.io/badge/GitHub-AGiXT%20Core-blue?logo=github&style=plastic)](https://github.com/Josh-XT/AGiXT) [![GitHub](https://img.shields.io/badge/GitHub-AGiXT%20Hub-blue?logo=github&style=plastic)](https://github.com/AGiXT/hub) [![GitHub](https://img.shields.io/badge/GitHub-AGiXT%20NextJS%20Web%20UI-blue?logo=github&style=plastic)](https://github.com/AGiXT/nextjs)

[![GitHub](https://img.shields.io/badge/GitHub-AGiXT%20Python%20SDK-blue?logo=github&style=plastic)](https://github.com/AGiXT/python-sdk) [![pypi](https://img.shields.io/badge/pypi-AGiXT%20Python%20SDK-blue?logo=pypi&style=plastic)](https://pypi.org/project/agixtsdk/)

[![GitHub](https://img.shields.io/badge/GitHub-AGiXT%20TypeScript%20SDK-blue?logo=github&style=plastic)](https://github.com/AGiXT/typescript-sdk) [![npm](https://img.shields.io/badge/npm-AGiXT%20TypeScript%20SDK-blue?logo=npm&style=plastic)](https://www.npmjs.com/package/agixt)

[![Discord](https://img.shields.io/discord/1097720481970397356?label=Discord&logo=discord&logoColor=white&style=plastic&color=5865f2)](https://discord.gg/d3TkHRZcjD) 
[![Twitter](https://img.shields.io/badge/Twitter-Follow_@Josh_XT-blue?logo=twitter&style=plastic)](https://twitter.com/Josh_XT) 

[![Logo](https://josh-xt.github.io/AGiXT/images/AGiXT-gradient-flat.svg)](https://josh-xt.github.io/AGiXT/)

AGiXT Chat is a React component for a user facing chat interface for AGiXT.

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
export default function Chat() {
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

## History

![Star History Chart](https://api.star-history.com/svg?repos=Josh-XT/AGiXT&type=Dat)

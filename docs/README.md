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
git clone https://github.com/JoshXT/agixtchat
cd chat
npm install
npm run dev
```

Access at <http://localhost:3000>

## Use as a React Component

```javascript
import AGiXTChat from "../components/AGiXTChat";

export default function Chat({
  AGiXTServer = "http://localhost:7437",
  agentName = "gpt4free",
  insightAgent = "gpt4free",
  conversationName = "Test",
  setConversationName = () => {},
  showConversationBar = true,
  dark = true,
  fileUploadEnabled = false,
  mode = "prompt",
  promptName = "Chat",
  promptCategory = "Default",
  selectedChain = "Postgres Chat",
  chainArgs = {},
  useSelectedAgent = true,
}) {
  return (
    <AGiXTChat
      baseUri={AGiXTServer} // Base URI to the AGiXT server
      agentName={agentName} // Agent name
      insightAgent={insightAgent} // Insight agent name to use a different agent for insights, leave blank to use the same agent
      conversationName={conversationName} // Conversation name
      setConversationName={setConversationName} // Function to set the conversation name
      // UI Options
      showConversationBar={showConversationBar} // Show the conversation selection bar to create, delete, and export conversations
      dark={dark} // Set dark mode by default
      enableFileUpload={fileUploadEnabled} // Enable file upload button, disabled by default.
      // Modes are prompt or chain
      mode={mode}
      // prompt mode - Set promptName and promptCategory
      promptName={promptName} // Name of the prompt to use
      promptCategory={promptCategory} // Category of the prompt to use
      // chain mode - Set chain name and chain args
      selectedChain={selectedChain} // Chain name
      chainArgs={chainArgs} // Chain arg overrides, unnecessary if you don't need to override any args.
      useSelectedAgent={useSelectedAgent} // Will force the selected agent to run all chain steps rather than the agents defined in the chain
    />
  );
}
```

## History

![Star History Chart](https://api.star-history.com/svg?repos=Josh-XT/AGiXT&type=Dat)

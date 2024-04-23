# AGiXT Interactive Web [Closed Source]

[![GitHub](https://img.shields.io/badge/GitHub-AGiXT%20Core-blue?logo=github&style=plastic)](https://github.com/Josh-XT/AGiXT)
[![GitHub](https://img.shields.io/badge/GitHub-AGiXT%20NextJS%20Web%20UI-blue?logo=github&style=plastic)](https://github.com/AGiXT/nextjs)
[![GitHub](https://img.shields.io/badge/GitHub-AGiXT%20StreamLit%20Web%20UI-blue?logo=github&style=plastic)](https://github.com/AGiXT/streamlit)

### Software Development Kits

[![GitHub](https://img.shields.io/badge/GitHub-AGiXT%20Python%20SDK-blue?logo=github&style=plastic)](https://github.com/AGiXT/python-sdk) [![pypi](https://img.shields.io/badge/pypi-AGiXT%20Python%20SDK-blue?logo=pypi&style=plastic)](https://pypi.org/project/agixtsdk/)

[![GitHub](https://img.shields.io/badge/GitHub-AGiXT%20TypeScript%20SDK-blue?logo=github&style=plastic)](https://github.com/AGiXT/typescript-sdk) [![npm](https://img.shields.io/badge/npm-AGiXT%20TypeScript%20SDK-blue?logo=npm&style=plastic)](https://www.npmjs.com/package/agixt)

### Socials

[![Discord](https://img.shields.io/discord/1097720481970397356?label=Discord&logo=discord&logoColor=white&style=plastic&color=5865f2)](https://discord.gg/d3TkHRZcjD)
[![Twitter](https://img.shields.io/badge/Twitter-Follow_@Josh_XT-blue?logo=twitter&style=plastic)](https://twitter.com/Josh_XT)

[![Logo](https://josh-xt.github.io/AGiXT/images/AGiXT-gradient-flat.svg)](https://josh-xt.github.io/AGiXT/)

AGiXT Interactive is a React component for AGiXT, allowing interaction with agents without administration options. It can be launched as a full NextJS application, or embedded in another React application.

## Standalone NextJS Application

If you don't already have AGiXT, [follow this link for instructions to set it up.](https://github.com/Josh-XT/AGiXT#quick-start-guide)

Modify the `.env.local` file to your liking.

| Variable Name                     | Default Value           | Description                                                              |
| --------------------------------- | ----------------------- | ------------------------------------------------------------------------ |
| `AGIXT_AGENT`                     | 'gpt4free'              | The agent used in AGiXT.                                                 |
| `AGIXT_CONVERSATION_MODE`         | 'static'                | The mode of conversation in AGiXT, can be 'static', 'select', or 'uuid'. |
| `AGIXT_CONVERSATION_NAME`         | 'AGiXT Conversation'    | The name of the conversation in AGiXT.                                   |
| `AGIXT_ENABLE_SEARCHPARAM_CONFIG` | 'false'                 | Determines if search parameter configuration is enabled in AGiXT.        |
| `AGIXT_INSIGHT_AGENT`             | 'gpt4free'              | The insight agent used in AGiXT.                                         |
| `AGIXT_MODE`                      | 'prompt'                | The operational mode of AGiXT, typically 'prompt'.                       |
| `AGIXT_REQUIRE_API_KEY`           | 'true'                  | Indicates whether an API key is required for AGiXT.                      |
| `AGIXT_SERVER`                    | 'http://localhost:7437' | The server address for AGiXT.                                            |
| `AGIXT_PROMPT_NAME`               | 'Chat'                  | The name of the prompt in AGiXT.                                         |
| `AGIXT_PROMPT_CATEGORY`           | 'Default'               | The category of the prompt in AGiXT.                                     |
| `AGIXT_CHAIN`                     | 'Postgres Chat'         | The chain used in AGiXT.                                                 |
| `AGIXT_USE_SELECTED_AGENT`        | 'true'                  | Determines if the selected agent is used in AGiXT.                       |
| `AGIXT_CHAIN_ARGS`                | '{}'                    | The arguments for the chain in AGiXT.                                    |
| `AGIXT_FILE_UPLOAD_ENABLED`       | 'false'                 | Indicates if file upload is enabled in AGiXT.                            |
| `AGIXT_FOOTER_MESSAGE`            | 'Powered by AGiXT'      | The footer message displayed in AGiXT.                                   |
| `AGIXT_RLHF`                      | 'false'                 | Related to RLHF (Reinforcement Learning from Human Feedback) in AGiXT.   |
| `AGIXT_SHOW_APP_BAR`              | 'false'                 | Determines if the app bar is shown in AGiXT.                             |
| `AGIXT_SHOW_CHAT_THEME_TOGGLES`   | 'true'                  | Indicates if chat theme toggles are shown in AGiXT.                      |
| `AGIXT_SHOW_CONVERSATION_BAR`     | 'false'                 | Determines if the conversation bar is shown in AGiXT.                    |
| `APP_DESCRIPTION`                 | 'An AGiXT application.' | Description of the AGiXT application.                                    |
| `DEFAULT_THEME_MODE`              | 'dark'                  | The default theme mode for AGiXT.                                        |
| `ADSENSE_ACCOUNT`                 | ''                      | The AdSense account associated with AGiXT.                               |
| `APP_NAME`                        | 'AGiXT'                 | The name of the AGiXT application.                                       |
| `APP_URI`                         | 'http://localhost:3100' | The URI of the AGiXT application.                                        |

### Run with Docker Compose

```bash
docker-compose pull && docker-compose up
```

Access at <http://localhost:3437>

## React Component

```javascript
import AGiXTChat from 'agixtchat';
export default function Home() {
  return (
    <AGiXTChat
      uiConfig={{
        showAppBar: false, // Hides the app bar for scenarios where the component is wrapped by an enclosing application.
        showChatThemeToggles: false, // Allows theme toggling if wrapped by jrgcomponents/ThemeWrapper. Do not enable if it is not.
        showRLHF: false, // Display RLHF in messages.
        footerMessage: '', // Leave blank to hide footer.
        alternateBackground: 'primary', // Ties to the MUI palette to indicate the alternating background color. 
      }}
      serverConfig={{
        agixtServer: process.env.NEXT_PUBLIC_AGIXT_SERVER || '', // Base URI for AGiXT requests.
        apiKey: getCookie('jwt') || '', // apiKey for AGiXT requests. 
      }}
      chatConfig={{
        mode: 'command', // Current non-functional due to completions update, will be implemented into override params in the future.
        opts: {
          agent: 'gpt4free', // Agent to target.
          overrides: {
            conversationName: 'NurseGPT', // Conversation to target.
          },
        },
      }}
    />
  );
}
```

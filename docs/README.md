# AGiXT Interactive

[![GitHub](https://img.shields.io/badge/GitHub-AGiXT%20Core-blue?logo=github&style=plastic)](https://github.com/Josh-XT/AGiXT) [![GitHub](https://img.shields.io/badge/GitHub-AGiXT%20Interactive%20UI-blue?logo=github&style=plastic)](https://github.com/JamesonRGrieve/AGiXT-Interactive) [![GitHub](https://img.shields.io/badge/GitHub-AGiXT%20StreamLit%20UI-blue?logo=github&style=plastic)](https://github.com/AGiXT/streamlit)

[![GitHub](https://img.shields.io/badge/GitHub-AGiXT%20TypeScript%20SDK-blue?logo=github&style=plastic)](https://github.com/AGiXT/typescript-sdk) [![npm](https://img.shields.io/badge/npm-AGiXT%20TypeScript%20SDK-blue?logo=npm&style=plastic)](https://www.npmjs.com/package/agixt)

[![Discord](https://img.shields.io/discord/1097720481970397356?label=Discord&logo=discord&logoColor=white&style=plastic&color=5865f2)](https://discord.gg/d3TkHRZcjD)
[![Twitter](https://img.shields.io/badge/Twitter-Follow_@Josh_XT-blue?logo=twitter&style=plastic)](https://twitter.com/Josh_XT)

[![Logo](https://josh-xt.github.io/AGiXT/images/AGiXT-gradient-flat.svg)](https://josh-xt.github.io/AGiXT/)

AGiXT Interactive is both an embeddable React component and standalone NextJS application allowing interaction with agents without administration options.

### Run with Docker Compose

If you don't already have AGiXT, [follow this link for instructions to set it up.](https://github.com/Josh-XT/AGiXT#quick-start-guide)

```bash
docker-compose pull && docker-compose up
```

Access at <http://localhost:3437>

## React Component

Generally speaking, the preferred method of configuration is through the `uiConfig`, `serverConfig`, and `overrides` props. Your target agent is specified through the `agent` prop.

```javascript
import AGiXTInteractive from '@agixt/interactive';

<AGiXTInteractive
  agent='XT'
  uiConfig={{
    showAppBar: false,
    showConversationSelector: false,
    showChatThemeToggles: false,
    showRLHF: false,
    footerMessage: '',
    alternateBackground: 'primary',
  }}
  serverConfig={{
    agixtServer: process.env.AGIXT_SERVER || '',
    apiKey: getCookie('jwt') || '',
  }}
  overrides={{
    conversationName: 'MyConversation',
  }}
/>;
```

## Standalone NextJS Application

The preferred method of configuration for standalone NextJS applications is using `.env (.local, .development and .production)`. Create such files and set variables to your liking.

| Variable Name                     | Default Value           | Description                                                                                                          |
| --------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `APP_NAME`                        | 'AGiXT'                 | The name of the AGiXT application.                                                                                   |
| `APP_DESCRIPTION`                 | 'An AGiXT application.' | Description of the AGiXT application.                                                                                |
| `APP_URI`                         | 'http://localhost:3100' | The URI of the AGiXT application.                                                                                    |
| `THEME_DEFAULT_MODE`              | 'dark'                  | The default theme mode for AGiXT.                                                                                    |
| `ADSENSE_ACCOUNT`                 | ''                      | The AdSense account associated with AGiXT.                                                                           |
| `AGIXT_CONVERSATION_NAME`         | 'Default'               | The name of the conversation in AGiXT.                                                                               |
| `AGIXT_CONVERSATION_MODE`         | 'static'                | The mode of conversation in AGiXT, can be 'static', 'select', or 'uuid'.                                             |
| `AGIXT_API_KEY`                   | ''                      | The API key for AGiXT.                                                                                               |
| `AGIXT_SERVER`                    | 'http://localhost:7437' | The server address for AGiXT.                                                                                        |
| `INTERACTIVE_UI`                  | 'chat'                  | The interactive UI mode for AGiXT.                                                                                   |
| `AGIXT_SHOW_APP_BAR`              | 'true'                  | Determines if the app bar is shown in AGiXT.                                                                         |
| `AGIXT_SHOW_SELECTION`            | ''                      | Determines what selections are shown, based on conversation mode.                                                    |
| `AGIXT_FOOTER_MESSAGE`            | 'Powered by AGiXT'      | The footer message displayed in AGiXT.                                                                               |
| `AGIXT_RLHF`                      | 'false'                 | Related to RLHF (Reinforcement Learning from Human Feedback) in AGiXT.                                               |
| `AGIXT_SHOW_CHAT_THEME_TOGGLES`   | 'true'                  | Indicates if chat theme toggles are shown in AGiXT.                                                                  |
| `AGIXT_FILE_UPLOAD_ENABLED`       | ''                      | Indicates if file upload is enabled in AGiXT.                                                                        |
| `AGIXT_VOICE_INPUT_ENABLED`       | ''                      | Indicates if voice input is enabled in AGiXT.                                                                        |
| `AGIXT_ENABLE_SEARCHPARAM_CONFIG` | 'true'                  | Determines if search parameter configuration is enabled in AGiXT.                                                    |
| `AGIXT_MODE`                      | 'prompt'                | The operational mode of AGiXT, typically 'prompt'.                                                                   |
| `AGIXT_AGENT`                     | ''                      | The agent used in AGiXT.                                                                                             |
| `AGIXT_INSIGHT_AGENT`             | ''                      | The insight agent used in AGiXT.                                                                                     |
| `AGIXT_USE_SELECTED_AGENT`        | ''                      | Determines if the selected agent is used in AGiXT.                                                                   |
| `AGIXT_PROMPT_NAME`               | ''                      | The name of the prompt in AGiXT.                                                                                     |
| `AGIXT_PROMPT_CATEGORY`           | ''                      | The category of the prompt in AGiXT.                                                                                 |
| `AGIXT_COMMAND`                   | ''                      | The command in AGiXT.                                                                                                |
| `AGIXT_COMMAND_MESSAGE_ARG`       | ''                      | The command message argument in AGiXT.                                                                               |
| `AGIXT_CHAIN`                     | ''                      | The chain used in AGiXT.                                                                                             |
| `AGIXT_CHAIN_ARGS`                | '{}'                    | The arguments for the chain in AGiXT.                                                                                |
| `ENV`                             | 'development'           | The environment mode, if not provided, this will use 'production' in `npm start` and 'development' in `npm run dev`. |

Configuration can also be set via search params / query params, if enabled.

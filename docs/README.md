# AGiXT Interactive

[![GitHub](https://img.shields.io/badge/GitHub-AGiXT%20Core-blue?logo=github&style=plastic)](https://github.com/Josh-XT/AGiXT) [![GitHub](https://img.shields.io/badge/GitHub-AGiXT%20Hub-blue?logo=github&style=plastic)](https://github.com/AGiXT/hub) [![GitHub](https://img.shields.io/badge/GitHub-AGiXT%20NextJS%20Web%20UI-blue?logo=github&style=plastic)](https://github.com/AGiXT/nextjs)

[![GitHub](https://img.shields.io/badge/GitHub-AGiXT%20Python%20SDK-blue?logo=github&style=plastic)](https://github.com/AGiXT/python-sdk) [![pypi](https://img.shields.io/badge/pypi-AGiXT%20Python%20SDK-blue?logo=pypi&style=plastic)](https://pypi.org/project/agixtsdk/)

[![GitHub](https://img.shields.io/badge/GitHub-AGiXT%20TypeScript%20SDK-blue?logo=github&style=plastic)](https://github.com/AGiXT/typescript-sdk) [![npm](https://img.shields.io/badge/npm-AGiXT%20TypeScript%20SDK-blue?logo=npm&style=plastic)](https://www.npmjs.com/package/agixt)

[![Discord](https://img.shields.io/discord/1097720481970397356?label=Discord&logo=discord&logoColor=white&style=plastic&color=5865f2)](https://discord.gg/d3TkHRZcjD)
[![Twitter](https://img.shields.io/badge/Twitter-Follow_@Josh_XT-blue?logo=twitter&style=plastic)](https://twitter.com/Josh_XT)

[![Logo](https://josh-xt.github.io/AGiXT/images/AGiXT-gradient-flat.svg)](https://josh-xt.github.io/AGiXT/)

AGiXT Interactive is a NextJS front end for AGiXT for interacting with agents.

## Run AGiXT Interactive front end

- If you don't already have AGiXT, [follow this link for instructions to set it up.](https://github.com/Josh-XT/AGiXT#quick-start-guide)
- After you have run the AGiXT back end, follow these instructions below.

Modify the `.env.local` file to your liking.

```env
AGIXT_SERVER=http://localhost:7437
AGIXT_AGENT=gpt4free
AGIXT_INSIGHT_AGENT=gpt4free
AGIXT_MODE=prompt
AGIXT_PROMPT_NAME=Chat
AGIXT_PROMPT_CATEGORY=Default
AGIXT_CHAIN=Postgres Chat
AGIXT_USE_SELECTED_AGENT=true
AGIXT_CHAIN_ARGS={}
AGIXT_DARKMODE=true
AGIXT_FILE_UPLOAD_ENABLED=false
AGIXT_SHOW_CONVERSATION_BAR=true
AGIXT_CONVERSATION_NAME=Test
```

- `AGIXT_SERVER` is the URL of the AGiXT server to connect to.
- `AGIXT_AGENT` is the name of the agent to use.
- `AGIXT_INSIGHT_AGENT` is the name of the agent to use for insights.
- `AGIXT_MODE` is the mode to use. `prompt` or `chain`.
- `AGIXT_PROMPT_NAME` is the name of the prompt to use if `AGIXT_MODE` is `prompt`.
- `AGIXT_PROMPT_CATEGORY` is the category of the prompt to use if `AGIXT_MODE` is `prompt`.
- `AGIXT_CHAIN` is the name of the chain to use if `AGIXT_MODE` is `chain`.
- `AGIXT_USE_SELECTED_AGENT` is whether to use the selected agent or not for running all chain steps or allow the chain to use predefined agents. If set to `true`, the chain will use the selected agent for all steps.
- `AGIXT_CHAIN_ARGS` is a JSON object of arguments to pass to the chain.
- `AGIXT_DARKMODE` is whether to use dark mode or not, default is `true`.
- `AGIXT_FILE_UPLOAD_ENABLED` is whether to enable file uploads or not, default is `false`.
- `AGIXT_SHOW_CONVERSATION_BAR` is whether to show the conversation bar or not, default is `true`.
- `AGIXT_CONVERSATION_NAME` is the name of the conversation to use, default is `Test`.
- `TZ` is the timezone to use, default is `America/New_York`.

### Run with Docker Compose

```bash
docker-compose pull && docker-compose up
```

Access at <http://localhost:3437>

## History

![Star History Chart](https://api.star-history.com/svg?repos=Josh-XT/AGiXT&type=Dat)

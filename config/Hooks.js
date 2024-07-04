const InteractiveConfigDefault = require('../types/InteractiveConfigDefault');

exports.useAGiXTConfig = () => ({
  env: {
    NEXT_PUBLIC_AGIXT_CONVERSATION_NAME: process.env.AGIXT_CONVERSATION || 'Default',
    NEXT_PUBLIC_AGIXT_CONVERSATION_MODE: process.env.AGIXT_CONVERSATION_MODE || 'static', // static, select or uuid
    NEXT_PUBLIC_AGIXT_API_KEY: process.env.AGIXT_API_KEY || '',
    NEXT_PUBLIC_AGIXT_SERVER: process.env.AGIXT_SERVER || process.env.AUTH_SERVER || 'http://localhost:7437',
    NEXT_PUBLIC_AUTH_SERVER: process.env.AUTH_SERVER || process.env.AGIXT_SERVER || '',
    // UI Options
    NEXT_PUBLIC_INTERACTIVE_UI: process.env.INTERACTIVE_UI || 'chat',
    NEXT_PUBLIC_AGIXT_SHOW_APP_BAR: process.env.AGIXT_SHOW_APP_BAR || 'true',
    NEXT_PUBLIC_AGIXT_SHOW_SELECTION:
      process.env.AGIXT_SHOW_SELECTION || (process.env.AGIXT_CONVERSATION_MODE === 'select' ? 'conversation' : ''), // csv of: 'agent', 'conversation' and/or 'prompt'
    NEXT_PUBLIC_AGIXT_FOOTER_MESSAGE: process.env.AGIXT_FOOTER_MESSAGE || 'Powered by AGiXT',
    NEXT_PUBLIC_AGIXT_RLHF: process.env.AGIXT_RLHF || 'false',
    NEXT_PUBLIC_AGIXT_SHOW_CHAT_THEME_TOGGLES:
      process.env.AGIXT_SHOW_CHAT_THEME_TOGGLES || process.env.AGIXT_SHOW_APP_BAR === 'false' ? 'true' : 'false',
    NEXT_PUBLIC_AGIXT_FILE_UPLOAD_ENABLED: process.env.AGIXT_FILE_UPLOAD_ENABLED, //|| String(InteractiveConfigDefault.overrides.enableFileUpload),
    NEXT_PUBLIC_AGIXT_VOICE_INPUT_ENABLED: process.env.AGIXT_VOICE_INPUT_ENABLED, //|| String(InteractiveConfigDefault.overrides.enableVoiceInput),
    NEXT_PUBLIC_AGIXT_ALLOW_MESSAGE_EDITING: process.env.AGIXT_ALLOW_MESSAGE_EDITING, //|| String(InteractiveConfigDefault.overrides.allowMessageEditing),
    NEXT_PUBLIC_AGIXT_ALLOW_MESSAGE_DELETION: process.env.AGIXT_ALLOW_MESSAGE_DELETION, //|| String(InteractiveConfigDefault.overrides.allowMessageEditing),
    NEXT_PUBLIC_AGIXT_SHOW_OVERRIDE_SWITCHES: process.env.AGIXT_SHOW_OVERRIDE_SWITCHES || 'tts,websearch',
    // Override Options
    NEXT_PUBLIC_AGIXT_ENABLE_SEARCHPARAM_CONFIG: process.env.AGIXT_ENABLE_SEARCHPARAM_CONFIG || 'true',
    NEXT_PUBLIC_AGIXT_MODE: process.env.AGIXT_MODE || InteractiveConfigDefault.overrides.mode,
    // State Options, Defined in ./types/InteractiveConfigDefault.js
    NEXT_PUBLIC_AGIXT_AGENT: process.env.AGIXT_AGENT || InteractiveConfigDefault.agent,
    NEXT_PUBLIC_AGIXT_INSIGHT_AGENT: process.env.AGIXT_INSIGHT_AGENT || InteractiveConfigDefault.overrides.insightAgentName,
    NEXT_PUBLIC_AGIXT_USE_SELECTED_AGENT: process.env.AGIXT_USE_SELECTED_AGENT, //|| String(InteractiveConfigDefault.overrides.chainRunConfig.useSelectedAgent),
    // Prompt Mode Options, Defined in ./types/InteractiveConfigDefault.js
    NEXT_PUBLIC_AGIXT_PROMPT_NAME: process.env.AGIXT_PROMPT_NAME || InteractiveConfigDefault.overrides.prompt,
    NEXT_PUBLIC_AGIXT_PROMPT_CATEGORY:
      process.env.AGIXT_PROMPT_CATEGORY || InteractiveConfigDefault.overrides.promptCategory,
    // Command Mode Options, Defined in ./types/InteractiveConfigDefault.js
    NEXT_PUBLIC_AGIXT_COMMAND: process.env.AGIXT_COMMAND || InteractiveConfigDefault.overrides.command,
    NEXT_PUBLIC_AGIXT_COMMAND_MESSAGE_ARG:
      process.env.AGIXT_COMMAND_MESSAGE_ARG || InteractiveConfigDefault.overrides.commandMessageArg,
    // Chain Mode Options, Defined in ./types/InteractiveConfigDefault.js
    NEXT_PUBLIC_AGIXT_CHAIN: process.env.AGIXT_CHAIN || InteractiveConfigDefault.overrides.chain,
    NEXT_PUBLIC_AGIXT_CHAIN_ARGS:
      process.env.AGIXT_CHAIN_ARGS || JSON.stringify(InteractiveConfigDefault.overrides.chainRunConfig.chainArgs),
  },
  images: process.env.AGIXT_SERVER && {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.AGIXT_SERVER.split('://')[1].split(':')[0].split('/')[0],
        port: '',
        pathname: '/outputs/**',
      },
    ],
  },
});

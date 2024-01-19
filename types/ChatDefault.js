const ChatDefault = {
  chatSettings: {
    selectedAgent: 'gpt4free',
    contextResults: 0,
    shots: 0,
    websearchDepth: 0,
    injectMemoriesFromCollectionNumber: 0,
    conversationResults: 5,
    conversationName: 'Default',
    browseLinks: false,
    webSearch: false,
    insightAgentName: '',
    enableMemory: false,
    enableFileUpload: false,
    useSelectedAgent: true,
    chainRunConfig: {
      chainArgs: {},
      singleStep: false,
      fromStep: 0,
      allResponses: false,
    },
  },
  chatState: {
    conversation: [],
    hasFiles: false,
    lastResponse: {},
    uploadedFiles: [],
    isLoading: false,
  },
  prompt: '',
  promptCategory: '',
  chain: '',
  //message: '',
  mutate: null,
  sdk: null,
};
module.exports = ChatDefault;

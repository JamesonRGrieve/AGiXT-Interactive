import { AGiXTState } from "@/types/AGiXTState";
import { useState } from "react";
export type ChatProps = {
    mode: 'chat'|'prompt'|'instruct'|'chain',
    showAppBar: boolean,
    showConversationSelector: boolean,
}
const Stateful = (props: ChatProps) => {
    const [AGiXTState, setAGiXTState] = useState<AGiXTState>({
        // Global State Here
        agent: {
          name: '',
          commands: {},
          settings: {}
        },
        agents: [],
        extensions: [],
        llms: [],
        providers: [],
        chains: [],
        prompts: [],
        promptCategories: [],
        conversations: [],
        trainingConfig: {
          collectionNumber: 0,
          limit: 0,
          minRelevanceScore: 0
        },
        chatConfig: {
          contextResults: 0,
          shots: 0,
          websearchDepth: 0,
          injectMemoriesFromCollectionNumber: 0,
          conversationResults: 5,
          conversationName: '',
          browseLinks: false,
          webSearch: false,
          insightAgentName: '',
          enableMemory: false,
          enableFileUpload: false,
          chainRunConfig: {
            selectedChain: '',
            chainArgs: {},
            singleStep: false,
            fromStep: 0,
            allResponses: false,
            useSelectedAgent: true
          },
          promptConfig: {
            promptName: '',
            promptCategory: '',
            promptArgs: {},
            useSelectedAgent: true
          },
        },
        chatState: {
          conversation: {},
          hasFiles: false,
          lastResponse: {},
          uploadedFiles: [],
          isLoading: false
        },
        sdk: new AGiXTSDK({
          baseUri: process.env.NEXT_PUBLIC_API_URI || 'http://localhost:7437',
          apiKey: process.env.NEXT_PUBLIC_API_KEY || ''
        }),
        //message: '',
        mutate: null
      } as AGiXTState);
      return <Chat {...props} state={AGiXTState} />
};
const Stateless = ({state, mode, showAppBar, showConversationSelector}: ChatProps & {state: AGiXTState}) => {
    return <Chat state={state} mode={mode} showAppBar={showAppBar} showConversationSelector={showConversationSelector} />
}
const AGiXTChat = ({state, mode, showAppBar, showConversationSelector}: ChatProps & {state?: AGiXTState}) => state ? 
<Stateless state={state} mode={mode} showAppBar={showAppBar} showConversationSelector={showConversationSelector} /> 
: <Stateful mode={mode} showAppBar={showAppBar} showConversationSelector={showConversationSelector} />;
export default AGiXTChat;
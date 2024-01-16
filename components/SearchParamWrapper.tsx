'use client';
import { useSearchParams } from 'next/navigation';
import AGiXTChat from './AGiXTChat';

const SearchParamWrapper = (mode) => {
  const searchParams = useSearchParams();
  return (
    <AGiXTChat
      stateful
      mode={mode}
      showAppBar={false}
      showConversationSelector={false}
      opts={{
        agentName: searchParams.get('agentName') || undefined,
        promptName: searchParams.get('promptName') || undefined,
        promptCategory: searchParams.get('promptCategory') || undefined,
        conversationName: searchParams.get('conversationName') || undefined,
      }}
    />
  );
};

export default SearchParamWrapper;

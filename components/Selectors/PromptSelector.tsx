'use client';

import React, { useContext, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InteractiveConfigContext } from '../InteractiveConfigContext';
import { usePrompts } from '../hooks';

export default function PromptSelector({ value, onChange }): React.JSX.Element {
  const state = useContext(InteractiveConfigContext);
  const { data: promptData } = usePrompts();
  useEffect(() => {
    console.log('Value changed to ', value);
  }, [value]);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className='w-full'>
            <Select
              disabled={promptData?.length === 0}
              value={value || (state.overrides.prompt === undefined ? '/' : state.overrides.prompt)}
              onValueChange={
                onChange
                  ? (value) => {
                      onChange(value);
                    }
                  : (value) =>
                      state.mutate((oldState) => ({
                        ...oldState,
                        overrides: { ...oldState.overrides, prompt: value === '/' ? undefined : value },
                      }))
              }
            >
              <SelectTrigger className='w-full text-xs'>
                <SelectValue placeholder='Select a Prompt' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='/'>- Use Agent Default -</SelectItem>
                {promptData &&
                  promptData.map &&
                  promptData.map((promptName, index) => (
                    <SelectItem key={index.toString() + '-' + promptName} value={promptName}>
                      {promptName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Select a Prompt</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

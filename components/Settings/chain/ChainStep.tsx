'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { LuArrowUp, LuArrowDown, LuSave, LuX } from 'react-icons/lu';
import { useInteractiveConfig } from '@/components/interactive/InteractiveConfigContext';
import PromptSelector from '../../Selectors/PromptSelector';
import PromptCategorySelector from '../../Selectors/PromptCategorySelector';
import CommandSelector from '../../Selectors/CommandSelector';
import ChainSelector from '../../Selectors/ChainSelector';
import useSWR, { mutate } from 'swr';
import { usePromptArgs } from '../../hooks';

export default function ChainStep({
  step,
  last_step,
  agent_name,
  prompt_type,
  prompt,
}: {
  step: number;
  last_step: boolean;
  agent_name: string;
  prompt_type: string;
  prompt: any;
}) {
  const pn = prompt_type === 'Prompt' ? prompt.prompt_name : prompt_type === 'Command' ? prompt.command_name : prompt.chain;
  const [agentName, setAgentName] = useState(agent_name);
  const [targetName, setTargetName] = useState(pn);
  const [args, setArgs] = useState(prompt);
  const [targetCategory, setTargetCategory] = useState(prompt.target_category || 'Default');
  const [stepType, setStepType] = useState(-1);
  const context = useInteractiveConfig();
  const [modified, setModified] = useState(false);
  const ignoreArgs = ['prompt_name', 'prompt_category', 'command_name', 'chain'];
  const searchParams = useSearchParams();
  const { data: promptArgs } = usePromptArgs(targetName, targetCategory);

  useEffect(() => {
    console.log('Targetname changed to ', targetName);
  }, [targetName]);
  const { data: agentData } = useSWR('/agents', async () =>
    ((await context.agixt.getAgents()) as any[])
      .map((agent: any) => agent.name)
      .sort((a: any, b: any) => {
        const nameA = typeof a.name === 'string' ? a.name.trim().toLowerCase() : '';
        const nameB = typeof b.name === 'string' ? b.name.trim().toLowerCase() : '';
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      }),
  );

  const step_types = useMemo(
    () => [
      {
        name: 'Prompt',
        component: (
          <>
            <PromptCategorySelector category={targetCategory.toString()} categoryMutate={setTargetCategory} />
            <PromptSelector value={targetName} onChange={setTargetName} />
          </>
        ),
      },
      {
        name: 'Command',
        component: <CommandSelector agentName={agentName} value={targetName} onChange={setTargetName} />,
      },
      {
        name: 'Chain',
        component: <ChainSelector value={targetName} onChange={setTargetName} />,
      },
    ],
    [agentName, targetName, targetCategory],
  );

  useEffect(() => {
    setStepType(step_types.findIndex((step_type) => step_type.name === prompt_type));
  }, [prompt_type, step_types]);

  useEffect(() => {
    setTargetName(
      prompt_type === 'Prompt' ? prompt.prompt_name : prompt_type === 'Command' ? prompt.command_name : prompt.chain,
    );
  }, [prompt.prompt_name, prompt.command_name, prompt.chain, prompt_type]);

  useEffect(() => {
    (async (): Promise<void> => {
      if (prompt_type === 'Prompt') {
        console.log(promptArgs);
        setArgs(
          Object.assign(
            promptArgs.reduce((acc, key) => {
              acc[key] = '';
              return acc;
            }, {}),
            prompt,
          ),
        );
      } else if (prompt_type === 'Chain') {
        setArgs(Object.assign(await context.agixt.getChainArgs(targetName), prompt));
      } else {
        setArgs(prompt);
      }
    })();
  }, [prompt, prompt_type, targetName, context.agixt]);

  useEffect(() => {
    if (prompt.prompt_category) {
      setTargetCategory(prompt.prompt_category);
    } else {
      setTargetCategory('Default');
    }
  }, [prompt.prompt_category]);

  const handleIncrement = async (): Promise<void> => {
    await context.agixt.moveStep(searchParams.get('chain') ?? '', step, Number(step) + 1);
    mutate(`/chain?chain=${searchParams.get('chain')}`);
  };

  const handleDecrement = async (): Promise<void> => {
    await context.agixt.moveStep(searchParams.get('chain') ?? '', step, Number(step) - 1);
    mutate(`/chain?chain=${searchParams.get('chain')}`);
  };

  const handleSave = async (): Promise<void> => {
    await context.agixt.updateStep(searchParams.get('chain') ?? '', step, agentName, step_types[stepType].name, args);
    mutate(`/chain?chain=${searchParams.get('chain')}`);
    setModified(false);
  };

  const handleDelete = async (): Promise<void> => {
    await context.agixt.deleteStep(searchParams.get('chain') ?? '', step);
    mutate(`/chain?chain=${searchParams.get('chain')}`);
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>Step {step}</h3>
        <div className='space-x-2'>
          <Button onClick={handleDecrement} disabled={step === 1} size='sm'>
            <LuArrowUp className='h-4 w-4' />
          </Button>
          <Button onClick={handleIncrement} disabled={last_step} size='sm'>
            <LuArrowDown className='h-4 w-4' />
          </Button>
          <Button onClick={handleSave} disabled={!modified} size='sm'>
            <LuSave className='h-4 w-4' />
          </Button>
          <Button onClick={handleDelete} variant='destructive' size='sm'>
            <LuX className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-3 gap-4'>
        <div>
          <Label htmlFor='step-type'>Step Type</Label>
          <Select
            value={stepType.toString()}
            onValueChange={(value) => {
              setStepType(Number(value));
              setModified(true);
            }}
          >
            <SelectTrigger id='step-type'>
              <SelectValue placeholder='Select a Type...' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='-1'>Select a Type...</SelectItem>
              {step_types.map((type, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor='agent-name'>Agent Name</Label>
          <Select
            value={agentName}
            onValueChange={(value) => {
              setAgentName(value);
              setModified(true);
            }}
          >
            <SelectTrigger id='agent-name'>
              <SelectValue placeholder='Select an Agent' />
            </SelectTrigger>
            <SelectContent>
              {agentData &&
                agentData.map(
                  (agent) =>
                    agent !== 'undefined' && (
                      <SelectItem key={agent} value={agent}>
                        {agent}
                      </SelectItem>
                    ),
                )}
            </SelectContent>
          </Select>
        </div>
        <div>{stepType !== -1 ? step_types[stepType].component : null}</div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        {Object.keys(args)
          .filter((key) => !ignoreArgs.includes(key))
          .map((name) => {
            const label = name.replace(/_/g, ' ').replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());

            if (typeof args[name] === 'boolean') {
              return (
                <div key={name} className='flex items-center space-x-2'>
                  <Switch
                    id={name}
                    checked={args[name]}
                    onCheckedChange={(checked) => {
                      setArgs({ ...args, [name]: checked });
                      setModified(true);
                    }}
                  />
                  <Label htmlFor={name}>{label}</Label>
                </div>
              );
            }

            return (
              <div key={name}>
                <Label htmlFor={name}>{label}</Label>
                <Input
                  id={name}
                  value={args[name]}
                  type={typeof args[name] === 'number' ? 'number' : 'text'}
                  onChange={(e) => {
                    setArgs({ ...args, [name]: e.target.value });
                    setModified(true);
                  }}
                  className='w-full'
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}

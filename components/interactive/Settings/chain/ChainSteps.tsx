'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle as LuPlusCircle } from 'lucide-react';
import { useInteractiveConfig } from '@/components/interactive/InteractiveConfigContext';
import ChainStep from './ChainStep';

export default function ChainSteps({ chainData, chainMutate }) {
  const context = useInteractiveConfig();
  const searchParams = useSearchParams();

  const handleAdd = async () => {
    const lastStep = chainData.steps[chainData.steps.length - 1];
    await context.agixt.addStep(
      chainData.chain_name,
      chainData.steps.length + 1,
      lastStep ? lastStep.agent_name : context.agent,
      lastStep ? lastStep.prompt_type : 'Prompt',
      lastStep
        ? lastStep.prompt
        : {
            prompt_name: 'Think About It',
            prompt_category: 'Default',
          },
    );
    chainMutate();
  };

  return (
    <div className='space-y-4'>
      {chainData?.steps &&
        chainData.steps.map((step, index) => (
          <Card key={index}>
            <CardContent>
              <ChainStep
                {...step}
                agent_name={step.agent_name}
                step_type={step.prompt_type}
                step_object={step.prompt}
                last_step={chainData.steps.length === index + 1}
              />
            </CardContent>
          </Card>
        ))}
      <div className='flex items-center'>
        <Button onClick={handleAdd} variant='outline' className='flex items-center'>
          <LuPlusCircle className='mr-2 h-4 w-4' />
          Add Step
        </Button>
      </div>
    </div>
  );
}

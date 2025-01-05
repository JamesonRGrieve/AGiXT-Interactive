import React, { ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function FormInput({
  argValues,
  setArgValues,
  disabled,
}: {
  argValues: Record<string, string>;
  setArgValues: (argValues: Record<string, string> | ((previous: Record<string, string>) => Record<string, string>)) => void;
  disabled: boolean;
}): ReactNode {
  return (
    <div
      className={cn(
        'mt-4 px-4 flex flex-row gap-4 justify-center items-center',
        disabled && 'opacity-50 pointer-events-none',
      )}
    >
      {Object.keys(argValues).map((arg) => {
        const [argType, argName] = arg.split('_');
        if (argType.toLowerCase() === 'text') {
          return (
            <div key={argName} className='w-full space-y-2'>
              <Label htmlFor={argName}>{argName.replace(/([A-Z])/g, ' $1')}</Label>
              <Input
                id={argName}
                disabled={disabled}
                value={argValues[String(arg)]}
                onChange={(event) => {
                  setArgValues((previous) => ({ ...previous, [arg]: event.target.value }));
                }}
                className='w-full'
                placeholder={argName.replace(/([A-Z])/g, ' $1')}
              />
            </div>
          );
        }
      })}
    </div>
  );
}

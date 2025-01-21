import React, { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  helperText?: string;
  label?: string;
  name: string;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
  type?: string;
  error?: string | boolean;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { id, value, onChange, helperText, label, placeholder, name, autoComplete, className, type = 'text', error, ...props },
  ref,
) {
  return (
    <div className='flex flex-col w-full gap-2 mb-4'>
      <Label htmlFor={id}>{label}</Label>
      <Input
        {...props}
        {...{ id, value, onChange, name, autoComplete, placeholder, type, ref }}
        className={`border ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
      />
      {error && typeof error === 'string' && <p className='text-sm text-red-500'>{error}</p>}
      {!error && helperText && <p className='text-sm text-gray-500'>{helperText}</p>}
    </div>
  );
});

export default TextField;

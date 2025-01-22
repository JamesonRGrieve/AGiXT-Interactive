import React from 'react';
import CheckField from './CheckField';
import PasswordField from './PasswordField';
import SelectField from './SelectField';
import TextField from './TextField';
import RadioField from './RadioField';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type Message = {
  level: string;
  value: string;
};
export type Field = {
  label: string;
  description?: string;
  autoComplete?: string;
  placeholder?: string;
  validate?: (value: string) => boolean;
  type?: 'text' | 'password' | 'select' | 'time' | 'date' | 'datetime' | 'checkbox' | 'radio';
  items?: {
    value: string;
    label: string;
  }[];
};
export type FieldProps = Field & {
  nameID: string;
  value?: string;
  onChange?: any;
  messages?: Message[];
};

const FieldInput: React.FC<FieldProps> = ({
  nameID,
  label,
  value,
  onChange,
  autoComplete,
  placeholder = '',
  type = 'text',
  items,
}) => {
  const injectedOnChange = onChange
    ? (target: any) => {
        onChange(target, nameID);
      }
    : null;

  const commonProps = {
    id: nameID,
    name: nameID,
    value,
    onChange: injectedOnChange,
    label,
  };

  switch (type) {
    case 'text':
      return <TextField {...commonProps} autoComplete={autoComplete} placeholder={placeholder} />;
    case 'password':
      return <PasswordField {...commonProps} autoComplete={autoComplete} />;
    case 'select':
      return <SelectField {...commonProps} items={items} />;
    case 'checkbox':
      return <CheckField {...commonProps} value={['on', 'true'].includes(value?.toLowerCase())} />;
    case 'radio':
      return <RadioField {...commonProps} items={items} />;
    default:
      return <TextField {...commonProps} autoComplete={autoComplete} />;
  }
};

const Field: React.FC<FieldProps> = ({ nameID, label, description, type = 'text', messages = [], ...rest }) => {
  return (
    <div className='w-full my-4'>
      {['checkbox', 'radio'].includes(type) && (
        <Label id={nameID + '-label'} htmlFor={nameID}>
          {label}
        </Label>
      )}
      {description && <p className='mb-2'>{description}</p>}
      <FieldInput nameID={nameID} label={label} type={type} {...rest} />
      {messages && (
        <div className={cn('transition-all', messages.length > 0 ? 'block' : 'hidden')}>
          {/* Should render messages as a map of MUI Alert's */}
          {messages?.map((message, index) => (
            <div
              key={index}
              className={`mt-2 p-3 rounded ${
                message.level === 'error'
                  ? 'bg-red-100 text-red-700'
                  : message.level === 'warning'
                    ? 'bg-yellow-100 text-yellow-700'
                    : message.level === 'info'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
              }`}
            >
              {message.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Field;

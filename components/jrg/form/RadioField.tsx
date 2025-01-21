import React from 'react';

interface RadioFieldProps {
  id: string;
  value: any;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  items: any[];
  name: string;
}

export default function RadioField({ id, value, onChange, items, name }: RadioFieldProps) {
  return (
    <div id={id} role='radiogroup' aria-labelledby={id}>
      {items?.map((item: any, index: number) => {
        const itemId = (item.value ?? item).replace(/[\W_]+/g, '');
        const itemValue = item.value ?? item;
        const itemLabel = item.label ?? item;

        return (
          <label key={index} htmlFor={itemId} className='flex items-center mb-2 cursor-pointer'>
            <input
              type='radio'
              id={itemId}
              name={name}
              value={itemValue}
              checked={value === itemValue}
              onChange={onChange}
              className='hidden'
            />
            <div
              className={`w-5 h-5 border rounded-full mr-2 flex items-center justify-center
              ${value === itemValue ? 'border-blue-500' : 'border-gray-300'}`}
            >
              {value === itemValue && <div className='w-3 h-3 bg-blue-500 rounded-full' />}
            </div>
            <span className='text-gray-700'>{itemLabel}</span>
          </label>
        );
      })}
    </div>
  );
}

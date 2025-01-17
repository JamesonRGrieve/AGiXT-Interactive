import React from 'react';

interface CheckFieldProps {
  id: string;
  name: string;
  value: boolean | string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  helperText?: string;
  label?: string;
  items?: string[];
}

export default function CheckField({ id, name, value, onChange, helperText, label, items }: CheckFieldProps) {
  const isMulti = Array.isArray(items) && items.length > 0;

  if (isMulti) {
    return (
      <div className='space-y-2'>
        {items.map((item, index) => (
          <label key={index} className='flex items-center space-x-2 cursor-pointer'>
            <input
              type='checkbox'
              id={`${id}_${item.replace(/[\W_]+/g, '')}`}
              checked={(value as string[]).includes(item)}
              onChange={(event) => {
                const newValue = [...(value as string[])];
                if (event.target.checked) {
                  newValue.push(item);
                } else {
                  const index = newValue.indexOf(item);
                  if (index > -1) {
                    newValue.splice(index, 1);
                  }
                }
                onChange({ target: { name, value: newValue } } as unknown as React.ChangeEvent<HTMLInputElement>);
              }}
              className='form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out'
            />
            <span className='text-gray-700'>{item}</span>
          </label>
        ))}
      </div>
    );
  } else {
    return (
      <label className='flex items-center space-x-2 cursor-pointer'>
        <input
          type='checkbox'
          id={id}
          name={name}
          checked={value as boolean}
          onChange={onChange}
          className='form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out'
        />
        <span className='text-gray-700'>{helperText ?? label}</span>
      </label>
    );
  }
}

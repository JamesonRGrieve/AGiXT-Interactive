import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SelectFieldProps {
  id: string;
  value: any;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  items: any[];
  name: string;
  label: string;
  placeholder?: string;
}

export default function SelectField({
  id,
  value,
  onChange,
  items,
  name,
  label,
  placeholder = 'Select an option',
}: SelectFieldProps) {
  // TODO: Update the onChange in the interface (this requires refactoring the components that use it)
  const handleValueChange = (selectedValue: string) => {
    const event = {
      target: { value: selectedValue, name },
    } as React.ChangeEvent<HTMLSelectElement>;

    onChange(event);
  };

  return (
    <div className='flex flex-col w-full gap-2 mb-4'>
      <Label htmlFor={id}>{label}</Label>
      <Select onValueChange={handleValueChange} value={value}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {items?.map((item: any, index: number) => (
              <SelectItem key={index} value={item.value ?? item}>
                {item.label ?? item}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

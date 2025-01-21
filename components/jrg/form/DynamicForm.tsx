import timezones from 'timezones-list';

import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import Field from './Field';
import TextField from './TextField';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import log from '../next-log/log';

export function toTitleCase(str: string) {
  // Replace underscores, or capital letters (in the middle of the string) with a space and the same character
  str = str.replace(/(_)|((?<=\w)[A-Z])/g, ' $&');

  // Remove underscore if exists
  str = str.replace(/_/g, '');

  // Convert to title case
  str = str.replace(/\w\S*/g, (txt: string) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  return str;
}
const typeDefaults = {
  text: '',
  password: '',
  number: 0,
  boolean: false,
};
export type DynamicFormFieldValueTypes = string | number | boolean;
export type DynamicFormProps = {
  fields?: {
    [key: string]: {
      type: 'text' | 'number' | 'password' | 'boolean';
      display?: string;
      value?: DynamicFormFieldValueTypes;
      validation?: (value: DynamicFormFieldValueTypes) => boolean;
    };
  };
  submitButtonText?: string;
  excludeFields?: string[];
  readOnlyFields?: string[];
  toUpdate?: any;
  additionalButtons?: ReactNode[];
  onConfirm: (data: { [key: string]: DynamicFormFieldValueTypes }) => void;
};

export default function DynamicForm({
  fields,
  toUpdate,
  excludeFields = [],
  readOnlyFields = [],
  onConfirm,
  submitButtonText = 'Submit',
  additionalButtons = [],
}: DynamicFormProps) {
  if (fields === undefined && toUpdate === undefined) {
    throw new Error('Either fields or toUpdate must be provided to DynamicForm.');
  }
  const [editedState, setEditedState] = useState<{ [key: string]: { value: DynamicFormFieldValueTypes; error: string } }>(
    {},
  );
  const handleChange = useCallback((event: any, id?: string) => {
    setEditedState((prevState) => ({
      ...prevState,
      [id]: { ...prevState[id], value: event.target.value },
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    Object.keys(fields ?? toUpdate).forEach((key: string) => {
      try {
        if (fields) {
          if (fields[key].validation && fields[key].validation(editedState[key].value)) {
            setEditedState((prevState) => ({ ...prevState, [key]: { ...prevState[key], error: '' } }));
          } else {
            setEditedState((prevState) => ({
              ...prevState,
              [key]: { ...prevState[key], error: 'Invalid value, please double check your input.' },
            }));
          }
        } else {
          if (typeof toUpdate[key as keyof typeof toUpdate] === 'number' && isNaN(Number(editedState[key].value))) {
            setEditedState((prevState) => ({
              ...prevState,
              [key]: { ...prevState[key], error: 'Expected a number for this input.' },
            }));
          } else {
            setEditedState((prevState) => ({ ...prevState, [key]: { ...prevState[key], error: '' } }));
          }
        }
      } catch (error) {
        setEditedState((prevState) => ({ ...prevState, [key]: { ...prevState[key], error: error.message } }));
      }
    });
    if (Object.values(editedState).every((field) => field.error === '')) {
      const formattedForReturn = Object.fromEntries(Object.entries(editedState).map(([key, value]) => [key, value.value]));
      onConfirm(formattedForReturn);
    }
  }, [editedState, fields, onConfirm]);

  // Initial state setup in useEffect to handle incoming props correctly
  useEffect(() => {
    const initialState: { [key: string]: { value: DynamicFormFieldValueTypes; error: string } } = {};
    Object.keys(fields ?? toUpdate).forEach((key) => {
      if (!excludeFields.includes(key) && !readOnlyFields.includes(key)) {
        initialState[key] = {
          value: fields
            ? (fields[key].value ?? typeDefaults[fields[key].type as keyof typeof typeDefaults])
            : toUpdate[key as keyof typeof toUpdate],
          error: '',
        };
      }
    });
    setEditedState(initialState);
    log(['Setting initial dynamic form state', initialState], { client: 2 });
  }, [fields, toUpdate]); // Depend on `fields` to re-initialize state when `fields` prop changes

  return (
    <form className='grid grid-cols-4 gap-4'>
      {Object.entries(editedState).map(
        ([field_name, field_object]) =>
          field_object !== undefined && (
            <div key={field_name.toLowerCase().replaceAll(' ', '-')} className='col-span-2'>
              {['tz', 'timezone'].includes(field_name) ? (
                <Field
                  nameID={field_name.toLowerCase().replaceAll(' ', '-')}
                  label={fields ? (fields[field_name].display ?? toTitleCase(field_name)) : toTitleCase(field_name)}
                  value={field_object?.value?.toString() || ''}
                  onChange={handleChange}
                  messages={field_object.error ? [{ level: 'error', value: field_object.error }] : []}
                  type='select'
                  items={timezones
                    .sort((a, b) => {
                      if (a.utc !== b.utc) {
                        return a.utc > b.utc ? 1 : -1;
                      } else {
                        return a.tzCode > b.tzCode ? 1 : -1;
                      }
                    })
                    .map((tz) => ({ value: tz.tzCode, label: tz.label }))}
                />
              ) : (
                <Field
                  nameID={field_name.toLowerCase().replaceAll(' ', '-')}
                  label={fields ? (fields[field_name].display ?? toTitleCase(field_name)) : toTitleCase(field_name)}
                  value={field_object?.value?.toString() || ''}
                  onChange={handleChange}
                  messages={field_object.error ? [{ level: 'error', value: field_object.error }] : []}
                  type={
                    fields && fields[field_name].type === 'boolean'
                      ? 'checkbox'
                      : (fields && fields[field_name].type === 'password') || field_name.toLowerCase().includes('password')
                        ? 'password'
                        : 'text'
                  }
                />
              )}
            </div>
          ),
      )}
      <Button
        className={`col-span-2 ${readOnlyFields.length > 0 && additionalButtons.length > 0 ? 'col-span-2' : ''}`}
        onClick={handleSubmit}
      >
        {submitButtonText}
      </Button>
      {readOnlyFields.length > 0 && <Separator className='col-span-4' />}
      {readOnlyFields.map((fieldName) => {
        return (
          toUpdate[fieldName as keyof typeof toUpdate] !== undefined && (
            <div className='col-span-2' key={fieldName.toLowerCase().replaceAll(' ', '-')}>
              <div className='w-full my-4'>
                <TextField
                  // fullWidth
                  onChange={() => null}
                  id={fieldName.toLowerCase().replaceAll(' ', '-')}
                  name={fieldName.toLowerCase().replaceAll(' ', '-')}
                  label={fields ? (fields[fieldName].display ?? toTitleCase(fieldName)) : toTitleCase(fieldName)}
                  value={toUpdate[fieldName as keyof typeof toUpdate]?.toString() || ''}
                  disabled
                />
              </div>
            </div>
          )
        );
      })}

      {additionalButtons}
    </form>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import { DialogProps } from '../Dialog';
import DynamicForm, { DynamicFormProps } from '@/components/jrg/ui/DynamicForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export type EditDialogProps = DialogProps & DynamicFormProps & { excludeFields?: string[] };

// TODO Maintain a state object of the form field values. Initialize it as their incoming values if present.
// TODO When the form is submitted, validate the fields first and call the onConfirm callback if all fields are valid.

const EditDialog: React.FC<EditDialogProps> = ({
  onClose,
  title,
  sx,
  fields,
  toUpdate,
  excludeFields,
  readOnlyFields,
  onConfirm,
  ButtonComponent,
  ButtonProps,
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const processedToUpdate = useMemo(() => {
    const toReturn = { ...toUpdate };
    if (excludeFields?.length > 0) {
      for (const key of excludeFields) {
        if (toReturn[key as keyof typeof toReturn]) {
          delete toReturn[key as keyof typeof toReturn];
        }
      }
    }
    return toReturn;
  }, [toUpdate, excludeFields]);

  return (
    <Dialog>
      <DialogTrigger>{ButtonComponent && <ButtonComponent {...ButtonProps} />}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DynamicForm
            toUpdate={processedToUpdate}
            fields={fields}
            readOnlyFields={readOnlyFields}
            onConfirm={(values) => {
              try {
                onConfirm(values);
              } catch (error) {
                setErrorMessage(error.message);
              }
            }}
          />
        </DialogHeader>
        <div className={errorMessage ? 'block' : 'hidden'}>
          <p className='text-destructive'>{errorMessage}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;

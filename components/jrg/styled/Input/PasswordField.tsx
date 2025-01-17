import React, { useState } from 'react';
import TextField from './TextField';

interface PasswordFieldProps {
  id?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  helperText?: string;
  label?: string;
  name?: string;
  autoComplete?: string;
  placeholder?: string;
}

export default function PasswordField({
  id = 'password',
  value,
  onChange,
  helperText,
  name = 'password',
  placeholder = 'Enter your password',
  label = 'Password',
  autoComplete = 'current-password',
}: PasswordFieldProps) {
  return (
    <TextField
      {...{
        id,
        value,
        onChange,
        placeholder,
        helperText,
        label,
        name,
        autoComplete,
        type: 'password',
      }}
    />
  );
}

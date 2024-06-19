import React, { ReactNode } from 'react';
import { Typography } from '@mui/material';
import generateId from './generateID';

export default function renderHeading(Tag, children): ReactNode {
  let text = '';
  if (children && children[0]) {
    text = children[0];
  }
  const id = generateId(text);
  return (
    <Typography component={Tag} variant={Tag} id={id}>
      {children}
    </Typography>
  );
}

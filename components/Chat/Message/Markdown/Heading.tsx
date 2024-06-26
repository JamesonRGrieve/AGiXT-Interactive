import React, { ReactNode } from 'react';
import { Typography } from '@mui/material';
import generateId from './generateID';

export default function MarkdownHeading({ tag, children, ...props }): ReactNode {
  let text = '';
  if (children && children[0]) {
    text = children[0];
  }
  const id = generateId(text);
  return (
    <Typography component={tag} variant={tag} id={id} my='0.25rem'>
      {children}
    </Typography>
  );
}

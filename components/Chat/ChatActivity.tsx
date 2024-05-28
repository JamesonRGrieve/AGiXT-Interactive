import { CheckCircle, Pending } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import React, { ReactNode } from 'react';

export default function ChatActivity({
  inProgress,
  message,
  alternateBackground,
}: {
  inProgress: boolean;
  message: string;
  alternateBackground: string;
}): ReactNode {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: theme.palette[String(alternateBackground)][theme.palette.mode],
        padding: '10px',
        overflow: 'hidden',
        position: 'center',
        color: theme.palette.text.primary,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      {inProgress ? <Pending /> : <CheckCircle />}
      {message}
    </Box>
  );
}

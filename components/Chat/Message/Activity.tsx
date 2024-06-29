'use client';
import { AutorenewOutlined, Cancel, CheckCircle, ExpandMore, Info, Warning } from '@mui/icons-material';
import {
  Box,
  keyframes,
  styled,
  useTheme,
  Tooltip,
  Typography,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import React, { ReactNode, useEffect, useState } from 'react';
import formatDate from './formatDate';
import MarkdownBlock from './MarkdownBlock';
import Message from './Message';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinningIcon = styled(AutorenewOutlined)`
  animation: ${spin} 3s linear infinite;
`;
const severities = {
  error: <Cancel color='error' />,
  info: <Info color='info' />,
  success: <CheckCircle color='success' />,
  warn: <Warning color='warning' />,
};
export type ActivityProps = {
  inProgress: boolean;
  severity: 'error' | 'info' | 'success' | 'warn';
  message: string;
  alternateBackground?: string;
  timestamp: string;
  children?: any[];
};
export default function Activity({
  inProgress,
  message,
  severity,
  alternateBackground = 'primary',
  timestamp,
  children,
}: ActivityProps): ReactNode {
  const theme = useTheme();
  const [dots, setDots] = useState<string>('');
  useEffect(() => {
    if (inProgress) {
      const interval = setInterval(() => setDots((dots) => (dots.length < 2 ? dots + '.' : '')), 500);
      return () => clearInterval(interval);
    }
  }, [inProgress]);
  const [childrenOpen, setChildrenOpen] = useState<boolean>(false);
  const rootStyles = {
    backgroundColor: theme.palette[String(alternateBackground)][theme.palette.mode],
    padding: '10px',
    overflow: 'hidden',
    position: 'center',
    color: theme.palette.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };
  const rootChildren = (
    <>
      {inProgress ? <SpinningIcon /> : severities[severity.toString()]}
      <Tooltip title={formatDate(timestamp, false)}>
        <Typography variant='body1' display='flex' alignItems='center' margin='0'>
          <MarkdownBlock content={message} />
          {dots}
        </Typography>
      </Tooltip>
    </>
  );

  if (!children?.length) {
    return <Box sx={rootStyles}>{rootChildren}</Box>;
  }

  return (
    <Accordion
      elevation={0}
      sx={{
        p: 0,
        m: '0 !important',
        backgroundColor: theme.palette.primary[theme.palette.mode === 'dark' ? 'dark' : 'light'],
        borderTop: '1px solid',
        borderColor: theme.palette.divider,
      }}
    >
      <AccordionSummary
        sx={{
          ...rootStyles,
          borderBottom: '1px solid',
          borderColor: theme.palette.divider,
          '& .MuiAccordionSummary-content': { ...rootStyles, padding: 0, margin: 0 },
        }}
        expandIcon={<ExpandMore />}
      >
        {rootChildren}
      </AccordionSummary>
      <AccordionDetails
        sx={{
          p: 0,

          pl: '1rem',
        }}
      >
        {children.map((child) => {
          const messageType = child.message.split(' ')[0];
          const messageBody = child.message.substring(child.message.indexOf(' '));
          return (
            <Activity
              key={child.timestamp + '-' + messageBody}
              severity={
                messageType.startsWith('[SUBACTIVITY]')
                  ? 'success'
                  : (messageType.split('[')[2].split(']')[0].toLowerCase() as 'error' | 'info' | 'success' | 'warn')
              }
              inProgress={inProgress}
              message={messageBody}
              timestamp={child.timestamp}
              alternateBackground={alternateBackground}
              children={child.children}
            />
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
}

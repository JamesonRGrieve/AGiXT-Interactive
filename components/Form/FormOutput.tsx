import { Box, Card, IconButton, TextField, Typography } from '@mui/material';
import { ChatContext } from '../../types/ChatContext';
import React, { useContext, useState } from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
export default function FormInput({ results }) {
  const [resultNum, setResultNum] = useState(0);
  return (
    <Box px='1rem' display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
      <Card>
        <Typography variant='h2'>
          <IconButton
            onClick={() => {
              setResultNum((previous) => (previous >= 1 ? previous - 1 : results.length - 1));
            }}
          >
            <ChevronLeft />
          </IconButton>
          Result {resultNum + 1}/{results.length}
          <IconButton
            onClick={() => {
              setResultNum((previous) => (previous <= results.length - 1 ? previous + 1 : 0));
            }}
          >
            <ChevronRight />
          </IconButton>
        </Typography>
        <Typography variant='body1'>{results[resultNum]}</Typography>
      </Card>
    </Box>
  );
}

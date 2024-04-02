import { Box, Card, CardContent, CardHeader, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import MarkdownBlock from '../Chat/ChatLog/MarkdownBlock';
export default function FormInput({ results }) {
  const [resultNum, setResultNum] = useState(0);
  console.log('Results', results);
  useEffect(() => {
    if (results.length > 0) setResultNum(results.length - 1);
  }, [results]);
  return (
    results.length > 0 && (
      <Box px='1rem' display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
        <Card raised={true}>
          <Typography display='flex' alignItems='center' variant='h4' component='span' justifyContent='center'>
            Result
            <IconButton
              onClick={() => {
                setResultNum((previous) => (previous >= 1 ? previous - 1 : results.length - 1));
              }}
            >
              <ChevronLeft sx={{ fontSize: '3rem' }} />
            </IconButton>
            {`${resultNum + 1}/${results.length}`}
            <IconButton
              onClick={() => {
                setResultNum((previous) => (previous < results.length - 1 ? previous + 1 : 0));
              }}
            >
              <ChevronRight sx={{ fontSize: '3rem' }} />
            </IconButton>
          </Typography>

          <CardContent>
            <MarkdownBlock content={results[resultNum]} />
          </CardContent>
        </Card>
      </Box>
    )
  );
}

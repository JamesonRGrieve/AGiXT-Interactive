import { Box, Card, CardContent, CardHeader, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, CopyAllOutlined } from '@mui/icons-material';
import MarkdownBlock from '../Chat/ChatLog/MarkdownBlock';
export default function FormInput({ results }) {
  const [resultNum, setResultNum] = useState(0);
  console.log('Results', results);
  useEffect(() => {
    if (results.length > 0) setResultNum(results.length - 1);
  }, [results]);
  return (
    results.length > 0 && (
      <Card
        raised={true}
        sx={{
          overflowY: 'scroll',
          flexGrow: '1',
          mx: '1rem',
        }}
      >
        <Typography display='flex' alignItems='center' variant='h4' component='span' justifyContent='center'>
          <Tooltip title='Copy this result.'>
            <IconButton
              onClick={() => {
                navigator.clipboard.writeText(results[resultNum]);
              }}
            >
              <CopyAllOutlined sx={{ fontSize: '3rem' }} />
            </IconButton>
          </Tooltip>
          Result
          <Tooltip title='Previous result.'>
            <IconButton
              onClick={() => {
                setResultNum((previous) => (previous >= 1 ? previous - 1 : results.length - 1));
              }}
            >
              <ChevronLeft sx={{ fontSize: '3rem' }} />
            </IconButton>
          </Tooltip>
          {`${resultNum + 1}/${results.length}`}
          <Tooltip title='Next result.'>
            <IconButton
              onClick={() => {
                setResultNum((previous) => (previous < results.length - 1 ? previous + 1 : 0));
              }}
            >
              <ChevronRight sx={{ fontSize: '3rem' }} />
            </IconButton>
          </Tooltip>
        </Typography>

        <CardContent>
          <MarkdownBlock content={results[resultNum]} />
        </CardContent>
      </Card>
    )
  );
}

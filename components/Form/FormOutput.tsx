import { Card, CardContent, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, CopyAllOutlined } from '@mui/icons-material';
import MarkdownBlock from '../MarkdownBlock';

export default function FormInput({ results }) {
  const [resultNum, setResultNum] = useState(0);
  // console.log('Results', results);
  useEffect(() => {
    if (results.length > 0) {
      setResultNum(results.length - 1);
    }
  }, [results]);
  return (
    results.length > 0 && (
      <Card
        raised
        sx={{
          overflowY: 'scroll',
          flexGrow: '1',
          mx: '1rem',
        }}
      >
        {' '}
        <Typography variant='body1' align='center' px='3rem'>
          {process.env.NEXT_PUBLIC_APP_NAME} may provide inaccurate or inappropriate responses, may break character and comes
          with no warranty of any kind. By using this software you agree to hold harmless the developers of{' '}
          {process.env.NEXT_PUBLIC_APP_NAME} for any damages caused by the use of this software.
        </Typography>
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

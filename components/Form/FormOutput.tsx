import { Card, CardContent, IconButton, Tooltip, Typography } from '@mui/material';
import React, { ReactNode, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, CopyAllOutlined } from '@mui/icons-material';
import MarkdownBlock from '../Chat/Message/MarkdownBlock';

export default function FormOutput({
  results,
  showIndex,
  selectedUUID,
  setSelectedUUID,
}: {
  results: string[];
  showIndex: number;
  selectedUUID: string;
  setSelectedUUID: (uuid: string) => void;
}): ReactNode {
  const [resultNum, setResultNum] = useState(0);
  useEffect(() => {
    setSelectedUUID(Object.keys(results)[resultNum.toString()]);
  }, [resultNum, setSelectedUUID, results]);
  useEffect(() => {
    setResultNum(Object.keys(results).findIndex((item) => item === selectedUUID));
  }, [selectedUUID, results]);
  // console.log('Results', results);
  useEffect(() => {
    if (Object.keys(results).length > 0) {
      setResultNum(Object.keys(results).length - 1);
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
          mb: '1rem',
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
                navigator.clipboard.writeText(
                  String(results[Object.keys(results)[resultNum.toString()]][showIndex.toString()].message),
                );
              }}
            >
              <CopyAllOutlined sx={{ fontSize: '3rem' }} />
            </IconButton>
          </Tooltip>
          Result
          <Tooltip title='Previous result.'>
            <IconButton
              onClick={() => {
                setResultNum((previous) => (previous >= 1 ? previous - 1 : Object.keys(results).length - 1));
              }}
            >
              <ChevronLeft sx={{ fontSize: '3rem' }} />
            </IconButton>
          </Tooltip>
          {`${resultNum + 1}/${results.length}`}
          <Tooltip title='Next result.'>
            <IconButton
              onClick={() => {
                setResultNum((previous) => (previous < Object.keys(results).length - 1 ? previous + 1 : 0));
              }}
            >
              <ChevronRight sx={{ fontSize: '3rem' }} />
            </IconButton>
          </Tooltip>
        </Typography>
        <CardContent>
          <MarkdownBlock
            content={String(results[Object.keys(results)[resultNum.toString()]][showIndex.toString()].message)}
            setLoading={null}
          />
        </CardContent>
      </Card>
    )
  );
}

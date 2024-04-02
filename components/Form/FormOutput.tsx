import { Box, Card, CardContent, CardHeader, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
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
          <CardHeader
            title={`Result ${resultNum + 1}/${results.length}`}
            action={
              <>
                <IconButton
                  onClick={() => {
                    setResultNum((previous) => (previous >= 1 ? previous - 1 : results.length - 1));
                  }}
                >
                  <ChevronLeft sx={{ fontSize: '3rem' }} />
                </IconButton>

                <IconButton
                  onClick={() => {
                    setResultNum((previous) => (previous < results.length - 1 ? previous + 1 : 0));
                  }}
                >
                  <ChevronRight sx={{ fontSize: '3rem' }} />
                </IconButton>
              </>
            }
          />

          <CardContent>
            <Typography variant='body1'>{results[resultNum]}</Typography>
          </CardContent>
        </Card>
      </Box>
    )
  );
}

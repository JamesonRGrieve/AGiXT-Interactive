'use client';
import { Typography, useTheme } from '@mui/material';
export default function Home() {
  const theme = useTheme();
  return (
    <Typography
      variant='h1'
      textAlign='center'
      onClick={() => {
        console.log(theme);
      }}
    >
      Home Page
    </Typography>
  );
}

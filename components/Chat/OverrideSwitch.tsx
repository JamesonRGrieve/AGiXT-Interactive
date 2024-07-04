'use client';
import { Box, Checkbox, FormControlLabel, MenuItem, Switch, Tooltip, Typography } from '@mui/material';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

export default function OverrideSwitch({ name, label }: { name: string; label: string }): React.JSX.Element {
  const [state, setState] = useState<boolean | null>(
    getCookie('agixt-' + name) === undefined ? null : getCookie('agixt-' + name) !== 'false',
  );
  useEffect(() => {
    if (state === null) {
      deleteCookie('agixt-' + name, { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN });
    } else {
      setCookie('agixt-' + name, state.toString(), {
        domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
        maxAge: 2147483647,
      });
    }
  }, [state, name]);
  return (
    <MenuItem sx={{ py: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant='h6' component='span'>
        {label}
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={state === null}
            onClick={() => {
              setState((old) => (old === null ? false : null));
            }}
          />
        }
        label='Use Default'
      />
      {state !== null && (
        <Box display='flex' flexDirection='row' alignItems='center'>
          <Typography variant='caption'>{state === null ? null : state ? 'Always' : 'Never'}</Typography>
          <Tooltip title={label}>
            <Switch
              color='primary'
              checked={state}
              onClick={() => {
                setState((old) => !old);
              }}
            />
          </Tooltip>
        </Box>
      )}
    </MenuItem>
  );
}

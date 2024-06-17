'use client';
import React, { useContext } from 'react';
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import useSWR from 'swr';
import { InteractiveConfigContext } from '../../types/InteractiveConfigContext';
export default function ChainSelector({ value, mutate }: { value: string; mutate: (e: SelectChangeEvent) => void }) {
  const context = useContext(InteractiveConfigContext);
  const { data: chainData } = useSWR('/chains', async () => await context.agixt.getChains());
  return (
    <FormControl fullWidth>
      <InputLabel>Select a Chain</InputLabel>
      <Select label='Select Chain' value={value} onChange={(e) => mutate(e)} fullWidth>
        {chainData &&
          (chainData as any[]).map((chain) => (
            <MenuItem key={chain} value={chain}>
              {chain}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}

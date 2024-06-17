import { Select, MenuItem, InputLabel, FormControl, Box } from '@mui/material';

import { useSearchParams } from 'next/navigation';
import { useContext } from 'react';
import useSWR from 'swr';
import { InteractiveConfigContext } from '../../types/InteractiveConfigContext';

export default function PromptSelector({
  categoryMutate,
  category,
}: {
  categoryMutate: (e: string) => void;
  category: string;
}) {
  const context = useContext(InteractiveConfigContext);
  const searchParams = useSearchParams();
  const { data: categoryData } = useSWR('/prompts/categories', async () => await context.agixt.getPromptCategories());

  return (
    <Box display='grid' gridTemplateColumns='1fr 1fr' gap='1rem'>
      <FormControl fullWidth sx={{ gridColumn: '1 / span 1' }}>
        <InputLabel id='prompt-category-label'>Select a Prompt Category</InputLabel>
        <Select labelId='prompt-category-label' value={category} onChange={(e) => categoryMutate(e.target.value)}>
          {categoryData &&
            (categoryData as string[]).map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
}

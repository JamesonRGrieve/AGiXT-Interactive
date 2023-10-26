import { Primary, Story, useOf } from '@storybook/blocks';

import { Box, Typography } from '@mui/material';
import Image, { StaticImageData } from 'next/image';
import React from 'react';
import { withTheme } from '../preview';
interface ComparisonGridProps {
  of?: any
}
export default function ComparisonGrid({ of }: ComparisonGridProps) {
  const resolvedOf = useOf('story', ['story', 'meta']);
  
  switch (resolvedOf.type) {
    case 'story': {
      return resolvedOf.story.parameters?.references.map((storySet: any) => {
      if (!(storySet.images.filter((image: any) => image.primary).length > 0)) return null;
      const primaryReference = storySet.images.filter((image: any) => image.primary)[0];
      const primaryImage = primaryReference.image as StaticImageData;
      const component = typeof resolvedOf.story.component == 'function' ? withTheme(resolvedOf.story.component({ ...resolvedOf.story.initialArgs }), { globals: { theme: 'light' } }) : <Box></Box>;
      console.log(primaryReference);
      return <>
        <h3>Reference Comparison</h3>
        <div style={{
          display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr', marginBottom: '3rem'
        }}>
          <div>
            <h4>Reference Image</h4>
            <div style={{ width: '100%', height: '100%', padding: '0.5rem', border: '2px dashed lightgrey', borderRadius: '0.5rem' }}>
              <Image style={{ width: '100%', objectFit: 'contain' }} {...primaryImage} alt='Mockup Image' />
            </div>
          </div>
          <div>
            <h4>Developed Component</h4>
            <div style={{ width: '100%', height: '100%', padding: '0.5rem', border: '2px dashed lightgrey', borderRadius: '0.5rem' }}>
              <Story of={storySet.story} />
            </div>
          </div>
        </div>
      </>
      });
    }
    case 'meta': {
      return <h1>Not defined.</h1>;
    }
    default:
      return null;
  }

}

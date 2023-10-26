import { Story, useOf } from '@storybook/blocks';
import Image, { StaticImageData } from 'next/image';
import React from 'react';
interface ComparisonGridProps {
  of?: any
}
export default function ComparisonGrid({ of }: ComparisonGridProps) {
  const resolvedOf = useOf('story', ['story', 'meta']);

  switch (resolvedOf.type) {
    case 'story': {
      return <>
        <h3>Reference Image Comparisons With Component</h3>
        {resolvedOf.story.parameters?.references.map((storySet: any) => {
          if (!(storySet.images.filter((image: any) => image.primary).length > 0)) return null;
          const primaryReference = storySet.images.filter((image: any) => image.primary)[0];
          const primaryImage = primaryReference.image as StaticImageData;
          return <>
            <div style={{
              display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr', marginBottom: '3rem'
            }}>
              <div>
                <h4>Reference Image - {storySet.variant}</h4>
                <div style={{ width: '100%', height: '100%', padding: '0.5rem', border: '2px dashed lightgrey', borderRadius: '0.5rem' }}>
                  <Image style={{ width: '100%', objectFit: 'contain' }} {...primaryImage} alt='Mockup Image' />
                </div>
              </div>
              <div>
                <h4>Developed Component - {storySet.variant}</h4>
                <div style={{ width: '100%', height: '100%', padding: '0.5rem', border: '2px dashed lightgrey', borderRadius: '0.5rem' }}>
                  <Story of={storySet.story} />
                </div>
              </div>
            </div>
          </>
        })}
      </>;
    }
    case 'meta': {
      return <h1>Not defined.</h1>;
    }
    default:
      return null;
  }

}

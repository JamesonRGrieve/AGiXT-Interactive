import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import React from 'react';
import { useOf } from '@storybook/blocks';
interface ReferenceGridProps {
    of?: any
}
export default function ReferenceGrid({ of }: ReferenceGridProps) {
    const resolvedOf = useOf(of || 'story', ['story', 'meta']);
    switch (resolvedOf.type) {
        case 'story': {
            const referenceImages = resolvedOf.story.parameters.referenceImages;
            return <>
                <h3>Reference Images</h3>
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr '.repeat(Math.min(referenceImages.length, 4)).trim() }}>
                    {referenceImages.map(({image}:{image: StaticImageData}, index: number) => {
                        return <Image key={index} style={{ width: '100%', objectFit: 'contain', padding: '0.5rem', border: '2px dashed lightgrey', borderRadius: '0.5rem' }} {...image} alt='Mockup Image' />
                    })}
                </div>
            </>;
        }
        case 'meta': {
            return <h1>Not defined.</h1>;
        }
        default:
            return null;
    }

}

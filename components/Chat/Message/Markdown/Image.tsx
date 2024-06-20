import { Box } from '@mui/material';
import ImageDialog from 'jrgcomponents/ImageDialog';
import { ReactNode } from 'react';

export type ImageProps = {
  src?: string;
  alt?: string;
};

export default function renderImage({ src, alt }: ImageProps): ReactNode {
  console.log('Image:', src, alt);
  return <ImageDialog imageSrc={src} title={alt} />;
}

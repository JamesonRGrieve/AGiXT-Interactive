import { Box } from '@mui/material';
import ImageDialog from 'jrgcomponents/ImageDialog';
import { ReactNode } from 'react';

export type ImageProps = {
  src?: string;
  alt?: string;
};

export default function renderImage({ src, alt }: ImageProps): ReactNode {
  console.log('Image:', src, alt);
  return src.includes(process.env.NEXT_PUBLIC_AGIXT_SERVER.split('://')[1].split(':')[0].split('/')[0]) ? (
    <ImageDialog imageSrc={src} title={alt} />
  ) : (
    <img src={src} alt={alt} />
  );
}

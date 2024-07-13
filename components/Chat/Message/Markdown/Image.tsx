import { Box } from '@mui/material';
import ImageDialog from 'jrgcomponents/ImageDialog';
import Image from 'next/image';
import { ReactNode } from 'react';

export type ImageProps = {
  src?: string;
  alt?: string;
};

export default function MarkdownImage({ src, alt, ...props }: ImageProps): ReactNode {
  // Since AGIXT Server is included in static optimization by default, we include it as a NextImage.
  return (
    <Box
      position='relative'
      width='100%'
      height='12rem'
      sx={
        {
          /*cursor: 'pointer'*/
        }
      }
      {...props}
    >
      {src.startsWith(process.env.NEXT_PUBLIC_AGIXT_SERVER) ? (
        <Image src={src} alt={alt} fill style={{ objectFit: 'contain', objectPosition: 'left 50%' }} />
      ) : (
        <img
          src={src}
          alt={alt}
          style={{ objectFit: 'contain', width: '100%', height: '100%', objectPosition: 'left 50%' }}
        />
      )}
    </Box>
    /*
    <ImageDialog
      imageSrc={src}
      title={alt}
      nextImage={src.includes(
        process.env.NEXT_PUBLIC_AGIXT_SERVER?.split('://')
          [process.env.NEXT_PUBLIC_AGIXT_SERVER.includes('://') ? 1 : 0].split(':')[0]
          .split('/')[0],
      )}
    />
    */
  );
}

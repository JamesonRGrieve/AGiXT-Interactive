import ImageDialog from 'jrgcomponents/ImageDialog';
import { ReactNode } from 'react';

export type ImageProps = {
  src?: string;
  alt?: string;
};

export default function MarkdownImage({ src, alt, ...props }: ImageProps): ReactNode {
  // Since AGIXT Server is included in static optimization by default, we include it as a NextImage.
  return (
    <ImageDialog
      imageSrc={src}
      title={alt}
      nextImage={src.includes(process.env.NEXT_PUBLIC_AGIXT_SERVER.split('://')[1].split(':')[0].split('/')[0])}
    />
  );
}

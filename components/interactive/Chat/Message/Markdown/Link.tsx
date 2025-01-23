import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
  const href = e.currentTarget.getAttribute('href');
  if (href?.startsWith('#')) {
    e.preventDefault();
    const id = href.slice(1);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

type MarkdownLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';

export default function MarkdownLink({ children, href, className, ...props }: MarkdownLinkProps): ReactNode {
  const isExternal = href && !href.startsWith('#');
  const youtubeId = href ? getYoutubeId(href) : null;
  const isVideo = href?.match(/\.(mp4|webm|ogg)$/i);

  if (youtubeId) {
    return (
      <div className='relative w-full min-w-[320px] min-h-[180px] pt-[56.25%]'>
        <iframe
          className='absolute top-0 left-0 w-full h-full'
          src={`https://www.youtube.com/embed/${youtubeId}`}
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        />
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className='relative w-full min-w-[320px] min-h-[180px]'>
        <Plyr
          source={{
            type: 'video',
            sources: [{ src: href, type: 'video/mp4' }],
          }}
          options={{
            controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
          }}
        />
      </div>
    );
  }

  return (
    <a
      href={href}
      className={cn('underline hover:no-underline', className)}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      onClick={isExternal ? undefined : handleAnchorClick}
      {...props}
    >
      {children}
    </a>
  );
}

function getYoutubeId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
}

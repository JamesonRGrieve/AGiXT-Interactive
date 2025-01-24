"use client";

import React, { ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';

interface MediaProps {
  href: string;
}

const YoutubeEmbed: React.FC<MediaProps> = ({ href }) => (
  <div className='w-96'>
    <div className='relative w-full aspect-video'>
      <iframe
        className='absolute top-0 left-0 w-full h-full'
        src={`https://www.youtube.com/embed/${getYoutubeId(href)}`}
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
      />
    </div>
  </div>
);

const VideoPlayer: React.FC<MediaProps> = ({ href }) => (
  <div className='w-96'>
    <div className='relative w-full aspect-video'>
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
  </div>
);

const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
  const href = e.currentTarget.getAttribute('href');
  if (href?.startsWith('#')) {
    e.preventDefault();
  }
};

const getYoutubeId = (url: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
};

type MarkdownLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

const MarkdownLink: React.FC<MarkdownLinkProps> = ({ children, href, className, ...props }) => {
  const isExternal = href && !href.startsWith('#');
  const youtubeId = href ? getYoutubeId(href) : null;
  const isVideo = href?.match(/\.(mp4|webm|ogg)$/i);

  useEffect(() => {
    if (href?.startsWith('#')) {
      const id = href.slice(1);
      const element = document.querySelector(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [href]);


  if (youtubeId) {
    return <YoutubeEmbed href={href} />;
  }

  if (isVideo) {
    return <VideoPlayer href={href} />;
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
};

export default MarkdownLink;

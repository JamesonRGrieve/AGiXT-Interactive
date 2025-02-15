'use client';

import { ReactNode, useEffect, useState } from 'react';

export default function PopoutDrawer({
  open,
  side,
  width,
  staticMenu = null,
  menu,
  swr,
  topSpacing,
  bottomSpacing,
  zIndex,
  close,
}: {
  open: boolean;
  side: 'left' | 'right';
  width: string;
  menu?: any;
  staticMenu?: ReactNode | null;
  swr?: any;
  topSpacing: string;
  bottomSpacing?: string;
  zIndex: number;
  close: () => void;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  // TODO Why tf won't border-r-2 work?
  return (
    <>
      {isMobile && open && (
        <div className='fixed inset-0 bg-black bg-opacity-50' style={{ zIndex: zIndex - 1 }} onClick={close} />
      )}
      <div
        className={`${isMobile ? 'fixed' : 'absolute'} ${side}-0
    border-${side === 'left' ? 'r' : 'l'}-2 
    border-solid
    border-gray-200
    bg-white
    overflow-y-auto
    transition-transform
    duration-300
    ease-in-out
    ${open ? 'translate-x-0' : side === 'left' ? '-translate-x-full' : 'translate-x-full'}
  `}
        style={{
          width,
          top: topSpacing,
          bottom: bottomSpacing ?? '0',
          zIndex,
          paddingTop: isMobile ? 'env(safe-area-inset-top)' : undefined,
          paddingBottom: isMobile ? 'env(safe-area-inset-bottom)' : undefined,
        }}
      >
        <ul className='p-0 m-0 list-none'>{staticMenu ? staticMenu : null /* <MenuSWR swr={swr} menu={menu} /> */}</ul>
      </div>
    </>
  );
}

'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { LuPalette as Palette } from 'react-icons/lu';
import SwitchColorblind from '../theme/SwitchColorblind';
import SwitchDark from '../theme/SwitchDark';
import HeaderFooter, { HeaderFooterProps } from './AppWrapperHeaderFooter';

type Menu =
  | {
      heading?: string;
      icon?: ReactNode;
      swr?: any;
      menu?: any;
      width: string;
    }
  | {
      heading?: string;
      icon?: ReactNode;
      staticMenu: ReactNode;
      width: string;
    };

type PopoutHeaderProps = {
  height?: string;
  components?: {
    left?: ReactNode | Menu;
    center?: ReactNode;
    right?: ReactNode | Menu;
  };
};

export type AppWrapperProps = {
  header?: HeaderFooterProps | PopoutHeaderProps;
  footer?: HeaderFooterProps;
  inner?: boolean;
  mainSX?: React.CSSProperties;
  keepThemeToggles?: boolean;
};

const switches = (
  <>
    <SwitchDark />
    <SwitchColorblind />
  </>
);

export default function AppWrapper({
  header,
  footer,
  inner = true,
  mainSX = {},
  keepThemeToggles = false,
  children,
}: AppWrapperProps & { children: ReactNode }) {
  const [open, setOpen] = useState({ left: false, right: false });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  console.log(header, footer, mainSX);

  header = header
    ? {
        height: '3rem',
        ...header,
        components: {
          ...header?.components,
          right: header?.components?.right ? (
            keepThemeToggles ? (
              <>
                {header.components.right}
                {switches}
              </>
            ) : (
              header.components.right
            )
          ) : isMobile ? (
            {
              icon: <Palette />,
              swr: () => {},
              menu: () => switches,
              width: '5rem',
            }
          ) : (
            switches
          ),
        },
      }
    : undefined;

  footer = footer ? { height: '2rem', ...footer } : undefined;

  return (
    <>
      {header && (
        <HeaderFooter
          height={header?.height}
          components={
            header?.components && {
              left:
                (header?.components?.left as unknown as Menu)?.width !== undefined ? (
                  <PopoutButton
                    open={open.left}
                    handleToggle={() => {
                      setOpen((previousState: any) => ({ ...previousState, left: !previousState.left }));
                    }}
                    side='left'
                    heading={(header?.components?.left as unknown as Menu)?.heading ?? ''}
                    icon={(header?.components?.left as unknown as Menu)?.icon ?? null}
                  />
                ) : (
                  (header?.components?.left as ReactNode)
                ),
              center: header?.components?.center ? (
                typeof header?.components?.center === 'string' ? (
                  <h1 className={`text-center ${inner ? 'text-2xl' : 'text-3xl'} whitespace-nowrap`}>
                    {header?.components?.center}
                  </h1>
                ) : (
                  <div className='flex items-center justify-between h-full'>{header?.components?.center}</div>
                )
              ) : undefined,
              right:
                (header?.components?.right as unknown as Menu)?.width !== undefined ? (
                  <PopoutButton
                    open={open.right}
                    handleToggle={() => {
                      setOpen((previousState: any) => ({ ...previousState, right: !previousState.right }));
                    }}
                    side='right'
                    heading={(header?.components?.right as unknown as Menu)?.heading ?? ''}
                    icon={(header?.components?.right as unknown as Menu)?.icon}
                  />
                ) : (
                  (header?.components?.right as ReactNode)
                ),
            }
          }
        />
      )}
      {(header?.components?.left as unknown as Menu)?.width && (
        <PopoutDrawer
          open={open.left}
          close={() => setOpen((prevState: any) => ({ ...prevState, left: false }))}
          {...(header?.components?.left as unknown as Menu)}
          side='left'
          zIndex={1200}
          topSpacing={header?.height}
          bottomSpacing={footer?.height ?? '0'}
        />
      )}
      <MainSection {...{ inner, open, header, mainSX, footer, children }} />
      {(header?.components?.right as unknown as Menu)?.width && (
        <PopoutDrawer
          open={open.right}
          close={() => setOpen((prevState: any) => ({ ...prevState, right: false }))}
          {...(header?.components?.right as unknown as Menu)}
          side='right'
          zIndex={1200}
          topSpacing={header?.height}
          bottomSpacing={footer?.height ?? '0'}
        />
      )}
      {footer && <HeaderFooter components={footer.components} height={footer.height} footer />}
    </>
  );
}

const MainSection = ({
  inner,
  open,
  header,
  mainSX,
  footer,
  children,
}: AppWrapperProps & { children: ReactNode; open: { left: boolean; right: boolean } }) => {
  return (
    <div
      className={`
        flex flex-col flex-grow flex-shrink-0 relative overflow-y-auto
        transition-[margin] duration-300 ease-in-out
      `}
      style={{
        margin: `0 ${open.right ? (header?.components?.right as unknown as Menu)?.width : 0} 0 ${
          open.left ? (header?.components?.left as unknown as Menu)?.width : 0
        }`,
        ...mainSX,
      }}
    >
      {children}
    </div>
  );
};

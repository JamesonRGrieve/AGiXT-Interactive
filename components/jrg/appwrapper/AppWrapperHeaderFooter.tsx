import CenterAlignedBox, { CenterAlignedBoxProps } from './AppWrapperCenterAlignedBox';

export type HeaderFooterProps = {
  footer?: boolean;
  height?: string;
  components?: CenterAlignedBoxProps;
};

export default function HeaderFooter({ height = '3rem', footer = false, components }: HeaderFooterProps) {
  return footer ? <Footer {...{ height, components }} /> : <Header {...{ height, components }} />;
}

export function Header({ height, components }: HeaderFooterProps) {
  const isMobile = window.innerWidth <= 600;

  return (
    <>
      <header
        className={`
          bg-primary text-primary-foreground 
          flex items-center px-4 
          ${
            isMobile
              ? `
            fixed top-0 left-0 right-0 
            pt-[calc(0.25rem+env(safe-area-inset-top))] 
            pb-1 
            h-auto`
              : `h-[${height}] static`
          }
        `}
      >
        <CenterAlignedBox
          left={components?.left}
          center={
            components?.center ?? (
              <h2 className='text-center font-bold text-subtitle'>
                {process.env.NEXT_PUBLIC_APP_NAME ?? 'Application Name'}
              </h2>
            )
          }
          right={components?.right}
        />
      </header>

      {/* Spacer for mobile header when sticky */}
      {isMobile && <div className='h-[calc(3rem+env(safe-area-inset-top))]' />}
    </>
  );
}

export function Footer({ height, components }: HeaderFooterProps) {
  return (
    <footer
      className={`
        bg-primary text-primary-foreground 
        flex items-center justify-self-end 
        px-4 h-[${height}] static
      `}
    >
      <CenterAlignedBox left={components?.left} center={components?.center} right={components?.right} />
    </footer>
  );
}

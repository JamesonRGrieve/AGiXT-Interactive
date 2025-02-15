import { ReactNode } from 'react';
import { LuChevronLeft as ChevronLeft, LuChevronRight as ChevronRight } from 'react-icons/lu';

export default function PopoutDrawerWrapperAppBarButton({
  open,
  handleToggle,
  side,
  heading,
  icon,
}: {
  open: boolean;
  handleToggle: () => void;
  side: 'left' | 'right';
  heading: string;
  icon?: ReactNode;
}) {
  return (
    <div
      aria-label='open drawer'
      onClick={handleToggle}
      className={`
        flex items-center h-full cursor-pointer
        ${side === 'right' ? 'mr-4' : 'ml-4'}
        ${side === 'left' ? 'flex-row-reverse' : 'flex-row'}
      `}
    >
      <button className='ml-[0.2rem] text-inherit' aria-label={`${side} drawer toggle`}>
        {icon ?? ((side === 'left') !== open ? <ChevronRight /> : <ChevronLeft />)}
      </button>
      <h1 className='text-lg font-semibold truncate'>{heading}</h1>
    </div>
  );
}

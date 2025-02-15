import { ReactNode } from 'react';

export type CenterAlignedBoxProps = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
};

export default function CenterAlignedBox({ left, center, right }: CenterAlignedBoxProps) {
  return (
    <div className='flex w-full h-full flex-row flex-nowrap justify-between items-center'>
      <div className='flex-1 flex items-center basis-1/2 min-w-[25%] sm:min-w-[unset]'>{left ?? '\u00A0'}</div>

      <div className='flex-none min-w-[25%] sm:min-w-[unset]'>{center ?? '\u00A0'}</div>

      <div className='flex-1 flex justify-end items-center basis-1/2 min-w-[25%] sm:min-w-[unset]'>{right ?? '\u00A0'}</div>
    </div>
  );
}

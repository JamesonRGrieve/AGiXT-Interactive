'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { ReactNode } from 'react';

export type MenuListItem = {
  label: string;
  Icon?: ReactNode;
  tooltip?: string;
  href?: string;
  click?: (e: React.MouseEvent) => void;
  selected?: boolean;
  indent?: number;
  buttons?: {
    Icon: ReactNode;
    tooltip?: string;
    href?: string;
    click?: (e: React.MouseEvent) => void;
  }[];
  subItems?: MenuListItem[];
};

export default function MenuList({ items }: { items: (MenuListItem | ReactNode)[] }) {
  return (
    <>
      {items.map((item: MenuListItem | ReactNode, index: number) =>
        item && typeof item === 'object' && 'label' in item ? <MenuItem key={index} item={item} /> : item,
      )}
    </>
  );
}

function MenuItem({ item }: { item: MenuListItem }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (item.click) {
      item.click(e);
    }
    if (item.subItems && item.subItems.length > 0) {
      setOpen((old) => !old);
    }
    if (item.href) {
      router.push(item.href);
    }
  };

  const isSelected = item.selected || pathname.split('/')[1] === item.label;

  return (
    <>
      <button
        onClick={handleClick}
        className={`
          w-full text-left py-2 px-4 hover:bg-gray-100 transition-colors duration-200
          ${isSelected ? 'bg-gray-200' : ''}
          ${item.indent ? `pl-${item.indent + 4}` : 'pl-4'}
        `}
      >
        <div className='flex items-center'>
          {item.Icon && <div className='mr-4'>{item.Icon}</div>}
          <span>{item.label}</span>
          <div className='ml-auto flex'>
            {item.buttons &&
              item.buttons.length > 0 &&
              item.buttons.map((button, index) => (
                <button
                  key={index}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    button.href ? router.push(button.href) : button.click ? button.click(e) : null;
                  }}
                  className='ml-2 p-1 hover:bg-gray-200 rounded-full'
                  title={button.tooltip}
                >
                  {button.Icon}
                </button>
              ))}
          </div>
        </div>
      </button>
      {open &&
        item.subItems &&
        item.subItems.length > 0 &&
        item.subItems.map((subItem) => <MenuItem key={subItem.label} item={subItem} />)}
    </>
  );
}

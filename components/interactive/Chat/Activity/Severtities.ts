import { LuInfo as Info, LuPencil as Pencil } from 'react-icons/lu';
import { FaRunning } from 'react-icons/fa';
import { Ban as Error, CircleCheck, TriangleAlert } from 'lucide-react';
import { TfiThought } from 'react-icons/tfi';
import { GiMirrorMirror } from 'react-icons/gi';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export const severities = {
  error: {
    icon: (
      <Tooltip>
        <TooltipTrigger>
          <Error className='text-destructive' />
        </TooltipTrigger>
        <TooltipContent>Error</TooltipContent>
      </Tooltip>
    ),
    text: 'text-destructive',
    border: 'border-destructive',
  },

  info: {
    icon: (
      <Tooltip>
        <TooltipTrigger>
          <Info className='text-info' />
        </TooltipTrigger>
        <TooltipContent>Information</TooltipContent>
      </Tooltip>
    ),
    text: 'text-info',
    border: 'border-info',
  },
  success: {
    icon: (
      <Tooltip>
        <TooltipTrigger>
          <CircleCheck className='text-success' />
        </TooltipTrigger>
        <TooltipContent>Successful Activity</TooltipContent>
      </Tooltip>
    ),
    text: 'text-success',
    border: 'border-success',
  },
  warn: {
    icon: (
      <Tooltip>
        <TooltipTrigger>
          <TriangleAlert className='text-warning' />
        </TooltipTrigger>
        <TooltipContent>Warning</TooltipContent>
      </Tooltip>
    ),
    text: 'text-warning',
    border: 'border-warning',
  },
  thought: {
    icon: (
      <Tooltip>
        <TooltipTrigger>
          <TfiThought />
        </TooltipTrigger>
        <TooltipContent>Planned/Thought About an Activity</TooltipContent>
      </Tooltip>
    ),
    text: 'text-info',
    border: 'border-info',
  },
  reflection: {
    icon: (
      <Tooltip>
        <TooltipTrigger>
          <GiMirrorMirror />
        </TooltipTrigger>
        <TooltipContent>Reflected on an Activity</TooltipContent>
      </Tooltip>
    ),
    text: 'text-info',
    border: 'border-info',
  },
  execution: {
    icon: (
      <Tooltip>
        <TooltipTrigger>
          <FaRunning />
        </TooltipTrigger>
        <TooltipContent>Executed/Ran a Command</TooltipContent>
      </Tooltip>
    ),
    text: 'text-info',
    border: 'border-info',
  },
  diagram: {
    icon: (
      <Tooltip>
        <TooltipTrigger>
          <Pencil />
        </TooltipTrigger>
        <TooltipContent>Drew a Diagram</TooltipContent>
      </Tooltip>
    ),
    text: 'text-info',
    border: 'border-info',
  },
};

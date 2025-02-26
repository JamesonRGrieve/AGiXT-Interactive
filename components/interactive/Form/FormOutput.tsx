import React, { ReactNode, useEffect, useState } from 'react';
import { LuChevronLeft as ChevronLeft, LuChevronRight as ChevronRight } from 'react-icons/lu';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

export default function FormOutput({
  results,
  showIndex,
  selectedUUID,
  setSelectedUUID,
}: {
  results: string[];
  showIndex: number;
  selectedUUID: string;
  setSelectedUUID: (uuid: string) => void;
}): ReactNode {
  const [resultNum, setResultNum] = useState(0);

  useEffect(() => {
    setSelectedUUID(Object.keys(results)[resultNum.toString()]);
  }, [resultNum, setSelectedUUID, results]);

  useEffect(() => {
    setResultNum(Object.keys(results).findIndex((item) => item === selectedUUID));
  }, [selectedUUID, results]);

  useEffect(() => {
    if (Object.keys(results).length > 0) {
      setResultNum(Object.keys(results).length - 1);
    }
  }, [results]);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(results[Object.keys(results)[resultNum.toString()]][showIndex.toString()].message));
  };

  const handlePrevious = () => {
    setResultNum((previous) => (previous >= 1 ? previous - 1 : Object.keys(results).length - 1));
  };

  const handleNext = () => {
    setResultNum((previous) => (previous < Object.keys(results).length - 1 ? previous + 1 : 0));
  };

  return (
    results.length > 0 && (
      <Card className='overflow-y-auto grow mx-4 mb-4'>
        <div className='text-center px-12 py-2 text-sm'>
          {process.env.NEXT_PUBLIC_APP_NAME} may provide inaccurate or inappropriate responses, may break character and comes
          with no warranty of any kind. By using this software you agree to hold harmless the developers of{' '}
          {process.env.NEXT_PUBLIC_APP_NAME} for any damages caused by the use of this software.
        </div>

        <div className='flex items-center justify-center space-x-4 text-xl font-semibold'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='icon' onClick={handleCopy}>
                  <Copy className='w-8 h-8' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy this result</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <span>Result</span>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='icon' onClick={handlePrevious}>
                  <ChevronLeft className='w-8 h-8' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Previous result</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <span>{`${resultNum + 1}/${results.length}`}</span>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='icon' onClick={handleNext}>
                  <ChevronRight className='w-8 h-8' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Next result</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <CardContent>
          <MarkdownBlock
            content={String(results[Object.keys(results)[resultNum.toString()]][showIndex.toString()].message)}
            setLoading={null}
          />
        </CardContent>
      </Card>
    )
  );
}

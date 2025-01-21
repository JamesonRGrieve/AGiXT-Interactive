import React from 'react';

export default function MenuSWR({ swr, menu }: { swr: any; menu: any }) {
  return swr && swr.isLoading ? (
    <div className='px-4 py-2'>
      <div>
        <h1 className='text-lg font-bold truncate'>Loading...</h1>
      </div>
    </div>
  ) : swr && swr.error ? (
    <>
      <div className='px-4 py-2'>
        <div>
          <h1 className='text-lg font-bold truncate'>Error!</h1>
        </div>
      </div>
      <div className='px-4 py-2'>
        <div>
          <p className='text-base'>{swr.error.message}</p>
        </div>
      </div>
    </>
  ) : (
    menu({ data: swr?.data })
  );
}

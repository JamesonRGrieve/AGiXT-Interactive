import React from 'react';
import Marketplace from '@/components/marketplace/Marketplace';

export const metadata = {
  title: 'AGiXT Marketplace',
  description: 'Browse and install AGiXT extensions',
};

export default function MarketplacePage(): React.ReactElement {
  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">AGiXT Marketplace</h1>
        <p className="text-sm text-muted-foreground">
          Discover and install extensions to enhance your AGiXT experience
        </p>
      </div>
      <Marketplace />
    </div>
  );
}
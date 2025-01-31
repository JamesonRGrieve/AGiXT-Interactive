'use client';

import React from 'react';
import { Store } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Extension } from '@/types/extension';
import { Card } from '@/components/ui/card';

interface ItemCardProps {
  extension: Extension;
  onSelect?: (extension: Extension) => void;
}

export default function ItemCard({ extension, onSelect }: ItemCardProps): React.ReactElement {
  const timeAgo = extension.updatedAt
    ? formatDistanceToNow(new Date(extension.updatedAt), { addSuffix: true })
    : '';

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all hover:shadow-lg"
      onClick={() => onSelect?.(extension)}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {extension.icon ? (
              <img
                src={extension.icon}
                alt={`${extension.name} icon`}
                width={32}
                height={32}
                className="rounded"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                <Store className="w-4 h-4 text-gray-400" />
              </div>
            )}
            <h3 className="font-semibold">{extension.name}</h3>
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <span>{extension.stars}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">{extension.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>By {extension.author}</span>
          <span>{timeAgo}</span>
        </div>
      </div>
    </Card>
  );
}
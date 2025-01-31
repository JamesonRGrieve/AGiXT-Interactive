'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import ItemCard from './ItemCard';
import { Extension } from '@/types/extension';
import { Input } from '@/components/ui/input';

const DEMO_DATA: Extension[] = [
  {
    id: '1',
    name: 'GPT4ALL Integration',
    description: 'Brings local GPT4ALL models into AGiXT',
    author: 'Josh XT',
    price: 0,
    rating: 4.5,
    downloads: 150,
    imageUrl: '/path/to/icon.png',
    status: 'active',
    type: 'extension',
    stars: 150,
    updatedAt: '2024-01-15T12:00:00Z',
    icon: '/path/to/icon.png',
  },
  {
    id: '2',
    name: 'Claude Integration',
    description: 'Adds Anthropic Claude support to AGiXT',
    author: 'Josh XT',
    price: 0,
    rating: 4.2,
    downloads: 120,
    imageUrl: '/path/to/icon.png',
    status: 'active',
    type: 'extension',
    stars: 120,
    updatedAt: '2024-01-10T12:00:00Z',
  },
  // Add more demo data as needed
];

export default function Marketplace(): React.ReactElement {
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // TODO: Replace with actual API call
    const loadExtensions = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setExtensions(DEMO_DATA);
      } catch (error) {
        console.error('Failed to load extensions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExtensions();
  }, []);

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<
    'price-asc' | 'price-desc' | 'rating-desc' | 'downloads-desc' | null
  >(null);

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prevTypes) =>
      prevTypes.includes(type)
        ? prevTypes.filter((prevType) => prevType !== type)
        : [...prevTypes, type],
    );
  };

  const filteredExtensions = extensions
    .filter((extension) =>
      extension.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .filter((extension) =>
      selectedTypes.length === 0 || selectedTypes.includes(extension.type),
    )
    .sort((a, b) => {
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      } else if (sortBy === 'price-desc') {
        return b.price - a.price;
      } else if (sortBy === 'rating-desc') {
        return b.rating - a.rating;
      } else if (sortBy === 'downloads-desc') {
        return b.downloads - a.downloads;
      } else {
        return 0;
      }
    });

  const handleExtensionSelect = (extension: Extension) => {
    // TODO: Implement extension selection logic
    console.log('Selected extension:', extension);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            AGiXT Marketplace
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Discover and enhance your AI experience with prompts, chains, and extensions
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="text-sm text-gray-400 bg-gray-800/50 px-4 py-2 rounded-full">
            {filteredExtensions.length} items found
          </span>
        </div>
      </div>
      <div className="lg:flex gap-8">
        <div className="lg:w-64 mb-6 lg:mb-0">
          <div className="sticky top-6">
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Filter by Type
                </label>
                <div className="space-y-2">
                  {['extension', 'chain', 'prompt'].map((type) => {
                    const count = extensions.filter((e) => e.type === type).length;
                    return (
                      <label
                        key={type}
                        className="flex items-center justify-between p-2 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            value={type}
                            checked={selectedTypes.includes(type)}
                            onChange={() => handleTypeChange(type)}
                            className="h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
                          />
                          <span className="ml-2 text-sm text-gray-300 capitalize">
                            {type}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded-full">
                          {count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sort by
                </label>
                <select
                  value={sortBy || ''}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as
                        | 'price-asc'
                        | 'price-desc'
                        | 'rating-desc'
                        | 'downloads-desc'
                        | null,
                    )
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-200"
                >
                  <option value="" className="bg-gray-800">
                    Most Relevant
                  </option>
                  <option value="price-asc" className="bg-gray-800">
                    Price: Low to High
                  </option>
                  <option value="price-desc" className="bg-gray-800">
                    Price: High to Low
                  </option>
                  <option value="rating-desc" className="bg-gray-800">
                    Rating: High to Low
                  </option>
                  <option value="downloads-desc" className="bg-gray-800">
                    Downloads: High to Low
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredExtensions.map((extension) => (
              <ItemCard
                key={extension.id}
                extension={extension}
                onSelect={handleExtensionSelect}
              />
            ))}
          </div>

          {filteredExtensions.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <svg
                className="w-16 h-16 text-gray-600 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="text-xl font-medium text-gray-300 mb-2">
                No results found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
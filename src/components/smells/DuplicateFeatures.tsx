import React from 'react';
import { Copy } from 'lucide-react';
import { SmellCard } from '../ui/SmellCard';
import { CodeBlock } from '../ui/CodeBlock';
import type { SmellResult } from '../../types';

interface DuplicateFeaturesProps {
  items: SmellResult[];
  totalFeatures: number;
}

export function DuplicateFeatures({ items, totalFeatures }: DuplicateFeaturesProps) {
  if (items.length === 0) return null;

  return (
    <SmellCard
      icon={Copy}
      title="Duplicate Feature Titles"
      count={totalFeatures}
    >
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="font-medium text-gray-700">{item.feature}</div>
            <div className="text-sm text-gray-500">
              Found {item.count} times in:
            </div>
            <CodeBlock code={item.filenames || ''} />
          </div>
        ))}
      </div>
    </SmellCard>
  );
}
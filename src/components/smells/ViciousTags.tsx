import React from 'react';
import { Tag } from 'lucide-react';
import { SmellCard } from '../ui/SmellCard';
import { FileLocation } from '../ui/FileLocation';
import type { SmellResult } from '../../types';

interface ViciousTagsProps {
  items: SmellResult[];
  totalViciousTags: number;
}

export function ViciousTags({ items, totalViciousTags }: ViciousTagsProps) {
  if (items.length === 0) return null;

  return (
    <SmellCard
      icon={Tag}
      title="Vicious Tags"
      count={totalViciousTags}
    >
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <FileLocation location={item.filename} />
            <div className="text-sm text-gray-700">
              In {item.type} with {item.scenarios} scenarios:
            </div>
            <div className="text-sm text-amber-600">{item.vicious_tag}</div>
          </div>
        ))}
      </div>
    </SmellCard>
  );
}
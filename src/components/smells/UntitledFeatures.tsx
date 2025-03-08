import React from 'react';
import { Layout } from 'lucide-react';
import { SmellCard } from '../ui/SmellCard';
import { FileLocation } from '../ui/FileLocation';
import type { SmellResult } from '../../types';

interface UntitledFeaturesProps {
  items: SmellResult[];
}

export function UntitledFeatures({ items }: UntitledFeaturesProps) {
  if (items.length === 0) return null;

  return (
    <SmellCard
      icon={Layout}
      title="Untitled Features"
      count={items.length}
      data={items}
    >
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <FileLocation location={`${item.filename}:${item.lineNumber}`} />
            <div className="text-sm text-red-600">
              Feature declared without title: <code>{item.matchedLine}</code>
            </div>
          </div>
        ))}
      </div>
    </SmellCard>
  );
}
import React from 'react';
import { Footprints } from 'lucide-react';
import { SmellCard } from '../ui/SmellCard';
import { FileLocation } from '../ui/FileLocation';
import { CodeBlock } from '../ui/CodeBlock';
import type { SmellResult } from '../../types';

interface StartingWithLeftFootProps {
  items: SmellResult[];
  totalLeftFoots: number;
}

export function StartingWithLeftFoot({ items, totalLeftFoots }: StartingWithLeftFootProps) {
  if (items.length === 0) return null;

  return (
    <SmellCard
      icon={Footprints}
      title="Starting With Left Foot"
      count={totalLeftFoots}
    >
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <FileLocation location={item.filename} />
            <CodeBlock code={item.left_foot || ''} />
          </div>
        ))}
      </div>
    </SmellCard>
  );
}
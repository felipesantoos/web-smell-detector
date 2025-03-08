import React from 'react';
import { AlertCircle } from 'lucide-react';
import { SmellCard } from '../ui/SmellCard';
import { FileLocation } from '../ui/FileLocation';
import { CodeBlock } from '../ui/CodeBlock';
import type { SmellResult } from '../../types';

interface MalformedTestsProps {
  items: SmellResult[];
  totalMalformedTests: number;
}

export function MalformedTests({ items, totalMalformedTests }: MalformedTestsProps) {
  if (items.length === 0) return null;

  return (
    <SmellCard
      icon={AlertCircle}
      title="Malformed Tests"
      count={totalMalformedTests}
      data={items}
    >
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <FileLocation location={item.file_and_line || ''} />
            <div className="text-sm text-red-600">{item.justification}</div>
            <CodeBlock code={item.register || ''} />
          </div>
        ))}
      </div>
    </SmellCard>
  );
}
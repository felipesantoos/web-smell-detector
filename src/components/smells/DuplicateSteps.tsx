import React from 'react';
import { Repeat } from 'lucide-react';
import { SmellCard } from '../ui/SmellCard';
import { FileLocation } from '../ui/FileLocation';
import { CodeBlock } from '../ui/CodeBlock';
import type { SmellResult } from '../../types';

interface DuplicateStepsProps {
  items: SmellResult[];
  totalDuplicateSteps: number;
}

export function DuplicateSteps({ items, totalDuplicateSteps }: DuplicateStepsProps) {
  if (items.length === 0) return null;

  return (
    <SmellCard
      icon={Repeat}
      title="Duplicate Steps"
      count={totalDuplicateSteps}
    >
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <FileLocation location={item.file_and_line || ''} />
            <div className="text-sm text-gray-700">{item.duplicate_step}</div>
            <CodeBlock code={item.register || ''} />
          </div>
        ))}
      </div>
    </SmellCard>
  );
}
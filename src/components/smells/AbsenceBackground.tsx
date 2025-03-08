import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { SmellCard } from '../ui/SmellCard';
import { FileLocation } from '../ui/FileLocation';
import { CodeBlock } from '../ui/CodeBlock';
import type { SmellResult } from '../../types';

interface AbsenceBackgroundProps {
  items: SmellResult[];
  totalAbsenceBackgrounds: number;
}

export function AbsenceBackground({ items, totalAbsenceBackgrounds }: AbsenceBackgroundProps) {
  if (items.length === 0) return null;

  return (
    <SmellCard
      icon={AlertTriangle}
      title="Missing Background"
      count={totalAbsenceBackgrounds}
      data={items}
    >
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <FileLocation location={item.filename} />
            <div className="text-sm text-gray-700">
              Repeated steps in {item.scenarios} scenarios:
            </div>
            <CodeBlock code={item.absence_background || ''} />
          </div>
        ))}
      </div>
    </SmellCard>
  );
}
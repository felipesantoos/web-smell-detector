import React from 'react';
import { Copy } from 'lucide-react';
import { SmellCard } from '../ui/SmellCard';
import { FileLocation } from '../ui/FileLocation';
import type { SmellResult } from '../../types';

interface DuplicateScenariosProps {
  items: SmellResult[];
  totalScenarioTitles: number;
}

export function DuplicateScenarios({ items, totalScenarioTitles }: DuplicateScenariosProps) {
  if (items.length === 0) return null;

  return (
    <SmellCard
      icon={Copy}
      title="Duplicate Scenario Titles"
      count={totalScenarioTitles}
      data={items}
    >
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="font-medium text-gray-700">{item.title}</div>
            <div className="text-sm text-gray-500">
              Found {item.count} times in:
            </div>
            {item.locations?.map((location, i) => (
              <FileLocation key={i} location={location} />
            ))}
          </div>
        ))}
      </div>
    </SmellCard>
  );
}
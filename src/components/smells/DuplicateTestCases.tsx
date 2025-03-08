import React from 'react';
import { Copy } from 'lucide-react';
import { SmellCard } from '../ui/SmellCard';
import { CodeBlock } from '../ui/CodeBlock';
import type { SmellResult } from '../../types';

interface DuplicateTestCasesProps {
  items: SmellResult[];
  totalTestCases: number;
}

export function DuplicateTestCases({ items, totalTestCases }: DuplicateTestCasesProps) {
  if (items.length === 0) return null;

  return (
    <SmellCard
      icon={Copy}
      title="Duplicate Test Cases"
      count={totalTestCases}
    >
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="text-sm text-gray-500">
              Found {item.count} times in:
            </div>
            <CodeBlock code={item.titlesAndFiles || ''} />
            <div className="mt-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Test Case:</div>
              <CodeBlock code={item.testCaseBody || ''} />
            </div>
          </div>
        ))}
      </div>
    </SmellCard>
  );
}
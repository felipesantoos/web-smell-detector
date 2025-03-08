import React from 'react';

interface CodeBlockProps {
  code: string;
}

export function CodeBlock({ code }: CodeBlockProps) {
  return (
    <pre className="mt-2 p-3 bg-gray-50 rounded-md font-mono text-sm overflow-x-auto">
      {code}
    </pre>
  );
}
import React from 'react';
import { FileText } from 'lucide-react';

interface FileLocationProps {
  location: string;
}

export function FileLocation({ location }: FileLocationProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <FileText className="h-4 w-4" />
      <span className="font-mono">{location}</span>
    </div>
  );
}
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';
import { convertToCSV, downloadCSV } from '../../utils/csv';

interface SmellCardProps {
  icon: React.ElementType;
  title: string;
  count: number;
  children: React.ReactNode;
  data: any[];
}

export function SmellCard({ icon: Icon, title, count, children, data }: SmellCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDownload = () => {
    const csvContent = convertToCSV(data, title);
    downloadCSV(csvContent, `${title.toLowerCase().replace(/\s+/g, '-')}.csv`);
  };

  return (
    <div className={`bg-gray-50 rounded-lg shadow-md overflow-hidden h-fit ${isExpanded ? 'bg-white' : ''}`}>
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex items-center gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 flex items-center gap-2 hover:bg-gray-100 transition-colors rounded-md px-2 py-1"
        >
          <Icon className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {count}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400 ml-auto" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400 ml-auto" />
          )}
        </button>
        <button
          onClick={handleDownload}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Download CSV"
        >
          <Download className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      {isExpanded && (
        <div className="p-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}
import { SmellResult } from '../types';

export function convertToCSV(data: any[], title: string): string {
  if (data.length === 0) return '';

  // Flatten nested objects and create headers
  const headers = new Set<string>();
  const flattenedData = data.map(item => {
    const flat: Record<string, string> = {};
    
    Object.entries(item).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        flat[key] = value.join('; ');
      } else if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          headers.add(`${key}_${subKey}`);
          flat[`${key}_${subKey}`] = String(subValue);
        });
      } else {
        headers.add(key);
        flat[key] = String(value);
      }
    });
    
    return flat;
  });

  const headerRow = Array.from(headers).join(',');
  const dataRows = flattenedData.map(row => 
    Array.from(headers)
      .map(header => {
        const value = row[header] || '';
        return `"${value.replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  return `${title}\n${headerRow}\n${dataRows.join('\n')}`;
}

export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
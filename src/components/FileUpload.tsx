import React, { useCallback, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  files: FileList | null;
  loading: boolean;
  error: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export function FileUpload({ files, loading, error, onFileChange, onSubmit }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.every(file => file.name.endsWith('.feature'))) {
      const dataTransfer = new DataTransfer();
      droppedFiles.forEach(file => dataTransfer.items.add(file));
      
      // Create a synthetic event to reuse the existing onFileChange handler
      const event = {
        target: {
          files: dataTransfer.files
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      onFileChange(event);
    }
  }, [onFileChange]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <form onSubmit={onSubmit} className="space-y-4">
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
        >
          <input
            type="file"
            onChange={onFileChange}
            accept=".feature"
            className="hidden"
            id="file-upload"
            multiple
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            <Upload className={`h-12 w-12 mb-3 transition-colors ${
              isDragging ? 'text-blue-500' : 'text-gray-400'
            }`} />
            <span className={`text-sm transition-colors ${
              isDragging ? 'text-blue-700' : 'text-gray-600'
            }`}>
              {files ? `${files.length} file(s) selected` : 'Select .feature files'}
            </span>
            <p className={`mt-1 text-xs transition-colors ${
              isDragging ? 'text-blue-600' : 'text-gray-500'
            }`}>
              Drag and drop or click to select
            </p>
          </label>
        </div>

        <button
          type="submit"
          disabled={!files || loading}
          className={`w-full py-3 px-4 rounded-md text-white font-medium transition ${
            !files || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Analyzing...' : 'Analyze Files'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
          <span className="text-red-800">{error}</span>
        </div>
      )}
    </div>
  );
}
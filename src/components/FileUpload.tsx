import React from 'react';
import { Upload, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  files: FileList | null;
  loading: boolean;
  error: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export function FileUpload({ files, loading, error, onFileChange, onSubmit }: FileUploadProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
            <Upload className="h-12 w-12 text-gray-400 mb-3" />
            <span className="text-sm text-gray-600">
              {files ? `${files.length} file(s) selected` : 'Select .feature files'}
            </span>
            <p className="mt-1 text-xs text-gray-500">
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
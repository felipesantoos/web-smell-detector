import React, { useState } from 'react';
import { TestTube } from 'lucide-react';
import { FileUpload } from '../components/FileUpload';
import { Dashboard } from '../components/Dashboard';
import {
  UntitledFeatures,
  DuplicateFeatures,
  AbsenceBackground,
  DuplicateScenarios,
  DuplicateSteps,
  DuplicateTestCases,
  MalformedTests,
  StartingWithLeftFoot,
  ViciousTags
} from '../components/smells';
import type { AnalysisResult } from '../types';

export function Analyzer() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && Array.from(selectedFiles).every(file => file.name.endsWith('.feature'))) {
      setFiles(selectedFiles);
      setError(null);
    } else {
      setError('Please select only .feature files');
      setFiles(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!files) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('http://localhost:3000/run-detection', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error analyzing files');
      }

      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error analyzing files');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
        <TestTube className="h-8 w-8 text-blue-600 flex-shrink-0" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Test Smells Analyzer
        </h1>
      </div>

      <FileUpload
        files={files}
        loading={loading}
        error={error}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
      />

      {results && (
        <>
          <Dashboard results={results} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <UntitledFeatures items={results.untitledFeatures} />
            <DuplicateFeatures
              items={results.duplicateFeatureTitles.reportData}
              totalFeatures={results.duplicateFeatureTitles.totalFeatures}
            />
            <AbsenceBackground
              items={results.absenceBackground.absencesBackgrounds}
              totalAbsenceBackgrounds={results.absenceBackground.totalAbsenceBackgrounds}
            />
            <DuplicateScenarios
              items={results.duplicateScenarioTitles.duplicateScenarioTitles}
              totalScenarioTitles={results.duplicateScenarioTitles.totalScenarioTitles}
            />
            <DuplicateSteps
              items={results.duplicateSteps.duplicateSteps}
              totalDuplicateSteps={results.duplicateSteps.totalDuplicateSteps}
            />
            <DuplicateTestCases
              items={results.duplicateTestCases.duplicateTestCases}
              totalTestCases={results.duplicateTestCases.totalTestCases}
            />
            <MalformedTests
              items={results.malformedTests.malformedRegisters}
              totalMalformedTests={results.malformedTests.totalMalformedTests}
            />
            <StartingWithLeftFoot
              items={results.startingWithLeftFoot.leftFoots}
              totalLeftFoots={results.startingWithLeftFoot.totalLeftFoots}
            />
            <ViciousTags
              items={results.viciousTags.viciousTags}
              totalViciousTags={results.viciousTags.totalViciousTags}
            />
          </div>
        </>
      )}
    </div>
  );
}
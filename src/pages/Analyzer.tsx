import React, { useState } from 'react';
import { TestTube, FileText, AlertCircle, Info } from 'lucide-react';
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
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <TestTube className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Test Smells Analyzer
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Analyze your Gherkin/Cucumber feature files for potential test smells
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Feature Files</h3>
              <p className="text-sm text-blue-700">
                Upload your .feature files to analyze test quality and identify potential issues
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-900">Smell Detection</h3>
              <p className="text-sm text-amber-700">
                Automatically detect common test smells and anti-patterns in your tests
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <Info className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-900">Detailed Analysis</h3>
              <p className="text-sm text-green-700">
                Get comprehensive insights and recommendations for improvement
              </p>
            </div>
          </div>
        </div>
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
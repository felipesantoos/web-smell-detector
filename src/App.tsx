import React, { useState } from 'react';
import { Upload, AlertCircle, FileText } from 'lucide-react';

interface SmellResult {
  filename: string;
  line?: number;
  file_and_line?: string;
  count?: number;
  titlesAndFiles?: string;
  testCaseBody?: string;
  duplicate_step?: string;
  register?: string;
  vicious_tag?: string;
  scenarios?: number;
  type?: string;
  left_foot?: string;
  justification?: string;
  absence_background?: string;
}

interface AnalysisResult {
  untitledFeatures: SmellResult[];
  duplicateFeatureTitles: {
    totalFeatures: number;
    totalDistinctFeatures: number;
    reportData: SmellResult[];
  };
  absenceBackground: {
    totalAbsenceBackgrounds: number;
    absencesBackgrounds: SmellResult[];
  };
  duplicateScenarioTitles: {
    totalScenarioTitles: number;
    duplicateScenarioTitles: SmellResult[];
  };
  duplicateSteps: {
    totalDuplicateSteps: number;
    duplicateSteps: SmellResult[];
  };
  duplicateTestCases: {
    totalTestCases: number;
    duplicateTestCases: SmellResult[];
  };
  malformedTests: {
    totalMalformedTests: number;
    malformedRegisters: SmellResult[];
  };
  startingWithLeftFoot: {
    totalLeftFoots: number;
    leftFoots: SmellResult[];
  };
  viciousTags: {
    totalViciousTags: number;
    viciousTags: SmellResult[];
  };
}

function App() {
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
      setError('Por favor, selecione apenas arquivos .feature');
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
        throw new Error(data.error || 'Erro ao analisar arquivos');
      }

      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao analisar arquivos');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const renderSmellSection = (title: string, items: SmellResult[], total: number) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {title} ({total})
        </h3>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              {item.filename && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <FileText className="h-4 w-4" />
                  <span>{item.filename}</span>
                </div>
              )}
              {item.file_and_line && (
                <pre className="text-sm bg-gray-50 p-2 rounded mb-2">{item.file_and_line}</pre>
              )}
              {item.duplicate_step && (
                <div className="text-sm text-gray-700 mb-2">{item.duplicate_step}</div>
              )}
              {item.vicious_tag && (
                <div className="text-sm text-gray-700 mb-2">{item.vicious_tag}</div>
              )}
              {item.left_foot && (
                <pre className="text-sm bg-gray-50 p-2 rounded mb-2">{item.left_foot}</pre>
              )}
              {item.justification && (
                <div className="text-sm text-gray-700">{item.justification}</div>
              )}
              {item.absence_background && (
                <div className="text-sm text-gray-700">{item.absence_background}</div>
              )}
              {item.register && (
                <pre className="text-sm bg-gray-50 p-2 rounded mt-2 overflow-x-auto">
                  {item.register}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Analisador de Test Smells
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                onChange={handleFileChange}
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
                  {files ? `${files.length} arquivo(s) selecionado(s)` : 'Selecione arquivos .feature'}
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={!files || loading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                !files || loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Analisando...' : 'Analisar Arquivos'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
              <span className="text-red-800">{error}</span>
            </div>
          )}
        </div>

        {results && (
          <div className="space-y-8">
            {renderSmellSection('Features sem Título', results.untitledFeatures, results.untitledFeatures.length)}
            {renderSmellSection('Títulos de Feature Duplicados', results.duplicateFeatureTitles.reportData, results.duplicateFeatureTitles.totalFeatures)}
            {renderSmellSection('Ausência de Background', results.absenceBackground.absencesBackgrounds, results.absenceBackground.totalAbsenceBackgrounds)}
            {renderSmellSection('Títulos de Cenário Duplicados', results.duplicateScenarioTitles.duplicateScenarioTitles, results.duplicateScenarioTitles.totalScenarioTitles)}
            {renderSmellSection('Steps Duplicados', results.duplicateSteps.duplicateSteps, results.duplicateSteps.totalDuplicateSteps)}
            {renderSmellSection('Casos de Teste Duplicados', results.duplicateTestCases.duplicateTestCases, results.duplicateTestCases.totalTestCases)}
            {renderSmellSection('Testes Malformados', results.malformedTests.malformedRegisters, results.malformedTests.totalMalformedTests)}
            {renderSmellSection('Iniciando com o Pé Esquerdo', results.startingWithLeftFoot.leftFoots, results.startingWithLeftFoot.totalLeftFoots)}
            {renderSmellSection('Tags Viciosas', results.viciousTags.viciousTags, results.viciousTags.totalViciousTags)}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
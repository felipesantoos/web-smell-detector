import React, { useState } from 'react';
import { Upload, AlertCircle, FileText, AlertTriangle, Copy, Tag, Footprints, TestTube, Repeat, Layout } from 'lucide-react';

interface SmellResult {
  filename: string;
  lineNumber?: number;
  matchedLine?: string;
  file_and_line?: string;
  count?: number;
  feature?: string;
  filenames?: string;
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
  title?: string;
  locations?: string[];
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

function SmellCard({ icon: Icon, title, count, children }: {
  icon: React.ElementType;
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex items-center gap-2">
        <Icon className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
        <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {count}
        </span>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

function FileLocation({ location }: { location: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <FileText className="h-4 w-4" />
      <span className="font-mono">{location}</span>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="mt-2 p-3 bg-gray-50 rounded-md font-mono text-sm overflow-x-auto">
      {code}
    </pre>
  );
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <TestTube className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Analisador de Test Smells
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
                <p className="mt-1 text-xs text-gray-500">
                  Arraste e solte ou clique para selecionar
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Untitled Features */}
            {results.untitledFeatures.length > 0 && (
              <SmellCard
                icon={Layout}
                title="Features sem Título"
                count={results.untitledFeatures.length}
              >
                <div className="space-y-4">
                  {results.untitledFeatures.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <FileLocation location={`${item.filename}:${item.lineNumber}`} />
                      <div className="text-sm text-red-600">
                        Feature declarada sem título: <code>{item.matchedLine}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </SmellCard>
            )}

            {/* Duplicate Feature Titles */}
            {results.duplicateFeatureTitles.reportData.length > 0 && (
              <SmellCard
                icon={Copy}
                title="Títulos de Feature Duplicados"
                count={results.duplicateFeatureTitles.totalFeatures}
              >
                <div className="space-y-4">
                  {results.duplicateFeatureTitles.reportData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="font-medium text-gray-700">{item.feature}</div>
                      <div className="text-sm text-gray-500">
                        Encontrado {item.count} vezes em:
                      </div>
                      <CodeBlock code={item.filenames || ''} />
                    </div>
                  ))}
                </div>
              </SmellCard>
            )}

            {/* Absence of Background */}
            {results.absenceBackground.absencesBackgrounds.length > 0 && (
              <SmellCard
                icon={AlertTriangle}
                title="Ausência de Background"
                count={results.absenceBackground.totalAbsenceBackgrounds}
              >
                <div className="space-y-4">
                  {results.absenceBackground.absencesBackgrounds.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <FileLocation location={item.filename} />
                      <div className="text-sm text-gray-700">
                        Steps repetidos em {item.scenarios} cenários:
                      </div>
                      <CodeBlock code={item.absence_background || ''} />
                    </div>
                  ))}
                </div>
              </SmellCard>
            )}

            {/* Duplicate Scenario Titles */}
            {results.duplicateScenarioTitles.duplicateScenarioTitles.length > 0 && (
              <SmellCard
                icon={Copy}
                title="Títulos de Cenário Duplicados"
                count={results.duplicateScenarioTitles.totalScenarioTitles}
              >
                <div className="space-y-4">
                  {results.duplicateScenarioTitles.duplicateScenarioTitles.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="font-medium text-gray-700">{item.title}</div>
                      <div className="text-sm text-gray-500">
                        Encontrado {item.count} vezes em:
                      </div>
                      {item.locations?.map((location, i) => (
                        <FileLocation key={i} location={location} />
                      ))}
                    </div>
                  ))}
                </div>
              </SmellCard>
            )}

            {/* Duplicate Steps */}
            {results.duplicateSteps.duplicateSteps.length > 0 && (
              <SmellCard
                icon={Repeat}
                title="Steps Duplicados"
                count={results.duplicateSteps.totalDuplicateSteps}
              >
                <div className="space-y-4">
                  {results.duplicateSteps.duplicateSteps.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <FileLocation location={item.file_and_line || ''} />
                      <div className="text-sm text-gray-700">{item.duplicate_step}</div>
                      <CodeBlock code={item.register || ''} />
                    </div>
                  ))}
                </div>
              </SmellCard>
            )}

            {/* Duplicate Test Cases */}
            {results.duplicateTestCases.duplicateTestCases.length > 0 && (
              <SmellCard
                icon={Copy}
                title="Casos de Teste Duplicados"
                count={results.duplicateTestCases.totalTestCases}
              >
                <div className="space-y-4">
                  {results.duplicateTestCases.duplicateTestCases.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="text-sm text-gray-500">
                        Encontrado {item.count} vezes em:
                      </div>
                      <CodeBlock code={item.titlesAndFiles || ''} />
                      <div className="text-sm text-gray-700 mt-2">Conteúdo duplicado:</div>
                      <CodeBlock code={item.testCaseBody || ''} />
                    </div>
                  ))}
                </div>
              </SmellCard>
            )}

            {/* Malformed Tests */}
            {results.malformedTests.malformedRegisters.length > 0 && (
              <SmellCard
                icon={AlertTriangle}
                title="Testes Malformados"
                count={results.malformedTests.totalMalformedTests}
              >
                <div className="space-y-4">
                  {results.malformedTests.malformedRegisters.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <FileLocation location={item.file_and_line || ''} />
                      <div className="text-sm text-red-600">{item.justification}</div>
                      <CodeBlock code={item.register || ''} />
                    </div>
                  ))}
                </div>
              </SmellCard>
            )}

            {/* Starting with Left Foot */}
            {results.startingWithLeftFoot.leftFoots.length > 0 && (
              <SmellCard
                icon={Footprints}
                title="Iniciando com o Pé Esquerdo"
                count={results.startingWithLeftFoot.totalLeftFoots}
              >
                <div className="space-y-4">
                  {results.startingWithLeftFoot.leftFoots.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <FileLocation location={item.filename} />
                      <CodeBlock code={item.left_foot || ''} />
                    </div>
                  ))}
                </div>
              </SmellCard>
            )}

            {/* Vicious Tags */}
            {results.viciousTags.viciousTags.length > 0 && (
              <SmellCard
                icon={Tag}
                title="Tags Viciosas"
                count={results.viciousTags.totalViciousTags}
              >
                <div className="space-y-4">
                  {results.viciousTags.viciousTags.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <FileLocation location={item.filename} />
                      <div className="text-sm text-gray-700">
                        {item.vicious_tag}
                      </div>
                      <div className="text-sm text-gray-500">
                        Em {item.scenarios} {item.type?.toLowerCase()}s
                      </div>
                    </div>
                  ))}
                </div>
              </SmellCard>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
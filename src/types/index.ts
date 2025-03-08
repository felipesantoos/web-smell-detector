export interface SmellResult {
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

export interface SmellMetric {
  icon: React.ElementType;
  name: string;
  count: number;
  color: string;
}

export interface AnalysisResult {
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
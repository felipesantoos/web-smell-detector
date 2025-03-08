import React from 'react';
import {
  Layout,
  Copy,
  AlertTriangle,
  Repeat,
  AlertCircle,
  Footprints,
  Tag
} from 'lucide-react';
import { SmellsCharts } from './charts/SmellsCharts';
import type { AnalysisResult } from '../types';

interface DashboardProps {
  results: AnalysisResult;
}

interface SmellMetric {
  icon: React.ElementType;
  name: string;
  count: number;
  color: string;
}

const colorMap = {
  purple: 'rgb(147, 51, 234)',
  blue: 'rgb(37, 99, 235)',
  amber: 'rgb(217, 119, 6)',
  indigo: 'rgb(79, 70, 229)',
  green: 'rgb(22, 163, 74)',
  cyan: 'rgb(8, 145, 178)',
  red: 'rgb(220, 38, 38)',
  orange: 'rgb(234, 88, 12)',
  teal: 'rgb(13, 148, 136)'
};

export function Dashboard({ results }: DashboardProps) {
  const metrics: SmellMetric[] = [
    {
      icon: Layout,
      name: 'Untitled Features',
      count: results.untitledFeatures.length,
      color: colorMap.purple,
    },
    {
      icon: Copy,
      name: 'Duplicate Features',
      count: results.duplicateFeatureTitles.totalFeatures,
      color: colorMap.blue,
    },
    {
      icon: AlertTriangle,
      name: 'Missing Background',
      count: results.absenceBackground.totalAbsenceBackgrounds,
      color: colorMap.amber,
    },
    {
      icon: Copy,
      name: 'Duplicate Scenarios',
      count: results.duplicateScenarioTitles.totalScenarioTitles,
      color: colorMap.indigo,
    },
    {
      icon: Repeat,
      name: 'Duplicate Steps',
      count: results.duplicateSteps.totalDuplicateSteps,
      color: colorMap.green,
    },
    {
      icon: Copy,
      name: 'Duplicate Test Cases',
      count: results.duplicateTestCases.totalTestCases,
      color: colorMap.cyan,
    },
    {
      icon: AlertCircle,
      name: 'Malformed Tests',
      count: results.malformedTests.totalMalformedTests,
      color: colorMap.red,
    },
    {
      icon: Footprints,
      name: 'Left Foot Starts',
      count: results.startingWithLeftFoot.totalLeftFoots,
      color: colorMap.orange,
    },
    {
      icon: Tag,
      name: 'Vicious Tags',
      count: results.viciousTags.totalViciousTags,
      color: colorMap.teal,
    },
  ];

  const totalSmells = metrics.reduce((acc, metric) => acc + metric.count, 0);

  return (
    <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Smell Analysis Summary</h2>
            <p className="text-sm sm:text-base text-gray-600">Total smells detected: {totalSmells}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-3 sm:p-4 flex items-center gap-3 sm:gap-4 transition-transform hover:scale-[1.02]"
            >
              <div className="p-2 sm:p-3 rounded-lg" style={{ 
                backgroundColor: metric.color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
                color: metric.color 
              }}>
                <metric.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <div className="text-xs sm:text-sm text-gray-600">{metric.name}</div>
                <div className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {metric.count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SmellsCharts metrics={metrics} />
    </div>
  );
}
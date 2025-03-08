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

export function Dashboard({ results }: DashboardProps) {
  const metrics: SmellMetric[] = [
    {
      icon: Layout,
      name: 'Untitled Features',
      count: results.untitledFeatures.length,
      color: 'text-purple-600',
    },
    {
      icon: Copy,
      name: 'Duplicate Features',
      count: results.duplicateFeatureTitles.reportData.length,
      color: 'text-blue-600',
    },
    {
      icon: AlertTriangle,
      name: 'Missing Background',
      count: results.absenceBackground.absencesBackgrounds.length,
      color: 'text-amber-600',
    },
    {
      icon: Copy,
      name: 'Duplicate Scenarios',
      count: results.duplicateScenarioTitles.duplicateScenarioTitles.length,
      color: 'text-indigo-600',
    },
    {
      icon: Repeat,
      name: 'Duplicate Steps',
      count: results.duplicateSteps.duplicateSteps.length,
      color: 'text-green-600',
    },
    {
      icon: Copy,
      name: 'Duplicate Test Cases',
      count: results.duplicateTestCases.duplicateTestCases.length,
      color: 'text-cyan-600',
    },
    {
      icon: AlertCircle,
      name: 'Malformed Tests',
      count: results.malformedTests.malformedRegisters.length,
      color: 'text-red-600',
    },
    {
      icon: Footprints,
      name: 'Left Foot Starts',
      count: results.startingWithLeftFoot.leftFoots.length,
      color: 'text-orange-600',
    },
    {
      icon: Tag,
      name: 'Vicious Tags',
      count: results.viciousTags.viciousTags.length,
      color: 'text-teal-600',
    },
  ];

  const totalSmells = metrics.reduce((acc, metric) => acc + metric.count, 0);

  return (
    <div className="mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Smell Analysis Summary</h2>
            <p className="text-gray-600">Total smells detected: {totalSmells}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 flex items-center gap-4 transition-transform hover:scale-[1.02]"
            >
              <div className={`p-3 rounded-lg ${metric.color} bg-opacity-10`}>
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
              </div>
              <div>
                <div className="text-sm text-gray-600">{metric.name}</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {metric.count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
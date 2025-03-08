import React from 'react';
import testSmells from '../data/testSmells';

export function Catalog() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Test Smell Catalog
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A comprehensive guide to common test smells in Gherkin/Cucumber feature files
          and their impact on test quality.
        </p>
      </div>

      {testSmells.map((category, index) => (
        <div key={index} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
            {category.category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {category.items.map((smell, smellIndex) => (
              <div
                key={smellIndex}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video overflow-hidden bg-gray-100">
                  <img
                    src={smell.image}
                    alt={smell.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {smell.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {smell.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">
                      Consequences:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {smell.consequences.map((consequence, i) => (
                        <li key={i}>{consequence}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
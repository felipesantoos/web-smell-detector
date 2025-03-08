import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import testSmells from '../data/testSmells';

export function Catalog() {
  const [activeSmell, setActiveSmell] = useState('');
  const [activeCategory, setActiveCategory] = useState(testSmells[0].category);

  useEffect(() => {
    // Set first smell as active by default
    if (testSmells[0]?.items[0]) {
      setActiveSmell(testSmells[0].items[0].title);
    }
  }, []);

  const currentSmell = testSmells
    .flatMap(category => category.items)
    .find(smell => smell.title === activeSmell);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <div className="sticky top-0 bg-gray-50 px-4 py-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Test Smell Catalog
          </h1>
          <p className="text-sm text-gray-600">
            A comprehensive guide to test smells in Gherkin/Cucumber feature files.
          </p>
        </div>

        <nav className="px-4 py-6">
          {testSmells.map((category, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">
                {category.category}
              </h2>
              <ul className="space-y-1">
                {category.items.map((smell, smellIndex) => (
                  <li key={smellIndex}>
                    <button
                      onClick={() => {
                        setActiveSmell(smell.title);
                        setActiveCategory(category.category);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        activeSmell === smell.title
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      {smell.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      {currentSmell && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-8 py-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span>{activeCategory}</span>
                <ChevronRight className="h-4 w-4" />
                <span>{currentSmell.title}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {currentSmell.title}
              </h1>
            </div>

            <div className="prose prose-blue max-w-none space-y-4">
              {/* Description */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-xl font-semibold text-gray-900">Description</div>
                <p className="text-gray-600 mt-2 mb-0">{currentSmell.description}</p>
              </div>

              {/* Consequences */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 pb-2">
                <div className="text-xl font-semibold text-gray-900">Consequences</div>
                <ul className="space-y-3 mt-2">
                  {currentSmell.consequences.map((consequence, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                      <span className="text-gray-600">{consequence}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Example */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-xl font-semibold text-gray-900">Example</div>
                <div className="aspect-[16/9] bg-gray-50 rounded-lg overflow-hidden mt-2">
                  <img
                    src={currentSmell.image}
                    alt={`Example of ${currentSmell.title}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
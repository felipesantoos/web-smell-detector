import React, { useState, useEffect } from 'react';
import { ChevronRight, Menu, X } from 'lucide-react';
import testSmells from '../data/testSmells';

export function Catalog() {
  const [activeSmell, setActiveSmell] = useState('');
  const [activeCategory, setActiveCategory] = useState(testSmells[0].category);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-20 bg-white border-b border-gray-200 px-4 py-2">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="font-medium">Menu</span>
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static flex flex-col w-64 bg-gray-50 border-r border-gray-200
          transform transition-transform duration-300 ease-in-out z-40 h-full
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="bg-gray-50 px-4 py-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Test Smell Catalog
          </h1>
          <p className="text-sm text-gray-600">
            A comprehensive guide to test smells in Gherkin/Cucumber feature files.
          </p>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
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
                        setIsSidebarOpen(false);
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
      <div className="flex-1 overflow-y-auto lg:pt-0 pt-16">
        {currentSmell && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span>{activeCategory}</span>
                <ChevronRight className="h-4 w-4" />
                <span>{currentSmell.title}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {currentSmell.title}
              </h1>
            </div>

            <div className="prose prose-blue max-w-none space-y-4">
              {/* Description */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <div className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Description</div>
                <p className="text-gray-600">{currentSmell.description}</p>
              </div>

              {/* Consequences */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <div className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Consequences</div>
                <ul className="space-y-3">
                  {currentSmell.consequences.map((consequence, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                      <span className="text-gray-600">{consequence}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Example */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <div className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Example</div>
                <div className="aspect-[16/9] bg-gray-50 rounded-lg overflow-hidden">
                  <img
                    src={currentSmell.image}
                    alt={`Example of ${currentSmell.title}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
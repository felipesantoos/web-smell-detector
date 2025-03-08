import React from 'react';
import { NavLink } from 'react-router-dom';
import { TestTube, Book } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="mx-auto px-2">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <TestTube className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Test Smells
              </span>
            </div>
            <div className="flex items-center gap-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <TestTube className="h-5 w-5" />
                Analyzer
              </NavLink>
              <NavLink
                to="/catalog"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Book className="h-5 w-5" />
                Catalog
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
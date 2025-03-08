import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { TestTube, Book, Menu, X } from 'lucide-react';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <TestTube className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Test Smells
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-2">
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

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
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
              onClick={() => setIsMenuOpen(false)}
            >
              <Book className="h-5 w-5" />
              Catalog
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}
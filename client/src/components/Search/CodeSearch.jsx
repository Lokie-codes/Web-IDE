import React, { useState } from 'react';
import { Search, X, FileCode, ChevronRight } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

const CodeSearch = ({ isOpen, onClose }) => {
  const { theme, code, language, projectFiles, mode } = useEditorStore();
  const isDark = theme === 'vs-dark';
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  if (!isOpen) return null;

  const handleSearch = () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchResults = [];

    if (mode === 'single') {
      // Search in current file
      const lines = code.split('\n');
      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(query.toLowerCase())) {
          searchResults.push({
            file: 'Current File',
            line: index + 1,
            content: line.trim(),
            path: 'main.' + (language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'txt')
          });
        }
      });
    } else {
      // Search in project files
      projectFiles.forEach(file => {
        if (!file.is_folder && file.content) {
          const lines = file.content.split('\n');
          lines.forEach((line, index) => {
            if (line.toLowerCase().includes(query.toLowerCase())) {
              searchResults.push({
                file: file.path,
                line: index + 1,
                content: line.trim(),
                path: file.path
              });
            }
          });
        }
      });
    }

    setResults(searchResults);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg shadow-2xl w-full max-w-3xl h-[500px] flex flex-col
        ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b
          ${isDark ? 'border-[#3c3c3c]' : 'border-gray-300'}`}>
          <div className="flex items-center gap-2">
            <Search className={isDark ? 'text-[#007acc]' : 'text-blue-600'} size={24} />
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Search Code
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-md transition-colors
              ${isDark ? 'hover:bg-[#37373d] text-[#cccccc]' : 'hover:bg-gray-200 text-gray-600'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <div className={`flex items-center gap-2 p-3 rounded-lg border
            ${isDark ? 'bg-[#252526] border-[#3c3c3c]' : 'bg-white border-gray-300'}`}>
            <Search size={18} className={isDark ? 'text-[#858585]' : 'text-gray-400'} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search in code..."
              className={`flex-1 bg-transparent outline-none
                ${isDark ? 'text-white placeholder-[#858585]' : 'text-gray-800 placeholder-gray-400'}`}
              autoFocus
            />
            <button
              onClick={handleSearch}
              className="px-4 py-1.5 bg-[#007acc] text-white rounded-md hover:bg-[#005a9e] transition-colors text-sm"
            >
              Search
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-auto px-4 pb-4">
          {results.length === 0 ? (
            <div className={`text-center py-8 ${isDark ? 'text-[#858585]' : 'text-gray-500'}`}>
              {query ? 'No results found' : 'Enter a search query'}
            </div>
          ) : (
            <div className="space-y-2">
              <div className={`text-sm mb-3 ${isDark ? 'text-[#858585]' : 'text-gray-600'}`}>
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </div>
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors
                    ${isDark 
                      ? 'bg-[#252526] border-[#3c3c3c] hover:bg-[#2a2d2e]' 
                      : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                    }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileCode size={14} className="text-[#007acc]" />
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {result.file}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-[#858585]' : 'text-gray-500'}`}>
                      Line {result.line}
                    </span>
                  </div>
                  <div className={`text-sm font-mono ${isDark ? 'text-[#cccccc]' : 'text-gray-700'}`}>
                    {result.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeSearch;

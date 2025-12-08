import React from 'react';
import { FileCode, Folder, Image, Zap, X } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

const WelcomeScreen = ({ onClose }) => {
  const { theme, setMode } = useEditorStore();
  const isDark = theme === 'vs-dark';

  const handleStartCoding = (mode) => {
    setMode(mode);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg shadow-2xl w-full max-w-3xl
        ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        
        <div className={`p-8 border-b
          ${isDark ? 'border-[#3c3c3c]' : 'border-gray-300'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileCode className="text-[#007acc]" size={32} />
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Welcome to CodeForge IDE
              </h1>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-md transition-colors
                ${isDark ? 'hover:bg-[#37373d] text-[#cccccc]' : 'hover:bg-gray-200 text-gray-600'}`}
            >
              <X size={20} />
            </button>
          </div>
          <p className={`text-lg ${isDark ? 'text-[#cccccc]' : 'text-gray-600'}`}>
            A powerful web-based IDE with multi-language support and VS Code-like features
          </p>
        </div>

        <div className="p-8">
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Choose how to start:
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <WelcomeCard
              icon={<FileCode size={24} />}
              title="Single File"
              description="Quick coding with instant execution and gist sharing"
              onClick={() => handleStartCoding('single')}
              isDark={isDark}
            />
            <WelcomeCard
              icon={<Folder size={24} />}
              title="Project Mode"
              description="Full project with file system and multi-file editing"
              onClick={() => handleStartCoding('project')}
              isDark={isDark}
            />
          </div>

          <div className={`p-4 rounded-lg border
            ${isDark ? 'bg-[#252526] border-[#3c3c3c]' : 'bg-blue-50 border-blue-200'}`}>
            <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Key Features:
            </h3>
            <ul className={`text-sm space-y-1 ${isDark ? 'text-[#cccccc]' : 'text-gray-700'}`}>
              <li>• Execute code in 18+ programming languages</li>
              <li>• Save and share code snippets as gists</li>
              <li>• Export beautiful code screenshots</li>
              <li>• Full project management with ZIP download</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const WelcomeCard = ({ icon, title, description, onClick, isDark }) => (
  <button
    onClick={onClick}
    className={`p-6 rounded-lg border-2 text-left transition-all hover:scale-105
      ${isDark 
        ? 'bg-[#252526] border-[#3c3c3c] hover:border-[#007acc]' 
        : 'bg-white border-gray-300 hover:border-blue-500'
      }`}
  >
    <div className="text-[#007acc] mb-3">{icon}</div>
    <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
      {title}
    </h3>
    <p className={`text-sm ${isDark ? 'text-[#858585]' : 'text-gray-600'}`}>
      {description}
    </p>
  </button>
);

export default WelcomeScreen;

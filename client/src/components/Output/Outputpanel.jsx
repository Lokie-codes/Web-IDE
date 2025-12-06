import React from 'react';
import { Terminal, Trash2, X } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

const OutputPanel = () => {
  const { output, clearOutput, toggleOutput, theme, isRunning } = useEditorStore();
  const isDark = theme === 'vs-dark';

  return (
    <div className={`h-64 flex flex-col border-t
      ${isDark ? 'bg-[#1e1e1e] border-[#3c3c3c]' : 'bg-white border-gray-300'}`}>
      
      {/* Panel Header */}
      <div className={`flex items-center justify-between px-3 py-1.5 border-b
        ${isDark ? 'bg-[#252526] border-[#3c3c3c]' : 'bg-gray-100 border-gray-300'}`}>
        <div className="flex items-center gap-3">
          <button className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded
            ${isDark ? 'text-white bg-[#37373d]' : 'text-gray-800 bg-gray-200'}`}>
            <Terminal size={16} />
            <span>Output</span>
          </button>
          <button className={`flex items-center gap-2 px-3 py-1.5 text-sm
            ${isDark ? 'text-[#cccccc] hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>
            Problems
          </button>
          <button className={`flex items-center gap-2 px-3 py-1.5 text-sm
            ${isDark ? 'text-[#cccccc] hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>
            Debug Console
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearOutput}
            title="Clear Output"
            className={`p-1.5 rounded transition-colors
              ${isDark ? 'text-[#cccccc] hover:bg-[#37373d] hover:text-white' : 'text-gray-500 hover:bg-gray-200'}`}
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={toggleOutput}
            title="Close Panel"
            className={`p-1.5 rounded transition-colors
              ${isDark ? 'text-[#cccccc] hover:bg-[#37373d] hover:text-white' : 'text-gray-500 hover:bg-gray-200'}`}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Output Content */}
      <div className={`flex-1 p-4 overflow-auto font-mono text-sm leading-relaxed
        ${isDark ? 'text-[#cccccc] bg-[#1e1e1e]' : 'text-gray-800 bg-white'}`}>
        {isRunning ? (
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-t-transparent border-[#007acc] rounded-full animate-spin" />
            <span className="text-[#cccccc]">Executing code...</span>
          </div>
        ) : output ? (
          <pre className="whitespace-pre-wrap text-[#cccccc]">{output}</pre>
        ) : (
          <span className="text-[#858585] italic">Output will appear here after running your code...</span>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;

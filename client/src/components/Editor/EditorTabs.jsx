import React from 'react';
import { X, FileCode } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

const EditorTabs = () => {
  const { tabs, activeTabId, setActiveTab, closeTab, theme } = useEditorStore();
  const isDark = theme === 'vs-dark';

  return (
    <div className={`flex items-center h-9 border-b overflow-x-auto
      ${isDark ? 'bg-[#252526] border-[#3c3c3c]' : 'bg-gray-100 border-gray-300'}`}>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-3 h-full border-r cursor-pointer
            transition-colors group min-w-max
            ${isDark ? 'border-[#3c3c3c]' : 'border-gray-300'}
            ${tab.active
              ? (isDark ? 'bg-[#1e1e1e] text-white' : 'bg-white text-gray-800')
              : (isDark ? 'bg-[#252526] text-[#cccccc] hover:bg-[#2d2d30]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
            }`}
        >
          <FileCode size={14} className={isDark ? 'text-[#dcdcaa]' : 'text-yellow-600'} />
          <span className="text-sm">{tab.name}</span>
          {tabs.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className={`p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity
                ${isDark ? 'hover:bg-[#4a4a4f]' : 'hover:bg-gray-300'}`}
            >
              <X size={14} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default EditorTabs;

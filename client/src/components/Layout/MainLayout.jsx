import React from 'react';
import { useEditorStore } from '../../store/editorStore';
import Toolbar from '../Toolbar/Toolbar';
import Sidebar from '../Sidebar/Sidebar';
import MonacoEditor from '../Editor/MonacoEditor';
import EditorTabs from '../Editor/EditorTabs';
import OutputPanel from '../Output/OutputPanel';
import { Wifi } from 'lucide-react';

const MainLayout = () => {
  const { sidebarOpen, outputOpen, theme } = useEditorStore();
  const isDark = theme === 'vs-dark';

  return (
    <div className={`h-screen flex flex-col ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
      {/* Top Toolbar */}
      <Toolbar />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && <Sidebar />}

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor Tabs */}
          <EditorTabs />

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden">
            <MonacoEditor />
          </div>

          {/* Output Panel */}
          {outputOpen && <OutputPanel />}
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
};

const StatusBar = () => {
  const { language, theme, mode } = useEditorStore();
  const isDark = theme === 'vs-dark';
  
  const langConfig = {
    javascript: 'JavaScript',
    python: 'Python',
    java: 'Java',
    cpp: 'C++',
  };

  return (
    <div className={`h-6 flex items-center justify-between px-3 text-xs border-t
      ${isDark ? 'bg-[#007acc] text-white border-[#007acc]' : 'bg-blue-600 text-white border-blue-600'}`}>
      <div className="flex items-center gap-4">
        <Wifi size={14} />
        <span className="font-medium">CodeForge IDE</span>
        <span className="opacity-75">•</span>
        <span className="capitalize">{mode} File Mode</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-medium">{langConfig[language] || language}</span>
        <span>•</span>
        <span>UTF-8</span>
        <span>•</span>
        <span>Ln 1, Col 1</span>
      </div>
    </div>
  );
};

export default MainLayout;

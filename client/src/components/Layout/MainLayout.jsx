import React from 'react';
import { useEditorStore } from '../../store/editorStore';
import Toolbar from '../Toolbar/Toolbar';
import Sidebar from '../Sidebar/Sidebar';
import MonacoEditor from '../Editor/MonacoEditor';
import EditorTabs from '../Editor/EditorTabs';
import OutputPanel from '../Output/OutputPanel';
import TerminalPanel from '../Terminal/TerminalPanel';
import { Wifi } from 'lucide-react';

const MainLayout = () => {
  const { sidebarOpen, outputOpen, terminalOpen, theme } = useEditorStore();
  const isDark = theme === 'vs-dark';

  return (
    <div className={`h-screen flex flex-col ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
      <Toolbar />

      <div className="flex flex-1 overflow-hidden p-2 gap-2">
        {sidebarOpen && (
          <div className="rounded-xl overflow-hidden shadow-sm flex-shrink-0">
            <Sidebar />
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden rounded-xl shadow-sm border border-transparent">
          <EditorTabs />

          <div className="flex-1 overflow-hidden relative">
            <MonacoEditor />
          </div>

          {outputOpen && <OutputPanel />}
          {terminalOpen && <TerminalPanel />}
        </div>
      </div>

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
    <div className={`h-8 flex items-center justify-between px-4 text-xs border-t
      ${isDark ? 'bg-[#007acc] text-white border-[#007acc]' : 'bg-blue-600 text-white border-blue-600'}`}>
      <div className="flex items-center gap-6">
        <Wifi size={14} />
        <span className="font-medium">CodeForge IDE</span>
        <span className="opacity-75">•</span>
        <span className="capitalize">{mode} File Mode</span>
      </div>
      <div className="flex items-center gap-6">
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

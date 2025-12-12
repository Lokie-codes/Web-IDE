import React, { useState } from 'react';
import {
  Play, Sun, Moon, PanelLeft, PanelBottom,
  FileCode, Download, Image, Save, HelpCircle, Settings,
  Terminal, Sparkles, Search as SearchIcon, Activity
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { useCodeExecution } from '../../hooks/useCodeExecution';
import LanguageSelector from '../Editor/LanguageSelector';
import SnapshotModal from '../CodeSnapshot/SnapshotModal';
import SaveGistModal from './SaveGistModal';
import KeyboardShortcuts from '../HelpModal/KeyBoardShortcuts';
import SettingsModal from '../Settings/SettingsModal';
import CodeSearch from '../Search/CodeSearch';
import PerformanceMonitor from '../Performance/PerformanceMonitor';
import AIAssistant from '../AI/AIAssistant';

const Toolbar = () => {
  const {
    theme, toggleTheme, toggleSidebar, toggleOutput, toggleTerminal,
    mode, setMode, isRunning, currentProject
  } = useEditorStore();

  const { executeCode } = useCodeExecution();
  const isDark = theme === 'vs-dark';

  const [showSnapshot, setShowSnapshot] = useState(false);
  const [showSaveGist, setShowSaveGist] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const handleRun = () => {
    executeCode();
  };

  const handleDownload = async () => {
    if (mode === 'project' && currentProject) {
      window.location.href = `http://localhost:3001/api/projects/${currentProject.id}/download`;
    } else {
      alert('Download is only available in Project mode. Switch to Project mode to download your files as a ZIP.');
    }
  };

  return (
    <>
      <div className={`h-12 flex items-center justify-between px-4 border-b
        ${isDark ? 'bg-[#252526] border-[#3c3c3c]' : 'bg-gray-100 border-gray-300'}`}>

        {/* Left Section */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 mr-3">
            <FileCode className="w-6 h-6 text-[#007acc]" />
            <span className={`font-semibold text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>
              CodeForge
            </span>
          </div>

          <ToolbarButton
            icon={<PanelLeft size={20} />}
            onClick={toggleSidebar}
            tooltip="Toggle Sidebar (Ctrl+B)"
            isDark={isDark}
          />

          <div className={`flex rounded-md overflow-hidden border ml-2
            ${isDark ? 'border-[#3c3c3c]' : 'border-gray-300'}`}>
            <button
              onClick={() => setMode('single')}
              className={`px-4 py-1.5 text-sm font-medium transition-all
                ${mode === 'single'
                  ? (isDark ? '!bg-[#007acc] !text-white' : '!bg-[#2563eb] !text-white')
                  : (isDark ? 'bg-[#252526] text-[#cccccc] hover:bg-[#2d2d30]' : 'bg-white text-gray-700 hover:bg-gray-100')
                }`}
            >
              Single File
            </button>
            <button
              onClick={() => setMode('project')}
              className={`px-4 py-1.5 text-sm font-medium transition-all border-l
                ${isDark ? 'border-[#3c3c3c]' : 'border-gray-300'}
                ${mode === 'project'
                  ? (isDark ? '!bg-[#007acc] !text-white' : '!bg-[#2563eb] !text-white')
                  : (isDark ? 'bg-[#252526] text-[#cccccc] hover:bg-[#2d2d30]' : 'bg-white text-gray-700 hover:bg-gray-100')
                }`}
            >
              Project
            </button>
          </div>
        </div>

        {/* Center Section */}
        <div className="flex items-center gap-6">
          <LanguageSelector />

          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`flex items-center gap-2 px-5 py-2 rounded-md font-medium text-sm
              transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed
              ${isDark
                ? 'bg-[#6366f1] hover:bg-[#4f46e5] text-white'
                : '!bg-indigo-600 hover:!bg-indigo-700 !text-white'
              }`}
          >
            <Play size={16} fill="currentColor" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {mode === 'single' && (
            <ToolbarButton
              icon={<Save size={20} />}
              onClick={() => setShowSaveGist(true)}
              tooltip="Save as Gist"
              isDark={isDark}
            />
          )}

          <ToolbarButton
            icon={<Image size={20} />}
            onClick={() => setShowSnapshot(true)}
            tooltip="Export as Image"
            isDark={isDark}
          />

          <ToolbarButton
            icon={<Download size={20} />}
            onClick={handleDownload}
            tooltip={mode === 'project' ? 'Download Project as ZIP' : 'Download (Project mode only)'}
            isDark={isDark}
          />

          <div className={`w-px h-6 mx-1 ${isDark ? 'bg-[#3c3c3c]' : 'bg-gray-300'}`} />


          {/* AI Assistant */}
          <ToolbarButton
            icon={<Sparkles size={20} />}
            onClick={() => setShowAI(true)}
            tooltip="AI Assistant"
            isDark={isDark}
          />

          {/* Code Search */}
          <ToolbarButton
            icon={<SearchIcon size={20} />}
            onClick={() => setShowSearch(true)}
            tooltip="Search Code (Ctrl+Shift+F)"
            isDark={isDark}
          />

          {/* Performance Monitor */}
          <ToolbarButton
            icon={<Activity size={20} />}
            onClick={() => setShowPerformance(true)}
            tooltip="Performance Monitor"
            isDark={isDark}
          />

          <ToolbarButton
            icon={<Settings size={20} />}
            onClick={() => setShowSettings(true)}
            tooltip="Settings"
            isDark={isDark}
          />

          <ToolbarButton
            icon={<HelpCircle size={20} />}
            onClick={() => setShowHelp(true)}
            tooltip="Keyboard Shortcuts"
            isDark={isDark}
          />

          <ToolbarButton
            icon={<PanelBottom size={20} />}
            onClick={toggleOutput}
            tooltip="Toggle Output Panel (Ctrl+`)"
            isDark={isDark}
          />
          <ToolbarButton
            icon={<Terminal size={20} />}
            onClick={toggleTerminal}
            tooltip="Toggle Terminal"
            isDark={isDark}
          />

          <ToolbarButton
            icon={isDark ? <Sun size={20} /> : <Moon size={20} />}
            onClick={toggleTheme}
            tooltip={`Switch to ${isDark ? 'Light' : 'Dark'} Theme`}
            isDark={isDark}
          />
        </div>
      </div>

      {/* Modals */}
      <SnapshotModal isOpen={showSnapshot} onClose={() => setShowSnapshot(false)} />
      <SaveGistModal isOpen={showSaveGist} onClose={() => setShowSaveGist(false)} />
      <KeyboardShortcuts isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <CodeSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
      <PerformanceMonitor isOpen={showPerformance} onClose={() => setShowPerformance(false)} />
      <AIAssistant isOpen={showAI} onClose={() => setShowAI(false)} />

    </>
  );
};

const ToolbarButton = ({ icon, onClick, tooltip, isDark }) => (
  <button
    onClick={onClick}
    title={tooltip}
    className={`p-2 rounded-md transition-colors
      ${isDark
        ? 'text-[#cccccc] hover:bg-[#37373d] hover:text-white'
        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
      }`}
  >
    {icon}
  </button>
);

export default Toolbar;

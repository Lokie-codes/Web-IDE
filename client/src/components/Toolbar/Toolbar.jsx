import React, { useState } from 'react';
import { 
  Play, Sun, Moon, PanelLeft, PanelBottom, 
  FileCode, Download, Image, Save
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { useCodeExecution } from '../../hooks/useCodeExecution';
import LanguageSelector from '../Editor/LanguageSelector';
import SnapshotModal from '../CodeSnapshot/SnapshotModal';
import SaveGistModal from './SaveGistModal';

const Toolbar = () => {
  const { 
    theme, toggleTheme, toggleSidebar, toggleOutput,
    mode, setMode, isRunning, currentProject
  } = useEditorStore();
  
  const { executeCode } = useCodeExecution();
  const isDark = theme === 'vs-dark';

  const [showSnapshot, setShowSnapshot] = useState(false);
  const [showSaveGist, setShowSaveGist] = useState(false);

  const handleRun = () => {
    executeCode();
  };

  const handleDownload = async () => {
    if (mode === 'project' && currentProject) {
      // Download project as ZIP
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
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2 mr-3">
            <FileCode className="w-6 h-6 text-[#007acc]" />
            <span className={`font-semibold text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>
              CodeForge
            </span>
          </div>

          {/* Toggle Sidebar */}
          <ToolbarButton 
            icon={<PanelLeft size={20} />} 
            onClick={toggleSidebar}
            tooltip="Toggle Sidebar (Ctrl+B)"
            isDark={isDark}
          />

          {/* Mode Toggle */}
          <div className={`flex rounded-md overflow-hidden border ml-2
            ${isDark ? 'border-[#3c3c3c]' : 'border-gray-300'}`}>
            <button
              onClick={() => setMode('single')}
              className={`px-4 py-1.5 text-sm font-medium transition-all
                ${mode === 'single' 
                  ? 'bg-[#007acc] text-white'
                  : (isDark ? 'bg-[#252526] text-[#cccccc] hover:bg-[#2d2d30]' : 'bg-white text-gray-600 hover:bg-gray-100')
                }`}
            >
              Single File
            </button>
            <button
              onClick={() => setMode('project')}
              className={`px-4 py-1.5 text-sm font-medium transition-all border-l
                ${isDark ? 'border-[#3c3c3c]' : 'border-gray-300'}
                ${mode === 'project' 
                  ? 'bg-[#007acc] text-white'
                  : (isDark ? 'bg-[#252526] text-[#cccccc] hover:bg-[#2d2d30]' : 'bg-white text-gray-600 hover:bg-gray-100')
                }`}
            >
              Project
            </button>
          </div>
        </div>

        {/* Center Section */}
        <div className="flex items-center gap-3">
          <LanguageSelector />
          
          {/* Run Button */}
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`flex items-center gap-2 px-5 py-2 rounded-md font-medium text-sm
              transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed
              ${isDark 
                ? 'bg-[#16825d] hover:bg-[#1a9e6f] text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
          >
            <Play size={16} fill="currentColor" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Save as Gist (Single File Mode) */}
          {mode === 'single' && (
            <ToolbarButton 
              icon={<Save size={20} />} 
              onClick={() => setShowSaveGist(true)}
              tooltip="Save as Gist"
              isDark={isDark}
            />
          )}

          {/* Export as Image */}
          <ToolbarButton 
            icon={<Image size={20} />} 
            onClick={() => setShowSnapshot(true)}
            tooltip="Export as Image"
            isDark={isDark}
          />
          
          {/* Download Project */}
          <ToolbarButton 
            icon={<Download size={20} />} 
            onClick={handleDownload}
            tooltip={mode === 'project' ? 'Download Project as ZIP' : 'Download (Project mode only)'}
            isDark={isDark}
          />

          <div className={`w-px h-6 mx-1 ${isDark ? 'bg-[#3c3c3c]' : 'bg-gray-300'}`} />

          {/* Toggle Output Panel */}
          <ToolbarButton 
            icon={<PanelBottom size={20} />} 
            onClick={toggleOutput}
            tooltip="Toggle Output Panel"
            isDark={isDark}
          />

          {/* Theme Toggle */}
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

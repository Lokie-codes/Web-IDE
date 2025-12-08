import React, { useState } from 'react';
import { X, Settings, Code, Palette, Keyboard, Info } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

const SettingsModal = ({ isOpen, onClose }) => {
  const { theme } = useEditorStore();
  const isDark = theme === 'vs-dark';
  const [activeTab, setActiveTab] = useState('editor');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg shadow-2xl w-full max-w-4xl h-[600px] flex
        ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        
        {/* Header */}
        <div className="flex flex-col w-full">
          <div className={`flex items-center justify-between p-4 border-b
            ${isDark ? 'border-[#3c3c3c]' : 'border-gray-300'}`}>
            <div className="flex items-center gap-2">
              <Settings className={isDark ? 'text-[#007acc]' : 'text-blue-600'} size={24} />
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Settings
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

          {/* Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className={`w-48 border-r p-2
              ${isDark ? 'bg-[#252526] border-[#3c3c3c]' : 'bg-gray-50 border-gray-300'}`}>
              <SettingsTab
                icon={<Code size={18} />}
                label="Editor"
                active={activeTab === 'editor'}
                onClick={() => setActiveTab('editor')}
                isDark={isDark}
              />
              <SettingsTab
                icon={<Palette size={18} />}
                label="Appearance"
                active={activeTab === 'appearance'}
                onClick={() => setActiveTab('appearance')}
                isDark={isDark}
              />
              <SettingsTab
                icon={<Keyboard size={18} />}
                label="Shortcuts"
                active={activeTab === 'shortcuts'}
                onClick={() => setActiveTab('shortcuts')}
                isDark={isDark}
              />
              <SettingsTab
                icon={<Info size={18} />}
                label="About"
                active={activeTab === 'about'}
                onClick={() => setActiveTab('about')}
                isDark={isDark}
              />
            </div>

            {/* Settings Content */}
            <div className="flex-1 overflow-auto p-6">
              {activeTab === 'editor' && <EditorSettings isDark={isDark} />}
              {activeTab === 'appearance' && <AppearanceSettings isDark={isDark} />}
              {activeTab === 'shortcuts' && <ShortcutsSettings isDark={isDark} />}
              {activeTab === 'about' && <AboutSettings isDark={isDark} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsTab = ({ icon, label, active, onClick, isDark }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors mb-1
      ${active
        ? (isDark ? 'bg-[#37373d] text-white' : 'bg-blue-100 text-blue-700')
        : (isDark ? 'text-[#cccccc] hover:bg-[#2a2d2e]' : 'text-gray-700 hover:bg-gray-200')
      }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const EditorSettings = ({ isDark }) => {
  const [fontSize, setFontSize] = useState(14);
  const [tabSize, setTabSize] = useState(2);
  const [wordWrap, setWordWrap] = useState(true);
  const [minimap, setMinimap] = useState(true);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <div className="space-y-6">
      <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
        Editor Settings
      </h3>

      <SettingItem label="Font Size" isDark={isDark}>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="10"
            max="24"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="flex-1"
          />
          <span className={`text-sm ${isDark ? 'text-[#cccccc]' : 'text-gray-700'}`}>
            {fontSize}px
          </span>
        </div>
      </SettingItem>

      <SettingItem label="Tab Size" isDark={isDark}>
        <select
          value={tabSize}
          onChange={(e) => setTabSize(e.target.value)}
          className={`px-3 py-2 rounded-md border outline-none focus:ring-2 focus:ring-[#007acc]
            ${isDark 
              ? 'bg-[#252526] border-[#3c3c3c] text-white' 
              : 'bg-white border-gray-300 text-gray-800'
            }`}
        >
          <option value="2">2 spaces</option>
          <option value="4">4 spaces</option>
          <option value="8">8 spaces</option>
        </select>
      </SettingItem>

      <SettingItem label="Word Wrap" isDark={isDark}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={wordWrap}
            onChange={(e) => setWordWrap(e.target.checked)}
            className="w-4 h-4"
          />
          <span className={`text-sm ${isDark ? 'text-[#cccccc]' : 'text-gray-700'}`}>
            Enable word wrap
          </span>
        </label>
      </SettingItem>

      <SettingItem label="Minimap" isDark={isDark}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={minimap}
            onChange={(e) => setMinimap(e.target.checked)}
            className="w-4 h-4"
          />
          <span className={`text-sm ${isDark ? 'text-[#cccccc]' : 'text-gray-700'}`}>
            Show minimap
          </span>
        </label>
      </SettingItem>

      <SettingItem label="Line Numbers" isDark={isDark}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={lineNumbers}
            onChange={(e) => setLineNumbers(e.target.checked)}
            className="w-4 h-4"
          />
          <span className={`text-sm ${isDark ? 'text-[#cccccc]' : 'text-gray-700'}`}>
            Show line numbers
          </span>
        </label>
      </SettingItem>

      <SettingItem label="Auto Save" isDark={isDark}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={autoSave}
            onChange={(e) => setAutoSave(e.target.checked)}
            className="w-4 h-4"
          />
          <span className={`text-sm ${isDark ? 'text-[#cccccc]' : 'text-gray-700'}`}>
            Auto-save files (1s delay)
          </span>
        </label>
      </SettingItem>
    </div>
  );
};

const AppearanceSettings = ({ isDark }) => {
  const { theme, setTheme } = useEditorStore();
  const [accentColor, setAccentColor] = useState('#007acc');

  return (
    <div className="space-y-6">
      <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
        Appearance Settings
      </h3>

      <SettingItem label="Color Theme" isDark={isDark}>
        <div className="space-y-2">
          <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer
            ${theme === 'vs-dark'
              ? (isDark ? 'border-[#007acc] bg-[#252526]' : 'border-blue-500 bg-blue-50')
              : (isDark ? 'border-[#3c3c3c]' : 'border-gray-300')
            }`}
          >
            <input
              type="radio"
              name="theme"
              checked={theme === 'vs-dark'}
              onChange={() => setTheme('vs-dark')}
              className="w-4 h-4"
            />
            <div>
              <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Dark Theme
              </div>
              <div className={`text-xs ${isDark ? 'text-[#858585]' : 'text-gray-500'}`}>
                VS Code Dark (Default)
              </div>
            </div>
          </label>

          <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer
            ${theme === 'light'
              ? (isDark ? 'border-[#007acc] bg-[#252526]' : 'border-blue-500 bg-blue-50')
              : (isDark ? 'border-[#3c3c3c]' : 'border-gray-300')
            }`}
          >
            <input
              type="radio"
              name="theme"
              checked={theme === 'light'}
              onChange={() => setTheme('light')}
              className="w-4 h-4"
            />
            <div>
              <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Light Theme
              </div>
              <div className={`text-xs ${isDark ? 'text-[#858585]' : 'text-gray-500'}`}>
                VS Code Light
              </div>
            </div>
          </label>
        </div>
      </SettingItem>

      <SettingItem label="Accent Color" isDark={isDark}>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            className="w-12 h-12 rounded cursor-pointer"
          />
          <span className={`text-sm ${isDark ? 'text-[#cccccc]' : 'text-gray-700'}`}>
            {accentColor}
          </span>
        </div>
      </SettingItem>
    </div>
  );
};

const ShortcutsSettings = ({ isDark }) => {
  const shortcuts = [
    { action: 'Save File', keys: 'Ctrl+S' },
    { action: 'Run Code', keys: 'Ctrl+Enter' },
    { action: 'Toggle Sidebar', keys: 'Ctrl+B' },
    { action: 'Toggle Output', keys: 'Ctrl+`' },
    { action: 'Command Palette', keys: 'Ctrl+Shift+P' },
    { action: 'Find', keys: 'Ctrl+F' },
    { action: 'Find & Replace', keys: 'Ctrl+H' },
    { action: 'Toggle Comment', keys: 'Ctrl+/' },
  ];

  return (
    <div className="space-y-6">
      <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
        Keyboard Shortcuts
      </h3>

      <div className="space-y-2">
        {shortcuts.map((shortcut, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg
              ${isDark ? 'bg-[#252526]' : 'bg-gray-50'}`}
          >
            <span className={`text-sm ${isDark ? 'text-[#cccccc]' : 'text-gray-700'}`}>
              {shortcut.action}
            </span>
            <kbd className={`px-3 py-1 text-xs font-semibold rounded border
              ${isDark 
                ? 'bg-[#37373d] border-[#3c3c3c] text-white' 
                : 'bg-white border-gray-300 text-gray-800'
              }`}>
              {shortcut.keys}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  );
};

const AboutSettings = ({ isDark }) => (
  <div className="space-y-6">
    <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
      About CodeForge IDE
    </h3>

    <div className={`p-4 rounded-lg border
      ${isDark ? 'bg-[#252526] border-[#3c3c3c]' : 'bg-gray-50 border-gray-300'}`}>
      <div className="space-y-3">
        <div>
          <div className={`text-sm font-medium ${isDark ? 'text-[#858585]' : 'text-gray-500'}`}>
            Version
          </div>
          <div className={`text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
            1.0.0
          </div>
        </div>
        
        <div>
          <div className={`text-sm font-medium ${isDark ? 'text-[#858585]' : 'text-gray-500'}`}>
            Developer
          </div>
          <div className={`text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Lokesh Sinduluri
          </div>
        </div>

        <div>
          <div className={`text-sm font-medium ${isDark ? 'text-[#858585]' : 'text-gray-500'}`}>
            Technologies
          </div>
          <div className={`text-sm ${isDark ? 'text-[#cccccc]' : 'text-gray-700'}`}>
            React • Monaco Editor • Express • Piston • Docker
          </div>
        </div>

        <div className="pt-3 border-t border-[#3c3c3c]">
          <a
            href="https://github.com/yourusername/codeforge-ide"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#007acc] hover:underline text-sm"
          >
            View on GitHub →
          </a>
        </div>
      </div>
    </div>

    <div className={`p-4 rounded-lg
      ${isDark ? 'bg-[#1e1e1e]' : 'bg-blue-50'}`}>
      <p className={`text-sm ${isDark ? 'text-[#cccccc]' : 'text-gray-700'}`}>
        <strong>CodeForge IDE</strong> is a web-based integrated development environment 
        with multi-language code execution, project management, and VS Code-like features.
      </p>
    </div>
  </div>
);

const SettingItem = ({ label, children, isDark }) => (
  <div className="space-y-2">
    <label className={`text-sm font-medium ${isDark ? 'text-[#cccccc]' : 'text-gray-700'}`}>
      {label}
    </label>
    {children}
  </div>
);

export default SettingsModal;

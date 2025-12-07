import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

const KeyboardShortcuts = ({ isOpen, onClose }) => {
  const { theme } = useEditorStore();
  const isDark = theme === 'vs-dark';

  if (!isOpen) return null;

  const shortcuts = [
    { keys: ['Ctrl', 'S'], mac: ['⌘', 'S'], description: 'Save current file' },
    { keys: ['Ctrl', 'Enter'], mac: ['⌘', 'Enter'], description: 'Run code' },
    { keys: ['Ctrl', 'B'], mac: ['⌘', 'B'], description: 'Toggle sidebar' },
    { keys: ['Ctrl', '`'], mac: ['⌘', '`'], description: 'Toggle output panel' },
    { keys: ['Ctrl', 'Shift', 'P'], mac: ['⌘', 'Shift', 'P'], description: 'Command palette' },
    { keys: ['Ctrl', 'F'], mac: ['⌘', 'F'], description: 'Find in file' },
    { keys: ['Ctrl', 'H'], mac: ['⌘', 'H'], description: 'Find and replace' },
    { keys: ['Ctrl', '/'], mac: ['⌘', '/'], description: 'Toggle comment' },
    { keys: ['Ctrl', 'D'], mac: ['⌘', 'D'], description: 'Add selection to next match' },
    { keys: ['Alt', 'Up/Down'], mac: ['⌥', '↑/↓'], description: 'Move line up/down' },
    { keys: ['Shift', 'Alt', 'Up/Down'], mac: ['⇧', '⌥', '↑/↓'], description: 'Copy line up/down' },
    { keys: ['Ctrl', 'Shift', 'K'], mac: ['⌘', 'Shift', 'K'], description: 'Delete line' },
  ];

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-auto
        ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        
        <div className={`flex items-center justify-between p-4 border-b sticky top-0 z-10
          ${isDark ? 'border-[#3c3c3c] bg-[#1e1e1e]' : 'border-gray-300 bg-white'}`}>
          <div className="flex items-center gap-2">
            <Keyboard className={isDark ? 'text-[#007acc]' : 'text-blue-600'} size={24} />
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Keyboard Shortcuts
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

        <div className="p-6">
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg
                  ${isDark ? 'bg-[#252526]' : 'bg-gray-50'}`}
              >
                <span className={`text-sm ${isDark ? 'text-[#cccccc]' : 'text-gray-700'}`}>
                  {shortcut.description}
                </span>
                <div className="flex items-center gap-1">
                  {(isMac ? shortcut.mac : shortcut.keys).map((key, i) => (
                    <React.Fragment key={i}>
                      <kbd className={`px-2 py-1 text-xs font-semibold rounded border min-w-[32px] text-center
                        ${isDark 
                          ? 'bg-[#37373d] border-[#3c3c3c] text-white' 
                          : 'bg-white border-gray-300 text-gray-800'
                        }`}>
                        {key}
                      </kbd>
                      {i < (isMac ? shortcut.mac : shortcut.keys).length - 1 && (
                        <span className={`text-xs ${isDark ? 'text-[#858585]' : 'text-gray-500'}`}>+</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-6 p-4 rounded-lg border
            ${isDark ? 'bg-[#252526] border-[#3c3c3c]' : 'bg-blue-50 border-blue-200'}`}>
            <p className={`text-sm ${isDark ? 'text-[#cccccc]' : 'text-blue-900'}`}>
              <strong>Tip:</strong> Most Monaco Editor shortcuts work here. Press{' '}
              <kbd className="px-2 py-0.5 bg-opacity-50 bg-gray-700 text-white rounded text-xs">
                {isMac ? '⌘' : 'Ctrl'}+Shift+P
              </kbd>{' '}
              to open the command palette for more options.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;

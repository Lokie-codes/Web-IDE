import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Trash2 } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

const TerminalPanel = () => {
  const { theme } = useEditorStore();
  const isDark = theme === 'vs-dark';
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', content: 'CodeForge Terminal v1.0.0' },
    { type: 'system', content: 'Type "help" for available commands' },
  ]);
  const inputRef = useRef(null);
  const historyRef = useRef(null);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add command to history
    setHistory(prev => [...prev, { type: 'command', content: input }]);

    // Process command
    processCommand(input.trim());
    setInput('');
  };

  const processCommand = (cmd) => {
    const args = cmd.split(' ');
    const command = args[0].toLowerCase();

    switch (command) {
      case 'help':
        addOutput([
          'Available commands:',
          '  help     - Show this help message',
          '  clear    - Clear terminal',
          '  echo     - Echo a message',
          '  date     - Show current date/time',
          '  version  - Show IDE version',
        ]);
        break;

      case 'clear':
        setHistory([]);
        break;

      case 'echo':
        addOutput(args.slice(1).join(' '));
        break;

      case 'date':
        addOutput(new Date().toString());
        break;

      case 'version':
        addOutput('CodeForge IDE v1.0.0');
        break;

      default:
        addOutput(`Command not found: ${command}. Type "help" for available commands.`, 'error');
    }
  };

  const addOutput = (content, type = 'output') => {
    const lines = Array.isArray(content) ? content : [content];
    setHistory(prev => [...prev, ...lines.map(line => ({ type, content: line }))]);
  };

  const clearHistory = () => {
    setHistory([
      { type: 'system', content: 'Terminal cleared' },
    ]);
  };

  return (
    <div className={`h-64 flex flex-col border-t
      ${isDark ? 'bg-[#1e1e1e] border-[#3c3c3c]' : 'bg-white border-gray-300'}`}>
      
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-1.5 border-b
        ${isDark ? 'bg-[#252526] border-[#3c3c3c]' : 'bg-gray-100 border-gray-300'}`}>
        <div className="flex items-center gap-3">
          <button className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded
            ${isDark ? 'text-white bg-[#37373d]' : 'text-gray-800 bg-gray-200'}`}>
            <TerminalIcon size={16} />
            <span>Terminal</span>
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearHistory}
            title="Clear Terminal"
            className={`p-1.5 rounded transition-colors
              ${isDark ? 'text-[#cccccc] hover:bg-[#37373d]' : 'text-gray-500 hover:bg-gray-200'}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={historyRef}
        className={`flex-1 overflow-auto p-3 font-mono text-sm
          ${isDark ? 'text-[#cccccc]' : 'text-gray-800'}`}
      >
        {history.map((item, index) => (
          <div key={index} className="mb-1">
            {item.type === 'command' && (
              <div className="flex items-start gap-2">
                <span className="text-[#4ec9b0]">$</span>
                <span>{item.content}</span>
              </div>
            )}
            {item.type === 'output' && (
              <div className={isDark ? 'text-[#cccccc]' : 'text-gray-700'}>
                {item.content}
              </div>
            )}
            {item.type === 'error' && (
              <div className="text-red-500">{item.content}</div>
            )}
            {item.type === 'system' && (
              <div className="text-[#858585] italic">{item.content}</div>
            )}
          </div>
        ))}

        {/* Input Line */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-1">
          <span className="text-[#4ec9b0]">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none"
            placeholder="Type a command..."
            autoFocus
          />
        </form>
      </div>
    </div>
  );
};

export default TerminalPanel;

import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useEditorStore } from '../../store/editorStore';
import { useCodeExecution } from '../../hooks/useCodeExecution';

const MonacoEditor = () => {
  const editorRef = useRef(null);
  const { code, setCode, language, theme, activeTabId, updateTabContent, mode, currentProject } = useEditorStore();
  const { executeCode } = useCodeExecution();
  const saveTimeoutRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Ctrl+S / Cmd+S - Save
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      console.log('💾 Manual save triggered');
      saveCurrentFile();
    });

    // Ctrl+Enter / Cmd+Enter - Run Code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      console.log('▶️ Run code shortcut triggered');
      executeCode();
    });

    // Ctrl+Shift+F - Search Code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      console.log('🔍 Open search');
      // You can trigger search modal here by updating store
    });

    // Ctrl+B / Cmd+B - Toggle Sidebar
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB, () => {
      console.log('📂 Toggle sidebar');
      useEditorStore.getState().toggleSidebar();
    });

    // Ctrl+` / Cmd+` - Toggle Output
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Backquote, () => {
      console.log('📋 Toggle output');
      useEditorStore.getState().toggleOutput();
    });

    // Ctrl+Shift+P / Cmd+Shift+P - Command Palette (Monaco built-in)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP, () => {
      editor.trigger('keyboard', 'editor.action.quickCommand', {});
    });

    // Focus editor
    editor.focus();
  };

  const handleEditorChange = (value) => {
    setCode(value || '');
    updateTabContent(activeTabId, value || '');
    
    // Auto-save in project mode
    if (mode === 'project' && currentProject) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        saveCurrentFile(value);
      }, 1000);
    }
  };

  const saveCurrentFile = async (content = code) => {
    if (mode !== 'project' || !currentProject) return;

    const tabs = useEditorStore.getState().tabs;
    const activeTab = tabs.find(t => t.id === activeTabId);
    
    if (!activeTab || !activeTab.fileId) return;

    try {
      await fetch(`http://localhost:3001/api/projects/${currentProject.id}/files/${activeTab.fileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          path: activeTab.path
        })
      });
      console.log('✅ File saved:', activeTab.name);
    } catch (error) {
      console.error('❌ Auto-save failed:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Editor
      height="100%"
      language={language}
      value={code}
      theme={theme}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      options={{
        fontSize: 14,
        fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
        fontLigatures: true,
        minimap: { enabled: true, scale: 1 },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
        lineNumbers: 'on',
        renderLineHighlight: 'all',
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        smoothScrolling: true,
        padding: { top: 10, bottom: 10 },
        bracketPairColorization: { enabled: true },
        guides: {
          bracketPairs: true,
          indentation: true,
        },
        // Additional polish
        suggest: {
          showKeywords: true,
          showSnippets: true,
        },
        quickSuggestions: {
          other: true,
          comments: false,
          strings: false
        },
        folding: true,
        foldingStrategy: 'indentation',
        showFoldingControls: 'always',
      }}
      loading={
        <div className="flex items-center justify-center h-full bg-vscode-bg">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-t-[#007acc] border-gray-600 rounded-full animate-spin" />
            <div className="text-vscode-text">Loading editor...</div>
          </div>
        </div>
      }
    />
  );
};

export default MonacoEditor;

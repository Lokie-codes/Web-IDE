import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useEditorStore } from '../../store/editorStore';

const MonacoEditor = () => {
  const editorRef = useRef(null);
  const { code, setCode, language, theme, activeTabId, updateTabContent, mode, currentProject } = useEditorStore();
  const saveTimeoutRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      console.log('Manual save triggered');
      saveCurrentFile();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      console.log('Run triggered');
    });
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
      }, 1000); // Save after 1 second of inactivity
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
    } catch (error) {
      console.error('Auto-save failed:', error);
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
      }}
      loading={
        <div className="flex items-center justify-center h-full bg-vscode-bg">
          <div className="text-vscode-text">Loading editor...</div>
        </div>
      }
    />
  );
};

export default MonacoEditor;

import React from 'react';
import MainLayout from './components/Layout/MainLayout';
import { useEditorStore } from './store/editorStore';

function App() {
  const { theme } = useEditorStore();

  return (
    <div className={theme === 'vs-dark' ? 'dark' : ''}>
      <MainLayout />
    </div>
  );
}

export default App;

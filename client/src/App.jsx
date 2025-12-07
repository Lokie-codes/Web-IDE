import React, { Suspense } from 'react';
import MainLayout from './components/Layout/MainLayout';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { FullPageLoader } from './components/LoadingStates/LoadingSpinner';
import { useEditorStore } from './store/editorStore';

function App() {
  const { theme } = useEditorStore();

  return (
    <ErrorBoundary>
      <Suspense fallback={<FullPageLoader />}>
        <div className={theme === 'vs-dark' ? 'dark' : ''}>
          <MainLayout />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;

import React, { Suspense, lazy, useState, useEffect } from 'react';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { FullPageLoader } from './components/LoadingStates/LoadingSpinner';
import { useEditorStore } from './store/editorStore';
import WelcomeScreen from './components/Welcome/WelcomeScreen';

// Lazy load heavy components
const MainLayout = lazy(() => import('./components/Layout/MainLayout'));

function App() {
  const { theme } = useEditorStore();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('codeforge_visited');
    
    if (!hasVisited) {
      setShowWelcome(true);
    }
  }, []);

  const handleCloseWelcome = () => {
    localStorage.setItem('codeforge_visited', 'true');
    setShowWelcome(false);
  };

  return (
    <ErrorBoundary>
      <Suspense fallback={<FullPageLoader text="Loading CodeForge IDE..." />}>
        <div className={theme === 'vs-dark' ? 'dark' : ''}>
          <MainLayout />
          {showWelcome && <WelcomeScreen onClose={handleCloseWelcome} />}
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center bg-[#1e1e1e]">
          <div className="max-w-lg w-full mx-4">
            <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-red-500" size={32} />
                <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
              </div>
              
              <p className="text-[#cccccc] mb-4">
                The application encountered an unexpected error. Please try reloading the page.
              </p>

              {this.state.error && (
                <div className="bg-[#1e1e1e] border border-[#3c3c3c] rounded p-4 mb-4 overflow-auto">
                  <p className="text-red-400 text-sm font-mono mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="text-[#858585] text-xs overflow-auto max-h-48">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}

              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 px-4 py-2 bg-[#007acc] text-white rounded-md hover:bg-[#005a9e] transition-colors"
              >
                <RefreshCw size={18} />
                Reload Application
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

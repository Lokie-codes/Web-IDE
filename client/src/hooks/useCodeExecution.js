import { useState } from 'react';
import { useEditorStore } from '../store/editorStore';

const API_URL = 'http://localhost:3001/api';

export const useCodeExecution = () => {
  const { code, language, setOutput, setIsRunning } = useEditorStore();
  const [error, setError] = useState(null);

  const executeCode = async (customCode = null, customLanguage = null) => {
    setIsRunning(true);
    setError(null);
    setOutput('⏳ Executing code...\n');

    try {
      const response = await fetch(`${API_URL}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: customLanguage || language,
          code: customCode || code,
          stdin: '',
          args: []
        }),
      });

      const result = await response.json();

      if (result.success) {
        const output = result.stdout || '(No output)';
        setOutput(`✅ Execution successful\n\n${output}`);
      } else {
        const errorMsg = result.stderr || result.error || 'Unknown error';
        setOutput(`❌ Execution failed\n\n${errorMsg}`);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMessage = `⚠️ Network error: ${err.message}\n\nMake sure the backend server is running on port 3001`;
      setOutput(errorMessage);
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return {
    executeCode,
    error,
  };
};

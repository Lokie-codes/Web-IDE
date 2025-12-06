import React, { useState } from 'react';
import { X, Save, Link2, Check } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { useGist } from '../../hooks/useGist';

const SaveGistModal = ({ isOpen, onClose }) => {
  const { theme } = useEditorStore();
  const { createGist, loading } = useGist();
  const [title, setTitle] = useState('');
  const [savedGist, setSavedGist] = useState(null);
  const [copied, setCopied] = useState(false);

  const isDark = theme === 'vs-dark';

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      const gist = await createGist(title || 'Untitled');
      setSavedGist(gist);
    } catch (error) {
      alert('Failed to save gist: ' + error.message);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/gist/${savedGist.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setTitle('');
    setSavedGist(null);
    setCopied(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-lg shadow-2xl w-full max-w-md
        ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        
        <div className={`flex items-center justify-between p-4 border-b
          ${isDark ? 'border-[#3c3c3c]' : 'border-gray-300'}`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {savedGist ? 'Gist Saved!' : 'Save as Gist'}
          </h2>
          <button
            onClick={handleClose}
            className={`p-2 rounded-md transition-colors
              ${isDark ? 'hover:bg-[#37373d] text-[#cccccc]' : 'hover:bg-gray-200 text-gray-600'}`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {!savedGist ? (
            <>
              <label className={`block text-sm font-medium mb-2
                ${isDark ? 'text-[#cccccc]' : 'text-gray-700'}`}>
                Gist Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Code"
                className={`w-full px-3 py-2 rounded-md border outline-none focus:ring-2 focus:ring-[#007acc]
                  ${isDark 
                    ? 'bg-[#252526] border-[#3c3c3c] text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                  }`}
              />
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={handleClose}
                  className={`px-4 py-2 rounded-md font-medium transition-colors
                    ${isDark 
                      ? 'bg-[#37373d] text-white hover:bg-[#4a4a4f]' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 rounded-md font-medium bg-[#007acc] text-white hover:bg-[#005a9e] transition-colors disabled:opacity-50"
                >
                  <Save size={18} />
                  {loading ? 'Saving...' : 'Save Gist'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={`p-4 rounded-lg mb-4
                ${isDark ? 'bg-[#252526]' : 'bg-gray-50'}`}>
                <p className={`text-sm mb-2 ${isDark ? 'text-[#cccccc]' : 'text-gray-600'}`}>
                  Shareable Link:
                </p>
                <div className={`flex items-center gap-2 p-2 rounded border
                  ${isDark ? 'bg-[#1e1e1e] border-[#3c3c3c]' : 'bg-white border-gray-300'}`}>
                  <code className={`flex-1 text-sm ${isDark ? 'text-[#4ec9b0]' : 'text-blue-600'}`}>
                    {window.location.origin}/gist/{savedGist.id}
                  </code>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCopyLink}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors
                    ${isDark 
                      ? 'bg-[#37373d] text-white hover:bg-[#4a4a4f]' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                >
                  {copied ? <Check size={18} /> : <Link2 size={18} />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-md font-medium bg-[#007acc] text-white hover:bg-[#005a9e] transition-colors"
                >
                  Done
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SaveGistModal;
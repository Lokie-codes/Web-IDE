import React, { useState, useRef } from 'react';
import { X, Download, Copy, Check } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import html2canvas from 'html2canvas';

const SnapshotModal = ({ isOpen, onClose }) => {
  const { code, language, theme } = useEditorStore();
  const [copied, setCopied] = useState(false);
  const [bgColor, setBgColor] = useState('#1e1e1e');
  const [showWindowControls, setShowWindowControls] = useState(true);
  const [padding, setPadding] = useState(64);
  const previewRef = useRef(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    const element = previewRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: bgColor,
        scale: 2,
        logging: false,
        width: element.offsetWidth,
        height: element.offsetHeight
      });

      const link = document.createElement('a');
      link.download = `code-snapshot-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleCopyImage = async () => {
    const element = previewRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: bgColor,
        scale: 2,
        logging: false
      });

      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Copy failed:', err);
        }
      });
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const isDark = theme === 'vs-dark';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto
        ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b
          ${isDark ? 'border-[#3c3c3c]' : 'border-gray-300'}`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Export Code Snapshot
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-md transition-colors
              ${isDark ? 'hover:bg-[#37373d] text-[#cccccc]' : 'hover:bg-gray-200 text-gray-600'}`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Controls */}
          <div className={`mb-6 p-4 rounded-lg border
            ${isDark ? 'bg-[#252526] border-[#3c3c3c]' : 'bg-gray-50 border-gray-300'}`}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2
                  ${isDark ? 'text-[#cccccc]' : 'text-gray-700'}`}>
                  Background Color
                </label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2
                  ${isDark ? 'text-[#cccccc]' : 'text-gray-700'}`}>
                  Padding: {padding}px
                </label>
                <input
                  type="range"
                  min="16"
                  max="128"
                  value={padding}
                  onChange={(e) => setPadding(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showWindowControls}
                    onChange={(e) => setShowWindowControls(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className={`text-sm ${isDark ? 'text-[#cccccc]' : 'text-gray-700'}`}>
                    Show window controls
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="mb-6 flex justify-center">
            <div
              ref={previewRef}
              style={{
                backgroundColor: bgColor,
                padding: `${padding}px`
              }}
              className="inline-block rounded-lg shadow-2xl"
            >
              <div className={`rounded-lg overflow-hidden shadow-lg
                ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}
                style={{ minWidth: '600px' }}
              >
                {showWindowControls && (
                  <div className={`flex items-center gap-2 px-4 py-3 border-b
                    ${isDark ? 'bg-[#252526] border-[#3c3c3c]' : 'bg-gray-100 border-gray-300'}`}>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className={`ml-4 text-sm ${isDark ? 'text-[#cccccc]' : 'text-gray-600'}`}>
                      {language}.{language === 'python' ? 'py' : 'js'}
                    </span>
                  </div>
                )}
                <pre className={`p-6 font-mono text-sm overflow-x-auto
                  ${isDark ? 'text-[#d4d4d4]' : 'text-gray-800'}`}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  <code>{code}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleCopyImage}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors
                ${isDark 
                  ? 'bg-[#37373d] text-white hover:bg-[#4a4a4f]' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-md font-medium bg-[#007acc] text-white hover:bg-[#005a9e] transition-colors"
            >
              <Download size={18} />
              Download PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnapshotModal;

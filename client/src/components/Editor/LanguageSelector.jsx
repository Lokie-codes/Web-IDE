import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { SUPPORTED_LANGUAGES, getDefaultCode } from '../../utils/languageConfig';

const LanguageSelector = () => {
  const { language, setLanguage, setCode, theme } = useEditorStore();
  const isDark = theme === 'vs-dark';

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(getDefaultCode(newLang));
  };

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.id === language);

  return (
    <div className="relative">
      <select
        value={language}
        onChange={handleLanguageChange}
        className={`appearance-none px-3 py-1.5 pr-8 rounded text-sm font-medium
          cursor-pointer transition-colors outline-none
          ${isDark 
            ? 'bg-vscode-active text-vscode-text border border-vscode-border hover:bg-vscode-sidebar' 
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.name}
          </option>
        ))}
      </select>
      <ChevronDown 
        size={14} 
        className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none
          ${isDark ? 'text-vscode-text' : 'text-gray-500'}`}
      />
    </div>
  );
};

export default LanguageSelector;

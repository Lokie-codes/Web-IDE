import { create } from 'zustand';
import { SUPPORTED_LANGUAGES } from '../utils/languageConfig';

export const useEditorStore = create((set, get) => ({
  // Editor State
  code: '// Welcome to CodeForge IDE\n// Start coding here...\n\nconsole.log("Hello, World!");',
  language: 'javascript',
  theme: 'vs-dark',
  
  // UI State
  mode: 'single',
  sidebarOpen: true,
  outputOpen: true,
  terminalOpen: false,
  
  // Output State
  output: '',
  isRunning: false,
  
  // Tabs State
  tabs: [{ id: 1, name: 'main.js', language: 'javascript', active: true, path: 'main.js' }],
  activeTabId: 1,
  
  // Project State
  currentProject: null,
  projectFiles: [],
  
  // Actions
  setCode: (code) => set({ code }),
  toggleTerminal: () => set((state) => ({ terminalOpen: !state.terminalOpen })),
  
  setLanguage: (language) => {
    const langConfig = SUPPORTED_LANGUAGES.find(l => l.id === language);
    const currentTabs = get().tabs;
    const activeTabId = get().activeTabId;
    const updatedTabs = currentTabs.map(tab => 
      tab.id === activeTabId ? { ...tab, language, name: `main${langConfig?.extension || '.txt'}` } : tab
    );
    set({ language, tabs: updatedTabs });
  },
  
  setTheme: (theme) => set({ theme }),
  
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'vs-dark' ? 'light' : 'vs-dark'
  })),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  toggleOutput: () => set((state) => ({ outputOpen: !state.outputOpen })),
  
  setOutput: (output) => set({ output }),
  
  setIsRunning: (isRunning) => set({ isRunning }),
  
  clearOutput: () => set({ output: '' }),
  
  setMode: (mode) => set({ mode }),
  
  // Tab Management
  addTab: (tab) => {
    const tabs = get().tabs;
    const newTab = {
      id: Date.now(),
      ...tab,
      active: true
    };
    const updatedTabs = tabs.map(t => ({ ...t, active: false }));
    set({ 
      tabs: [...updatedTabs, newTab],
      activeTabId: newTab.id,
      code: tab.content || '',
      language: tab.language || 'javascript'
    });
  },
  
  closeTab: (tabId) => {
    const tabs = get().tabs;
    if (tabs.length === 1) return; // Don't close last tab
    
    const tabIndex = tabs.findIndex(t => t.id === tabId);
    const newTabs = tabs.filter(t => t.id !== tabId);
    
    // If closing active tab, activate adjacent tab
    if (tabs[tabIndex].active && newTabs.length > 0) {
      const newActiveIndex = Math.min(tabIndex, newTabs.length - 1);
      newTabs[newActiveIndex].active = true;
      set({ 
        tabs: newTabs,
        activeTabId: newTabs[newActiveIndex].id,
        code: newTabs[newActiveIndex].content || '',
        language: newTabs[newActiveIndex].language
      });
    } else {
      set({ tabs: newTabs });
    }
  },
  
  setActiveTab: (tabId) => {
    const tabs = get().tabs;
    const activeTab = tabs.find(t => t.id === tabId);
    if (!activeTab) return;
    
    const updatedTabs = tabs.map(t => ({
      ...t,
      active: t.id === tabId
    }));
    
    set({ 
      tabs: updatedTabs,
      activeTabId: tabId,
      code: activeTab.content || '',
      language: activeTab.language
    });
  },
  
  updateTabContent: (tabId, content) => {
    const tabs = get().tabs;
    const updatedTabs = tabs.map(t => 
      t.id === tabId ? { ...t, content } : t
    );
    set({ tabs: updatedTabs });
  },
  
  // Project Management
  setCurrentProject: (project) => set({ currentProject: project }),
  
  setProjectFiles: (files) => set({ projectFiles: files }),
  
  loadProjectFile: (file) => {
    const tabs = get().tabs;
    const existingTab = tabs.find(t => t.path === file.path);
    
    if (existingTab) {
      get().setActiveTab(existingTab.id);
    } else {
      const extension = file.path.split('.').pop();
      const langConfig = SUPPORTED_LANGUAGES.find(l => l.extension === `.${extension}`);
      
      get().addTab({
        name: file.path.split('/').pop(),
        path: file.path,
        content: file.content,
        language: langConfig?.id || 'javascript',
        fileId: file.id
      });
    }
  },
}));
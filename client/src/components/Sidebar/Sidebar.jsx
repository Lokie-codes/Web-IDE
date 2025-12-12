import React, { useEffect, useState } from 'react';
import {
  Files, Search, GitBranch, Bug, Puzzle,
  Settings, ChevronDown, FileCode, Plus
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import ProjectFileTree from './ProjectFileTree';

const Sidebar = () => {
  const { theme, mode, currentProject, projectFiles, setProjectFiles } = useEditorStore();
  const isDark = theme === 'vs-dark';

  return (
    <div className={`flex h-full w-full rounded-xl overflow-hidden ${isDark ? 'bg-[#252526]' : 'bg-gray-50'}`}>
      {/* Activity Bar */}
      <div className={`w-12 flex flex-col items-center py-3 border-r
        ${isDark ? 'bg-[#333333] border-[#3c3c3c]' : 'bg-gray-200 border-gray-300'}`}>
        <ActivityIcon icon={<Files size={24} />} active isDark={isDark} tooltip="Explorer" />
        <ActivityIcon icon={<Search size={24} />} isDark={isDark} tooltip="Search" />
        <ActivityIcon icon={<GitBranch size={24} />} isDark={isDark} tooltip="Source Control" />
        <ActivityIcon icon={<Bug size={24} />} isDark={isDark} tooltip="Run & Debug" />
        <ActivityIcon icon={<Puzzle size={24} />} isDark={isDark} tooltip="Extensions" />
        <div className="flex-1" />
        <ActivityIcon icon={<Settings size={24} />} isDark={isDark} tooltip="Settings" />
      </div>

      {/* Explorer Panel */}
      <div className={`w-64 flex flex-col
        ${isDark ? 'bg-[#252526]' : 'bg-gray-50'}`}>
        <div className={`px-4 py-3 text-xs font-bold uppercase tracking-wider
          ${isDark ? 'text-[#cccccc]' : 'text-gray-600'}`}>
          Explorer
        </div>

        {mode === 'single' ? (
          <SingleFileExplorer isDark={isDark} />
        ) : (
          <ProjectExplorer isDark={isDark} />
        )}
      </div>
    </div>
  );
};

const ActivityIcon = ({ icon, active, isDark, tooltip }) => (
  <button
    title={tooltip}
    className={`w-12 h-12 flex items-center justify-center transition-all mb-1 relative
      ${active
        ? (isDark ? 'text-white bg-[#37373d]' : 'text-blue-600 bg-gray-300')
        : (isDark ? 'text-[#858585] hover:text-white' : 'text-gray-500 hover:text-gray-800')
      }`}
  >
    {icon}
    {active && <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 ${isDark ? 'bg-white' : 'bg-blue-600'}`} />}
  </button>
);

const SingleFileExplorer = ({ isDark }) => {
  const { tabs } = useEditorStore();

  return (
    <div className="px-2 py-2">
      <div className={`flex items-center gap-1 px-2 py-2 text-xs font-semibold uppercase
        ${isDark ? 'text-[#cccccc]' : 'text-gray-700'}`}>
        <ChevronDown size={16} />
        <span>OPEN EDITORS</span>
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md mx-2 my-1 transition-colors
            ${isDark
              ? 'hover:bg-[#2a2d2e] text-[#cccccc]'
              : 'hover:bg-gray-200 text-gray-800'
            }
            ${tab.active ? (isDark ? 'bg-[#37373d]' : 'bg-gray-200') : ''}`}
        >
          <FileCode size={16} className="text-[#dcdcaa]" />
          <span className="text-sm">{tab.name}</span>
        </div>
      ))}
    </div>
  );
};

const ProjectExplorer = ({ isDark }) => {
  const { currentProject, projectFiles, setProjectFiles, setCurrentProject } = useEditorStore();
  const [showNewFileModal, setShowNewFileModal] = useState(false);

  useEffect(() => {
    // Load or create a project
    loadProject();
  }, []);

  const loadProject = async () => {
    try {
      // Try to load existing project or create new one
      const response = await fetch('http://localhost:3001/api/projects');
      const result = await response.json();

      if (result.success && result.projects.length > 0) {
        // Load first project
        const projectId = result.projects[0].id;
        const projectResponse = await fetch(`http://localhost:3001/api/projects/${projectId}`);
        const projectResult = await projectResponse.json();

        if (projectResult.success) {
          setCurrentProject(projectResult.project);
          setProjectFiles(projectResult.project.files);
        }
      } else {
        // Create new project
        const createResponse = await fetch('http://localhost:3001/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'My Project',
            description: 'A new CodeForge project'
          })
        });
        const createResult = await createResponse.json();

        if (createResult.success) {
          loadProject(); // Reload
        }
      }
    } catch (error) {
      console.error('Error loading project:', error);
    }
  };

  const handleCreateFile = async (fileName) => {
    if (!currentProject) return;

    try {
      const response = await fetch(`http://localhost:3001/api/projects/${currentProject.id}/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `src/${fileName}`,
          content: '',
          isFolder: false,
          parentPath: 'src'
        })
      });

      const result = await response.json();
      if (result.success) {
        loadProject(); // Reload project
      }
    } catch (error) {
      console.error('Error creating file:', error);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!currentProject || !confirm('Delete this file?')) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/projects/${currentProject.id}/files/${fileId}`,
        { method: 'DELETE' }
      );

      const result = await response.json();
      if (result.success) {
        loadProject(); // Reload project
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  if (!currentProject) {
    return (
      <div className={`flex items-center justify-center h-32 text-sm
        ${isDark ? 'text-[#858585]' : 'text-gray-500'}`}>
        Loading project...
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className={`flex items-center justify-between px-2 py-2 text-xs font-semibold uppercase
        ${isDark ? 'text-[#cccccc]' : 'text-gray-700'}`}>
        <div className="flex items-center gap-1">
          <ChevronDown size={16} />
          <span>{currentProject.name}</span>
        </div>
        <button
          onClick={() => {
            const fileName = prompt('Enter file name (e.g., app.js):');
            if (fileName) handleCreateFile(fileName);
          }}
          className={`p-1 rounded transition-colors
            ${isDark ? 'hover:bg-[#37373d]' : 'hover:bg-gray-200'}`}
          title="New File"
        >
          <Plus size={14} />
        </button>
      </div>

      <ProjectFileTree
        files={projectFiles}
        projectId={currentProject.id}
        onCreateFile={handleCreateFile}
        onDeleteFile={handleDeleteFile}
        isDark={isDark}
      />
    </div>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import { 
  ChevronRight, ChevronDown, File, Folder, 
  FolderOpen, Plus, Trash2 
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

const ProjectFileTree = ({ files, projectId, onCreateFile, onDeleteFile, isDark }) => {
  const { loadProjectFile } = useEditorStore();
  const [expandedFolders, setExpandedFolders] = useState(new Set(['src']));

  const toggleFolder = (path) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const buildTree = (files) => {
    const tree = {};
    
    files.forEach(file => {
      const parts = file.path.split('/');
      let current = tree;
      
      parts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = {
            name: part,
            path: parts.slice(0, index + 1).join('/'),
            isFolder: index < parts.length - 1 || file.is_folder,
            file: file,
            children: {}
          };
        }
        current = current[part].children;
      });
    });
    
    return tree;
  };

  const renderTree = (nodes, level = 0) => {
    return Object.values(nodes).map((node) => {
      const isExpanded = expandedFolders.has(node.path);
      const hasChildren = Object.keys(node.children).length > 0;

      return (
        <div key={node.path}>
          <div
            className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-sm group
              ${isDark ? 'hover:bg-[#2a2d2e] text-[#cccccc]' : 'hover:bg-gray-200 text-gray-800'}`}
            style={{ paddingLeft: `${8 + level * 16}px` }}
            onClick={() => {
              if (node.isFolder) {
                toggleFolder(node.path);
              } else {
                loadProjectFile(node.file);
              }
            }}
          >
            {node.isFolder ? (
              <>
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                {isExpanded ? (
                  <FolderOpen size={16} className="text-[#dcdcaa]" />
                ) : (
                  <Folder size={16} className="text-[#dcdcaa]" />
                )}
              </>
            ) : (
              <>
                <span className="w-3.5" />
                <File size={16} className="text-[#519aba]" />
              </>
            )}
            <span className="text-sm flex-1">{node.name}</span>
            
            {!node.isFolder && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFile(node.file.id);
                }}
                className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity
                  ${isDark ? 'hover:bg-[#37373d]' : 'hover:bg-gray-300'}`}
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>

          {node.isFolder && isExpanded && hasChildren && (
            <div>{renderTree(node.children, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  const tree = buildTree(files);

  return (
    <div className="py-2">
      {renderTree(tree)}
    </div>
  );
};

export default ProjectFileTree;

import express from 'express';
import { nanoid } from 'nanoid';
import archiver from 'archiver';
import db from '../db/database.js';

const router = express.Router();

/**
 * POST /api/projects
 * Create a new project
 */
router.post('/', (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Project name is required'
      });
    }

    const id = nanoid(10);

    const stmt = db.prepare(`
      INSERT INTO projects (id, name, description)
      VALUES (?, ?, ?)
    `);

    stmt.run(id, name, description || '');

    // Create default files
    const fileStmt = db.prepare(`
      INSERT INTO project_files (id, project_id, path, content, is_folder, parent_path)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const defaultFiles = [
      { path: 'src', isFolder: true, content: null, parent: null },
      { path: 'src/index.js', isFolder: false, content: '// Start coding here\nconsole.log("Hello, World!");', parent: 'src' },
      { path: 'README.md', isFolder: false, content: `# ${name}\n\n${description || 'A new project'}`, parent: null },
    ];

    defaultFiles.forEach(file => {
      fileStmt.run(nanoid(10), id, file.path, file.content, file.isFolder ? 1 : 0, file.parent);
    });

    res.json({
      success: true,
      project: { id, name, description }
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create project'
    });
  }
});

/**
 * GET /api/projects/:id
 * Get project with all files
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const projectStmt = db.prepare('SELECT * FROM projects WHERE id = ?');
    const project = projectStmt.get(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const filesStmt = db.prepare(`
      SELECT * FROM project_files 
      WHERE project_id = ? 
      ORDER BY is_folder DESC, path ASC
    `);
    const files = filesStmt.all(id);

    res.json({
      success: true,
      project: {
        ...project,
        files
      }
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project'
    });
  }
});

/**
 * POST /api/projects/:id/files
 * Create a new file or folder
 */
router.post('/:id/files', (req, res) => {
  try {
    const { id } = req.params;
    const { path, content, isFolder, parentPath } = req.body;

    if (!path) {
      return res.status(400).json({
        success: false,
        error: 'File path is required'
      });
    }

    const fileId = nanoid(10);

    const stmt = db.prepare(`
      INSERT INTO project_files (id, project_id, path, content, is_folder, parent_path)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(fileId, id, path, content || '', isFolder ? 1 : 0, parentPath || null);

    // Update project timestamp
    const updateStmt = db.prepare(`
      UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `);
    updateStmt.run(id);

    res.json({
      success: true,
      file: {
        id: fileId,
        path,
        content: content || '',
        isFolder: !!isFolder
      }
    });
  } catch (error) {
    console.error('Error creating file:', error);
    
    if (error.message.includes('UNIQUE constraint')) {
      return res.status(400).json({
        success: false,
        error: 'File or folder already exists at this path'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create file'
    });
  }
});

/**
 * PUT /api/projects/:projectId/files/:fileId
 * Update file content
 */
router.put('/:projectId/files/:fileId', (req, res) => {
  try {
    const { projectId, fileId } = req.params;
    const { content, path } = req.body;

    const stmt = db.prepare(`
      UPDATE project_files 
      SET content = ?, path = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND project_id = ?
    `);

    const result = stmt.run(content, path || null, fileId, projectId);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // Update project timestamp
    const updateStmt = db.prepare(`
      UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `);
    updateStmt.run(projectId);

    res.json({
      success: true,
      message: 'File updated successfully'
    });
  } catch (error) {
    console.error('Error updating file:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update file'
    });
  }
});

/**
 * DELETE /api/projects/:projectId/files/:fileId
 * Delete file or folder
 */
router.delete('/:projectId/files/:fileId', (req, res) => {
  try {
    const { projectId, fileId } = req.params;

    // Get file path to delete children if it's a folder
    const fileStmt = db.prepare(`
      SELECT path, is_folder FROM project_files 
      WHERE id = ? AND project_id = ?
    `);
    const file = fileStmt.get(fileId, projectId);

    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // Delete the file/folder
    const deleteStmt = db.prepare(`
      DELETE FROM project_files WHERE id = ? AND project_id = ?
    `);
    deleteStmt.run(fileId, projectId);

    // If it's a folder, delete all children
    if (file.is_folder) {
      const deleteChildrenStmt = db.prepare(`
        DELETE FROM project_files 
        WHERE project_id = ? AND (path LIKE ? OR parent_path LIKE ?)
      `);
      deleteChildrenStmt.run(projectId, `${file.path}/%`, `${file.path}%`);
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete file'
    });
  }
});

/**
 * GET /api/projects/:id/download
 * Download project as ZIP
 */
router.get('/:id/download', (req, res) => {
  try {
    const { id } = req.params;

    const projectStmt = db.prepare('SELECT * FROM projects WHERE id = ?');
    const project = projectStmt.get(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const filesStmt = db.prepare(`
      SELECT * FROM project_files 
      WHERE project_id = ? AND is_folder = 0
      ORDER BY path ASC
    `);
    const files = filesStmt.all(id);

    // Create ZIP
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    res.attachment(`${project.name}.zip`);
    archive.pipe(res);

    // Add files to ZIP
    files.forEach(file => {
      archive.append(file.content || '', { name: file.path });
    });

    archive.finalize();
  } catch (error) {
    console.error('Error downloading project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to download project'
    });
  }
});

/**
 * GET /api/projects
 * List all projects
 */
router.get('/', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const stmt = db.prepare(`
      SELECT id, name, description, created_at, updated_at
      FROM projects 
      ORDER BY updated_at DESC 
      LIMIT ?
    `);

    const projects = stmt.all(limit);

    res.json({
      success: true,
      projects
    });
  } catch (error) {
    console.error('Error listing projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list projects'
    });
  }
});

export default router;

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create data directory if it doesn't exist
const dataDir = join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = join(dataDir, 'codeforge.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
const initDB = () => {
    // Gists table
    db.exec(`
    CREATE TABLE IF NOT EXISTS gists (
      id TEXT PRIMARY KEY,
      title TEXT,
      language TEXT NOT NULL,
      code TEXT NOT NULL,
      theme TEXT DEFAULT 'vs-dark',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      view_count INTEGER DEFAULT 0
    )
  `);

    // Projects table
    db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Project files table
    db.exec(`
    CREATE TABLE IF NOT EXISTS project_files (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      path TEXT NOT NULL,
      content TEXT,
      is_folder INTEGER DEFAULT 0,
      parent_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      UNIQUE(project_id, path)
    )
  `);

    // Create index for faster queries
    db.exec(`
    CREATE INDEX IF NOT EXISTS idx_project_files_project_id 
    ON project_files(project_id)
  `);

    db.exec(`
    CREATE INDEX IF NOT EXISTS idx_project_files_parent_path 
    ON project_files(project_id, parent_path)
  `);

    console.log('✅ Database initialized');
};

initDB();

export default db;

import express from 'express';
import { nanoid } from 'nanoid';
import db from '../db/database.js';

const router = express.Router();

/**
 * POST /api/gists
 * Create a new gist
 */
router.post('/', (req, res) => {
  try {
    const { title, language, code, theme } = req.body;

    if (!language || !code) {
      return res.status(400).json({
        success: false,
        error: 'Language and code are required'
      });
    }

    const id = nanoid(10); // Generate short unique ID
    const gistTitle = title || 'Untitled';

    const stmt = db.prepare(`
      INSERT INTO gists (id, title, language, code, theme)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, gistTitle, language, code, theme || 'vs-dark');

    res.json({
      success: true,
      gist: {
        id,
        title: gistTitle,
        language,
        code,
        theme: theme || 'vs-dark',
        url: `/gist/${id}`
      }
    });
  } catch (error) {
    console.error('Error creating gist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create gist'
    });
  }
});

/**
 * GET /api/gists/:id
 * Get a gist by ID
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const stmt = db.prepare(`
      SELECT * FROM gists WHERE id = ?
    `);

    const gist = stmt.get(id);

    if (!gist) {
      return res.status(404).json({
        success: false,
        error: 'Gist not found'
      });
    }

    // Increment view count
    const updateStmt = db.prepare(`
      UPDATE gists SET view_count = view_count + 1 WHERE id = ?
    `);
    updateStmt.run(id);

    res.json({
      success: true,
      gist
    });
  } catch (error) {
    console.error('Error fetching gist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch gist'
    });
  }
});

/**
 * PUT /api/gists/:id
 * Update a gist
 */
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, code, language, theme } = req.body;

    const stmt = db.prepare(`
      UPDATE gists 
      SET title = ?, code = ?, language = ?, theme = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const result = stmt.run(title, code, language, theme, id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Gist not found'
      });
    }

    res.json({
      success: true,
      message: 'Gist updated successfully'
    });
  } catch (error) {
    console.error('Error updating gist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update gist'
    });
  }
});

/**
 * GET /api/gists
 * List recent gists
 */
router.get('/', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const stmt = db.prepare(`
      SELECT id, title, language, theme, created_at, view_count
      FROM gists 
      ORDER BY created_at DESC 
      LIMIT ?
    `);

    const gists = stmt.all(limit);

    res.json({
      success: true,
      gists
    });
  } catch (error) {
    console.error('Error listing gists:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list gists'
    });
  }
});

export default router;
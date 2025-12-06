import express from 'express';
import pistonService from '../services/pistonService.js';

const router = express.Router();

/**
 * POST /api/execute
 * Execute code using Piston
 */
router.post('/', async (req, res) => {
  try {
    const { language, code, stdin, args } = req.body;

    // Validation
    if (!language || !code) {
      return res.status(400).json({
        success: false,
        error: 'Language and code are required'
      });
    }

    // Get appropriate version for the language
    const version = pistonService.getLanguageVersion(language);

    // Execute code
    const result = await pistonService.executeCode({
      language,
      version,
      code,
      stdin: stdin || '',
      args: args || []
    });

    res.json(result);
  } catch (error) {
    console.error('Execution error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during code execution',
      stdout: '',
      stderr: error.message
    });
  }
});

/**
 * GET /api/execute/runtimes
 * Get available language runtimes
 */
router.get('/runtimes', async (req, res) => {
  try {
    const runtimes = await pistonService.getRuntimes();
    res.json({
      success: true,
      runtimes
    });
  } catch (error) {
    console.error('Error fetching runtimes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available runtimes'
    });
  }
});

export default router;

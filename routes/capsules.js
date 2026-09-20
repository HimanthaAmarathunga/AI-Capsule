const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// All routes below are protected by JWT middleware
router.use(authenticateToken);

// READ - GET /api/capsules
router.get('/', (req, res) => {
  try {
    const capsules = db.prepare(
      'SELECT * FROM capsules WHERE user_id = ? ORDER BY created_at DESC'
    ).all(req.user.user_id);
    res.json(capsules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch capsules' });
  }
});

// CREATE - POST /api/capsules
router.post('/', (req, res) => {
  const {
    project_name, prompt_title, prompt_version, prompt_text,
    response_summary, category, usefulness, reviewed,
    improved, screenshot_url, notes
  } = req.body;

  if (!project_name || !prompt_title || !prompt_text) {
    return res.status(400).json({ error: 'project_name, prompt_title, and prompt_text are required' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO capsules
        (user_id, project_name, prompt_title, prompt_version, prompt_text,
         response_summary, category, usefulness, reviewed, improved, screenshot_url, notes)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      req.user.user_id,
      project_name,
      prompt_title,
      prompt_version || null,
      prompt_text,
      response_summary || null,
      category || null,
      usefulness || null,
      reviewed ? 1 : 0,
      improved ? 1 : 0,
      screenshot_url || null,
      notes || null
    );

    const newCapsule = db.prepare('SELECT * FROM capsules WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newCapsule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create capsule' });
  }
});

// UPDATE - PUT /api/capsules/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;

  // Verify ownership
  const existing = db.prepare('SELECT * FROM capsules WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Capsule not found' });
  if (existing.user_id !== req.user.user_id) return res.status(403).json({ error: 'Forbidden' });

  const {
    project_name, prompt_title, prompt_version, prompt_text,
    response_summary, category, usefulness, reviewed,
    improved, screenshot_url, notes
  } = req.body;

  try {
    db.prepare(`
      UPDATE capsules SET
        project_name = ?, prompt_title = ?, prompt_version = ?, prompt_text = ?,
        response_summary = ?, category = ?, usefulness = ?, reviewed = ?,
        improved = ?, screenshot_url = ?, notes = ?
      WHERE id = ? AND user_id = ?
    `).run(
      project_name ?? existing.project_name,
      prompt_title ?? existing.prompt_title,
      prompt_version ?? existing.prompt_version,
      prompt_text ?? existing.prompt_text,
      response_summary ?? existing.response_summary,
      category ?? existing.category,
      usefulness ?? existing.usefulness,
      reviewed !== undefined ? (reviewed ? 1 : 0) : existing.reviewed,
      improved !== undefined ? (improved ? 1 : 0) : existing.improved,
      screenshot_url ?? existing.screenshot_url,
      notes ?? existing.notes,
      id,
      req.user.user_id
    );

    const updated = db.prepare('SELECT * FROM capsules WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update capsule' });
  }
});

// DELETE - DELETE /api/capsules/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const existing = db.prepare('SELECT * FROM capsules WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Capsule not found' });
  if (existing.user_id !== req.user.user_id) return res.status(403).json({ error: 'Forbidden' });

  try {
    db.prepare('DELETE FROM capsules WHERE id = ? AND user_id = ?').run(id, req.user.user_id);
    res.json({ message: 'Capsule deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete capsule' });
  }
});

module.exports = router;

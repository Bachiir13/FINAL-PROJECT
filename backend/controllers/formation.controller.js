// controllers/formation.controller.js
const pool = require('../config/db');


// Créer une formation
exports.createFormation = async (req, res) => {
  const { nom, description, image_url } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO formation (nom, description, image_url) VALUES ($1, $2, $3) RETURNING *',
      [nom, description, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    console.error("Erreur createFormation:", e);
    res.status(500).json({ error: e.message });
  }
};

// Récupérer toutes les formations
exports.getFormations = async (_, res) => {
  try {
    const result = await pool.query('SELECT * FROM formation ORDER BY id DESC');
    res.json(result.rows);
  } catch (e) {
    console.error("Erreur getFormations:", e);
    res.status(500).json({ error: e.message });
  }
};

// Récupérer une formation par ID
exports.getFormationById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM formation WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Formation non trouvée' });
    }
    res.json(result.rows[0]);
  } catch (e) {
    console.error("Erreur getFormationById:", e);
    res.status(500).json({ error: e.message });
  }
};

// Modifier une formation
exports.updateFormation = async (req, res) => {
  const id = req.params.id;
  const { nom, description, image_url } = req.body;

  try {
    const result = await pool.query(
      `UPDATE formation 
       SET nom = $1, description = $2, image_url = $3
       WHERE id = $4
       RETURNING *`,
      [nom, description, image_url, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Formation non trouvée' });
    }

    res.json(result.rows[0]);
  } catch (e) {
    console.error("Erreur updateFormation:", e);
    res.status(500).json({ error: e.message });
  }
};

// Supprimer une formation
exports.deleteFormation = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      'DELETE FROM formation WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Formation non trouvée' });
    }

    res.json({ message: 'Formation supprimée avec succès', deleted: result.rows[0] });
  } catch (e) {
    console.error("Erreur deleteFormation:", e);
    res.status(500).json({ error: e.message });
  }
};

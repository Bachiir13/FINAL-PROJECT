const pool = require('../config/db');

// Créer un cours
exports.createCours = async (req, res) => {
  const { titre, description, user_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO cours (titre, description, user_id) VALUES ($1, $2, $3) RETURNING *',
      [titre, description, user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    console.error("Erreur création cours:", e);
    res.status(500).json({ error: e.message });
  }
};

// Récupérer tous les cours
exports.getCours = async (_, res) => {
  try {
    const result = await pool.query('SELECT * FROM cours ORDER BY id DESC');
    res.json(result.rows);
  } catch (e) {
    console.error("Erreur récupération cours:", e);
    res.status(500).json({ error: e.message });
  }
};

// Récupérer les cours d’un enseignant spécifique
exports.getCoursByEnseignant = async (req, res) => {
  const user_id = req.params.user_id;
  try {
    const result = await pool.query(
      'SELECT * FROM cours WHERE user_id = $1 ORDER BY id DESC',
      [user_id]
    );
    res.json(result.rows);
  } catch (e) {
    console.error("Erreur récupération cours enseignant:", e);
    res.status(500).json({ error: e.message });
  }
};

// Modifier un cours par ID
exports.updateCours = async (req, res) => {
  const id = req.params.id;
  const { titre, description, user_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE cours
       SET titre = $1, description = $2, user_id = $3
       WHERE id = $4
       RETURNING *`,
      [titre, description, user_id, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }

    res.json(result.rows[0]);
  } catch (e) {
    console.error("Erreur mise à jour cours:", e);
    res.status(500).json({ error: e.message });
  }
};

// Supprimer un cours par ID
exports.deleteCours = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      'DELETE FROM cours WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }

    res.json({ message: 'Cours supprimé avec succès', deleted: result.rows[0] });
  } catch (e) {
    console.error("Erreur suppression cours:", e);
    res.status(500).json({ error: e.message });
  }
};

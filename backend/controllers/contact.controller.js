const pool = require('../config/db');

// Ajouter un message
exports.envoyerMessage = async (req, res) => {
  const { nom, email, message } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO contact (nom, email, message) VALUES ($1, $2, $3) RETURNING *',
      [nom, email, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Récupérer tous les messages
exports.getMessages = async (_, res) => {
  try {
    const result = await pool.query('SELECT * FROM contact ORDER BY date_envoi DESC');
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Supprimer un message par id
exports.supprimerMessage = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('DELETE FROM contact WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }
    res.json({ message: 'Message supprimé avec succès', deleted: result.rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Modifier un message par id
exports.modifierMessage = async (req, res) => {
  const id = req.params.id;
  const { nom, email, message } = req.body;

  try {
    const result = await pool.query(
      `UPDATE contact 
       SET nom = $1, email = $2, message = $3, date_envoi = now()
       WHERE id = $4 
       RETURNING *`,
      [nom, email, message, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

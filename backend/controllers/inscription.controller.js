const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inscription_cours');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inscription_cours WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inscription non trouvée' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Nouvelle fonction pour récupérer les inscriptions d'un élève
exports.getInscriptionsByEleve = async (req, res) => {
  const { eleveId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM inscription_cours WHERE eleve_id = $1',
      [eleveId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getElevesByCours = async (req, res) => {
  const { coursId } = req.params;
  try {
    const result = await pool.query(
      `SELECT u.id, u.prenom, u.nom, u.email
       FROM inscription_cours ic
       JOIN "user" u ON ic.eleve_id = u.id
       WHERE ic.cours_id = $1`,
      [coursId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.create = async (req, res) => {
  const { eleve_id, cours_id } = req.body;

  try {
    const exists = await pool.query(
      'SELECT * FROM inscription_cours WHERE eleve_id = $1 AND cours_id = $2',
      [eleve_id, cours_id]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ error: 'L\'élève est déjà inscrit à ce cours.' });
    }

    const result = await pool.query(
      'INSERT INTO inscription_cours (eleve_id, cours_id) VALUES ($1, $2) RETURNING *',
      [eleve_id, cours_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: 'Erreur lors de l\'inscription.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM inscription_cours WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inscription non trouvée' });
    }
    res.json({ message: 'Inscription supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

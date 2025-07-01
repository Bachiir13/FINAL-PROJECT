const pool = require('../config/db');

// Créer une actualité
exports.createActualite = async (req, res) => {
  const { titre, contenu, auteur_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO actualite (titre, contenu, auteur_id) VALUES ($1, $2, $3) RETURNING *',
      [titre, contenu, auteur_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Récupérer toutes les actualités
exports.getActualites = async (_, res) => {
  try {
    const result = await pool.query('SELECT * FROM actualite ORDER BY id DESC');
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Modifier une actualité
exports.updateActualite = async (req, res) => {
  const id = req.params.id;
  const { titre, contenu, auteur_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE actualite 
       SET titre = $1, contenu = $2, auteur_id = $3 
       WHERE id = $4 
       RETURNING *`,
      [titre, contenu, auteur_id, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Actualité non trouvée' });
    }

    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Supprimer une actualité
exports.deleteActualite = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      'DELETE FROM actualite WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Actualité non trouvée' });
    }

    res.json({ message: 'Actualité supprimée avec succès', deleted: result.rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

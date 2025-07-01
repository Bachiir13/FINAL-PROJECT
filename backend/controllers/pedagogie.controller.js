const pool = require('../config/db');

// Créer une nouvelle pédagogie
exports.createPedagogie = async (req, res) => {
  const { titre, description, fichier_url, auteur_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO pedagogie (titre, description, fichier_url, auteur_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [titre, description, fichier_url, auteur_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Récupérer toutes les pédagogies
exports.getPedagogies = async (_, res) => {
  try {
    const result = await pool.query('SELECT * FROM pedagogie ORDER BY id DESC');
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Modifier une pédagogie par id
exports.updatePedagogie = async (req, res) => {
  const id = req.params.id;
  const { titre, description, fichier_url, auteur_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE pedagogie
       SET titre = $1, description = $2, fichier_url = $3, auteur_id = $4
       WHERE id = $5
       RETURNING *`,
      [titre, description, fichier_url, auteur_id, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Pédagogie non trouvée' });
    }

    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Supprimer une pédagogie par id
exports.deletePedagogie = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      'DELETE FROM pedagogie WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Pédagogie non trouvée' });
    }

    res.json({ message: 'Pédagogie supprimée avec succès', deleted: result.rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

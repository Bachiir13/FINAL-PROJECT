const pool = require('../config/db');

// Récupérer tous les témoignages
exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM temoignages');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer un témoignage par id
exports.getById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM temoignages WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Témoignage non trouvé' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer un témoignage
exports.create = async (req, res) => {
  const { nom, promo, message, photo_url } = req.body;

  if (!nom || !message) {
    return res.status(400).json({ error: 'Le nom et le message sont requis' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO temoignages (nom, promo, message, photo_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [nom, promo, message, photo_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Mettre à jour un témoignage
exports.update = async (req, res) => {
  const { nom, promo, message, photo_url } = req.body;

  try {
    const result = await pool.query('SELECT * FROM temoignages WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Témoignage non trouvé' });

    const current = result.rows[0];

    const updated = await pool.query(
      `UPDATE temoignages 
       SET nom = $1, promo = $2, message = $3, photo_url = $4 
       WHERE id = $5 RETURNING *`,
      [
        nom ?? current.nom,
        promo ?? current.promo,
        message ?? current.message,
        photo_url ?? current.photo_url,
        req.params.id
      ]
    );

    res.json(updated.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Supprimer un témoignage
exports.delete = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM temoignages WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Témoignage non trouvé' });
    res.json({ message: 'Témoignage supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

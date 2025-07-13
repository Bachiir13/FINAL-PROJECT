const pool = require('../config/db');

const BASE_URL = process.env.SERVER_URL || "http://localhost:3001";

exports.createCours = async (req, res) => {
  console.log("Body reçu :", req.body);
  console.log("Fichier reçu :", req.file);

  if (!req.body) {
    return res.status(400).json({ error: "Le corps de la requête est manquant" });
  }

  const { titre, description, user_id } = req.body;

  if (!titre || !description || !user_id) {
    return res.status(400).json({ error: "Champs titre, description, user_id sont requis" });
  }

  const fichier = req.file ? req.file.filename : null;

  try {
    const result = await pool.query(
      `INSERT INTO cours (titre, description, user_id, fichier) VALUES ($1, $2, $3, $4) RETURNING *`,
      [titre, description, user_id, fichier]
    );

    const cours = result.rows[0];
    cours.fichier_url = fichier ? `${BASE_URL}/uploads/${fichier}` : null;

    res.status(201).json(cours);
  } catch (e) {
    console.error("Erreur création cours:", e);
    res.status(500).json({ error: e.message });
  }
};

exports.getCours = async (_, res) => {
  try {
    const result = await pool.query('SELECT * FROM cours ORDER BY id DESC');

    const coursAvecUrl = result.rows.map(cours => {
      return {
        ...cours,
        fichier_url: cours.fichier ? `${BASE_URL}/uploads/${cours.fichier}` : null
      };
    });

    res.json(coursAvecUrl);
  } catch (e) {
    console.error("Erreur récupération cours:", e);
    res.status(500).json({ error: e.message });
  }
};

exports.getCoursByEnseignant = async (req, res) => {
  const user_id = req.params.user_id;
  try {
    const result = await pool.query(
      'SELECT * FROM cours WHERE user_id = $1 ORDER BY id DESC',
      [user_id]
    );

    const coursAvecUrl = result.rows.map(cours => {
      return {
        ...cours,
        fichier_url: cours.fichier ? `${BASE_URL}/uploads/${cours.fichier}` : null
      };
    });

    res.json(coursAvecUrl);
  } catch (e) {
    console.error("Erreur récupération cours enseignant:", e);
    res.status(500).json({ error: e.message });
  }
};

exports.updateCours = async (req, res) => {
  const id = req.params.id;

  if (!req.body) {
    return res.status(400).json({ error: "Le corps de la requête est manquant" });
  }

  const { titre, description, user_id } = req.body;

  if (!titre || !description || !user_id) {
    return res.status(400).json({ error: "Champs titre, description, user_id sont requis" });
  }

  try {
    const result = await pool.query(
      `UPDATE cours SET titre = $1, description = $2, user_id = $3 WHERE id = $4 RETURNING *`,
      [titre, description, user_id, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }

    const cours = result.rows[0];
    cours.fichier_url = cours.fichier ? `${BASE_URL}/uploads/${cours.fichier}` : null;

    res.json(cours);
  } catch (e) {
    console.error("Erreur mise à jour cours:", e);
    res.status(500).json({ error: e.message });
  }
};

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

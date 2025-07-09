const pool = require('../config/db');

// Créer une inscription
exports.createInscription = async (req, res) => {
  const { formation_id, visiteur_id } = req.body;

  try {
    // Vérifie si l'utilisateur existe et est un visiteur
    const userCheck = await pool.query(
      `SELECT id, role FROM "user" WHERE id = $1`,
      [visiteur_id]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    if (userCheck.rows[0].role !== 'visiteur') {
      return res.status(400).json({ error: "Seuls les visiteurs peuvent s'inscrire à une formation." });
    }

    // Insertion dans la table inscriptionformation
    const result = await pool.query(
      `INSERT INTO inscriptionformation (formation_id, visiteur_id)
       VALUES ($1, $2) RETURNING *`,
      [formation_id, visiteur_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (e) {
    console.error('Erreur createInscription:', e);
    res.status(500).json({ error: e.message });
  }
};

// Récupérer toutes les inscriptions
exports.getInscriptions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.*, f.nom AS formation_nom, u.nom AS visiteur_nom, u.prenom AS visiteur_prenom
      FROM inscriptionformation i
      JOIN formation f ON i.formation_id = f.id
      JOIN "user" u ON i.visiteur_id = u.id
      ORDER BY i.id DESC
    `);
    res.json(result.rows);
  } catch (e) {
    console.error('Erreur getInscriptions:', e);
    res.status(500).json({ error: e.message });
  }
};

// Récupérer une inscription par ID
exports.getInscriptionById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      `SELECT * FROM inscriptionformation WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inscription non trouvée' });
    }
    res.json(result.rows[0]);
  } catch (e) {
    console.error('Erreur getInscriptionById:', e);
    res.status(500).json({ error: e.message });
  }
};

// Supprimer une inscription
exports.deleteInscription = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      `DELETE FROM inscriptionformation WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Inscription non trouvée' });
    }
    res.json({ message: 'Inscription supprimée avec succès', deleted: result.rows[0] });
  } catch (e) {
    console.error('Erreur deleteInscription:', e);
    res.status(500).json({ error: e.message });
  }
};

const pool = require('../config/db');

// Créer une nouvelle note
exports.createNote = async (req, res) => {
  const { eleve_id, enseignant_id, valeur, max_note, commentaire, matiere } = req.body;

  if (!eleve_id || !enseignant_id || valeur == null || !max_note || !matiere) {
    return res.status(400).json({ error: "eleve_id, enseignant_id, valeur, max_note et matiere sont requis." });
  }

  if (![10, 20].includes(max_note)) {
    return res.status(400).json({ error: "max_note doit être 10 ou 20." });
  }

  if (valeur < 0 || valeur > max_note) {
    return res.status(400).json({ error: `valeur doit être entre 0 et ${max_note}.` });
  }

  try {
    const result = await pool.query(
      `INSERT INTO note (eleve_id, enseignant_id, valeur, max_note, commentaire, matiere)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [eleve_id, enseignant_id, valeur, max_note, commentaire, matiere]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erreur création note:", error);
    res.status(500).json({ error: "Erreur serveur lors de la création de la note." });
  }
};

// Récupérer toutes les notes
exports.getAllNotes = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM note ORDER BY date_note DESC`);
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur récupération notes:", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des notes." });
  }
};

// Récupérer les notes d'un élève
exports.getNotesByEleve = async (req, res) => {
  const { eleve_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM note WHERE eleve_id = $1 ORDER BY date_note DESC`,
      [eleve_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Erreur récupération notes élève:", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des notes." });
  }
};

// Modifier une note
exports.updateNote = async (req, res) => {
  const { id } = req.params;
  const { valeur, max_note, commentaire, matiere } = req.body;

  if (valeur == null || !max_note || !matiere) {
    return res.status(400).json({ error: "valeur, max_note et matiere sont requis." });
  }

  if (![10, 20].includes(max_note)) {
    return res.status(400).json({ error: "max_note doit être 10 ou 20." });
  }

  if (valeur < 0 || valeur > max_note) {
    return res.status(400).json({ error: `valeur doit être entre 0 et ${max_note}.` });
  }

  try {
    const result = await pool.query(
      `UPDATE note SET valeur = $1, max_note = $2, commentaire = $3, matiere = $4
       WHERE id = $5
       RETURNING *`,
      [valeur, max_note, commentaire, matiere, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Note non trouvée." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erreur mise à jour note:", error);
    res.status(500).json({ error: "Erreur serveur lors de la mise à jour de la note." });
  }
};

// Supprimer une note
exports.deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM note WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Note non trouvée." });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Erreur suppression note:", error);
    res.status(500).json({ error: "Erreur serveur lors de la suppression de la note." });
  }
};

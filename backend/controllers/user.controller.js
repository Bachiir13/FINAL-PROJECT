// src/controllers/user.controller.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');

// ✅ Créer un utilisateur
exports.createUser = async (req, res) => {
  const {
    nom,
    prenom,
    email,
    mot_de_passe,
    role = 'visiteur'
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    const result = await pool.query(
      `INSERT INTO "user" (nom, prenom, email, mot_de_passe, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nom, prenom, email, hashedPassword, role]
    );

    res.status(201).json(result.rows[0]);
  } catch (e) {
    if (e.code === '23505') {
      return res.status(400).json({ error: 'Email déjà utilisé.' });
    }
    res.status(500).json({ error: e.message });
  }
};

// ✅ Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "user"');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Rechercher un utilisateur par email
exports.getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, nom, prenom, email, role
       FROM "user"
       WHERE LOWER(email) = LOWER($1)`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Modifier un utilisateur
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, email, role } = req.body;

  try {
    const result = await pool.query(
      `UPDATE "user"
       SET nom = $1, prenom = $2, email = $3, role = $4
       WHERE id = $5
       RETURNING *`,
      [nom, prenom, email, role, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(`DELETE FROM "user" WHERE id = $1`, [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Création utilisateur (inscription)
exports.createUser = async (req, res) => {
  const { nom, prenom, email, mot_de_passe, role = 'visiteur' } = req.body;

  if (!nom || !prenom || !email || !mot_de_passe) {
    return res.status(400).json({ error: "Nom, prénom, email et mot de passe sont requis." });
  }

  try {
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    const result = await pool.query(
      `INSERT INTO "user" (nom, prenom, email, mot_de_passe, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nom, prenom, email, role`,
      [nom, prenom, email, hashedPassword, role]
    );

    res.status(201).json(result.rows[0]);
  } catch (e) {
    if (e.code === '23505') {
      // Violation contrainte unique (email déjà utilisé)
      return res.status(400).json({ error: 'Email déjà utilisé.' });
    }
    res.status(500).json({ error: e.message });
  }
};

// Connexion utilisateur
exports.loginUser = async (req, res) => {
  const { email, motDePasse } = req.body;

  if (!email || !motDePasse) {
    return res.status(400).json({ error: "Email et mot de passe sont requis." });
  }

  try {
    const result = await pool.query(
      `SELECT id, nom, prenom, email, mot_de_passe, role
       FROM "user"
       WHERE LOWER(email) = LOWER($1)`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect." });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(motDePasse, user.mot_de_passe);

    if (!match) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect." });
    }

    // Supprimer le mot de passe avant de renvoyer l'objet utilisateur
    delete user.mot_de_passe;

    res.json(user);
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nom, prenom, email, role FROM "user"');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Rechercher utilisateur par email
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

// Modifier utilisateur
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, email, role } = req.body;

  if (!nom || !prenom || !email || !role) {
    return res.status(400).json({ error: "Nom, prénom, email et rôle sont requis." });
  }

  try {
    const result = await pool.query(
      `UPDATE "user"
       SET nom = $1, prenom = $2, email = $3, role = $4
       WHERE id = $5
       RETURNING id, nom, prenom, email, role`,
      [nom, prenom, email, role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email déjà utilisé.' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Supprimer utilisateur
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM "user" WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

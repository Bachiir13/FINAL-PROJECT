const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'votre_clé_secrète';

// Création utilisateur (inscription)
exports.createUser = async (req, res) => {
  const { nom, prenom, email, mot_de_passe, role = 'visiteur', filiere } = req.body;

  if (!nom || !prenom || !email || !mot_de_passe) {
    return res.status(400).json({ error: "Nom, prénom, email et mot de passe sont requis." });
  }

  const allowedFilieres = [
    'Cybersecurité',
    'Reseaux et Systèmes',
    'Développement Web et Mobile',
    'Intelligence Artificielle'
  ];

  if ((role === 'eleve' || role === 'enseignant') && !allowedFilieres.includes(filiere)) {
    return res.status(400).json({ error: "Filière invalide ou manquante pour ce rôle." });
  }

  try {
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    const result = await pool.query(
      `INSERT INTO "user" (nom, prenom, email, mot_de_passe, role, filiere)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, nom, prenom, email, role, filiere`,
      [nom, prenom, email, hashedPassword, role, filiere]
    );

    res.status(201).json(result.rows[0]);
  } catch (e) {
    if (e.code === '23505') {
      return res.status(400).json({ error: 'Email déjà utilisé.' });
    }
    res.status(500).json({ error: 'Erreur serveur. ' + e.message });
  }
};

// Connexion utilisateur (login)
exports.loginUser = async (req, res) => {
  const { email, motDePasse } = req.body;

  if (!email || !motDePasse) {
    return res.status(400).json({ error: "Email et mot de passe sont requis." });
  }

  try {
    const result = await pool.query(
      `SELECT id, nom, prenom, email, mot_de_passe, role, filiere
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

    delete user.mot_de_passe;

    // const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '2h' });
    // res.json({ user, token });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur. ' + error.message });
  }
};

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nom, prenom, email, role, filiere FROM "user"`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur. ' + error.message });
  }
};

// Rechercher utilisateur par email
exports.getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, nom, prenom, email, role, filiere
       FROM "user"
       WHERE LOWER(email) = LOWER($1)`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur. ' + error.message });
  }
};

// Modifier utilisateur
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, email, role, filiere } = req.body;

  if (!nom || !prenom || !email || !role) {
    return res.status(400).json({ error: "Nom, prénom, email et rôle sont requis." });
  }

  if ((role === 'eleve' || role === 'enseignant') && !filiere) {
    return res.status(400).json({ error: "Filière requise pour ce rôle." });
  }

  try {
    const result = await pool.query(
      `UPDATE "user"
       SET nom = $1, prenom = $2, email = $3, role = $4, filiere = $5
       WHERE id = $6
       RETURNING id, nom, prenom, email, role, filiere`,
      [nom, prenom, email, role, filiere, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email déjà utilisé.' });
    }
    res.status(500).json({ error: 'Erreur serveur. ' + error.message });
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
    res.status(500).json({ error: 'Erreur serveur. ' + error.message });
  }
};

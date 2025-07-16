const pool = require('../config/db'); // Import de la configuration de la base de données (pool de connexions PostgreSQL)
const bcrypt = require('bcrypt'); // Import de bcrypt pour hasher les mots de passe
const jwt = require('jsonwebtoken'); // Import de jsonwebtoken pour gérer les tokens JWT (non utilisé dans ce code)

const SECRET_KEY = process.env.JWT_SECRET || 'votre_clé_secrète'; // Clé secrète pour JWT (utilisée si besoin)

// Fonction pour créer un utilisateur (inscription)
exports.createUser = async (req, res) => {
  // Récupération des données envoyées par le client dans le corps de la requête
  const { nom, prenom, email, mot_de_passe, role = 'visiteur', filiere } = req.body;

  // Vérification que nom, prénom, email et mot de passe sont bien fournis
  if (!nom || !prenom || !email || !mot_de_passe) {
    // Si un champ manque, on renvoie une erreur 400 (Bad Request) avec un message
    return res.status(400).json({ error: "Nom, prénom, email et mot de passe sont requis." });
  }

  // Liste des filières autorisées pour certains rôles
  const allowedFilieres = [
    'Cybersecurité',
    'Reseaux et Systèmes',
    'Développement Web et Mobile',
    'Intelligence Artificielle'
  ];

  // Si le rôle est "eleve" ou "enseignant", la filière doit être une valeur valide dans allowedFilieres
  if ((role === 'eleve' || role === 'enseignant') && !allowedFilieres.includes(filiere)) {
    // Sinon, on renvoie une erreur 400 avec message d’erreur
    return res.status(400).json({ error: "Filière invalide ou manquante pour ce rôle." });
  }

  try {
    // Hashage du mot de passe pour sécurité (10 tours de salage)
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    // Insertion dans la base de données (PostgreSQL)
    const result = await pool.query(
      `INSERT INTO "user" (nom, prenom, email, mot_de_passe, role, filiere)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, nom, prenom, email, role, filiere`, // On retourne les infos du nouvel utilisateur
      [nom, prenom, email, hashedPassword, role, filiere]
    );

    // Envoi de la réponse HTTP 201 (Created) avec les données du nouvel utilisateur
    res.status(201).json(result.rows[0]);
  } catch (e) {
    // Gestion d’erreur si l’email existe déjà (code PostgreSQL 23505 = violation contrainte unique)
    if (e.code === '23505') {
      return res.status(400).json({ error: 'Email déjà utilisé.' });
    }
    // Autres erreurs serveur
    res.status(500).json({ error: 'Erreur serveur. ' + e.message });
  }
};

// Fonction pour connecter un utilisateur (login)
exports.loginUser = async (req, res) => {
  // Récupération des données envoyées dans le corps de la requête
  const { email, motDePasse } = req.body;

  // Vérification que l’email et le mot de passe sont fournis
  if (!email || !motDePasse) {
    return res.status(400).json({ error: "Email et mot de passe sont requis." });
  }

  try {
    // Recherche de l’utilisateur dans la base avec email insensible à la casse
    const result = await pool.query(
      `SELECT id, nom, prenom, email, mot_de_passe, role, filiere
       FROM "user"
       WHERE LOWER(email) = LOWER($1)`,
      [email]
    );

    // Si aucun utilisateur trouvé, erreur 401 (Unauthorized)
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect." });
    }

    const user = result.rows[0];

    // Comparaison du mot de passe en clair avec le mot de passe hashé stocké
    const match = await bcrypt.compare(motDePasse, user.mot_de_passe);

    // Si mot de passe ne correspond pas, erreur 401
    if (!match) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect." });
    }

    // Suppression du mot de passe de l’objet user avant de l’envoyer en réponse
    delete user.mot_de_passe;

    // Optionnel: création d’un token JWT (commenté ici)
    // const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '2h' });
    // res.json({ user, token });

    // Renvoi de l’objet utilisateur sans le mot de passe
    res.json({ user });
  } catch (error) {
    // Erreur serveur
    res.status(500).json({ error: 'Erreur serveur. ' + error.message });
  }
};

// Fonction pour récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    // Requête pour récupérer id, nom, prénom, email, rôle et filière de tous les utilisateurs
    const result = await pool.query(
      `SELECT id, nom, prenom, email, role, filiere FROM "user"`
    );
    // Envoi des données au client
    res.json(result.rows);
  } catch (error) {
    // Erreur serveur
    res.status(500).json({ error: 'Erreur serveur. ' + error.message });
  }
};

// Fonction pour rechercher un utilisateur par email (paramètre dans l’URL)
exports.getUserByEmail = async (req, res) => {
  // Récupération de l’email dans les paramètres URL
  const { email } = req.params;

  try {
    // Recherche de l’utilisateur avec email insensible à la casse
    const result = await pool.query(
      `SELECT id, nom, prenom, email, role, filiere
       FROM "user"
       WHERE LOWER(email) = LOWER($1)`,
      [email]
    );

    // Si aucun utilisateur trouvé, renvoi erreur 404
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    // Renvoi des données utilisateur trouvées
    res.json(result.rows[0]);
  } catch (error) {
    // Erreur serveur
    res.status(500).json({ error: 'Erreur serveur. ' + error.message });
  }
};

// Fonction pour modifier un utilisateur (avec id dans les paramètres URL)
exports.updateUser = async (req, res) => {
  // Récupération de l’id utilisateur et des données à modifier dans le corps de la requête
  const { id } = req.params;
  const { nom, prenom, email, role, filiere } = req.body;

  // Vérification des champs obligatoires
  if (!nom || !prenom || !email || !role) {
    return res.status(400).json({ error: "Nom, prénom, email et rôle sont requis." });
  }

  // Si rôle est eleve ou enseignant, la filière est obligatoire
  if ((role === 'eleve' || role === 'enseignant') && !filiere) {
    return res.status(400).json({ error: "Filière requise pour ce rôle." });
  }

  try {
    // Mise à jour de l’utilisateur dans la base de données
    const result = await pool.query(
      `UPDATE "user"
       SET nom = $1, prenom = $2, email = $3, role = $4, filiere = $5
       WHERE id = $6
       RETURNING id, nom, prenom, email, role, filiere`,
      [nom, prenom, email, role, filiere, id]
    );

    // Si aucun utilisateur modifié, renvoi erreur 404
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    // Envoi des nouvelles données utilisateur
    res.json(result.rows[0]);
  } catch (error) {
    // Gestion d’erreur si email déjà utilisé
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email déjà utilisé.' });
    }
    // Autres erreurs serveur
    res.status(500).json({ error: 'Erreur serveur. ' + error.message });
  }
};

// Fonction pour supprimer un utilisateur (id dans paramètres URL)
exports.deleteUser = async (req, res) => {
  // Récupération de l’id utilisateur
  const { id } = req.params;

  try {
    // Suppression dans la base, on retourne la ligne supprimée (pour vérifier)
    const result = await pool.query(
      `DELETE FROM "user" WHERE id = $1 RETURNING *`,
      [id]
    );

    // Si aucun utilisateur supprimé, erreur 404
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    // Envoi code 204 (No Content) pour indiquer suppression réussie sans contenu
    res.status(204).send();
  } catch (error) {
    // Erreur serveur
    res.status(500).json({ error: 'Erreur serveur. ' + error.message });
  }
};

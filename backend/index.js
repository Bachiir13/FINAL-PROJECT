// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');
const fetch = require('node-fetch'); // Assure-toi d'avoir installé node-fetch

// Import Sequelize et modèles
const {
  sequelize,
  User,
  Actualite,
  Contact,
  Cours,
  Formation,
  InscriptionCours,
  InscriptionFormation,
  Messages,
  Note,
  Pedagogie,
  Temoignages
} = require('./models');

const app = express();
const port = process.env.PORT || 3002;

// === Middlewares globaux ===
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(bodyParser.json());

// Logger simple
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// === Routes de base ===
app.get('/', (_, res) => res.send('🚀 API TechEcole en ligne'));

// === Routes utilisateurs ===
app.use("/users", require("./routes/user.routes"));

// === Routes API pour tous les modèles ===

// Actualites
app.get('/actualites', async (req, res) => {
  try {
    const actualites = await Actualite.findAll({
      include: [{ model: User, as: 'auteur' }],
      limit: 50
    });
    res.json(actualites);
  } catch (err) {
    console.error('Erreur chargement actualites:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Contacts
app.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.findAll({ limit: 50 });
    res.json(contacts);
  } catch (err) {
    console.error('Erreur chargement contacts:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Cours
app.get('/cours', async (req, res) => {
  try {
    const cours = await Cours.findAll({
      include: [{ model: User, as: 'enseignant' }],
      limit: 50
    });
    res.json(cours);
  } catch (err) {
    console.error('Erreur chargement cours:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Formations
app.get('/formations', async (req, res) => {
  try {
    const formations = await Formation.findAll({ limit: 50 });
    res.json(formations);
  } catch (err) {
    console.error('Erreur chargement formations:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Inscriptions Cours
app.get('/inscriptions-cours', async (req, res) => {
  try {
    const inscriptions = await InscriptionCours.findAll({
      include: [
        { model: User, as: 'eleve' },
        { model: Cours, as: 'cours' }
      ],
      limit: 50
    });
    res.json(inscriptions);
  } catch (err) {
    console.error('Erreur chargement inscriptions cours:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Inscriptions Formations
app.get('/inscriptions-formations', async (req, res) => {
  try {
    const inscriptions = await InscriptionFormation.findAll({
      include: [
        { model: User, as: 'visiteur' },
        { model: Formation, as: 'formation' }
      ],
      limit: 50
    });
    res.json(inscriptions);
  } catch (err) {
    console.error('Erreur chargement inscriptions formations:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Messages
app.get('/messages', async (req, res) => {
  try {
    const messages = await Messages.findAll({
      include: [
        { model: User, as: 'sender' },
        { model: User, as: 'receiver' }
      ],
      limit: 50
    });
    res.json(messages);
  } catch (err) {
    console.error('Erreur chargement messages:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Notes
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.findAll({
      include: [
        { model: User, as: 'eleve' },
        { model: User, as: 'enseignant' }
      ],
      limit: 50
    });
    res.json(notes);
  } catch (err) {
    console.error('Erreur chargement notes:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Pédagogies
app.get('/pedagogies', async (req, res) => {
  try {
    const pedagogies = await Pedagogie.findAll({
      include: [{ model: User, as: 'auteur' }],
      limit: 50
    });
    res.json(pedagogies);
  } catch (err) {
    console.error('Erreur chargement pedagogies:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Témoignages
app.get('/temoignages', async (req, res) => {
  try {
    const temoignages = await Temoignages.findAll({ limit: 50 });
    res.json(temoignages);
  } catch (err) {
    console.error('Erreur chargement temoignages:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// === reCAPTCHA endpoint ===
app.post('/verify-captcha', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ success: false, message: "Token reCAPTCHA manquant." });

  try {
    const params = new URLSearchParams();
    params.append('secret', process.env.RECAPTCHA_SECRET);
    params.append('response', token);

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });

    const data = await response.json();
    if (data.success) return res.status(200).json({ success: true });
    return res.status(400).json({ success: false, errors: data["error-codes"] });
  } catch (err) {
    console.error("Erreur reCAPTCHA :", err);
    res.status(500).json({ success: false, message: "Erreur serveur reCAPTCHA." });
  }
});

// === Middleware global pour erreurs ===
app.use((err, req, res, next) => {
  console.error("Erreur attrapée :", err);
  res.status(500).json({ message: "Erreur interne du serveur" });
});

// === Socket.IO ===
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "*", methods: ["GET", "POST"] }
});

io.on("connection", (socket) => {
  console.log(`📡 Utilisateur connecté : ${socket.id}`);

  socket.on("joinRoom", userId => {
    socket.join(userId.toString());
    console.log(`👤 ${userId} a rejoint sa room.`);
  });

  socket.on("disconnect", () => console.log(`🔌 Utilisateur déconnecté : ${socket.id}`));
});

// === Connexion DB + lancement serveur ===
sequelize.authenticate()
  .then(async () => {
    console.log('✅ PostgreSQL connecté via Sequelize');

    // Synchronisation des tables (optionnel)
    await sequelize.sync({ alter: true });
    console.log('✅ Toutes les tables synchronisées');

    server.listen(port, () => console.log(`✅ Serveur démarré sur http://localhost:${port}`));
  })
  .catch(err => {
    console.error('❌ Erreur PostgreSQL :', err);
  });

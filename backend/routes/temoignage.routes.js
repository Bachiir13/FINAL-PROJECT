// backend/routes/temoignages.js
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

// Assure-toi d'avoir initialisé Firebase Admin
// admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();

router.post("/temoignages", async (req, res) => {
  try {
    const { eleveId, nom, promo, message, note } = req.body;

    // Vérifier la session / utilisateur connecté via PostgreSQL
    if (!req.session || !req.session.user || req.session.user.id !== eleveId) {
      return res.status(401).json({ error: "Utilisateur non autorisé" });
    }

    // Ajouter l'avis dans Firestore
    await db.collection("temoignages").add({
      eleveId,
      nom,
      promo: promo || null,
      message,
      note,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: "Avis posté avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Impossible de poster l'avis" });
  }
});

module.exports = router;

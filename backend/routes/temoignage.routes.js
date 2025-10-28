const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const path = require("path");

// Import du fichier JSON de service account
const serviceAccount = require(path.join(__dirname, "../serviceAccountKey.json"));

// Initialisation Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// POST pour ajouter un témoignage
router.post("/temoignages", async (req, res) => {
  try {
    const { eleveId, nom, promo, message, note } = req.body;

    // TODO : Vérification de session utilisateur si nécessaire
    // if (!req.session || !req.session.user || req.session.user.id !== eleveId) {
    //   return res.status(401).json({ error: "Utilisateur non autorisé" });
    // }

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
    console.error("Erreur POST /temoignages:", err);
    res.status(500).json({ error: "Impossible de poster l'avis" });
  }
});

module.exports = router;

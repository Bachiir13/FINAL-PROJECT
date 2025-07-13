const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const coursController = require('../controllers/cours.controller');

// Configuration multer pour upload fichier
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Assure-toi que ce dossier existe dans ton projet
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// POST avec upload de fichier, gestion simple des erreurs multer
router.post('/', (req, res, next) => {
  upload.single('fichier')(req, res, function(err) {
    if (err) {
      console.error("Erreur upload fichier:", err);
      return res.status(400).json({ error: "Erreur lors de l'upload du fichier." });
    }
    next();
  });
}, coursController.createCours);

router.get('/', coursController.getCours);
router.get('/enseignant/:user_id', coursController.getCoursByEnseignant);
router.put('/:id', coursController.updateCours);
router.delete('/:id', coursController.deleteCours);

module.exports = router;

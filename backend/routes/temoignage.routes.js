const express = require('express');
const router = express.Router();
const temoignageController = require('../controllers/temoignage.controller');

// Récupérer tous les témoignages
router.get('/', temoignageController.getAll);

// Récupérer un témoignage par id
router.get('/:id', temoignageController.getById);

// Créer un témoignage
router.post('/', temoignageController.create);

// Mettre à jour un témoignage
router.put('/:id', temoignageController.update);

// Supprimer un témoignage
router.delete('/:id', temoignageController.delete);

module.exports = router;

const express = require('express');
const router = express.Router();
const controller = require('../controllers/formation.controller');

router.post('/', controller.createFormation);        // Ajouter une formation
router.get('/', controller.getFormations);           // Récupérer toutes les formations
router.get('/:id', controller.getFormationById);     // Récupérer une formation par ID
router.put('/:id', controller.updateFormation);      // Modifier une formation par ID
router.delete('/:id', controller.deleteFormation);   // Supprimer une formation par ID

module.exports = router;

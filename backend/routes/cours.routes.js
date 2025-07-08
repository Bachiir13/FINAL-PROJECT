const express = require('express');
const router = express.Router();
const controller = require('../controllers/cours.controller');

// Routes sans middleware d'authentification/autorisation
router.post('/', controller.createCours);
router.get('/', controller.getCours); // public
router.get('/enseignant/:user_id', controller.getCoursByEnseignant);
router.put('/:id', controller.updateCours);
router.delete('/:id', controller.deleteCours);

module.exports = router;

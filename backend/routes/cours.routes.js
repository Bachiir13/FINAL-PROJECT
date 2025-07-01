const express = require('express');
const router = express.Router();
const controller = require('../controllers/cours.controller');

router.post('/', controller.createCours);               // Créer un cours
router.get('/', controller.getCours);                   // Récupérer tous les cours
router.get('/enseignant/:user_id', controller.getCoursByEnseignant); // Récupérer les cours d’un enseignant
router.put('/:id', controller.updateCours);             // Modifier un cours par ID
router.delete('/:id', controller.deleteCours);          // Supprimer un cours par ID

module.exports = router;

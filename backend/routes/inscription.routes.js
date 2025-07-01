const express = require('express');
const router = express.Router();
const controller = require('../controllers/inscription.controller');

// Route pour récupérer les élèves inscrits à un cours spécifique
router.get('/cours/:coursId', controller.getElevesByCours);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.delete('/:id', controller.delete);

module.exports = router;

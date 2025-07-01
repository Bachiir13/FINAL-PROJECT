const express = require('express');
const router = express.Router();
const controller = require('../controllers/actualite.controller');

router.post('/', controller.createActualite);
router.get('/', controller.getActualites);
router.put('/:id', controller.updateActualite);   // ✅ Modifier une actualité
router.delete('/:id', controller.deleteActualite); // ✅ Supprimer une actualité

module.exports = router;

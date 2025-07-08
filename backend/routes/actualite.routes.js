const express = require('express');
const router = express.Router();
const controller = require('../controllers/actualite.controller');

// Suppression des middlewares requireRole et verifyToken car ils n'existent plus
router.post('/', controller.createActualite);
router.get('/', controller.getActualites); // accès public
router.put('/:id', controller.updateActualite);
router.delete('/:id', controller.deleteActualite);

module.exports = router;

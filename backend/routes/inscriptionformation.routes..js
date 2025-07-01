const express = require('express');
const router = express.Router();
const controller = require('../controllers/inscriptionformation.controller');

// POST /inscriptions
router.post('/', controller.createInscription);

// GET /inscriptions
router.get('/', controller.getInscriptions);

// GET /inscriptions/:id
router.get('/:id', controller.getInscriptionById);

// DELETE /inscriptions/:id
router.delete('/:id', controller.deleteInscription);

module.exports = router;

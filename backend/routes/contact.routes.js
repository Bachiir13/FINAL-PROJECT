const express = require('express');
const router = express.Router();
const controller = require('../controllers/contact.controller');

router.post('/', controller.envoyerMessage);
router.get('/', controller.getMessages);
router.delete('/:id', controller.supprimerMessage);
router.put('/:id', controller.modifierMessage);


module.exports = router;

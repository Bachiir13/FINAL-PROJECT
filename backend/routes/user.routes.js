const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');

router.post('/', controller.createUser);              // Inscription utilisateur
router.get('/', controller.getAllUsers);               // Récupérer tous les utilisateurs
router.get('/email/:email', controller.getUserByEmail); // Récupérer utilisateur par email
router.put('/:id', controller.updateUser);             // Modifier utilisateur
router.delete('/:id', controller.deleteUser);          // Supprimer utilisateur

module.exports = router;

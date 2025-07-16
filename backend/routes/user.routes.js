const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');

// Auth publiques
router.post('/', controller.createUser);               // Inscription
router.post('/login', controller.loginUser);           // Connexion
router.get('/', controller.getAllUsers);               // Voir tous les utilisateurs
router.get('/email/:email', controller.getUserByEmail); // Voir un utilisateur par email
router.put('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');

// Auth publiques
router.post('/', controller.createUser);               // Inscription
router.post('/login', controller.loginUser);           // Connexion

// Routes publiques (plus de token)
router.get('/', controller.getAllUsers);               // Voir tous les utilisateurs
router.get('/email/:email', controller.getUserByEmail); // Voir un utilisateur par email

// Routes modif/suppression sans vérification token ni rôle
router.put('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);

module.exports = router;

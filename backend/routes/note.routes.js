const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');

// Créer une note
router.post('/', noteController.createNote);

// Récupérer toutes les notes
router.get('/', noteController.getAllNotes);

// Récupérer toutes les notes d'un élève par son ID
router.get('/eleve/:eleve_id', noteController.getNotesByEleve);

// Modifier une note par ID
router.put('/:id', noteController.updateNote);

// Supprimer une note par ID
router.delete('/:id', noteController.deleteNote);

module.exports = router;

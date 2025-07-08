const express = require('express');
const router = express.Router();
const controller = require('../controllers/pedagogie.controller');

router.post('/', controller.createPedagogie);
router.get('/', controller.getPedagogies); // accès public
router.put('/:id', controller.updatePedagogie);
router.delete('/:id', controller.deletePedagogie);

module.exports = router;

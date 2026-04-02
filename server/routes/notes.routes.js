const express = require('express');
const notesController = require('../controllers/notes.controller');
const requireAuth = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(requireAuth);

router.get('/', notesController.getAll);
router.post('/', notesController.create);
router.put('/:id', notesController.update);
router.delete('/:id', notesController.remove);

module.exports = router;

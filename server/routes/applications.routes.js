const express = require('express');
const applicationsController = require('../controllers/applications.controller');
const requireAuth = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const notesController = require('../controllers/notes.controller');

const router = express.Router();

router.use(requireAuth);

router.get('/', applicationsController.getAll);
router.post('/', applicationsController.create);
router.put('/:id', applicationsController.update);
router.delete('/:id', applicationsController.remove);

router.get('/:id/notes', notesController.getForApplication);

module.exports = router;

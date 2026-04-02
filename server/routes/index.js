const express = require('express');

const authRoutes = require('./auth.routes');
const applicationsRoutes = require('./applications.routes');
const notesRoutes = require('./notes.routes');
const profileRoutes = require('./profile.routes');

const requireAuth = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const applicationsController = require('../controllers/applications.controller');

const router = express.Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));

router.use('/auth', authRoutes);
router.use('/applications', applicationsRoutes);
router.use('/notes', notesRoutes);
router.use('/profile', profileRoutes);

router.post('/upload-resume', requireAuth, upload.single('resume'), applicationsController.uploadResume);

module.exports = router;

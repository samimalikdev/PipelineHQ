const express = require('express');
const profileController = require('../controllers/profile.controller');
const authController = require('../controllers/auth.controller');
const requireAuth = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

router.use(requireAuth);

router.get('/', profileController.get);
router.put('/', profileController.update);
router.delete('/', profileController.remove);

router.post('/avatar', upload.single('avatar'), profileController.uploadAvatar);
router.put('/password', profileController.changePassword);
router.get('/export', profileController.exportData);

router.post('/mfa/enroll', authController.enrollMfa);
router.post('/mfa/challenge', authController.challengeMfa);
router.post('/mfa/verify', authController.verifyMfa);
router.get('/mfa', authController.listMfaParameters);
router.delete('/mfa/:id', authController.unenrollMfa);

module.exports = router;

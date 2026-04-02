const profileService = require('../services/profile.service');

const get = async (req, res) => {
  try {
    const data = await profileService.getProfile(req.supabase, req.user);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const data = await profileService.updateProfile(req.supabase, req.user.id, req.user.email, req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const avatarUrl = await profileService.uploadAvatar(req.supabase, req.user.id, req.file);
    res.json({ avatar_url: avatarUrl });
  } catch (err) {
    console.error('Avatar upload error:', err);
    res.status(500).json({ error: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { new_password } = req.body;
    if (!new_password || new_password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    const token = req.headers.authorization.split(' ')[1];
    await profileService.changePassword(token, new_password);
    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const exportData = async (req, res) => {
  try {
    const data = await profileService.exportData(req.supabase, req.user);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="pipelinehq-export-${Date.now()}.json"`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    await profileService.deleteAccount(req.supabase, req.user.id);
    res.json({ success: true, message: 'Account deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  get,
  update,
  uploadAvatar,
  changePassword,
  exportData,
  remove
};

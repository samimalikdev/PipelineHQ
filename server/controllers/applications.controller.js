const applicationsService = require('../services/applications.service');

const getAll = async (req, res) => {
  try {
    const data = await applicationsService.getAllApplications(req.supabase);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const data = await applicationsService.createApplication(req.supabase, req.user.id, req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await applicationsService.updateApplication(req.supabase, id, req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await applicationsService.deleteApplication(req.supabase, id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const publicUrl = await applicationsService.uploadResume(req.supabase, req.user.id, req.file);
    res.json({ url: publicUrl });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAll,
  create,
  update,
  remove,
  uploadResume
};

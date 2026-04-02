const notesService = require('../services/notes.service');

const getForApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await notesService.getNotesForApplication(req.supabase, id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const data = await notesService.getAllStandaloneNotes(req.supabase);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const data = await notesService.createStandaloneNote(req.supabase, req.user.id, req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await notesService.updateStandaloneNote(req.supabase, id, req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await notesService.deleteStandaloneNote(req.supabase, id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getForApplication,
  getAll,
  create,
  update,
  remove
};

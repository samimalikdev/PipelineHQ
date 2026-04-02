const authService = require('../services/auth.service');

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const data = await authService.registerUser(email, password, name);
    res.status(201).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await authService.loginUser(email, password);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const enrollMfa = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const data = await authService.enrollMfa(token, req.user.factors);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const challengeMfa = async (req, res) => {
  try {
    const { factorId } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const data = await authService.challengeMfa(token, factorId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const verifyMfa = async (req, res) => {
  try {
    const { factorId, challengeId, code } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const data = await authService.verifyMfa(token, factorId, challengeId, code);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listMfaParameters = async (req, res) => {
  try {
    const data = await authService.listMfaFactors(req.supabase);
    res.json(data);
  } catch (err) {
    console.error('MFA fetch error:', err);
    res.status(500).json({ error: err.message });
  }
};

const unenrollMfa = async (req, res) => {
  try {
    const { id } = req.params;
    await authService.unenrollMfa(req.supabase, id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  register,
  login,
  enrollMfa,
  challengeMfa,
  verifyMfa,
  listMfaParameters,
  unenrollMfa
};

const { supabaseBase, supabaseUrl, supabaseKey } = require('../config/supabase');

const registerUser = async (email, password, name) => {
  const { data, error } = await supabaseBase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });

  if (error) {
    const err = new Error(error.message);
    err.status = error.status || 400;
    throw err;
  }
  return data;
};

const loginUser = async (email, password) => {
  const { data, error } = await supabaseBase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    const err = new Error(error.message);
    err.status = error.status || 400;
    throw err;
  }

  try {
    const factorsRes = await fetch(`${supabaseUrl}/auth/v1/factors`, {
      headers: {
        'Authorization': `Bearer ${data.session.access_token}`,
        'apikey': supabaseKey
      }
    });
    const factorsData = await factorsRes.json();
    if (factorsRes.ok) {
      const allFactors = factorsData?.totp || factorsData || [];
      data.user.factors = allFactors;
    }
  } catch (factorErr) {
    console.error('[MFA DEBUG] factors fetch error:', factorErr.message);
  }

  return data;
};

const enrollMfa = async (token, userFactors = []) => {

  const unverifiedFactors = userFactors.filter(f => f.status === 'unverified') || [];
  for (const factor of unverifiedFactors) {
    await fetch(`${supabaseUrl}/auth/v1/factors/${factor.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': supabaseKey
      }
    });
  }

  const result = await fetch(`${supabaseUrl}/auth/v1/factors`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'apikey': supabaseKey
    },
    body: JSON.stringify({ factor_type: 'totp', friendly_name: 'Authenticator App' })
  });
  const data = await result.json();
  if (!result.ok) throw new Error(data.msg || data.message || 'Failed to enroll MFA');
  return data;
};

const challengeMfa = async (token, factorId) => {
  const result = await fetch(`${supabaseUrl}/auth/v1/factors/${factorId}/challenge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'apikey': supabaseKey
    }
  });
  const data = await result.json();
  if (!result.ok) throw new Error(data.msg || data.message || 'Failed to challenge MFA');
  return data;
};

const verifyMfa = async (token, factorId, challengeId, code) => {
  const result = await fetch(`${supabaseUrl}/auth/v1/factors/${factorId}/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'apikey': supabaseKey
    },
    body: JSON.stringify({ challenge_id: challengeId, code })
  });
  const data = await result.json();
  if (!result.ok) throw new Error(data.msg || data.message || 'Failed to verify MFA');
  return data;
};

const listMfaFactors = async (supabase) => {
  const { data, error } = await supabase.auth.mfa.listFactors();
  if (error) throw error;
  return data;
};

const unenrollMfa = async (supabase, factorId) => {
  const { data, error } = await supabase.auth.mfa.unenroll({ factorId });
  if (error) throw error;
  return data;
};

module.exports = {
  registerUser,
  loginUser,
  enrollMfa,
  challengeMfa,
  verifyMfa,
  listMfaFactors,
  unenrollMfa
};

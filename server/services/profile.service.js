const { supabaseUrl, supabaseKey } = require('../config/supabase');

const getProfile = async (supabase, user) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error && error.code === 'PGRST116') {

    const { data: newProfile, error: insertErr } = await supabase
      .from('profiles')
      .insert([{ id: user.id, full_name: user.user_metadata?.name || '' }])
      .select()
      .single();
    if (insertErr) throw insertErr;
    return { ...newProfile, email: user.email };
  }
  
  if (error) throw error;
  return { ...data, email: user.email };
};

const updateProfile = async (supabase, userId, email, updateData) => {
  const { full_name, job_title, bio, location } = updateData;
  const { data, error } = await supabase
    .from('profiles')
    .update({ full_name, job_title, bio, location, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return { ...data, email };
};

const uploadAvatar = async (supabase, userId, file) => {
  const fileExt = file.originalname.split('.').pop();
  const fileName = `${userId}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  const avatarUrl = `${publicUrl}?t=${Date.now()}`;

  const { data, error } = await supabase
    .from('profiles')
    .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return avatarUrl;
};

const changePassword = async (token, newPassword) => {
  const result = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'apikey': supabaseKey
    },
    body: JSON.stringify({ password: newPassword })
  });

  if (!result.ok) {
    const errData = await result.json();
    throw new Error(errData.msg || errData.message || 'Failed to update password.');
  }
};

const exportData = async (supabase, user) => {
  const [appsResult, notesResult, profileResult] = await Promise.all([
    supabase.from('applications').select('*').order('created_at', { ascending: false }),
    supabase.from('standalone_notes').select('*').order('created_at', { ascending: false }),
    supabase.from('profiles').select('*').eq('id', user.id).single(),
  ]);

  if (appsResult.error) throw appsResult.error;
  if (notesResult.error) throw notesResult.error;

  return {
    exported_at: new Date().toISOString(),
    user: { email: user.email, id: user.id },
    profile: profileResult.data || {},
    applications: appsResult.data,
    notes: notesResult.data,
  };
};

const deleteAccount = async (supabase, userId) => {
  const { error: profileErr } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);
    
  if (profileErr) throw profileErr;

  await supabase.auth.signOut();
};

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
  exportData,
  deleteAccount
};

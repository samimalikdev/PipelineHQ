const getNotesForApplication = async (supabase, appId) => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('application_id', appId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

const getAllStandaloneNotes = async (supabase) => {
  const { data, error } = await supabase
    .from('standalone_notes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

const createStandaloneNote = async (supabase, userId, noteData) => {
  const { data, error } = await supabase
    .from('standalone_notes')
    .insert([{ ...noteData, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const updateStandaloneNote = async (supabase, noteId, updateData) => {
  const { id, user_id, created_at, ...cleanData } = updateData;
  const { data, error } = await supabase
    .from('standalone_notes')
    .update(cleanData)
    .eq('id', noteId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const deleteStandaloneNote = async (supabase, noteId) => {
  const { error } = await supabase
    .from('standalone_notes')
    .delete()
    .eq('id', noteId);

  if (error) throw error;
};

module.exports = {
  getNotesForApplication,
  getAllStandaloneNotes,
  createStandaloneNote,
  updateStandaloneNote,
  deleteStandaloneNote
};

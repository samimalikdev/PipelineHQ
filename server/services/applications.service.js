const getAllApplications = async (supabase) => {
  const PAGE_SIZE = 1000;
  let allData = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw error;
    if (!data || data.length === 0) break;

    allData = allData.concat(data);

    if (data.length < PAGE_SIZE) break; 
    from += PAGE_SIZE;
  }

  return allData;
};

const createApplication = async (supabase, userId, appData) => {

  const { id, logo, logoBg, ...cleanData } = appData;
  const newApp = { ...cleanData, user_id: userId };

  const { data, error } = await supabase
    .from('applications')
    .insert([newApp])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const updateApplication = async (supabase, appId, updateData) => {
  const { id, logo, logoBg, user_id, created_at, ...cleanData } = updateData;

  const { data, error } = await supabase
    .from('applications')
    .update(cleanData)
    .eq('id', appId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const deleteApplication = async (supabase, appId) => {
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', appId);

  if (error) throw error;
};

const uploadResume = async (supabase, userId, file) => {
  const fileExt = file.originalname.split('.').pop();
  const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { error } = await supabase.storage
    .from('resumes')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('resumes')
    .getPublicUrl(fileName);

  return publicUrl;
};

module.exports = {
  getAllApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  uploadResume
};

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabaseBase = createClient(supabaseUrl, supabaseKey);

module.exports = {
  supabaseUrl,
  supabaseKey,
  supabaseBase,
};

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

exports.handler = async function(event) {
  try {
    const body = JSON.parse(event.body || '{}');
    const { username, password } = body;
    if (!username || !password) {
      return { statusCode: 400, body: JSON.stringify({ error: 'username and password required' }) };
    }

    // check exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .limit(1);
    if (existing && existing.length > 0) {
      return { statusCode: 409, body: JSON.stringify({ error: 'username_taken' }) };
    }

    const password_hash = bcrypt.hashSync(password, 10);
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, password_hash }])
      .select('id, username')
      .single();

    if (error) {
      console.error(error);
      return { statusCode: 500, body: JSON.stringify({ error: 'db_error' }) };
    }

    return { statusCode: 200, body: JSON.stringify({ user: data }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'server_error' }) };
  }
};

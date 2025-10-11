const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const JWT_SECRET = process.env.NETLIFY_JWT_SECRET || 'dev_secret';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

exports.handler = async function(event) {
  try {
    const body = JSON.parse(event.body || '{}');
    const { username, password } = body;
    if (!username || !password) {
      return { statusCode: 400, body: JSON.stringify({ error: 'username and password required' }) };
    }

    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, password_hash')
      .eq('username', username)
      .limit(1);

    if (error) {
      console.error(error);
      return { statusCode: 500, body: JSON.stringify({ error: 'db_error' }) };
    }
    if (!users || users.length === 0) {
      return { statusCode: 401, body: JSON.stringify({ error: 'invalid_credentials' }) };
    }
    const user = users[0];
    const match = bcrypt.compareSync(password, user.password_hash);
    if (!match) {
      return { statusCode: 401, body: JSON.stringify({ error: 'invalid_credentials' }) };
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    return { statusCode: 200, body: JSON.stringify({ token, user: { id: user.id, username: user.username } }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'server_error' }) };
  }
};

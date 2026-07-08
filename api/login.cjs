const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { parseJSONBody, sendJSON } = require('./_vercelHelpers');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      sendJSON(res, 405, { error: 'method_not_allowed' });
      return;
    }

    const body = await parseJSONBody(req);
    const { username, password } = body;

    if (!username || !password) {
      sendJSON(res, 400, { error: 'username and password required' });
      return;
    }

    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, password_hash')
      .eq('username', username)
      .limit(1);

    if (error) {
      console.error(error);
      sendJSON(res, 500, { error: 'db_error' });
      return;
    }

    if (!users || users.length === 0) {
      sendJSON(res, 401, { error: 'invalid_credentials' });
      return;
    }

    const user = users[0];
    const match = bcrypt.compareSync(password, user.password_hash);
    if (!match) {
      sendJSON(res, 401, { error: 'invalid_credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' },
    );

    sendJSON(res, 200, { token, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error(err);
    sendJSON(res, 500, { error: 'server_error' });
  }
};

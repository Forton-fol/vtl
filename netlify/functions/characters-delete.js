const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const JWT_SECRET = process.env.NETLIFY_JWT_SECRET || 'dev_secret';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function getUserIdFromEvent(event) {
  const auth = event.headers && (event.headers.authorization || event.headers.Authorization);
  if (!auth) return null;
  const parts = auth.split(' ');
  if (parts.length !== 2) return null;
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch (err) {
    return null;
  }
}

exports.handler = async function(event) {
  try {
    const userId = getUserIdFromEvent(event);
    if (!userId) return { statusCode: 401, body: JSON.stringify({ error: 'unauthorized' }) };

    const { id } = event.queryStringParameters || {};
    if (!id) return { statusCode: 400, body: JSON.stringify({ error: 'id required' }) };

    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error(error);
      return { statusCode: 500, body: JSON.stringify({ error: 'db_error' }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'server_error' }) };
  }
};

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const { parseJSONBody, sendJSON } = require('../lib/vercelHelpers');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function verifyTurnstile(token, remoteIp) {
  const params = new URLSearchParams();
  params.set('secret', TURNSTILE_SECRET_KEY);
  params.set('response', token);
  if (remoteIp) {
    params.set('remoteip', remoteIp);
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!response.ok) {
    return false;
  }

  const payload = await response.json();
  return Boolean(payload.success);
}

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      sendJSON(res, 405, { error: 'method_not_allowed' });
      return;
    }

    const body = await parseJSONBody(req);
    const { username, password, captchaToken } = body;

    if (!username || !password) {
      sendJSON(res, 400, { error: 'username and password required' });
      return;
    }

    if (TURNSTILE_SECRET_KEY) {
      if (!captchaToken) {
        sendJSON(res, 400, { error: 'captcha_required' });
        return;
      }

      const remoteIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim();
      const isValid = await verifyTurnstile(captchaToken, remoteIp);
      if (!isValid) {
        sendJSON(res, 400, { error: 'captcha_failed' });
        return;
      }
    }

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .limit(1);

    if (existing && existing.length > 0) {
      sendJSON(res, 409, { error: 'username_taken' });
      return;
    }

    const password_hash = bcrypt.hashSync(password, 10);
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, password_hash }])
      .select('id, username')
      .single();

    if (error) {
      console.error(error);
      sendJSON(res, 500, { error: 'db_error' });
      return;
    }

    sendJSON(res, 200, { user: data });
  } catch (err) {
    console.error(err);
    sendJSON(res, 500, { error: 'server_error' });
  }
};

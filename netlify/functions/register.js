const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

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

exports.handler = async function(event) {
  try {
    const body = JSON.parse(event.body || '{}');
    const { username, password, captchaToken } = body;
    if (!username || !password) {
      return { statusCode: 400, body: JSON.stringify({ error: 'username and password required' }) };
    }

    if (TURNSTILE_SECRET_KEY) {
      if (!captchaToken) {
        return { statusCode: 400, body: JSON.stringify({ error: 'captcha_required' }) };
      }
      const remoteIp = event.headers['x-forwarded-for']?.split(',')[0]?.trim();
      const isValidCaptcha = await verifyTurnstile(captchaToken, remoteIp);
      if (!isValidCaptcha) {
        return { statusCode: 400, body: JSON.stringify({ error: 'captcha_failed' }) };
      }
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

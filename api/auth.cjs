const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const {
  parseJSONBody,
  getQuery,
  getBaseUrl,
  sendJSON,
  sendRedirect,
} = require('../lib/vercelHelpers');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const PATREON_CLIENT_ID = process.env.PATREON_CLIENT_ID;
const PATREON_CLIENT_SECRET = process.env.PATREON_CLIENT_SECRET;
const PATREON_REDIRECT_URI = process.env.PATREON_REDIRECT_URI;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function isMissingColumnError(error) {
  if (!error) {
    return false;
  }
  return (
    error.code === 'PGRST204' ||
    (typeof error.message === 'string' && error.message.includes('Could not find the') && error.message.includes('column'))
  );
}

function getGoogleAuthUrl(state, baseUrl) {
  const redirectUri = GOOGLE_REDIRECT_URI || `${baseUrl}/api/auth`;
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'email profile',
    access_type: 'offline',
    prompt: 'consent',
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

function getPatreonAuthUrl(state, baseUrl) {
  const redirectUri = PATREON_REDIRECT_URI || `${baseUrl}/api/auth`;
  const params = new URLSearchParams({
    client_id: PATREON_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'identity identity[email] identity.memberships',
    state,
  });
  return `https://www.patreon.com/oauth2/authorize?${params.toString()}`;
}

async function exchangeGoogleCode(code, baseUrl) {
  const response = await axios.post('https://oauth2.googleapis.com/token', {
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: GOOGLE_REDIRECT_URI || `${baseUrl}/api/auth`,
    grant_type: 'authorization_code',
  });
  return response.data;
}

async function getGoogleUserInfo(accessToken) {
  const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
}

async function exchangePatreonCode(code, baseUrl) {
  const params = new URLSearchParams({
    code,
    grant_type: 'authorization_code',
    client_id: PATREON_CLIENT_ID,
    client_secret: PATREON_CLIENT_SECRET,
    redirect_uri: PATREON_REDIRECT_URI || `${baseUrl}/api/auth`,
  });

  const response = await axios.post(
    'https://www.patreon.com/api/oauth2/token',
    params.toString(),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    },
  );
  return response.data;
}

async function getPatreonUserInfo(accessToken) {
  const params = new URLSearchParams({
    include: 'memberships',
    'fields[user]': 'full_name,email',
    'fields[member]': 'patron_status,last_charge_status,currently_entitled_amount_cents',
  });

  const response = await axios.get(
    `https://www.patreon.com/api/oauth2/v2/identity?${params.toString()}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  return response.data;
}

async function findOrCreateGoogleUser(googleUser) {
  const { email, name, picture } = googleUser;
  const username = email && email.includes('@') ? email.split('@')[0] : `google_${Date.now()}`;

  let { data: existingUser, error: existingUserError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .limit(1);

  if (existingUserError && isMissingColumnError(existingUserError)) {
    ({ data: existingUser, error: existingUserError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .limit(1));
  }

  if (existingUserError) {
    throw existingUserError;
  }

  if (existingUser && existingUser.length > 0) {
    const { error: updateError } = await supabase
      .from('users')
      .update({
        google_picture: picture,
        google_name: name,
        auth_provider: 'google',
      })
      .eq('id', existingUser[0].id);

    if (updateError && !isMissingColumnError(updateError)) {
      throw updateError;
    }

    return existingUser[0];
  }

  const googleInsertPayload = {
    username,
    email,
    google_picture: picture,
    google_name: name,
    auth_provider: 'google',
    password_hash: 'google_oauth',
  };

  let { data: newUser, error } = await supabase
    .from('users')
    .insert([googleInsertPayload])
    .select('*')
    .single();

  if (error && isMissingColumnError(error)) {
    ({ data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          username,
          password_hash: 'google_oauth',
        },
      ])
      .select('*')
      .single());
  }

  if (error) {
    console.error('Error creating user:', error);
    throw error;
  }

  return newUser;
}

async function updatePatreonSubscription(userId, patreonData) {
  let tier = null;
  const patreonId = patreonData.data?.id || null;
  let isPatron = false;

  if (Array.isArray(patreonData.included) && patreonData.included.length > 0) {
    const memberships = patreonData.included.filter(i => i.type === 'member');
    const activeMemberships = memberships.filter((member) => {
      const attrs = member.attributes || {};
      return attrs.patron_status === 'active_patron' || attrs.last_charge_status === 'Paid';
    });

    if (activeMemberships.length > 0) {
      isPatron = true;
      const highestMembership = activeMemberships.reduce((max, member) => {
        const amount = member.attributes?.currently_entitled_amount_cents || 0;
        const maxAmount = max?.attributes?.currently_entitled_amount_cents || 0;
        return amount > maxAmount ? member : max;
      }, null);

      const amount = highestMembership?.attributes?.currently_entitled_amount_cents || 0;
      tier = amount >= 500 ? 'supporter' : 'basic';
    }
  }

  await supabase
    .from('users')
    .update({
      patreon_tier: tier,
      patreon_id: patreonId,
      is_patron: isPatron,
    })
    .eq('id', userId);
}

function getUserFromAuthHeader(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

function normalizeUsername(value) {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
}

module.exports = async (req, res) => {
  try {
    const queryParams = getQuery(req);
    const action = queryParams.action;
    const baseUrl = getBaseUrl(req);

    if (action === 'google') {
      const state = jwt.sign({ purpose: 'google' }, JWT_SECRET, { expiresIn: '10m' });
      const authUrl = getGoogleAuthUrl(state, baseUrl);
      sendRedirect(res, authUrl);
      return;
    }

    if (action === 'callback' || (queryParams.code && queryParams.state)) {
      const { code, state } = queryParams;
      if (!code || !state) {
        sendJSON(res, 400, { error: 'missing_params' });
        return;
      }

      let decoded;
      try {
        decoded = jwt.verify(state, JWT_SECRET);
      } catch (e) {
        sendJSON(res, 400, { error: 'invalid_state' });
        return;
      }

      if (decoded.purpose === 'google') {
        const tokens = await exchangeGoogleCode(code, baseUrl);
        const googleUser = await getGoogleUserInfo(tokens.access_token);
        const user = await findOrCreateGoogleUser(googleUser);
        const token = jwt.sign(
          { userId: user.id, username: user.username, email: user.email || null },
          JWT_SECRET,
          { expiresIn: '7d' },
        );
        sendRedirect(res, `${baseUrl}/#/register?token=${token}&auth=google`);
        return;
      }

      if (decoded.purpose === 'patreon') {
        const userId = decoded.userId;
        if (!userId) {
          sendJSON(res, 401, { error: 'invalid_state' });
          return;
        }

        const tokens = await exchangePatreonCode(code, baseUrl);
        const patreonData = await getPatreonUserInfo(tokens.access_token);
        await updatePatreonSubscription(userId, patreonData);
        sendRedirect(res, `${baseUrl}?patreon=connected`);
        return;
      }

      sendJSON(res, 400, { error: 'invalid_state_purpose' });
      return;
    }

    if (action === 'patreon-start') {
      const body = await parseJSONBody(req);
      const token = body.token || req.headers.authorization?.replace('Bearer ', '');
      const userDecoded = token ? jwt.verify(token, JWT_SECRET) : null;
      if (!userDecoded?.userId) {
        sendJSON(res, 401, { error: 'unauthorized' });
        return;
      }

      const state = jwt.sign({ purpose: 'patreon', userId: userDecoded.userId }, JWT_SECRET, { expiresIn: '10m' });
      const authUrl = getPatreonAuthUrl(state, baseUrl);
      sendJSON(res, 200, { authUrl });
      return;
    }

    if (action === 'patreon') {
      const { token } = queryParams;
      if (!token) {
        sendJSON(res, 401, { error: 'unauthorized' });
        return;
      }
      let userDecoded;
      try {
        userDecoded = jwt.verify(token, JWT_SECRET);
      } catch (e) {
        sendJSON(res, 401, { error: 'invalid_token' });
        return;
      }
      const state = jwt.sign({ purpose: 'patreon', userId: userDecoded.userId }, JWT_SECRET, { expiresIn: '10m' });
      const authUrl = getPatreonAuthUrl(state, baseUrl);
      sendRedirect(res, authUrl);
      return;
    }

    if (action === 'subscription') {
      const userDecoded = getUserFromAuthHeader(req);
      if (!userDecoded) {
        sendJSON(res, 401, { error: 'unauthorized' });
        return;
      }

      const { data: user } = await supabase
        .from('users')
        .select('patreon_id, patreon_tier, is_patron')
        .eq('id', userDecoded.userId)
        .single();

      sendJSON(res, 200, user || {});
      return;
    }

    if (action === 'profile') {
      const userDecoded = getUserFromAuthHeader(req);
      if (!userDecoded) {
        sendJSON(res, 401, { error: 'unauthorized' });
        return;
      }

      if (req.method === 'GET') {
        const { data: user, error } = await supabase
          .from('users')
          .select('id, username, email')
          .eq('id', userDecoded.userId)
          .single();

        if (error) {
          console.error(error);
          sendJSON(res, 500, { error: 'db_error' });
          return;
        }

        sendJSON(res, 200, { user });
        return;
      }

      if (req.method === 'PATCH') {
        const body = await parseJSONBody(req);
        const username = normalizeUsername(body.username);

        if (username.length < 2 || username.length > 32) {
          sendJSON(res, 400, { error: 'invalid_username' });
          return;
        }

        const { data: existing, error: existingError } = await supabase
          .from('users')
          .select('id')
          .eq('username', username)
          .neq('id', userDecoded.userId)
          .limit(1);

        if (existingError) {
          console.error(existingError);
          sendJSON(res, 500, { error: 'db_error' });
          return;
        }

        if (existing && existing.length > 0) {
          sendJSON(res, 409, { error: 'username_taken' });
          return;
        }

        const { data: updatedUser, error } = await supabase
          .from('users')
          .update({ username })
          .eq('id', userDecoded.userId)
          .select('id, username, email')
          .single();

        if (error) {
          console.error(error);
          sendJSON(res, 500, { error: 'db_error' });
          return;
        }

        const token = jwt.sign(
          { userId: updatedUser.id, username: updatedUser.username, email: updatedUser.email || null },
          JWT_SECRET,
          { expiresIn: '7d' },
        );

        sendJSON(res, 200, { token, user: updatedUser });
        return;
      }

      sendJSON(res, 405, { error: 'method_not_allowed' });
      return;
    }

    sendJSON(res, 404, { error: 'not_found' });
  } catch (err) {
    const axiosPayload = err.response ? {
      status: err.response.status,
      data: err.response.data,
      message: err.message,
    } : null;
    console.error('Auth error:', axiosPayload || err);
    sendJSON(res, 500, {
      error: 'server_error',
      message: err.message,
      providerStatus: axiosPayload?.status,
      providerError: axiosPayload?.data,
    });
  }
};

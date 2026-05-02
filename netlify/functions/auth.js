const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const JWT_SECRET = process.env.NETLIFY_JWT_SECRET || 'dev_secret';

// Google OAuth credentials
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'https://vtmlist.netlify.app/.netlify/functions/auth';

// Patreon credentials
const PATREON_CLIENT_ID = process.env.PATREON_CLIENT_ID;
const PATREON_CLIENT_SECRET = process.env.PATREON_CLIENT_SECRET;
const PATREON_REDIRECT_URI = process.env.PATREON_REDIRECT_URI || 'https://vtmlist.netlify.app/.netlify/functions/auth/patreon/callback';

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

// Helper to get base URL
function getBaseUrl(event) {
  if (event.headers.origin) {
    return event.headers.origin;
  }
  if (event.headers['x-forwarded-proto'] && event.headers['x-forwarded-host']) {
    return `${event.headers['x-forwarded-proto']}://${event.headers['x-forwarded-host']}`;
  }
  return 'https://vtmlist.netlify.app';
}

function maskClientId(value) {
  if (!value || typeof value !== 'string') {
    return 'missing';
  }
  if (value.length <= 10) {
    return value;
  }
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function getAxiosErrorPayload(error) {
  return {
    status: error.response?.status || null,
    data: error.response?.data || null,
    message: error.message,
  };
}

// Generate OAuth URL for Google
function getGoogleAuthUrl(state) {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'email profile',
    access_type: 'offline',
    prompt: 'consent',
    state: state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

// Generate OAuth URL for Patreon
function getPatreonAuthUrl(state) {
  const params = new URLSearchParams({
    client_id: PATREON_CLIENT_ID,
    redirect_uri: PATREON_REDIRECT_URI,
    response_type: 'code',
    scope: 'identity identity[email] identity.memberships',
    state: state,
  });
  return `https://www.patreon.com/oauth2/authorize?${params.toString()}`;
}

// Exchange Google code for tokens
async function exchangeGoogleCode(code) {
  const response = await axios.post('https://oauth2.googleapis.com/token', {
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: GOOGLE_REDIRECT_URI,
    grant_type: 'authorization_code',
  });
  return response.data;
}

// Get Google user info
async function getGoogleUserInfo(accessToken) {
  const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
}

// Exchange Patreon code for tokens
async function exchangePatreonCode(code) {
  const params = new URLSearchParams({
    code,
    grant_type: 'authorization_code',
    client_id: PATREON_CLIENT_ID,
    client_secret: PATREON_CLIENT_SECRET,
    redirect_uri: PATREON_REDIRECT_URI,
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

// Get Patreon user info and subscription
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

// Check or create user from Google
async function findOrCreateGoogleUser(googleUser) {
  const { email, name, picture } = googleUser;
  const username = (email && email.includes('@')) ? email.split('@')[0] : `google_${Date.now()}`;
  
  // Check if user exists by email when schema supports it.
  let { data: existingUser, error: existingUserError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .limit(1);

  // Fallback for schemas without email column.
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
    // Update user with Google info if not already set
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        google_picture: picture,
        google_name: name,
        auth_provider: 'google'
      })
      .eq('id', existingUser[0].id);

    if (updateError && !isMissingColumnError(updateError)) {
      throw updateError;
    }
    
    return existingUser[0];
  }

  // Create new user
  const googleInsertPayload = {
    username,
    email,
    google_picture: picture,
    google_name: name,
    auth_provider: 'google',
    password_hash: 'google_oauth', // Placeholder for OAuth users
  };

  let { data: newUser, error } = await supabase
    .from('users')
    .insert([googleInsertPayload])
    .select('*')
    .single();

  // Fallback for schemas that don't yet have OAuth-specific columns.
  if (error && isMissingColumnError(error)) {
    ({ data: newUser, error } = await supabase
      .from('users')
      .insert([{
        username,
        password_hash: 'google_oauth',
      }])
      .select('*')
      .single());
  }

  if (error) {
    console.error('Error creating user:', error);
    throw error;
  }

  return newUser;
}

// Update user's Patreon subscription
async function updatePatreonSubscription(userId, patreonData) {
  let tier = null;
  let patreonId = patreonData.data?.id || null;
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
      is_patron: isPatron
    })
    .eq('id', userId);
}

function getUserFromAuthHeader(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization;
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

// Main auth handler
exports.handler = async function(event) {
  const baseUrl = getBaseUrl(event);
  const path = event.path || '';
  const route = path.replace('/.netlify/functions/auth', '');
  const queryParams = event.queryStringParameters || {};
  const action = queryParams.action;

  try {
    // Google OAuth start
    if (action === 'google' || route === '/google' || path === '/auth/google') {
      console.log('[auth/google] redirect_uri=%s client_id=%s host=%s path=%s', GOOGLE_REDIRECT_URI, maskClientId(GOOGLE_CLIENT_ID), event.headers.host, path);
      const state = jwt.sign({ purpose: 'google' }, JWT_SECRET, { expiresIn: '10m' });
      const authUrl = getGoogleAuthUrl(state);
      return { statusCode: 302, headers: { Location: authUrl } };
    }

    // OAuth callback (Google and Patreon)
    if (action === 'callback' || route === '/callback' || path === '/auth/callback' || (queryParams.code && queryParams.state)) {
      const { code, state } = queryParams;

      if (!code || !state) {
        return { statusCode: 400, body: JSON.stringify({ error: 'missing_params' }) };
      }

      // Verify state
      let decoded;
      try {
        decoded = jwt.verify(state, JWT_SECRET);
      } catch (e) {
        return { statusCode: 400, body: JSON.stringify({ error: 'invalid_state' }) };
      }

      if (decoded.purpose === 'google') {
        // Exchange code for tokens
        const tokens = await exchangeGoogleCode(code);
        const googleUser = await getGoogleUserInfo(tokens.access_token);

        // Find or create user
        const user = await findOrCreateGoogleUser(googleUser);

        // Generate JWT
        const token = jwt.sign(
          { userId: user.id, username: user.username, email: user.email || null },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        // Redirect to app with token
        return {
          statusCode: 302,
          headers: {
            Location: `${baseUrl}?token=${token}&auth=google`
          }
        };
      }

      if (decoded.purpose === 'patreon') {
        let userDecoded;
        try {
          userDecoded = jwt.verify(decoded.token, JWT_SECRET);
        } catch (e) {
          return { statusCode: 401, body: JSON.stringify({ error: 'invalid_token' }) };
        }

        // Exchange code for tokens
        const tokens = await exchangePatreonCode(code);
        const patreonData = await getPatreonUserInfo(tokens.access_token);

        // Update user's Patreon subscription
        await updatePatreonSubscription(userDecoded.userId, patreonData);

        return {
          statusCode: 302,
          headers: {
            Location: `${baseUrl}?patreon=connected`
          }
        };
      }

      return { statusCode: 400, body: JSON.stringify({ error: 'invalid_state_purpose' }) };
    }

    // Patreon OAuth start
    if (action === 'patreon' || route === '/patreon' || path === '/auth/patreon') {
      const { token } = queryParams;
      if (!token) {
        return { statusCode: 401, body: JSON.stringify({ error: 'unauthorized' }) };
      }
      console.log('[auth/patreon] redirect_uri=%s client_id=%s host=%s path=%s', PATREON_REDIRECT_URI, maskClientId(PATREON_CLIENT_ID), event.headers.host, path);
      const state = jwt.sign({ purpose: 'patreon', token }, JWT_SECRET, { expiresIn: '10m' });
      const authUrl = getPatreonAuthUrl(state);
      return { statusCode: 302, headers: { Location: authUrl } };
    }

    // Patreon OAuth callback
    if (action === 'patreon_callback' || route === '/patreon/callback' || path === '/patreon/callback') {
      const { code, state } = queryParams;

      if (!code || !state) {
        return { statusCode: 400, body: JSON.stringify({ error: 'missing_params' }) };
      }

      // Verify state
      let decoded;
      try {
        decoded = jwt.verify(state, JWT_SECRET);
      } catch (e) {
        return { statusCode: 400, body: JSON.stringify({ error: 'invalid_state' }) };
      }

      if (decoded.purpose !== 'patreon') {
        return { statusCode: 400, body: JSON.stringify({ error: 'invalid_state_purpose' }) };
      }

      let userDecoded;
      try {
        userDecoded = jwt.verify(decoded.token, JWT_SECRET);
      } catch (e) {
        return { statusCode: 401, body: JSON.stringify({ error: 'invalid_token' }) };
      }

      // Exchange code for tokens
      const tokens = await exchangePatreonCode(code);
      const patreonData = await getPatreonUserInfo(tokens.access_token);

      // Update user's Patreon subscription
      await updatePatreonSubscription(userDecoded.userId, patreonData);

      return {
        statusCode: 302,
        headers: {
          Location: `${baseUrl}?patreon=connected`
        }
      };
    }

    // Get user subscription status
    if (action === 'subscription' || route === '/subscription' || path === '/auth/subscription') {
      const userDecoded = getUserFromAuthHeader(event);
      if (!userDecoded) {
        return { statusCode: 401, body: JSON.stringify({ error: 'unauthorized' }) };
      }

      const { data: user } = await supabase
        .from('users')
        .select('patreon_tier, is_patron')
        .eq('id', userDecoded.userId)
        .single();

      return { statusCode: 200, body: JSON.stringify(user || {}) };
    }

    // User profile: read and update display nickname.
    if (action === 'profile' || route === '/profile' || path === '/auth/profile') {
      const userDecoded = getUserFromAuthHeader(event);
      if (!userDecoded) {
        return { statusCode: 401, body: JSON.stringify({ error: 'unauthorized' }) };
      }

      if (event.httpMethod === 'GET') {
        const { data: user, error } = await supabase
          .from('users')
          .select('id, username, email')
          .eq('id', userDecoded.userId)
          .single();

        if (error) {
          console.error(error);
          return { statusCode: 500, body: JSON.stringify({ error: 'db_error' }) };
        }

        return { statusCode: 200, body: JSON.stringify({ user }) };
      }

      if (event.httpMethod === 'PATCH') {
        const body = JSON.parse(event.body || '{}');
        const username = normalizeUsername(body.username);

        if (username.length < 2 || username.length > 32) {
          return { statusCode: 400, body: JSON.stringify({ error: 'invalid_username' }) };
        }

        const { data: existing, error: existingError } = await supabase
          .from('users')
          .select('id')
          .eq('username', username)
          .neq('id', userDecoded.userId)
          .limit(1);

        if (existingError) {
          console.error(existingError);
          return { statusCode: 500, body: JSON.stringify({ error: 'db_error' }) };
        }

        if (existing && existing.length > 0) {
          return { statusCode: 409, body: JSON.stringify({ error: 'username_taken' }) };
        }

        const { data: updatedUser, error } = await supabase
          .from('users')
          .update({ username })
          .eq('id', userDecoded.userId)
          .select('id, username, email')
          .single();

        if (error) {
          console.error(error);
          return { statusCode: 500, body: JSON.stringify({ error: 'db_error' }) };
        }

        const token = jwt.sign(
          { userId: updatedUser.id, username: updatedUser.username, email: updatedUser.email || null },
          JWT_SECRET,
          { expiresIn: '7d' },
        );

        return { statusCode: 200, body: JSON.stringify({ token, user: updatedUser }) };
      }

      return { statusCode: 405, body: JSON.stringify({ error: 'method_not_allowed' }) };
    }

    return { statusCode: 404, body: JSON.stringify({ error: 'not_found' }) };

  } catch (err) {
    const axiosPayload = err.response ? getAxiosErrorPayload(err) : null;
    console.error('Auth error:', axiosPayload || err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'server_error',
        message: err.message,
        providerStatus: axiosPayload?.status || undefined,
        providerError: axiosPayload?.data || undefined,
      }),
    };
  }
};

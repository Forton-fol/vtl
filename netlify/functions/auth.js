const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const JWT_SECRET = process.env.NETLIFY_JWT_SECRET || 'dev_secret';

// Google OAuth credentials
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'https://vtmlist.netlify.app/.netlify/functions/auth/callback';

// Patreon credentials
const PATREON_CLIENT_ID = process.env.PATREON_CLIENT_ID;
const PATREON_CLIENT_SECRET = process.env.PATREON_CLIENT_SECRET;
const PATREON_REDIRECT_URI = process.env.PATREON_REDIRECT_URI || 'https://vtmlist.netlify.app/.netlify/functions/patreon/callback';

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
  return 'https://vtmcl.netlify.app';
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
    scope: 'identity identity[email]',
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
  const response = await axios.post('https://www.patreon.com/api/oauth2/token', {
    code,
    client_id: PATREON_CLIENT_ID,
    client_secret: PATREON_CLIENT_SECRET,
    redirect_uri: PATREON_REDIRECT_URI,
    grant_type: 'authorization_code',
  });
  return response.data;
}

// Get Patreon user info and subscription
async function getPatreonUserInfo(accessToken) {
  const response = await axios.get('https://api.patreon.com/v2/identity?include=pledges', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
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
  let patreonId = null;
  let isPatron = false;

  if (patreonData.included && patreonData.included.length > 0) {
    const pledges = patreonData.included.filter(i => i.type === 'pledge');
    if (pledges.length > 0) {
      isPatron = true;
      // Get highest tier
      const highestPledge = pledges.reduce((max, p) => {
        return (p.attributes && p.attributes.amount_cents > (max?.attributes?.amount_cents || 0)) ? p : max;
      }, null);
      
      if (highestPledge) {
        tier = highestPledge.attributes.amount_cents >= 500 ? 'supporter' : 'basic';
      }
    }
  }

  // Get Patreon user ID from relationship
  if (patreonData.data && patreonData.data.relationships) {
    const patreonRel = patreonData.data.relationships.find(r => r.id);
    if (patreonRel) {
      patreonId = patreonRel.id;
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

// Main auth handler
exports.handler = async function(event) {
  const baseUrl = getBaseUrl(event);
  const path = event.path || '';
  const route = path.replace('/.netlify/functions/auth', '');
  const queryParams = event.queryStringParameters || {};

  try {
    // Google OAuth start
    if (route === '/google' || path === '/auth/google') {
      const state = jwt.sign({ purpose: 'google' }, JWT_SECRET, { expiresIn: '10m' });
      const authUrl = getGoogleAuthUrl(state);
      return { statusCode: 302, headers: { Location: authUrl } };
    }

    // Google OAuth callback
    if (route === '/callback' || path === '/auth/callback') {
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

    // Patreon OAuth start
    if (route === '/patreon' || path === '/auth/patreon') {
      const { token } = queryParams;
      if (!token) {
        return { statusCode: 401, body: JSON.stringify({ error: 'unauthorized' }) };
      }
      const state = jwt.sign({ purpose: 'patreon', token }, JWT_SECRET, { expiresIn: '10m' });
      const authUrl = getPatreonAuthUrl(state);
      return { statusCode: 302, headers: { Location: authUrl } };
    }

    // Patreon OAuth callback
    if (route === '/patreon/callback' || path === '/patreon/callback') {
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
    if (route === '/subscription' || path === '/auth/subscription') {
      const authHeader = event.headers.authorization;
      if (!authHeader) {
        return { statusCode: 401, body: JSON.stringify({ error: 'unauthorized' }) };
      }

      const token = authHeader.replace('Bearer ', '');
      let userDecoded;
      try {
        userDecoded = jwt.verify(token, JWT_SECRET);
      } catch (e) {
        return { statusCode: 401, body: JSON.stringify({ error: 'invalid_token' }) };
      }

      const { data: user } = await supabase
        .from('users')
        .select('patreon_tier, is_patron')
        .eq('id', userDecoded.userId)
        .single();

      return { statusCode: 200, body: JSON.stringify(user || {}) };
    }

    return { statusCode: 404, body: JSON.stringify({ error: 'not_found' }) };

  } catch (err) {
    console.error('Auth error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'server_error', message: err.message }) };
  }
};
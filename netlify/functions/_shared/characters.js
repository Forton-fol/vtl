const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const JWT_SECRET = process.env.NETLIFY_JWT_SECRET || 'dev_secret';
const DEFAULT_CHARACTER_LIMIT = Number(process.env.DEFAULT_CHARACTER_LIMIT || 100);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

function getBearerToken(event) {
  const auth = event.headers && (event.headers.authorization || event.headers.Authorization);
  if (!auth) {
    return null;
  }

  const [scheme, token] = auth.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

function getUserFromEvent(event) {
  const token = getBearerToken(event);
  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

function normalizeCharacterPayload(body) {
  const data = body.data ?? body.sheet_data;
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const preset = typeof body.preset === 'string' ? body.preset.trim() : '';

  return {
    id: typeof body.id === 'string' && body.id.trim() ? body.id.trim() : null,
    name: name || 'Unnamed character',
    preset,
    data,
  };
}

async function getCharacterLimit(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('character_limit, is_patron, patreon_tier')
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  if (typeof data?.character_limit === 'number') {
    return data.character_limit;
  }

  if (data?.is_patron || data?.patreon_tier) {
    return Number(process.env.PATRON_CHARACTER_LIMIT || 500);
  }

  return DEFAULT_CHARACTER_LIMIT;
}

async function countCharacters(userId) {
  const { count, error } = await supabase
    .from('sheets')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) {
    throw error;
  }

  return count || 0;
}

function toCharacterResponse(sheet, sheetData) {
  return {
    id: sheet.id,
    name: sheet.name,
    preset: sheet.preset,
    created_at: sheet.created_at,
    updated_at: sheet.updated_at,
    data: sheetData?.data ?? null,
  };
}

module.exports = {
  supabase,
  json,
  getUserFromEvent,
  normalizeCharacterPayload,
  getCharacterLimit,
  countCharacters,
  toCharacterResponse,
};

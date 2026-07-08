const {
  getUserFromRequest,
  getCharacterLimit,
  supabase,
} = require('./_shared/characters');
const { getQuery, sendJSON } = require('../lib/vercelHelpers');

function parsePositiveInt(value, fallback, max) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  return Math.min(Math.floor(parsed), max);
}

function parseOffset(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }
  return Math.floor(parsed);
}

module.exports = async (req, res) => {
  try {
    if (req.method !== 'GET') {
      sendJSON(res, 405, { error: 'method_not_allowed' });
      return;
    }

    const user = getUserFromRequest(req);
    if (!user?.userId) {
      sendJSON(res, 401, { error: 'unauthorized' });
      return;
    }

    const query = getQuery(req);
    const limit = parsePositiveInt(query.limit, 50, 100);
    const offset = parseOffset(query.offset);
    const from = offset;
    const to = offset + limit - 1;

    const [characterLimit, sheetResult] = await Promise.all([
      getCharacterLimit(user.userId),
      supabase
        .from('sheets')
        .select('id, name, preset, created_at, updated_at', { count: 'exact' })
        .eq('user_id', user.userId)
        .order('updated_at', { ascending: false })
        .range(from, to),
    ]);

    if (sheetResult.error) {
      console.error(sheetResult.error);
      sendJSON(res, 500, { error: 'db_error' });
      return;
    }

    sendJSON(res, 200, {
      characters: sheetResult.data || [],
      total: sheetResult.count || 0,
      characterLimit,
      limit,
      offset,
    });
  } catch (err) {
    console.error(err);
    sendJSON(res, 500, { error: 'server_error' });
  }
};

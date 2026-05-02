const {
  supabase,
  json,
  getUserFromEvent,
  getCharacterLimit,
} = require('./_shared/characters');

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

exports.handler = async function(event) {
  try {
    if (event.httpMethod !== 'GET') {
      return json(405, { error: 'method_not_allowed' });
    }

    const user = getUserFromEvent(event);
    if (!user?.userId) {
      return json(401, { error: 'unauthorized' });
    }

    const params = event.queryStringParameters || {};
    const limit = parsePositiveInt(params.limit, 50, 100);
    const offset = parseOffset(params.offset);
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
      return json(500, { error: 'db_error' });
    }

    return json(200, {
      characters: sheetResult.data || [],
      total: sheetResult.count || 0,
      characterLimit,
      limit,
      offset,
    });
  } catch (err) {
    console.error(err);
    return json(500, { error: 'server_error' });
  }
};

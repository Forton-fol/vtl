const {
  countCharacters,
  getCharacterLimit,
  normalizeCharacterPayload,
  getUserFromRequest,
  toCharacterResponse,
  supabase,
} = require('./_shared/characters');
const { parseJSONBody, sendJSON } = require('../lib/vercelHelpers');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      sendJSON(res, 405, { error: 'method_not_allowed' });
      return;
    }

    const user = getUserFromRequest(req);
    if (!user?.userId) {
      sendJSON(res, 401, { error: 'unauthorized' });
      return;
    }

    const body = await parseJSONBody(req);
    const payload = normalizeCharacterPayload(body);

    if (!payload.data || typeof payload.data !== 'object' || Array.isArray(payload.data)) {
      sendJSON(res, 400, { error: 'data_required' });
      return;
    }

    if (payload.id) {
      const { data: updatedSheet, error } = await supabase
        .from('sheets')
        .update({ name: payload.name, preset: payload.preset })
        .eq('id', payload.id)
        .eq('user_id', user.userId)
        .select('id, name, preset, created_at, updated_at')
        .single();

      if (error) {
        console.error(error);
        sendJSON(res, error.code === 'PGRST116' ? 404 : 500, {
          error: error.code === 'PGRST116' ? 'not_found' : 'db_error',
        });
        return;
      }

      const { data: updatedData, error: dataError } = await supabase
        .from('sheet_data')
        .upsert({ sheet_id: payload.id, data: payload.data }, { onConflict: 'sheet_id' })
        .select('data')
        .single();

      if (dataError) {
        console.error(dataError);
        sendJSON(res, 500, { error: 'db_error' });
        return;
      }

      sendJSON(res, 200, { character: toCharacterResponse(updatedSheet, updatedData) });
      return;
    }

    const [characterLimit, characterCount] = await Promise.all([
      getCharacterLimit(user.userId),
      countCharacters(user.userId),
    ]);

    if (characterLimit !== null && characterCount >= characterLimit) {
      sendJSON(res, 403, {
        error: 'character_limit_reached',
        limit: characterLimit,
        count: characterCount,
      });
      return;
    }

    const { data: insertedSheet, error } = await supabase
      .from('sheets')
      .insert([{ user_id: user.userId, name: payload.name, preset: payload.preset }])
      .select('id, name, preset, created_at, updated_at')
      .single();

    if (error) {
      console.error(error);
      sendJSON(res, 500, { error: 'db_error' });
      return;
    }

    const { data: insertedData, error: dataError } = await supabase
      .from('sheet_data')
      .insert([{ sheet_id: insertedSheet.id, data: payload.data }])
      .select('data')
      .single();

    if (dataError) {
      console.error(dataError);
      await supabase
        .from('sheets')
        .delete()
        .eq('id', insertedSheet.id)
        .eq('user_id', user.userId);
      sendJSON(res, 500, { error: 'db_error' });
      return;
    }

    sendJSON(res, 201, { character: toCharacterResponse(insertedSheet, insertedData) });
  } catch (err) {
    console.error(err);
    sendJSON(res, 500, { error: 'server_error' });
  }
};

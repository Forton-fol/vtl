const {
  supabase,
  json,
  getUserFromEvent,
  normalizeCharacterPayload,
  getCharacterLimit,
  countCharacters,
  toCharacterResponse,
} = require('./_shared/characters');

exports.handler = async function(event) {
  try {
    if (event.httpMethod !== 'POST') {
      return json(405, { error: 'method_not_allowed' });
    }

    const user = getUserFromEvent(event);
    if (!user?.userId) {
      return json(401, { error: 'unauthorized' });
    }

    const userId = user.userId;
    const payload = normalizeCharacterPayload(JSON.parse(event.body || '{}'));

    if (!payload.data || typeof payload.data !== 'object' || Array.isArray(payload.data)) {
      return json(400, { error: 'data_required' });
    }

    if (payload.id) {
      const { data: updatedSheet, error } = await supabase
        .from('sheets')
        .update({ name: payload.name, preset: payload.preset })
        .eq('id', payload.id)
        .eq('user_id', userId)
        .select('id, name, preset, created_at, updated_at')
        .single();

      if (error) {
        console.error(error);
        return json(error.code === 'PGRST116' ? 404 : 500, { error: error.code === 'PGRST116' ? 'not_found' : 'db_error' });
      }

      const { data: updatedData, error: dataError } = await supabase
        .from('sheet_data')
        .upsert({ sheet_id: payload.id, data: payload.data }, { onConflict: 'sheet_id' })
        .select('data')
        .single();

      if (dataError) {
        console.error(dataError);
        return json(500, { error: 'db_error' });
      }

      return json(200, { character: toCharacterResponse(updatedSheet, updatedData) });
    }

    const [characterLimit, characterCount] = await Promise.all([
      getCharacterLimit(userId),
      countCharacters(userId),
    ]);

    if (characterLimit !== null && characterCount >= characterLimit) {
      return json(403, {
        error: 'character_limit_reached',
        limit: characterLimit,
        count: characterCount,
      });
    }

    const { data: insertedSheet, error } = await supabase
      .from('sheets')
      .insert([{ user_id: userId, name: payload.name, preset: payload.preset }])
      .select('id, name, preset, created_at, updated_at')
      .single();

    if (error) {
      console.error(error);
      return json(500, { error: 'db_error' });
    }

    const { data: insertedData, error: dataError } = await supabase
      .from('sheet_data')
      .insert([{ sheet_id: insertedSheet.id, data: payload.data }])
      .select('data')
      .single();

    if (dataError) {
      console.error(dataError);
      await supabase.from('sheets').delete().eq('id', insertedSheet.id).eq('user_id', userId);
      return json(500, { error: 'db_error' });
    }

    return json(201, { character: toCharacterResponse(insertedSheet, insertedData) });
  } catch (err) {
    console.error(err);
    return json(500, { error: 'server_error' });
  }
};

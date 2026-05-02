const {
  supabase,
  json,
  getUserFromEvent,
  toCharacterResponse,
} = require('./_shared/characters');

exports.handler = async function(event) {
  try {
    if (event.httpMethod !== 'GET') {
      return json(405, { error: 'method_not_allowed' });
    }

    const user = getUserFromEvent(event);
    if (!user?.userId) {
      return json(401, { error: 'unauthorized' });
    }

    const { id } = event.queryStringParameters || {};
    if (!id) {
      return json(400, { error: 'id_required' });
    }

    const { data: sheet, error: sheetError } = await supabase
      .from('sheets')
      .select('id, name, preset, created_at, updated_at')
      .eq('id', id)
      .eq('user_id', user.userId)
      .single();

    if (sheetError) {
      console.error(sheetError);
      return json(sheetError.code === 'PGRST116' ? 404 : 500, { error: sheetError.code === 'PGRST116' ? 'not_found' : 'db_error' });
    }

    const { data: sheetData, error: dataError } = await supabase
      .from('sheet_data')
      .select('data')
      .eq('sheet_id', id)
      .single();

    if (dataError) {
      console.error(dataError);
      return json(dataError.code === 'PGRST116' ? 404 : 500, { error: dataError.code === 'PGRST116' ? 'not_found' : 'db_error' });
    }

    return json(200, { character: toCharacterResponse(sheet, sheetData) });
  } catch (err) {
    console.error(err);
    return json(500, { error: 'server_error' });
  }
};

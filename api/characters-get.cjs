const {
  getUserFromRequest,
  toCharacterResponse,
  supabase,
} = require('./_shared/characters');
const { getQuery, sendJSON } = require('../lib/vercelHelpers.cjs');

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
    const { id } = query;
    if (!id) {
      sendJSON(res, 400, { error: 'id_required' });
      return;
    }

    const { data: sheet, error: sheetError } = await supabase
      .from('sheets')
      .select('id, name, preset, created_at, updated_at')
      .eq('id', id)
      .eq('user_id', user.userId)
      .single();

    if (sheetError) {
      console.error(sheetError);
      sendJSON(res, sheetError.code === 'PGRST116' ? 404 : 500, {
        error: sheetError.code === 'PGRST116' ? 'not_found' : 'db_error',
      });
      return;
    }

    const { data: sheetData, error: dataError } = await supabase
      .from('sheet_data')
      .select('data')
      .eq('sheet_id', id)
      .single();

    if (dataError) {
      console.error(dataError);
      sendJSON(res, dataError.code === 'PGRST116' ? 404 : 500, {
        error: dataError.code === 'PGRST116' ? 'not_found' : 'db_error',
      });
      return;
    }

    sendJSON(res, 200, { character: toCharacterResponse(sheet, sheetData) });
  } catch (err) {
    console.error(err);
    sendJSON(res, 500, { error: 'server_error' });
  }
};

const { getUserFromRequest, supabase } = require('./_shared/characters');
const { getQuery, sendJSON } = require('../lib/vercelHelpers');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'DELETE') {
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

    const { data, error } = await supabase
      .from('sheets')
      .delete()
      .eq('id', id)
      .eq('user_id', user.userId)
      .select('id')
      .single();

    if (error) {
      console.error(error);
      sendJSON(res, error.code === 'PGRST116' ? 404 : 500, {
        error: error.code === 'PGRST116' ? 'not_found' : 'db_error',
      });
      return;
    }

    sendJSON(res, 200, { ok: true, id: data.id });
  } catch (err) {
    console.error(err);
    sendJSON(res, 500, { error: 'server_error' });
  }
};

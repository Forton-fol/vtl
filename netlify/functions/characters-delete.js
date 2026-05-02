const {
  supabase,
  json,
  getUserFromEvent,
} = require('./_shared/characters');

exports.handler = async function(event) {
  try {
    if (event.httpMethod !== 'DELETE') {
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

    const { data, error } = await supabase
      .from('sheets')
      .delete()
      .eq('id', id)
      .eq('user_id', user.userId)
      .select('id')
      .single();

    if (error) {
      console.error(error);
      return json(error.code === 'PGRST116' ? 404 : 500, { error: error.code === 'PGRST116' ? 'not_found' : 'db_error' });
    }

    return json(200, { ok: true, id: data.id });
  } catch (err) {
    console.error(err);
    return json(500, { error: 'server_error' });
  }
};

const { handle } = require('./_netlifyWrapper');
const auth = require('../netlify/functions/auth');

module.exports = (req, res) => handle(req, res, auth.handler);

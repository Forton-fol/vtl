const { handle } = require('./_netlifyWrapper');
const login = require('../netlify/functions/login');

module.exports = (req, res) => handle(req, res, login.handler);

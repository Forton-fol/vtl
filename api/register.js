const { handle } = require('./_netlifyWrapper');
const register = require('../netlify/functions/register');

module.exports = (req, res) => handle(req, res, register.handler);

const { handle } = require('./_netlifyWrapper');
const get = require('../netlify/functions/characters-get');

module.exports = (req, res) => handle(req, res, get.handler, '/.netlify/functions/characters-get');

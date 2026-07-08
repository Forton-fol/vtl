const { handle } = require('./_netlifyWrapper');
const list = require('../netlify/functions/characters-list');

module.exports = (req, res) => handle(req, res, list.handler, '/.netlify/functions/characters-list');

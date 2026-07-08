const { handle } = require('./_netlifyWrapper');
const del = require('../netlify/functions/characters-delete');

module.exports = (req, res) => handle(req, res, del.handler);

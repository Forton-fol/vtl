const { handle } = require('./_netlifyWrapper');
const save = require('../netlify/functions/characters-save');

module.exports = (req, res) => handle(req, res, save.handler, '/.netlify/functions/characters-save');

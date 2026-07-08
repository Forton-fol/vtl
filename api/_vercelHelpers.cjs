const { URL } = require('url');

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      resolve(body);
    });
    req.on('error', reject);
  });
}

async function parseJSONBody(req) {
  const raw = await getRawBody(req);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function getQuery(req) {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const query = {};

  for (const [key, value] of url.searchParams.entries()) {
    if (query[key] !== undefined) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  }

  return query;
}

function getBaseUrl(req) {
  const headers = req.headers || {};
  const origin = headers.origin;
  const proto = headers['x-forwarded-proto'] || headers['x-vercel-proto'] || 'https';
  const host = headers['x-forwarded-host'] || headers.host || 'localhost';

  if (origin) {
    return origin;
  }

  return `${proto}://${host}`;
}

function sendJSON(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

function sendRedirect(res, url, status = 302) {
  res.writeHead(status, { Location: url });
  res.end();
}

module.exports = {
  parseJSONBody,
  getQuery,
  getBaseUrl,
  sendJSON,
  sendRedirect,
};

const { URL } = require('url');

async function getRawBody(req) {
  if (req.body !== undefined) {
    return typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  }

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

function buildEvent(req) {
  const url = new URL(req.url, `http://${req.headers.host}`);
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

  return {
    httpMethod: req.method,
    path: url.pathname,
    headers: req.headers,
    queryStringParameters: Object.keys(query).length ? query : null,
    body: undefined,
  };
}

async function handle(req, res, handler) {
  const event = buildEvent(req);
  event.body = await getRawBody(req);

  const result = await handler(event);

  if (result.headers) {
    for (const [name, value] of Object.entries(result.headers)) {
      if (value !== undefined) {
        res.setHeader(name, value);
      }
    }
  }

  res.statusCode = result.statusCode || 200;
  res.end(result.body);
}

module.exports = { handle };

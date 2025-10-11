export async function register(username: string, password: string) {
  const resp = await fetch('/.netlify/functions/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return resp.json();
}

export async function login(username: string, password: string) {
  const resp = await fetch('/.netlify/functions/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return resp.json();
}

export function saveToken(token: string) {
  localStorage.setItem('vtm_token', token);
}

export function getToken() {
  return localStorage.getItem('vtm_token');
}

export function removeToken() {
  localStorage.removeItem('vtm_token');
}

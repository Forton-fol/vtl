import { getToken } from './auth';

function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function listCharacters() {
  const resp = await fetch('/.netlify/functions/characters-list', {
    method: 'GET',
    headers: authHeaders(),
  });
  return resp.json();
}

export async function saveCharacter(payload: any) {
  const resp = await fetch('/.netlify/functions/characters-save', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return resp.json();
}

export async function deleteCharacter(id: string) {
  const resp = await fetch(`/.netlify/functions/characters-delete?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return resp.json();
}

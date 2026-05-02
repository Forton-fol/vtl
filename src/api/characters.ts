import { getToken } from './auth';

const characterCache = new Map<string, any>();

function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function listCharacters(params: { limit?: number; offset?: number } = {}) {
  const query = new URLSearchParams();
  if (params.limit) query.set('limit', String(params.limit));
  if (params.offset) query.set('offset', String(params.offset));
  const suffix = query.toString() ? `?${query.toString()}` : '';

  const resp = await fetch(`/.netlify/functions/characters-list${suffix}`, {
    method: 'GET',
    headers: authHeaders(),
  });
  return resp.json();
}

export async function getCharacter(id: string) {
  const cached = characterCache.get(id);
  if (cached) {
    return { character: cached, cached: true };
  }

  const resp = await fetch(`/.netlify/functions/characters-get?id=${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: authHeaders(),
  });
  const result = await resp.json();

  if (result?.character) {
    characterCache.set(id, result.character);
  }

  return result;
}

export async function saveCharacter(payload: any) {
  const resp = await fetch('/.netlify/functions/characters-save', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const result = await resp.json();

  if (result?.character?.id) {
    characterCache.set(result.character.id, result.character);
  }

  return result;
}

export async function deleteCharacter(id: string) {
  const resp = await fetch(`/.netlify/functions/characters-delete?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const result = await resp.json();
  if (result?.ok) {
    characterCache.delete(id);
  }
  return result;
}

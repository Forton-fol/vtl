export async function register(username: string, password: string, captchaToken?: string) {
  const resp = await fetch('/.netlify/functions/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, captchaToken }),
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

// Google OAuth login - redirects to Google auth page
export function googleLogin() {
  window.location.href = '/.netlify/functions/auth?action=google';
}

// Connect Patreon account
export async function connectPatreon() {
  const token = getToken();
  if (!token) {
    return { error: 'not_authenticated' };
  }
  window.location.href = `/.netlify/functions/auth?action=patreon&token=${token}`;
}

// Get subscription status
export async function getSubscriptionStatus() {
  const token = getToken();
  if (!token) {
    return { error: 'not_authenticated' };
  }
  
  const resp = await fetch('/.netlify/functions/auth?action=subscription', {
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  return resp.json();
}

export function saveToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('vtm_token', token);
  }
}

export function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('vtm_token');
  }
  return null;
}

export function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('vtm_token');
  }
}

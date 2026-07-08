export async function register(username: string, password: string, captchaToken?: string) {
  const resp = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, captchaToken }),
  });
  return resp.json();
}

export async function login(username: string, password: string) {
  const resp = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return resp.json();
}

// Google OAuth login - redirects to Google auth page
export function googleLogin() {
  window.location.href = '/api/auth?action=google';
}

// Connect Patreon account
export async function connectPatreon() {
  const token = getToken();
  if (!token) {
    return { error: 'not_authenticated' };
  }

  const resp = await fetch('/api/auth?action=patreon-start', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const result = await resp.json();

  if (result?.authUrl) {
    window.location.href = result.authUrl;
  }

  return result;
}

// Get subscription status
export async function getSubscriptionStatus() {
  const token = getToken();
  if (!token) {
    return { error: 'not_authenticated' };
  }
  
  const resp = await fetch('/api/auth?action=subscription', {
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  return resp.json();
}

export async function getProfile() {
  const token = getToken();
  if (!token) {
    return { error: 'not_authenticated' };
  }

  const resp = await fetch('/api/auth?action=profile', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return resp.json();
}

export async function updateProfile(username: string) {
  const token = getToken();
  if (!token) {
    return { error: 'not_authenticated' };
  }

  const resp = await fetch('/api/auth?action=profile', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ username }),
  });
  return resp.json();
}

export function saveToken(token: string) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('vtm_token', token);
    } catch (error) {
      console.error('Failed to save auth token', error);
    }
  }
}

export function getToken() {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem('vtm_token');
    } catch (error) {
      console.error('Failed to read auth token', error);
      return null;
    }
  }
  return null;
}

export function removeToken() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('vtm_token');
    } catch (error) {
      console.error('Failed to remove auth token', error);
    }
  }
}

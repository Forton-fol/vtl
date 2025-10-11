import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/cjs/Button';
import Form from 'react-bootstrap/cjs/Form';
import { useTranslation } from 'react-i18next';
import { register, login, saveToken, getToken, removeToken } from '../../../api/auth';

export function AuthSection(): JSX.Element {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      // we don't decode token here; just mark logged in
      setUser('user');
    }
  }, []);

  async function doRegister(e) {
    e.preventDefault();
    const res = await register(username, password);
    if (res && res.user) {
      alert('registered');
      setMode('login');
    } else if (res && res.error === 'username_taken') {
      alert('username taken');
    } else {
      alert('error');
    }
  }

  async function doLogin(e) {
    e.preventDefault();
    const res = await login(username, password);
    if (res && res.token) {
      saveToken(res.token);
      setUser(res.user.username || 'user');
    } else {
      alert('invalid credentials');
    }
  }

  function doLogout() {
    removeToken();
    setUser(null);
  }

  if (user) {
    return (
      <div className="tw-p-2">
        <div>{t('common.ok')}: {user}</div>
        <Button variant="outline-secondary" onClick={doLogout}>{t('common.cancel')}</Button>
      </div>
    );
  }

  return (
    <div className="tw-p-2">
      <Form onSubmit={mode === 'login' ? doLogin : doRegister}>
        <Form.Group className="mb-2">
          <Form.Control placeholder={t('common.rename') as string} value={username} onChange={(e) => setUsername((e.target as HTMLInputElement).value)} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword((e.target as HTMLInputElement).value)} />
        </Form.Group>
        <div className="tw-flex tw-gap-2">
          <Button type="submit" variant="outline-primary">{mode === 'login' ? 'Login' : 'Register'}</Button>
          <Button variant="link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Go to register' : 'Go to login'}</Button>
        </div>
      </Form>
    </div>
  );
}

export default AuthSection;

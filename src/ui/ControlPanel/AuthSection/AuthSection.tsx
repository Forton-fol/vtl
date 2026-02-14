import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { register, login, saveToken, getToken, removeToken } from '../../../api/auth';

export function AuthSection(): JSX.Element {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setUser('user');
    }
  }, []);

  async function doRegister(e: React.FormEvent<HTMLFormElement>) {
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

  async function doLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await login(username, password);
    if (res && res.token) {
      saveToken(res.token);
      setUser(res.user.username || 'user');
      setShowForm(false);
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
      <div className="tw-flex tw-items-center tw-gap-1">
        <span className="nav-item-btn" style={{ cursor: 'default' }}>
          <FontAwesomeIcon icon={faUser} />
          <span>{user}</span>
        </span>
        <button className="nav-item-btn" onClick={doLogout} title="Logout">
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </div>
    );
  }

  return (
    <div className="tw-relative">
      <button className="nav-item-btn" onClick={() => setShowForm(!showForm)}>
        <FontAwesomeIcon icon={faUser} />
        <span>Login</span>
      </button>
      {showForm && (
        <div className="settings-dropdown-panel" style={{ width: '18rem', right: 'auto', left: 0 }}>
          <form onSubmit={mode === 'login' ? doLogin : doRegister}>
            <div className="tw-mb-3">
              <input
                className="tw-w-full tw-px-3 tw-py-2 tw-rounded-lg tw-border tw-border-gray-600 tw-bg-gray-800 tw-text-white tw-text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="tw-mb-3">
              <input
                type="password"
                className="tw-w-full tw-px-3 tw-py-2 tw-rounded-lg tw-border tw-border-gray-600 tw-bg-gray-800 tw-text-white tw-text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="tw-flex tw-gap-2">
              <button type="submit" className="btn-modern btn-modern-primary tw-text-xs">
                {mode === 'login' ? 'Login' : 'Register'}
              </button>
              <button
                type="button"
                className="btn-modern btn-modern-ghost tw-text-xs"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              >
                {mode === 'login' ? 'Register' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AuthSection;

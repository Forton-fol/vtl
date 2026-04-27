import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { register, login, googleLogin, connectPatreon, saveToken, getToken, removeToken } from '../../../api/auth';

interface AuthSectionProps {
  mobile?: boolean;
}

export function AuthSection(props: AuthSectionProps): JSX.Element {
  const { mobile } = props;
  const { t } = useTranslation();
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (!showForm || mode !== 'register' || !turnstileSiteKey || !turnstileContainerRef.current) {
      return;
    }

    const windowWithTurnstile = window as Window & { turnstile?: any };
    const renderTurnstile = () => {
      if (!windowWithTurnstile.turnstile || !turnstileContainerRef.current) {
        return;
      }
      if (turnstileWidgetRef.current !== null) {
        windowWithTurnstile.turnstile.reset(turnstileWidgetRef.current);
        return;
      }
      turnstileWidgetRef.current = windowWithTurnstile.turnstile.render(turnstileContainerRef.current, {
        sitekey: turnstileSiteKey,
        theme: 'dark',
        callback: (token: string) => setCaptchaToken(token),
        'expired-callback': () => setCaptchaToken(''),
        'error-callback': () => setCaptchaToken(''),
      });
    };

    if (windowWithTurnstile.turnstile) {
      renderTurnstile();
      return;
    }

    const existingScript = document.getElementById('cf-turnstile-script') as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener('load', renderTurnstile, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = 'cf-turnstile-script';
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = renderTurnstile;
    document.head.appendChild(script);
  }, [showForm, mode, turnstileSiteKey]);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setUser('user');
    }
  }, []);

  async function doRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await register(username, password, captchaToken);
    if (res && res.user) {
      alert('registered');
      setMode('login');
      setCaptchaToken('');
    } else if (res && res.error === 'username_taken') {
      alert('username taken');
    } else if (res && (res.error === 'captcha_required' || res.error === 'captcha_failed')) {
      alert(t('register.captchaError') || 'Подтвердите, что вы не робот');
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
    setShowUserMenu(false);
  }

  async function doPatreonConnect() {
    const res = await connectPatreon();
    if (res && 'error' in res) {
      alert(t('register.login'));
    }
  }

  if (user) {
    return (
      <div className="tw-relative tw-flex tw-items-center tw-gap-1">
        <button
          className="nav-item-btn"
          onClick={() => setShowUserMenu((prev) => !prev)}
          title={user}
        >
          <FontAwesomeIcon icon={faUser} />
          <span>{user}</span>
        </button>

        {mobile && (
          <button className="nav-item-btn" onClick={doLogout} title={t('register.logout')}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>{t('register.logout')}</span>
          </button>
        )}

        {!mobile && showUserMenu && (
          <div
            className="settings-dropdown-panel"
            style={{ width: '14rem', right: 'auto', left: 0 }}
          >
            <div className="tw-flex tw-flex-col tw-gap-2">
              <button
                className="btn-modern btn-modern-danger tw-w-full tw-justify-start"
                onClick={doLogout}
                title={t('register.logout')}
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>{t('register.logout')}</span>
              </button>
              <button
                className="btn-modern btn-modern-ghost tw-w-full tw-justify-start"
                onClick={() => setShowUserMenu(false)}
                title={t('register.close')}
              >
                <span>{t('register.close')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="tw-relative tw-w-full">
      <button className="nav-item-btn" onClick={() => setShowForm(!showForm)}>
        <FontAwesomeIcon icon={faUser} />
        <span>{t('register.login')}</span>
      </button>
      {showForm && (
        <div
          className="settings-dropdown-panel"
          style={{
            width: mobile ? 'calc(100vw - 1rem)' : '18rem',
            maxWidth: 'calc(100vw - 1rem)',
            right: 0,
            left: 'auto',
          }}
        >
          <form onSubmit={mode === 'login' ? doLogin : doRegister}>
            <div className="tw-mb-3 tw-flex tw-flex-col tw-gap-2">
              <button
                type="button"
                className="btn-modern btn-modern-primary tw-w-full tw-justify-center"
                onClick={googleLogin}
              >
                {t('register.googleButton') || 'Войти через Google'}
              </button>
              <button
                type="button"
                className="btn-modern btn-modern-ghost tw-w-full tw-justify-center"
                onClick={doPatreonConnect}
              >
                {t('register.patreonButton') || 'Подключить Patreon'}
              </button>
            </div>
            <div className="tw-mb-3">
              <input
                className="tw-w-full tw-px-3 tw-py-2 tw-rounded-lg tw-border tw-border-gray-600 tw-bg-gray-800 tw-text-white tw-text-sm"
                placeholder={t('register.username')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="tw-mb-3">
              <input
                type="password"
                className="tw-w-full tw-px-3 tw-py-2 tw-rounded-lg tw-border tw-border-gray-600 tw-bg-gray-800 tw-text-white tw-text-sm"
                placeholder={t('register.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {mode === 'register' && turnstileSiteKey && (
              <div className="tw-mb-3">
                <div ref={turnstileContainerRef} />
              </div>
            )}
            <div className="tw-flex tw-gap-2 tw-flex-wrap">
              <button
                type="submit"
                className="btn-modern btn-modern-primary tw-text-xs tw-flex-1"
                disabled={mode === 'register' && !!turnstileSiteKey && !captchaToken}
              >
                {mode === 'login' ? t('register.login') : t('register.submit')}
              </button>
              <button
                type="button"
                className="btn-modern btn-modern-ghost tw-text-xs tw-flex-1"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              >
                {mode === 'login' ? t('register.switch-to-register') : t('register.switch-to-login')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AuthSection;

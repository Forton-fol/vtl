import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt, faCrown, faHeart } from "@fortawesome/free-solid-svg-icons";
import { register, login, googleLogin, connectPatreon, saveToken, getToken, removeToken, getSubscriptionStatus, getProfile, updateProfile } from '../../../api/auth';

interface AuthSectionProps {
  mobile?: boolean;
}

interface SubscriptionStatus {
  patreon_tier?: string | null;
  is_patron?: boolean;
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
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetRef = useRef<string | number | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(false);

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
    const params = new URLSearchParams(window.location.search);
    const tokenFromOAuth = params.get('token');
    const authFromOAuth = params.get('auth');
    const patreonConnected = params.get('patreon');
    
    if (tokenFromOAuth && authFromOAuth === 'google') {
      saveToken(tokenFromOAuth);
      loadProfile();
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    const token = getToken();
    if (token) {
      loadProfile();
    }
    
    if (patreonConnected === 'connected') {
      alert(t('register.patreonConnected') || 'Patreon подключен');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  async function loadProfile() {
    const res = await getProfile();
    if (res?.user?.username) {
      setUser(res.user.username);
      setNewUsername(res.user.username);
    } else {
      setUser('');
    }
  }

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
      setNewUsername(res.user.username || '');
      setShowForm(false);
    } else {
      alert('invalid credentials');
    }
  }

  function doLogout() {
    removeToken();
    setUser(null);
    setNewUsername('');
    setIsEditingUsername(false);
    setShowUserMenu(false);
  }

  async function doUpdateUsername(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await updateProfile(newUsername);

    if (res?.token && res?.user?.username) {
      saveToken(res.token);
      setUser(res.user.username);
      setNewUsername(res.user.username);
      setIsEditingUsername(false);
      return;
    }

    if (res?.error === 'username_taken') {
      alert(t('register.username-taken'));
      return;
    }

    alert(t('register.error'));
  }

  async function doPatreonConnect() {
    const res = await connectPatreon();
    if (res && 'error' in res) {
      alert(t('register.login'));
    }
  }

  // Fetch subscription status when user is logged in
  useEffect(() => {
    if (!user) {
      return;
    }
    
    async function fetchSubscription() {
      setLoadingSubscription(true);
      try {
        const status = await getSubscriptionStatus();
        if (status && !('error' in status)) {
          setSubscriptionStatus(status);
        }
      } catch (e) {
        console.error('Failed to fetch subscription:', e);
      } finally {
        setLoadingSubscription(false);
      }
    }
    
    fetchSubscription();
  }, [user]);

  // Get tier display name
  function getTierDisplay(tier: string | null | undefined): string {
    if (!tier) return '';
    switch (tier) {
      case 'supporter':
        return t('register.tierSupporter') || 'Supporter';
      case 'basic':
        return t('register.tierBasic') || 'Patron';
      default:
        return tier;
    }
  }

  if (user) {
    const isPatron = subscriptionStatus?.is_patron;
    const tier = subscriptionStatus?.patreon_tier;
    
    return (
      <div className="tw-relative tw-flex tw-items-center tw-gap-1">
        <button
          className="nav-item-btn"
          onClick={() => setShowUserMenu((prev) => !prev)}
          title={user}
        >
          <FontAwesomeIcon icon={isPatron ? faCrown : faUser} />
          <span>{user}</span>
          {isPatron && <FontAwesomeIcon icon={faHeart} className="tw-text-red-500 tw-ml-1" />}
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
            style={{ width: '18rem', right: 'auto', left: 0 }}
          >
            {/* User Info Section */}
            <div className="tw-p-3 tw-border-b tw-border-gray-600">
              <div className="tw-flex tw-items-center tw-gap-2 tw-mb-2">
                <FontAwesomeIcon icon={faUser} className="tw-text-gray-400" />
                <span className="tw-font-semibold tw-text-white">{user}</span>
              </div>

              {isEditingUsername ? (
                <form onSubmit={doUpdateUsername} className="tw-flex tw-gap-2 tw-mb-3">
                  <input
                    className="tw-min-w-0 tw-flex-1 tw-px-2 tw-py-1 tw-rounded tw-border tw-border-gray-600 tw-bg-gray-800 tw-text-white tw-text-sm"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    minLength={2}
                    maxLength={32}
                  />
                  <button type="submit" className="btn-modern btn-modern-primary tw-text-xs">
                    {t('register.save') || 'Save'}
                  </button>
                </form>
              ) : (
                <button
                  className="btn-modern btn-modern-ghost tw-w-full tw-justify-start tw-mb-3"
                  onClick={() => {
                    setNewUsername(user);
                    setIsEditingUsername(true);
                  }}
                >
                  {t('register.changeUsername') || 'Change name'}
                </button>
              )}
              
              {/* Subscription Status */}
              {loadingSubscription ? (
                <div className="tw-text-sm tw-text-gray-400">{t('register.loadingSubscription') || 'Загрузка...'}</div>
              ) : isPatron ? (
                <div className="tw-flex tw-items-center tw-gap-2 tw-bg-green-900/30 tw-rounded-lg tw-p-2">
                  <FontAwesomeIcon icon={faCrown} className="tw-text-yellow-400" />
                  <div className="tw-flex tw-flex-col">
                    <span className="tw-text-sm tw-font-semibold tw-text-green-400">
                      {getTierDisplay(tier)}
                    </span>
                    <span className="tw-text-xs tw-text-gray-400">
                      {t('register.patronStatus') || 'Активная подписка'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="tw-flex tw-items-center tw-gap-2 tw-bg-gray-800/50 tw-rounded-lg tw-p-2">
                  <FontAwesomeIcon icon={faHeart} className="tw-text-gray-500" />
                  <div className="tw-flex tw-flex-col">
                    <span className="tw-text-sm tw-text-gray-400">
                      {t('register.noSubscription') || 'Нет подписки'}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Patreon Connection */}
            <div className="tw-p-3 tw-border-b tw-border-gray-600">
              <div className="tw-text-xs tw-text-gray-400 tw-mb-2">
                {t('register.patreonSection') || 'Patreon'}
              </div>
              {!isPatron ? (
                <button
                  className="btn-modern btn-modern-primary tw-w-full tw-justify-center"
                  onClick={doPatreonConnect}
                >
                  <FontAwesomeIcon icon={faHeart} className="tw-mr-2" />
                  {t('register.connectPatreon') || 'Подключить Patreon'}
                </button>
              ) : (
                <button
                  className="btn-modern btn-modern-ghost tw-w-full tw-justify-center"
                  onClick={doPatreonConnect}
                >
                  <FontAwesomeIcon icon={faCrown} className="tw-mr-2" />
                  {t('register.managePatreon') || 'Управление подпиской'}
                </button>
              )}
            </div>
            
            {/* Logout Section */}
            <div className="tw-flex tw-flex-col tw-gap-2 tw-p-3">
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

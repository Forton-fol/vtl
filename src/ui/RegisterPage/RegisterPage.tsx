import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/cjs/Form';
import Button from 'react-bootstrap/cjs/Button';
import { register, login, googleLogin, connectPatreon, getSubscriptionStatus, saveToken, getToken } from '../../api/auth';

export function RegisterPage(): JSX.Element {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<{patreon_tier?: string; is_patron?: boolean} | null>(null);

  useEffect(() => {
    // Check URL for token from Google OAuth
    const hashParams = window.location.hash.startsWith('#')
      ? new URLSearchParams(window.location.hash.slice(1))
      : new URLSearchParams();
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') || hashParams.get('token');
    const auth = params.get('auth') || hashParams.get('auth');
    
    if (token && auth === 'google') {
      saveToken(token);
      // Clear URL params
      window.history.replaceState({}, '', '/');
      window.location.reload();
    }

    // Check for Patreon connection
    if (params.get('patreon') === 'connected') {
      window.history.replaceState({}, '', '/');
    }

    // Load subscription status if logged in
    const storedToken = getToken();
    if (storedToken) {
      getSubscriptionStatus().then(setSubscription);
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await register(username, password);
    if (res && res.user) {
      setMessage(t('register.success'));
    } else if (res && res.error === 'username_taken') {
      setMessage(t('register.username-taken'));
    } else {
      setMessage(t('register.error'));
    }
  }

  function handleGoogleLogin() {
    googleLogin();
  }

  function handleConnectPatreon() {
    connectPatreon();
  }

  return (
    <div className="tw-p-4 sm:tw-p-6 tw-w-full tw-overflow-x-hidden">
      <h2>{t('register.header')}</h2>
      
      {/* Google OAuth Section */}
      <div className="tw-mb-6 tw-p-4 tw-bg-gray-100 tw-rounded-lg tw-w-full">
        <h4 className="tw-mb-3">{t('register.googleSignIn') || 'Вход через Google'}</h4>
        <p className="tw-text-sm tw-text-gray-600 tw-mb-3">
          {t('register.googleDescription') || 'Войдите через Google для быстрой регистрации и автоматической привязки к Patreon'}
        </p>
        <Button 
          variant="primary" 
          onClick={handleGoogleLogin}
          className="tw-flex tw-items-center tw-gap-2 tw-w-full sm:tw-w-auto tw-justify-center"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {t('register.googleButton') || 'Войти через Google'}
        </Button>
      </div>

      {/* Traditional Registration */}
      <Form onSubmit={onSubmit} className="tw-max-w-md tw-w-full tw-mb-6">
        <Form.Group className="mb-2">
          <Form.Label>{t('register.username')}</Form.Label>
          <Form.Control className="tw-w-full tw-max-w-full" value={username} onChange={(e) => setUsername((e.target as HTMLInputElement).value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>{t('register.password')}</Form.Label>
          <Form.Control className="tw-w-full tw-max-w-full" type="password" value={password} onChange={(e) => setPassword((e.target as HTMLInputElement).value)} />
        </Form.Group>
        <Button type="submit" variant="primary" className="tw-w-full sm:tw-w-auto">{t('register.submit')}</Button>
      </Form>

      {/* Patreon Connection Section */}
      <div className="tw-p-4 tw-bg-purple-50 tw-rounded-lg tw-border tw-border-purple-200 tw-w-full">
        <h4 className="tw-mb-3">{t('register.patreon') || 'Подключение Patreon'}</h4>
        <p className="tw-text-sm tw-text-gray-600 tw-mb-3">
          {t('register.patreonDescription') || 'Подключите Patreon для получения доступа к премиум функциям'}
        </p>
        
        {subscription?.is_patron ? (
          <div className="tw-p-3 tw-bg-green-100 tw-rounded">
            <span className="tw-font-bold tw-text-green-700">
              {t('register.patreonConnected') || 'Patreon подключен'} 
              {subscription.patreon_tier === 'supporter' ? ' (Supporter)' : ' (Basic)'}
            </span>
          </div>
        ) : (
          <Button 
            variant="outline-primary" 
            onClick={handleConnectPatreon}
            className="tw-flex tw-items-center tw-gap-2 tw-w-full sm:tw-w-auto tw-justify-center"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21.6c-5.304 0-9.6-4.296-9.6-9.6S6.696 2.4 12 2.4s9.6 4.296 9.6 9.6-4.296 9.6-9.6 9.6z"/>
            </svg>
            {t('register.patreonButton') || 'Подключить Patreon'}
          </Button>
        )}
      </div>

      {message && <div className="tw-mt-4">{message}</div>}
    </div>
  );
}

export default RegisterPage;

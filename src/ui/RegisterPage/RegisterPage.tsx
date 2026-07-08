import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/cjs/Form';
import Button from 'react-bootstrap/cjs/Button';
import { register, connectPatreon, getSubscriptionStatus, getToken } from '../../api/auth';

export function RegisterPage(): JSX.Element {
  const { t } = useTranslation();
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<{patreon_tier?: string; is_patron?: boolean} | null>(null);
  const [captchaToken, setCaptchaToken] = useState('');
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetRef = useRef<string | number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

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

  useEffect(() => {
    if (!turnstileSiteKey || !turnstileContainerRef.current) {
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
  }, [turnstileSiteKey]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await register(username, password, captchaToken);
    if (res && res.user) {
      setMessage(t('register.success'));
      setCaptchaToken('');
    } else if (res && res.error === 'username_taken') {
      setMessage(t('register.username-taken'));
    } else if (res && (res.error === 'captcha_required' || res.error === 'captcha_failed')) {
      setMessage(t('register.captchaError'));
    } else {
      setMessage(t('register.error'));
    }
  }

  function handleConnectPatreon() {
    connectPatreon();
  }

  return (
    <div className="tw-p-4 sm:tw-p-6 tw-w-full tw-overflow-x-hidden">
      <h2>{t('register.header')}</h2>
      
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
        {turnstileSiteKey && (
          <div className="tw-mb-3">
            <div ref={turnstileContainerRef} />
          </div>
        )}
        <Button type="submit" variant="primary" className="tw-w-full sm:tw-w-auto" disabled={!!turnstileSiteKey && !captchaToken}>{t('register.submit')}</Button>
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

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/cjs/Form';
import Button from 'react-bootstrap/cjs/Button';
import { register } from '../../api/auth';

export function RegisterPage(): JSX.Element {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

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

  return (
    <div className="tw-p-6">
      <h2>{t('register.header')}</h2>
      <Form onSubmit={onSubmit} className="tw-max-w-md">
        <Form.Group className="mb-2">
          <Form.Label>{t('register.username')}</Form.Label>
          <Form.Control value={username} onChange={(e) => setUsername((e.target as HTMLInputElement).value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>{t('register.password')}</Form.Label>
          <Form.Control type="password" value={password} onChange={(e) => setPassword((e.target as HTMLInputElement).value)} />
        </Form.Group>
        <Button type="submit" variant="primary">{t('register.submit')}</Button>
      </Form>
      {message && <div className="tw-mt-4">{message}</div>}
    </div>
  );
}

export default RegisterPage;

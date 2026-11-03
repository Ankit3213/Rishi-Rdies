import { useEffect, useRef, useState } from 'react';

type GoogleCredentialResponse = {
  credential?: string;
};

type GoogleIdentityServices = {
  accounts: {
    id: {
      initialize: (options: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
        auto_select: boolean;
        ux_mode: 'popup';
      }) => void;
      renderButton: (
        element: HTMLElement,
        options: {
          theme: 'outline';
          size: 'large';
          text: 'continue_with';
          shape: 'rectangular';
          width: number;
        },
      ) => void;
      cancel: () => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdentityServices;
  }
}

type GoogleSignInButtonProps = {
  disabled?: boolean;
  onCredential: (idToken: string) => Promise<void>;
};

const clientId = import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID?.trim();
const scriptId = 'google-identity-services';

let scriptPromise: Promise<void> | undefined;

function loadGoogleIdentityServices(): Promise<void> {
  if (window.google?.accounts.id) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;
    const script = existingScript ?? document.createElement('script');
    const onLoad = () => resolve();
    const onError = () => {
      scriptPromise = undefined;
      reject(new Error('Google sign-in could not be loaded. Check your network connection and try again.'));
    };

    script.addEventListener('load', onLoad, { once: true });
    script.addEventListener('error', onError, { once: true });
    if (!existingScript) {
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });

  return scriptPromise;
}

export default function GoogleSignInButton({
  disabled = false,
  onCredential,
}: GoogleSignInButtonProps) {
  const buttonContainer = useRef<HTMLDivElement>(null);
  const onCredentialRef = useRef(onCredential);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  onCredentialRef.current = onCredential;

  useEffect(() => {
    const container = buttonContainer.current;
    let active = true;

    if (!clientId) {
      setNotice('Set VITE_GOOGLE_WEB_CLIENT_ID to enable Google sign-in.');
      return () => {
        active = false;
      };
    }

    void loadGoogleIdentityServices()
      .then(() => {
        if (!active || !container || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          auto_select: false,
          ux_mode: 'popup',
          callback: (response) => {
            if (!response.credential) {
              setNotice('Google did not return an ID token. Please try again.');
              return;
            }

            setNotice('');
            setBusy(true);
            void onCredentialRef.current(response.credential)
              .catch((error: unknown) => {
                setNotice(error instanceof Error ? error.message : 'Google sign-in could not be completed.');
              })
              .finally(() => setBusy(false));
          },
        });
        window.google.accounts.id.renderButton(container, {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          width: Math.min(390, Math.max(220, Math.floor(container.getBoundingClientRect().width))),
        });
      })
      .catch((error: unknown) => {
        if (active) setNotice(error instanceof Error ? error.message : 'Google sign-in could not be loaded.');
      });

    return () => {
      active = false;
      window.google?.accounts.id.cancel();
    };
  }, []);

  return (
    <div className={`google-sign-in${disabled || busy ? ' google-sign-in-disabled' : ''}`}>
      <div ref={buttonContainer} aria-disabled={disabled || busy} />
      {(!clientId || notice) && <p className="form-notice account-notice" role="alert">{notice}</p>}
      {busy && <p className="google-sign-in-status" role="status">Signing in with Google…</p>}
    </div>
  );
}

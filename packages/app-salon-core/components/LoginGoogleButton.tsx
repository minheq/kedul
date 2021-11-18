import { useAnalytics, useI18n, useScript } from '@kedul/common-client';
import { Button, useToast } from 'paramount-ui';
import React from 'react';

import { palette } from '../theme/theme';

export interface LoginGoogleButtonProps {
  googleClientId: string;
  title: string;
  onSuccess: (googleIdToken: string) => void;
}

export const LoginGoogleButton = (props: LoginGoogleButtonProps) => {
  const { googleClientId, title, onSuccess } = props;
  const { notify } = useToast();
  const { track } = useAnalytics();
  const i18n = useI18n();

  const {
    hasScriptError,
    isScriptLoading,
    onLogInGoogle: logInGoogle,
  } = useGoogleLogin({
    googleClientId,
  });

  const handlePressLoginGoogle = React.useCallback(() => {
    logInGoogle()
      .then(onSuccess)
      .catch(error => {
        track('Google permissions rejected', error);

        notify({
          description: i18n.t('Google permissions rejected'),
          intent: 'danger',
        });
      });
  }, [i18n, logInGoogle, notify, onSuccess, track]);

  if (hasScriptError) return null;

  return (
    <>
      <Button
        isDisabled={hasScriptError}
        isLoading={isScriptLoading}
        onPress={handlePressLoginGoogle}
        title={title}
        testID="GOOGLE_LOGIN"
        overrides={{
          Touchable: {
            style: {
              backgroundColor: palette.red[900],
            },
          },
        }}
      />
    </>
  );
};

declare global {
  interface Window {
    gapi: any;
  }
}

export interface UseGoogleLoginProps {
  googleClientId: string;
}

const getCredentials = () => {
  return new Promise((resolve, reject) => {
    const ga = window.gapi.auth2.getAuthInstance();

    if (!ga) {
      reject(new Error('Google SDK not available'));
      return;
    }

    ga.signIn().then(
      (googleUser: any) => {
        const idToken = googleUser.getAuthResponse().id_token;

        resolve(idToken);
      },
      (signInError: any) => {
        reject(signInError);
      },
    );
  });
};

const init = (googleClientId: string, onError: (hasError: boolean) => void) => {
  const g = window.gapi;

  g.load('auth2', () => {
    try {
      g.auth2.init({
        // eslint-disable-next-line
        client_id: googleClientId,
        // authorized scopes
        scope: 'profile email openid',
      });
    } catch (error) {
      onError(true);
    }
  });
};

export const useGoogleLogin = (props: UseGoogleLoginProps) => {
  const { googleClientId } = props;
  const [initError, setInitError] = React.useState(false);
  const { loading, error, data } = useScript(
    'https://apis.google.com/js/platform.js',
  );

  React.useEffect(() => {
    if (data) {
      init(googleClientId, setInitError);
    }
  }, [loading, googleClientId, data]);

  const handleGoogleLogin = React.useCallback(getCredentials, [googleClientId]);

  return {
    hasScriptError: error || initError,
    isScriptLoading: loading,
    onLogInGoogle: handleGoogleLogin as () => Promise<string>,
  };
};

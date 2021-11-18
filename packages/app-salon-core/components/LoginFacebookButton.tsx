import { useAnalytics, useI18n, useScript } from '@kedul/common-client';
import { Button, useToast } from 'paramount-ui';
import React from 'react';

import { palette } from '../theme/theme';

export interface LoginFacebookButtonProps {
  facebookAppId: string;
  title: string;
  onSuccess: (facebookAccessToken: string) => void;
}

export const LoginFacebookButton = (props: LoginFacebookButtonProps) => {
  const { facebookAppId, title, onSuccess } = props;
  const { notify } = useToast();
  const { track } = useAnalytics();
  const i18n = useI18n();

  const {
    hasScriptError,
    isScriptLoading,
    onLogInFacebook: logInFacebook,
  } = useFacebookLogin({
    facebookAppId,
  });

  const handlePressLoginFacebook = React.useCallback(() => {
    logInFacebook()
      .then(onSuccess)
      .catch(error => {
        track('Log in Facebook failed', error);
        notify({
          description: i18n.t('Facebook permissions rejected'),
          intent: 'danger',
        });
      });
  }, [i18n, logInFacebook, notify, onSuccess, track]);

  if (hasScriptError) return null;

  return (
    <>
      <Button
        isLoading={isScriptLoading}
        onPress={handlePressLoginFacebook}
        title={title}
        testID="FACEBOOK_LOGIN"
        overrides={{
          Touchable: {
            style: {
              backgroundColor: palette.blue[900],
            },
          },
        }}
      />
    </>
  );
};

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: any;
  }
}

export interface UseFacebookLoginProps {
  facebookAppId: string;
}

const getCredentials = () => {
  const fb = window.FB;

  return new Promise((resolve, reject) => {
    if (!fb) {
      reject('Facebook SDK not available');
      return;
    }

    fb.getLoginStatus((statusResponse: any) => {
      if (statusResponse.status === 'connected') {
        const { accessToken } = statusResponse.authResponse;
        resolve(accessToken);
      } else {
        fb.login(
          (loginResponse: any) => {
            if (!loginResponse || !loginResponse.authResponse) {
              reject('Authorization canceled');
              return;
            }

            const { accessToken } = loginResponse.authResponse;

            resolve(accessToken);
          },
          {
            scope: 'public_profile,email',
          },
        );
      }
    });
  });
};

const init = (facebookAppId: string) => {
  const fb = window.FB;

  fb.init({
    appId: facebookAppId,
    cookie: true,
    version: 'v2.11',
    xfbml: true,
  });
};

export const useFacebookLogin = (props: UseFacebookLoginProps) => {
  const { facebookAppId } = props;
  const { loading, error, data } = useScript(
    'https://connect.facebook.net/en_US/sdk.js',
  );

  React.useEffect(() => {
    if (data) {
      init(facebookAppId);
    }
  }, [loading, facebookAppId, data]);

  const handleFacebookLogin = React.useCallback(getCredentials, [
    facebookAppId,
  ]);

  return {
    hasScriptError: error,
    isScriptLoading: loading,
    onLogInFacebook: handleFacebookLogin as () => Promise<string>,
  };
};

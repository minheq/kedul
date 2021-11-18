import { useI18n } from '@kedul/common-client';
import { Button } from 'paramount-ui';
import React from 'react';

import { useNavigation } from './useNavigation';
import { useCurrentUser } from './CurrentUserProvider';

export const HeaderLogOutButton = () => {
  const { unsetUser } = useCurrentUser();
  const i18n = useI18n();
  const { navigate } = useNavigation();

  return (
    <Button
      appearance="minimal"
      size="small"
      title={i18n.t('Log out')}
      onPress={() => {
        unsetUser();
        navigate('Login');
      }}
      overrides={{
        Touchable: {
          style: {
            marginLeft: -15,
            paddingLeft: 8,
          },
        },
      }}
    />
  );
};

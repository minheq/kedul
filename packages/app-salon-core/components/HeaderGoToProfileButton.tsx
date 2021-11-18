import { useI18n } from '@kedul/common-client';
import { Button } from 'paramount-ui';
import React from 'react';

import { useNavigation } from './useNavigation';

export const HeaderGoToProfileButton = () => {
  const i18n = useI18n();
  const { navigate } = useNavigation();

  return (
    <Button
      appearance="minimal"
      size="small"
      title={i18n.t('Go to profile')}
      onPress={() => {
        navigate('ProfileMenu');
      }}
      overrides={{
        Touchable: {
          style: {
            marginRight: -15,
            paddingRight: 8,
          },
        },
      }}
    />
  );
};

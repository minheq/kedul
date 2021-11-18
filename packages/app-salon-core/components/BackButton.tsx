import { Button, ButtonProps, Icon } from 'paramount-ui';
import React from 'react';

import { RouteName } from './RouteName';
import { useNavigation } from './useNavigation';

export interface BackButtonProps extends ButtonProps {
  to?: RouteName;
  params?: object;
}

const IconBefore = () => <Icon name="arrow-left" />;

export const BackButton = (props: BackButtonProps) => {
  const { to, params, ...buttonProps } = props;
  const { navigate, goBack } = useNavigation();

  return (
    <Button
      appearance="minimal"
      color="default"
      overrides={{
        IconBefore: {
          component: IconBefore,
        },
        Touchable: {
          style: {
            marginLeft: -15,
            paddingLeft: 15,
            paddingRight: 15,
          },
        },
      }}
      onPress={e => {
        e.preventDefault();
        if (to) navigate(to, params);
        else goBack();
      }}
      testID="BACK"
      {...buttonProps}
    />
  );
};

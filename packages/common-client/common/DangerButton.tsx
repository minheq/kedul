import { Button, ButtonProps } from 'paramount-ui';
import React from 'react';

export const DangerButton = (props: ButtonProps) => {
  return (
    <Button
      appearance="minimal"
      color="danger"
      overrides={{
        Touchable: {
          style: {
            paddingLeft: 0,
            paddingRight: 0,
            alignSelf: 'flex-start',
            alignItems: 'flex-start',
          },
        },
        Title: {
          props: {
            weight: 'normal',
          },
          style: {
            paddingLeft: 0,
            paddingRight: 0,
          },
        },
      }}
      {...props}
    />
  );
};

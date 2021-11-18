import React from 'react';

import {
  ButtonWithConfirmDialog,
  ButtonWithConfirmDialogProps,
} from './ButtonWithConfirmDialog';

export const DangerButtonWithConfirmDialog = (
  props: ButtonWithConfirmDialogProps,
) => {
  return (
    <ButtonWithConfirmDialog
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

import { Button, ButtonProps } from 'paramount-ui';
import React from 'react';

import { ConfirmDialog } from './ConfirmDialog';

export interface ButtonWithConfirmDialogProps extends ButtonProps {
  confirmTitle: string;
  onConfirm?: () => void;
}

export const ButtonWithConfirmDialog = (
  props: ButtonWithConfirmDialogProps,
) => {
  const { onConfirm, confirmTitle, ...buttonProps } = props;
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <>
      <Button onPress={() => setIsDialogOpen(true)} {...buttonProps} />
      <ConfirmDialog
        isVisible={isDialogOpen}
        onRequestClose={() => setIsDialogOpen(false)}
        title={confirmTitle}
        onConfirm={onConfirm}
      />
    </>
  );
};

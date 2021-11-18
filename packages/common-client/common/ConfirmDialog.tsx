import { Box, Button, Dialog, Container, Heading } from 'paramount-ui';
import React from 'react';

import { useI18n } from '../i18n';

export interface ConfirmDialogProps {
  isVisible?: boolean;
  title?: string;
  onConfirm?: () => void;
  children?: React.ReactNode;
  onRequestClose?: () => void;
}

export const ConfirmDialog = (props: ConfirmDialogProps) => {
  const {
    isVisible,
    onConfirm = () => {},
    children,
    title,
    onRequestClose = () => {},
  } = props;
  const i18n = useI18n();

  const Header = () => (
    <Container>
      <Box paddingVertical={16}>
        <Heading>{title}</Heading>
      </Box>
    </Container>
  );

  const Footer = () => (
    <Box flexDirection="row" justifyContent="flex-end" paddingTop={16}>
      <Button
        appearance="minimal"
        onPress={event => {
          event.preventDefault();
          onRequestClose();
        }}
        title={i18n.t('Cancel')}
        testID="CANCEL"
      />
      <Button
        appearance="minimal"
        color="primary"
        onPress={event => {
          event.preventDefault();
          onConfirm();
        }}
        title={i18n.t('Confirm')}
        testID="CONFIRM"
      />
    </Box>
  );

  return (
    <Dialog
      isVisible={isVisible}
      overrides={{
        Header: {
          component: Header,
        },
        Footer: {
          component: Footer,
        },
      }}
      onRequestClose={onRequestClose}
      useHistory
    >
      <Container>{children}</Container>
    </Dialog>
  );
};

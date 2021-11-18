import { Modal } from 'paramount-ui';
import React from 'react';
import { SafeAreaView } from 'react-native';

import { useI18n } from '../i18n';
import { SubmitBottomBar, Header } from '../layout';

import { CloseButton } from './CloseButton';

export interface CloseableModalProps {
  isVisible?: boolean;
  children?: React.ReactNode;
  onRequestClose?: () => void;
}

export const CloseableModal = (props: CloseableModalProps) => {
  const { isVisible, children, onRequestClose = () => {} } = props;

  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      useHistory
      onRequestClose={onRequestClose}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Header left={<CloseButton onPress={onRequestClose} />} />
        {children}
      </SafeAreaView>
    </Modal>
  );
};

export interface ConfirmModalProps {
  isVisible?: boolean;
  onConfirm?: () => void;
  children?: React.ReactNode;
  onRequestClose?: () => void;
}

export const ConfirmModal = (props: ConfirmModalProps) => {
  const {
    isVisible,
    onConfirm = () => {},
    children,
    onRequestClose = () => {},
  } = props;
  const i18n = useI18n();

  return (
    <CloseableModal isVisible={isVisible} onRequestClose={onRequestClose}>
      {children}
      <SubmitBottomBar
        onPress={event => {
          event.preventDefault();
          onConfirm();
        }}
        title={i18n.t('Confirm')}
      />
    </CloseableModal>
  );
};

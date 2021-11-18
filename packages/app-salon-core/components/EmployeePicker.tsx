import { ConfirmModal, PickerButton, useI18n } from '@kedul/common-client';
import { Spacing, Container, ListPicker, Avatar } from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';

import { EmployeeFragment } from '../generated/MutationsAndQueries';

import { ScreenTitle } from './ScreenTitle';
import { getUserAvatar } from './UserProfileUtils';

export interface EmployeePickerProps {
  value?: EmployeeFragment | null;
  onValueChange?: (value: EmployeeFragment) => void;
  options: EmployeeFragment[];
}

export const EmployeePicker = (props: EmployeePickerProps) => {
  const {
    value: initialValue = null,
    onValueChange = () => {},
    options,
  } = props;
  const i18n = useI18n();
  const [value, setValue] = React.useState(initialValue);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleSubmit = () => {
    if (value) onValueChange(value);

    setIsModalOpen(false);
  };

  const handleClose = React.useCallback(() => {
    setIsModalOpen(false);
    setValue(initialValue);
  }, [initialValue]);

  return (
    <>
      <ConfirmModal
        onConfirm={handleSubmit}
        isVisible={isModalOpen}
        onRequestClose={handleClose}
      >
        <ScrollView>
          <Container>
            <ScreenTitle>{i18n.t(`Select employee`)}</ScreenTitle>
            <ListPicker
              value={value}
              onValueChange={employee => setValue(employee)}
              data={options.map(employee => ({
                value: employee,
                label: employee.profile.fullName,
              }))}
            />
            <Spacing size="large" />
          </Container>
        </ScrollView>
      </ConfirmModal>
      <PickerButton
        onPress={() => setIsModalOpen(true)}
        title={value ? value.profile.fullName : i18n.t('Select employee')}
        overrides={{
          IconBefore: {
            component: () =>
              value && (
                <Avatar size="small" {...getUserAvatar(value.profile)} />
              ),
          },
        }}
      />
    </>
  );
};

import { FormikProps } from 'formik';
import { Header, SubmitBottomBar, useI18n } from '@kedul/common-client';
import { Box, Column, Container, Row } from 'paramount-ui';
import React from 'react';
import { Image, ScrollView } from 'react-native';

import { dataUriMobileApp } from '../assets/dataUriMobileApp';
import {
  useLogInPhoneVerifyForm,
  LogInPhoneVerifyInput,
  useLogInPhoneStartForm,
} from '../generated/MutationsAndQueries';
import { ScreenTitle } from '../components/ScreenTitle';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useCurrentUser } from '../components/CurrentUserProvider';
import { useNavigation } from '../components/useNavigation';

const LoginImage = () => (
  <Image
    style={{ width: 323, height: 251 }}
    source={{ uri: dataUriMobileApp }}
  />
);

export const LoginScreen = () => {
  const { navigate } = useNavigation();

  const i18n = useI18n();
  const { setUser } = useCurrentUser();

  const loginVerifyForm = useLogInPhoneVerifyForm({
    initialValues: {
      state: '',
      code: '',
    },

    onCompleted: async data => {
      if (!data.logInPhoneVerify || !data.logInPhoneVerify.accessToken) {
        throw new Error('Failed to log in');
      }

      await setUser(data.logInPhoneVerify.accessToken);

      navigate('AuthLoading');
    },
  });

  const hasLoginPhoneStarted = !!loginVerifyForm.values.state;

  return (
    <ScreenWrapper>
      <ScrollView>
        <Header />
        <Container size="small">
          <Row>
            <Column>
              <Box paddingBottom={24} alignItems="center">
                <LoginImage />
              </Box>
              <ScreenTitle>{i18n.t('Get started')}</ScreenTitle>
              <LoginPhoneForm verifyForm={loginVerifyForm} />
            </Column>
          </Row>
        </Container>
      </ScrollView>
      {hasLoginPhoneStarted && (
        <SubmitBottomBar
          onPress={loginVerifyForm.submitForm}
          title={i18n.t('Continue')}
          testID="VERIFY"
        />
      )}
    </ScreenWrapper>
  );
};

import {
  PhoneVerificationForm,
  PhoneVerificationFormVerifyValues,
} from '../components/PhoneVerificationForm';

export interface LoginPhoneFormProps {
  verifyForm: FormikProps<LogInPhoneVerifyInput>;
}

export const LoginPhoneForm = (props: LoginPhoneFormProps) => {
  const { verifyForm } = props;

  const startForm = useLogInPhoneStartForm({
    initialValues: {
      countryCode: 'VN',
      phoneNumber: '',
    },

    onCompleted: data => {
      if (!data.logInPhoneStart) {
        throw new Error('logInPhoneStart');
      }

      verifyForm.setFieldValue('state', data.logInPhoneStart.state);
    },
  });

  return (
    <PhoneVerificationForm
      hasPhoneVerificationStarted={!!verifyForm.values.state}
      startForm={startForm}
      verifyForm={verifyForm as FormikProps<PhoneVerificationFormVerifyValues>}
    />
  );
};

import { FormikProps } from 'formik';
import React from 'react';

import {
  LogInEmailVerifyInput,
  useLogInEmailStartForm,
} from '../generated/MutationsAndQueries';

import {
  EmailVerificationForm,
  EmailVerificationFormVerifyValues,
} from './EmailVerificationForm';

export interface LoginEmailFormProps {
  verifyForm: FormikProps<LogInEmailVerifyInput>;
}

export const LoginEmailForm = (props: LoginEmailFormProps) => {
  const { verifyForm } = props;

  const startForm = useLogInEmailStartForm({
    initialValues: {
      email: '',
    },

    onCompleted: data => {
      if (!data.logInEmailStart) throw new Error('logInEmailStart');
      verifyForm.setFieldValue('state', data.logInEmailStart.state);
    },
  });

  return (
    <EmailVerificationForm
      hasEmailVerificationStarted={!!verifyForm.values.state}
      startForm={startForm}
      verifyForm={verifyForm as FormikProps<EmailVerificationFormVerifyValues>}
    />
  );
};

import {
  AddText,
  DangerButtonWithConfirmDialog,
  Header,
  useI18n,
  SubmitBottomBar,
  CloseableModal,
} from '@kedul/common-client';
import { Box, Button, Column, Container, Row, useToast } from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';
import { FormikProps } from 'formik';

import { ScreenWrapper } from '../components/ScreenWrapper';
import { env } from '../env';
import {
  CurrentUserFragment,
  useDeactivateUserForm,
  useDisconnectFacebookMutation,
  useDisconnectGoogleMutation,
  useLinkFacebookAccountMutation,
  useLinkGoogleAccountMutation,
  useUpdateUserEmailVerifyForm,
  useUpdateUserPhoneVerifyForm,
  UpdateUserPhoneVerifyInput,
  useUpdateUserPhoneStartForm,
  UpdateUserEmailVerifyInput,
  useUpdateUserEmailStartForm,
} from '../generated/MutationsAndQueries';
import { BackButton } from '../components/BackButton';
import { ListItemLink } from '../components/ListItemLink';
import { useNavigation } from '../components/useNavigation';
import { CurrentUser } from '../components/CurrentUser';
import { LoginFacebookButton } from '../components/LoginFacebookButton';
import { LoginGoogleButton } from '../components/LoginGoogleButton';
import { useCurrentUser } from '../components/CurrentUserProvider';
import { ScreenTitle } from '../components/ScreenTitle';
import {
  PhoneVerificationForm,
  PhoneVerificationFormStartValues,
  PhoneVerificationFormVerifyValues,
} from '../components/PhoneVerificationForm';
import {
  EmailVerificationForm,
  EmailVerificationFormStartValues,
  EmailVerificationFormVerifyValues,
} from '../components/EmailVerificationForm';

export const UserAccountSettingsGeneralScreen = () => {
  const i18n = useI18n();

  return (
    <CurrentUser>
      {currentUser => (
        <ScreenWrapper>
          <Header
            left={<BackButton to="ProfileMenu" />}
            title={i18n.t('Account Settings')}
          />
          <ScrollView>
            <Container size="small">
              <Row>
                <Column>
                  <Box paddingBottom={40}>
                    <ListItemLinkUpdateEmail currentUser={currentUser} />
                    <ListItemLinkUpdatePhone currentUser={currentUser} />
                    <Box paddingTop={80}>
                      <DeactivateUser currentUser={currentUser} />
                    </Box>
                  </Box>
                </Column>
              </Row>
            </Container>
          </ScrollView>
        </ScreenWrapper>
      )}
    </CurrentUser>
  );
};

interface CurrentUserProps {
  currentUser: CurrentUserFragment;
  onCompleted?: () => void;
}

const AddEmailText = () => {
  const i18n = useI18n();

  return <AddText>{i18n.t('Add email address')}</AddText>;
};

const ListItemLinkUpdateEmail = (props: CurrentUserProps) => {
  const { currentUser } = props;
  const i18n = useI18n();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <ListItemLink
        title={i18n.t('Email address')}
        description={currentUser.account.email}
        onPress={() => setIsModalOpen(true)}
        testID="UPDATE_EMAIL"
        overrides={{
          Description: {
            component: !currentUser.account.email ? AddEmailText : undefined,
          },
        }}
      />
      <CloseableModal
        isVisible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <UserUpdateEmail
          currentUser={currentUser}
          onCompleted={() => setIsModalOpen(false)}
        />
      </CloseableModal>
    </>
  );
};

const UserUpdateEmail = (props: CurrentUserProps) => {
  const { currentUser, onCompleted } = props;
  const i18n = useI18n();
  const [
    hasEmailVerificationStarted,
    setHasEmailVerificationStarted,
  ] = React.useState(false);

  const verifyForm = useUpdateUserEmailVerifyForm({
    initialValues: { code: '', email: '', id: currentUser.id },

    onCompleted,
  });

  return (
    <>
      <ScrollView>
        <Container size="small">
          <ScreenTitle title={i18n.t('Update email')} />
          <UpdateEmailForm
            onEmailVerificationStarted={() =>
              setHasEmailVerificationStarted(true)
            }
            hasEmailVerificationStarted={hasEmailVerificationStarted}
            currentUser={currentUser}
            verifyForm={verifyForm}
          />
        </Container>
      </ScrollView>
      {hasEmailVerificationStarted && (
        <SubmitBottomBar
          onPress={verifyForm.submitForm}
          title={i18n.t('Save')}
          testID="SAVE"
        />
      )}
    </>
  );
};

export interface UpdateEmailFormProps {
  onEmailVerificationStarted: () => void;
  hasEmailVerificationStarted: boolean;
  currentUser: CurrentUserFragment;
  verifyForm: FormikProps<UpdateUserEmailVerifyInput>;
}

export const UpdateEmailForm = (props: UpdateEmailFormProps) => {
  const {
    verifyForm,
    currentUser,
    hasEmailVerificationStarted,
    onEmailVerificationStarted,
  } = props;

  const startForm = useUpdateUserEmailStartForm({
    initialValues: {
      id: currentUser.id,
      email: currentUser.account.email || '',
    },

    onCompleted: () => {
      verifyForm.setFieldValue('email', startForm.values.email);
      onEmailVerificationStarted();
    },
  });

  return (
    <EmailVerificationForm
      hasEmailVerificationStarted={hasEmailVerificationStarted}
      startForm={startForm as FormikProps<EmailVerificationFormStartValues>}
      verifyForm={verifyForm as FormikProps<EmailVerificationFormVerifyValues>}
    />
  );
};

const AddPhoneNumberText = () => {
  const i18n = useI18n();

  return <AddText>{i18n.t('Add phone number')}</AddText>;
};

const ListItemLinkUpdatePhone = (props: CurrentUserProps) => {
  const { currentUser } = props;
  const i18n = useI18n();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <ListItemLink
        title={i18n.t('Phone number')}
        onPress={() => setIsModalOpen(true)}
        description={currentUser.account.phoneNumber}
        testID="UPDATE_PHONE_NUMBER"
        overrides={{
          Description: {
            component: !currentUser.account.phoneNumber
              ? AddPhoneNumberText
              : undefined,
          },
        }}
      />
      <CloseableModal
        isVisible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <UserUpdatePhone
          currentUser={currentUser}
          onCompleted={() => setIsModalOpen(false)}
        />
      </CloseableModal>
    </>
  );
};

const UserUpdatePhone = (props: CurrentUserProps) => {
  const { currentUser, onCompleted } = props;
  const i18n = useI18n();
  const [
    hasPhoneVerificationStarted,
    setHasPhoneVerificationStarted,
  ] = React.useState(false);

  const verifyForm = useUpdateUserPhoneVerifyForm({
    initialValues: {
      code: '',
      phoneNumber: '',
      countryCode: 'VN',
      id: currentUser.id,
    },

    onCompleted,
  });

  return (
    <>
      <ScrollView>
        <Container size="small">
          <ScreenTitle title={i18n.t('Update phone number')} />
          <UpdatePhoneForm
            onPhoneVerificationStarted={() =>
              setHasPhoneVerificationStarted(true)
            }
            hasPhoneVerificationStarted={hasPhoneVerificationStarted}
            currentUser={currentUser}
            verifyForm={verifyForm}
          />
        </Container>
      </ScrollView>
      {hasPhoneVerificationStarted && (
        <SubmitBottomBar
          onPress={verifyForm.submitForm}
          title={i18n.t('Save')}
          testID="SAVE"
        />
      )}
    </>
  );
};

export interface UpdatePhoneFormProps {
  onPhoneVerificationStarted: () => void;
  hasPhoneVerificationStarted: boolean;
  currentUser: CurrentUserFragment;
  verifyForm: FormikProps<UpdateUserPhoneVerifyInput>;
}

export const UpdatePhoneForm = (props: UpdatePhoneFormProps) => {
  const {
    verifyForm,
    currentUser,
    hasPhoneVerificationStarted,
    onPhoneVerificationStarted,
  } = props;

  const startForm = useUpdateUserPhoneStartForm({
    initialValues: {
      id: currentUser.id,
      phoneNumber: currentUser.account.phoneNumber || '',
      countryCode: currentUser.account.countryCode || 'VN',
    },

    onCompleted: () => {
      verifyForm.setFieldValue('phoneNumber', startForm.values.phoneNumber);
      onPhoneVerificationStarted();
    },
  });

  return (
    <PhoneVerificationForm
      hasPhoneVerificationStarted={hasPhoneVerificationStarted}
      startForm={startForm as FormikProps<PhoneVerificationFormStartValues>}
      verifyForm={verifyForm as FormikProps<PhoneVerificationFormVerifyValues>}
    />
  );
};

const LinkFacebookButton = (props: CurrentUserProps) => {
  const { currentUser } = props;
  const i18n = useI18n();
  const { notify } = useToast();
  const [linkFacebook] = useLinkFacebookAccountMutation();

  return (
    <LoginFacebookButton
      facebookAppId={env.services.facebook.appId}
      title={i18n.t('Link with Facebook')}
      onSuccess={facebookAccessToken => {
        linkFacebook({
          variables: {
            input: { facebookAccessToken, userId: currentUser.id },
          },
        }).then(result => {
          if (result && result.data && result.data.linkFacebookAccount) {
            if (result.data.linkFacebookAccount.isSuccessful) {
              notify({
                description: i18n.t('Facebook account successfully connected'),
                intent: 'success',
              });
            } else if (result.data.linkFacebookAccount.userError) {
              notify({
                description: i18n.t(
                  result.data.linkFacebookAccount.userError.message,
                ),
                intent: 'danger',
              });
            }
          }
        });
      }}
    />
  );
};

const DisconnectFacebookButton = (props: CurrentUserProps) => {
  const { currentUser } = props;
  const i18n = useI18n();
  const { notify } = useToast();
  const [disconnectFacebook] = useDisconnectFacebookMutation();

  return (
    <Button
      title={i18n.t('Disconnect from Facebook')}
      onPress={() =>
        disconnectFacebook({
          variables: { input: { userId: currentUser.id } },
        }).then(result => {
          if (result && result.data && result.data.disconnectFacebook) {
            if (result.data.disconnectFacebook.isSuccessful) {
              notify({
                description: i18n.t(
                  'Facebook account successfully disconnected',
                ),
                intent: 'success',
              });
            } else if (result.data.disconnectFacebook.userError) {
              notify({
                description: i18n.t(
                  result.data.disconnectFacebook.userError.message,
                ),
                intent: 'danger',
              });
            }
          }
        })
      }
    />
  );
};

const LinkGoogleButton = (props: CurrentUserProps) => {
  const { currentUser } = props;
  const i18n = useI18n();
  const { notify } = useToast();
  const [linkGoogle] = useLinkGoogleAccountMutation();

  return (
    <LoginGoogleButton
      googleClientId={env.services.google.clientId}
      title={i18n.t('Link with Google')}
      onSuccess={googleIdToken => {
        linkGoogle({
          variables: {
            input: { googleIdToken, userId: currentUser.id },
          },
        }).then(result => {
          if (result && result.data && result.data.linkGoogleAccount) {
            if (result.data.linkGoogleAccount.isSuccessful) {
              notify({
                description: i18n.t('Google account successfully connected'),
                intent: 'success',
              });
            } else if (result.data.linkGoogleAccount.userError) {
              notify({
                description: i18n.t(
                  result.data.linkGoogleAccount.userError.message,
                ),
                intent: 'danger',
              });
            }
          }
        });
      }}
    />
  );
};

const DisconnectGoogleButton = (props: CurrentUserProps) => {
  const { currentUser } = props;
  const i18n = useI18n();
  const { notify } = useToast();
  const [disconnectGoogle] = useDisconnectGoogleMutation();

  return (
    <Button
      title={i18n.t('Disconnect from Google')}
      onPress={() =>
        disconnectGoogle({
          variables: { input: { userId: currentUser.id } },
        }).then(result => {
          if (result && result.data && result.data.disconnectGoogle) {
            if (result.data.disconnectGoogle.isSuccessful) {
              notify({
                description: i18n.t('Google account successfully disconnected'),
                intent: 'success',
              });
            } else if (result.data.disconnectGoogle.userError) {
              notify({
                description: i18n.t(
                  result.data.disconnectGoogle.userError.message,
                ),
                intent: 'danger',
              });
            }
          }
        })
      }
    />
  );
};

export const LinkOrDisconnectFacebook = (props: CurrentUserProps) => {
  const { currentUser } = props;
  const isFacebookConnected = false;

  return (
    <>
      {isFacebookConnected ? (
        <DisconnectFacebookButton currentUser={currentUser} />
      ) : (
        <LinkFacebookButton currentUser={currentUser} />
      )}
    </>
  );
};

export const LinkOrDisconnectGoogle = (props: CurrentUserProps) => {
  const { currentUser } = props;

  const isGoogleConnected = false;

  return (
    <>
      {isGoogleConnected ? (
        <DisconnectGoogleButton currentUser={currentUser} />
      ) : (
        <LinkGoogleButton currentUser={currentUser} />
      )}
    </>
  );
};

const DeactivateUser = (props: CurrentUserProps) => {
  const { currentUser } = props;
  const i18n = useI18n();
  const { unsetUser } = useCurrentUser();
  const { navigate } = useNavigation();

  const form = useDeactivateUserForm({
    initialValues: {
      id: currentUser.id,
    },

    onCompleted: async () => {
      navigate('Login');

      await unsetUser();
    },
  });

  return (
    <DangerButtonWithConfirmDialog
      title={i18n.t('Deactivate account')}
      onConfirm={form.submitForm}
      confirmTitle={i18n.t('Are you sure you want to delete your account?')}
      testID="DEACTIVATE_ACCOUNT"
    />
  );
};

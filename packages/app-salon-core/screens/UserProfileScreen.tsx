import {
  Header,
  useI18n,
  CloseableModal,
  SubmitBottomBar,
} from '@kedul/common-client';
import { Container } from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';

import { AvatarProfile } from '../components/AvatarProfile';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SectionTitle } from '../components/SectionTitle';
import { SectionWrapper } from '../components/SectionWrapper';
import {
  UserFragment,
  useUpdateUserProfileForm,
} from '../generated/MutationsAndQueries';
import { BackButton } from '../components/BackButton';
import { Link } from '../components/Link';
import { CurrentUser } from '../components/CurrentUser';
import {
  toUserProfileInitialValues,
  UserProfileEditForm,
} from '../components/UserProfileEditForm';
import { ScreenTitle } from '../components/ScreenTitle';

export const UserProfileScreen = () => {
  const i18n = useI18n();

  return (
    <CurrentUser>
      {currentUser => (
        <ScreenWrapper>
          <ScrollView>
            <Header
              left={<BackButton to="ProfileMenu" />}
              title={i18n.t('User profile')}
            />
            <Container size="small">
              <UserProfileSection user={currentUser} />
            </Container>
          </ScrollView>
        </ScreenWrapper>
      )}
    </CurrentUser>
  );
};

export interface UserSectionProps {
  user: UserFragment;
}

const UserProfileSection = (props: UserSectionProps) => {
  const { user } = props;
  const i18n = useI18n();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <SectionWrapper>
      <SectionTitle
        title={i18n.t('Profile')}
        right={
          <Link onPress={() => setIsModalOpen(true)} testID="EDIT_USER_PROFILE">
            {i18n.t('Edit')}
          </Link>
        }
      />
      <AvatarProfile
        name={user.profile && user.profile.fullName}
        image={user.profile && user.profile.profileImage}
      />
      <CloseableModal
        isVisible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <EditUserProfile
          user={user}
          onCompleted={() => setIsModalOpen(false)}
        />
      </CloseableModal>
    </SectionWrapper>
  );
};

export interface EditUserProfileProps {
  user: UserFragment;
  onCompleted?: () => void;
}

export const EditUserProfile = (props: EditUserProfileProps) => {
  const { user, onCompleted } = props;
  const i18n = useI18n();

  const form = useUpdateUserProfileForm({
    initialValues: {
      id: user.id,
      profile: toUserProfileInitialValues(user.profile),
    },

    onCompleted,
  });

  return (
    <>
      <ScrollView>
        <Container size="small">
          <ScreenTitle title={i18n.t('Edit profile')} />
          <UserProfileEditForm form={form as UserProfileEditForm} />
        </Container>
      </ScrollView>
      <SubmitBottomBar
        isLoading={form.isSubmitting}
        onPress={form.submitForm}
        title={i18n.t('Save')}
        testID="SAVE"
      />
    </>
  );
};

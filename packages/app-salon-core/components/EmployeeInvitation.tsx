import { ButtonWithConfirmDialog, useI18n } from '@kedul/common-client';
import { Box, Button, Text, Spacing } from 'paramount-ui';
import React from 'react';

import {
  EmployeeInvitationWithBusinessInfoFragment,
  useAcceptEmployeeInvitationMutation,
  useCurrentBusinessQuery,
  useCurrentUserInvitationsQuery,
  useCurrentUserQuery,
  useDeclineEmployeeInvitationMutation,
  LocationFragment,
  BusinessFragment,
} from '../generated/MutationsAndQueries';

import { useCurrentBusiness } from './CurrentBusinessProvider';

interface EmployeeInvitationProps {
  invitation: EmployeeInvitationWithBusinessInfoFragment;
  onAccepted?: (
    business: BusinessFragment,
    location: LocationFragment,
  ) => Promise<void>;
}

export const EmployeeInvitation = (props: EmployeeInvitationProps) => {
  const { invitation, onAccepted = () => {} } = props;
  const i18n = useI18n();
  const { currentBusiness } = useCurrentBusiness();
  const {
    refetch: refetchCurrentUserInvitations,
  } = useCurrentUserInvitationsQuery();
  const { refetch: refetchCurrentUser } = useCurrentUserQuery();
  const { refetch: refetchCurrentBusiness } = useCurrentBusinessQuery({
    skip: !currentBusiness,
  });
  const [acceptEmployeeInvitation] = useAcceptEmployeeInvitationMutation();
  const [declineEmployeeInvitation] = useDeclineEmployeeInvitationMutation();

  const location = invitation.employee.location;
  const business = location.business;

  const handleDecline = React.useCallback(async () => {
    await declineEmployeeInvitation({
      variables: {
        input: { employeeId: invitation.employee.id },
      },
    });

    await refetchCurrentUserInvitations();
  }, [
    declineEmployeeInvitation,
    invitation.employee.id,
    refetchCurrentUserInvitations,
  ]);

  const handleAccept = React.useCallback(async () => {
    await acceptEmployeeInvitation({
      variables: {
        input: { invitationToken: invitation.token },
      },
    });

    await onAccepted(business, location);

    await refetchCurrentUser();
    await refetchCurrentUserInvitations();
    await refetchCurrentBusiness();
  }, [
    acceptEmployeeInvitation,
    invitation.token,
    refetchCurrentUser,
    refetchCurrentUserInvitations,
    refetchCurrentBusiness,
    onAccepted,
    business,
    location,
  ]);

  return (
    <Box key={invitation.id} paddingBottom={24}>
      <Text>
        {i18n.t('You are invited to join')}{' '}
        <Text weight="bold">{business.name}</Text>{' '}
        {i18n.t('to manage location')}{' '}
        <Text weight="bold">{location.name}</Text>
      </Text>
      <Spacing />
      <Box flexDirection="row" justifyContent="flex-end">
        <Box paddingRight={16}>
          <ButtonWithConfirmDialog
            appearance="minimal"
            title={i18n.t('Decline')}
            confirmTitle={i18n.t(
              'Are you sure you want to decline invitation?',
            )}
            onConfirm={handleDecline}
          />
        </Box>
        <Button
          onPress={handleAccept}
          color="primary"
          title={i18n.t('Accept')}
          testID="ACCEPT"
        />
      </Box>
    </Box>
  );
};

import { Box, Text } from 'paramount-ui';
import React from 'react';

import { ContactDetailsFragment } from '../generated/MutationsAndQueries';

export interface ContactDetailsProps {
  contactDetails: ContactDetailsFragment;
}

export const ContactDetails = (props: ContactDetailsProps) => {
  const { contactDetails } = props;

  return (
    <Box testID="CONTACT_DETAILS">
      <Text>{contactDetails.phoneNumber}</Text>
      <Text>{contactDetails.email}</Text>
    </Box>
  );
};

import { Box, Text } from 'paramount-ui';
import React from 'react';

import { Address } from '../generated/MutationsAndQueries';

export interface AddressBasicInformationProps {
  address: Address;
}

export const AddressBasicInformation = (
  props: AddressBasicInformationProps,
) => {
  const { address } = props;

  return (
    <Box testID="ADDRESS_BASIC_INFORMATION">
      <Text>{address.streetAddressOne}</Text>
      <Text>{address.streetAddressTwo}</Text>
      <Text>{address.district}</Text>
      <Text>{address.city}</Text>
      <Text>{address.country}</Text>
    </Box>
  );
};

import { Box, Heading, Spacing, Text } from 'paramount-ui';
import React from 'react';

import { OptionalString } from '../types';

export interface SectionTitleProps {
  title: string;
  description?: OptionalString;
  right?: React.ReactNode;
}

export const SectionTitle = (props: SectionTitleProps) => {
  const { title, description, right } = props;

  return (
    <>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="medium">{title}</Heading>
        {right}
      </Box>
      {description && (
        <>
          <Spacing size="small" />
          <Text size="small" color="muted">
            {description}
          </Text>
        </>
      )}
      <Spacing />
    </>
  );
};

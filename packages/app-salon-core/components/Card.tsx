import { Box, Heading, Text } from 'paramount-ui';
import React from 'react';

export interface CardProps {
  heading?: string;
  lineOne?: string;
  lineTwo?: string;
  footer?: React.ReactNode;
}

export const Card = (props: CardProps) => {
  const { heading, lineOne, lineTwo, footer } = props;

  return (
    <Box shape="rounded" elevation={3} padding={8} paddingBottom={16}>
      {heading && <Heading size="small">{heading}</Heading>}
      {lineOne && <Text>{lineOne}</Text>}
      {lineTwo && (
        <Text color="muted" size="small">
          {lineTwo}
        </Text>
      )}
      {footer && (
        <>
          <Box position="absolute" paddingTop={32} bottom={16} zIndex={1}>
            {footer}
          </Box>
          <Box opacity={0} paddingTop={32}>
            {footer}
          </Box>
        </>
      )}
    </Box>
  );
};

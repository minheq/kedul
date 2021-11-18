import { Box, Column, Container, Row, Text } from 'paramount-ui';
import React from 'react';

export const HEADER_HEIGHT = 56;

export interface HeaderProps {
  left?: React.ReactNode;
  title?: React.ReactNode;
  right?: React.ReactNode;
}

export const Header = (props: HeaderProps) => {
  const { left, title, right } = props;

  return (
    <Box height={HEADER_HEIGHT} justifyContent="center" backgroundColor="base">
      <Container fluid>
        <Row>
          <Column>
            <Box flexDirection="row" alignItems="center">
              <Box>{left}</Box>
              <Box flex={1}>
                <Text>{title}</Text>
              </Box>
              <Box>{right}</Box>
            </Box>
          </Column>
        </Row>
      </Container>
    </Box>
  );
};

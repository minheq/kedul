import { Box, Button, ButtonProps, Column, Container, Row } from 'paramount-ui';
import React from 'react';

import { BottomBar } from './BottomBar';

export interface SubmitBottomBarProps extends ButtonProps {
  leftComponent?: React.ReactNode | null;
  isTransparent?: boolean;
}

export const SubmitBottomBar = (props: SubmitBottomBarProps) => {
  const {
    leftComponent,
    isTransparent = true,
    onPress = () => {},
    ...buttonProps
  } = props;

  return (
    <BottomBar isTransparent={isTransparent}>
      <Container>
        <Row>
          <Column xsmall={6}>
            <Box flexDirection="row" justifyContent="flex-start" height="100%">
              {leftComponent}
            </Box>
          </Column>
          <Column xsmall={6}>
            <Box flexDirection="row" justifyContent="flex-end">
              <Button
                color="primary"
                onPress={e => {
                  e.preventDefault();
                  onPress(e);
                }}
                {...buttonProps}
              />
            </Box>
          </Column>
        </Row>
      </Container>
    </BottomBar>
  );
};

import { useI18n } from '@kedul/common-client';
import { Box, Column, Container, Divider, Row, useLayout } from 'paramount-ui';
import React from 'react';
import { Image, TextStyle } from 'react-native';

import { WebLink } from './WebLink';

export const Footer = () => {
  const i18n = useI18n();
  const { getResponsiveValue } = useLayout();

  const desktopLink: TextStyle = {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: getResponsiveValue({
      xsmall: 0,
      medium: 16,
    }),
  };

  return (
    <Container>
      <Row>
        <Divider />
        <Column>
          <Box
            flexDirection={getResponsiveValue({
              xsmall: 'column',
              medium: 'row',
            })}
            alignItems={getResponsiveValue({
              xsmall: 'flex-start',
              medium: 'center',
            })}
            paddingVertical={24}
          >
            <Image
              accessibilityLabel="kedul salon logo"
              source={{
                width: 40,
                height: 40,
                uri:
                  "data:image/svg+xml;charset=UTF-8,%3csvg width='24px' height='24px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3e%3cg id='Group'%3e%3ccircle id='Oval' fill='%238EEDC7' cx='12' cy='12' r='12'%3e%3c/circle%3e%3cpolygon id='k' fill='%23102A43' points='11.8867925 13.3396226 9.81132075 15.2641509 9.81132075 18 8 18 8 4 9.81132075 4 9.81132075 12.9811321 15.2641509 8 17.4528302 8 13.245283 12.1320755 17.8679245 18 15.6415094 18'%3e%3c/polygon%3e%3c/g%3e%3c/g%3e%3c/svg%3e",
              }}
              style={{
                width: 40,
                height: 40,
              }}
            />
            <Box
              flexDirection={getResponsiveValue({
                xsmall: 'column',
                medium: 'row',
              })}
              flex={1}
              alignItems="flex-start"
              justifyContent="flex-start"
            >
              <WebLink style={desktopLink} to="Landing">
                {i18n.t('Terms')}
              </WebLink>
              <WebLink style={desktopLink} to="Landing">
                {i18n.t('Privacy')}
              </WebLink>
            </Box>
            <Box
              flexDirection="row"
              flex={1}
              alignItems="center"
              justifyContent="flex-end"
            >
              <WebLink style={desktopLink} to="Landing">
                {i18n.t('Contact us on Facebook')}
              </WebLink>
            </Box>
          </Box>
        </Column>
      </Row>
    </Container>
  );
};

import { Header, HEADER_HEIGHT, useI18n } from '@kedul/common-client';
import { Box } from 'paramount-ui';
import React from 'react';
import { TextStyle } from 'react-native';

import { Logo } from '../components/Logo';
import { GetStartedButton } from './GetStartedButton';
import { WebLink } from './WebLink';

export const LandingPageHeader = () => {
  const i18n = useI18n();

  const styles: { [style: string]: TextStyle } = {
    desktopLink: {
      height: HEADER_HEIGHT,
      justifyContent: 'center',
      paddingHorizontal: 16,
    },
  };

  return (
    <Header
      left={<Logo />}
      // center={
      //   <Visible medium large xlarge>
      //     <Box flexDirection="row" alignItems="center">
      //       <WebLink style={styles.desktopLink} to="Landing">
      //         {i18n.t('Home')}
      //       </WebLink>
      //       <WebLink style={styles.desktopLink} to="Landing">
      //         {i18n.t('Pricing')}
      //       </WebLink>
      //     </Box>
      //   </Visible>
      // }
      right={
        <Box flexDirection="row" alignItems="center">
          <WebLink style={styles.desktopLink} to="Login">
            {i18n.t('Log in')}
          </WebLink>
          <GetStartedButton />
        </Box>
      }
    />
  );
};

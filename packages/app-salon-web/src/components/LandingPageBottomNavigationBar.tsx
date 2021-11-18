import { BottomBar, useI18n } from '@kedul/common-client';
import { Box } from 'paramount-ui';
import React from 'react';

import { WebLink, WebLinkProps } from './WebLink';

const Link = (props: WebLinkProps) => {
  return (
    <WebLink
      style={{
        flex: 1,
        alignItems: 'center',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        width: '100%',
      }}
      {...props}
    />
  );
};

export const LandingPageBottomNavigationBar = () => {
  const i18n = useI18n();

  return (
    <BottomBar>
      <Box height="100%" flexDirection="row">
        <Link to="Landing">{i18n.t('Home')}</Link>
        <Link to="Plans">{i18n.t('Pricing')}</Link>
      </Box>
    </BottomBar>
  );
};

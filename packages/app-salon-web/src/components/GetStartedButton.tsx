import { Link } from '@kedul/app-salon-core';
import { useI18n } from '@kedul/common-client';
import { Button } from 'paramount-ui';
import React from 'react';

export const GetStartedButton = () => {
  const i18n = useI18n();

  return (
    <Link to="Login">
      <Button color="primary" title={i18n.t('Get started')} />
    </Link>
  );
};

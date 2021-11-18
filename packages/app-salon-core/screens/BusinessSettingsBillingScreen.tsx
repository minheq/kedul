import { Header, useI18n } from '@kedul/common-client';
import { Column, Container, Paragraph, Row } from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';

import { ScreenWrapper } from '../components/ScreenWrapper';
import { BackButton } from '../components/BackButton';

export const BusinessSettingsBillingScreen = () => {
  const i18n = useI18n();

  return (
    <ScreenWrapper>
      <Header
        left={<BackButton to="BusinessSettings" />}
        title={i18n.t('Billing')}
      />
      <ScrollView>
        <Container>
          <Row>
            <Column>
              <Paragraph>
                {i18n.t(
                  'We are currently focused on making this product great, so Kedul is available for free at the moment.',
                )}
              </Paragraph>
              <Paragraph>
                {i18n.t(
                  'We have plans to collect a monthly fee in the near future.',
                )}
              </Paragraph>
            </Column>
          </Row>
        </Container>
      </ScrollView>
    </ScreenWrapper>
  );
};

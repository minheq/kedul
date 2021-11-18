import { AddText, Event, EventProps, useI18n } from '@kedul/common-client';
import { Box, useTheme } from 'paramount-ui';
import React from 'react';

export const ShiftCalendarNewCard = (props: EventProps<Event>) => {
  const i18n = useI18n();
  const theme = useTheme();

  return (
    <Box
      width="100%"
      height="100%"
      borderWidth={1}
      borderColor={theme.colors.border.primary}
      borderRadius={theme.controlBorderRadius.large}
      backgroundColor={theme.colors.background.content}
      elevation={1}
      padding={4}
    >
      <AddText size="small" color="link">
        {i18n.t('New shift')}
      </AddText>
    </Box>
  );
};

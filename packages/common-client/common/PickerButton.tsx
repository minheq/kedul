import { Button, useTheme, ButtonProps } from 'paramount-ui';
import React from 'react';

export const PickerButton = (props: ButtonProps) => {
  const { overrides, isDisabled, ...buttonProps } = props;
  const theme = useTheme();

  return (
    <Button
      overrides={{
        Touchable: {
          style: {
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            backgroundColor: isDisabled
              ? theme.colors.background.greyLight
              : theme.colors.background.base,
            paddingLeft: 16,
            paddingRight: 16,
            justifyContent: 'flex-start',
          },
        },
        Title: {
          style: {
            textAlign: 'left',
            fontWeight: 'normal',
          },
        },
        ...overrides,
      }}
      isDisabled={isDisabled}
      {...buttonProps}
    />
  );
};

import { Icon, useTheme } from 'paramount-ui';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

export interface CloseButtonProps {
  onPress?: () => void;
}

export const CloseButton = (props: CloseButtonProps) => {
  const {
    onPress = () => {
      return;
    },
  } = props;

  const theme = useTheme();

  return (
    <TouchableOpacity
      style={{ height: '100%', justifyContent: 'center' }}
      onPress={event => {
        event.preventDefault();
        if (onPress) onPress();
      }}
    >
      <View style={{ marginLeft: -15, paddingLeft: 15 }}>
        <Icon color={theme.colors.text.default} size="large" name="x" />
      </View>
    </TouchableOpacity>
  );
};

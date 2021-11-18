import { ToastProvider } from 'paramount-ui';
import React from 'react';
import { SafeAreaView } from 'react-native';

export interface ScreenWrapper {
  children: React.ReactNode;
}

export const ScreenWrapper = (props: ScreenWrapper) => {
  const { children } = props;

  return (
    <ScreenProvider>
      <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
    </ScreenProvider>
  );
};

interface ScreenProviderProps {
  children: React.ReactNode;
}

const ScreenProvider = (props: ScreenProviderProps) => {
  const { children } = props;

  return <ToastProvider>{children}</ToastProvider>;
};

import { AnalyticsClientInterface } from './AnalyticsClientInterface';

export const makeGoogleTagManagerClient = (): AnalyticsClientInterface => {
  return {
    group: payload => {
      return;
    },
    identify: payload => {
      return;
    },
    screen: payload => {
      return;
    },
    track: payload => {
      // @ts-ignore
      window.dataLayer.push(payload);
    },
  };
};

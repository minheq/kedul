import { AnalyticsClientInterface } from './AnalyticsClientInterface';

export const makeMixpanelClient = (): AnalyticsClientInterface => {
  // TODO: Add warning about missing tracking-id

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
      window.mixpanel.track(payload.event, payload.properties);
    },
  };
};

import { AnalyticsClientInterface } from './AnalyticsClientInterface';

export const makeFullstoryClient = (): AnalyticsClientInterface => {
  // TODO: Add warning about missing tracking-id

  return {
    group: payload => {
      return;
    },
    identify: payload => {
      // @ts-ignore
      window.FS.identify(payload.userId, payload.traits);
      return;
    },
    screen: payload => {
      return;
    },
    track: payload => {
      return;
    },
  };
};

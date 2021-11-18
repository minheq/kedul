import { AnalyticsClientInterface } from './AnalyticsClientInterface';

export const makeGoogleAnalyticsClient = (): AnalyticsClientInterface => {
  // TODO: Add warning about missing tracking-id

  return {
    group: payload => {
      return;
    },
    identify: payload => {
      // @ts-ignore
      ga('set', 'userId', payload.userId);
    },
    screen: payload => {
      return;
    },
    track: payload => {
      // @ts-ignore
      ga('send', {
        eventAction: payload.event,
        ...(payload.properties
          ? {
              eventCategory: payload.properties.category,
              eventLabel: payload.properties.label,
            }
          : {}),
        hitType: 'event',
      });
    },
  };
};

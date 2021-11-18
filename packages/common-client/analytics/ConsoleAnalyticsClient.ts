import { AnalyticsClientInterface } from './AnalyticsClientInterface';

export const ConsoleAnalyticsClient: AnalyticsClientInterface = {
  group: payload => {
    console.info('group', payload);
    return;
  },
  identify: payload => {
    console.info('identify', payload);
    return;
  },
  screen: payload => {
    console.info('screen', payload);
    return;
  },
  track: payload => {
    console.info('track', payload);
    return;
  },
};

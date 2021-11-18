import { Payload } from './AnalyticsContext';

export interface AnalyticsClientInterface {
  group(payload: Payload): void;
  identify(payload: Payload): void;
  screen(payload: Payload): void;
  track(payload: Payload): void;
}

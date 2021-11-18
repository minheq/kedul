import { makeLogger } from '@kedul/common-utils';

import { ClientSendSMS } from './PhoneClientInterface';

export const sendSMS = async (sms: ClientSendSMS) => {
  const logger = makeLogger();

  logger.info('Send SMS', sms);
};

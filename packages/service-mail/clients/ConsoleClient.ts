import { makeLogger } from '@kedul/common-utils';

import { ClientSendEmail } from './MailClientInterface';

export const sendMail = async ({ html, ...email }: ClientSendEmail) => {
  const logger = makeLogger();

  logger.info('Send email', email);
};

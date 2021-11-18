import { RequestContext } from '@kedul/common-server';

import { htmlTemplate } from './compiled/emailVerificationEmail';
import { DEFAULT_LOCALE } from './Locale';
import { defaultMailConfig, paths } from './MailConfig';
import { sendEmail } from './MailSender';
import { locale } from './templates/emailVerification/emailVerificationData';

export const sendVerificationCode = async (
  to: string,
  input: { code: string; state: string },
  context: RequestContext,
  mailConfig = defaultMailConfig,
) => {
  const link = `${mailConfig.siteUrl}${paths.loginVerificationPath}?code=${
    input.code
  }&state${input.state}`;

  const data = { ...input, link };

  const messagesObj = locale(data);
  const messages = messagesObj[context.locale] || messagesObj[DEFAULT_LOCALE];

  const text = `${messages.copyPaste} ${input.code}`;

  await sendEmail({ htmlTemplate, text, locale })({
    context,
    data,
    mailConfig,
    to,
  });
};

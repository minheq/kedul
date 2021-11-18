import { RequestContext } from '@kedul/common-server';

import { htmlTemplate } from './compiled/emailVerificationEmail';
import { DEFAULT_LOCALE } from './Locale';
import { defaultMailConfig, paths } from './MailConfig';
import { sendEmail } from './MailSender';
import { locale } from './templates/businessMemberInvitation/businessMemberInvitationData';

export const sendBusinessMemberInvitation = async (
  to: string,
  input: { token: string; businessName: string },
  context: RequestContext,
  mailConfig = defaultMailConfig,
) => {
  const link = `${mailConfig.siteUrl}${
    paths.businessMemberInvitationPath
  }?token=${input.token}`;

  const data = {
    ...input,
    link,
  };

  const messagesObj = locale(data);
  const messages = messagesObj[context.locale] || messagesObj[DEFAULT_LOCALE];

  const text = `${messages.title} ${data.businessName} ${data.link}`;

  await sendEmail({ htmlTemplate, text, locale })({
    context,
    data,
    mailConfig,
    to,
  });
};

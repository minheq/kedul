import { RequestContext } from '@kedul/common-server';
import { isProduction } from '@kedul/common-utils';

import { sendMail as sendMailAWSPinpoint } from './clients/AWSPinpointClient';
import { sendMail as sendMailConsole } from './clients/ConsoleClient';
import { env } from './env';
import { DEFAULT_LOCALE } from './Locale';
import { defaultMailConfig, MailConfig, paths } from './MailConfig';

export const compileBody = async <T = any>(raw: string, data: T) => {
  const { compile } = await import('handlebars');

  const template = compile(raw);

  return template(data);
};

export const clientSendMail = isProduction
  ? sendMailAWSPinpoint
  : sendMailConsole;

export const sendEmail = ({
  htmlTemplate,
  text,
  locale,
}: {
  htmlTemplate: any;
  text: string;
  locale: any;
}) => async <TData = any>({
  to,
  data,
  context,
  mailConfig = defaultMailConfig,
}: {
  to: string;
  data: TData;
  context: RequestContext;
  mailConfig: MailConfig;
}) => {
  const messagesObj = locale(data);
  const messages = messagesObj[context.locale] || messagesObj[DEFAULT_LOCALE];

  const variables = Object.assign(data, messages, paths, mailConfig);

  const html = await compileBody(htmlTemplate, variables);

  await clientSendMail({
    from: env.mail.config.from,
    html,
    subject: messages.subject,
    text,
    to,
  });
};

import { RequestContext } from '@kedul/common-server';

import { sendSms } from './SmsSender';

const locale: {
  [locale: string]: any;
} = {
  'en-US': {
    login: 'Your login code is:',
  },
  'vi-VN': {
    login: 'Your login code is:',
  },
};

export interface VerificationSmsData {
  code: string;
}

export const sendVerificationCode = async (
  phoneNumber: string,
  data: VerificationSmsData,
  context: RequestContext,
) => {
  const message = locale[context.locale] || locale['en-US'];

  await sendSms({ to: phoneNumber, text: `${message.login} ${data.code}` });
};

import { config } from '@kedul/common-config';
import { RequestContext } from '@kedul/common-server';

import { sendSms } from './SmsSender';

const locale: {
  [locale: string]: any;
} = {
  'en-US': {
    accept: 'Click the link to accept',
    invited: 'You were invited to join',
  },
  'vi-VN': {
    accept: 'Click the link to accept',
    invited: 'You were invited to join',
  },
};

export interface BusinessMemberInvitationSmsData {
  token: string;
  businessName: string;
}

export const sendBusinessMemberInvitation = async (
  phoneNumber: string,
  data: BusinessMemberInvitationSmsData,
  context: RequestContext,
) => {
  const message = locale[context.locale] || locale['en-US'];

  await sendSms({
    text: `${message.invited} ${data.businessName}. ${message.accept} ${
      config.appUrl
    }/i/${data.token}`,
    to: phoneNumber,
  });
};

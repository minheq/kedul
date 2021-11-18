import { config } from '@kedul/common-config';
import { RequestContext } from '@kedul/common-server';

import { sendSms } from './SmsSender';

export interface EmployeeInvitationSmsData {
  token: string;
  businessName: string;
  locationName: string;
}

export const sendEmployeeInvitation = async (
  phoneNumber: string,
  data: EmployeeInvitationSmsData,
  context: RequestContext,
) => {
  const i18n = context.dependencies.i18n;

  await sendSms({
    text: i18n.t(
      `You were invited to {{businessName}} to manage {{locationName}} on ${
        config.appName
      }. Sign up at ${config.appUrl} to accept the invitation.`,
      data,
    ),
    to: phoneNumber,
  });
};

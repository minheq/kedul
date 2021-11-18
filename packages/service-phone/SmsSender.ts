import { isProduction } from '@kedul/common-utils';

import { sendSMS as sendSMSAWSPinpoint } from './clients/AWSPinpointClient';
import { sendSMS as sendSMSConsole } from './clients/ConsoleClient';

export const sendSms = isProduction ? sendSMSAWSPinpoint : sendSMSConsole;

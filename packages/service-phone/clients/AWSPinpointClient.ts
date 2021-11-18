import { env } from '../env';

import { ClientSendSMS } from './PhoneClientInterface';

const clientParamsToPinpointParams = (
  params: ClientSendSMS,
): AWS.Pinpoint.SendMessagesRequest => {
  return {
    ApplicationId: env.services.aws.pinpoint.applicationId,
    MessageRequest: {
      Addresses: {
        [params.to]: {
          ChannelType: 'SMS',
        },
      },
      MessageConfiguration: {
        SMSMessage: {
          Body: params.text,
          MessageType: 'TRANSACTIONAL',
        },
      },
    },
  };
};

export const sendSMS = async (params: ClientSendSMS) => {
  const AWS = await import('aws-sdk');

  // Set the region
  AWS.config.update({ region: env.services.aws.pinpoint.region });

  return new AWS.Pinpoint()
    .sendMessages(clientParamsToPinpointParams(params))
    .promise();
};

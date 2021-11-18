import { env } from '../env';

import { ClientSendEmail } from './MailClientInterface';

const clientParamsToPinpointParams = (
  params: ClientSendEmail,
): AWS.Pinpoint.SendMessagesRequest => {
  return {
    ApplicationId: env.services.aws.pinpoint.applicationId,
    MessageRequest: {
      Addresses: {
        [params.to]: {
          ChannelType: 'EMAIL',
        },
      },
      MessageConfiguration: {
        EmailMessage: {
          FromAddress: params.from,
          SimpleEmail: {
            HtmlPart: {
              Charset: 'UTF-8',
              Data: params.html,
            },
            Subject: {
              Charset: 'UTF-8',
              Data: params.subject,
            },
            TextPart: {
              Charset: 'UTF-8',
              Data: params.text,
            },
          },
        },
      },
    },
  };
};

export const sendMail = async (params: ClientSendEmail) => {
  const AWS = await import('aws-sdk');

  // Set the region
  AWS.config.update({ region: env.services.aws.pinpoint.region });

  return new AWS.Pinpoint()
    .sendMessages(clientParamsToPinpointParams(params))
    .promise();
};

import { env } from '../env';

import { ClientSendEmail } from './MailClientInterface';

const clientParamsToAWSSESParams = (
  params: ClientSendEmail,
): AWS.SES.SendEmailRequest => {
  return {
    Destination: {
      ToAddresses: [params.to],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: params.html,
        },
        Text: {
          Charset: 'UTF-8',
          Data: params.text,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: params.subject,
      },
    },
    Source: params.from,
  };
};

export const sendMail = async (params: ClientSendEmail) => {
  const AWS = await import('aws-sdk');
  // Set the region
  AWS.config.update({ region: env.services.aws.ses.region });

  return new AWS.SES().sendEmail(clientParamsToAWSSESParams(params)).promise();
};

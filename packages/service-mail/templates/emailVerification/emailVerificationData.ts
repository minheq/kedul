import { partialsLocale } from '../partials/partialsLocale';

export interface EmailVerificationData {
  code: string;
  link: string;
  state: string;
}

export const previewData: EmailVerificationData = {
  code: '123123',
  link: 'https://somelink.com/abc',
  state: 'ajsndlfjwhefli1u2he1liwjhaisduc',
};

export const locale = (
  data: EmailVerificationData,
): { [locale: string]: any } => ({
  'en-US': {
    copyPaste: 'Copy and paste this temporary login code:',
    ignoreIfNot: `If you didn't try to log in, you can safely ignore this email`,
    loginButton: 'Log in to app',
    or: 'Or',
    subject: `Your Kedul Login Code is ${data.code}`,
    title: 'Click to enter the Kedul',
    ...partialsLocale['en-US'],
  },
  'vi-VN': {
    shortMessage: 'short message',
    subject: 'Please verify your email',
    ...partialsLocale['vi-VN'],
  },
});

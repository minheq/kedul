import { partialsLocale } from '../partials/partialsLocale';

export interface BusinessMemberInvitationData {
  businessName: string;
  link: string;
  token: string;
}

export const previewData: BusinessMemberInvitationData = {
  businessName: 'Acme Inc.',
  link: 'https://somelink.com/abc',
  token: 'ajsndlfjwhefli1u2he1liwjhaisduc',
};

export const locale = (
  data: BusinessMemberInvitationData,
): { [locale: string]: any } => ({
  'en-US': {
    acceptButton: 'Accept invitation',
    ignoreIfNot:
      'If you were not expecting this invitation, you can safely ignore this email',
    invitationFirst: 'Collaborate with',
    invitationSecond: 'on Kedul - salon management software',
    subject: `Invitation To Join ${data.businessName}`,
    title: 'Invitation to join',
    ...partialsLocale['en-US'],
  },
  'vi-VN': {
    shortMessage: 'short message',
    subject: 'Please verify your email',
    ...partialsLocale['vi-VN'],
  },
});

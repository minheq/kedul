export interface MailConfig {
  from: string;
  siteUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  primaryColor: string;
  textColor: string;
}

export const defaultMailConfig: MailConfig = {
  from: 'hello@kedul.com',
  siteUrl: 'www.kedul.com',

  facebookUrl: '',
  instagramUrl: '',

  primaryColor: '',
  textColor: '',
};

export const paths = {
  businessMemberInvitationPath: '/invitation/accept',
  loginVerificationPath: '/login/verify',
};

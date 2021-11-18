import axios from 'axios';

import { FacebookProfile } from './FacebookMutations';

const FACEBOOK_GRAPH_VERSION = 'v3.1';
const FACEBOOK_GRAPH_BASE_URL = 'https://graph.facebook.com/';

const facebookProfileFields = [
  'id',
  'email',
  'age_range',
  'birthday',
  'first_name',
  'last_name',
  'gender',
  'link',
  'location',
  'middle_name',
  'name',
];

export const getFacebookProfile = async (
  accessToken: string,
  fields: string[] = facebookProfileFields,
): Promise<FacebookProfile> => {
  const url =
    FACEBOOK_GRAPH_BASE_URL +
    FACEBOOK_GRAPH_VERSION +
    `/me?access_token=${accessToken}` +
    `&fields=${encodeURIComponent(fields.join(','))}`;

  const response = await axios({
    method: 'get',
    url,
  });

  return {
    ...response.data,
    id: String(response.data.id),
  };
};

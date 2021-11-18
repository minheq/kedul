import { ImageSourcePropType } from 'react-native';

import { UserProfile } from '../generated/MutationsAndQueries';

import { getImageSource } from './ImageUtils';

export const getUserAvatar = (
  userProfile?: UserProfile | null,
): {
  source?: ImageSourcePropType;
  name?: string;
} => {
  if (!userProfile) {
    return {
      source: undefined,
      name: undefined,
    };
  }

  return {
    source: getImageSource(userProfile.profileImage),
    name: userProfile.fullName,
  };
};

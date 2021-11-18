import { isFunction } from 'lodash';
import React from 'react';

import {
  CurrentBusinessFragment,
  CurrentUserFragment,
  LocationFragment,
} from '../generated/MutationsAndQueries';

import { CurrentBusiness } from './CurrentBusiness';
import { CurrentLocation } from './CurrentLocation';
import { CurrentUser } from './CurrentUser';

export interface CurrentUserProps {
  children:
    | ((props: {
        currentUser: CurrentUserFragment;
        currentBusiness: CurrentBusinessFragment;
        currentLocation: LocationFragment;
      }) => React.ReactNode)
    | React.ReactNode;
}

export const CurrentUserBusinessAndLocation = (props: CurrentUserProps) => {
  const { children } = props;

  return (
    <CurrentUser>
      {currentUser => (
        <CurrentBusiness>
          {currentBusiness => (
            <CurrentLocation>
              {currentLocation => {
                if (isFunction(children)) {
                  return children({
                    currentUser,
                    currentBusiness,
                    currentLocation,
                  });
                }

                return <>{children}</>;
              }}
            </CurrentLocation>
          )}
        </CurrentBusiness>
      )}
    </CurrentUser>
  );
};

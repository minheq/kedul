import React from 'react';
import { AsyncStorage } from 'react-native';

import {
  LocationFragment,
  useLocationQuery,
} from '../generated/MutationsAndQueries';

import { ASYNC_STORAGE_LOCATION_ID } from './Storage';

export interface LocationContext {
  currentLocation: LocationFragment | null;
  isLocationLoading: boolean;
  setCurrentLocation: (location: LocationFragment) => Promise<void>;
  unsetCurrentLocation: () => Promise<void>;
}

const defaultLocationContext: LocationContext = {
  currentLocation: null,
  setCurrentLocation: async () => {},
  unsetCurrentLocation: async () => {},
  isLocationLoading: true,
};

export const LocationContext = React.createContext(defaultLocationContext);

export const useCurrentLocation = () => {
  return React.useContext(LocationContext);
};

export interface CurrentLocationProviderProps {
  children: React.ReactNode;
}

interface State {
  isLoadingFromStorage: boolean;
  currentLocationId: string | null;
}

const initialState: State = {
  currentLocationId: null,
  isLoadingFromStorage: true,
};

enum ActionType {
  LOAD_FROM_STORAGE_SUCCESS = 'LOAD_FROM_STORAGE_SUCCESS',
  SET_CURRENT_BUSINESS_ID = 'SET_CURRENT_BUSINESS_ID',
  UNSET_CURRENT_BUSINESS_ID = 'UNSET_CURRENT_BUSINESS_ID',
}

type Action =
  | {
      type: ActionType.LOAD_FROM_STORAGE_SUCCESS;
      payload: { locationId: string | null };
    }
  | {
      type: ActionType.SET_CURRENT_BUSINESS_ID;
      payload: { locationId: string };
    }
  | {
      type: ActionType.UNSET_CURRENT_BUSINESS_ID;
    };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.LOAD_FROM_STORAGE_SUCCESS:
      return {
        ...state,
        currentLocationId: action.payload.locationId,
        isLoadingFromStorage: false,
      };
    case ActionType.SET_CURRENT_BUSINESS_ID:
      return {
        ...state,
        currentLocationId: action.payload.locationId,
      };
    case ActionType.UNSET_CURRENT_BUSINESS_ID:
      return {
        ...state,
        currentLocationId: null,
      };
    default:
      return state;
  }
};

const saveLocationId = async (locationId: string) => {
  return AsyncStorage.setItem(ASYNC_STORAGE_LOCATION_ID, locationId);
};

const removeLocationId = async () => {
  return AsyncStorage.removeItem(ASYNC_STORAGE_LOCATION_ID);
};

const readLocationId = async () => {
  return AsyncStorage.getItem(ASYNC_STORAGE_LOCATION_ID);
};

export const CurrentLocationProvider = (
  props: CurrentLocationProviderProps,
) => {
  const { children } = props;
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const { data, loading } = useLocationQuery({
    variables: { id: state.currentLocationId || '' },
    skip: !state.currentLocationId,
    notifyOnNetworkStatusChange: true,
  });

  React.useEffect(() => {
    readLocationId().then(locationId => {
      dispatch({
        type: ActionType.LOAD_FROM_STORAGE_SUCCESS,
        payload: { locationId },
      });
    });
  }, []);

  const handleSetCurrentLocation = async (business: LocationFragment) => {
    dispatch({
      type: ActionType.SET_CURRENT_BUSINESS_ID,
      payload: { locationId: business.id },
    });
    await saveLocationId(business.id);
  };

  const handleUnsetCurrentLocation = async () => {
    dispatch({ type: ActionType.UNSET_CURRENT_BUSINESS_ID });
    await removeLocationId();
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation: (data && data.location) || null,
        setCurrentLocation: handleSetCurrentLocation,
        unsetCurrentLocation: handleUnsetCurrentLocation,
        isLocationLoading: state.isLoadingFromStorage || loading,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

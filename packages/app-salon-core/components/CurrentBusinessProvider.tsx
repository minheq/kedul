import React from 'react';
import { AsyncStorage } from 'react-native';

import {
  BusinessFragment,
  CurrentBusinessFragment,
  useCurrentBusinessQuery,
} from '../generated/MutationsAndQueries';

import { ASYNC_STORAGE_BUSINESS_ID } from './Storage';

export interface BusinessContext {
  currentBusiness: CurrentBusinessFragment | null;
  isBusinessLoading: boolean;
  setCurrentBusiness: (business: BusinessFragment) => Promise<void>;
  unsetCurrentBusiness: () => Promise<void>;
}

const defaultBusinessContext: BusinessContext = {
  currentBusiness: null,
  setCurrentBusiness: async () => {},
  isBusinessLoading: true,
  unsetCurrentBusiness: async () => {},
};

export const BusinessContext = React.createContext(defaultBusinessContext);

export const useCurrentBusiness = () => {
  return React.useContext(BusinessContext);
};

export interface CurrentBusinessProviderProps {
  children: React.ReactNode;
}

interface State {
  isLoadingFromStorage: boolean;
  currentBusinessId: string | null;
}

const initialState: State = {
  currentBusinessId: null,
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
      payload: { businessId: string | null };
    }
  | {
      type: ActionType.UNSET_CURRENT_BUSINESS_ID;
    }
  | {
      type: ActionType.SET_CURRENT_BUSINESS_ID;
      payload: { businessId: string };
    };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.LOAD_FROM_STORAGE_SUCCESS:
      return {
        ...state,
        currentBusinessId: action.payload.businessId,
        isLoadingFromStorage: false,
      };
    case ActionType.SET_CURRENT_BUSINESS_ID:
      return {
        ...state,
        currentBusinessId: action.payload.businessId,
      };
    case ActionType.UNSET_CURRENT_BUSINESS_ID:
      return {
        ...state,
        currentBusinessId: null,
      };
    default:
      return state;
  }
};

const saveBusinessId = async (businessId: string) => {
  return AsyncStorage.setItem(ASYNC_STORAGE_BUSINESS_ID, businessId);
};

const removeBusinessId = async () => {
  return AsyncStorage.removeItem(ASYNC_STORAGE_BUSINESS_ID);
};

const readBusinessId = async () => {
  return AsyncStorage.getItem(ASYNC_STORAGE_BUSINESS_ID);
};

export const CurrentBusinessProvider = (
  props: CurrentBusinessProviderProps,
) => {
  const { children } = props;
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const { data, loading, refetch } = useCurrentBusinessQuery({
    notifyOnNetworkStatusChange: true,
  });

  React.useEffect(() => {
    readBusinessId().then(businessId => {
      dispatch({
        type: ActionType.LOAD_FROM_STORAGE_SUCCESS,
        payload: { businessId },
      });
    });
  }, []);

  const handleSetCurrentBusiness = async (business: BusinessFragment) => {
    dispatch({
      type: ActionType.SET_CURRENT_BUSINESS_ID,
      payload: { businessId: business.id },
    });

    await saveBusinessId(business.id);
    // Refetch needs to happen after saving businessId to localStorage
    // so that businessId from localStorage gets loaded to request header
    await refetch();
  };

  const handleUnsetCurrentBusiness = async () => {
    dispatch({ type: ActionType.UNSET_CURRENT_BUSINESS_ID });

    await removeBusinessId();
    await refetch();
  };

  return (
    <BusinessContext.Provider
      value={{
        currentBusiness: (data && data.currentBusiness) || null,
        setCurrentBusiness: handleSetCurrentBusiness,
        unsetCurrentBusiness: handleUnsetCurrentBusiness,
        isBusinessLoading: state.isLoadingFromStorage || loading,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

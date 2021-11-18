import { Locale } from '@kedul/common-config';
import i18next from 'i18next';
import LocizeBackend from 'i18next-locize-backend';
import React from 'react';
import { initReactI18next } from 'react-i18next';

import { env } from '../env';

export interface I18n {
  t: <TDictionary extends object = any>(
    text: string,
    dict?: TDictionary,
  ) => string;
  isI18nLoading: boolean;
}

const initialI18n: I18n = {
  isI18nLoading: true,
  t: text => text,
};
export const I18nContext = React.createContext<I18n>(initialI18n);

export const useI18n = () => {
  return React.useContext(I18nContext);
};

export interface I18nProviderProps {
  children: React.ReactNode;
}

const locizeOptions = {
  allowedAddOrUpdateHosts: ['localhost'],
  apiKey: env.services.locize.apiKey,
  projectId: env.services.locize.projectId,
  referenceLng: Locale.EN_US,
};

export const I18nProvider = (props: I18nProviderProps) => {
  const { children } = props;
  const [i18n, setI18n] = React.useState<I18n>(initialI18n);

  React.useEffect(() => {
    i18next
      .use(initReactI18next)
      .use(LocizeBackend)
      .init({
        backend: locizeOptions,
        debug: env.logger.level === 'debug',
        fallbackLng: Locale.EN_US,
        saveMissing: true,
      })
      .then(t => {
        setI18n({ t, isI18nLoading: false });
      });
  }, []);

  return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>;
};

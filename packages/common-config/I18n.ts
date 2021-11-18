import { countries } from 'countries-list';

// eslint-disable-next-line
const i18next = require('i18next');

export enum Locale {
  EN_US = 'en-US',
  VI_VN = 'vi-VN',
}

export interface LocaleData {
  readonly name: string;
  readonly nativeName: string;
  readonly rtl: boolean;
}

const locales: { [locale in Locale]: LocaleData } = {
  [Locale.EN_US]: {
    name: countries.US.name,
    nativeName: countries.US.native,
    rtl: false,
  },
  [Locale.VI_VN]: {
    name: countries.VN.name,
    nativeName: countries.VN.native,
    rtl: false,
  },
};

export type I18n = any;

i18next.locales = locales;

export const i18n = i18next;

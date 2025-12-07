// File: src/i18n/index.ts

import { createI18n } from 'vue-i18n';
import zh from './zh';
import en from './en';

const messages = {
  zh,
  en
};

const defaultLocale = 'zh';

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  messages,
  globalInjection: true
});

export default i18n;
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { STORAGE_KEY, DEFAULT_LANGUAGE, isRtlLanguage, SUPPORTED_LANGUAGES } from './languages';

import en from '../locales/en.json';
import hi from '../locales/hi.json';
import bn from '../locales/bn.json';
import as from '../locales/as.json';
import gu from '../locales/gu.json';
import mr from '../locales/mr.json';
import ta from '../locales/ta.json';
import te from '../locales/te.json';
import kn from '../locales/kn.json';
import ml from '../locales/ml.json';
import or_ from '../locales/or.json';
import pa from '../locales/pa.json';
import ur from '../locales/ur.json';
import sa from '../locales/sa.json';
import kok from '../locales/kok.json';
import mai from '../locales/mai.json';
import ne from '../locales/ne.json';
import sd from '../locales/sd.json';
import ks from '../locales/ks.json';
import mni from '../locales/mni.json';
import sat from '../locales/sat.json';
import brx from '../locales/brx.json';
import doi from '../locales/doi.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  bn: { translation: bn },
  as: { translation: as },
  gu: { translation: gu },
  mr: { translation: mr },
  ta: { translation: ta },
  te: { translation: te },
  kn: { translation: kn },
  ml: { translation: ml },
  or: { translation: or_ },
  pa: { translation: pa },
  ur: { translation: ur },
  sa: { translation: sa },
  kok: { translation: kok },
  mai: { translation: mai },
  ne: { translation: ne },
  sd: { translation: sd },
  ks: { translation: ks },
  mni: { translation: mni },
  sat: { translation: sat },
  brx: { translation: brx },
  doi: { translation: doi }
};

// 1. Initial Language detection with safe fallback
const getInitialLanguage = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
    }
  } catch (e) {
    console.warn('localStorage access failed, fallback to English', e);
  }
  return DEFAULT_LANGUAGE;
};

const initialLang = getInitialLanguage();

// 2. Synchronize HTML document direction & lang attribute immediately
export const applyDocumentDirection = (langCode) => {
  if (typeof document !== 'undefined') {
    const isRtl = isRtlLanguage(langCode);
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = langCode;
  }
};

applyDocumentDirection(initialLang);

// 3. Initialize i18next instance
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false // React safely escapes values
    },
    react: {
      useSuspense: false
    }
  });

// 4. Listen to language changes to persist and update document direction
i18n.on('languageChanged', (lang) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  } catch (e) {
    console.warn('Failed to save language to localStorage', e);
  }
  applyDocumentDirection(lang);
});

export default i18n;

import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import es from './locales/es.json'
import he from './locales/he.json'

export const SUPPORTED_LOCALES = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', dir: 'rtl' },
]

export const DEFAULT_LOCALE = 'en'
const STORAGE_KEY = 'ifm-locale'

export function getLocaleMeta(code) {
  return SUPPORTED_LOCALES.find((l) => l.code === code) ?? SUPPORTED_LOCALES[0]
}

/**
 * Resolution order: saved choice -> browser language -> English.
 * Wrapped in try/catch because localStorage throws in some privacy modes.
 */
function resolveInitialLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && SUPPORTED_LOCALES.some((l) => l.code === saved)) return saved
  } catch {
    /* storage unavailable — fall through */
  }

  const browser = (navigator.language || '').slice(0, 2).toLowerCase()
  if (SUPPORTED_LOCALES.some((l) => l.code === browser)) return browser

  return DEFAULT_LOCALE
}

export function persistLocale(code) {
  try {
    localStorage.setItem(STORAGE_KEY, code)
  } catch {
    /* non-fatal */
  }
}

/** Keeps <html lang> and <html dir> in sync so RTL mirroring works. */
export function applyDocumentLocale(code) {
  const meta = getLocaleMeta(code)
  document.documentElement.lang = meta.code
  document.documentElement.dir = meta.dir
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: resolveInitialLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages: { en, es, he },
})

applyDocumentLocale(i18n.global.locale.value)

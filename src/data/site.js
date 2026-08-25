/**
 * Single source of truth for contact + practice details.
 * Kept out of the locale files so a number is never updated in only one language.
 */

// Placeholder number supplied by the client — replace before going live.
const WHATSAPP_DIGITS = '549115555555'

export const site = {
  doctor: {
    fullName: 'Isaac Fernando Meta',
    credential: 'DDS',
  },
  whatsapp: {
    digits: WHATSAPP_DIGITS,
    display: '+54 9 11 5555-555',
    link: `https://wa.me/${WHATSAPP_DIGITS}`,
  },
  phone: {
    display: '+54 9 11 5555-555',
    link: `tel:+${WHATSAPP_DIGITS}`,
  },
  email: {
    address: 'hello@drmeta.dental',
    link: 'mailto:hello@drmeta.dental',
  },
  address: {
    street: 'Av. Santa Fe 1234, Piso 5',
    city: 'Buenos Aires',
    country: 'Argentina',
    mapsLink: 'https://maps.google.com/?q=Av.+Santa+Fe+1234+Buenos+Aires',
  },
  social: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
  },
}

/**
 * Builds a wa.me deep link with a prefilled, already-localised message.
 * @param {string} [message] localised text to prefill
 */
export function whatsappUrl(message) {
  if (!message) return site.whatsapp.link
  return `${site.whatsapp.link}?text=${encodeURIComponent(message)}`
}

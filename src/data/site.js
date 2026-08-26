/**
 * Single source of truth for practice details.
 * Kept out of the locale files so a number is never updated in only one language.
 *
 * All values below are the real practice details taken from the existing site.
 */

const WHATSAPP_DIGITS = '5491130501028'

export const site = {
  doctor: {
    fullName: 'Isaac Fernando Meta',
    /** The form used as the practice's brand mark. */
    shortName: 'Isaac F. Meta',
    credential: 'DDS, MS',
  },
  whatsapp: {
    digits: WHATSAPP_DIGITS,
    display: '+54 9 11 3050-1028',
    link: `https://wa.me/${WHATSAPP_DIGITS}`,
  },
  phone: {
    display: '+54 9 11 3050-1028',
    link: `tel:+${WHATSAPP_DIGITS}`,
  },
  email: {
    address: 'isaac.meta@gmail.com',
    link: 'mailto:isaac.meta@gmail.com',
  },
  address: {
    street: 'Av. R. Scalabrini Ortiz 2089, piso 8',
    neighbourhood: 'Palermo, C.A.B.A.',
    city: 'Buenos Aires',
    country: 'Argentina',
    mapsLink:
      'https://maps.google.com/?q=Av.+R.+Scalabrini+Ortiz+2089,+Palermo,+Buenos+Aires,+Argentina',
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

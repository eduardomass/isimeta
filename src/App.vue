<script setup>
import { watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { site } from '@/data/site'
import { useReveal } from '@/composables/useReveal'
import SiteHeader from '@/components/SiteHeader.vue'
import HeroSection from '@/components/HeroSection.vue'
import TrustSection from '@/components/TrustSection.vue'
import ServicesSection from '@/components/ServicesSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import ProcessSection from '@/components/ProcessSection.vue'
import TestimonialsSection from '@/components/TestimonialsSection.vue'
import FaqSection from '@/components/FaqSection.vue'
import ContactSection from '@/components/ContactSection.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import WhatsappFab from '@/components/WhatsappFab.vue'

const { t, tm, rt, locale } = useI18n()

useReveal()

/** Title, description and structured data all follow the active locale. */
watchEffect(() => {
  document.title = t('meta.title')

  let description = document.querySelector('meta[name="description"]')
  if (!description) {
    description = document.createElement('meta')
    description.setAttribute('name', 'description')
    document.head.appendChild(description)
  }
  description.setAttribute('content', t('meta.description'))

  // Dentist schema helps the practice surface correctly in local search.
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: `${site.doctor.shortName}, ${site.doctor.credential}`,
    founder: {
      '@type': 'Person',
      name: `${site.doctor.fullName}, ${site.doctor.credential}`,
      alumniOf: [
        { '@type': 'CollegeOrUniversity', name: 'University of Buenos Aires' },
        { '@type': 'CollegeOrUniversity', name: 'The Ohio State University' },
      ],
      knowsLanguage: ['en', 'es', 'he'],
    },
    description: t('meta.description'),
    inLanguage: locale.value,
    telephone: `+${site.whatsapp.digits}`,
    email: site.email.address,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: `${site.address.neighbourhood}, ${site.address.city}`,
      addressCountry: 'AR',
    },
    // The practice publishes "by appointment, Monday to Friday" and no times,
    // so the specification carries the days only.
    openingHours: 'Mo-Fr',
    availableService: [
      'implants',
      'grafting',
      'rehabilitation',
      'veneers',
      'smileDesign',
      'whitening',
    ].map((key) => ({
      '@type': 'MedicalProcedure',
      name: t(`services.items.${key}.title`),
      description: t(`services.items.${key}.description`),
    })),
    mainEntityOfPage: {
      '@type': 'FAQPage',
      mainEntity: tm('faq.items').map((item) => ({
        '@type': 'Question',
        name: rt(item.question),
        acceptedAnswer: { '@type': 'Answer', text: rt(item.answer) },
      })),
    },
  }

  let ld = document.querySelector('script[type="application/ld+json"]')
  if (!ld) {
    ld = document.createElement('script')
    ld.type = 'application/ld+json'
    document.head.appendChild(ld)
  }
  ld.textContent = JSON.stringify(schema)
})
</script>

<template>
  <a class="skip-link" href="#main">{{ t('a11y.skipToContent') }}</a>

  <SiteHeader />

  <main id="main">
    <HeroSection />
    <TrustSection />
    <ServicesSection />
    <AboutSection />
    <ProcessSection />
    <TestimonialsSection />
    <FaqSection />
    <ContactSection />
  </main>

  <SiteFooter />
  <WhatsappFab />
</template>

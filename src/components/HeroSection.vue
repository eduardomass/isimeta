<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { whatsappUrl } from '@/data/site'
import AppIcon from './AppIcon.vue'

const { t } = useI18n()
const bookUrl = computed(() => whatsappUrl(t('contact.whatsapp.prefill')))
</script>

<template>
  <section id="top" class="hero">
    <div class="container hero__inner">
      <div class="hero__content">
        <p class="hero__badge">
          <span class="hero__pulse" aria-hidden="true"></span>
          {{ t('hero.badge') }}
        </p>

        <h1 class="hero__title">{{ t('hero.title') }}</h1>
        <p class="hero__subtitle">{{ t('hero.subtitle') }}</p>

        <div class="hero__actions">
          <a class="btn btn--accent" :href="bookUrl" target="_blank" rel="noopener noreferrer">
            <AppIcon name="whatsapp" :size="20" class="btn__icon" />
            <span>{{ t('hero.ctaPrimary') }}</span>
            <span class="sr-only">{{ t('a11y.whatsappNew') }}</span>
          </a>
          <a class="btn btn--ghost" href="#services">
            <span>{{ t('hero.ctaSecondary') }}</span>
            <AppIcon name="arrowDown" :size="18" class="btn__icon" />
          </a>
        </div>

        <p class="hero__reassurance">
          <AppIcon name="clock" :size="16" class="hero__reassurance-icon" />
          {{ t('hero.reassurance') }}
        </p>
      </div>

      <!--
        Illustrative composition rather than a stock photo: it ships no image
        bytes, has a reserved aspect-ratio box (no layout shift), and cannot
        misrepresent a real person.
      -->
      <div class="hero__visual" role="img" :aria-label="t('hero.imageAlt')">
        <div class="hero__orb hero__orb--one" aria-hidden="true"></div>
        <div class="hero__orb hero__orb--two" aria-hidden="true"></div>

        <div class="hero__card">
          <span class="hero__card-mark" aria-hidden="true">
            <AppIcon name="tooth" :size="34" />
          </span>
          <p class="hero__card-title"><bdi>{{ t('trust.stats.rating.value') }}</bdi></p>
          <p class="hero__card-label">{{ t('trust.stats.rating.label') }}</p>
          <div class="hero__stars" aria-hidden="true">
            <AppIcon v-for="n in 5" :key="n" name="star" :size="16" class="hero__star" />
          </div>
        </div>

        <div class="hero__chip hero__chip--years">
          <strong><bdi>{{ t('trust.stats.years.value') }}</bdi></strong>
          <span>{{ t('trust.stats.years.label') }}</span>
        </div>

        <div class="hero__chip hero__chip--patients">
          <strong><bdi>{{ t('trust.stats.patients.value') }}</bdi></strong>
          <span>{{ t('trust.stats.patients.label') }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding-block: var(--space-2xl) var(--space-3xl);
  overflow: hidden;
  background:
    radial-gradient(120% 90% at 88% 4%, var(--color-primary-soft) 0%, transparent 58%),
    radial-gradient(90% 80% at 4% 100%, var(--color-accent-soft) 0%, transparent 55%);
}

.hero__inner {
  display: grid;
  gap: var(--space-2xl);
  align-items: center;
}

/* ---- Copy ---- */
.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3xs);
  padding: var(--space-3xs) var(--space-xs);
  border-radius: var(--radius-full);
  background-color: var(--color-card);
  border: 1px solid var(--color-border-strong);
  color: var(--color-primary-deep);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  box-shadow: var(--shadow-xs);
  margin-block-end: var(--space-md);
}

.hero__pulse {
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: var(--radius-full);
  background-color: var(--color-accent-deep);
  box-shadow: 0 0 0 3px var(--color-accent-soft);
}

.hero__title {
  font-size: var(--text-4xl);
  margin-block-end: var(--space-sm);
  max-width: 20ch;
}

.hero__subtitle {
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  color: var(--color-muted-foreground);
  max-width: 56ch;
  margin-block-end: var(--space-lg);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2xs);
  margin-block-end: var(--space-md);
}

.hero__reassurance {
  display: flex;
  align-items: center;
  gap: var(--space-3xs);
  font-size: var(--text-sm);
  color: var(--color-muted-foreground);
}

.hero__reassurance-icon {
  flex-shrink: 0;
  color: var(--color-primary-deep);
}

/* ---- Visual ---- */
.hero__visual {
  position: relative;
  aspect-ratio: 4 / 3; /* reserved space -> no CLS */
  display: grid;
  place-items: center;
  isolation: isolate;
}

.hero__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(2px);
  z-index: -1;
}

.hero__orb--one {
  inline-size: 62%;
  aspect-ratio: 1;
  background: radial-gradient(circle at 30% 30%, var(--color-secondary), var(--color-primary-deep));
  opacity: 0.22;
  inset-block-start: 4%;
  inset-inline-end: 6%;
}

.hero__orb--two {
  inline-size: 46%;
  aspect-ratio: 1;
  background: radial-gradient(circle at 70% 70%, var(--color-accent), var(--color-accent-deep));
  opacity: 0.18;
  inset-block-end: 6%;
  inset-inline-start: 4%;
}

.hero__card {
  position: relative;
  display: grid;
  justify-items: center;
  gap: var(--space-3xs);
  padding: var(--space-lg) var(--space-xl);
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  text-align: center;
}

.hero__card-mark {
  display: grid;
  place-items: center;
  inline-size: 4rem;
  block-size: 4rem;
  border-radius: var(--radius-lg);
  background-color: var(--color-primary-soft);
  color: var(--color-primary-deep);
  margin-block-end: var(--space-2xs);
}

.hero__card-title {
  font-size: var(--text-3xl);
  font-weight: var(--weight-bold);
  line-height: 1;
}

.hero__card-label {
  font-size: var(--text-sm);
  color: var(--color-muted-foreground);
}

.hero__stars {
  display: flex;
  gap: 2px;
  color: var(--color-accent-deep);
  margin-block-start: var(--space-3xs);
}

.hero__star {
  fill: currentColor;
}

/*
 * Floating stat chips. Hidden below 640px: at 375px they would overlap the
 * centre card, and the same figures already appear in the trust section.
 */
.hero__chip {
  display: none;
  position: absolute;
  gap: 2px;
  padding: var(--space-2xs) var(--space-xs);
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  text-align: start;
  max-inline-size: 9.5rem;
}

.hero__chip strong {
  font-size: var(--text-lg);
  line-height: 1.1;
}

.hero__chip span {
  font-size: var(--text-xs);
  color: var(--color-muted-foreground);
  line-height: 1.25;
}

.hero__chip--years {
  inset-block-start: 6%;
  inset-inline-start: 0;
}

.hero__chip--patients {
  inset-block-end: 8%;
  inset-inline-end: 0;
}

/* ---- Breakpoints ---- */
@media (min-width: 640px) {
  .hero__chip {
    display: grid;
  }
}

@media (min-width: 768px) {
  .hero__title {
    max-width: 24ch;
  }
}

@media (min-width: 1024px) {
  .hero {
    padding-block: var(--space-3xl);
  }

  .hero__inner {
    grid-template-columns: 1.05fr 0.95fr;
  }
}
</style>

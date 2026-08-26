<script setup>
import { useI18n } from 'vue-i18n'
import AppIcon from './AppIcon.vue'

const { t } = useI18n()

const SERVICES = [
  { key: 'implants', icon: 'tooth' },
  { key: 'grafting', icon: 'scan' },
  { key: 'rehabilitation', icon: 'braces' },
  { key: 'veneers', icon: 'sparkles' },
  { key: 'smileDesign', icon: 'heart' },
  { key: 'whitening', icon: 'shield' },
]
</script>

<template>
  <section id="services" class="section" aria-labelledby="services-title">
    <div class="container">
      <header class="section__header reveal">
        <span class="section__eyebrow">{{ t('services.eyebrow') }}</span>
        <h2 id="services-title" class="section__title">{{ t('services.title') }}</h2>
        <p class="section__lead">{{ t('services.lead') }}</p>
      </header>

      <ul class="services__grid">
        <li v-for="(service, i) in SERVICES" :key="service.key" class="reveal" :style="{ transitionDelay: `${i * 60}ms` }">
          <article class="card card--interactive services__card">
            <span class="services__icon" aria-hidden="true">
              <AppIcon :name="service.icon" :size="26" />
            </span>
            <h3 class="services__card-title">{{ t(`services.items.${service.key}.title`) }}</h3>
            <p class="services__card-text">{{ t(`services.items.${service.key}.description`) }}</p>
            <p class="services__detail">
              <AppIcon name="clock" :size="15" class="services__detail-icon" />
              <span>{{ t(`services.items.${service.key}.detail`) }}</span>
            </p>
          </article>
        </li>
      </ul>

      <aside class="services__note reveal">
        <AppIcon name="shield" :size="20" class="services__note-icon" />
        <p>{{ t('services.note') }}</p>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.services__grid {
  display: grid;
  gap: var(--space-md);
}

.services__card {
  block-size: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.services__icon {
  display: grid;
  place-items: center;
  inline-size: 3.25rem;
  block-size: 3.25rem;
  border-radius: var(--radius-md);
  background-color: var(--color-primary-soft);
  color: var(--color-primary-deep);
  margin-block-end: var(--space-2xs);
}

.services__card-title {
  font-size: var(--text-xl);
}

.services__card-text {
  color: var(--color-muted-foreground);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  flex-grow: 1;
}

.services__detail {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3xs);
  align-self: flex-start;
  padding: var(--space-3xs) var(--space-2xs);
  border-radius: var(--radius-full);
  background-color: var(--color-muted);
  color: var(--color-muted-foreground);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  /* Chips must not wrap mid-label, but must still shrink gracefully. */
  white-space: nowrap;
  max-inline-size: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-block-start: var(--space-2xs);
}

.services__detail-icon {
  flex-shrink: 0;
}

.services__note {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  margin-block-start: var(--space-xl);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  background-color: var(--color-primary-soft);
  border: 1px solid var(--color-border-strong);
}

.services__note-icon {
  flex-shrink: 0;
  margin-block-start: 0.15em;
  color: var(--color-primary-deep);
}

.services__note p {
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--color-foreground);
  max-width: 90ch;
}

@media (min-width: 640px) {
  .services__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .services__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>

<script setup>
import { useI18n } from 'vue-i18n'
import AppIcon from './AppIcon.vue'

const { t, tm, rt } = useI18n()

const STAT_KEYS = ['years', 'patients', 'rating', 'implants']
</script>

<template>
  <section class="trust section--alt" aria-labelledby="trust-title">
    <div class="container">
      <h2 id="trust-title" class="sr-only">{{ t('trust.title') }}</h2>

      <dl class="trust__stats reveal">
        <div v-for="key in STAT_KEYS" :key="key" class="trust__stat">
          <dt class="trust__stat-label">{{ t(`trust.stats.${key}.label`) }}</dt>
          <dd class="trust__stat-value">{{ t(`trust.stats.${key}.value`) }}</dd>
        </div>
      </dl>

      <div class="trust__credentials reveal">
        <h3 class="trust__credentials-title">
          <AppIcon name="award" :size="20" class="trust__credentials-icon" />
          {{ t('trust.credentials.title') }}
        </h3>
        <ul class="trust__list">
          <li v-for="(item, i) in tm('trust.credentials.items')" :key="i" class="trust__item">
            <AppIcon name="check" :size="18" class="trust__check" />
            <span>{{ rt(item) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.trust {
  padding-block: var(--space-2xl);
  background-color: var(--color-background-alt);
  border-block: 1px solid var(--color-border);
}

/* ---- Stats ---- */
.trust__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-md);
  margin-block-end: var(--space-2xl);
}

.trust__stat {
  display: flex;
  flex-direction: column-reverse; /* value renders above its label */
  gap: var(--space-3xs);
  padding-inline-start: var(--space-sm);
  border-inline-start: 3px solid var(--color-border-strong);
}

.trust__stat-value {
  font-size: var(--text-3xl);
  font-weight: var(--weight-bold);
  line-height: 1;
  color: var(--color-primary-deep);
  font-variant-numeric: tabular-nums;
}

.trust__stat-label {
  font-size: var(--text-sm);
  color: var(--color-muted-foreground);
  line-height: var(--leading-snug);
}

/* ---- Credentials ---- */
.trust__credentials-title {
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
  font-size: var(--text-lg);
  margin-block-end: var(--space-md);
}

.trust__credentials-icon {
  color: var(--color-primary-deep);
  flex-shrink: 0;
}

.trust__list {
  display: grid;
  gap: var(--space-2xs);
}

.trust__item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2xs);
  font-size: var(--text-sm);
  color: var(--color-muted-foreground);
  line-height: var(--leading-normal);
}

.trust__check {
  flex-shrink: 0;
  margin-block-start: 0.15em;
  color: var(--color-accent-deep);
}

@media (min-width: 768px) {
  .trust__stats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .trust__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-2xs) var(--space-lg);
  }
}
</style>

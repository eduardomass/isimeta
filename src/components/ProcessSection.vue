<script setup>
import { useI18n } from 'vue-i18n'
import AppIcon from './AppIcon.vue'

const { t } = useI18n()

const STEPS = [
  { key: 'one', icon: 'whatsapp' },
  { key: 'two', icon: 'scan' },
  { key: 'three', icon: 'handshake' },
  { key: 'four', icon: 'heart' },
]
</script>

<template>
  <section id="process" class="section" aria-labelledby="process-title">
    <div class="container">
      <header class="section__header reveal">
        <span class="section__eyebrow">{{ t('process.eyebrow') }}</span>
        <h2 id="process-title" class="section__title">{{ t('process.title') }}</h2>
        <p class="section__lead">{{ t('process.lead') }}</p>
      </header>

      <ol class="process__list">
        <li
          v-for="(step, i) in STEPS"
          :key="step.key"
          class="process__step reveal"
          :style="{ transitionDelay: `${i * 80}ms` }"
        >
          <div class="process__marker">
            <span class="process__number">{{ i + 1 }}</span>
            <span class="process__connector" aria-hidden="true"></span>
          </div>

          <div class="process__body">
            <h3 class="process__title">
              <AppIcon :name="step.icon" :size="18" class="process__icon" />
              {{ t(`process.steps.${step.key}.title`) }}
            </h3>
            <p class="process__text">{{ t(`process.steps.${step.key}.description`) }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.process__list {
  display: grid;
  gap: 0;
  counter-reset: step;
}

.process__step {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-md);
}

/* ---- Marker column ---- */
.process__marker {
  display: grid;
  grid-template-rows: auto 1fr;
  justify-items: center;
  gap: var(--space-2xs);
}

.process__number {
  display: grid;
  place-items: center;
  inline-size: 2.75rem;
  block-size: 2.75rem;
  border-radius: var(--radius-full);
  background-color: var(--color-primary-deep);
  color: var(--color-on-primary);
  font-weight: var(--weight-bold);
  font-variant-numeric: tabular-nums;
  box-shadow: var(--shadow-md);
  flex-shrink: 0;
}

.process__connector {
  inline-size: 2px;
  block-size: 100%;
  background: linear-gradient(to bottom, var(--color-border-strong), transparent);
  border-radius: var(--radius-full);
}

.process__step:last-child .process__connector {
  display: none;
}

/* ---- Body ---- */
.process__body {
  padding-block-end: var(--space-xl);
}

.process__step:last-child .process__body {
  padding-block-end: 0;
}

.process__title {
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
  font-size: var(--text-xl);
  margin-block-end: var(--space-3xs);
}

.process__icon {
  color: var(--color-accent-deep);
  flex-shrink: 0;
}

.process__text {
  color: var(--color-muted-foreground);
  line-height: var(--leading-relaxed);
  max-width: 58ch;
}

/* On wide screens the timeline becomes a four-across row of cards. */
@media (min-width: 1024px) {
  .process__list {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--space-md);
  }

  .process__step {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }

  .process__marker {
    grid-template-rows: auto;
    grid-template-columns: auto 1fr;
    justify-items: start;
    align-items: center;
    inline-size: 100%;
  }

  .process__connector {
    inline-size: 100%;
    block-size: 2px;
    background: linear-gradient(to right, var(--color-border-strong), transparent);
  }

  :global([dir='rtl']) .process__connector {
    background: linear-gradient(to left, var(--color-border-strong), transparent);
  }

  .process__body,
  .process__step:last-child .process__body {
    padding-block-end: 0;
  }

  .process__title {
    font-size: var(--text-lg);
  }
}
</style>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from './AppIcon.vue'

const { t, tm, rt } = useI18n()

const items = computed(() =>
  tm('faq.items').map((item) => ({
    question: rt(item.question),
    answer: rt(item.answer),
  })),
)
</script>

<template>
  <section id="faq" class="section" aria-labelledby="faq-title">
    <div class="container container--narrow">
      <header class="section__header reveal">
        <span class="section__eyebrow">{{ t('faq.eyebrow') }}</span>
        <h2 id="faq-title" class="section__title">{{ t('faq.title') }}</h2>
      </header>

      <!--
        Native <details>/<summary> gives keyboard operation, correct expanded
        state and in-page find-on-page expansion for free. `name` makes the group
        behave as an accordion where supported, degrading to independent
        toggles elsewhere.
      -->
      <ul class="faq__list">
        <li v-for="(item, i) in items" :key="i" class="reveal" :style="{ transitionDelay: `${i * 50}ms` }">
          <details class="faq__item" name="faq">
            <summary class="faq__question">
              <span>{{ item.question }}</span>
              <span class="faq__marker" aria-hidden="true">
                <AppIcon name="chevronDown" :size="20" />
              </span>
            </summary>
            <div class="faq__answer">
              <p>{{ item.answer }}</p>
            </div>
          </details>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.faq__list {
  display: grid;
  gap: var(--space-2xs);
}

.faq__item {
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
  overflow: hidden;
  transition:
    box-shadow var(--dur-base) var(--ease-out),
    border-color var(--dur-base) var(--ease-out);
}

.faq__item[open] {
  box-shadow: var(--shadow-md);
  border-color: var(--color-border-strong);
}

.faq__question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
  min-height: 56px;
  padding: var(--space-2xs) var(--space-md);
  font-weight: var(--weight-semibold);
  font-size: var(--text-base);
  color: var(--color-card-foreground);
  cursor: pointer;
  list-style: none;
  transition: color var(--dur-base) var(--ease-out);
}

/* Remove the default disclosure triangle across engines. */
.faq__question::-webkit-details-marker {
  display: none;
}

.faq__question::marker {
  content: '';
}

.faq__question:hover {
  color: var(--color-primary-deep);
}

.faq__marker {
  display: grid;
  place-items: center;
  inline-size: 2rem;
  block-size: 2rem;
  flex-shrink: 0;
  border-radius: var(--radius-full);
  background-color: var(--color-muted);
  color: var(--color-primary-deep);
  transition: transform var(--dur-base) var(--ease-out);
}

.faq__item[open] .faq__marker {
  transform: rotate(180deg);
}

.faq__answer {
  padding: 0 var(--space-md) var(--space-md);
}

.faq__answer p {
  color: var(--color-muted-foreground);
  line-height: var(--leading-relaxed);
  font-size: var(--text-sm);
}

@media (min-width: 768px) {
  .faq__answer p {
    font-size: var(--text-base);
  }
}
</style>

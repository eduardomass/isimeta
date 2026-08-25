<script setup>
import { useI18n } from 'vue-i18n'
import { site } from '@/data/site'
import AppIcon from './AppIcon.vue'

const { t, tm, rt } = useI18n()

const VALUES = [
  { key: 'honest', icon: 'handshake' },
  { key: 'gentle', icon: 'heart' },
  { key: 'modern', icon: 'scan' },
]

/** Initials for the portrait placeholder. */
const initials = site.doctor.fullName
  .split(' ')
  .map((part) => part[0])
  .join('')
</script>

<template>
  <section id="about" class="section section--alt" aria-labelledby="about-title">
    <div class="container about__inner">
      <div class="about__portrait reveal">
        <!--
          Placeholder portrait: an avatar built from initials rather than a stock
          photo, so the site never implies a likeness of a real person. Swap the
          block for an <img> with width/height set once a real photo exists.
        -->
        <div class="about__avatar" role="img" :aria-label="t('about.portraitAlt')">
          <span class="about__initials" aria-hidden="true">{{ initials }}</span>
        </div>

        <div class="about__badge">
          <AppIcon name="award" :size="18" class="about__badge-icon" />
          <span>{{ site.doctor.credential }}</span>
        </div>
      </div>

      <div class="about__content">
        <header class="reveal">
          <span class="section__eyebrow">{{ t('about.eyebrow') }}</span>
          <h2 id="about-title" class="section__title">{{ t('about.title') }}</h2>
        </header>

        <div class="about__prose reveal">
          <p v-for="(paragraph, i) in tm('about.paragraphs')" :key="i">{{ rt(paragraph) }}</p>
        </div>

        <ul class="about__values">
          <li v-for="(value, i) in VALUES" :key="value.key" class="about__value reveal" :style="{ transitionDelay: `${i * 70}ms` }">
            <span class="about__value-icon" aria-hidden="true">
              <AppIcon :name="value.icon" :size="20" />
            </span>
            <div>
              <h3 class="about__value-title">{{ t(`about.values.${value.key}.title`) }}</h3>
              <p class="about__value-text">{{ t(`about.values.${value.key}.description`) }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about__inner {
  display: grid;
  gap: var(--space-2xl);
  align-items: start;
}

/* ---- Portrait ---- */
.about__portrait {
  position: relative;
  max-inline-size: 26rem;
  margin-inline: auto;
  inline-size: 100%;
}

.about__avatar {
  aspect-ratio: 4 / 5;
  display: grid;
  place-items: center;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-lg);
  background:
    radial-gradient(80% 70% at 30% 20%, var(--color-primary-soft), transparent 70%),
    linear-gradient(160deg, var(--color-card), var(--color-muted));
}

.about__initials {
  font-size: clamp(3.5rem, 12vw, 5.5rem);
  font-weight: var(--weight-bold);
  letter-spacing: -0.04em;
  color: var(--color-primary-deep);
  opacity: 0.55;
}

.about__badge {
  position: absolute;
  inset-block-end: var(--space-md);
  inset-inline-start: calc(-1 * var(--space-2xs));
  display: inline-flex;
  align-items: center;
  gap: var(--space-3xs);
  padding: var(--space-2xs) var(--space-sm);
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-md);
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  letter-spacing: 0.06em;
  color: var(--color-primary-deep);
}

.about__badge-icon {
  flex-shrink: 0;
}

/* ---- Content ---- */
.about__prose {
  display: grid;
  gap: var(--space-sm);
  margin-block: var(--space-md) var(--space-lg);
}

.about__prose p {
  color: var(--color-muted-foreground);
  line-height: var(--leading-relaxed);
  max-width: 62ch;
}

.about__values {
  display: grid;
  gap: var(--space-md);
}

.about__value {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2xs);
}

.about__value-icon {
  display: grid;
  place-items: center;
  inline-size: 2.75rem;
  block-size: 2.75rem;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  background-color: var(--color-accent-soft);
  color: var(--color-accent-deep);
}

.about__value-title {
  font-size: var(--text-base);
  margin-block-end: 2px;
}

.about__value-text {
  font-size: var(--text-sm);
  color: var(--color-muted-foreground);
  line-height: var(--leading-normal);
  max-width: 52ch;
}

@media (min-width: 1024px) {
  .about__inner {
    grid-template-columns: 0.85fr 1.15fr;
    gap: var(--space-3xl);
  }

  .about__portrait {
    position: sticky;
    inset-block-start: calc(var(--header-h) + var(--space-md));
  }
}
</style>

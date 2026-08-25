<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from './AppIcon.vue'

const { t, tm, rt, locale } = useI18n()

const ROTATE_MS = 7000

const items = computed(() => tm('testimonials.items').map((item) => ({
  quote: rt(item.quote),
  name: rt(item.name),
  role: rt(item.role),
})))

const index = ref(0)
const paused = ref(false)
const reducedMotion = ref(false)
const regionEl = ref(null)
let timer = null

const total = computed(() => items.value.length)

/**
 * Autoplay runs only when the user has not paused it, is not interacting with
 * the carousel, and has not asked for reduced motion.
 */
function start() {
  stop()
  if (paused.value || reducedMotion.value) return
  timer = window.setInterval(() => {
    index.value = (index.value + 1) % total.value
  }, ROTATE_MS)
}

function stop() {
  if (timer !== null) {
    window.clearInterval(timer)
    timer = null
  }
}

function go(next) {
  index.value = (next + total.value) % total.value
  // Restart the dwell time so a manual move gets a full reading window.
  if (!paused.value) start()
}

function prev() {
  go(index.value - 1)
}

function next() {
  go(index.value + 1)
}

function togglePause() {
  paused.value = !paused.value
  paused.value ? stop() : start()
}

/** Interaction suspends rotation without changing the user's pause preference. */
function suspend() {
  stop()
}

function resume() {
  if (!paused.value) start()
}

/** Arrow keys follow reading direction, so they stay correct in Hebrew RTL. */
function onKeydown(event) {
  const isRtl = document.documentElement.dir === 'rtl'
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    isRtl ? prev() : next()
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    isRtl ? next() : prev()
  }
}

onMounted(() => {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = query.matches
  query.addEventListener('change', (e) => {
    reducedMotion.value = e.matches
    e.matches ? stop() : start()
  })
  start()
})

onBeforeUnmount(stop)
</script>

<template>
  <section id="testimonials" class="section section--alt" aria-labelledby="testimonials-title">
    <div class="container">
      <header class="section__header reveal">
        <span class="section__eyebrow">{{ t('testimonials.eyebrow') }}</span>
        <h2 id="testimonials-title" class="section__title">{{ t('testimonials.title') }}</h2>
      </header>

      <div
        class="carousel reveal"
        role="group"
        aria-roledescription="carousel"
        :aria-label="t('testimonials.title')"
        @mouseenter="suspend"
        @mouseleave="resume"
        @focusin="suspend"
        @focusout="resume"
        @keydown="onKeydown"
      >
        <!--
          Every slide stays in the DOM and is toggled with hidden, so screen
          readers and keyboard users reach all of them without dragging.
        -->
        <div ref="regionEl" class="carousel__viewport">
          <article
            v-for="(item, i) in items"
            :key="i"
            class="carousel__slide"
            :class="{ 'carousel__slide--active': i === index }"
            role="group"
            aria-roledescription="slide"
            :aria-label="t('a11y.slidePosition', { current: i + 1, total })"
            :hidden="i !== index"
          >
            <AppIcon name="quote" :size="32" class="carousel__quote-mark" />
            <blockquote class="carousel__quote">
              <p>{{ item.quote }}</p>
            </blockquote>
            <footer class="carousel__author">
              <span class="carousel__avatar" aria-hidden="true">{{ item.name.charAt(0) }}</span>
              <span class="carousel__author-text">
                <cite class="carousel__name">{{ item.name }}</cite>
                <span class="carousel__role">{{ item.role }}</span>
              </span>
              <span class="carousel__stars" aria-hidden="true">
                <AppIcon v-for="n in 5" :key="n" name="star" :size="15" class="carousel__star" />
              </span>
            </footer>
          </article>
        </div>

        <!-- Position is announced politely, not on every autoplay tick's render. -->
        <p class="sr-only" aria-live="polite" aria-atomic="true">
          {{ t('a11y.slidePosition', { current: index + 1, total }) }}
        </p>

        <div class="carousel__controls">
          <button type="button" class="carousel__btn" @click="prev">
            <AppIcon name="chevronStart" :size="20" :label="t('a11y.previousTestimonial')" class="carousel__chevron rtl-mirror" />
          </button>

          <ul class="carousel__dots">
            <li v-for="(item, i) in items" :key="i">
              <button
                type="button"
                class="carousel__dot"
                :class="{ 'carousel__dot--active': i === index }"
                :aria-current="i === index ? 'true' : undefined"
                @click="go(i)"
              >
                <span class="sr-only">{{ t('a11y.slidePosition', { current: i + 1, total }) }}</span>
              </button>
            </li>
          </ul>

          <button
            v-if="!reducedMotion"
            type="button"
            class="carousel__btn"
            @click="togglePause"
          >
            <AppIcon
              :name="paused ? 'play' : 'pause'"
              :size="18"
              :label="paused ? t('a11y.playTestimonials') : t('a11y.pauseTestimonials')"
            />
          </button>

          <button type="button" class="carousel__btn" @click="next">
            <AppIcon name="chevronEnd" :size="20" :label="t('a11y.nextTestimonial')" class="carousel__chevron rtl-mirror" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.carousel {
  max-inline-size: 52rem;
  margin-inline: auto;
}

.carousel__viewport {
  position: relative;
}

.carousel__slide {
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--space-lg);
}

.carousel__slide--active {
  animation: slide-in var(--dur-slow) var(--ease-out);
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}

.carousel__quote-mark {
  color: var(--color-border-strong);
  margin-block-end: var(--space-2xs);
}

.carousel__quote p {
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  color: var(--color-card-foreground);
  /* Stops the quote from collapsing the card height between slides. */
  min-block-size: 6.5rem;
}

.carousel__author {
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
  flex-wrap: wrap;
  margin-block-start: var(--space-md);
  padding-block-start: var(--space-md);
  border-block-start: 1px solid var(--color-border);
}

.carousel__avatar {
  display: grid;
  place-items: center;
  inline-size: 2.75rem;
  block-size: 2.75rem;
  flex-shrink: 0;
  border-radius: var(--radius-full);
  background-color: var(--color-primary-soft);
  color: var(--color-primary-deep);
  font-weight: var(--weight-bold);
}

.carousel__author-text {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.carousel__name {
  font-style: normal;
  font-weight: var(--weight-semibold);
}

.carousel__role {
  font-size: var(--text-sm);
  color: var(--color-muted-foreground);
}

.carousel__stars {
  display: flex;
  gap: 2px;
  color: var(--color-accent-deep);
}

.carousel__star {
  fill: currentColor;
}

/* ---- Controls ---- */
.carousel__controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2xs);
  margin-block-start: var(--space-md);
}

.carousel__btn {
  display: grid;
  place-items: center;
  inline-size: 44px;
  block-size: 44px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border-strong);
  background-color: var(--color-card);
  color: var(--color-primary-deep);
  box-shadow: var(--shadow-xs);
  transition:
    background-color var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-out);
}

.carousel__btn:hover {
  background-color: var(--color-primary-soft);
  box-shadow: var(--shadow-sm);
}

.carousel__dots {
  display: flex;
  align-items: center;
  gap: var(--space-3xs);
  margin-inline: var(--space-2xs);
}

.carousel__dot {
  /* Visually a dot, but a full 44px touch target via padding. */
  display: grid;
  place-items: center;
  inline-size: 44px;
  block-size: 44px;
  border-radius: var(--radius-full);
}

.carousel__dot::before {
  content: '';
  inline-size: 9px;
  block-size: 9px;
  border-radius: var(--radius-full);
  background-color: var(--color-border-strong);
  transition:
    background-color var(--dur-base) var(--ease-out),
    transform var(--dur-base) var(--ease-out);
}

.carousel__dot:hover::before {
  background-color: var(--color-primary);
}

.carousel__dot--active::before {
  background-color: var(--color-primary-deep);
  transform: scale(1.45);
}

@media (min-width: 768px) {
  .carousel__slide {
    padding: var(--space-xl);
  }

  .carousel__quote p {
    font-size: var(--text-xl);
    line-height: var(--leading-snug);
  }
}

@media (prefers-reduced-motion: reduce) {
  .carousel__slide--active {
    animation: none;
  }
}
</style>

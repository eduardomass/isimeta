<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { whatsappUrl } from '@/data/site'
import AppIcon from './AppIcon.vue'

const { t } = useI18n()

const bookUrl = computed(() => whatsappUrl(t('contact.whatsapp.prefill')))

/**
 * The floating action button appears only after the hero scrolls away, so it
 * never competes with the hero's own primary CTA.
 */
const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > window.innerHeight * 0.6
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition name="fab">
    <a
      v-if="visible"
      class="fab"
      :href="bookUrl"
      target="_blank"
      rel="noopener noreferrer"
    >
      <AppIcon name="whatsapp" :size="26" />
      <span class="fab__text">{{ t('nav.book') }}</span>
      <span class="sr-only">{{ t('a11y.whatsappNew') }}</span>
    </a>
  </Transition>
</template>

<style scoped>
.fab {
  position: fixed;
  z-index: 45;
  /* Sits above the iOS home indicator / Android nav bar. */
  inset-block-end: calc(var(--space-md) + env(safe-area-inset-bottom, 0px));
  inset-inline-end: calc(var(--space-md) + env(safe-area-inset-right, 0px));

  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
  min-height: 56px;
  padding-inline: var(--space-md);
  border-radius: var(--radius-full);
  background-color: var(--color-accent-deep);
  color: var(--color-on-accent);
  font-weight: var(--weight-semibold);
  text-decoration: none;
  box-shadow: var(--shadow-lg);
  transition:
    transform var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-out);
}

.fab:hover {
  color: var(--color-on-accent);
  transform: translateY(-2px);
}

.fab:active {
  transform: translateY(1px);
}

/* Icon-only on the narrowest screens, but never without an accessible name. */
.fab__text {
  display: none;
}

@media (min-width: 480px) {
  .fab__text {
    display: inline;
  }
}

@media (max-width: 479px) {
  .fab {
    inline-size: 56px;
    justify-content: center;
    padding-inline: 0;
  }
}

.fab-enter-active,
.fab-leave-active {
  transition:
    opacity var(--dur-base) var(--ease-out),
    transform var(--dur-base) var(--ease-out);
}

.fab-enter-from,
.fab-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.9);
}

@media (prefers-reduced-motion: reduce) {
  .fab-enter-active,
  .fab-leave-active {
    transition: none;
  }

  .fab-enter-from,
  .fab-leave-to {
    transform: none;
  }
}
</style>

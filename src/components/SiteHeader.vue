<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { site, whatsappUrl } from '@/data/site'
import AppIcon from './AppIcon.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'

const { t } = useI18n()

const NAV_ITEMS = [
  { id: 'services', key: 'nav.services' },
  { id: 'about', key: 'nav.about' },
  { id: 'process', key: 'nav.process' },
  { id: 'testimonials', key: 'nav.testimonials' },
  { id: 'faq', key: 'nav.faq' },
  { id: 'contact', key: 'nav.contact' },
]

const mobileOpen = ref(false)
const scrolled = ref(false)
const panelEl = ref(null)
const toggleEl = ref(null)

const bookUrl = computed(() => whatsappUrl(t('contact.whatsapp.prefill')))

function onScroll() {
  scrolled.value = window.scrollY > 12
}

function closeMobile({ refocus = false } = {}) {
  mobileOpen.value = false
  if (refocus) toggleEl.value?.focus()
}

function onKeydown(event) {
  if (event.key === 'Escape' && mobileOpen.value) closeMobile({ refocus: true })
}

// Lock background scroll only while the mobile panel is open.
watch(mobileOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('keydown', onKeydown)
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <header class="header" :class="{ 'header--scrolled': scrolled }">
    <div class="container header__inner">
      <a href="#top" class="brand">
        <span class="brand__mark" aria-hidden="true">
          <AppIcon name="tooth" :size="22" />
        </span>
        <span class="brand__text">
          <span class="brand__name"><bdi>Dr. {{ site.doctor.fullName }}</bdi></span>
          <span class="brand__credential"><bdi>{{ site.doctor.credential }}</bdi></span>
        </span>
      </a>

      <nav class="nav" :aria-label="t('a11y.mainNav')">
        <ul class="nav__list">
          <li v-for="item in NAV_ITEMS" :key="item.id">
            <a class="nav__link" :href="`#${item.id}`">{{ t(item.key) }}</a>
          </li>
        </ul>
      </nav>

      <div class="header__actions">
        <LanguageSwitcher />
        <a class="btn btn--accent header__cta" :href="bookUrl" target="_blank" rel="noopener noreferrer">
          <AppIcon name="whatsapp" :size="18" class="btn__icon" />
          <span>{{ t('nav.book') }}</span>
          <span class="sr-only">{{ t('a11y.whatsappNew') }}</span>
        </a>

        <button
          ref="toggleEl"
          type="button"
          class="header__burger"
          :aria-expanded="mobileOpen"
          aria-controls="mobile-nav"
          @click="mobileOpen = !mobileOpen"
        >
          <AppIcon
            :name="mobileOpen ? 'close' : 'menu'"
            :size="24"
            :label="mobileOpen ? t('a11y.closeMenu') : t('a11y.openMenu')"
          />
        </button>
      </div>
    </div>

    <Transition name="panel">
      <div v-if="mobileOpen" id="mobile-nav" ref="panelEl" class="mobile" :aria-label="t('a11y.mainNav')">
        <ul class="mobile__list">
          <li v-for="item in NAV_ITEMS" :key="item.id">
            <a class="mobile__link" :href="`#${item.id}`" @click="closeMobile()">
              {{ t(item.key) }}
              <AppIcon name="chevronEnd" :size="18" class="mobile__chevron rtl-mirror" />
            </a>
          </li>
        </ul>
        <a
          class="btn btn--accent mobile__cta"
          :href="bookUrl"
          target="_blank"
          rel="noopener noreferrer"
          @click="closeMobile()"
        >
          <AppIcon name="whatsapp" :size="18" class="btn__icon" />
          <span>{{ t('nav.book') }}</span>
        </a>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  inset-block-start: 0;
  z-index: 50;
  background-color: color-mix(in srgb, var(--color-background) 88%, transparent);
  backdrop-filter: blur(12px);
  border-block-end: 1px solid transparent;
  transition:
    border-color var(--dur-slow) var(--ease-out),
    box-shadow var(--dur-slow) var(--ease-out);
}

.header--scrolled {
  border-block-end-color: var(--color-border);
  box-shadow: var(--shadow-sm);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
  min-height: var(--header-h);
}

/* ---- Brand ---- */
.brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
  text-decoration: none;
  color: var(--color-foreground);
  flex-shrink: 0;
}

.brand__mark {
  display: grid;
  place-items: center;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  border-radius: var(--radius-md);
  background-color: var(--color-primary-deep);
  color: var(--color-on-primary);
  box-shadow: var(--shadow-sm);
}

.brand__text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.brand__name {
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  white-space: nowrap;
}

.brand__credential {
  font-size: var(--text-xs);
  color: var(--color-muted-foreground);
  letter-spacing: 0.06em;
}

/* ---- Desktop nav ---- */
.nav {
  display: none;
}

.nav__list {
  display: flex;
  align-items: center;
  gap: var(--space-3xs);
}

.nav__link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding-inline: var(--space-xs);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-foreground);
  text-decoration: none;
  white-space: nowrap;
  transition:
    background-color var(--dur-base) var(--ease-out),
    color var(--dur-base) var(--ease-out);
}

.nav__link:hover {
  background-color: var(--color-primary-soft);
  color: var(--color-primary-deep);
}

/* ---- Actions ---- */
.header__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
  flex-shrink: 0;
}

.header__cta {
  display: none;
}

.header__burger {
  display: grid;
  place-items: center;
  inline-size: 44px;
  block-size: 44px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-strong);
  background-color: var(--color-card);
  color: var(--color-primary-deep);
  transition: background-color var(--dur-base) var(--ease-out);
}

.header__burger:hover {
  background-color: var(--color-primary-soft);
}

/* ---- Mobile panel ---- */
.mobile {
  border-block-start: 1px solid var(--color-border);
  background-color: var(--color-card);
  padding: var(--space-sm) var(--space-md) var(--space-md);
  box-shadow: var(--shadow-lg);
  max-height: calc(100vh - var(--header-h));
  overflow-y: auto;
}

.mobile__list {
  display: flex;
  flex-direction: column;
}

.mobile__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 52px;
  padding-inline: var(--space-2xs);
  border-block-end: 1px solid var(--color-border);
  color: var(--color-card-foreground);
  font-weight: var(--weight-medium);
  text-decoration: none;
}

.mobile__link:hover {
  color: var(--color-primary-deep);
}

.mobile__chevron {
  color: var(--color-muted-foreground);
}

.mobile__cta {
  inline-size: 100%;
  margin-block-start: var(--space-md);
}

.panel-enter-active,
.panel-leave-active {
  transition:
    opacity var(--dur-base) var(--ease-out),
    transform var(--dur-base) var(--ease-out);
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ---- Breakpoints ---- */
@media (min-width: 1024px) {
  .nav,
  .header__cta {
    display: flex;
  }

  .header__burger {
    display: none;
  }

  .brand__name {
    font-size: var(--text-base);
  }
}

@media (prefers-reduced-motion: reduce) {
  .panel-enter-active,
  .panel-leave-active {
    transition: none;
  }
}
</style>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { SUPPORTED_LOCALES, applyDocumentLocale, getLocaleMeta, persistLocale } from '@/i18n'
import AppIcon from './AppIcon.vue'

const { locale, t } = useI18n()

const open = ref(false)
const rootEl = ref(null)
const buttonEl = ref(null)
const optionEls = ref([])

const current = computed(() => getLocaleMeta(locale.value))

/** Switching locale also flips <html lang/dir>, which mirrors the whole layout. */
function select(code) {
  locale.value = code
  persistLocale(code)
  applyDocumentLocale(code)
  close({ refocus: true })
}

function close({ refocus = false } = {}) {
  open.value = false
  if (refocus) buttonEl.value?.focus()
}

function toggle() {
  open.value = !open.value
}

/** Roving focus through the option list; Escape returns focus to the trigger. */
function onMenuKeydown(event) {
  const items = optionEls.value.filter(Boolean)
  if (!items.length) return
  const index = items.indexOf(document.activeElement)

  switch (event.key) {
    case 'Escape':
      event.preventDefault()
      close({ refocus: true })
      break
    case 'ArrowDown':
      event.preventDefault()
      items[(index + 1) % items.length].focus()
      break
    case 'ArrowUp':
      event.preventDefault()
      items[(index - 1 + items.length) % items.length].focus()
      break
    case 'Home':
      event.preventDefault()
      items[0].focus()
      break
    case 'End':
      event.preventDefault()
      items[items.length - 1].focus()
      break
    case 'Tab':
      close()
      break
  }
}

function onPointerDown(event) {
  if (open.value && rootEl.value && !rootEl.value.contains(event.target)) close()
}

watch(open, async (isOpen) => {
  if (!isOpen) return
  // Move focus into the menu once it is rendered.
  await Promise.resolve()
  optionEls.value.filter(Boolean)[0]?.focus()
})

onMounted(() => document.addEventListener('pointerdown', onPointerDown))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onPointerDown))
</script>

<template>
  <div ref="rootEl" class="lang">
    <button
      ref="buttonEl"
      type="button"
      class="lang__trigger"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click="toggle"
      @keydown.down.prevent="open = true"
    >
      <AppIcon name="globe" :size="18" class="lang__globe" />
      <span class="lang__code">{{ current.code.toUpperCase() }}</span>
      <span class="sr-only">{{ t('a11y.languageSwitcher') }}</span>
      <AppIcon name="chevronDown" :size="16" class="lang__chevron" :class="{ 'lang__chevron--open': open }" />
    </button>

    <Transition name="lang-pop">
      <ul v-if="open" class="lang__menu" role="menu" :aria-label="t('a11y.languageSwitcher')" @keydown="onMenuKeydown">
        <li v-for="(option, i) in SUPPORTED_LOCALES" :key="option.code" role="none">
          <button
            :ref="(el) => (optionEls[i] = el)"
            type="button"
            role="menuitemradio"
            :aria-checked="option.code === locale"
            :lang="option.code"
            :dir="option.dir"
            class="lang__option"
            :class="{ 'lang__option--active': option.code === locale }"
            @click="select(option.code)"
          >
            <span class="lang__native">{{ option.nativeName }}</span>
            <AppIcon v-if="option.code === locale" name="check" :size="18" class="lang__check" />
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.lang {
  position: relative;
}

.lang__trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3xs);
  min-height: 44px;
  padding-inline: var(--space-xs);
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border-strong);
  background-color: var(--color-card);
  color: var(--color-primary-deep);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  box-shadow: var(--shadow-xs);
  transition:
    background-color var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-out);
}

.lang__trigger:hover {
  background-color: var(--color-primary-soft);
  box-shadow: var(--shadow-sm);
}

.lang__globe,
.lang__check {
  flex-shrink: 0;
}

.lang__code {
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
}

.lang__chevron {
  transition: transform var(--dur-base) var(--ease-out);
}

.lang__chevron--open {
  transform: rotate(180deg);
}

.lang__menu {
  position: absolute;
  inset-block-start: calc(100% + var(--space-2xs));
  inset-inline-end: 0;
  z-index: 60;
  min-inline-size: 11rem;
  padding: var(--space-3xs);
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
}

.lang__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2xs);
  inline-size: 100%;
  min-height: 44px;
  padding-inline: var(--space-xs);
  border-radius: var(--radius-sm);
  color: var(--color-card-foreground);
  font-size: var(--text-sm);
  text-align: start;
  transition: background-color var(--dur-fast) var(--ease-out);
}

.lang__option:hover {
  background-color: var(--color-muted);
}

.lang__option--active {
  color: var(--color-primary-deep);
  font-weight: var(--weight-semibold);
}

.lang-pop-enter-active,
.lang-pop-leave-active {
  transition:
    opacity var(--dur-fast) var(--ease-out),
    transform var(--dur-fast) var(--ease-out);
}

.lang-pop-enter-from,
.lang-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (prefers-reduced-motion: reduce) {
  .lang-pop-enter-active,
  .lang-pop-leave-active {
    transition: none;
  }
}
</style>

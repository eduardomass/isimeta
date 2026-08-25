<script setup>
import { computed, nextTick, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { site, whatsappUrl } from '@/data/site'
import AppIcon from './AppIcon.vue'

const { t } = useI18n()

const bookUrl = computed(() => whatsappUrl(t('contact.whatsapp.prefill')))

const REASONS = ['checkup', 'cosmetic', 'implants', 'orthodontics', 'emergency', 'other']

const form = reactive({ name: '', email: '', reason: '', message: '' })
const errors = reactive({ name: '', email: '', reason: '', message: '' })
const submitting = ref(false)
const submitted = ref(false)
const summaryEl = ref(null)

const errorList = computed(() =>
  Object.entries(errors)
    .filter(([, message]) => message !== '')
    .map(([field, message]) => ({ field, message })),
)

function validate() {
  errors.name = form.name.trim() ? '' : t('contact.form.errors.name')
  // Deliberately permissive: shape check only, never a rejection of valid addresses.
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())
    ? ''
    : t('contact.form.errors.email')
  errors.reason = form.reason ? '' : t('contact.form.errors.reason')
  errors.message = form.message.trim() ? '' : t('contact.form.errors.message')

  return errorList.value.length === 0
}

/** Clears a field's error as soon as it becomes valid, not on every keystroke. */
function revalidate(field) {
  if (errors[field]) validate()
}

async function onSubmit() {
  submitted.value = false

  if (!validate()) {
    await nextTick()
    summaryEl.value?.focus()
    return
  }

  submitting.value = true
  // No backend is wired up: this simulates the round trip so the success and
  // pending states are reviewable. Point it at a real endpoint before launch.
  await new Promise((resolve) => setTimeout(resolve, 700))
  submitting.value = false
  submitted.value = true
  Object.assign(form, { name: '', email: '', reason: '', message: '' })
}

const CONTACT_ROWS = [
  { key: 'phone', icon: 'phone', value: site.phone.display, href: site.phone.link },
  { key: 'email', icon: 'mail', value: site.email.address, href: site.email.link },
]
</script>

<template>
  <section id="contact" class="section section--alt" aria-labelledby="contact-title">
    <div class="container">
      <header class="section__header reveal">
        <span class="section__eyebrow">{{ t('contact.eyebrow') }}</span>
        <h2 id="contact-title" class="section__title">{{ t('contact.title') }}</h2>
        <p class="section__lead">{{ t('contact.lead') }}</p>
      </header>

      <div class="contact__grid">
        <!-- ============ Details column ============ -->
        <div class="contact__details reveal">
          <a class="contact__whatsapp" :href="bookUrl" target="_blank" rel="noopener noreferrer">
            <span class="contact__whatsapp-icon" aria-hidden="true">
              <AppIcon name="whatsapp" :size="26" />
            </span>
            <span class="contact__whatsapp-body">
              <span class="contact__whatsapp-label">{{ t('contact.whatsapp.label') }}</span>
              <strong class="contact__whatsapp-number"><bdi>{{ site.whatsapp.display }}</bdi></strong>
              <span class="contact__whatsapp-cta">{{ t('contact.whatsapp.cta') }}</span>
            </span>
            <span class="contact__whatsapp-note">{{ t('contact.whatsapp.note') }}</span>
            <span class="sr-only">{{ t('a11y.whatsappNew') }}</span>
          </a>

          <ul class="contact__rows">
            <li v-for="row in CONTACT_ROWS" :key="row.key" class="contact__row">
              <span class="contact__row-icon" aria-hidden="true">
                <AppIcon :name="row.icon" :size="18" />
              </span>
              <span class="contact__row-body">
                <span class="contact__row-label">{{ t(`contact.${row.key}.label`) }}</span>
                <a :href="row.href" class="contact__row-value"><bdi>{{ row.value }}</bdi></a>
              </span>
            </li>

            <li class="contact__row">
              <span class="contact__row-icon" aria-hidden="true">
                <AppIcon name="mapPin" :size="18" />
              </span>
              <span class="contact__row-body">
                <span class="contact__row-label">{{ t('contact.address.label') }}</span>
                <address class="contact__address">
                  <bdi>{{ site.address.street }}</bdi><br />
                  <bdi>{{ site.address.city }}, {{ site.address.country }}</bdi>
                </address>
                <a
                  class="contact__directions"
                  :href="site.address.mapsLink"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ t('contact.directions') }}
                  <AppIcon name="chevronEnd" :size="15" class="contact__directions-icon" />
                  <span class="sr-only">{{ t('a11y.externalLink') }}</span>
                </a>
              </span>
            </li>
          </ul>

          <div class="contact__hours">
            <h3 class="contact__hours-title">
              <AppIcon name="clock" :size="18" class="contact__hours-icon" />
              {{ t('contact.hours.label') }}
            </h3>
            <dl class="contact__hours-list">
              <div v-for="day in ['weekdays', 'saturday', 'sunday']" :key="day" class="contact__hours-row">
                <dt>{{ t(`contact.hours.${day}`) }}</dt>
                <dd><bdi>{{ t(`contact.hours.${day}Value`) }}</bdi></dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- ============ Form column ============ -->
        <div class="card contact__form-card reveal">
          <h3 class="contact__form-title">{{ t('contact.form.title') }}</h3>
          <p class="contact__demo">
            <AppIcon name="alert" :size="15" class="contact__demo-icon" />
            <span>{{ t('contact.form.demoNotice') }}</span>
          </p>

          <form class="form" novalidate @submit.prevent="onSubmit">
            <!-- Error summary: announced, focusable, and links to each field. -->
            <div
              v-if="errorList.length"
              ref="summaryEl"
              class="form__summary"
              role="alert"
              tabindex="-1"
            >
              <p class="form__summary-title">{{ t('contact.form.summaryTitle') }}</p>
              <ul>
                <li v-for="item in errorList" :key="item.field">
                  <a :href="`#field-${item.field}`">{{ item.message }}</a>
                </li>
              </ul>
            </div>

            <p v-if="submitted" class="form__success" role="status">
              <AppIcon name="check" :size="18" class="form__success-icon" />
              <span>{{ t('contact.form.success') }}</span>
            </p>

            <div class="form__field">
              <label class="form__label" for="field-name">{{ t('contact.form.name') }}</label>
              <input
                id="field-name"
                v-model="form.name"
                class="form__input"
                :class="{ 'form__input--invalid': errors.name }"
                type="text"
                name="name"
                autocomplete="name"
                :placeholder="t('contact.form.namePlaceholder')"
                :aria-invalid="errors.name ? 'true' : undefined"
                :aria-describedby="errors.name ? 'error-name' : undefined"
                required
                @blur="revalidate('name')"
                @input="revalidate('name')"
              />
              <p v-if="errors.name" id="error-name" class="form__error">{{ errors.name }}</p>
            </div>

            <div class="form__field">
              <label class="form__label" for="field-email">{{ t('contact.form.email') }}</label>
              <input
                id="field-email"
                v-model="form.email"
                class="form__input"
                :class="{ 'form__input--invalid': errors.email }"
                type="email"
                name="email"
                autocomplete="email"
                dir="ltr"
                :placeholder="t('contact.form.emailPlaceholder')"
                :aria-invalid="errors.email ? 'true' : undefined"
                :aria-describedby="errors.email ? 'error-email' : undefined"
                required
                @blur="revalidate('email')"
                @input="revalidate('email')"
              />
              <p v-if="errors.email" id="error-email" class="form__error">{{ errors.email }}</p>
            </div>

            <div class="form__field">
              <label class="form__label" for="field-reason">{{ t('contact.form.reason') }}</label>
              <div class="form__select-wrap">
                <select
                  id="field-reason"
                  v-model="form.reason"
                  class="form__input form__select"
                  :class="{ 'form__input--invalid': errors.reason }"
                  name="reason"
                  :aria-invalid="errors.reason ? 'true' : undefined"
                  :aria-describedby="errors.reason ? 'error-reason' : undefined"
                  required
                  @change="revalidate('reason')"
                >
                  <option value="" disabled>{{ t('contact.form.reasonPlaceholder') }}</option>
                  <option v-for="reason in REASONS" :key="reason" :value="reason">
                    {{ t(`contact.form.reasonOptions.${reason}`) }}
                  </option>
                </select>
                <AppIcon name="chevronDown" :size="18" class="form__select-icon" />
              </div>
              <p v-if="errors.reason" id="error-reason" class="form__error">{{ errors.reason }}</p>
            </div>

            <div class="form__field">
              <label class="form__label" for="field-message">{{ t('contact.form.message') }}</label>
              <textarea
                id="field-message"
                v-model="form.message"
                class="form__input form__textarea"
                :class="{ 'form__input--invalid': errors.message }"
                name="message"
                rows="4"
                :placeholder="t('contact.form.messagePlaceholder')"
                :aria-invalid="errors.message ? 'true' : undefined"
                :aria-describedby="errors.message ? 'error-message' : undefined"
                required
                @blur="revalidate('message')"
                @input="revalidate('message')"
              ></textarea>
              <p v-if="errors.message" id="error-message" class="form__error">{{ errors.message }}</p>
            </div>

            <button type="submit" class="btn btn--primary form__submit" :disabled="submitting">
              <span>{{ submitting ? t('contact.form.sending') : t('contact.form.submit') }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact__grid {
  display: grid;
  gap: var(--space-2xl);
  align-items: start;
}

/* ============ WhatsApp card ============ */
.contact__whatsapp {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  background-color: var(--color-accent-deep);
  color: var(--color-on-accent);
  text-decoration: none;
  box-shadow: var(--shadow-md);
  transition:
    transform var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-out);
}

.contact__whatsapp:hover {
  color: var(--color-on-accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.contact__whatsapp-icon {
  display: grid;
  place-items: center;
  inline-size: 3.25rem;
  block-size: 3.25rem;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  background-color: rgba(255, 255, 255, 0.16);
}

.contact__whatsapp-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-inline-size: 0;
}

.contact__whatsapp-label {
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.85;
}

.contact__whatsapp-number {
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  font-variant-numeric: tabular-nums;
  line-height: 1.15;
}

.contact__whatsapp-cta {
  font-size: var(--text-sm);
  opacity: 0.9;
}

.contact__whatsapp-note {
  position: absolute;
  inset-block-start: var(--space-2xs);
  inset-inline-end: var(--space-2xs);
  padding: 2px var(--space-2xs);
  border-radius: var(--radius-full);
  background-color: rgba(255, 255, 255, 0.18);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  white-space: nowrap;
}

/* ============ Detail rows ============ */
.contact__rows {
  display: grid;
  gap: var(--space-md);
  margin-block: var(--space-lg);
}

.contact__row {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2xs);
}

.contact__row-icon {
  display: grid;
  place-items: center;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  background-color: var(--color-primary-soft);
  color: var(--color-primary-deep);
}

.contact__row-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-inline-size: 0;
}

.contact__row-label {
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--color-muted-foreground);
}

.contact__row-value {
  font-weight: var(--weight-semibold);
  color: var(--color-foreground);
  text-decoration: none;
  overflow-wrap: anywhere;
}

.contact__row-value:hover {
  color: var(--color-primary-deep);
  text-decoration: underline;
}

.contact__address {
  font-style: normal;
  line-height: var(--leading-snug);
  color: var(--color-foreground);
}

.contact__directions {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  align-self: flex-start;
  min-height: 44px;
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  text-decoration: none;
}

.contact__directions:hover {
  text-decoration: underline;
}

:global([dir='rtl']) .contact__directions-icon {
  transform: scaleX(-1);
}

/* ============ Hours ============ */
.contact__hours {
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-xs);
}

.contact__hours-title {
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
  font-size: var(--text-base);
  margin-block-end: var(--space-2xs);
}

.contact__hours-icon {
  color: var(--color-primary-deep);
  flex-shrink: 0;
}

.contact__hours-list {
  display: grid;
  gap: var(--space-3xs);
}

.contact__hours-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-2xs);
  font-size: var(--text-sm);
  padding-block: var(--space-3xs);
  border-block-end: 1px dashed var(--color-border);
}

.contact__hours-row:last-child {
  border-block-end: none;
}

.contact__hours-row dt {
  color: var(--color-muted-foreground);
}

.contact__hours-row dd {
  font-weight: var(--weight-semibold);
  font-variant-numeric: tabular-nums;
  text-align: end;
}

/* ============ Form ============ */
.contact__form-card {
  padding: var(--space-lg);
}

.contact__form-title {
  font-size: var(--text-xl);
  margin-block-end: var(--space-2xs);
}

.contact__demo {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3xs);
  font-size: var(--text-xs);
  color: var(--color-muted-foreground);
  margin-block-end: var(--space-md);
}

.contact__demo-icon {
  flex-shrink: 0;
  margin-block-start: 0.15em;
}

.form {
  display: grid;
  gap: var(--space-sm);
}

.form__field {
  display: grid;
  gap: var(--space-3xs);
}

.form__label {
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
}

.form__input {
  inline-size: 100%;
  min-height: 48px;
  padding: var(--space-2xs) var(--space-xs);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-strong);
  background-color: var(--color-background-alt);
  color: var(--color-foreground);
  font-size: var(--text-base);
  transition:
    border-color var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-out);
}

.form__input::placeholder {
  color: var(--color-muted-foreground);
  opacity: 0.75;
}

.form__input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-ring);
}

.form__input:focus-visible {
  outline: 3px solid var(--color-ring);
  outline-offset: 1px;
}

.form__input--invalid {
  border-color: var(--color-destructive);
}

.form__textarea {
  min-height: 7rem;
  resize: vertical;
  line-height: var(--leading-normal);
  padding-block: var(--space-2xs);
}

.form__select-wrap {
  position: relative;
}

.form__select {
  appearance: none;
  padding-inline-end: var(--space-xl);
  cursor: pointer;
}

.form__select-icon {
  position: absolute;
  inset-inline-end: var(--space-xs);
  inset-block-start: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--color-muted-foreground);
}

.form__error {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-destructive);
}

.form__summary {
  padding: var(--space-2xs) var(--space-sm);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-destructive);
  background-color: color-mix(in srgb, var(--color-destructive) 8%, transparent);
}

.form__summary-title {
  font-weight: var(--weight-semibold);
  font-size: var(--text-sm);
  margin-block-end: var(--space-3xs);
}

.form__summary ul {
  display: grid;
  gap: 2px;
  list-style: disc;
  padding-inline-start: var(--space-sm);
}

.form__summary a {
  font-size: var(--text-sm);
  color: var(--color-destructive);
}

.form__success {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2xs);
  padding: var(--space-2xs) var(--space-sm);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-accent-deep);
  background-color: var(--color-accent-soft);
  color: var(--color-foreground);
  font-size: var(--text-sm);
}

.form__success-icon {
  flex-shrink: 0;
  margin-block-start: 0.1em;
  color: var(--color-accent-deep);
}

.form__submit {
  inline-size: 100%;
  margin-block-start: var(--space-2xs);
}

.form__submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

@media (min-width: 1024px) {
  .contact__grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-3xl);
  }

  .contact__form-card {
    padding: var(--space-xl);
  }
}
</style>

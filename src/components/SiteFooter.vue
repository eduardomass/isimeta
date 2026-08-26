<script setup>
import { useI18n } from 'vue-i18n'
import { site } from '@/data/site'
import AppIcon from './AppIcon.vue'

const { t } = useI18n()

const NAV_ITEMS = [
  { id: 'services', key: 'nav.services' },
  { id: 'about', key: 'nav.about' },
  { id: 'process', key: 'nav.process' },
  { id: 'testimonials', key: 'nav.testimonials' },
  { id: 'faq', key: 'nav.faq' },
  { id: 'contact', key: 'nav.contact' },
]

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <a href="#top" class="footer__logo">
          <span class="footer__mark" aria-hidden="true">
            <AppIcon name="tooth" :size="22" />
          </span>
          <span>
            <strong><bdi>{{ site.doctor.shortName }}</bdi></strong>
            <span class="footer__credential"><bdi>{{ site.doctor.credential }}</bdi></span>
          </span>
        </a>
        <p class="footer__tagline">{{ t('footer.tagline') }}</p>
      </div>

      <nav class="footer__col" :aria-label="t('footer.navTitle')">
        <h2 class="footer__col-title">{{ t('footer.navTitle') }}</h2>
        <ul class="footer__list">
          <li v-for="item in NAV_ITEMS" :key="item.id">
            <a class="footer__link" :href="`#${item.id}`">{{ t(item.key) }}</a>
          </li>
        </ul>
      </nav>

      <div class="footer__col">
        <h2 class="footer__col-title">{{ t('footer.contactTitle') }}</h2>
        <ul class="footer__list">
          <li>
            <a class="footer__link" :href="site.whatsapp.link" target="_blank" rel="noopener noreferrer">
              <bdi>{{ site.whatsapp.display }}</bdi>
            </a>
          </li>
          <li>
            <a class="footer__link" :href="site.email.link"><bdi>{{ site.email.address }}</bdi></a>
          </li>
          <li>
            <address class="footer__address">
              <bdi>{{ site.address.street }}</bdi><br />
              <bdi>{{ site.address.neighbourhood }}</bdi><br />
              <bdi>{{ site.address.city }}, {{ site.address.country }}</bdi>
            </address>
          </li>
        </ul>
      </div>

    </div>

    <div class="container footer__bottom">
      <p>
        <bdi>&copy; {{ year }} {{ site.doctor.shortName }}, {{ site.doctor.credential }}</bdi>.
        {{ t('footer.rights') }}
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--color-card);
  border-block-start: 1px solid var(--color-border);
  padding-block-start: var(--space-2xl);
}

.footer__inner {
  display: grid;
  gap: var(--space-xl);
}

/* ---- Brand block ---- */
.footer__logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
  color: var(--color-foreground);
  text-decoration: none;
  margin-block-end: var(--space-2xs);
}

.footer__mark {
  display: grid;
  place-items: center;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  background-color: var(--color-primary-deep);
  color: var(--color-on-primary);
}

.footer__logo strong {
  display: block;
  font-size: var(--text-base);
  line-height: 1.2;
}

.footer__credential {
  font-size: var(--text-xs);
  color: var(--color-muted-foreground);
  letter-spacing: 0.06em;
}

.footer__tagline {
  color: var(--color-muted-foreground);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  max-width: 34ch;
  margin-block-end: var(--space-md);
}

/* ---- Link columns ---- */
.footer__col-title {
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-muted-foreground);
  margin-block-end: var(--space-2xs);
}

.footer__list {
  display: grid;
  gap: 2px;
}

.footer__link {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  font-size: var(--text-sm);
  color: var(--color-card-foreground);
  text-decoration: none;
  overflow-wrap: anywhere;
}

.footer__link:hover {
  color: var(--color-primary-deep);
  text-decoration: underline;
}

.footer__address {
  font-style: normal;
  font-size: var(--text-sm);
  color: var(--color-muted-foreground);
  line-height: var(--leading-normal);
  padding-block: var(--space-2xs);
}

/* ---- Bottom bar ---- */
.footer__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2xs);
  margin-block-start: var(--space-xl);
  padding-block: var(--space-md);
  border-block-start: 1px solid var(--color-border);
  font-size: var(--text-xs);
  color: var(--color-muted-foreground);
}

@media (min-width: 640px) {
  .footer__inner {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .footer__inner {
    grid-template-columns: 1.7fr 1fr 1.3fr;
    gap: var(--space-2xl);
  }
}
</style>

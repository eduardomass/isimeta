import { onBeforeUnmount, onMounted } from 'vue'

/**
 * Subtle scroll-reveal (motion tier: subtle). Adds `.reveal--visible` once an
 * element enters the viewport, then stops observing it — a reveal never replays.
 *
 * Animates opacity/transform only, never width/height, so it stays off the
 * layout path. Under prefers-reduced-motion the CSS already renders the final
 * state, and we skip the observer entirely.
 */
export function useReveal(selector = '.reveal') {
  let observer

  onMounted(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = Array.from(document.querySelectorAll(selector))

    if (prefersReduced || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('reveal--visible'))
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('reveal--visible')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    )

    targets.forEach((el) => observer.observe(el))
  })

  onBeforeUnmount(() => observer?.disconnect())
}

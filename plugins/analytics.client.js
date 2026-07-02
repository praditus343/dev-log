// plugins/analytics.client.js
// Automatically tracks page views on every route change (public pages only)

export default defineNuxtPlugin((nuxtApp) => {
  // Don't track admin pages
  if (window.location.pathname.startsWith('/admin')) return

  const { trackPageView } = useAnalytics()

  // Track initial page load
  nuxtApp.hook('app:mounted', () => {
    if (window.location.pathname.startsWith('/admin')) return
    trackPageView(window.location.pathname)
  })

  // Track every subsequent route change
  const router = useRouter()
  router.afterEach((to) => {
    if (to.fullPath.startsWith('/admin')) return
    trackPageView(to.fullPath)
  })
})

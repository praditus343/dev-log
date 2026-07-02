// composables/useAnalytics.js
// Handles page view tracking and analytics data retrieval

export const useAnalytics = () => {
  const supabase = useSupabaseClient()

  /**
   * Record a page view event (silent fail — never blocks UX)
   */
  const trackPageView = async (path) => {
    try {
      await supabase.from('page_views').insert({
        path,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent || null,
      })
    } catch (e) {
      // Silent fail — analytics should never block the user experience
    }
  }

  /**
   * Get total page view count
   */
  const getTotalViews = async () => {
    try {
      const { count, error } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })

      if (error) return 0
      return count || 0
    } catch (e) {
      return 0
    }
  }

  /**
   * Get views grouped by page path (top pages)
   */
  const getTopPages = async (limit = 10) => {
    try {
      // Try RPC first
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_top_pages', { row_limit: limit })
      if (!rpcError && rpcData) return rpcData

      // Fallback: client-side grouping
      const { data: all, error: allErr } = await supabase
        .from('page_views')
        .select('path')
      if (allErr || !all) return []

      const map = {}
      all.forEach(r => { map[r.path] = (map[r.path] || 0) + 1 })
      return Object.entries(map)
        .map(([path, views]) => ({ path, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, limit)
    } catch (e) {
      return []
    }
  }

  /**
   * Get daily views for the last N days (for chart)
   */
  const getDailyViews = async (days = 7) => {
    try {
      const since = new Date()
      since.setDate(since.getDate() - days)

      const { data, error } = await supabase
        .from('page_views')
        .select('created_at')
        .gte('created_at', since.toISOString())
        .order('created_at', { ascending: true })

      // Build empty date map regardless of query success
      const map = {}
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        map[d.toISOString().slice(0, 10)] = 0
      }

      if (!error && data) {
        data.forEach(r => {
          const date = r.created_at.slice(0, 10)
          if (date in map) map[date]++
        })
      }

      return Object.entries(map).map(([date, views]) => ({ date, views }))
    } catch (e) {
      // Return empty date range on any error
      const map = {}
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        map[d.toISOString().slice(0, 10)] = 0
      }
      return Object.entries(map).map(([date, views]) => ({ date, views }))
    }
  }

  /**
   * Get device breakdown
   */
  const getDeviceBreakdown = async () => {
    try {
      const { data, error } = await supabase
        .from('page_views')
        .select('device_type')

      if (error || !data) {
        return [
          { device: 'desktop', count: 0, percentage: 0 },
          { device: 'mobile', count: 0, percentage: 0 },
          { device: 'tablet', count: 0, percentage: 0 },
        ]
      }

      const map = { desktop: 0, mobile: 0, tablet: 0 }
      data.forEach(r => {
        const type = r.device_type || 'desktop'
        map[type] = (map[type] || 0) + 1
      })

      const total = Object.values(map).reduce((a, b) => a + b, 0) || 1
      return Object.entries(map).map(([device, count]) => ({
        device,
        count,
        percentage: Math.round((count / total) * 100),
      }))
    } catch (e) {
      return [
        { device: 'desktop', count: 0, percentage: 0 },
        { device: 'mobile', count: 0, percentage: 0 },
        { device: 'tablet', count: 0, percentage: 0 },
      ]
    }
  }

  return {
    trackPageView,
    getTotalViews,
    getTopPages,
    getDailyViews,
    getDeviceBreakdown,
  }
}

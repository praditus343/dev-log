<template>
  <div class="animate-fade-in-up">
    <h1 class="text-3xl font-bold text-white mb-8">Dashboard</h1>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Articles -->
      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-400 text-sm font-medium mb-1">Total Articles</p>
            <h3 class="text-3xl font-bold text-white">{{ stats.articlesCount || 0 }}</h3>
          </div>
          <div class="stat-icon bg-green-500/10 text-green-400">
            <i class="fas fa-file-alt"></i>
          </div>
        </div>
      </div>

      <!-- Total Page Views -->
      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-400 text-sm font-medium mb-1">Total Page Views</p>
            <div class="flex items-center gap-2">
              <h3 class="text-3xl font-bold text-white">{{ analytics.totalViews }}</h3>
              <span v-if="analytics.loading" class="text-slate-500 text-xs"><i class="fas fa-spinner fa-spin"></i></span>
            </div>
          </div>
          <div class="stat-icon bg-blue-500/10 text-blue-400">
            <i class="fas fa-eye"></i>
          </div>
        </div>
        <p v-if="!analytics.loading && analytics.totalViews === 0" class="text-xs text-slate-500 mt-3">Run <code class="text-green-400/70">page_views.sql</code> migration first</p>
      </div>

      <!-- Today's Views -->
      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-400 text-sm font-medium mb-1">Today's Views</p>
            <h3 class="text-3xl font-bold text-white">{{ analytics.todayViews }}</h3>
          </div>
          <div class="stat-icon bg-amber-500/10 text-amber-400">
            <i class="fas fa-chart-bar"></i>
          </div>
        </div>
      </div>

      <!-- Top Device -->
      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-400 text-sm font-medium mb-1">Top Device</p>
            <h3 class="text-xl font-bold text-white capitalize">{{ topDevice }}</h3>
          </div>
          <div class="stat-icon bg-purple-500/10 text-purple-400">
            <i :class="topDeviceIcon"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Daily Views Chart (spans 2 cols) -->
      <div class="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
        <h2 class="text-lg font-bold text-white mb-6">
          <i class="fas fa-chart-area text-green-400 mr-2"></i>Page Views — Last 7 Days
        </h2>
        <div v-if="analytics.loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
        <div v-else class="flex items-end justify-between gap-2 h-48">
          <div v-for="(day, idx) in analytics.dailyViews" :key="day.date" class="flex-1 flex flex-col items-center gap-1">
            <span class="text-xs text-slate-400 font-medium">{{ day.views }}</span>
            <div class="w-full rounded-t-lg transition-all duration-500" :class="idx === analytics.dailyViews.length - 1 ? 'bg-gradient-to-t from-green-500 to-emerald-400' : 'bg-gradient-to-t from-green-600/60 to-green-500/40'" :style="{ height: barHeight(day.views) + '%' }"></div>
            <span class="text-[10px] text-slate-500 mt-1">{{ formatDate(day.date) }}</span>
          </div>
        </div>
      </div>

      <!-- Device Breakdown -->
      <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
        <h2 class="text-lg font-bold text-white mb-6">
          <i class="fas fa-devices text-blue-400 mr-2"></i>Devices
        </h2>
        <div class="space-y-5">
          <div v-for="d in analytics.devices" :key="d.device" class="space-y-1.5">
            <div class="flex justify-between text-sm">
              <span class="text-slate-300 capitalize flex items-center gap-2">
                <i :class="deviceIcon(d.device)" class="text-slate-500"></i>
                {{ d.device }}
              </span>
              <span class="text-slate-400">{{ d.count }} <span class="text-xs">({{ d.percentage }}%)</span></span>
            </div>
            <div class="w-full bg-slate-900 rounded-full h-2">
              <div class="h-2 rounded-full transition-all duration-700" :class="deviceColor(d.device)" :style="{ width: d.percentage + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Pages Table -->
    <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg mb-8">
      <h2 class="text-lg font-bold text-white mb-4">
        <i class="fas fa-fire text-orange-400 mr-2"></i>Top Pages
      </h2>
      <div v-if="analytics.loading" class="flex items-center justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
      <div v-else-if="analytics.topPages.length === 0" class="text-center py-8">
        <i class="fas fa-chart-pie text-slate-600 text-4xl mb-3 block"></i>
        <p class="text-slate-500">No page views recorded yet.</p>
        <p class="text-slate-600 text-xs mt-1">Visit your portfolio pages to start tracking!</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-slate-700">
              <th class="text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 pr-4">#</th>
              <th class="text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 pr-4">Page</th>
              <th class="text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 text-right">Views</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(page, idx) in analytics.topPages" :key="page.path" class="border-b border-slate-700/50 last:border-0">
              <td class="py-3 pr-4 text-slate-500 text-sm">{{ idx + 1 }}</td>
              <td class="py-3 pr-4">
                <span class="text-white text-sm font-medium">{{ page.path }}</span>
              </td>
              <td class="py-3 text-right">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-500/10 text-green-400">
                  {{ page.views }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Quick Actions -->
    <h2 class="text-xl font-bold text-white mb-4">Quick Actions</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <NuxtLink to="/admin/articles/create" class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:shadow-green-500/20 transition-all transform hover:-translate-y-1 text-white group flex items-center justify-between cursor-pointer">
        <div>
          <h3 class="text-lg font-bold mb-1">Write New Article</h3>
          <p class="text-green-100 text-sm">Share your thoughts and tutorials</p>
        </div>
        <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
          <i class="fas fa-pen"></i>
        </div>
      </NuxtLink>

      <NuxtLink to="/admin/content" class="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg hover:border-slate-500 transition-all transform hover:-translate-y-1 group flex items-center justify-between cursor-pointer">
        <div>
          <h3 class="text-lg font-bold text-white mb-1">Edit Resume Link</h3>
          <p class="text-slate-400 text-sm">Update your CV drive link instantly</p>
        </div>
        <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 group-hover:bg-slate-600 group-hover:text-white transition-colors">
          <i class="fas fa-link"></i>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const supabase = useSupabaseClient()
const { getTotalViews, getTopPages, getDailyViews, getDeviceBreakdown } = useAnalytics()

const stats = ref({ articlesCount: 0 })
const analytics = ref({
  loading: true,
  totalViews: 0,
  todayViews: 0,
  topPages: [],
  dailyViews: [],
  devices: [],
})

// Computed helpers
const topDevice = computed(() => {
  if (!analytics.value.devices.length) return '-'
  const top = [...analytics.value.devices].sort((a, b) => b.count - a.count)[0]
  return top.device || '-'
})

const topDeviceIcon = computed(() => deviceIcon(topDevice.value))

const deviceIcon = (device) => {
  const icons = { desktop: 'fas fa-desktop', mobile: 'fas fa-mobile-alt', tablet: 'fas fa-tablet-alt' }
  return icons[device] || 'fas fa-desktop'
}

const deviceColor = (device) => {
  const colors = { desktop: 'bg-blue-500', mobile: 'bg-green-500', tablet: 'bg-amber-500' }
  return colors[device] || 'bg-slate-500'
}

const barHeight = (views) => {
  const max = Math.max(...analytics.value.dailyViews.map(d => d.views), 1)
  return Math.max((views / max) * 100, 4)
}

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en', { weekday: 'short', day: 'numeric' })
}

onMounted(async () => {
  // Load article count
  const { count, error } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
  if (!error && count !== null) {
    stats.value.articlesCount = count
  }

  // Load analytics data with timeout protection
  try {
    const timeoutMs = 8000
    const withTimeout = (promise) =>
      Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs))
      ])

    const [totalViews, topPages, dailyViews, devices] = await Promise.allSettled([
      withTimeout(getTotalViews()),
      withTimeout(getTopPages(10)),
      withTimeout(getDailyViews(7)),
      withTimeout(getDeviceBreakdown()),
    ])

    analytics.value.totalViews = totalViews.status === 'fulfilled' ? totalViews.value : 0
    analytics.value.topPages = topPages.status === 'fulfilled' ? topPages.value : []
    analytics.value.dailyViews = dailyViews.status === 'fulfilled' ? dailyViews.value : []
    analytics.value.devices = devices.status === 'fulfilled' ? devices.value : []

    // Calculate today's views from dailyViews
    if (dailyViews.status === 'fulfilled') {
      const today = new Date().toISOString().slice(0, 10)
      const todayEntry = dailyViews.value.find(d => d.date === today)
      analytics.value.todayViews = todayEntry ? todayEntry.views : 0
    }
  } catch (e) {
    console.error('Failed to load analytics:', e)
  } finally {
    analytics.value.loading = false
  }
})
</script>

<style scoped>
.stat-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.2);
}
.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

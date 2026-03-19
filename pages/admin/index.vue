<template>
  <div class="animate-fade-in-up">
    <h1 class="text-3xl font-bold text-white mb-8">Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- Stats Card 1 -->
      <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-400 text-sm font-medium mb-1">Total Articles</p>
            <h3 class="text-3xl font-bold text-white">{{ stats.articlesCount || 0 }}</h3>
          </div>
          <div class="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 text-xl">
            <i class="fas fa-file-alt"></i>
          </div>
        </div>
      </div>

      <!-- Stats Card 2 -->
      <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-400 text-sm font-medium mb-1">Portfolio Clicks</p>
            <h3 class="text-3xl font-bold text-white">-</h3>
          </div>
          <div class="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-xl">
            <i class="fas fa-chart-line"></i>
          </div>
        </div>
        <p class="text-xs text-slate-500 mt-4">(Coming Soon via Vercel Analytics)</p>
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
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const supabase = useSupabaseClient()
const stats = ref({
  articlesCount: 0
})

onMounted(async () => {
  const { count, error } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    
  if (!error && count !== null) {
    stats.value.articlesCount = count
  }
})
</script>

<style scoped>
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

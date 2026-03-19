<template>
  <div class="animate-fade-in-up">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-white">Manage Articles</h1>
        <p class="text-slate-400 text-sm mt-1">Write and manage your blog articles</p>
      </div>
      <NuxtLink to="/admin/articles/create" class="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-lg transition-colors flex items-center shrink-0">
        <i class="fas fa-plus mr-2"></i> New Article
      </NuxtLink>
    </div>

    <div class="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
      <div v-if="pending" class="p-16 text-center flex flex-col items-center gap-3">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
        <p class="text-slate-400 text-sm">Loading articles...</p>
      </div>
      
      <div v-else-if="error" class="p-12 text-center">
        <i class="fas fa-exclamation-circle text-red-400 text-3xl mb-3"></i>
        <p class="text-red-400 font-medium mb-1">Failed to load articles</p>
        <p class="text-slate-500 text-sm">{{ error.message }}</p>
        <p class="text-slate-500 text-xs mt-2">Make sure the <code class="bg-slate-700 px-1 rounded">articles</code> table exists in Supabase.</p>
      </div>
      
      <div v-else-if="!articles || articles.length === 0" class="p-16 text-center">
        <div class="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-400 text-3xl">
          <i class="fas fa-file-alt"></i>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">No Articles Yet</h3>
        <p class="text-slate-400 mb-6">Start writing your first article to share your knowledge.</p>
        <NuxtLink to="/admin/articles/create" class="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors inline-flex items-center">
          <i class="fas fa-pen mr-2"></i>Write First Article
        </NuxtLink>
      </div>
      
      <div v-else>
        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-widest">
                <th class="p-4 font-medium">Title & Slug</th>
                <th class="p-4 font-medium">Date</th>
                <th class="p-4 font-medium">Status</th>
                <th class="p-4 font-medium text-center w-48">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/50">
              <tr v-for="article in articles" :key="article.id" class="hover:bg-slate-700/20 transition-colors">
                <td class="p-4">
                  <p class="font-semibold text-white">{{ article.title }}</p>
                  <p class="text-xs text-slate-500 mt-0.5">/articles/{{ article.slug }}</p>
                </td>
                <td class="p-4 text-sm text-slate-400 whitespace-nowrap">
                  {{ formatDate(article.created_at) }}
                </td>
                <td class="p-4">
                  <span class="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-full border border-green-500/20">
                    Published
                  </span>
                </td>
                <td class="p-4">
                  <div class="flex items-center justify-center gap-2">
                    <NuxtLink :to="`/articles/${article.slug}`" target="_blank"
                      class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap">
                      <i class="fas fa-eye text-xs"></i> View
                    </NuxtLink>
                    <NuxtLink :to="`/admin/articles/${article.id}`"
                      class="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap">
                      <i class="fas fa-pen text-xs"></i> Edit
                    </NuxtLink>
                    <button @click="deleteArticle(article.id)"
                      class="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap">
                      <i class="fas fa-trash text-xs"></i> Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden divide-y divide-slate-700/50">
          <div v-for="article in articles" :key="article.id" class="p-4">
            <p class="font-semibold text-white mb-0.5">{{ article.title }}</p>
            <p class="text-xs text-slate-500 mb-1">/articles/{{ article.slug }}</p>
            <p class="text-xs text-slate-400 mb-3">{{ formatDate(article.created_at) }}</p>
            <div class="flex gap-2">
              <NuxtLink :to="`/articles/${article.slug}`" target="_blank"
                class="flex-1 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium rounded-lg transition-colors text-center">
                <i class="fas fa-eye mr-1"></i> View
              </NuxtLink>
              <NuxtLink :to="`/admin/articles/${article.id}`"
                class="flex-1 py-1.5 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white text-sm font-medium rounded-lg transition-colors text-center">
                <i class="fas fa-pen mr-1"></i> Edit
              </NuxtLink>
              <button @click="deleteArticle(article.id)"
                class="flex-1 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-sm font-medium rounded-lg transition-colors">
                <i class="fas fa-trash mr-1"></i> Delete
              </button>
            </div>
          </div>
        </div>

        <!-- Footer count -->
        <div class="px-5 py-3 border-t border-slate-700 text-xs text-slate-500 text-right">
          {{ articles.length }} article{{ articles.length !== 1 ? 's' : '' }} total
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin', middleware: ['auth'] })

const supabase = useSupabaseClient()

const { data: articles, pending, error, refresh } = await useAsyncData('admin-articles', async () => {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, created_at')
    .order('created_at', { ascending: false })
    
  if (error) throw error
  return data
})

const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateString))
}

const deleteArticle = async (id) => {
  if (!confirm('Delete this article? This action cannot be undone.')) return
  try {
    const { error } = await supabase.from('articles').delete().eq('id', id)
    if (error) throw error
    refresh()
  } catch (err) {
    alert(`Failed to delete: ${err.message}`)
  }
}
</script>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

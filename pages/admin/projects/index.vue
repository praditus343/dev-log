<template>
  <div class="animate-fade-in-up">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-white">Manage Projects</h1>
        <p class="text-slate-400 text-sm mt-1">Add, edit, or delete your portfolio projects</p>
      </div>
      <NuxtLink to="/admin/projects/create" class="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-lg transition-colors flex items-center shrink-0">
        <i class="fas fa-plus mr-2"></i> Add New Project
      </NuxtLink>
    </div>

    <div class="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
      <div v-if="pending" class="p-16 text-center flex flex-col items-center gap-3">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
        <p class="text-slate-400 text-sm">Loading projects...</p>
      </div>
      
      <div v-else-if="error" class="p-12 text-center">
        <i class="fas fa-exclamation-circle text-red-400 text-3xl mb-3"></i>
        <p class="text-red-400 font-medium mb-1">Failed to load projects</p>
        <p class="text-slate-500 text-sm">{{ error.message }}</p>
        <p class="text-slate-500 text-xs mt-2">Make sure the <code class="bg-slate-700 px-1 rounded">projects</code> table exists in Supabase.</p>
      </div>
      
      <div v-else-if="!projects || projects.length === 0" class="p-16 text-center">
        <div class="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-400 text-3xl">
          <i class="fas fa-briefcase"></i>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">No Projects Added Yet</h3>
        <p class="text-slate-400 mb-6">Start adding your portfolio projects to showcase your work.</p>
        <NuxtLink to="/admin/projects/create" class="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors inline-flex items-center">
          <i class="fas fa-plus mr-2"></i>Add First Project
        </NuxtLink>
      </div>
      
      <div v-else>
        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-widest">
                <th class="p-4 font-medium w-20">Image</th>
                <th class="p-4 font-medium">Project</th>
                <th class="p-4 font-medium">Category</th>
                <th class="p-4 font-medium">Links</th>
                <th class="p-4 font-medium text-center w-40">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/50">
              <tr v-for="project in projects" :key="project.id" class="hover:bg-slate-700/20 transition-colors">
                <td class="p-4">
                  <div class="w-16 h-12 rounded-lg overflow-hidden bg-slate-700 border border-slate-600 flex-shrink-0">
                    <img v-if="project.image_url" :src="project.image_url" :alt="project.title" class="w-full h-full object-cover"/>
                    <div v-else class="w-full h-full flex items-center justify-center text-slate-500 text-xl"><i class="fas fa-image"></i></div>
                  </div>
                </td>
                <td class="p-4">
                  <p class="font-semibold text-white">{{ project.title }}</p>
                  <p v-if="project.description" class="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{{ project.description }}</p>
                </td>
                <td class="p-4">
                  <span v-if="project.category" class="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-full border border-green-500/20">{{ project.category }}</span>
                  <span v-else class="text-slate-500 text-xs">—</span>
                </td>
                <td class="p-4 text-sm text-slate-400">
                  <div class="flex flex-col gap-1">
                    <a v-if="project.live_link" :href="project.live_link" target="_blank" class="hover:text-green-400 flex items-center gap-1 truncate max-w-[130px]">
                      <i class="fas fa-external-link-alt text-xs"></i> Live Demo
                    </a>
                    <a v-if="project.github_link" :href="project.github_link" target="_blank" class="hover:text-green-400 flex items-center gap-1 truncate max-w-[130px]">
                      <i class="fab fa-github text-xs"></i> GitHub
                    </a>
                    <span v-if="!project.live_link && !project.github_link" class="text-slate-600 text-xs">No links</span>
                  </div>
                </td>
                <td class="p-4">
                  <div class="flex items-center justify-center gap-2">
                    <NuxtLink :to="`/admin/projects/${project.id}`"
                      class="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap">
                      <i class="fas fa-pen text-xs"></i> Edit
                    </NuxtLink>
                    <button @click="deleteProject(project.id, project.image_url)"
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
          <div v-for="project in projects" :key="project.id" class="p-4 flex items-start gap-4">
            <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-700 border border-slate-600 flex-shrink-0">
              <img v-if="project.image_url" :src="project.image_url" :alt="project.title" class="w-full h-full object-cover"/>
              <div v-else class="w-full h-full flex items-center justify-center text-slate-500 text-xl"><i class="fas fa-image"></i></div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-white truncate">{{ project.title }}</p>
              <span v-if="project.category" class="text-xs text-green-400">{{ project.category }}</span>
              <div class="flex gap-2 mt-3">
                <NuxtLink :to="`/admin/projects/${project.id}`"
                  class="flex-1 py-1.5 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white text-sm font-medium rounded-lg transition-colors text-center">
                  <i class="fas fa-pen mr-1"></i> Edit
                </NuxtLink>
                <button @click="deleteProject(project.id, project.image_url)"
                  class="flex-1 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-sm font-medium rounded-lg transition-colors">
                  <i class="fas fa-trash mr-1"></i> Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer count -->
        <div class="px-5 py-3 border-t border-slate-700 text-xs text-slate-500 text-right">
          {{ projects.length }} project{{ projects.length !== 1 ? 's' : '' }} total
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin', middleware: ['auth'] })

const supabase = useSupabaseClient()

const { data: projects, pending, error, refresh } = await useAsyncData('admin-projects', async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('id, title, description, category, image_url, live_link, github_link, display_order')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })
    
  if (error) throw error
  return data
})

const deleteProject = async (id, imageUrl) => {
  if (!confirm('Delete this project? This action cannot be undone.')) return
  try {
    if (imageUrl && imageUrl.includes('portfolio_assets/projects/')) {
      const filePath = imageUrl.split('portfolio_assets/').pop()
      await supabase.storage.from('portfolio_assets').remove([filePath])
    }
    const { error } = await supabase.from('projects').delete().eq('id', id)
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

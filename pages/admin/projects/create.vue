<template>
  <div class="animate-fade-in-up max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <NuxtLink to="/admin/projects" class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
          <i class="fas fa-arrow-left"></i>
        </NuxtLink>
        <h1 class="text-3xl font-bold text-white">Add New Project</h1>
      </div>
    </div>

    <form @submit.prevent="saveProject" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Form Content -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-lg">
            <h3 class="text-lg font-bold text-white mb-6 border-b border-slate-700 pb-3">Project Details</h3>
            
            <div class="space-y-6">
              <div>
                <label for="title" class="block text-sm font-medium text-slate-400 mb-2">Project Title</label>
                <input
                  type="text"
                  id="title"
                  v-model="form.title"
                  required
                  class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="E.g., E-Commerce Dashboard"
                />
              </div>

              <div>
                <label for="description" class="block text-sm font-medium text-slate-400 mb-2">Description</label>
                <textarea
                  id="description"
                  v-model="form.description"
                  required
                  rows="4"
                  class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-y"
                  placeholder="Describe the project..."
                ></textarea>
              </div>

              <div>
                <label for="technologies" class="block text-sm font-medium text-slate-400 mb-2">Technologies Used (Comma separated)</label>
                <input
                  type="text"
                  id="technologies"
                  v-model="form.technologies"
                  class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Vue.js, Tailwind CSS, Node.js"
                />
              </div>

              <div>
                <label for="features" class="block text-sm font-medium text-slate-400 mb-2">Key Features (One per line)</label>
                <textarea
                  id="features"
                  v-model="form.features"
                  rows="4"
                  class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-y"
                  placeholder="User Authentication&#10;Real-time chat&#10;Dark mode"
                ></textarea>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="live_link" class="block text-sm font-medium text-slate-400 mb-2">Live Demo URL (Optional)</label>
                  <input
                    type="url"
                    id="live_link"
                    v-model="form.live_link"
                    class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label for="github_link" class="block text-sm font-medium text-slate-400 mb-2">GitHub URL (Optional)</label>
                  <input
                    type="url"
                    id="github_link"
                    v-model="form.github_link"
                    class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Options -->
        <div class="space-y-6">
          <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
            <h3 class="text-lg font-bold text-white mb-6 border-b border-slate-700 pb-3">Settings & Media</h3>
            
            <div class="space-y-6">
              <div>
                <label for="category" class="block text-sm font-medium text-slate-400 mb-2">Category / Tags</label>
                <input
                  type="text"
                  id="category"
                  v-model="form.category"
                  class="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                  placeholder="E.g., Vue.js, Data Science"
                />
              </div>

              <div>
                <label for="display_order" class="block text-sm font-medium text-slate-400 mb-2">Display Order (Lowest first)</label>
                <input
                  type="number"
                  id="display_order"
                  v-model="form.display_order"
                  class="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-400 mb-2">Project Image</label>
                <div 
                  class="border-2 border-dashed border-slate-600 rounded-xl p-4 text-center bg-slate-900/50 hover:bg-slate-900 hover:border-green-500 transition-colors cursor-pointer relative"
                  :class="{'border-green-500 bg-slate-900': selectedImage}"
                >
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg, image/webp"
                    @change="onImageChange"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div class="flex flex-col items-center justify-center pointer-events-none">
                    <img v-if="previewUrl" :src="previewUrl" class="w-full h-32 object-cover rounded-lg mb-2" />
                    <i v-else class="fas fa-image text-3xl mb-2 text-slate-500"></i>
                    <p class="text-white text-sm font-medium truncate w-full px-2">
                      {{ selectedImage ? selectedImage.name : 'Upload Image' }}
                    </p>
                  </div>
                </div>
              </div>

              <div v-if="errorMsg" class="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center">
                {{ errorMsg }}
              </div>

              <button 
                type="submit" 
                :disabled="saving"
                class="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all flex justify-center items-center focus:outline-none disabled:opacity-50 mt-4"
              >
                <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i>
                <i v-else class="fas fa-save mr-2"></i>
                {{ saving ? 'Saving...' : 'Save Project' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({ layout: 'admin', middleware: ['auth'] })

const supabase = useSupabaseClient()
const saving = ref(false)
const errorMsg = ref('')

const form = ref({
  title: '',
  description: '',
  live_link: '',
  github_link: '',
  category: '',
  display_order: 0,
  technologies: '',
  features: ''
})

const selectedImage = ref(null)
const previewUrl = ref(null)

const onImageChange = (e) => {
  const file = e.target.files[0]
  if (file && file.type.startsWith('image/')) {
    selectedImage.value = file
    previewUrl.value = URL.createObjectURL(file)
  } else {
    alert('Please select a valid image file.')
    e.target.value = ''
  }
}

const saveProject = async () => {
  saving.value = true
  errorMsg.value = ''
  
  try {
    let imageUrl = null

    // Upload image if selected
    if (selectedImage.value) {
      const file = selectedImage.value
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `projects/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio_assets')
        .upload(filePath, file)

      if (uploadError) throw new Error(`Image Upload Failed: ${uploadError.message}`)

      const { data: urlData } = supabase.storage
        .from('portfolio_assets')
        .getPublicUrl(filePath)
        
      imageUrl = urlData.publicUrl
    }

    const payload = {
      title: form.value.title,
      description: form.value.description,
      live_link: form.value.live_link,
      github_link: form.value.github_link,
      category: form.value.category,
      display_order: form.value.display_order,
      technologies: form.value.technologies.split(',').map(s => s.trim()).filter(Boolean),
      features: form.value.features.split('\n').map(s => s.trim()).filter(Boolean),
      image_url: imageUrl
    }
    
    const { error } = await supabase.from('projects').insert(payload)
    if (error) throw error
    
    navigateTo('/admin/projects')
  } catch (err) {
    console.error(err)
    errorMsg.value = err.message
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out forwards;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

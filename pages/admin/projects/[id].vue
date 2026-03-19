<template>
  <div class="animate-fade-in-up max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <NuxtLink to="/admin/projects" class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
          <i class="fas fa-arrow-left"></i>
        </NuxtLink>
        <h1 class="text-3xl font-bold text-white">Edit Project</h1>
      </div>
    </div>

    <div v-if="pendingData" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
    </div>
    
    <div v-else-if="errorFetch" class="text-red-400 text-center py-20">
      Error loading project: {{ errorFetch }}
    </div>

    <form v-else @submit.prevent="updateProject" class="space-y-6">
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
                  placeholder="User Authentication&#10;Real-time chat"
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
                  />
                </div>
                <div>
                  <label for="github_link" class="block text-sm font-medium text-slate-400 mb-2">GitHub URL (Optional)</label>
                  <input
                    type="url"
                    id="github_link"
                    v-model="form.github_link"
                    class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                  :class="{'border-green-500 bg-slate-900': selectedImage || previewUrl}"
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
                      {{ selectedImage ? selectedImage.name : (previewUrl ? 'Change Image...' : 'Upload Image') }}
                    </p>
                  </div>
                </div>
              </div>

              <div v-if="successMsg" class="text-green-400 text-sm bg-green-500/10 p-3 rounded-lg border border-green-500/20 text-center">
                {{ successMsg }}
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
                {{ saving ? 'Saving Changes...' : 'Update Project' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({ layout: 'admin', middleware: ['auth'] })

const route = useRoute()
const supabase = useSupabaseClient()

const saving = ref(false)
const pendingData = ref(true)
const errorFetch = ref('')
const errorMsg = ref('')
const successMsg = ref('')

const form = ref({
  id: null,
  title: '',
  description: '',
  live_link: '',
  github_link: '',
  category: '',
  display_order: 0,
  image_url: null,
  technologies: '',
  features: ''
})

const selectedImage = ref(null)
const previewUrl = ref(null)

onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', route.params.id)
      .single()
      
    if (error) throw error
    
    if (data) {
      form.value = {
        ...data,
        // Convert arrays to editable strings
        technologies: Array.isArray(data.technologies) ? data.technologies.join(', ') : (data.technologies || ''),
        features: Array.isArray(data.features) ? data.features.join('\n') : (data.features || '')
      }
      previewUrl.value = data.image_url
    }
  } catch (err) {
    console.error(err)
    errorFetch.value = err.message
  } finally {
    pendingData.value = false
  }
})

const onImageChange = (e) => {
  const file = e.target.files[0]
  if (file && file.type.startsWith('image/')) {
    selectedImage.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const updateProject = async () => {
  saving.value = true
  errorMsg.value = ''
  successMsg.value = ''
  
  try {
    let newImageUrl = form.value.image_url

    // Upload new image if selected
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
        
      newImageUrl = urlData.publicUrl
      
      // Delete old image from storage if it exists
      if (form.value.image_url && form.value.image_url.includes('portfolio_assets/projects/')) {
        const oldFilePath = form.value.image_url.split('portfolio_assets/').pop()
        await supabase.storage.from('portfolio_assets').remove([oldFilePath])
      }
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
      image_url: newImageUrl
    }
    
    const { error } = await supabase.from('projects').update(payload).eq('id', form.value.id)
    if (error) throw error
    
    // Update local state
    form.value.image_url = newImageUrl
    selectedImage.value = null
    
    successMsg.value = 'Project updated successfully!'
    setTimeout(() => successMsg.value = '', 3000)
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

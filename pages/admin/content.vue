<template>
  <div class="animate-fade-in-up">
    <h1 class="text-3xl font-bold text-white mb-8">Content Settings</h1>

    <div class="grid grid-cols-1 gap-8 max-w-4xl">
      <!-- About Me Section -->
      <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-lg">
        <h2 class="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-4">Homepage "About Me"</h2>
        
        <form @submit.prevent="saveContent('about_me')" class="space-y-6">
          <div v-for="(paragraph, index) in aboutMe" :key="index" class="relative group">
            <label class="block text-sm font-medium text-slate-400 mb-2">Paragraph {{ index + 1 }}</label>
            <textarea
              v-model="aboutMe[index]"
              rows="4"
              class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-y"
              placeholder="Enter text here..."
            ></textarea>
            
            <button v-if="aboutMe.length > 1" @click.prevent="removeParagraph(index)" type="button" class="absolute top-8 right-2 w-8 h-8 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-500 hover:text-white">
              <i class="fas fa-trash"></i>
            </button>
          </div>

          <div class="flex justify-between items-center">
            <button @click.prevent="addParagraph" type="button" class="text-green-500 hover:text-green-400 text-sm font-medium transition-colors">
              <i class="fas fa-plus mr-1"></i> Add Paragraph
            </button>
            
            <button 
              type="submit" 
              :disabled="saving.about_me"
              class="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all flex items-center focus:outline-none disabled:opacity-50"
            >
              <i v-if="saving.about_me" class="fas fa-spinner fa-spin mr-2"></i>
              <i v-else class="fas fa-save mr-2"></i>
              {{ saving.about_me ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
          
          <div v-if="messages.about_me" class="text-green-400 text-sm bg-green-500/10 p-3 rounded-lg border border-green-500/20 text-center">
            {{ messages.about_me }}
          </div>
        </form>
      </div>

      <!-- CV Link / Upload Section -->
      <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-lg">
        <h2 class="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-4">Download Resume (CV)</h2>
        
        <form @submit.prevent="handleCVUpload" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-slate-400 mb-2">Current Active Link</label>
            <div class="flex items-center gap-3 w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-300">
              <i class="fas fa-link text-slate-500"></i>
              <a :href="cvLink" target="_blank" class="truncate hover:text-green-400 transition-colors">{{ cvLink }}</a>
            </div>
            <p class="mt-2 text-xs text-slate-500 font-medium">To keep this link, just leave the file input below empty.</p>
          </div>

          <div class="pt-4">
            <label class="block text-sm font-medium text-slate-400 mb-2">Upload New PDF Resume (Replaces Current)</label>
            <div 
              class="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center bg-slate-900/50 hover:bg-slate-900 hover:border-green-500 transition-colors cursor-pointer group relative"
            >
              <input 
                type="file" 
                accept="application/pdf"
                @change="onFileChange"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div class="flex flex-col items-center justify-center pointer-events-none">
                <i class="fas fa-cloud-upload-alt text-4xl mb-3 text-slate-500 group-hover:text-green-500 transition-colors"></i>
                <p class="text-white font-medium mb-1">
                  {{ selectedFile ? selectedFile.name : 'Click or drag PDF to upload' }}
                </p>
                <p class="text-slate-400 text-sm">
                  {{ selectedFile ? (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB' : 'Maximum file size 10MB' }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-2">
            <button 
              type="submit" 
              :disabled="saving.cv_link"
              class="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all flex items-center focus:outline-none disabled:opacity-50"
            >
              <i v-if="saving.cv_link" class="fas fa-spinner fa-spin mr-2"></i>
              <i v-else class="fas fa-upload mr-2"></i>
              {{ saving.cv_link ? 'Uploading & Saving...' : 'Update Resume' }}
            </button>
          </div>
          
          <div v-if="messages.cv_link" :class="messages.cv_error ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-green-400 bg-green-500/10 border-green-500/20'" class="text-sm p-3 rounded-lg border text-center">
            {{ messages.cv_link }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const supabase = useSupabaseClient()
const aboutMe = ref(["Loading..."])
const cvLink = ref("")
const selectedFile = ref(null)

const saving = ref({ about_me: false, cv_link: false })
const messages = ref({ about_me: '', cv_link: '', cv_error: false })

// Load content from Supabase
onMounted(async () => {
  const { data, error } = await supabase.from('portfolio_content').select('*')
  if (data) {
    const aboutData = data.find(item => item.section_name === 'about_me')
    if (aboutData && aboutData.content) {
      aboutMe.value = typeof aboutData.content === 'string' ? JSON.parse(aboutData.content) : aboutData.content
    } else {
      aboutMe.value = [
        "I'm Egi Danuarta, a passionate web developer based in Yogyakarta, Indonesia."
      ]
    }

    const cvData = data.find(item => item.section_name === 'cv_link')
    if (cvData && cvData.content) {
      try {
        cvLink.value = JSON.parse(cvData.content)
      } catch (e) {
        cvLink.value = cvData.content
      }
    }
  }
})

/* About Me Logic */
const addParagraph = () => aboutMe.value.push("")
const removeParagraph = (index) => aboutMe.value.splice(index, 1)

const saveContent = async (section) => {
  saving.value[section] = true
  messages.value[section] = ''
  
  try {
    const contentToSave = section === 'about_me' ? JSON.stringify(aboutMe.value) : JSON.stringify(cvLink.value)
    
    // Check if exists
    const { data: existing } = await supabase.from('portfolio_content').select('id').eq('section_name', section).single()
      
    if (existing) {
      await supabase.from('portfolio_content').update({ content: contentToSave }).eq('id', existing.id)
    } else {
      await supabase.from('portfolio_content').insert({ section_name: section, content: contentToSave })
    }
    
    messages.value[section] = 'Changes saved successfully!'
    setTimeout(() => { messages.value[section] = '' }, 3000)
    
  } catch (err) {
    messages.value[section] = `Failed: ${err.message}`
  } finally {
    saving.value[section] = false
  }
}

/* CV Upload Logic */
const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file && file.type !== 'application/pdf') {
    alert('Please select a PDF file.')
    e.target.value = ''
    return
  }
  selectedFile.value = file
}

const handleCVUpload = async () => {
  if (!selectedFile.value) {
    // If no file selected but they clicked save, just save the existing link (which doesn't change, but gives UX feedback)
    return await saveContent('cv_link')
  }

  saving.value.cv_link = true
  messages.value.cv_link = ''
  messages.value.cv_error = false
  
  try {
    const file = selectedFile.value
    const fileExt = file.name.split('.').pop()
    const fileName = `resume_${Date.now()}.${fileExt}`
    const filePath = `resumes/${fileName}`

    // 1. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('portfolio_assets')
      .upload(filePath, file)

    if (uploadError) {
      if (uploadError.message.includes('Bucket not found')) {
         throw new Error('Please create the "portfolio_assets" bucket in Supabase Storage and make it public!')
      }
      throw uploadError
    }

    // 2. Get Public URL
    const { data: urlData } = supabase.storage
      .from('portfolio_assets')
      .getPublicUrl(filePath)
      
    if (urlData && urlData.publicUrl) {
      cvLink.value = urlData.publicUrl
      // 3. Save the new URL to database
      await saveContent('cv_link')
      
      // Clear file selection
      selectedFile.value = null
      messages.value.cv_link = 'Resume successfully uploaded and saved!'
      messages.value.cv_error = false
    } else {
       throw new Error('Failed to retrieve public URL after upload.')
    }

  } catch (err) {
    console.error(err)
    messages.value.cv_error = true
    messages.value.cv_link = `Error: ${err.message}`
  } finally {
    saving.value.cv_link = false
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

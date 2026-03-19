<template>
  <div class="animate-fade-in-up">
    <h1 class="text-3xl font-bold text-white mb-2">Manage Home Page</h1>
    <p class="text-slate-400 text-sm mb-8">Changes here will update your public portfolio homepage.</p>

    <div v-if="loading" class="flex flex-col items-center justify-center py-16 gap-3">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
      <p class="text-slate-400 text-sm">Loading settings...</p>
    </div>

    <div v-else-if="fetchError" class="max-w-3xl">
      <div class="bg-red-500/10 border border-red-500/30 rounded-2xl p-8">
        <i class="fas fa-exclamation-triangle text-red-400 text-3xl mb-4 block"></i>
        <h2 class="text-xl font-bold text-red-300 mb-2">Database Setup Required</h2>
        <p class="text-red-200/80 mb-4">The <code class="bg-red-900/50 px-2 py-0.5 rounded text-sm">site_settings</code> table was not found.</p>
        <ol class="text-slate-300 space-y-2 list-decimal list-inside mb-6 text-sm">
          <li>Open <strong class="text-white">Supabase Dashboard → SQL Editor</strong></li>
          <li>Run the file: <code class="bg-slate-800 px-2 py-0.5 rounded">supabase/migrations/20260319000003_full_cms_schema.sql</code></li>
          <li>Click the button below</li>
        </ol>
        <button @click="retryLoad" class="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors">
          <i class="fas fa-redo mr-2"></i>Retry Loading
        </button>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 gap-6 max-w-3xl">

      <!-- ① Profile Info -->
      <div class="card">
        <h2 class="card-title"><i class="fas fa-user mr-2 text-green-400"></i>Profile Info</h2>
        <div class="space-y-4">
          <div>
            <label class="form-label">Full Name</label>
            <input v-model="settings.profile_name" type="text" class="form-input" placeholder="Your Name"/>
          </div>
          <div>
            <label class="form-label">Tagline / Sub-title</label>
            <input v-model="settings.profile_tagline" type="text" class="form-input" placeholder="Web Developer & ..."/>
          </div>
        </div>
        <div class="card-footer">
          <p v-if="msgs.profile" class="msg-ok">{{ msgs.profile }}</p>
          <button @click="save('profile', ['profile_name','profile_tagline'])" :disabled="saving.profile" class="btn-save">
            <i :class="saving.profile ? 'fas fa-spinner fa-spin' : 'fas fa-save'" class="mr-2"></i>
            {{ saving.profile ? 'Saving…' : 'Save Profile Info' }}
          </button>
        </div>
      </div>

      <!-- ② Profile Photo -->
      <div class="card">
        <h2 class="card-title"><i class="fas fa-camera mr-2 text-green-400"></i>Profile Photo</h2>
        <div class="flex items-center gap-6">
          <div class="w-20 h-20 rounded-full overflow-hidden border-4 border-green-500/40 bg-slate-700 flex-shrink-0">
            <img v-if="settings.profile_photo_url" :src="settings.profile_photo_url" alt="Profile" class="w-full h-full object-cover"/>
            <div v-else class="w-full h-full flex items-center justify-center text-slate-400 text-3xl"><i class="fas fa-user-circle"></i></div>
          </div>
          <div class="flex-1 space-y-2">
            <div class="upload-zone relative">
              <input type="file" accept="image/*" @change="onPhotoChange" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/>
              <div class="pointer-events-none text-center">
                <i class="fas fa-cloud-upload-alt text-2xl text-slate-500 mb-1 block"></i>
                <p class="text-sm text-slate-300">{{ photoFile ? photoFile.name : 'Click to upload new photo' }}</p>
              </div>
            </div>
            <p v-if="msgs.photo" class="msg-ok">{{ msgs.photo }}</p>
            <p v-if="msgs.photoError" class="msg-err">{{ msgs.photoError }}</p>
            <button @click="uploadPhoto" :disabled="!photoFile || saving.photo" class="btn-save w-full">
              <i :class="saving.photo ? 'fas fa-spinner fa-spin' : 'fas fa-upload'" class="mr-2"></i>
              {{ saving.photo ? 'Uploading…' : 'Upload Photo' }}
            </button>
          </div>
        </div>
      </div>

      <!-- ③ About Me -->
      <div class="card">
        <h2 class="card-title"><i class="fas fa-align-left mr-2 text-green-400"></i>About Me Text</h2>
        <p class="text-slate-400 text-xs mb-3">One paragraph per line. HTML tags like &lt;strong&gt; are supported.</p>
        <textarea v-model="settings.about_paragraphs" rows="5" class="form-input resize-y" placeholder="Paragraph 1&#10;Paragraph 2&#10;..."></textarea>
        <div class="card-footer">
          <p v-if="msgs.about" class="msg-ok">{{ msgs.about }}</p>
          <button @click="save('about', ['about_paragraphs'])" :disabled="saving.about" class="btn-save">
            <i :class="saving.about ? 'fas fa-spinner fa-spin' : 'fas fa-save'" class="mr-2"></i>
            {{ saving.about ? 'Saving…' : 'Save About Me' }}
          </button>
        </div>
      </div>

      <!-- ④ CV -->
      <div class="card">
        <h2 class="card-title"><i class="fas fa-file-pdf mr-2 text-green-400"></i>Resume / CV</h2>
        <div v-if="settings.cv_url" class="mb-4">
          <label class="form-label">Current CV Link</label>
          <a :href="settings.cv_url" target="_blank" class="block px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-green-400 text-sm truncate hover:underline">
            {{ settings.cv_url }}
          </a>
        </div>
        <div class="upload-zone relative">
          <input type="file" accept="application/pdf" @change="onCVChange" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/>
          <div class="pointer-events-none text-center">
            <i class="fas fa-cloud-upload-alt text-3xl text-slate-500 mb-2 block"></i>
            <p class="text-white font-medium text-sm">{{ cvFile ? cvFile.name : 'Click to upload PDF Resume' }}</p>
            <p class="text-slate-500 text-xs mt-1">PDF only · Max 10MB</p>
          </div>
        </div>
        <div class="card-footer">
          <p v-if="msgs.cv" :class="msgs.cvError ? 'msg-err' : 'msg-ok'">{{ msgs.cv }}</p>
          <button @click="uploadCV" :disabled="!cvFile || saving.cv" class="btn-save">
            <i :class="saving.cv ? 'fas fa-spinner fa-spin' : 'fas fa-upload'" class="mr-2"></i>
            {{ saving.cv ? 'Uploading…' : 'Upload PDF' }}
          </button>
        </div>
      </div>

      <!-- ⑤ Social Media -->
      <div class="card">
        <h2 class="card-title"><i class="fas fa-share-alt mr-2 text-green-400"></i>Social Media Links</h2>
        <div class="space-y-4">
          <div>
            <label class="form-label"><i class="fab fa-github w-5 mr-1"></i>GitHub URL</label>
            <input v-model="settings.social_github" type="url" class="form-input" placeholder="https://github.com/username"/>
          </div>
          <div>
            <label class="form-label"><i class="fab fa-linkedin w-5 mr-1 text-blue-400"></i>LinkedIn URL</label>
            <input v-model="settings.social_linkedin" type="url" class="form-input" placeholder="https://linkedin.com/in/..."/>
          </div>
          <div>
            <label class="form-label"><i class="fab fa-instagram w-5 mr-1 text-pink-400"></i>Instagram URL</label>
            <input v-model="settings.social_instagram" type="url" class="form-input" placeholder="https://instagram.com/..."/>
          </div>
          <div>
            <label class="form-label"><i class="fab fa-twitter w-5 mr-1 text-sky-400"></i>Twitter / X URL</label>
            <input v-model="settings.social_twitter" type="url" class="form-input" placeholder="https://twitter.com/..."/>
          </div>
        </div>
        <div class="card-footer">
          <p v-if="msgs.social" class="msg-ok">{{ msgs.social }}</p>
          <button @click="save('social', ['social_github','social_linkedin','social_instagram','social_twitter'])" :disabled="saving.social" class="btn-save">
            <i :class="saving.social ? 'fas fa-spinner fa-spin' : 'fas fa-save'" class="mr-2"></i>
            {{ saving.social ? 'Saving…' : 'Save Social Links' }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({ layout: 'admin', middleware: ['auth'] })

const supabase = useSupabaseClient()
const { getSettings, saveSettings } = useSiteSettings()

const loading = ref(true)
const fetchError = ref('')
const photoFile = ref(null)
const cvFile = ref(null)

const settings = ref({
  profile_name: '',
  profile_tagline: '',
  profile_photo_url: '',
  about_paragraphs: '',
  cv_url: '',
  social_github: '',
  social_linkedin: '',
  social_instagram: '',
  social_twitter: ''
})

const saving = ref({ profile: false, photo: false, about: false, cv: false, social: false })
const msgs = ref({ profile: '', photo: '', photoError: '', about: '', cv: '', cvError: false, social: '' })

const loadSettings = async () => {
  loading.value = true
  fetchError.value = ''
  try {
    const data = await getSettings(Object.keys(settings.value))
    Object.assign(settings.value, data)
  } catch (err) {
    fetchError.value = err.message
  } finally {
    loading.value = false
  }
}
const retryLoad = () => loadSettings()
onMounted(loadSettings)

const save = async (group, keys) => {
  saving.value[group] = true
  msgs.value[group] = ''
  try {
    const subset = {}
    keys.forEach(k => { subset[k] = settings.value[k] })
    await saveSettings(subset)
    msgs.value[group] = '✓ Saved!'
    setTimeout(() => msgs.value[group] = '', 3000)
  } catch (err) {
    msgs.value[group] = `Error: ${err.message}`
  } finally {
    saving.value[group] = false
  }
}

const onPhotoChange = (e) => { photoFile.value = e.target.files[0] }
const onCVChange = (e) => { cvFile.value = e.target.files[0] }

const uploadFile = async (file, folder) => {
  const ext = file.name.split('.').pop()
  const path = `${folder}/${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('portfolio_assets').upload(path, file)
  if (error) {
    if (error.message.includes('Bucket not found')) throw new Error('Bucket "portfolio_assets" belum dibuat! Buat dulu di Supabase Storage.')
    throw error
  }
  return supabase.storage.from('portfolio_assets').getPublicUrl(path).data.publicUrl
}

const uploadPhoto = async () => {
  if (!photoFile.value) return
  saving.value.photo = true
  msgs.value.photo = ''
  msgs.value.photoError = ''
  try {
    const url = await uploadFile(photoFile.value, 'profile')
    settings.value.profile_photo_url = url
    await saveSettings({ profile_photo_url: url })
    photoFile.value = null
    msgs.value.photo = '✓ Photo updated!'
    setTimeout(() => msgs.value.photo = '', 3000)
  } catch (err) {
    msgs.value.photoError = err.message
  } finally {
    saving.value.photo = false
  }
}

const uploadCV = async () => {
  if (!cvFile.value) return
  saving.value.cv = true
  msgs.value.cv = ''
  msgs.value.cvError = false
  try {
    const url = await uploadFile(cvFile.value, 'resumes')
    settings.value.cv_url = url
    await saveSettings({ cv_url: url })
    cvFile.value = null
    msgs.value.cv = '✓ Resume uploaded!'
    setTimeout(() => msgs.value.cv = '', 4000)
  } catch (err) {
    msgs.value.cvError = true
    msgs.value.cv = err.message
  } finally {
    saving.value.cv = false
  }
}
</script>

<style scoped>
.card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 1rem;
  padding: 1.5rem 2rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.2);
}
.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #334155;
}
.card-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.25rem;
}
.form-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  color: #94a3b8;
  margin-bottom: 0.4rem;
}
.form-input {
  width: 100%;
  padding: 0.7rem 1rem;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 0.75rem;
  color: white;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  font-size: 0.9rem;
}
.form-input:focus {
  border-color: #22c55e;
  box-shadow: 0 0 0 2px rgba(34,197,94,0.2);
}
.upload-zone {
  border: 2px dashed #475569;
  border-radius: 0.75rem;
  padding: 1.25rem;
  background: rgba(15,23,42,0.5);
  transition: border-color 0.2s;
  cursor: pointer;
}
.upload-zone:hover {
  border-color: #22c55e;
}
.btn-save {
  display: inline-flex;
  align-items: center;
  padding: 0.55rem 1.25rem;
  background: linear-gradient(to right, #22c55e, #10b981);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  box-shadow: 0 4px 12px rgba(34,197,94,0.25);
}
.btn-save:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
.msg-ok { color: #4ade80; font-size: 0.8rem; }
.msg-err { color: #f87171; font-size: 0.8rem; }
.animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

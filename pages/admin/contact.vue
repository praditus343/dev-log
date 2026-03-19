<template>
  <div class="animate-fade-in-up">
    <h1 class="text-3xl font-bold text-white mb-2">Manage Contact Page</h1>
    <p class="text-slate-400 text-sm mb-8">Changes here will update your public contact page.</p>

    <div v-if="loading" class="flex flex-col items-center justify-center py-16 gap-3">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
      <p class="text-slate-400 text-sm">Loading settings...</p>
    </div>

    <div v-else-if="fetchError" class="max-w-3xl">
      <div class="bg-red-500/10 border border-red-500/30 rounded-2xl p-8">
        <i class="fas fa-exclamation-triangle text-red-400 text-3xl mb-4 block"></i>
        <h2 class="text-xl font-bold text-red-300 mb-2">Database Setup Required</h2>
        <p class="text-red-200/80 mb-4">The <code class="bg-red-900/50 px-2 py-0.5 rounded text-sm">site_settings</code> table was not found.</p>
        <p class="text-slate-400 mb-4 text-sm">Run <code class="bg-slate-800 px-2 py-0.5 rounded">supabase/migrations/20260319000003_full_cms_schema.sql</code> in Supabase SQL Editor.</p>
        <button @click="retryLoad" class="btn-save">
          <i class="fas fa-redo mr-2"></i>Retry Loading
        </button>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 gap-6 max-w-3xl">

      <!-- ① Contact Details -->
      <div class="card">
        <h2 class="card-title"><i class="fas fa-address-book mr-2 text-green-400"></i>Contact Details</h2>
        <div class="space-y-4">
          <div>
            <label class="form-label"><i class="fas fa-envelope mr-1 text-green-400"></i>Email Address</label>
            <input v-model="settings.contact_email" type="email" class="form-input" placeholder="your@email.com"/>
          </div>
          <div>
            <label class="form-label"><i class="fas fa-phone mr-1 text-green-400"></i>Phone Number</label>
            <input v-model="settings.contact_phone" type="text" class="form-input" placeholder="(+62) 8xx-xxxx-xxxx"/>
          </div>
          <div>
            <label class="form-label"><i class="fas fa-map-marker-alt mr-1 text-green-400"></i>Location (City, Province)</label>
            <input v-model="settings.contact_location" type="text" class="form-input" placeholder="Sleman, Yogyakarta"/>
          </div>
          <div>
            <label class="form-label"><i class="fas fa-map mr-1 text-red-400"></i>Google Maps Embed URL</label>
            <input v-model="settings.contact_maps_url" type="url" class="form-input" placeholder="https://www.google.com/maps/embed?pb=..."/>
            <p class="text-xs text-slate-500 mt-1">Buka Google Maps → Share → Embed a map → salin URL dari src="..."</p>
          </div>
          <div>
            <label class="form-label"><i class="fas fa-link mr-1 text-blue-400"></i>Google Maps Link (untuk tombol "Open in Maps")</label>
            <input v-model="settings.contact_maps_link" type="url" class="form-input" placeholder="https://maps.app.goo.gl/..."/>
          </div>
        </div>
        <div class="card-footer">
          <p v-if="msgs.contact" :class="msgs.contactError ? 'msg-err' : 'msg-ok'">{{ msgs.contact }}</p>
          <button @click="saveContact" :disabled="saving.contact" class="btn-save">
            <i :class="saving.contact ? 'fas fa-spinner fa-spin' : 'fas fa-save'" class="mr-2"></i>
            {{ saving.contact ? 'Saving…' : 'Save Contact Info' }}
          </button>
        </div>
      </div>

      <!-- ② Social Media on Contact Page -->
      <div class="card">
        <h2 class="card-title"><i class="fas fa-share-alt mr-2 text-green-400"></i>Social Media Links</h2>
        <p class="text-slate-400 text-xs mb-4">These also appear in the About Me / Profile section.</p>
        <div class="space-y-4">
          <div>
            <label class="form-label"><i class="fab fa-github w-5 mr-1"></i>GitHub</label>
            <input v-model="settings.social_github" type="url" class="form-input" placeholder="https://github.com/"/>
          </div>
          <div>
            <label class="form-label"><i class="fab fa-linkedin w-5 mr-1 text-blue-400"></i>LinkedIn</label>
            <input v-model="settings.social_linkedin" type="url" class="form-input" placeholder="https://linkedin.com/in/"/>
          </div>
          <div>
            <label class="form-label"><i class="fab fa-instagram w-5 mr-1 text-pink-400"></i>Instagram</label>
            <input v-model="settings.social_instagram" type="url" class="form-input" placeholder="https://instagram.com/"/>
          </div>
          <div>
            <label class="form-label"><i class="fab fa-twitter w-5 mr-1 text-sky-400"></i>Twitter / X</label>
            <input v-model="settings.social_twitter" type="url" class="form-input" placeholder="https://twitter.com/"/>
          </div>
        </div>
        <div class="card-footer">
          <p v-if="msgs.social" class="msg-ok">{{ msgs.social }}</p>
          <button @click="saveSocial" :disabled="saving.social" class="btn-save">
            <i :class="saving.social ? 'fas fa-spinner fa-spin' : 'fas fa-save'" class="mr-2"></i>
            {{ saving.social ? 'Saving…' : 'Save Social Links' }}
          </button>
        </div>
      </div>

      <!-- ③ Live Preview -->
      <div class="card">
        <h2 class="card-title"><i class="fas fa-eye mr-2 text-green-400"></i>Live Preview</h2>
        <ul class="space-y-4">
          <li class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-green-400 flex-shrink-0"><i class="fas fa-envelope"></i></div>
            <div>
              <p class="text-xs text-slate-500">Email</p>
              <p class="text-slate-200 text-sm">{{ settings.contact_email || '—' }}</p>
            </div>
          </li>
          <li class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-green-400 flex-shrink-0"><i class="fas fa-phone"></i></div>
            <div>
              <p class="text-xs text-slate-500">Phone</p>
              <p class="text-slate-200 text-sm">{{ settings.contact_phone || '—' }}</p>
            </div>
          </li>
          <li class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-green-400 flex-shrink-0"><i class="fas fa-map-marker-alt"></i></div>
            <div>
              <p class="text-xs text-slate-500">Location</p>
              <p class="text-slate-200 text-sm">{{ settings.contact_location || '—' }}</p>
            </div>
          </li>
          <li v-if="settings.contact_maps_url">
            <p class="text-xs text-slate-500 mb-2">Google Maps Embed Preview</p>
            <iframe :src="settings.contact_maps_url" width="100%" height="200" class="rounded-xl border border-slate-700" allowfullscreen="" loading="lazy"></iframe>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({ layout: 'admin', middleware: ['auth'] })

const { getSettings, saveSettings } = useSiteSettings()

const loading = ref(true)
const fetchError = ref('')

const settings = ref({
  contact_email: '',
  contact_phone: '',
  contact_location: '',
  contact_maps_url: '',
  contact_maps_link: '',
  social_github: '',
  social_linkedin: '',
  social_instagram: '',
  social_twitter: ''
})

const saving = ref({ contact: false, social: false })
const msgs = ref({ contact: '', contactError: false, social: '' })

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

const saveContact = async () => {
  saving.value.contact = true
  msgs.value.contact = ''
  msgs.value.contactError = false
  try {
    await saveSettings({
      contact_email: settings.value.contact_email,
      contact_phone: settings.value.contact_phone,
      contact_location: settings.value.contact_location,
      contact_maps_url: settings.value.contact_maps_url,
      contact_maps_link: settings.value.contact_maps_link
    })
    msgs.value.contact = '✓ Contact info saved!'
    setTimeout(() => msgs.value.contact = '', 3000)
  } catch (err) {
    msgs.value.contactError = true
    msgs.value.contact = `Error: ${err.message}`
  } finally {
    saving.value.contact = false
  }
}

const saveSocial = async () => {
  saving.value.social = true
  msgs.value.social = ''
  try {
    await saveSettings({
      social_github: settings.value.social_github,
      social_linkedin: settings.value.social_linkedin,
      social_instagram: settings.value.social_instagram,
      social_twitter: settings.value.social_twitter
    })
    msgs.value.social = '✓ Social links saved!'
    setTimeout(() => msgs.value.social = '', 3000)
  } catch (err) {
    msgs.value.social = `Error: ${err.message}`
  } finally {
    saving.value.social = false
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

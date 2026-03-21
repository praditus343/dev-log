<template>
  <div class="animate-fade-in-up max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <NuxtLink to="/admin/articles" class="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
          <i class="fas fa-arrow-left text-sm"></i>
        </NuxtLink>
        <div>
          <h1 class="text-2xl font-bold text-white">Edit Article</h1>
          <p class="text-slate-400 text-xs mt-0.5">{{ form.title || 'Loading...' }}</p>
        </div>
      </div>
    </div>

    <div v-if="pending" class="flex flex-col items-center justify-center py-20 gap-3">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
      <p class="text-slate-400 text-sm">Loading article...</p>
    </div>

    <div v-else-if="loadError" class="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
      <i class="fas fa-exclamation-circle text-red-400 text-3xl mb-3 block"></i>
      <p class="text-red-300 font-medium">{{ loadError }}</p>
      <NuxtLink to="/admin/articles" class="mt-4 inline-block text-slate-400 hover:text-white text-sm">← Back to articles</NuxtLink>
    </div>

    <form v-else @submit.prevent="updateArticle">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- ── Main Editor ── -->
        <div class="lg:col-span-2 space-y-5">

          <!-- Title -->
          <div class="card">
            <input
              type="text"
              v-model="form.title"
              required
              placeholder="Article Title…"
              class="w-full bg-transparent text-2xl font-bold text-white outline-none placeholder-slate-600 border-0 p-0"
            />
          </div>

          <!-- Cover Image -->
          <div class="card">
            <label class="form-label mb-2 block"><i class="fas fa-image mr-1 text-green-400"></i> Cover Image</label>
            <div v-if="form.cover_image" class="mb-3 relative group">
              <img :src="form.cover_image" class="w-full h-48 object-cover rounded-lg border border-slate-700"/>
              <button type="button" @click="form.cover_image=''" class="absolute top-2 right-2 w-7 h-7 bg-red-500 rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
            </div>
            <div class="flex gap-2">
              <input v-model="form.cover_image" type="url" class="form-input flex-1 text-sm" placeholder="Paste image URL..."/>
              <label class="btn-secondary cursor-pointer px-3 py-2 text-sm flex items-center gap-1.5 whitespace-nowrap">
                <i class="fas fa-upload text-xs"></i> Upload
                <input type="file" accept="image/*" @change="uploadCover" class="hidden"/>
              </label>
            </div>
            <p v-if="uploadingCover" class="text-green-400 text-xs mt-1"><i class="fas fa-spinner fa-spin mr-1"></i> Uploading...</p>
          </div>

          <!-- Rich Text Editor -->
          <div class="card p-0">
            <admin-rich-editor v-model="form.content" placeholder="Write your article content here..."/>
          </div>

        </div>

        <!-- ── Sidebar ── -->
        <div class="space-y-5">
          <div class="card sticky top-4">
            <h3 class="text-base font-bold text-white mb-4 border-b border-slate-700 pb-3">
              <i class="fas fa-cog mr-1.5 text-green-400"></i> Settings
            </h3>

            <div class="space-y-4">
              <div>
                <label class="form-label">URL Slug</label>
                <input v-model="form.slug" type="text" required class="form-input text-sm"/>
              </div>

              <div>
                <label class="form-label">Excerpt (optional)</label>
                <textarea v-model="form.excerpt" rows="3" class="form-input text-sm resize-none" placeholder="Short preview description..."></textarea>
              </div>

              <div>
                <label class="form-label">Tags (comma-separated)</label>
                <input v-model="tagsInput" type="text" class="form-input text-sm" placeholder="vue, nuxt, javascript"/>
              </div>

              <div class="pt-3 border-t border-slate-700">
                <label class="form-label block mb-2">Status Artikel</label>
                <div class="flex flex-col gap-2">
                  <button type="button"
                    @click="form.status = 'draft'"
                    :class="form.status === 'draft'
                      ? 'bg-slate-600 text-white border-slate-500 ring-2 ring-slate-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'"
                    class="w-full py-2.5 px-3 text-xs font-semibold rounded-lg border transition-all flex items-center gap-2">
                    <i class="fas fa-file-alt text-slate-400 w-4"></i>
                    <div class="text-left">
                      <div>Draft</div>
                      <div class="text-slate-500 font-normal">Tidak tampil ke publik</div>
                    </div>
                  </button>
                  <button type="button"
                    @click="form.status = 'published'"
                    :class="form.status === 'published'
                      ? 'bg-green-500/10 text-green-400 border-green-500 ring-2 ring-green-500/20'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-green-500/50'"
                    class="w-full py-2.5 px-3 text-xs font-semibold rounded-lg border transition-all flex items-center gap-2">
                    <i class="fas fa-globe text-green-500 w-4"></i>
                    <div class="text-left">
                      <div>Published</div>
                      <div class="text-slate-500 font-normal">Tampil ke publik</div>
                    </div>
                  </button>
                  <button type="button"
                    @click="form.status = 'archived'"
                    :class="form.status === 'archived'
                      ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500 ring-2 ring-yellow-500/20'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-yellow-500/50'"
                    class="w-full py-2.5 px-3 text-xs font-semibold rounded-lg border transition-all flex items-center gap-2">
                    <i class="fas fa-archive text-yellow-500 w-4"></i>
                    <div class="text-left">
                      <div>Archived</div>
                      <div class="text-slate-500 font-normal">Disembunyikan, tidak dihapus</div>
                    </div>
                  </button>
                </div>
              </div>

              <div class="pt-3 border-t border-slate-700 text-xs text-slate-500">
                <i class="fas fa-calendar-alt mr-1"></i>
                Created: {{ formatDate(form.created_at) }}
              </div>
            </div>

            <div v-if="successMsg" class="mt-4 text-green-400 text-xs bg-green-500/10 p-3 rounded-lg border border-green-500/20 text-center">
              {{ successMsg }}
            </div>
            <div v-if="errorMsg" class="mt-4 text-red-400 text-xs bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              {{ errorMsg }}
            </div>

            <button type="submit" :disabled="saving" class="w-full mt-4 btn-save py-3 justify-center"
              :class="form.status === 'archived' ? 'btn-archive' : form.status === 'draft' ? 'btn-draft' : ''">
              <i :class="saving ? 'fas fa-spinner fa-spin' : (form.status === 'published' ? 'fas fa-globe' : form.status === 'archived' ? 'fas fa-archive' : 'fas fa-save')" class="mr-2"></i>
              {{ saving ? 'Saving…' : 'Update Article' }}
            </button>
          </div>
        </div>

      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({ layout: 'admin', middleware: ['auth'] })

const route = useRoute()
const supabase = useSupabaseClient()
const saving = ref(false)
const pending = ref(true)
const uploadingCover = ref(false)
const loadError = ref('')
const errorMsg = ref('')
const successMsg = ref('')
const tagsInput = ref('')

const form = ref({
  id: null,
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  cover_image: '',
  tags: [],
  status: 'draft',
  created_at: null
})

const formatDate = (d) => d ? new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(d)) : '—'

onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', route.params.id)
      .single()
    if (error) throw error
    Object.assign(form.value, data)
    tagsInput.value = Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || '')
  } catch (err) {
    loadError.value = err.message
  } finally {
    pending.value = false
  }
})

const uploadCover = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  uploadingCover.value = true
  try {
    const ext = file.name.split('.').pop()
    const path = `article-covers/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('portfolio_assets').upload(path, file)
    if (error) throw error
    form.value.cover_image = supabase.storage.from('portfolio_assets').getPublicUrl(path).data.publicUrl
  } catch (err) {
    alert(`Upload failed: ${err.message}`)
  } finally {
    uploadingCover.value = false
    e.target.value = ''
  }
}

const updateArticle = async () => {
  saving.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const tagsArray = tagsInput.value ? tagsInput.value.split(',').map(t => t.trim()).filter(Boolean) : []
    const payload = {
      title: form.value.title,
      slug: form.value.slug,
      content: form.value.content,
      excerpt: form.value.excerpt || null,
      cover_image: form.value.cover_image || null,
      tags: tagsArray,
      status: form.value.status,
      published_at: form.value.status === 'published'
        ? (form.value.published_at || new Date().toISOString())
        : null
    }
    const { error } = await supabase.from('articles').update(payload).eq('id', form.value.id)
    if (error) {
      if (error.code === '23505') throw new Error('Slug already exists.')
      throw error
    }
    successMsg.value = '✓ Article updated!'
    setTimeout(() => successMsg.value = '', 3000)
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 1rem;
  padding: 1.25rem 1.5rem;
}
.form-label { font-size: 0.78rem; font-weight: 500; color: #94a3b8; }
.form-input {
  width: 100%;
  padding: 0.6rem 0.85rem;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 0.6rem;
  color: white;
  outline: none;
  transition: border-color 0.15s;
  font-size: 0.875rem;
}
.form-input:focus { border-color: #22c55e; box-shadow: 0 0 0 2px rgba(34,197,94,0.15); }
.btn-save {
  display: inline-flex;
  align-items: center;
  padding: 0.55rem 1.2rem;
  background: linear-gradient(to right, #22c55e, #10b981);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
  box-shadow: 0 4px 12px rgba(34,197,94,0.25);
}
.btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secondary {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.85rem;
  background: #334155;
  color: #cbd5e1;
  font-weight: 500;
  font-size: 0.8rem;
  border-radius: 0.6rem;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-secondary:hover { background: #475569; color: white; }
.btn-draft {
  background: linear-gradient(to right, #475569, #334155) !important;
  box-shadow: 0 4px 12px rgba(71,85,105,0.25) !important;
}
.btn-archive {
  background: linear-gradient(to right, #d97706, #b45309) !important;
  box-shadow: 0 4px 12px rgba(217,119,6,0.25) !important;
}
.animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

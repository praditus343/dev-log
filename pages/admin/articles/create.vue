<template>
  <div class="animate-fade-in-up max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <NuxtLink to="/admin/articles" class="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
          <i class="fas fa-arrow-left text-sm"></i>
        </NuxtLink>
        <div>
          <h1 class="text-2xl font-bold text-white">Create New Article</h1>
          <p class="text-slate-400 text-xs mt-0.5">Write and publish a new article</p>
        </div>
      </div>
    </div>

    <form @submit.prevent="saveArticle">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- ── Main Editor ── -->
        <div class="lg:col-span-2 space-y-5">

          <!-- Title -->
          <div class="card">
            <input
              type="text"
              v-model="form.title"
              @input="generateSlug"
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
            <admin-rich-editor v-model="form.content" placeholder="Start writing your article content here..."/>
          </div>

        </div>

        <!-- ── Sidebar ── -->
        <div class="space-y-5">

          <!-- Publishing -->
          <div class="card sticky top-4">
            <h3 class="text-base font-bold text-white mb-4 border-b border-slate-700 pb-3">
              <i class="fas fa-paper-plane mr-1.5 text-green-400"></i> Publishing
            </h3>

            <div class="space-y-4">
              <!-- URL Slug -->
              <div>
                <label class="form-label">URL Slug</label>
                <input v-model="form.slug" type="text" required class="form-input text-sm"  placeholder="article-url-slug"/>
                <p class="text-xs text-slate-500 mt-1">Auto-generated from title</p>
              </div>

              <!-- Excerpt -->
              <div>
                <label class="form-label">Excerpt (optional)</label>
                <textarea v-model="form.excerpt" rows="3" class="form-input text-sm resize-none" placeholder="Short description for previews..."></textarea>
              </div>

              <!-- Tags -->
              <div>
                <label class="form-label">Tags (comma-separated)</label>
                <input v-model="form.tags" type="text" class="form-input text-sm" placeholder="vue, nuxt, javascript"/>
              </div>

              <!-- Publish toggle -->
              <div class="pt-3 border-t border-slate-700">
                <label class="flex items-center gap-3 cursor-pointer">
                  <div class="relative flex-shrink-0">
                    <input type="checkbox" v-model="form.publishNow" class="sr-only"/>
                    <div class="w-10 h-6 rounded-full transition-colors" :class="form.publishNow ? 'bg-green-500' : 'bg-slate-700'"></div>
                    <div class="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform" :class="form.publishNow ? 'translate-x-4' : 'translate-x-0'"></div>
                  </div>
                  <span class="text-slate-300 text-sm font-medium">Publish immediately</span>
                </label>
              </div>

            </div>

            <div v-if="errorMsg" class="mt-4 text-red-400 text-xs bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              {{ errorMsg }}
            </div>

            <button type="submit" :disabled="saving" class="w-full mt-4 btn-save py-3 justify-center">
              <i :class="saving ? 'fas fa-spinner fa-spin' : 'fas fa-paper-plane'" class="mr-2"></i>
              {{ saving ? 'Saving…' : 'Save Article' }}
            </button>
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
const uploadingCover = ref(false)
const errorMsg = ref('')

const form = ref({
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  tags: '',
  cover_image: '',
  publishNow: true
})

const generateSlug = () => {
  form.value.slug = form.value.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

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

const saveArticle = async () => {
  saving.value = true
  errorMsg.value = ''
  try {
    const tagsArray = form.value.tags ? form.value.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    const payload = {
      title: form.value.title,
      slug: form.value.slug,
      content: form.value.content,
      excerpt: form.value.excerpt || null,
      cover_image: form.value.cover_image || null,
      tags: tagsArray,
      published_at: form.value.publishNow ? new Date().toISOString() : null
    }
    const { error } = await supabase.from('articles').insert(payload)
    if (error) {
      if (error.code === '23505') throw new Error('Slug already exists. Please use a different slug.')
      throw error
    }
    navigateTo('/admin/articles')
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
.animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

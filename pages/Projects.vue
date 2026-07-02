<template>
  <div>
    <Navbar />
    <section class="bg-slate-900 text-white min-h-screen py-20 text-center">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-4xl font-bold text-slate-300 mb-4 relative inline-block" data-aos="fade-down">
          My Projects
          <span class="absolute left-1/2 -translate-x-1/2 -bottom-2.5 w-[60px] h-[3px] bg-green-500"></span>
        </h2>

        <!-- Loading -->
        <div v-if="pending" class="text-center py-12">
          <div class="inline-block w-10 h-10 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <p class="mt-4 text-slate-400">Loading projects...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-12 text-red-400">
          <i class="fas fa-exclamation-triangle text-3xl mb-3"></i>
          <p>Failed to load projects. Please try again later.</p>
        </div>

        <template v-else>
          <!-- Filter Buttons -->
          <div class="flex justify-center gap-4 flex-wrap mb-8 mt-10" data-aos="fade-up">
            <button
              v-for="category in categories"
              :key="category"
              @click="currentCategory = category"
              :class="[
                'px-5 py-2 rounded-full border-2 border-green-500 text-slate-300 font-medium cursor-pointer transition-all duration-300 text-sm',
                currentCategory === category
                  ? 'bg-green-500 text-white'
                  : 'hover:bg-green-500 hover:text-white'
              ]"
            >
              {{ category }}
            </button>
          </div>

          <!-- Empty state -->
          <div v-if="filteredProjects && filteredProjects.length === 0" class="text-center py-12 text-slate-400">
            No projects found in this category.
          </div>

          <!-- Project Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              v-for="project in filteredProjects"
              :key="project.id"
              data-aos="fade-up"
            >
              <div class="project-card bg-slate-800 rounded-card overflow-hidden h-full border-0 transition-all duration-300 hover:-translate-y-2.5 hover:shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
                <!-- Image -->
                <div class="relative overflow-hidden">
                  <img v-if="project.image_url" :src="project.image_url" class="w-full h-[200px] object-cover transition-transform duration-300 project-card-img" :alt="project.title" loading="lazy">
                  <div v-else class="h-[200px] flex items-center justify-center bg-slate-900 text-slate-700 text-5xl"><i class="fas fa-image"></i></div>
                  <div class="project-overlay absolute inset-0 bg-green-500/90 flex items-center justify-center opacity-0 transition-opacity duration-300">
                    <div class="p-4 text-center">
                      <span v-for="tech in project.technologies" :key="tech" class="inline-block bg-white/90 text-slate-800 px-2.5 py-1 rounded-badge text-xs m-1 font-medium">
                        {{ tech }}
                      </span>
                    </div>
                  </div>
                </div>
                <!-- Body -->
                <div class="p-5 text-slate-300 text-left">
                  <h5 class="text-xl font-semibold mb-4 text-white truncate">{{ project.title }}</h5>
                  <p class="text-sm leading-relaxed mb-5 line-clamp-3 text-slate-400">
                    {{ project.description }}
                  </p>
                  <div class="flex gap-3 flex-col sm:flex-row">
                    <a v-if="project.live_link" :href="project.live_link" class="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-btn text-sm font-medium transition-all duration-300 hover:-translate-y-0.5" target="_blank">
                      <i class="fas fa-external-link-alt mr-2"></i>View Project
                    </a>
                    <span v-else class="inline-flex items-center justify-center bg-green-500/50 text-white/60 px-4 py-2 rounded-btn text-sm cursor-not-allowed">
                      No Live Link
                    </span>
                    <button class="inline-flex items-center justify-center border-2 border-slate-300 text-slate-300 hover:bg-slate-300 hover:text-slate-800 px-4 py-2 rounded-btn text-sm font-medium transition-all duration-300 hover:-translate-y-0.5" @click="showDetails(project)">
                      <i class="fas fa-info-circle mr-2"></i>Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </section>
    <Footer />

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="selectedProject" class="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80" @click.self="closeModal">
        <div class="bg-slate-800 text-white rounded-card w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-slate-700 p-5">
            <h5 class="text-xl font-semibold text-slate-300">{{ selectedProject.title }}</h5>
            <button type="button" class="text-slate-300 hover:text-white text-3xl leading-none" @click="closeModal">&times;</button>
          </div>
          <!-- Body -->
          <div class="overflow-y-auto p-6 flex-1">
            <div class="rounded-xl overflow-hidden mb-6">
              <img v-if="selectedProject.image_url" :src="selectedProject.image_url" class="w-full rounded-xl" :alt="selectedProject.title" loading="lazy">
              <div v-else class="h-48 flex items-center justify-center bg-slate-900 text-slate-700 text-5xl rounded-xl"><i class="fas fa-image"></i></div>
            </div>
            <div>
              <div v-if="selectedProject.technologies && selectedProject.technologies.length">
                <h6 class="text-green-500 text-lg font-semibold mb-2 mt-4">Technologies Used:</h6>
                <div class="mb-5">
                  <span v-for="tech in selectedProject.technologies" :key="tech" class="inline-block bg-white/90 text-slate-800 px-2.5 py-1 rounded-badge text-xs m-1 font-medium">
                    {{ tech }}
                  </span>
                </div>
              </div>
              <h6 class="text-green-500 text-lg font-semibold mb-2 mt-4">Project Description:</h6>
              <p class="text-slate-300 leading-relaxed">{{ selectedProject.description }}</p>
              <div v-if="selectedProject.features && selectedProject.features.length">
                <h6 class="text-green-500 text-lg font-semibold mb-2 mt-4">Key Features:</h6>
                <ul class="list-none pl-0 space-y-2">
                  <li v-for="feature in selectedProject.features" :key="feature" class="relative pl-6 text-slate-300 before:content-['→'] before:absolute before:left-0 before:text-green-500">{{ feature }}</li>
                </ul>
              </div>
            </div>
          </div>
          <!-- Footer -->
          <div class="border-t border-slate-700 p-5 flex flex-wrap gap-3 justify-end">
            <a v-if="selectedProject.github_link" :href="selectedProject.github_link" class="inline-flex items-center bg-slate-900 hover:bg-slate-700 text-white px-4 py-2 rounded-btn text-sm font-medium transition-all duration-300" target="_blank">
              <i class="fab fa-github mr-2"></i>GitHub
            </a>
            <a v-if="selectedProject.live_link" :href="selectedProject.live_link" class="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-btn text-sm font-medium transition-all duration-300 hover:-translate-y-0.5" target="_blank">
              <i class="fas fa-external-link-alt mr-2"></i>Visit Project
            </a>
            <button type="button" class="inline-flex items-center bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-btn text-sm font-medium transition-all duration-300" @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const supabase = useSupabaseClient()

const currentCategory = ref('All')
const selectedProject = ref(null)

const { data: projects, pending, error } = await useAsyncData('public-projects', async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })
    
  if (error) throw error
  return data || []
}, { lazy: true })

const categories = computed(() => {
  if (!projects.value) return ['All']
  const cats = projects.value.map(p => p.category).filter(Boolean)
  const uniqueCats = [...new Set(cats.map(c => c.trim()))]
  return ['All', ...uniqueCats]
})

const filteredProjects = computed(() => {
  if (!projects.value) return []
  if (currentCategory.value === 'All') return projects.value
  return projects.value.filter(p => p.category && p.category.trim() === currentCategory.value)
})

const showDetails = (project) => {
  selectedProject.value = project
  if (typeof document !== 'undefined') document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  selectedProject.value = null
  if (typeof document !== 'undefined') document.body.style.overflow = ''
}

onMounted(() => {
  if (typeof window !== 'undefined' && window.AOS) {
    window.AOS.init({ duration: 800, once: true, offset: 100 })
  }
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})
</script>

<style scoped>
.project-card:hover .project-card-img {
  transform: scale(1.1);
}
.project-card:hover .project-overlay {
  opacity: 1;
}
</style>

<template>
  <div>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <Navbar />
    <section class="projects">
      <div class="container">
        <h2 class="text-center mb-5" data-aos="fade-down">My Projects</h2>

        <div v-if="pending" class="text-center py-5">
          <div class="spinner-border text-success" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <p class="mt-3 text-muted">Loading projects...</p>
        </div>

        <div v-else-if="error" class="text-center py-5 text-danger">
          <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
          <p>Failed to load projects. Please try again later.</p>
        </div>

        <template v-else>
          <!-- Filter Buttons -->
          <div class="filter-buttons mb-4" data-aos="fade-up">
            <button 
              v-for="category in categories" 
              :key="category"
              @click="currentCategory = category"
              :class="['filter-btn', { active: currentCategory === category }]"
            >
              {{ category }}
            </button>
          </div>

          <div v-if="filteredProjects && filteredProjects.length === 0" class="text-center py-5 text-muted">
            No projects found in this category.
          </div>

          <div v-else class="row">
            <div 
              v-for="project in filteredProjects" 
              :key="project.id" 
              class="col-md-4 mb-4"
              data-aos="fade-up"
            >
              <div class="card project-card">
                <div class="project-image-container">
                  <img v-if="project.image_url" :src="project.image_url" class="card-img-top" :alt="project.title">
                  <div v-else class="card-img-placeholder"><i class="fas fa-image"></i></div>
                  <div class="project-overlay">
                    <div class="project-tech">
                      <span v-for="tech in project.technologies" :key="tech" class="tech-badge">
                        {{ tech }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <h5 class="card-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ project.title }}</h5>
                  <p class="card-text" style="display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden;">
                    {{ project.description }}
                  </p>
                  <div class="project-links d-flex justify-content-between">
                    <a v-if="project.live_link" :href="project.live_link" class="btn btn-primary" target="_blank">
                      <i class="fas fa-external-link-alt mr-2"></i>View Project
                    </a>
                    <span v-else class="btn btn-primary disabled">No Live Link</span>
                    <button class="btn btn-outline-light" @click="showDetails(project)">
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
    <div v-if="selectedProject" class="modal fade show" tabindex="-1" style="display: block; background: rgba(0,0,0,0.8);">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedProject.title }}</h5>
            <button type="button" class="close" @click="closeModal">&times;</button>
          </div>
          <div class="modal-body modal-scrollable">
            <div class="project-gallery mb-4">
              <img v-if="selectedProject.image_url" :src="selectedProject.image_url" class="img-fluid" :alt="selectedProject.title">
              <div v-else class="card-img-placeholder"><i class="fas fa-image fa-3x"></i></div>
            </div>
            <div class="project-details">
              <div v-if="selectedProject.technologies && selectedProject.technologies.length">
                <h6 class="details-title">Technologies Used:</h6>
                <div class="tech-stack mb-3">
                  <span v-for="tech in selectedProject.technologies" :key="tech" class="tech-badge">
                    {{ tech }}
                  </span>
                </div>
              </div>
              <h6 class="details-title">Project Description:</h6>
              <p class="project-description">{{ selectedProject.description }}</p>
              <div v-if="selectedProject.features && selectedProject.features.length">
                <h6 class="details-title">Key Features:</h6>
                <ul class="feature-list">
                  <li v-for="feature in selectedProject.features" :key="feature">{{ feature }}</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <a v-if="selectedProject.github_link" :href="selectedProject.github_link" class="btn btn-dark" target="_blank">
              <i class="fab fa-github mr-2"></i>GitHub
            </a>
            <a v-if="selectedProject.live_link" :href="selectedProject.live_link" class="btn btn-primary" target="_blank">
              <i class="fas fa-external-link-alt mr-2"></i>Visit Project
            </a>
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </div>
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
})

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
.projects {
  padding: 80px 0;
  background: #0f172a;
  color: #fff;
  min-height: 100vh;
  text-align: center;
}

.projects h2 {
  color: #cbd5e1;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 40px;
  position: relative;
  display: inline-block;
}

.projects h2::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: #01c879;
}

.filter-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.filter-btn {
  background: transparent;
  border: 2px solid #01c879;
  color: #cbd5e1;
  padding: 8px 20px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover, .filter-btn.active {
  background: #01c879;
  color: #fff;
}

.project-card {
  background: #1e293b;
  border-radius: 15px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
  border: none;
}

.project-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
}

.project-image-container {
  position: relative;
  overflow: hidden;
}

.project-card .card-img-top {
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card-img-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  color: #334155;
  font-size: 3rem;
}

.project-card:hover .card-img-top {
  transform: scale(1.1);
}

.project-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(1, 200, 121, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.project-tech {
  padding: 15px;
  text-align: center;
}

.tech-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.9);
  color: #1e293b;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  margin: 3px;
  font-weight: 500;
}

.project-card .card-body {
  padding: 20px;
  color: #cbd5e1;
  text-align: left;
}

.project-card .card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #fff;
}

.project-card .card-text {
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 20px;
}

.project-links { display: flex; gap: 10px; }

.btn-primary {
  background-color: #01c879;
  border-color: #01c879;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #019d6b;
  border-color: #019d6b;
  transform: translateY(-2px);
}

.btn-outline-light {
  color: #cbd5e1;
  border-color: #cbd5e1;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-outline-light:hover {
  background-color: #cbd5e1;
  color: #1e293b;
  transform: translateY(-2px);
}

.modal-content {
  background: #1e293b;
  color: #fff;
  border-radius: 15px;
}

.modal-header { border-bottom: 1px solid #2d3748; padding: 20px; }

.modal-title {
  color: #cbd5e1;
  font-size: 1.5rem;
  font-weight: 600;
}

.close { color: #cbd5e1; opacity: 1; font-size: 1.75rem; }
.close:hover { color: #fff; }

.modal-body { padding: 25px; }

.modal-scrollable {
  max-height: 70vh;
  overflow-y: auto;
}

.project-gallery {
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 25px;
}

.project-gallery img {
  width: 100%;
  border-radius: 10px;
}

.details-title {
  color: #01c879;
  font-size: 1.1rem;
  margin-bottom: 10px;
  font-weight: 600;
  margin-top: 15px;
}

.tech-stack { margin-bottom: 20px; }

.feature-list {
  list-style-type: none;
  padding-left: 0;
}

.feature-list li {
  position: relative;
  padding-left: 25px;
  margin-bottom: 10px;
  color: #cbd5e1;
}

.feature-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: #01c879;
}

.modal-footer { border-top: 1px solid #2d3748; padding: 20px; }

.btn-secondary {
  background-color: #4b5563;
  border-color: #4b5563;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background-color: #374151;
  border-color: #374151;
}

.btn-dark {
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .projects { padding: 50px 0; }
  .projects h2 { font-size: 2rem; }
  .filter-buttons { gap: 10px; }
  .filter-btn { padding: 6px 15px; font-size: 0.9rem; }
  .project-card .card-img-top { height: 180px; }
  .project-links { flex-direction: column; }
  .modal-dialog { margin: 10px; }
}
</style>

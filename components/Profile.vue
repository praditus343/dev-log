<template>
  <div class="bg-slate-900 text-slate-300 min-h-screen relative overflow-hidden">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    
    <div class="absolute top-20 -left-20 w-96 h-96 bg-green-500/10 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute bottom-20 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

    <section class="py-20 relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- About Section -->
        <div class="flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-20">
          <div class="w-full md:w-1/2 space-y-6 text-center md:text-left" data-aos="fade-right">
            <h2 class="text-3xl lg:text-5xl font-extrabold text-white tracking-tight">
              About <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Me</span>
            </h2>
            <div class="w-20 h-1 bg-green-500 mx-auto md:mx-0 rounded-full mb-6"></div>
            
            <div v-if="pendingContent" class="space-y-4 animate-pulse">
              <div class="h-4 bg-slate-800 rounded w-3/4"></div>
              <div class="h-4 bg-slate-800 rounded w-full"></div>
              <div class="h-4 bg-slate-800 rounded w-5/6"></div>
            </div>
            
            <div v-else class="space-y-4">
              <p v-for="(paragraph, idx) in aboutMe" :key="idx" class="text-base leading-relaxed" :class="idx === 0 ? 'text-lg text-slate-300' : 'text-slate-400'" v-html="paragraph"></p>
            </div>
            
            <div class="flex justify-center md:justify-start gap-6 pt-4">
              <a :href="s.social_github" target="_blank" class="text-slate-400 hover:text-green-400 transition-transform hover:-translate-y-1 text-2xl"><i class="fab fa-github"></i></a>
              <a :href="s.social_linkedin" target="_blank" class="text-slate-400 hover:text-green-400 transition-transform hover:-translate-y-1 text-2xl"><i class="fab fa-linkedin"></i></a>
              <a :href="s.social_instagram" target="_blank" class="text-slate-400 hover:text-green-400 transition-transform hover:-translate-y-1 text-2xl"><i class="fab fa-instagram"></i></a>
              <a :href="s.social_twitter" target="_blank" class="text-slate-400 hover:text-green-400 transition-transform hover:-translate-y-1 text-2xl"><i class="fab fa-twitter"></i></a>
            </div>
            
            <div class="pt-6">
              <a :href="s.cv_url" target="_blank" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-slate-900 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 focus:outline-none transition-all transform hover:scale-105">
                <i class="fas fa-download mr-2"></i> Download Resume
              </a>
            </div>
          </div>

          <div class="w-full md:w-1/2 flex justify-center lg:justify-end" data-aos="fade-left">
            <div class="relative w-64 h-64 lg:w-80 lg:h-80">
              <div class="absolute inset-0 bg-green-500 rounded-full blur-[60px] opacity-30 animate-pulse"></div>
              <div class="relative w-full h-full rounded-full border-4 border-green-500/50 p-2 overflow-hidden bg-slate-800 transition-transform duration-500 hover:scale-105 hover:border-green-400 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <img v-if="s.profile_photo_url" :src="s.profile_photo_url" alt="Profile Photo" class="w-full h-full object-cover rounded-full" />
                <img v-else src="~/assets/img/1.png" alt="Egi Danuarta" class="w-full h-full object-cover rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <!-- Skills Section -->
        <div class="mt-32" data-aos="fade-up">
          <div class="text-center mb-16">
            <h2 class="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              My <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Skills</span>
            </h2>
            <div class="w-20 h-1 bg-green-500 mx-auto rounded-full mt-4"></div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Skill 1 -->
            <div class="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl hover:bg-slate-800 hover:border-green-500/30 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(34,197,94,0.1)] hover:-translate-y-2 flex flex-col h-full">
              <div class="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-3xl text-green-400 mb-6 group-hover:scale-110 group-hover:bg-green-500/10 transition-all">
                <i class="fas fa-laptop-code"></i>
              </div>
              <h4 class="text-xl font-bold text-white mb-3">Web Development</h4>
              <p class="text-slate-400 leading-relaxed mb-6 flex-grow">
                Expert in modern web technologies including Vue.js, React, and Node.js. Focused on creating responsive and performant applications.
              </p>
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-slate-300 font-medium">Proficiency</span>
                  <span class="text-green-400 font-bold">90%</span>
                </div>
                <div class="w-full bg-slate-900 rounded-full h-2.5">
                  <div class="bg-gradient-to-r from-green-400 to-emerald-500 h-2.5 rounded-full" style="width: 90%"></div>
                </div>
              </div>
            </div>

            <!-- Skill 2 -->
            <div class="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl hover:bg-slate-800 hover:border-green-500/30 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(34,197,94,0.1)] hover:-translate-y-2 flex flex-col h-full">
              <div class="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-3xl text-green-400 mb-6 group-hover:scale-110 group-hover:bg-green-500/10 transition-all">
                <i class="fas fa-chart-line"></i>
              </div>
              <h4 class="text-xl font-bold text-white mb-3">Data Science</h4>
              <p class="text-slate-400 leading-relaxed mb-6 flex-grow">
                Proficient in data analysis, machine learning, and statistical modeling using Python, Pandas, and scikit-learn.
              </p>
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-slate-300 font-medium">Proficiency</span>
                  <span class="text-green-400 font-bold">85%</span>
                </div>
                <div class="w-full bg-slate-900 rounded-full h-2.5">
                  <div class="bg-gradient-to-r from-green-400 to-emerald-500 h-2.5 rounded-full" style="width: 85%"></div>
                </div>
              </div>
            </div>

            <!-- Skill 3 -->
            <div class="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl hover:bg-slate-800 hover:border-green-500/30 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(34,197,94,0.1)] hover:-translate-y-2 flex flex-col h-full">
              <div class="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-3xl text-green-400 mb-6 group-hover:scale-110 group-hover:bg-green-500/10 transition-all">
                <i class="fas fa-mobile-alt"></i>
              </div>
              <h4 class="text-xl font-bold text-white mb-3">Responsive Design</h4>
              <p class="text-slate-400 leading-relaxed mb-6 flex-grow">
                Skilled in creating adaptive layouts using modern CSS frameworks and best practices for optimal user experience across all devices.
              </p>
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-slate-300 font-medium">Proficiency</span>
                  <span class="text-green-400 font-bold">88%</span>
                </div>
                <div class="w-full bg-slate-900 rounded-full h-2.5">
                  <div class="bg-gradient-to-r from-green-400 to-emerald-500 h-2.5 rounded-full" style="width: 88%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Highlight -->
        <div class="mt-32 max-w-4xl mx-auto" data-aos="fade-up">
          <div class="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-10 md:p-14 text-center shadow-2xl overflow-hidden">
            <div class="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px]"></div>
            
            <h2 class="text-3xl font-bold text-white mb-6 relative z-10">Interested in working together?</h2>
            <p class="text-lg text-slate-400 mb-10 max-w-2xl mx-auto relative z-10">
              I'm currently available for freelance work or full-time opportunities. If you have a project that needs some creative touch, I'd love to hear about it.
            </p>
            
            <div class="flex flex-col sm:flex-row justify-center items-center gap-6 relative z-10">
              <a :href="'mailto:' + s.contact_email" class="flex items-center gap-3 text-slate-300 hover:text-green-400 transition-colors">
                <div class="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center text-xl"><i class="fas fa-envelope"></i></div>
                <span class="font-medium text-lg">{{ s.contact_email }}</span>
              </a>
              <div class="hidden sm:block w-px h-10 bg-slate-700"></div>
              <a :href="'tel:' + s.contact_phone" class="flex items-center gap-3 text-slate-300 hover:text-green-400 transition-colors">
                <div class="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center text-xl"><i class="fas fa-phone-alt"></i></div>
                <span class="font-medium text-lg">{{ s.contact_phone }}</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const { getSettings } = useSiteSettings()

const loading = ref(true)
const s = ref({
  profile_name: 'Egi Danuarta',
  profile_tagline: 'Web Developer & Data Science Enthusiast',
  profile_photo_url: '',
  about_paragraphs: "I'm Egi Danuarta, a passionate web developer based in Yogyakarta, Indonesia.",
  cv_url: '#',
  social_github: 'https://github.com/praditus343',
  social_linkedin: 'https://www.linkedin.com/in/praditus-egi-danuarta/',
  social_instagram: 'https://www.instagram.com/egidanuarta17/',
  social_twitter: 'https://twitter.com/egidanuarta17'
})

// about paragraphs split by newline for rendering
const aboutMe = computed(() => {
  return (s.value.about_paragraphs || '').split('\n').filter(Boolean)
})

onMounted(async () => {
  if (typeof AOS !== 'undefined') AOS.init({ duration: 1000, once: true })
  try {
    const data = await getSettings(Object.keys(s.value))
    Object.assign(s.value, data)
  } catch (err) {
    console.error('Failed to load site settings:', err)
  } finally {
    loading.value = false
  }
})
</script>

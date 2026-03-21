<template>
  <div class="bg-slate-900 text-slate-300 min-h-screen flex flex-col relative overflow-hidden">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <Navbar />
    
    <!-- Decorative Elements -->
    <div class="absolute top-20 right-20 w-96 h-96 bg-green-500/10 rounded-full blur-[100px] pointer-events-none"></div>

    <section class="flex-grow py-20 relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16" data-aos="fade-down">
          <h2 class="text-3xl lg:text-5xl font-extrabold text-white tracking-tight">
            Read My <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Articles</span>
          </h2>
          <div class="w-20 h-1 bg-green-500 mx-auto rounded-full mt-4"></div>
          <p class="mt-6 text-slate-400 max-w-2xl mx-auto text-lg text-center">
            Insights, tutorials, and my journey as a developer.
          </p>
        </div>

        <div v-if="pending" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>

        <div v-else-if="error" class="text-center py-20">
          <p class="text-red-400 text-lg">Error loading articles. Please try again later.</p>
        </div>

        <div v-else-if="articles && articles.length === 0" class="text-center py-20">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800 text-slate-500 mb-4 text-3xl">
            <i class="fas fa-book-open"></i>
          </div>
          <p class="text-slate-400 text-lg">No articles discovered yet. Check back soon!</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <NuxtLink 
            v-for="(article, index) in articles" 
            :key="article.id" 
            :to="`/articles/${article.slug}`"
            class="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-green-500/50 transition-all duration-500 hover:shadow-[0_10px_30px_rgba(34,197,94,0.15)] flex flex-col transform hover:-translate-y-2 cursor-pointer"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
          >
            <!-- Cover Image -->
            <div v-if="article.cover_image" class="w-full h-48 overflow-hidden">
              <img :src="article.cover_image" :alt="article.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div v-else class="w-full h-48 bg-slate-700/50 flex items-center justify-center">
              <i class="fas fa-newspaper text-4xl text-slate-600"></i>
            </div>

            <!-- Content -->
            <div class="p-8 flex flex-col flex-grow">
               <div class="flex items-center gap-2 text-sm text-green-400 font-medium mb-4">
                 <i class="far fa-calendar-alt"></i>
                 <span>{{ formatDate(article.published_at || article.created_at) }}</span>
               </div>
              <h3 class="text-xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors line-clamp-2">{{ article.title }}</h3>
              <p class="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                {{ article.excerpt || getExcerpt(article.content) }}
              </p>
              
              <div class="flex items-center text-green-500 font-medium mt-auto group-hover:translate-x-2 transition-transform">
                Read Article <i class="fas fa-arrow-right ml-2 text-sm"></i>
              </div>
            </div>
          </NuxtLink>
        </div>

      </div>
    </section>
    
    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

const supabase = useSupabaseClient();

// Fetch articles
const { data: articles, pending, error } = await useAsyncData('articles', async () => {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, content, excerpt, cover_image, created_at, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(date);
};

// Simple excerpt function to strip tags and truncate
const getExcerpt = (content) => {
  if (!content) return '';
  const stripped = content.replace(/(<([^>]+)>)/gi, "");
  return stripped.length > 150 ? stripped.substring(0, 150) + '...' : stripped;
};

onMounted(() => {
  if (typeof window !== 'undefined' && window.AOS) {
    window.AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
  }
});
</script>

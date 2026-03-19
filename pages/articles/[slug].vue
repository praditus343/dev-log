<template>
  <div class="bg-slate-900 text-slate-300 min-h-screen flex flex-col relative overflow-hidden">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <Navbar />
    
    <!-- Decorative Elements -->
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none"></div>

    <section class="flex-grow py-20 relative z-10 w-full">
      <div v-if="pending" class="flex justify-center items-center py-32">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>

      <div v-else-if="error || !article" class="max-w-3xl mx-auto px-4 text-center py-32">
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-800 text-red-400 mb-6 text-4xl">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h2 class="text-3xl font-bold text-white mb-4">Article Not Found</h2>
        <p class="text-slate-400 mb-8">The article you're looking for doesn't exist or has been removed.</p>
        <NuxtLink to="/articles" class="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors">
          <i class="fas fa-arrow-left mr-2"></i> Back to Articles
        </NuxtLink>
      </div>

      <article v-else class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-16 animate-fade-in-up">
          <NuxtLink to="/articles" class="inline-flex items-center text-green-500 hover:text-green-400 transition-colors mb-8 font-medium">
            <i class="fas fa-arrow-left mr-2"></i> Back to Articles
          </NuxtLink>
          
          <h1 class="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-8 leading-tight">
            {{ article.title }}
          </h1>
          
          <div class="flex items-center justify-center gap-6 text-slate-400">
            <div class="flex items-center gap-2">
              <i class="far fa-calendar-alt text-green-500"></i>
              <span>{{ formatDate(article.published_at || article.created_at) }}</span>
            </div>
            <div class="hidden sm:block w-1 h-1 rounded-full bg-slate-600"></div>
            <div class="flex items-center gap-2">
              <i class="far fa-user text-green-500"></i>
              <span>Egi Danuarta</span>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="prose prose-invert prose-lg max-w-none prose-a:text-green-400 hover:prose-a:text-green-300 prose-img:rounded-2xl prose-headings:text-white prose-p:text-slate-300 animate-fade-in-up delay-100" v-html="article.content"></div>
      </article>
    </section>
    
    <Footer />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const supabase = useSupabaseClient();
const slug = route.params.slug;

const { data: article, pending, error } = await useAsyncData(`article-${slug}`, async () => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return data;
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
</script>

<style>
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}
.delay-100 {
  animation-delay: 100ms;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Base styles for markdown content rendered in prose */
.prose h2 {
  font-size: 1.875rem !important;
  margin-top: 2.5rem !important;
  margin-bottom: 1.25rem !important;
  font-weight: 700 !important;
  color: white !important;
}

.prose h3 {
  font-size: 1.5rem !important;
  margin-top: 2rem !important;
  margin-bottom: 1rem !important;
  font-weight: 600 !important;
  color: #f8fafc !important;
}

.prose p {
  line-height: 1.8 !important;
  margin-bottom: 1.5rem !important;
  color: #cbd5e1 !important;
}

.prose ul, .prose ol {
  margin-bottom: 1.5rem !important;
}

.prose li {
  margin-bottom: 0.5rem !important;
  color: #cbd5e1 !important;
}

.prose pre {
  background-color: #0f172a !important;
  border: 1px solid #334155 !important;
  border-radius: 0.75rem !important;
}

.prose blockquote {
  border-left-color: #22c55e !important;
  background-color: rgba(34, 197, 94, 0.05) !important;
  padding: 1rem 1.5rem !important;
  border-radius: 0 0.5rem 0.5rem 0 !important;
  color: #94a3b8 !important;
  font-style: italic !important;
}
</style>

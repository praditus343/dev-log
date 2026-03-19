<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Decorative Elements -->
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="max-w-md w-full space-y-8 bg-slate-800/80 backdrop-blur-md p-10 rounded-3xl border border-slate-700/50 shadow-2xl relative z-10 animate-fade-in-up">
      <div>
        <h2 class="mt-2 text-center text-3xl font-extrabold text-white">
          Admin <span class="text-green-500">Login</span>
        </h2>
        <p class="mt-2 text-center text-sm text-slate-400">
          Sign in to manage your portfolio content
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input 
              id="email-address" 
              name="email" 
              type="email" 
              autocomplete="email" 
              required 
              v-model="email"
              class="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-600 bg-slate-900/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors sm:text-sm" 
              placeholder="Email address" 
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              autocomplete="current-password" 
              required 
              v-model="password"
              class="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-600 bg-slate-900/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors sm:text-sm" 
              placeholder="Password" 
            />
          </div>
        </div>

        <div v-if="errorMsg" class="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg border border-red-500/20">
          {{ errorMsg }}
        </div>

        <div>
          <button 
            type="submit" 
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-green-500 transition-all shadow-lg shadow-green-500/30 disabled:opacity-50"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <i class="fas fa-lock text-green-300 group-hover:text-green-200" v-if="!loading"></i>
              <i class="fas fa-circle-notch fa-spin text-green-300" v-else></i>
            </span>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </div>
        
        <div class="text-center mt-4">
          <NuxtLink to="/" class="text-sm font-medium text-slate-400 hover:text-green-400 transition-colors">
            &larr; Back to Portfolio
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const supabase = useSupabaseClient()
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    errorMsg.value = ''
    
    // In Nuxt 3 with @nuxtjs/supabase, auth is handled via composables
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    
    if (error) throw error
    
    // Auto-redirected by middleware if successful, but we can do it explicitly
    navigateTo('/admin')
  } catch (error) {
    errorMsg.value = error.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
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
</style>

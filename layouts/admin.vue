<template>
  <div class="min-h-screen bg-slate-900 text-slate-300 flex">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <!-- Admin Sidebar -->
    <aside class="w-64 bg-slate-800 border-r border-slate-700 hidden md:flex flex-col">
      <div class="p-6 border-b border-slate-700">
        <h2 class="text-2xl font-bold text-white tracking-widest">
          PED<span class="text-green-500">.</span> Admin
        </h2>
        <p class="text-xs text-slate-500 mt-1">Portfolio Control Panel</p>
      </div>
      <nav class="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
        <p class="text-xs text-slate-500 font-medium uppercase tracking-widest px-3 py-2 mt-2">Content</p>
        <NuxtLink to="/admin" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-700 hover:text-white transition-colors text-sm font-medium" exact-active-class="bg-slate-700/80 !text-green-400 border-l-4 border-green-500 pl-2">
          <i class="fas fa-tachometer-alt w-5"></i> Dashboard
        </NuxtLink>
        <NuxtLink to="/admin/home" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-700 hover:text-white transition-colors text-sm font-medium" active-class="bg-slate-700/80 !text-green-400 border-l-4 border-green-500 pl-2">
          <i class="fas fa-home w-5"></i> Manage Home
        </NuxtLink>
        <NuxtLink to="/admin/projects" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-700 hover:text-white transition-colors text-sm font-medium" active-class="bg-slate-700/80 !text-green-400 border-l-4 border-green-500 pl-2">
          <i class="fas fa-briefcase w-5"></i> Manage Projects
        </NuxtLink>
        <NuxtLink to="/admin/articles" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-700 hover:text-white transition-colors text-sm font-medium" active-class="bg-slate-700/80 !text-green-400 border-l-4 border-green-500 pl-2">
          <i class="fas fa-book w-5"></i> Manage Articles
        </NuxtLink>
        <NuxtLink to="/admin/contact" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-700 hover:text-white transition-colors text-sm font-medium" active-class="bg-slate-700/80 !text-green-400 border-l-4 border-green-500 pl-2">
          <i class="fas fa-address-book w-5"></i> Manage Contact
        </NuxtLink>
        <p class="text-xs text-slate-500 font-medium uppercase tracking-widest px-3 py-2 mt-4">Settings</p>
        <NuxtLink to="/admin/content" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-700 hover:text-white transition-colors text-sm font-medium" active-class="bg-slate-700/80 !text-green-400 border-l-4 border-green-500 pl-2">
          <i class="fas fa-cog w-5"></i> CV Settings
        </NuxtLink>
      </nav>
      <div class="p-4 border-t border-slate-700">
        <NuxtLink to="/" class="sidebar-link mb-2">
          <i class="fas fa-external-link-alt w-5"></i> View Website
        </NuxtLink>
        <button @click="handleLogout" class="w-full px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center font-medium">
          <i class="fas fa-sign-out-alt mr-2"></i> Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-screen overflow-hidden">
      <!-- Mobile Header -->
      <header class="md:hidden bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white">PED<span class="text-green-500">.</span> Admin</h2>
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-slate-300 hover:text-white p-2">
          <i class="fas fa-bars text-xl"></i>
        </button>
      </header>
      
      <!-- Mobile Menu -->
      <div v-show="mobileMenuOpen" class="md:hidden bg-slate-800 border-b border-slate-700 p-4 flex flex-col gap-1 relative z-50">
        <NuxtLink to="/admin" @click="mobileMenuOpen = false" class="sidebar-link" exact-active-class="sidebar-link-active">Dashboard</NuxtLink>
        <NuxtLink to="/admin/home" @click="mobileMenuOpen = false" class="sidebar-link" active-class="sidebar-link-active">Manage Home</NuxtLink>
        <NuxtLink to="/admin/projects" @click="mobileMenuOpen = false" class="sidebar-link" active-class="sidebar-link-active">Manage Projects</NuxtLink>
        <NuxtLink to="/admin/articles" @click="mobileMenuOpen = false" class="sidebar-link" active-class="sidebar-link-active">Manage Articles</NuxtLink>
        <NuxtLink to="/admin/contact" @click="mobileMenuOpen = false" class="sidebar-link" active-class="sidebar-link-active">Manage Contact</NuxtLink>
        <NuxtLink to="/admin/content" @click="mobileMenuOpen = false" class="sidebar-link" active-class="sidebar-link-active">CV Settings</NuxtLink>
        <button @click="handleLogout" class="px-4 py-3 text-left text-red-500 hover:bg-slate-700 rounded-xl text-sm">Logout</button>
      </div>

      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const supabase = useSupabaseClient()
const mobileMenuOpen = ref(false)

const handleLogout = async () => {
  await supabase.auth.signOut()
  navigateTo('/admin/login')
}
</script>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

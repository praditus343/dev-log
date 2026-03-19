<template>
  <nav class="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-green-500/50 shadow-lg shadow-black/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <div class="flex-shrink-0 flex items-center">
          <NuxtLink to="/" class="text-2xl font-bold text-white tracking-widest hover:text-green-400 transition-colors">
            PORT
            <span class="text-green-500">.</span>
          </NuxtLink>
        </div>
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-8">
            <NuxtLink to="/" class="nav-link" active-class="active" exact>Home</NuxtLink>
            <NuxtLink to="/Projects" class="nav-link" active-class="active">Projects</NuxtLink>
            <NuxtLink to="/Contact" class="nav-link" active-class="active">Contact</NuxtLink>
            <NuxtLink to="/articles" class="nav-link" active-class="active">Articles</NuxtLink>
          </div>
        </div>
        <div class="-mr-2 flex md:hidden">
          <button @click="toggleMenu" type="button" class="inline-flex items-center justify-center p-2 rounded-md text-green-500 hover:text-white hover:bg-slate-800/50 focus:outline-none transition-colors">
            <span class="sr-only">Open main menu</span>
            <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" v-if="!isMenuOpen">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" v-else>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="md:hidden transition-all duration-300 ease-in-out" :class="isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-900 border-t border-slate-800">
        <NuxtLink to="/" class="mobile-nav-link" active-class="mobile-active" exact @click="closeMenu">Home</NuxtLink>
        <NuxtLink to="/Projects" class="mobile-nav-link" active-class="mobile-active" @click="closeMenu">Projects</NuxtLink>
        <NuxtLink to="/Contact" class="mobile-nav-link" active-class="mobile-active" @click="closeMenu">Contact</NuxtLink>
        <NuxtLink to="/articles" class="mobile-nav-link" active-class="mobile-active" @click="closeMenu">Articles</NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      isMenuOpen: false
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    closeMenu() {
      this.isMenuOpen = false
    }
  }
}
</script>

<style scoped>
.nav-link {
  @apply text-slate-300 hover:text-white px-1 py-2 text-[15px] font-medium transition-colors relative tracking-wide;
}
.nav-link::after {
  content: '';
  @apply absolute left-0 -bottom-2 w-full h-[2px] bg-green-500 scale-x-0 transition-transform duration-300 origin-left shadow-[0_0_10px_rgba(34,197,94,0.5)];
}
.nav-link:hover::after, .active::after {
  @apply scale-x-100;
}
.active {
  @apply text-white;
}
.mobile-nav-link {
  @apply text-slate-300 hover:bg-slate-800/50 hover:text-white block px-4 py-3 rounded-md text-base font-medium transition-colors text-center;
}
.mobile-active {
  @apply bg-slate-800/80 text-green-400 border-l-4 border-green-500;
}
</style>
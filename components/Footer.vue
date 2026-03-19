<template>
  <footer class="bg-slate-900 border-t border-slate-800 pt-16 pb-8 text-white relative overflow-hidden">
    <!-- Decorative glow -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
    <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-500/5 blur-[100px] rounded-full pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        <!-- Brand / About -->
        <div class="space-y-4">
          <h3 class="text-2xl font-bold tracking-widest mb-4">
            PED<span class="text-green-500">.</span>
          </h3>
          <p class="text-slate-400 leading-relaxed text-sm md:pr-10">
            Passionate IT student specializing in web development and data science. Constantly learning and building innovative solutions.
          </p>
        </div>

        <!-- Links -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul class="space-y-3">
            <li><NuxtLink to="/" class="text-slate-400 hover:text-green-400 transition-colors">Home</NuxtLink></li>
            <li><NuxtLink to="/Projects" class="text-slate-400 hover:text-green-400 transition-colors">Projects</NuxtLink></li>
            <li><NuxtLink to="/articles" class="text-slate-400 hover:text-green-400 transition-colors">Articles</NuxtLink></li>
            <li><NuxtLink to="/Contact" class="text-slate-400 hover:text-green-400 transition-colors">Contact</NuxtLink></li>
          </ul>
        </div>

        <!-- Social -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-white mb-4">Connect</h4>
          <div class="flex justify-center md:justify-start space-x-5">
            <a href="https://github.com/praditus343" target="_blank" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-green-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-lg">
              <i class="fab fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/praditus-egi-danuarta/" target="_blank" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-green-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-lg">
              <i class="fab fa-linkedin-in"></i>
            </a>
            <a href="https://www.instagram.com/egidanuarta17/" target="_blank" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-green-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-lg">
              <i class="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      <div class="mt-16 pt-8 border-t border-slate-800/60 text-center">
        <p class="text-slate-500 text-sm">
          &copy; {{ new Date().getFullYear() }} Praditus Egi Danuarta. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

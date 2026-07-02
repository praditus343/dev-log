<template>
  <div class="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl hover:bg-slate-800 hover:border-green-500/30 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-2 flex flex-col h-full">
    <div class="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-3xl text-green-400 mb-6 group-hover:scale-110 group-hover:bg-green-500/10 transition-all">
      <i :class="icon"></i>
    </div>
    <h3 class="text-xl font-bold text-white mb-3">{{ title }}</h3>
    <p class="text-slate-400 leading-relaxed mb-6 flex-grow">
      {{ description }}
    </p>
    <div>
      <div class="flex justify-between text-sm mb-2">
        <span class="text-slate-300 font-medium">Proficiency</span>
        <span class="text-green-400 font-bold">{{ proficiency }}%</span>
      </div>
      <div class="w-full bg-slate-900 rounded-full h-2.5" role="progressbar" :aria-valuenow="proficiency" aria-valuemin="0" aria-valuemax="100" :aria-label="`${title} proficiency: ${proficiency}%`">
        <div class="bg-gradient-to-r from-green-400 to-emerald-500 h-2.5 rounded-full" :style="{ width: `${proficiency}%` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  proficiency: { type: Number, required: true },
})
</script>

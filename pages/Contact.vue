<template>
  <div class="bg-slate-900 text-slate-300 min-h-screen flex flex-col relative overflow-hidden">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <Navbar />
    
    <!-- Decorative Elements -->
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none"></div>

    <section class="flex-grow py-20 relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center mb-16" data-aos="fade-down">
          <h2 class="text-3xl lg:text-5xl font-extrabold text-white tracking-tight">
            Contact <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Me</span>
          </h2>
          <div class="w-20 h-1 bg-green-500 mx-auto rounded-full mt-4"></div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <!-- Contact Info -->
          <div class="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 lg:p-12 shadow-2xl h-full" data-aos="fade-right">
            <h3 class="text-2xl font-bold text-white mb-8 border-b border-slate-700 pb-4">Let's Connect</h3>
            
            <ul class="space-y-6">
              <li>
                <a href="mailto:egidanuarta17@gmail.com" class="flex items-center group">
                  <div class="w-12 h-12 rounded-full bg-slate-900/50 border border-slate-700 flex items-center justify-center text-green-400 group-hover:bg-green-500/10 group-hover:border-green-500/50 transition-colors">
                    <i class="fas fa-envelope"></i>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm text-slate-400">Email</p>
                    <p class="text-lg text-slate-200 group-hover:text-green-400 transition-colors">egidanuarta17@gmail.com</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="tel:+6285700120940" class="flex items-center group">
                  <div class="w-12 h-12 rounded-full bg-slate-900/50 border border-slate-700 flex items-center justify-center text-green-400 group-hover:bg-green-500/10 group-hover:border-green-500/50 transition-colors">
                    <i class="fas fa-phone"></i>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm text-slate-400">Phone</p>
                    <p class="text-lg text-slate-200 group-hover:text-green-400 transition-colors">(+62) 857-0012-0940</p>
                  </div>
                </a>
              </li>
              <li>
                <div class="flex items-center group cursor-default">
                  <div class="w-12 h-12 rounded-full bg-slate-900/50 border border-slate-700 flex items-center justify-center text-green-400 transition-colors">
                    <i class="fas fa-map-marker-alt"></i>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm text-slate-400">Location</p>
                    <p class="text-lg text-slate-200">Sleman, Yogyakarta</p>
                  </div>
                </div>
              </li>
            </ul>

            <h3 class="text-xl font-bold text-white mt-12 mb-6 border-b border-slate-700 pb-4">Social Media</h3>
            <div class="flex gap-4">
              <a href="https://github.com/praditus343" target="_blank" class="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-green-500 hover:bg-slate-800 transition-all hover:scale-110 shadow-lg px-2 text-xl">
                <i class="fab fa-github"></i>
              </a>
              <a href="https://www.linkedin.com/in/praditus-egi-danuarta/" target="_blank" class="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-green-500 hover:bg-slate-800 transition-all hover:scale-110 shadow-lg px-2 text-xl">
                <i class="fab fa-linkedin"></i>
              </a>
              <a href="https://www.instagram.com/egidanuarta17/" target="_blank" class="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-green-500 hover:bg-slate-800 transition-all hover:scale-110 shadow-lg px-2 text-xl">
                <i class="fab fa-instagram"></i>
              </a>
              <a href="https://twitter.com/egidanuarta17" target="_blank" class="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-green-500 hover:bg-slate-800 transition-all hover:scale-110 shadow-lg px-2 text-xl">
                <i class="fab fa-twitter"></i>
              </a>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 lg:p-12 shadow-2xl h-full" data-aos="fade-left">
            <h3 class="text-2xl font-bold text-white mb-8 border-b border-slate-700 pb-4">Send Message</h3>
            <form @submit.prevent="sendMessage" class="space-y-6">
              <div>
                <label for="name" class="block text-sm font-medium text-slate-400 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  v-model="form.name"
                  class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  :class="{'border-red-500 focus:ring-red-500': formErrors.name}"
                  placeholder="John Doe"
                />
                <p v-if="formErrors.name" class="mt-2 text-sm text-red-500">{{ formErrors.name }}</p>
              </div>
              
              <div>
                <label for="email" class="block text-sm font-medium text-slate-400 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  :class="{'border-red-500 focus:ring-red-500': formErrors.email}"
                  placeholder="john@example.com"
                />
                <p v-if="formErrors.email" class="mt-2 text-sm text-red-500">{{ formErrors.email }}</p>
              </div>
              
              <div>
                <label for="message" class="block text-sm font-medium text-slate-400 mb-2">Message</label>
                <textarea
                  id="message"
                  v-model="form.message"
                  rows="5"
                  class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-y"
                  :class="{'border-red-500 focus:ring-red-500': formErrors.message}"
                  placeholder="How can I help you?"
                ></textarea>
                <p v-if="formErrors.message" class="mt-2 text-sm text-red-500">{{ formErrors.message }}</p>
              </div>
              
              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center"
              >
                <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
                <i v-else class="fas fa-paper-plane mr-2"></i>
                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Google Maps -->
        <div class="w-full h-[400px] rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl relative z-10" data-aos="fade-up">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15875.64419141374!2d110.4078221!3d-7.758512!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a3d6f9e0c9c5b%3A0xa9fa7b1a11cbb2e8!2sSleman%2C%20Yogyakarta!5e0!3m2!1sen!2sid!4v1688991851345!5m2!1sen!2sid"
            width="100%"
            height="100%"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Location Google Maps"
            class="filter contrast-125 saturate-50 opacity-90 hover:opacity-100 hover:saturate-100 transition-all duration-500"
          ></iframe>
        </div>

      </div>
    </section>
    
    <Footer />
  </div>
</template>

<script>
import emailjs from 'emailjs-com';
import Navbar from '~/components/Navbar.vue'
import Footer from '~/components/Footer.vue'

export default {
  name: 'Contact',
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        message: ''
      },
      isSubmitting: false,
      formErrors: {
        name: '',
        email: '',
        message: ''
      }
    }
  },
  methods: {
    validateForm() {
      this.formErrors.name = this.form.name ? '' : 'Name is required';
      this.formErrors.email = this.isValidEmail(this.form.email) ? '' : 'Valid email is required';
      this.formErrors.message = this.form.message ? '' : 'Message cannot be empty';
      return !Object.values(this.formErrors).some(error => error);
    },
    isValidEmail(email) {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailPattern.test(email);
    },
    sendMessage() {
      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;
      
      const templateParams = {
        name: this.form.name,
        email: this.form.email,
        message: this.form.message
      };

      emailjs.send('service_hcn1hln', 'template_gn0lv1m', templateParams, 'ARhuSalaRawx81DAt')
        .then((response) => {
          alert('Message sent! Thank you for contacting me.');
          this.isSubmitting = false;
          this.form.name = '';
          this.form.email = '';
          this.form.message = '';
        }, (error) => {
          alert('Failed to send message. Please try again later.');
          this.isSubmitting = false;
        });
    }
  },
  mounted() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100
      });
    }
  }
}
</script>

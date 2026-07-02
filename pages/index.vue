<template>
  <div>
    <Navbar />
    <main id="main-content">
      <Profile />
    </main>
    <Footer />
  </div>
</template>

<script>
import Navbar from '~/components/Navbar.vue';
import Profile from '~/components/Profile.vue';
import Footer from '~/components/Footer.vue';
export default {
  components: {
    Navbar,
    Profile,
    Footer,
  }
}
</script>./Index.vue

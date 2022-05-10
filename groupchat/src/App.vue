<template>
  <div id="app">
    <header>
      <NavBar />
    </header>
    <main>
      <router-view>
        <LandingPage />
      </router-view>
    </main>
  </div>
</template>

<script>
  import NavBar from './components/NavBar.vue'
  import LandingPage from './pages/LandingPage.vue'

  export default {
    name: 'App',
    components: {
      NavBar,
      LandingPage
    }
  }
</script>

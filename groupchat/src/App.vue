<template>
  <div id="app">
    <header>
      <NavBar />
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
  import NavBar from './components/NavBar.vue'
  // import LandingPage from './pages/LandingPage.vue'
  // import HomePage from './pages/HomePage.vue'

  export default {
    name: 'App',
    components: {
      NavBar,
      // LandingPage,
      // HomePage
    }
  //   ,
  //   data: () => ({
  //     user: {}
  //   }),
  //   methods: {
  //    setUser(value) {
  //      this.user = value
  //    }
  //  }
  }
</script>

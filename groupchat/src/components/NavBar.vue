<template>
  <nav>
    <router-link to="/">Home</router-link>
    <!-- <router-link to="/register">Register</router-link>
    <router-link to="/login">Login</router-link> -->
    <router-link to="/profile"></router-link>
  </nav>
</template>

<script>
  export default {
    name: 'NavBar',
    data: () => ({
      user: {}
    })
  }
</script>

<style scoped>

</style>

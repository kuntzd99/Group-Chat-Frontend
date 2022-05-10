<template>
  <div>
    <LoginComponent :user="user" />
  </div>
</template>

<script>
import LoginComponent from '../components/LoginComponent.vue'

export default {
   name: 'LandingPage',
   components: {
     LoginComponent
   },
   data: () => ({
     user: {username: null}
   })
}
</script>

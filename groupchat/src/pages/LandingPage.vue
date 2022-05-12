<template>
  <div id="landing-page">
    <h1>Welcome to Group-Chat</h1>
    <LoginComponent :user="user" @setUser="setUser" />
    <RegisterComponent :user="user" @setUser="setUser" />
  </div>
</template>

<script>
import LoginComponent from '../components/LoginComponent.vue'
import RegisterComponent from '../components/RegisterComponent.vue'

export default {
   name: 'LandingPage',
   components: {
     LoginComponent,
     RegisterComponent
   },
   data: () => ({
     user: {}
   }),
   methods: {
     setUser(value) {
       this.user = value
     }
   }
}
</script>

<style>
  #landing-page {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
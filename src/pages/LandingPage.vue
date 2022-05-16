<template>
  <div id="landing-page">
    <div class="banner">
      <h1 class="title">Group-Chat</h1>
    </div>
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

<style scoped>
  #landing-page {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .title {
    font-size: 5em;
    height: 15vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-family: 'Cairo', sans-serif;
  }
  .banner {
    background-color: aquamarine;
    width: 100vw;
    display: flex;
    justify-content: center;
  }
</style>
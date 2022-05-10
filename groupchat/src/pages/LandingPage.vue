<template>
  <div>
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
  //  props: {
  //    user: Object
  //  },
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

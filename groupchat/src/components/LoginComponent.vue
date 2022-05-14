<template>
  <div id="login">
    <h3>Login</h3>
    <form @submit="handleSubmit">
      <input @input="handleChange" :value="username" type="text" placeholder="username" name="username" />
      <input @input="handleChange" type="password" placeholder="password" :value="password" name="password" />
      <button type="submit" :disabled="!username || !password">Log In</button>
    </form>
  </div>
</template>

<script>
  import axios from 'axios'
  // const bcrypt = require('bcrypt')

  export default {
    name: 'LoginComponent',
    props: {
      user: Object
    },
    data: () => ({
      users: [],
      username: '',
      password: ''
    }),
    mounted() {
      this.getUsers()
    },
    methods: {
      async getUsers() {
        const res = await axios.get('http://localhost:8000/users/')
        this.users = res.data
      },
      handleChange(e) {
        this[e.target.name] = e.target.value
      },
      handleSubmit(e) {
        e.preventDefault()
        let count = 0
        while (count < this.users.length) {
          // if (count >= this.users.length) {
          //   return window.alert("User doesn't exist")
          // }
          if (this.users[count].username === this.username && this.users[count].passwordDigest === this.password) {
            this.$emit('setUser', this.users[count])
            return this.$router.push(`/home/${this.users[count].id}`)
          }
          count++
        }
        return window.alert("User doesn't exist")
        // for (let i = 0; i < this.users.length; i++) {
        //   // let passwordMatch = await bcrypt.compare(this.users[i].passwordDigest, this.password)
        //   if (this.users[i].username === this.username && this.users[i].passwordDigest === this.password) {
        //     // user = this.users[i]
        //     this.$emit('setUser', this.users[i])
        //     break
        //   }
        // }
        // window.alert("User doesn't exist")
      }
    }
  }
</script>

<style scoped>
  #login {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  input {
    margin: 0 0.5vw;
  }
</style>
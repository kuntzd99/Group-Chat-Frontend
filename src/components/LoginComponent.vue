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
          console.log(this.hashPassword(this.password))
          if (this.users[count].username === this.username && this.users[count].passwordDigest == this.hashPassword(this.password)) {
            this.$emit('setUser', this.users[count])
            return this.$router.push(`/home/${this.hashUserIdForHome(this.users[count].id)}`)
          }
          count++
        }
        return window.alert("User doesn't exist")
      },
      hashUserIdForHome(integer) {
        return integer * 37 - 32
      },
      hashPassword(password) {
        let hash = 0
        if (password.length === 0) {
          return hash
        }
        for (let i = 0; i < password.length; i++) {
          let char = password.charCodeAt(i)
          hash = (hash << 5) - hash + char
          hash = hash & hash
        }
        return hash
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
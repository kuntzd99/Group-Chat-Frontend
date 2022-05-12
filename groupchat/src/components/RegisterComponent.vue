<template>
  <div>
    <h3>Register</h3>
    <form v-on:submit="handleSubmit">
      <input @input="handleChange" :value="username" name="username" type="text" placeholder="username" />
      <input @input="handleChange" type="password" name="password" placeholder="password" :value="password" />
      <input @input="handleChange" type="password" name="confirmPassword" placeholder="confirm password" :value="confirmPassword" />
      <button type="submit" :disabled="!username || !password || !confirmPassword || password !== confirmPassword">Sign Up</button>
    </form>
  </div>
</template>

<script>
  import axios from 'axios'
  // const bcrypt = require('bcrypt')
  // const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS)

  export default {
    name: 'RegisterComponent',
    props: {
      user: Object
    },
    data: () => ({
      users: [],
      username: '',
      password: '',
      confirmPassword: ''
    }),
    mounted() {
      this.getUsers()
    },
    methods: {
      async getUsers() {
        const res = await axios.get('http://localhost:8000/users/')
        this.users = res.data
      },
      async createUser(packagedPayload) {
        const res = await axios.post('http://localhost:8000/users/', packagedPayload)
        return res.data
      },
      // async hashPassword(password) {
      //   let hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
      //   return hashedPassword
      // },
      handleChange(e) {
        this[e.target.name] = e.target.value
      },
      async handleSubmit(e) {
        e.preventDefault()
        for (let i = 0; i < this.users.length; i++) {
          if (this.users[i].username === this.username) {
            return window.alert('Username already exists')
          }
        }
        // let passwordDigest = await this.hashPassword(this.password)
        let newUser = await this.createUser({username: this.username, passwordDigest: this.password})
        this.$emit('setUser', newUser)
        return this.$router.push(`/home/${newUser.id}`)
      }
    }
  }
</script>

<style scoped>
input {
    margin: 0 0.5vw;
  }
</style>
<template>
  <div>
    <form v-on:submit="handleSumbit">
      <input @input="handleChange" :value="username" type="text" placeholder="username" name="username" />
      <input @input="handleChange" type="password" placeholder="password" :value="password" name="password" />
      <button type="submit" :disabled="!email || !password">Log In</button>
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
      async handleSubmit(e) {
        e.preventDefault()
        for (let i = 0; i < this.users.length; i++) {
          // let passwordMatch = await bcrypt.compare(this.users[i].passwordDigest, this.password)
          if (this.users[i].username === this.username && this.users[i].passwordDigest === this.password) {
            user = this.users[i]
            break
          }
        }
        window.alert("User doesn't exist")
      }
    }
  }
</script>
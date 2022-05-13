<template>
  <div>
    <h3>Register</h3>
    <form v-on:submit="handleSubmit">
      <input @input="handleChange" :value="username" name="username" type="text" placeholder="username" />
      <input @input="handleChange" :value="image" name="image" type="text" placeholder="upload a profile picture (optional)" />
      <textarea @input="handleChange" :value="bio" name="bio" placeholder="add a bio" />
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
      confirmPassword: '',
      image: '',
      bio: ''
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
        if (this.image === '') {
          this.image = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
        }
        if (this.image.slice(0, 4) !== 'http') {
          return window.alert('Please copy and paste an image address from the internet')
        }
        // let passwordDigest = await this.hashPassword(this.password)
        let newUser = await this.createUser({username: this.username, passwordDigest: this.password, image: this.image, bio: this.bio})
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
form {
  display: flex;
  flex-direction: column;
}
form input, textarea {
  margin: 1vh 0;
  width: 30vw;
}
form button {
  width: 10vw;
  align-self: center;
  
}
</style>
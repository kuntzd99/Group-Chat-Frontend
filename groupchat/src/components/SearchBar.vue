<template>
  <button v-if="!searching" @click="startSearching">Search Users</button>
  <div v-else>
    <button @click="stopSearching">Cancel</button>
    <input type="text" :value="username" @input="handleChange" name="username" />
    <button @click="submitSearch">Search</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SearchBar',
  props: {
    user: {}
  },
  data: () => ({
    users: [],
    username: '',
    searching: false
  }),
  methods: {
    async startSearching() {
      const res = await axios.get('http://localhost:8000/users/')
      this.users = res.data
      this.searching = true
    },
    stopSearching() {
      this.users = []
      this.username = ''
      this.searching = false
    },
    handleChange(e) {
        this[e.target.name] = e.target.value
    },
    submitSearch() {
      for (let i = 0; i < this.users.length; i++) {
        if (this.username === this.users[i].username) {
          return this.$router.push(`/profile/${this.user.id}/${this.users[i].id}`)
        }
      }
      return window.alert("User doesn't exist")
    }
  }
}
</script>

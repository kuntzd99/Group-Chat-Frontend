<template>
  <button v-if="!searching && !addingGroupMember" @click="startSearching">Search Users</button>
  <button class="invitation-button" v-else-if="!searching && addingGroupMember" @click="startSearching">Send Invitation</button>
  <div v-else>
    <button v-if="!addingGroupMember" @click="stopSearching">Cancel</button>
    <input type="text" :value="username" @input="handleChange" name="username" placeholder="Search by username" />
    <button v-if="!addingGroupMember" @click="submitSearch">Go</button>
    <div v-else class="button-container">
      <button @click="stopSearching">Cancel</button>
      <button @click="sendInvitation">Send Invite</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SearchBar',
  props: {
    user: {},
    addingGroupMember: Boolean,
    groupId: Number
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
    },
    async sendInvitation() {
      for (let i = 0; i < this.users.length; i++) {
        if (this.username === this.users[i].username) {
          if (this.$emit('checkUser', this.users[i].id)) {
            await axios.post('http://localhost:8000/invitations/', {user: this.users[i].id, group: this.groupId, sender: this.user.id})
          } else {
            return window.alert("User already in group")
          }
        }
      }
      return window.alert("User doesn't exist")
    }
  }
}
</script>

<style scoped>
  .button-container button{
    margin: 1vh 0.5vw 0 2vw;
  }
  .button-container {
    margin-bottom: 2vh;
  }
  .invitation-button {
    margin-bottom: 2vh;
  }
</style>
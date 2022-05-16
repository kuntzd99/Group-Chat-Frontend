<template>
  <button v-if="!searching && !addingGroupMember" @click="startSearching">Search Users</button>
  <button class="invitation-button" v-else-if="!searching && addingGroupMember" @click="startSearching">Send Invitation</button>
  <div v-else>
    <button v-if="!addingGroupMember" @click="stopSearching">Cancel</button>
    <input type="text" :value="username" @input="handleChange" name="username" placeholder="Search by username" />
    <button v-if="!addingGroupMember" @click="submitSearch">Go</button>
    <div v-else class="button-container">
      <button @click="stopSearching">Cancel</button>
      <button id="send-invite-button" @click="sendInvitation">Send Invite</button>
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
    groupId: Number,
    members: []
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
          return this.$router.push(`/profile/${this.hashUserIdForProfilePage(this.user.id)}/${this.hashProfileIdForProfilePage(this.users[i].id)}`)
        }
      }
      return window.alert("User doesn't exist")
    },
    hashUserIdForProfilePage(integer) {
      return integer * 31 + 19
    },
    hashProfileIdForProfilePage(integer) {
      return integer * 13 - 392
    },
    checkUser(userId) {
      const memberIds = []
      for (let i = 0; i < this.members.length; i++) {
        memberIds.push(this.members[i].id)
      }
      if (memberIds.indexOf(userId) === -1) {
        return true
      } else {
        return false
      }
    },
    async sendInvitation() {
      const invitationsRes = await axios.get('https://boiling-caverns-16943.herokuapp.com/invitations/')
      for (let i = 0; i < this.users.length; i++) {
        if (this.username === this.users[i].username) {
          if (this.checkUser(this.users[i].id)) {
            for (let j = 0; j < invitationsRes.data.length; j++) {
              if (invitationsRes.data[j].user === this.users[i].id && invitationsRes.data[j].group === this.groupId) {
                return window.alert('User already has an invite from this group')
              }
            }
            await axios.post('https://boiling-caverns-16943.herokuapp.com/invitations/', {user: this.users[i].id, group: this.groupId, sender: this.user.id})
            this.username = ''
            return this.searching = false
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
  input {
    padding-right: 2vw;
    margin-left: 1vw;
  }
</style>
<template>
  <div>
    <p>Invitation for group {{ group.name }} from <button class="username" @click="goToSenderProfile">{{ sender.username }}</button></p>
    <div>
      <button @click="decline">Decline</button>
      <button @click="accept">Accept</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'InvitationCard',
  props: {
    user: {},
    group: {}
  },
  data: () => ({
    sender: {}
  }),
  async mounted() {
    this.getSender()
  },
  methods: {
    async getSender() {
      const res = await axios.get(`https://boiling-caverns-16943.herokuapp.com/users/${this.group.senderId}`)
      this.sender = res.data
    },
    async accept() {
      await axios.post('https://boiling-caverns-16943.herokuapp.com/memberships/', {group: this.group.id, user: this.user.id})
      await axios.delete(`https://boiling-caverns-16943.herokuapp.com/invitations/${this.group.invitationId}`)
      await axios.put(`https://boiling-caverns-16943.herokuapp.com/groups/${this.group.id}`, 
        {
          name: this.group.name, 
          color: this.group.color,
          membersCount: this.group.membersCount + 1,
          creator: this.group.creator,
          image: this.group.image
        }
      )
      this.$emit('getGroups')
      this.$emit('getInvitationGroups')
    },
    async decline() {
      await axios.delete(`https://boiling-caverns-16943.herokuapp.com/invitations/${this.group.invitationId}`)
      this.$emit('getInvitationGroups')
    },
    goToSenderProfile() {
        this.$router.push(`/profile/${this.hashUserIdForProfilePage(this.user.id)}/${this.hashProfileIdForProfilePage(this.sender.id)}`)
    },
    hashUserIdForProfilePage(integer) {
      return integer * 31 + 19
    },
    hashProfileIdForProfilePage(integer) {
    return integer * 13 - 392
    },
  }
}
</script>

<style scoped>
.username {
  border-style: none;
  background-color: white;
  color: purple;
  font-size: 1em;
  margin: 0;
  padding: 0;
}
.username:hover {
  color: cyan;
}
</style>
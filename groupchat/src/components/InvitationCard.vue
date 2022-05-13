<template>
  <div>
    <p>Invitation for group {{ group.name }} from <button @click="goToSenderProfile">{{ sender.name }}</button></p>
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
      const res = await axios.get(`http://localhost:8000/users/${this.group.senderId}`)
      this.sender = res.data
    },
    async accept() {
      await axios.post('http://localhost:8000/memberships/', {group: this.group.id, user: this.user.id})
      await axios.delete(`http://localhost:8000/invitations/${this.group.invitationId}`)
      this.$emit('getInvitationGroups')
    },
    async decline() {
      await axios.delete(`http://localhost:8000/invitations/${this.group.invitationId}`) 
    }
  }
}
</script>

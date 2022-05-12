<template>
  <div id="grouppage">
    <div id="title">
      <h1>{{ group.name }}</h1>
      <button v-if="group.creator === user.id" @click="deleteGroup">Delete Group</button>
    </div>
    <div class="messages-box">
      <MessageCard v-for="message in messages" :key="message.id" :message="message" :user="user" @getMessages="getMessages" />
    </div>
    <form @submit="handleSubmit">
      <textarea @input="handleChange" placeholder="Enter message here" :value="message" name="message" />
      <button type="submit" :disabled="!message">Send</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import MessageCard from '../components/MessageCard.vue'

export default {
  name: 'GroupPage',
  components: {
    MessageCard
  },
  data: () => ({
    user: {},
    group: {},
    messages: [],
    members: [],
    message: ''
  }),
  async mounted() {
    await this.getUser()
    await this.getGroup()
    await this.getMessages()
    await this.getMembers()
  },
  methods: {
    async getUser() {
      const res = await axios.get(`http://localhost:8000/users/${this.$route.params.user_id}`)
      this.user = res.data
    },
    async getGroup() {
      const res = await axios.get(`http://localhost:8000/groups/${this.$route.params.group_id}`)
      this.group = res.data
    },
    async getMessages() {
      this.messages = []
      const res = await axios.get('http://localhost:8000/messages/')
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].group === this.group.id) {
          this.messages.push(res.data[i])
        }
      }
    },
    async getMembers() {
      const userIds = []
      const res = await axios.get('http://localhost:8000/memberships/')
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].group === this.group.id) {
          userIds.push(res.data[i].user)
        }
      }
      for (let i = 0; i < userIds.length; i++) {
        let userRes = await axios.get(`http://localhost:8000/users/${userIds[i]}`)
        this.members.push(userRes.data)
      }
    },
    async createMessage(packagedPayload) {
      const res = await axios.post('http://localhost:8000/messages/', packagedPayload)
      return res.data
    },
    handleChange(e) {
      this[e.target.name] = e.target.value
    },
    async handleSubmit(e) {
      e.preventDefault()
      await this.createMessage(
        {
        message: this.message, 
        groupName: this.group.name, 
        senderUsername: this.user.username, 
        group: this.group.id, 
        sender: this.user.id
        }
      )
      this.message = ''
      await this.getMessages()
    },
    async deleteGroup() {
      const res = await axios.get('http://localhost:8000/memberships/')
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].group === this.group.id) {
          await axios.delete(`http://localhost:8000/memberships/${res.data[i].id}`)
        }
      }
      await axios.delete(`http://localhost:8000/groups/${this.group.id}`)
      return this.$router.push(`/home/${this.user.id}`)
    }
  }
}
</script>

<style scoped>
#title {
  display: flex;
  text-align: center;
}
#title button {
  max-height: 3vh;
  justify-self: center;
  align-self: center;
  margin-left: 1vw;
}
#grouppage {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}
textarea {
  margin-right: 1vw;
}
</style>
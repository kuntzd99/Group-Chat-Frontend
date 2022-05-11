<template>
  <div>
    <div class="messages-box">
      <Message v-for="message in messages" :key="message.id" :message="message" />
    </div>
    <textarea placeholder="Enter message here" />
  </div>
</template>

<script>
import Message from '../components/Message.vue'

export default {
  name: 'GroupPage',
  components: {
    Message
  },
  data: () => ({
    user: {},
    group: {},
    messages: [],
    message: ''
  }),
  mounted: async function() {
    await this.getUser
    await this.getGroup
    await this.getMessages
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
    async getMessages() {}
  }
}
</script>

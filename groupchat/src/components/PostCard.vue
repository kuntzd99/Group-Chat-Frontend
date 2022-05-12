<template>
  <div class="messages-box">
    <PostMessage v-for="message in messages" :key="message.id" :message="message" :user="user" :post="post" />
  </div>
</template>

<script>
  import axios from 'axios'
  import PostMessage from './PostMessage'

  export default {
    name: 'GroupCard',
    props: {
      user: {},
      post: {}
    },
    components: {
      PostMessage
    },
    data: () => ({
      messages: []
    }),
    async mounted() {
      await this.getMessages()
    },
    methods: {
      async getMessages() {
        const messageIds = []
        const res = await axios.get('http://localhost:8000/postmessages/')
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].post === this.post.id) {
            messageIds.push(res.data[i].message)
          }
        }
        for (let i = 0; i < messageIds.length; i++) {
          const messageRes = await axios.get(`http://localhost:8000/messages/${messageIds[i]}`)
          this.messages.push(messageRes.data)
        }
      }
    }
  }
</script>

<style scoped>
.messages-box {
  display: flex;
  flex-direction: column;
  border-style: solid;
  border-radius: 10%;
  width: 95vw;
  margin: 5vh 0;
  min-height: 20vh;
}
</style>

<template>
  <div v-if="message.user === user.id" class="user-message">
    <h6 class="username">{{ message.senderUsername }}</h6>
    <p class="message">{{ message.message }}</p>
    <div class="reactions">
      <div @click="() => addReaction('like')" class="reaction">{{ numLikes }} &#128077;</div>
    </div>
  </div>
  <div v-else class="user-message">
    <h6 class="username">{{ message.senderUsername }}</h6>
    <p class="message">{{ message.message }}</p>
    <div class="reactions">
      <div @click="() => addReaction('like')" class="reaction">{{ numLikes }} &#128077;</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MessageCard',
  props: {
    message: {},
    user: {}
  },
  data: () => ({
    reactions: [],
    numLikes: 0
  }),
  async mounted() {
    await this.getReactions()
  },
  methods: {
    async getReactions() {
      const res = await axios.get('http://localhost:8000/reactions/')
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].message === this.message.id) {
          this.reactions.push(res.data[i])
          if (res.data[i].type === 'like') {
            this.numLikes++
          }
        }
      }
    },
    async addReaction(type) {
      await axios.post('http://localhost:8000/reactions/', {type: type, user: this.user.id, username: this.user.username, message: this.message.id})
      await this.getReactions()
    },
    async removeReaction(reactionId) {
      await axios.delete(`http://localhost:8000/reactions/${reactionId}`)
      await this.getReactions()
    }
  }
}
</script>

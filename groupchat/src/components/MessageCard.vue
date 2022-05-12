<template>
  <div v-if="message.sender == user.id && !posting" class="user-message">
    <h6 class="username">{{ message.senderUsername }}</h6>
    <p class="message">{{ message.message }}</p>
    <div class="reactions">
      <div v-if="!liked" @click="() => addReaction('like')" class="reaction">{{ numLikes }} &#128077;</div>
      <div v-else @click="() => removeReaction(likedReactionId)" class="reaction">{{ numLikes }} &#128077;</div>
    </div>
    <button @click="removeMessage" id="delete">Delete message</button>
    <p>{{ new Date(message.time) }}</p>
  </div>
  <div v-else-if="message.sender == user.id && posting && !clicked" @click="addMessage" class="user-message">
    <h6 class="username">{{ message.senderUsername }}</h6>
    <p class="message">{{ message.message }}</p>
    <div class="reactions">
      <div v-if="!liked" class="reaction">{{ numLikes }} &#128077;</div>
      <div v-else class="reaction">{{ numLikes }} &#128077;</div>
    </div>
    <p>{{ new Date(message.time) }}</p>
  </div>
  <div v-else-if="message.sender == user.id && posting && clicked" @click="removeFromPostMessages" class="user-message clicked">
    <h6 class="username">{{ message.senderUsername }}</h6>
    <p class="message">{{ message.message }}</p>
    <div class="reactions">
      <div v-if="!liked" class="reaction">{{ numLikes }} &#128077;</div>
      <div v-else class="reaction">{{ numLikes }} &#128077;</div>
    </div>
    <p>{{ new Date(message.time) }}</p>
  </div>
  <div v-else-if="posting && clicked" @click="removeFromPostMessages" class="nonuser-message clicked">
    <h6 class="username">{{ message.senderUsername }}</h6>
    <p class="message">{{ message.message }}</p>
    <div class="reactions">
      <div v-if="!liked" class="reaction">{{ numLikes }} &#128077;</div>
      <div v-else class="reaction">{{ numLikes }} &#128077;</div>
    </div>
    <p>{{ new Date(message.time) }}</p>
  </div>
  <div v-else-if="posting && !clicked" @click="addMessage" class="nonuser-message">
    <h6 class="username">{{ message.senderUsername }}</h6>
    <p class="message">{{ message.message }}</p>
    <div class="reactions">
      <div v-if="!liked" class="reaction">{{ numLikes }} &#128077;</div>
      <div v-else class="reaction">{{ numLikes }} &#128077;</div>
    </div>
    <p>{{ new Date(message.time) }}</p>
  </div>
  <div v-else class="nonuser-message">
    <h6 class="username">{{ message.senderUsername }}</h6>
    <p class="message">{{ message.message }}</p>
    <div class="reactions">
      <div v-if="!liked" @click="() => addReaction('like')" class="reaction">{{ numLikes }} &#128077;</div>
      <div v-else @click="() => removeReaction(likedReactionId)" class="reaction">{{ numLikes }} &#128077;</div>
    </div>
    <p>{{ new Date(message.time) }}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MessageCard',
  props: {
    message: {},
    user: {},
    group: {},
    posting: Boolean
  },
  data: () => ({
    reactions: [],
    numLikes: 0,
    liked: false,
    likedReactionId: -1,
    clicked: false
  }),
  async mounted() {
    await this.getReactions()
  },
  methods: {
    async getReactions() {
      this.numLikes = 0
      const res = await axios.get('http://localhost:8000/reactions/')
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].message === this.message.id) {
          this.reactions.push(res.data[i])
          if (res.data[i].type === 'like') {
            this.numLikes++
            if (res.data[i].user === this.user.id) {
              this.liked = true
              this.likedReactionId = res.data[i].id
            }
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
      this.liked = false
      this.likedReactionId = -1
      await this.getReactions()
    },
    async removeMessage() {
      const res = await axios.get('http://localhost:8000/reactions/')
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].message === this.message.id) {
          await axios.delete(`http://localhost:8000/reactions/${res.data[i].id}`)
        }
      }
      await axios.delete(`http://localhost:8000/messages/${this.message.id}`)
      this.$emit('getMessages')
    },
    toggleClicked() {
      this.clicked = !this.clicked
    },
    addMessage() {
      this.$emit('addPostMessage', this.message)
      this.toggleClicked()
    },
    removeFromPostMessages() {
      this.$emit('removePostMessage', this.message)
      this.toggleClicked()
    }
  }
}
</script>

<style scoped>
.user-message {
  border-style: solid;
  border-radius: 20%;
  margin: 2vh 0;
  width: 50vw;
  align-self: flex-end;
  background-color: white;
}
.nonuser-message {
  border-style: solid;
  border-radius: 20%;
  margin: 2vh 0;
  align-self: flex-start;
  background-color: white
}
#delete {
  margin-bottom: 1vh;
}
.clicked {
  border-style: solid;
  border-color: yellow;
}
</style>
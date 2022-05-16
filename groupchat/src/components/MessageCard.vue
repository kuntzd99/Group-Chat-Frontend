<template>
  <div v-if="message.sender == user.id && !posting" class="user-message">
    <MessageDetails v-if="showingDetail" :likers="likers" :dislikers="dislikers" :laughers="laughers" :user="this.user" />
    <div class="message-body">
      <div class="username-with-button">
        <button @click="removeMessage">Delete</button>
        <h6>{{ message.senderUsername }}</h6>
      </div>
      <div class="message">
        <p>{{ message.message }}</p>
      </div>
      <div class="reactions">
        <div v-if="!liked" @click="() => addReaction('like')" class="reaction">{{ message.likes }} &#128077;</div>
        <div v-else @click="() => removeLike(likedReactionId)" class="reaction">{{ message.likes }} &#128077;</div>
        <div v-if="!disliked" @click="() => addReaction('dislike')" class="reaction">{{ message.dislikes }} &#128078;</div>
        <div v-else @click="() => removeDislike(dislikedReactionId)" class="reaction">{{ message.dislikes }} &#128078;</div>
        <div v-if="!laughing" @click="() => addReaction('laugh')" class="reaction">{{ message.laughs }} &#128514;</div>
        <div v-else @click="() => removeLaugh(laughingReactionId)" class="reaction">{{ message.laughs }} &#128514;</div>
        <button :style="{'border-color': group.color}" class="view-message" @click="toggleShowingDetail">View</button>
      </div>
    </div>
    <p>{{ message.time }}</p>
  </div>
  <div v-else-if="message.sender == user.id && posting && !clicked" @click="addMessage" class="user-message">
    <div class="message-body">
      <h6 class="username">{{ message.senderUsername }}</h6>
      <div class="message">
          <p>{{ message.message }}</p>
      </div>
      <div class="reactions">
        <div class="reaction">{{ message.likes }} &#128077;</div>
        <div class="reaction">{{ message.dislikes }} &#128078;</div>
        <div class="reaction">{{ message.laughs }} &#128514;</div>
      </div>
    </div>
    <p>{{ message.time }}</p>
  </div>
  <div v-else-if="message.sender == user.id && posting && clicked" @click="removeFromPostMessages" class="user-message">
    <div class="message-body clicked">
      <h6 class="username">{{ message.senderUsername }}</h6>
      <div class="message">
          <p>{{ message.message }}</p>
      </div>
      <div class="reactions">
        <div class="reaction">{{ message.likes }} &#128077;</div>
        <div class="reaction">{{ message.dislikes }} &#128078;</div>
        <div class="reaction">{{ message.laughs }} &#128514;</div>
      </div>
    </div>
    <p>{{ message.time }}</p>
  </div>
  <div v-else-if="posting && clicked" @click="removeFromPostMessages" class="nonuser-message">
    <div class="message-body clicked">
      <h6 class="nonuser-username">{{ message.senderUsername }}</h6>
      <div class="message">
          <p>{{ message.message }}</p>
      </div>
      <div class="reactions">
        <div class="reaction">{{ message.likes }} &#128077;</div>
        <div class="reaction">{{ message.dislikes }} &#128078;</div>
        <div class="reaction">{{ message.laughs }} &#128514;</div>
      </div>
    </div>
    <p>{{ message.time }}</p>
  </div>
  <div v-else-if="posting && !clicked" @click="addMessage" class="nonuser-message">
    <div class="message-body">
      <h6 class="nonuser-username">{{ message.senderUsername }}</h6>
      <div class="message">
          <p>{{ message.message }}</p>
      </div>
      <div class="reactions">
        <div class="reaction">{{ message.likes }} &#128077;</div>
        <div class="reaction">{{ message.dislikes }} &#128078;</div>
        <div class="reaction">{{ message.laughs }} &#128514;</div>
      </div>
    </div>
    <p>{{ message.time }}</p>
  </div>
  <div v-else class="nonuser-message">
    <MessageDetails v-if="showingDetail" :likers="likers" :dislikers="dislikers" :laughers="laughers" :user="this.user" />
    <div class="message-body">
      <h6 class="nonuser-username">{{ message.senderUsername }}</h6>
      <div class="message">
        <p>{{ message.message }}</p>
      </div>
      <div class="reactions">
        <div v-if="!liked" @click="() => addReaction('like')" class="reaction">{{ message.likes }} &#128077;</div>
        <div v-else @click="() => removeLike(likedReactionId)" class="reaction">{{ message.likes }} &#128077;</div>
        <div v-if="!disliked" @click="() => addReaction('dislike')" class="reaction">{{ message.dislikes }} &#128078;</div>
        <div v-else @click="() => removeDislike(dislikedReactionId)" class="reaction">{{ message.dislikes }} &#128078;</div>
        <div v-if="!laughing" @click="() => addReaction('laugh')" class="reaction">{{ message.laughs }} &#128514;</div>
        <div v-else @click="() => removeLaugh(laughingReactionId)" class="reaction">{{ message.laughs }} &#128514;</div>
        <button :style="{'border-color': group.color}" class="view-message" @click="toggleShowingDetail">View</button>
      </div>
    </div>
    <p>{{ message.time }}</p>
  </div>
</template>

<script>
import axios from 'axios'
import MessageDetails from './MessageDetails.vue'

export default {
  name: 'MessageCard',
  props: {
    message: {},
    user: {},
    group: {},
    posting: Boolean
  },
  components: {
    MessageDetails
  },
  data: () => ({
    liked: false,
    disliked: false,
    laughing: false,
    likedReactionId: -1,
    dislikedReactionId: -1,
    laughingReactionId: -1,
    clicked: false,
    likers: [],
    dislikers: [],
    laughers: [],
    showingDetail: false
  }),
  async mounted() {
    await this.getReactions()
  },
  methods: {
    async getReactions() {
      let numLikes = 0
      let numDislikes = 0
      let numLaughs = 0
      this.likers = []
      this.dislikers = []
      this.laughers = []
      const res = await axios.get('http://localhost:8000/reactions/')
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].message === this.message.id) {
          if (res.data[i].type === 'like') {
            numLikes++
            let reactionRes = await axios.get(`http://localhost:8000/users/${res.data[i].user}`)
            this.likers.push(reactionRes.data)
            if (res.data[i].user === this.user.id) {
              this.liked = true
              this.likedReactionId = res.data[i].id
            }
          }
          else if (res.data[i].type === 'dislike') {
            numDislikes++
            let reactionRes = await axios.get(`http://localhost:8000/users/${res.data[i].user}`)
            this.dislikers.push(reactionRes.data)
            if (res.data[i].user === this.user.id) {
              this.disliked = true
              this.dislikedReactionId = res.data[i].id
            }
          }
          else if (res.data[i].type === 'laugh') {
            numLaughs++
            let reactionRes = await axios.get(`http://localhost:8000/users/${res.data[i].user}`)
            this.laughers.push(reactionRes.data)
            if (res.data[i].user === this.user.id) {
              this.laughing = true
              this.laughingReactionId = res.data[i].id
            }
          }
        }
      }
      const newMessageRes = await axios.put(`http://localhost:8000/messages/${this.message.id}`, {
        message: this.message.message,
        groupName: this.message.groupName,
        senderUsername: this.message.senderUsername,
        group: this.message.group,
        sender: this.message.sender,
        likes: numLikes,
        dislikes: numDislikes,
        laughs: numLaughs,
        time: this.message.time
      })
      this.$emit('updateMessage', this.message.id, newMessageRes.data)
    },
    async addReaction(type) {
      await axios.post('http://localhost:8000/reactions/', {type: type, user: this.user.id, username: this.user.username, message: this.message.id})
      await this.getReactions()
    },
    async removeLike(reactionId) {
      await axios.delete(`http://localhost:8000/reactions/${reactionId}`)
      this.liked = false
      this.likedReactionId = -1
      await this.getReactions()
    },
    async removeDislike(reactionId) {
      await axios.delete(`http://localhost:8000/reactions/${reactionId}`)
      this.disliked = false
      this.dislikedReactionId = -1
      await this.getReactions()
    },
    async removeLaugh(reactionId) {
      await axios.delete(`http://localhost:8000/reactions/${reactionId}`)
      this.laughing = false
      this.laughingReactionId = -1
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
    },
    toggleShowingDetail() {
      this.showingDetail = !this.showingDetail
    },
    formatDate(date) {
      return date
    } 
  }
}
</script>

<style scoped>
.message-body {
  background-color: white;
  border-style: solid;
}
.user-message {
  width: 45vw;
  height: auto;
  align-self: flex-end;
  margin: 2vh 1vw 0.5vh 0;
}
.nonuser-message {
  width: 45vw;
  height: auto;
  margin: 2vh 0 0 1vw;
  align-self: flex-start;
}
.clicked {
  border-style: solid;
  border-color: yellow;
}
.reactions {
  display: flex;
  justify-content: center;
  padding-bottom: 0.5vh;
}
.reaction {
  border-style: solid;
  margin: 0 1vw;
  padding: 0.25vh 0.5vw;
  border-radius: 50%;
  border-width: 1px;
}
.reaction:hover {
  border-color: yellow;
}
.nonuser-username {
  display: flex;
  justify-content: flex-start;
  margin: 1vh 0 0 1vw;
  font-size: 1em;
  align-self: center;
}
.username {
  display: flex;
  justify-content: flex-end;
  margin: 1vh 0 0 1vw;
  font-size: 1em;
  align-self: center;
  margin-right: 1vw;
}
.username-with-button {
  display: flex;
  justify-content: flex-end;
  margin-right: 2vw;
  height: 3vh;
}
.username-with-button button {
  margin-right: 2vw;
  height: 2vh;
  align-self: center;
}

.username-with-button h6 {
  font-size: 1em;
  margin: 0;
  align-self: center;
}
.message p {
  display: flex;
  justify-content: flex-start;
  margin-left: 1vw;
  flex-wrap: wrap;
  width: 40vw;
  text-align: left;
  overflow-wrap: break-word;
  word-break: break-all;
}
.view-message {
  height: 2vh;
  align-self: center;
  background-color: white;
  border-radius: 0;
  border-width: 2px;
}
</style>
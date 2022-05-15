<template>
  <div v-if="comment.user === user.id" class="user-message">
    <!-- <MessageDetails v-if="showingDetail" :likers="likers" :dislikers="dislikers" :laughers="laughers" :user="this.user" /> -->
    <div class="message-body">
      <div class="username-with-button">
        <button @click="removeComment">Delete</button>
        <h6>{{ comment.username }}</h6>
      </div>
      <div class="message">
        <p>{{ comment.comment }}</p>
      </div>
      <div class="reactions">
        <div v-if="!liked" @click="() => addReaction('like')" class="reaction">{{ comment.likes }} &#128077;</div>
        <div v-else @click="() => removeLike(likedReactionId)" class="reaction">{{ comment.likes }} &#128077;</div>
        <div v-if="!disliked" @click="() => addReaction('dislike')" class="reaction">{{ comment.dislikes }} &#128078;</div>
        <div v-else @click="() => removeDislike(dislikedReactionId)" class="reaction">{{ comment.dislikes }} &#128078;</div>
        <div v-if="!laughing" @click="() => addReaction('laugh')" class="reaction">{{ comment.laughs }} &#128514;</div>
        <div v-else @click="() => removeLaugh(laughingReactionId)" class="reaction">{{ comment.laughs }} &#128514;</div>
        <!-- <button :style="{'border-color': group.color}" class="view-message" @click="toggleShowingDetail">View</button> -->
      </div>
    </div>
    <p>{{ new Date(comment.time) }}</p>
  </div>
  <div v-else class="nonuser-message">
    <!-- <MessageDetails v-if="showingDetail" :likers="likers" :dislikers="dislikers" :laughers="laughers" :user="this.user" /> -->
    <div class="message-body">
      <h6 class="nonuser-username">{{ comment.username }}</h6>
      <div class="message">
        <p>{{ comment.comment }}</p>
      </div>
      <div class="reactions">
        <div v-if="!liked" @click="() => addReaction('like')" class="reaction">{{ comment.likes }} &#128077;</div>
        <div v-else @click="() => removeLike(likedReactionId)" class="reaction">{{ comment.likes }} &#128077;</div>
        <div v-if="!disliked" @click="() => addReaction('dislike')" class="reaction">{{ comment.dislikes }} &#128078;</div>
        <div v-else @click="() => removeDislike(dislikedReactionId)" class="reaction">{{ comment.dislikes }} &#128078;</div>
        <div v-if="!laughing" @click="() => addReaction('laugh')" class="reaction">{{ comment.laughs }} &#128514;</div>
        <div v-else @click="() => removeLaugh(laughingReactionId)" class="reaction">{{ comment.laughs }} &#128514;</div>
        <!-- <button :style="{'border-color': group.color}" class="view-message" @click="toggleShowingDetail">View</button> -->
      </div>
    </div>
    <p>{{ new Date(comment.time) }}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CommentMessage',
  props: {
    user: {},
    comment: {}
  },
  data: () => ({
    reactionIds: [],
    liked: false,
    disliked: false,
    laughing: false,
    likedReactionId: -1,
    dislikedReactionId: -1,
    laughingReactionId: -1,
    likers: [],
    dislikers: [],
    laughers: []
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
      const res = await axios.get('http://localhost:8000/commentreactions/')
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].comment === this.comment.id) {
          this.reactionIds.push(res.data[i].id)
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
      const newCommentRes = await axios.put(`http://localhost:8000/comments/${this.comment.id}`, {
        post: this.comment.post,
        comment: this.comment.comment,
        user: this.comment.user,
        username: this.comment.username,
        likes: numLikes,
        dislikes: numDislikes,
        laughs: numLaughs,
        time: this.comment.time
      })
      this.$emit('updateComment', this.comment.id, newCommentRes.data)
    },
    async removeComment() {
      const res = await axios.get('http://localhost:8000/commentreactions/')
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].comment === this.comment.id) {
          await axios.delete(`http://localhost:8000/commentreactions/${res.data[i].id}`)
        }
      }
      await axios.delete(`http://localhost:8000/comments/${this.comment.id}`)
      this.$emit('getComments')
    },
    async addReaction(type) {
      await axios.post('http://localhost:8000/commentreactions/', {type: type, user: this.user.id, username: this.user.username, comment: this.comment.id})
      await this.getReactions()
    },
    async removeLike(reactionId) {
      await axios.delete(`http://localhost:8000/commentreactions/${reactionId}`)
      this.liked = false
      this.likedReactionId = -1
      await this.getReactions()
    },
    async removeDislike(reactionId) {
      await axios.delete(`http://localhost:8000/commentreactions/${reactionId}`)
      this.disliked = false
      this.dislikedReactionId = -1
      await this.getReactions()
    },
    async removeLaugh(reactionId) {
      await axios.delete(`http://localhost:8000/commentreactions/${reactionId}`)
      this.laughing = false
      this.laughingReactionId = -1
      await this.getReactions()
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
  margin: 2vh 0 0 1vw;
  align-self: flex-start;
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
</style>
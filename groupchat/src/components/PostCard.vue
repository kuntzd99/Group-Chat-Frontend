<template>
<div>
  <div @click="goToPostPage" class="messages-box" :style="{'background-color': post.groupColor}">
    <PostMessage :postPage="false" v-for="message in messages" :key="message.id" :message="message" :user="user" :post="post" />
  </div>
  <p>{{ post.caption }}</p>
  <div class="reactions">
    <button v-if="user.id === post.user" @click="deletePost">Delete</button>
    <div v-if="!liked" @click="() => addReaction('like')" class="reaction">{{ numLikes }} &#128077;</div>
    <div v-else @click="() => removeLike(likedReactionId)" class="reaction">{{ numLikes }} &#128077;</div>
    <div v-if="!disliked" @click="() => addReaction('dislike')" class="reaction">{{ numDislikes }} &#128078;</div>
    <div v-else @click="() => removeDislike(dislikedReactionId)" class="reaction">{{ numDislikes }} &#128078;</div>
    <div v-if="!laughing" @click="() => addReaction('laugh')" class="reaction">{{ numLaughs }} &#128514;</div>
    <div v-else @click="() => removeLaugh(laughingReactionId)" class="reaction">{{ numLaughs }} &#128514;</div>
  </div>
</div>
</template>

<script>
  import axios from 'axios'
  import PostMessage from './PostMessage'

  export default {
    name: 'PostCard',
    props: {
      user: {},
      post: {}
    },
    components: {
      PostMessage
    },
    data: () => ({
      messages: [],
      postMessageIds: []
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
            this.postMessageIds.push(res.data[i].id)
          }
        }
        for (let i = 0; i < messageIds.length; i++) {
          const messageRes = await axios.get(`http://localhost:8000/messages/${messageIds[i]}`)
          this.messages.push(messageRes.data)
        }
      },
      async deletePost() {
        for (let i = 0; i < this.postMessageIds.length; i++) {
          await axios.delete(`http://localhost:8000/postmessages/${this.postMessageIds[i]}`)
        }
        await axios.delete(`http://localhost:8000/posts/${this.post.id}`)
        this.$emit('getPosts')
      },
      goToPostPage() {
        this.$router.push(`/posts/${this.user.id}/${this.post.id}`)
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
  width: 45vw;
  height: 35vh;
  margin: 5vh 0 0 0;
  min-height: 20vh;
  --webkit-overflow-scrolling: touch;
  overflow-y: auto;
}
.messages-box:hover {
  border-color: yellow;
}
.reactions {
  display: flex;
  justify-content: space-evenly;
  margin: 0;
}
.reaction {
  height: 50%;
  width: 50%;
}
.reactions button {
  margin-left: 1vw;
}
</style>

<template>
<div>
  <div @click="goToPostPage" class="messages-box" :style="{'background-color': post.groupColor}">
    <PostMessage :postPage="false" v-for="message in messages" :key="message.id" :message="message" :user="user" :post="post" />
  </div>
  <p>{{ post.caption }}</p>
  <div class="reactions">
    <div class="reaction">{{ post.likes }} &#128077;</div>
    <div class="reaction">{{ post.laughs }} &#128514;</div>
    <div class="reaction">{{ post.comments }} &#128172;</div>
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
      postMessageIds: [],
      postReactionIds: []
    }),
    async mounted() {
      await this.getMessages()
      await this.getPostReactions()
      await this.getNumComments()
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
        let sorted = []
        for (let i = 0; i < messageIds.length; i++) {
          const messageRes = await axios.get(`http://localhost:8000/messages/${messageIds[i]}`)
          sorted.push(messageRes.data)
        }
        sorted = sorted.sort((a, b) => {
          return new Date(a.time) - new Date(b.time)
        })
        this.messages = sorted
      },
      async getPostReactions() {
        let numLikes = 0
        let numLaughs = 0
        const res = await axios.get('http://localhost:8000/postreactions/')
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].post === this.post.id) {
            this.postReactionIds.push(res.data[i].id)
            if (res.data[i].type === 'like') {
              numLikes++
            } else if (res.data[i].type === 'laugh') {
              numLaughs++
            }
          }
        }
        await axios.put(`http://localhost:8000/posts/${this.post.id}`, {
          user: this.post.user,
          caption: this.post.caption,
          groupColor: this.post.groupColor,
          likes: numLikes,
          laughs: numLaughs,
          comments: this.post.comments,
          time: this.post.time
        })
      },
      async getNumComments() {
        let numComments = 0
        const res = await axios.get('http://localhost:8000/comments/')
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].post === this.post.id) {
            numComments++
          }
        }
        await axios.put(`http://localhost:8000/posts/${this.post.id}`, {
          user: this.post.user,
          caption: this.post.caption,
          groupColor: this.post.groupColor,
          likes: this.post.likes,
          laughs: this.post.laughs,
          comments: numComments,
          time: this.post.time
        })
      },
      async deletePost() {
        for (let i = 0; i < this.postMessageIds.length; i++) {
          await axios.delete(`http://localhost:8000/postmessages/${this.postMessageIds[i]}`)
        }
        for (let i = 0; i < this.postReactionIds.length; i++) {
          await axios.delete(`http://localhost:8000/postreactions/${this.postReactionIds[i]}`)
        }
        await axios.delete(`http://localhost:8000/posts/${this.post.id}`)
        this.$emit('getPosts')
      },
      goToPostPage() {
        this.$router.push(`/posts/${this.hashUserIdForPostPage(this.user.id)}/${this.post.id}`)
      },
      hashUserIdForPostPage(integer) {
      return integer * 75 - 12
    },
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
  margin: 1vh 0 0 0;
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

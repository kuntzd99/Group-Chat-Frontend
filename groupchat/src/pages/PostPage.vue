<template>
  <div>
    <div class="header">
      <button @click="goHome">Home</button>
      <SearchBar :user="user" :groupId="-1" :addingGroupMember="false" />
      <button @click="logout">Log Out</button>
    </div>
    <div class="post-page">
      <h1>Post:</h1>
      <div class="post" :style="{'background-color': post.groupColor}">
        <PostMessage v-for="message in messages" :key="message.id" :message="message" :user="user" :post="post" :postPage="true" />
        <!-- <div class="reactions">
          <div v-if="!liked" @click="() => addReaction('like')" class="reaction">{{ numLikes }} &#128077;</div>
          <div v-else @click="() => removeLike(likedReactionId)" class="reaction">{{ numLikes }} &#128077;</div>
          <div v-if="!disliked" @click="() => addReaction('dislike')" class="reaction">{{ numDislikes }} &#128078;</div>
          <div v-else @click="() => removeDislike(dislikedReactionId)" class="reaction">{{ numDislikes }} &#128078;</div>
          <div v-if="!laughing" @click="() => addReaction('laugh')" class="reaction">{{ numLaughs }} &#128514;</div>
          <div v-else @click="() => removeLaugh(laughingReactionId)" class="reaction">{{ numLaughs }} &#128514;</div>
        </div> -->
      </div>
      <h3>Comments</h3>
      <div>
        Sort by 
        <select @change="handleSortChange">
          <option value="time">Time</option>
          <option value="likes">&#128077;</option>
          <option value="dislikes">&#128078;</option>
          <option value="laughs">&#128514;</option>
        </select>
        <button @click="sort">Sort</button>
      </div>
      <div class="post">
        <CommentMessage 
        v-for="comment in comments" 
        :key="comment.id" 
        :comment="comment" 
        :user="user" 
        />
      </div>
      <form @submit="handleSubmit">
          <textarea @input="handleChange" placeholder="Enter comment here" :value="comment" name="comment" />
          <button type="submit" :disabled="!comment">Send</button>
       </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import SearchBar from '../components/SearchBar.vue'
import PostMessage from '../components/PostMessage.vue'
import CommentMessage from '../components/CommentMessage.vue'

export default {
  name: 'PostPage',
  components: {
    SearchBar,
    PostMessage,
    CommentMessage
  },
  data: () => ({
    user: {},
    post: {},
    postMessageIds: [],
    messages: [],
    comments: [],
    comment: '',
    sorting: 'likes'
  }),
  async mounted() {
    await this.getUser()
    await this.getPost()
    await this.getMessages()
    await this.getComments()
  },
  methods: {
    async getUser() {
      const res = await axios.get(`http://localhost:8000/users/${this.$route.params.user_id}`)
      this.user = res.data
    },
    async getPost() {
      const res = await axios.get(`http://localhost:8000/posts/${this.$route.params.post_id}`)
      this.post = res.data
    },
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
    async getComments() {
      this.comments = []
      const res = await axios.get('http://localhost:8000/comments/')
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].post === this.post.id) {
          this.comments.push(res.data[i])
        }
      }
    },
    async createComment(packagedPayload) {
      const res = await axios.post('http://localhost:8000/comments/', packagedPayload)
      return res.data
    },
    handleChange(e) {
      this[e.target.name] = e.target.value
    },
    async handleSubmit(e) {
      e.preventDefault()
      await this.createComment(
        {
        comment: this.comment, 
        username: this.user.username, 
        post: this.post.id, 
        user: this.user.id
        }
      )
      this.comment = ''
      await this.getComments()
    },
    goHome() {
      this.$router.push(`/home/${this.user.id}`)
    },
    handleSortChange(e) {
      e.preventDefault()
      this.sorting = e.target.value
    },
    // sort() {
    //   let sorted = this.comments
    //   if (this.sorting === 'time') {
        
    //   } else {
    //     const res = await axios.get('http://localhost:8000/commentreactions')
    //     if (this.sorting === 'likes') {
    //       for (let i = 0; i < sorted.length; i++) {
    //         sorted[i]['likes'] = 0
    //         for (let j = 0; j < res.data.length; j++) {
    //           if (res.data[j].comment === sorted[i].id) {
    //             sorted[i]['likes'] = sorted[i]['likes'] + 1
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
  }
}
</script>

<style scoped>
.profile {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.header {
  background-color: red;
  height: 5vh;
  display: flex;
  align-items: center;
}
.header button {
  margin: 0 2vw;
  background-color: white;
  border-color: black;
  border-radius: 30%;
  padding: .5vh 1vw;
}
.header {
  background-color: red;
  height: 5vh;
  display: flex;
  align-items: center;
}
.header button {
  margin: 0 2vw;
  background-color: white;
  border-color: black;
  border-radius: 0;
  padding: .5vh 1vw;
}
.post {
  display: flex;
  flex-direction: column;
  border-style: solid;
  /* border-radius: 10%; */
  width: 95vw;
  margin: 5vh 0;
  min-height: 20vh;
  height: 40vh;
  z-index: 5;
  --webkit-overflow-scrolling: touch;
  overflow-y: auto;
  background-color: #FAF9F6;
}
.post-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
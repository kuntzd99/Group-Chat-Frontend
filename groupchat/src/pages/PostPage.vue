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
      </div>
      <div class="reactions">
        <div v-if="!liked" @click="() => addReaction('like')" class="reaction">{{ post.likes }} &#128077;</div>
        <div v-else @click="removeLike" :style="{'color': post.groupColor}" class="reaction">{{ post.likes }} &#128077;</div>
        <div v-if="!laughing" @click="() => addReaction('laugh')" class="reaction">{{ post.laughs }} &#128514;</div>
        <div v-else @click="removeLaugh" :style="{'color': post.groupColor}" class="reaction">{{ post.laughs }} &#128514;</div>
        <div class="comment-reaction">{{ post.comments }} &#128172;</div>
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
        @updateComment="updateComment"
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
    postReactionIds: [],
    messages: [],
    comments: [],
    comment: '',
    liked: false,
    laughing: false,
    likers: [],
    laughers: [],
    likedReactionId: -1,
    laughingReactionId: -1,
    sorting: 'likes'
  }),
  async mounted() {
    await this.getUser()
    await this.getPost()
    await this.getPostReactions()
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
      let numComments = 0
      const res = await axios.get('http://localhost:8000/comments/')
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].post === this.post.id) {
          this.comments.push(res.data[i])
          numComments++
        }
      }
      this.sort()
      // add total to post table
      await axios.put(`http://localhost:8000/posts/${this.post.id}`, {
        user: this.post.user,
        caption: this.post.caption,
        groupColor: this.post.groupColor,
        likes: this.post.likes,
        laughs: this.post.laughs,
        comments: numComments
      })
      await this.getPost()
    },
    sort() {
      let sorted = this.comments
      if (this.sorting === 'time') {
        sorted = sorted.sort((a, b) => {
          let aDate = new Date(a.time)
          let bDate = new Date(b.time)
          return aDate.getTime() - bDate.getTime()
        })
        this.comments = sorted
      } else if (this.sorting === 'likes') {
        sorted = sorted.sort((a, b) => {
          return b.likes - a.likes
        })
        this.comments = sorted
      } else if (this.sorting === 'dislikes') {
        sorted = sorted.sort((a, b) => {
          return b.dislikes - a.dislikes
        })
        this.comments = sorted
      } else if (this.sorting === 'laughs') {
        sorted = sorted.sort((a, b) => {
          return b.laughs - a.laughs
        })
        this.comments = sorted
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
        user: this.user.id,
        likes: 0,
        dislikes: 0,
        laughs: 0
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
    async getPostReactions() {
        let numLikes = 0
        let numLaughs = 0
        this.likers = []
        this.laughers = []
        const res = await axios.get('http://localhost:8000/postreactions/')
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].post === this.post.id) {
            this.postReactionIds.push(res.data[i].id)
            if (res.data[i].type == 'like') {
              numLikes++
              let reactionRes = await axios.get(`http://localhost:8000/users/${res.data[i].user}`)
              this.likers.push(reactionRes.data)
              if (res.data[i].user === this.user.id) {
                this.liked = true
                this.likedReactionId = res.data[i].id
              }
            } else if (res.data[i].type == 'laugh') {
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
        await axios.put(`http://localhost:8000/posts/${this.post.id}`, {
          user: this.post.user,
          caption: this.post.caption,
          groupColor: this.post.groupColor,
          likes: numLikes,
          laughs: numLaughs,
          comments: this.post.comments
        })
        await this.getPost()
    },
    async addReaction(type) {
      await axios.post('http://localhost:8000/postreactions/', {
        type: type,
        user: this.user.id,
        username: this.user.username,
        post: this.post.id
      })
      await this.getPostReactions()
    }, 
    async removeLike() {
      await axios.delete(`http://localhost:8000/postreactions/${this.likedReactionId}`)
      this.liked = false
      this.likedReactionId = -1
      await this.getPostReactions()
    },
    async removeLaugh() {
      await axios.delete(`http://localhost:8000/postreactions/${this.laughingReactionId}`)
      this.laughing = false
      this.laughingReactionId = -1
      await this.getPostReactions()
    },
    updateComment(id, newComment) {
      for (let i = 0; i < this.comments.length; i++) {
        if (this.comments[i].id === id) {
          this.comments[i] = newComment
        }
      }
    }
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
.reactions {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 50vw;
}
.reaction, .comment-reaction {
  border-style: solid;
  border-radius: 50%;
  padding: 2%;
}
.reaction:hover {
  border-color: yellow;
}
</style>
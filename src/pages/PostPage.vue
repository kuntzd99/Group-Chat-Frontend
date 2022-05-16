<template>
  <div>
    <div class="header">
      <button @click="goHome">Home</button>
      <button @click="goToProfile">Profile</button>
      <SearchBar :user="user" :groupId="-1" :addingGroupMember="false" />
      <button @click="logout">Log Out</button>
    </div>
    <div class="post-page">
      <h1 :style="{'display': 'flex'}">Post by <div class="username" @click="() => goToUserProfile(post.user)">{{ postCreator }}</div></h1>
      <div>{{ post.time }}</div>
      <button v-if="post.user === user.id" @click="deletePost">Delete Post</button>
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
       <MessageDetails v-if="showingDetail" :likers="likers" :dislikers="{}" :laughers="laughers" :user="this.user" :postPage="true" />
       <button :style="{'border-color': post.groupColor}" class="view-message" @click="toggleShowingDetail">View Details</button>
      <h3>Comments</h3>
      <div>
        Sort by 
        <select @change="handleSortChange">
          <option value="likes">&#128077;</option>
          <option value="time">Time</option>
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
import MessageDetails from '../components/MessageDetails.vue'

export default {
  name: 'PostPage',
  components: {
    SearchBar,
    PostMessage,
    CommentMessage,
    MessageDetails
  },
  data: () => ({
    user: {},
    post: {},
    postCreator: '',
    postMessageIds: [],
    messages: [],
    comments: [],
    comment: '',
    liked: false,
    laughing: false,
    likers: [],
    laughers: [],
    likedReactionId: -1,
    laughingReactionId: -1,
    sorting: 'likes',
    showingDetail: false
  }),
  async mounted() {
    await this.getUser()
    await this.getPost()
    await this.getPostReactions()
    await this.getMessages()
    await this.getComments()
    await this.getPostCreator()
  },
  methods: {
    async getUser() {
      let userId = this.unhashIdFromPostPage(this.$route.params.user_id)
      const res = await axios.get(`https://boiling-caverns-16943.herokuapp.com/users/${userId}`)
      this.user = res.data
    },
    unhashIdFromPostPage(integer) {
      let result = parseInt(integer) + 12
      result = result / 75
      return result
    },
    async getPost() {
      const res = await axios.get(`https://boiling-caverns-16943.herokuapp.com/posts/${this.$route.params.post_id}`)
      this.post = res.data
    },
    async getMessages() {
        const messageIds = []
        const res = await axios.get('https://boiling-caverns-16943.herokuapp.com/postmessages/')
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].post === this.post.id) {
            messageIds.push(res.data[i].message)
            this.postMessageIds.push(res.data[i].id)
          }
        }
        for (let i = 0; i < messageIds.length; i++) {
          const messageRes = await axios.get(`https://boiling-caverns-16943.herokuapp.com/messages/${messageIds[i]}`)
          this.messages.push(messageRes.data)
        }
    },
    async getComments() {
      this.comments = []
      let numComments = 0
      const res = await axios.get('https://boiling-caverns-16943.herokuapp.com/comments/')
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].post === this.post.id) {
          this.comments.push(res.data[i])
          numComments++
        }
      }
      this.sort()
      // add total to post table
      await axios.put(`https://boiling-caverns-16943.herokuapp.com/posts/${this.post.id}`, {
        user: this.post.user,
        caption: this.post.caption,
        groupColor: this.post.groupColor,
        likes: this.post.likes,
        laughs: this.post.laughs,
        comments: numComments,
        time: this.post.time
      })
      await this.getPost()
    },
    sort() {
      let sorted = this.comments
      if (this.sorting === 'time') {
        sorted = sorted.sort((a, b) => {
          return new Date(a.time) - new Date(b.time)
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
    async getPostCreator() {
      const res = await axios.get(`https://boiling-caverns-16943.herokuapp.com/users/${this.post.user}`)
      this.postCreator = res.data.username
    },
    async createComment(packagedPayload) {
      const res = await axios.post('https://boiling-caverns-16943.herokuapp.com/comments/', packagedPayload)
      return res.data
    },
    handleChange(e) {
      this[e.target.name] = e.target.value
    },
    async handleSubmit(e) {
      e.preventDefault()
      let time = new Date()
      time = time.toLocaleString()
      let formattedTime = time.slice(0, time.length - 6) + time.slice(time.length - 3, time.length)
      await this.createComment(
        {
        comment: this.comment, 
        username: this.user.username, 
        post: this.post.id, 
        user: this.user.id,
        likes: 0,
        dislikes: 0,
        laughs: 0,
        time: formattedTime
        }
      )
      this.comment = ''
      await this.getComments()
    },
    goHome() {
      this.$router.push(`/home/${this.hashUserIdForHome(this.user.id)}`)
    },
    hashUserIdForHome(integer) {
        return integer * 37 - 32
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
        const res = await axios.get('https://boiling-caverns-16943.herokuapp.com/postreactions/')
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].post === this.post.id) {
            if (res.data[i].type == 'like') {
              numLikes++
              let reactionRes = await axios.get(`https://boiling-caverns-16943.herokuapp.com/users/${res.data[i].user}`)
              this.likers.push(reactionRes.data)
              if (res.data[i].user === this.user.id) {
                this.liked = true
                this.likedReactionId = res.data[i].id
              }
            } else if (res.data[i].type == 'laugh') {
              numLaughs++
              let reactionRes = await axios.get(`https://boiling-caverns-16943.herokuapp.com/users/${res.data[i].user}`)
              this.laughers.push(reactionRes.data)
              if (res.data[i].user === this.user.id) {
                this.laughing = true
                this.laughingReactionId = res.data[i].id
              }
            }
          }
        }
        await axios.put(`https://boiling-caverns-16943.herokuapp.com/posts/${this.post.id}`, {
          user: this.post.user,
          caption: this.post.caption,
          groupColor: this.post.groupColor,
          likes: numLikes,
          laughs: numLaughs,
          comments: this.post.comments,
          time: this.post.time
        })
        await this.getPost()
    },
    async addReaction(type) {
      await axios.post('https://boiling-caverns-16943.herokuapp.com/postreactions/', {
        type: type,
        user: this.user.id,
        username: this.user.username,
        post: this.post.id
      })
      await this.getPostReactions()
    }, 
    async removeLike() {
      await axios.delete(`https://boiling-caverns-16943.herokuapp.com/postreactions/${this.likedReactionId}`)
      this.liked = false
      this.likedReactionId = -1
      await this.getPostReactions()
    },
    async removeLaugh() {
      await axios.delete(`https://boiling-caverns-16943.herokuapp.com/postreactions/${this.laughingReactionId}`)
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
    },
    goToUserProfile(userId) {
      this.$router.push(`/profile/${this.hashUserIdForProfilePage(this.user.id)}/${this.hashProfileIdForProfilePage(userId)}`)
    },
    hashUserIdForProfilePage(integer) {
      return integer * 31 + 19
    },
    hashProfileIdForProfilePage(integer) {
      return integer * 13 - 392
    },
    toggleShowingDetail() {
      this.showingDetail = !this.showingDetail
    },
    logout() {
      this.$router.push('/')
    },
    goToProfile() {
      this.$router.push(`/profile/${this.hashUserIdForProfilePage(this.user.id)}/${this.hashProfileIdForProfilePage(this.user.id)}`)
    },
    async deletePost() {
      for (let i = 0; i < this.postMessageIds.length; i++) {
        await axios.delete(`https://boiling-caverns-16943.herokuapp.com/postmessages/${this.postMessageIds[i]}`)
      }
      for (let i = 0; i < this.comments.length; i++) {
        await axios.delete(`https://boiling-caverns-16943.herokuapp.com/comments/${this.comments[i].id}`)
      }
      const res = await axios.get('https://boiling-caverns-16943.herokuapp.com/postreactions/')
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].post === this.post.id) {
          await axios.delete(`https://boiling-caverns-16943.herokuapp.com/postreactions/${res.data[i].id}`)
        }
      }
      await axios.delete(`https://boiling-caverns-16943.herokuapp.com/posts/${this.post.id}`)
      return this.$router.push(`/home/${this.hashUserIdForHome(this.user.id)}`)
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
.username {
  margin: 0 0 0 0.5vw;
  color: purple
}
.username:hover {
  color: cyan;
}
.view-message {
  margin: 2vh 0 0 0;
}
</style>
<template>
  <div>
    <div class="header">
      <button @click="goHome">Home</button>
    </div>
    <div id="bio">
      <img v-if="!editingImage" :src="profileUser.image" alt="user" />
      <input v-else type="text" name="newImage" placeholder="Upload image" :value="newImage" @input="handleChange" />
      <button v-if="user.id === profileUser.id && !editingImage" @click="toggleEditingImage">Change Image</button>
      <div v-else-if="user.id === profileUser.id && editingImage">
        <button @click="toggleEditingImage" >Cancel</button>
        <button @click="handleImageSubmit">Submit</button>
      </div>
      <h1>{{ profileUser.username }}</h1>
    </div>
    <div id="posts">
      <h3>{{ profileUser.username }}'s Posts</h3>
      <PostCard v-for="post in posts" :key="post" :post="post" :user="user" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import PostCard from '../components/PostCard'

export default {
  name: 'ProfilePage',
  components: {
    PostCard
  },
  data: () => ({
    user: {},
    profileUser: {},
    posts: [],
    editingImage: false,
    newImage: ''
  }),
  async mounted() {
    await this.getUsers()
    await this.getPosts()
  },
  methods: {
    async getUsers() {
      const userRes = await axios.get(`http://localhost:8000/users/${this.$route.params.user_id}`)
      this.user = userRes.data
      const profileUserRes = await axios.get(`http://localhost:8000/users/${this.$route.params.profile_id}`)
      this.profileUser = profileUserRes.data
    },
    async getPosts() {
      this.posts = []
      const res = await axios.get('http://localhost:8000/posts/')
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].user === this.profileUser.id) {
          this.posts.push(res.data[i])
        }
      }
    },
    goHome() {
      this.$router.push(`/home/${this.user.id}`)
    },
    toggleEditingImage() {
      this.editingImage = !this.editingImage
    },
    handleChange(e) {
        this[e.target.name] = e.target.value
    },
    async handleImageSubmit() {
      if (this.image.slice(0, 4) !== 'http') {
          return window.alert('Please copy and paste an image address from the internet')
      }
      await axios.put(`http://localhost:8000/users/${this.user.id}`, {image: this.image})
      await this.getUsers()
    }
  }
}
</script>

<style scoped>
#bio {
  border-bottom: solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
#bio img {
  width: 15vw;
  height: 20vh;
}
#bio button {
  margin-top: 1vh;
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
#posts {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
</style>
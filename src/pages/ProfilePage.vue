<template>
  <div class="profile">
    <div class="header">
      <button @click="goHome">Home</button>
      <SearchBar :user="user" :groupId="-1" :addingGroupMember="false" />
      <button @click="logout">Log Out</button>
    </div>
    <div id="bio">
      <img v-if="!editingImage" :src="profileUser.image" alt="user" />
      <input v-else type="text" name="newImage" placeholder="Upload image" :value="newImage" @input="handleChange" />
      <button v-if="user.id === profileUser.id && !editingImage" @click="toggleEditingImage">Change Image</button>
      <div v-else-if="user.id === profileUser.id && editingImage">
        <button @click="toggleEditingImage" >Cancel</button>
        <button @click="handleImageSubmit">Submit</button>
      </div>
      <h1 class="username">{{ profileUser.username }}</h1>
      <p>{{ profileUser.bio }}</p>
    </div>
    <h3>{{ profileUser.username }}'s Posts</h3>
    <div id="posts">
      <PostCard v-for="post in posts" :key="post" :post="post" :user="user" @getPosts="getPosts" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import PostCard from '../components/PostCard'
import SearchBar from '../components/SearchBar.vue'

export default {
  name: 'ProfilePage',
  components: {
    PostCard,
    SearchBar
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
      let userId = this.unhashUserIdFromProfilePage(this.$route.params.user_id)
      const userRes = await axios.get(`https://boiling-caverns-16943.herokuapp.com/users/${userId}`)
      this.user = userRes.data
      let profileUserId = this.unhashProfileIdFromProfilePage(this.$route.params.profile_id)
      const profileUserRes = await axios.get(`https://boiling-caverns-16943.herokuapp.com/users/${profileUserId}`)
      this.profileUser = profileUserRes.data
    },
    unhashProfileIdFromProfilePage(integer) {
      let result = parseInt(integer) + 392
      result = result / 13
      return result
    },
    unhashUserIdFromProfilePage(integer) {
      let result = parseInt(integer) - 19
      result = result / 31
      return result
    },
    async getPosts() {
      this.posts = []
      const res = await axios.get('https://boiling-caverns-16943.herokuapp.com/posts/')
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].user === this.profileUser.id) {
          this.posts.push(res.data[i])
        }
      }
    },
    goHome() {
      this.$router.push(`/home/${this.hashUserIdForHome(this.user.id)}`)
    },
    hashUserIdForHome(integer) {
        return integer * 37 - 32
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
      await axios.put(`https://boiling-caverns-16943.herokuapp.com/users/${this.user.id}`, {image: this.image})
      await this.getUsers()
    },
    logout() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.profile {
  text-align: center;
}
#bio {
  border-bottom: solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 2vh;
}
#bio img {
  width: 15vw;
  height: 20vh;
}
#bio button {
  margin-top: 1vh;
}
#posts {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  text-align: center;
  grid-gap: 2em;
}
.header {
  background-color: rgb(127, 174, 255);
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
.username {
  margin: 1vh 0 0 0;
}
</style>
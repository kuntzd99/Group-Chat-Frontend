<template>
  <div>
    <div id="header">
      <!-- <img :src="profile.image" alt="user" /> -->
      <h1>{{ profileUser.username }}</h1>
    </div>
      <h3>{{ profileUser.username }}'s Posts</h3>
      <PostCard v-for="post in posts" :key="post" :post="post" :user="user" />
    <div>
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
    posts: []
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
  }
}
</script>

<style scoped>
#header {
  border-bottom: solid;
}
</style>
<template>
  <div class="message-details">
    <div class="usernames">
      Likes:
      <div class="username" v-for="liker in likers" :key="liker.id" @click="() => goToUserProfile(liker.id)">{{ liker.username }}</div>
    </div>
    <div class="usernames">
      Dislikes:
      <div class="username" v-for="disliker in dislikers" :key="disliker.id" @click="() => goToUserProfile(disliker.id)">{{ disliker.username }}</div>
    </div>
    <div class="usernames">
      Laughs:
      <div class="username" v-for="laugher in laughers" :key="laugher.id" @click="() => goToUserProfile(laugher.id)">{{ laugher.username }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageDetails',
  props: {
    likers: [],
    dislikers: [],
    laughers: [],
    user: {}
  },
  methods: {
    goToUserProfile(userId) {
      this.$router.push(`/profile/${this.user.id}/${userId}`)
    }
  }
}
</script>

<style scoped>
.usernames {
  display: flex;
   --webkit-overflow-scrolling: touch;
  overflow-x: auto;
  margin: 1vh 0 1vh 1vh;
}
.message-details {
  background-color: white;
  border-style: solid
}
.username {
  margin: 0 0 0 0.5vw;
  color: purple
}
.username:hover {
  color: cyan;
}
</style>
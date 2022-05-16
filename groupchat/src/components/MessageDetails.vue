<template>
  <div class="message-details" v-if="!postPage">
    <div class="usernames">
      Likes:
      <div class="username" v-for="liker in likers" :key="liker.id" @click="() => goToUserProfile(liker.id)">{{ liker.username }}</div>
    </div>
    <div v-if="!postPage" class="usernames">
      Dislikes:
      <div class="username" v-for="disliker in dislikers" :key="disliker.id" @click="() => goToUserProfile(disliker.id)">{{ disliker.username }}</div>
    </div>
    <div class="usernames">
      Laughs:
      <div class="username" v-for="laugher in laughers" :key="laugher.id" @click="() => goToUserProfile(laugher.id)">{{ laugher.username }}</div>
    </div>
  </div>
  <div class="post-message-details" v-else>
    <div class="usernames">
      Likes:
      <div class="username" v-for="liker in likers" :key="liker.id" @click="() => goToUserProfile(liker.id)">{{ liker.username }}</div>
    </div>
    <div v-if="!postPage" class="usernames">
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
    user: {},
    postPage: Boolean
  },
  methods: {
    goToUserProfile(userId) {
      this.$router.push(`/profile/${this.hashUserIdForProfilePage(this.user.id)}/${this.hashProfileIdForProfilePage(userId)}`)
    },
    hashUserIdForProfilePage(integer) {
      return integer * 31 + 19
    },
    hashProfileIdForProfilePage(integer) {
      return integer * 13 - 392
    },
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
.post-message-details {
  width: 60vw;
  border-style: solid;
  margin: 2vh 0;
}
</style>
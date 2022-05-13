<template>
  <div v-if="message.sender === post.user" class="nonuser-message">
    <h6 class="username">{{ message.senderUsername }}</h6>
    <p class="message">{{ message.message }}</p>
    <div class="reactions">
      <div class="reaction">{{ numLikes }} &#128077;</div>
      <div class="reaction">{{ numDislikes }} &#128078;</div>
      <div class="reaction">{{ numLaughs }} &#128514;</div>
    </div>
    <p>{{ new Date(message.time) }}</p>
  </div>
  <div v-else class="nonuser-message">
    <h6 class="username">{{ message.senderUsername }}</h6>
    <p class="message">{{ message.message }}</p>
    <div class="reactions">
      <div class="reaction">{{ numLikes }} &#128077;</div>
      <div class="reaction">{{ numDislikes }} &#128078;</div>
      <div class="reaction">{{ numLaughs }} &#128514;</div>
    </div>
    <p>{{ new Date(message.time) }}</p>
  </div>
</template>

<script>
export default {
  name: 'PostMessage',
  props: {
    user: {},
    message: {},
    post: {}
  }
}
</script>

<style scoped>
.user-message {
  border-style: solid;
  border-radius: 20%;
  margin: 2vh 0;
  width: 50vw;
  align-self: flex-end;
  background-color: white;
}
.nonuser-message {
  border-style: solid;
  border-radius: 20%;
  margin: 2vh 0;
  align-self: flex-start;
  background-color: white
}
</style>
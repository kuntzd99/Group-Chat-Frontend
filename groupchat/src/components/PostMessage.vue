<template>
  <div v-if="message.sender === post.user" class="user-message">
    <div class="message-body">
      <h6 class="username">{{ message.senderUsername }}</h6>
      <div class="message">
        <p>{{ message.message }}</p>
      </div>
      <!-- <div class="reactions">
        <div class="reaction">{{ numLikes }} &#128077;</div>
        <div class="reaction">{{ numDislikes }} &#128078;</div>
        <div class="reaction">{{ numLaughs }} &#128514;</div>
      </div> -->
    </div>
    <p>{{ new Date(message.time) }}</p>
  </div>
  <div v-else class="nonuser-message">
    <div class="message-body">
      <h6 class="nonuser-username">{{ message.senderUsername }}</h6>
      <div class="message">
        <p>{{ message.message }}</p>
      </div>
      <!-- <div class="reactions">
        <div class="reaction">{{ numLikes }} &#128077;</div>
        <div class="reaction">{{ numDislikes }} &#128078;</div>
        <div class="reaction">{{ numLaughs }} &#128514;</div>
      </div> -->
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
.message-body {
  background-color: white;
  border-style: solid;
}
.user-message {
  width: 45vw;
  height: auto;
  align-self: flex-end;
  margin: 2vh 1vw 0.5vh 0;
}
.nonuser-message {
  border-radius: 20%;
  margin: 2vh 0 0 1vw;
  align-self: flex-start;
}
.user-message, .nonuser-message {
  width: 20vw;
}
.username {
  display: flex;
  justify-content: flex-end;
  margin: 1vh 0 0 1vw;
  font-size: 1em;
  align-self: center;
  margin-right: 1vw;
}
.nonuser-username {
  display: flex;
  justify-content: flex-start;
  margin: 1vh 0 0 1vw;
  font-size: 1em;
  align-self: center;
}
</style>
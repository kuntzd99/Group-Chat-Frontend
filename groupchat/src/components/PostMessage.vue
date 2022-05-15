<template>
  <div v-if="message.sender === post.user && !postPage" class="user-message">
    <div class="message-body">
      <h6 class="username">{{ message.senderUsername }}</h6>
      <div class="message">
        <p>{{ message.message }}</p>
      </div>
    </div>
    <p>{{ new Date(message.time) }}</p>
  </div>
  <div v-else-if="message.sender === post.user && postPage" class="post-user-message">
    <div class="message-body">
      <h6 class="username">{{ message.senderUsername }}</h6>
      <div class="message">
        <p>{{ message.message }}</p>
      </div>
    </div>
    <p>{{ new Date(message.time) }}</p>
  </div>
  <div v-else-if="message.sender !== post.user && postPage" class="post-nonuser-message">
    <div class="message-body">
      <h6 class="nonuser-username">{{ message.senderUsername }}</h6>
      <div class="message">
        <p>{{ message.message }}</p>
      </div>
    </div>
    <p>{{ new Date(message.time) }}</p>
  </div>
  <div v-else class="nonuser-message">
    <div class="message-body">
      <h6 class="nonuser-username">{{ message.senderUsername }}</h6>
      <div class="message">
        <p>{{ message.message }}</p>
      </div>
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
    post: {},
    postPage: Boolean
  }
}
</script>

<style scoped>
.message-body {
  background-color: white;
  border-style: solid;
}
.user-message {
  height: auto;
  align-self: flex-end;
  margin: 2vh 1vw 0.5vh 0;
}
.post-user-message {
  width: 45vw;
  height: auto;
  align-self: flex-end;
  margin: 2vh 1vw 0.5vh 0;
}
.post-nonuser-message {
  width: 45vw;
  height: auto;
  align-self: flex-start;
  margin: 2vh 0 0 1vw;
}
.nonuser-message {
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
.message p {
  display: flex;
  justify-content: flex-start;
  margin-left: 1vw;
  flex-wrap: wrap;
  width: 40vw;
  text-align: left;
  overflow-wrap: break-word;
  word-break: break-all;
}
</style>
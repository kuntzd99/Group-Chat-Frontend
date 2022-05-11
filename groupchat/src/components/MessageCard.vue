<template>
  <div v-if="message.user === user.id" class="user-message">
    <h6 class="username">{{ message.senderUsername }}</h6>
    <p class="message">{{ message.message }}</p>
    <div class="reactions"></div>
  </div>
  <div v-else class="user-message">
    <h6 class="username">{{ message.senderUsername }}</h6>
    <p class="message">{{ message.message }}</p>
    <div class="reactions">
      &#128077;
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageCard',
  props: {
    message: {},
    user: {}
  }
}
</script>

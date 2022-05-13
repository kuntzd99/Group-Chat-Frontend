<template>
  <div id="group" :style="{'border-color': group.color}">
    <div class="image-wrapper">
      <img :src="group.image" :alt="group.name" />
    </div>
    <div>
      {{ group.name }}
      <p v-if="group.membersCount > 1">{{ group.membersCount }} members</p>
      <p v-else>{{ group.membersCount }} member</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GroupCard',
    props: {
      group: {}
    }
  }
</script>

<style scoped>
img {
  height: 8vh;
  width: 8vw;
  border-radius: 50%;
  margin-bottom: 2vh;
}

#group {
  border-style: solid;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 12vw;
  height: 20vh;
  margin: 2vh 0;
}

#group:hover {
  border-color: yellow;
}
</style>
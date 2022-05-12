<template>
  <div id="group" :style="{'border-color': group.color}">
    <!-- <div class="image-wrapper">
      <img :src="game.background_image" :alt="game.name" />
    </div> -->
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
#group {
  border-style: solid;
  border-radius: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 30vw;
  margin: 2vh 0;
}
</style>
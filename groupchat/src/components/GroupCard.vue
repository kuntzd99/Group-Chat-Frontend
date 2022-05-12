<template>
  <div id="group" >
    <!-- <div class="image-wrapper">
      <img :src="game.background_image" :alt="game.name" />
    </div> -->
    <div>
      {{ group.name }}
      <p>{{ group.membersCount }} members</p>
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
  max-width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
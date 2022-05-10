<template>
  <div>
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

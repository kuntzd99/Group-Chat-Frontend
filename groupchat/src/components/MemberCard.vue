<template>
  <div @click="goToMembersProfile" id="member">
    <img :src="member.image" :alt="member.name" />
    <h5>{{ member.username }}</h5>
  </div>
</template>

<script>
  export default {
    name: 'MemberCard',
    props: {
      member: {},
      user: {}
    },
    methods: {
      goToMembersProfile() {
        this.$router.push(`/profile/${this.hashUserIdForProfilePage(this.user.id)}/${this.hashProfileIdForProfilePage(this.member.id)}`)
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
img {
  height: 40%;
  width: 20%;
  border-radius: 50%;
}
#member {
  padding-top: 1vh;
  border-style: solid;
  height: 10vh;
  width: 15vw;
  margin: 0 1vw;
  background-color: white;
}
#member:hover {
  border-color: yellow
}
</style>
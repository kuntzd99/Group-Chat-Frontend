<template>
  <div v-if="Object.keys(user).length === 0">
    <h1>Loading</h1>
  </div>
  <div v-else id="homepage">
    <div class="header">
      <button @click="goToProfile">Profile</button>
      <SearchBar :user="user" />
    </div>
    <h1>Welcome, {{ user.username }}</h1>
    <div v-if="groups.length > 0">
      <h3>Your Groups</h3>
      <div class="groups-container">
        <GroupCard v-for="group in groups" :key="group.id" :group="group" @click="() => selectGroup(group.id)" />
      </div>
    </div>
    <div v-else>
      <h3>No Groups</h3>
    </div>
    <div v-if="!creatingGroup">
      <button @click="toggleCreatingGroup">Create Group</button>
    </div>
    <div v-else>
      <form @submit="handleSubmit">
        <input type="text" :value="groupName" name="groupName" placeholder="Name" @input="handleChange" />
        <input type="text" :value="groupImage" name="groupImage" placeholder="Image (optional)" @input="handleChange" />
        <input type="color" :value="groupColor" name="groupColor" @input="handleChange" />
        <div class="button-container">
          <button @click="toggleCreatingGroup">Cancel</button>
          <button type="submit" :disabled="!groupName || !groupColor">Create Group</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import SearchBar from '../components/SearchBar'
import axios from 'axios'
import GroupCard from '../components/GroupCard'

export default {
  name: 'HomePage',
  components: {
    SearchBar,
    GroupCard
  },
  data: () => ({
    user: {},
    groups: [],
    groupName: '',
    groupColor: '',
    groupImage: '',
    creatingGroup: false
  }),
  async mounted() {
    await this.getUser()
    await this.getGroups()
  },
  methods: {
    async getUser() {
      const res = await axios.get(`http://localhost:8000/users/${this.$route.params.user_id}`)
      this.user = res.data
    },
    async getGroups() {
      const groupIds = []
      const res = await axios.get('http://localhost:8000/memberships/')
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].user === this.user.id) {
          groupIds.push(res.data[i].group)
        }
      }
      for (let i = 0; i < groupIds.length; i++) {
        let groupRes = await axios.get(`http://localhost:8000/groups/${groupIds[i]}`)
        this.groups.push(groupRes.data)
      }
    },
    async createGroup(packagedPayload) {
        const res = await axios.post('http://localhost:8000/groups/', packagedPayload)
        return res.data
    },
    toggleCreatingGroup() {
      this.creatingGroup = !this.creatingGroup
    },
    handleChange(e) {
        this[e.target.name] = e.target.value
    },
    async handleSubmit(e) {
      e.preventDefault()
      for (let i = 0; i < this.groups.length; i++) {
        if (this.groups[i].name === this.groupName) {
          return window.alert('Group already exists')
        }
      }
      if (this.groupImage === '') {
        this.groupImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7Zq9-XkMT-p_48geJHZbsWHQkGuWOs5xg5qvLodrdwiQ4Wx6Bo7WIblghxJeWRIQHOcQ&usqp=CAU'
      }
      if (this.groupImage.slice(0, 4) !== 'http') {
        return window.alert('Please copy and paste an image address from the internet')
      }
      let newGroup = await this.createGroup({name: this.groupName, color: this.groupColor, membersCount: 1, creator: this.user.id, image: this.groupImage})
      await axios.post('http://localhost:8000/memberships/', {group: newGroup.id, user: this.user.id})
      this.getGroups()
      this.creatingGroup = false
    },
    selectGroup(groupId) {
      this.$router.push(`/groups/${this.user.id}/${groupId}`)
    },
    goToProfile() {
      this.$router.push(`/profile/${this.user.id}/${this.user.id}`)
    }
  }
}
</script>

<style scoped>
#homepage {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}
input {
  margin: 0 0.5vh;
}
.groups-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.button-container {
  margin-top: 2vh;
}
.button-container button {
  margin: 0 1vw;
}
.header {
  background-color: red;
  height: 5vh;
  display: flex;
  align-items: center;
}
.header button {
  margin: 0 2vw;
  background-color: white;
  border-color: black;
  border-radius: 30%;
  padding: .5vh 1vw;
}
</style>
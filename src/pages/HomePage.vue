<template>
  <div v-if="Object.keys(user).length === 0">
    <h1>Loading</h1>
  </div>
  <div v-else id="homepage">
    <div class="header">
      <button @click="goToProfile">Profile</button>
      <SearchBar :user="user" :groupId="-1" :addingGroupMember="false" />
      <button @click="logout">Log Out</button>
    </div>
    <h1>Welcome, {{ user.username }}</h1>
    <div class="groups-and-posts">
      <div>
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
      <div v-if="invitationGroups.length > 0">
      <h3>Invitations</h3>
      <InvitationCard v-for="invitationGroup in invitationGroups" :key="invitationGroup.id" 
      :user="user" 
      :group="invitationGroup" 
      @getInvitationGroups="getInvitationGroups"
      @getGroups="getGroups"
      />
    </div>
    <h3 v-if="invitationGroups.length === 0">No Group Invitations</h3>
      </div>
      <div>
        <h3>Popular posts</h3>
        <div id="posts">
          <PostCard v-for="post in posts" :key="post" :post="post" :user="user" @getPosts="getPosts" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchBar from '../components/SearchBar'
import axios from 'axios'
import GroupCard from '../components/GroupCard'
import InvitationCard from '../components/InvitationCard'
import PostCard from '../components/PostCard.vue'

export default {
  name: 'HomePage',
  components: {
    SearchBar,
    GroupCard,
    InvitationCard,
    PostCard
  },
  data: () => ({
    user: {},
    groups: [],
    groupName: '',
    groupColor: '',
    groupImage: '',
    creatingGroup: false,
    invitationGroups: [],
    posts: []
  }),
  async mounted() {
    await this.getUser()
    await this.getGroups()
    await this.getInvitationGroups()
    await this.getPosts()
  },
  methods: {
    async getUser() {
      let userId = this.unhashIdFromHome(this.$route.params.user_id)
      const res = await axios.get(`https://boiling-caverns-16943.herokuapp.com/users/${userId}`)
      this.user = res.data
    },
    unhashIdFromHome(integer){
      let result = parseInt(integer) + 32
      result = result / 37
      return result
    },
    async getGroups() {
      this.groups = []
      const groupIds = []
      const res = await axios.get('https://boiling-caverns-16943.herokuapp.com/memberships/')
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].user === this.user.id) {
          groupIds.push(res.data[i].group)
        }
      }
      for (let i = 0; i < groupIds.length; i++) {
        let groupRes = await axios.get(`https://boiling-caverns-16943.herokuapp.com/groups/${groupIds[i]}`)
        this.groups.push(groupRes.data)
      }
    },
    async getPosts() {
      const res = await axios.get('https://boiling-caverns-16943.herokuapp.com/posts/')
      let sorted = res.data
      sorted = sorted.sort((a, b) => {
        return b.comments - a.comments
      })
      this.posts = sorted
    },
    async createGroup(packagedPayload) {
        const res = await axios.post('https://boiling-caverns-16943.herokuapp.com/groups/', packagedPayload)
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
      await axios.post('https://boiling-caverns-16943.herokuapp.com/memberships/', {group: newGroup.id, user: this.user.id})
      this.getGroups()
      this.creatingGroup = false
    },
    selectGroup(groupId) {
      this.$router.push(`/groups/${this.hashIdForGroupPage(this.user.id)}/${groupId}`)
    },
    hashIdForGroupPage(integer) {
      return integer * 3 + 1234
    },
    goToProfile() {
      this.$router.push(`/profile/${this.hashUserIdForProfilePage(this.user.id)}/${this.hashProfileIdForProfilePage(this.user.id)}`)
    },
    hashUserIdForProfilePage(integer) {
      return integer * 31 + 19
    },
    hashProfileIdForProfilePage(integer) {
      return integer * 13 - 392
    },
    async getInvitationGroups() {
      this.invitationGroups = []
      const groupIds = []
      const senderIds = []
      const invitationIds = []
      const invitationRes = await axios.get('https://boiling-caverns-16943.herokuapp.com/invitations/')
      for (let i = 0; i < invitationRes.data.length; i++) {
        if (invitationRes.data[i].user === this.user.id) {
          groupIds.push(invitationRes.data[i].group)
          senderIds.push(invitationRes.data[i].sender)
          invitationIds.push(invitationRes.data[i].id)
        }
      }
      for (let i = 0; i < groupIds.length; i++) {
        let groupRes = await axios.get(`https://boiling-caverns-16943.herokuapp.com/groups/${groupIds[i]}`)
        let invitationGroup = groupRes.data
        invitationGroup['senderId'] = senderIds.shift()
        invitationGroup['invitationId'] = invitationIds.shift()
        this.invitationGroups.push(invitationGroup)
      }
    },
    logout() {
      this.$router.push('/')
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
  flex-wrap: wrap;
  justify-content: center;
  grid-gap: 2em;
  width: 45vw;
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
  border-radius: 0;
  padding: .5vh 1vw;
}
.groups-and-posts {
  display: flex;
  justify-content: space-evenly;
  grid-gap: 5vw;
}
.posts {
  height: 50vh;
  --webkit-overflow-scrolling: touch;
  overflow-y: auto;
}
</style>
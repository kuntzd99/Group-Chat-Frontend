<template>
  <div v-if="Object.keys(user).length === 0">
    <h1>Loading</h1>
  </div>
  <div v-else>
    <h1>Welcome, {{ user.username }}</h1>
    <div v-if="groups.length > 0">
      <h3>Your Groups</h3>
      <GroupCard v-for="group in groups" :key="group.id" :group="group" @click="() => selectGroup(group.id)" />
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
        <input type="color" :value="groupColor" name="groupColor" @input="handleChange" />
        <button type="submit" :disabled="!groupName || !groupColor">Create Group</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import GroupCard from '../components/GroupCard'

export default {
  name: 'HomePage',
  components: {
    GroupCard
  },
  data: () => ({
    user: {},
    groups: [],
    groupName: '',
    groupColor: '',
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
      console.log(res.data, 'HOMEPAGE, GETGROUPS METHOD, USER MEMBERSHIPS')
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].user === this.user.id) {
          groupIds.push(res.data[i].group)
        }
      }
      for (let i = 0; i < groupIds.length; i++) {
        let res = await axios.get(`http://localhost:8000/groups/${groupIds[i]}`)
        console.log(res.data, 'HOMEPAGE, GROUPS')
        this.groups.push(res.data)
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
      let newGroup = await this.createGroup({name: this.groupName, color: this.groupColor, membersCount: 1})
      await axios.post('http://localhost:8000/memberships/', {group: newGroup.id, user: this.user.id})
      this.getGroups()
      this.creatingGroup = false
    },
    selectGroup(groupId) {
      this.$router.push(`/groups/${this.user.id}/${groupId}`)
    }
  }
}
</script>

<template>
  <div id="grouppage">
    <div class="header">
      <button @click="goHome">Home</button>
      <button @click="goToProfile">Profile</button>
      <SearchBar :user="user" :groupId="-1" :addingGroupMember="false" />
      <button @click="logout">Log Out</button>
    </div>
    <div id="title">
      <img :src="group.image" alt="group.name" />
      <button class="image-button" v-if="group.creator === user.id && !editingImage" @click="toggleEditingImage">Change Image</button>
      <div v-else-if="group.creator === user.id && editingImage">
        <input type="text" :value="newImage" name="newImage" @input="handleChange" placeholder="upload image" />
        <div class="button-container">
          <button @click="toggleEditingImage">Cancel</button>
          <button @click="submitImageChange" :disabled="!newImage">Change</button>
        </div>
      </div>
      <h1>{{ group.name }}</h1>
      <button class="image-button" v-if="group.creator === user.id && !editingName" @click="toggleEditingName">Change Name</button>
      <div v-else-if="group.creator === user.id && editingName">
        <input type="text" :value="newName" name="newName" @input="handleChange" placeholder="new name" />
        <div class="button-container">
          <button @click="toggleEditingName">Cancel</button>
          <button @click="submitNameChange" :disabled="!newName">Change</button>
        </div>
      </div>
      <h3>Created by <button @click="goToCreatorProfile">{{ this.creator.username }}</button></h3>
      <button v-if="group.creator === user.id" @click="deleteGroup">Delete Group</button>
    </div>
    <div class="messages-box" :style="{'background-color': this.group.color}">
      <MessageCard 
      v-for="message in messages" 
      :key="message.id" 
      :message="message" 
      :user="user" 
      @getMessages="getMessages"
      :posting="posting"
      @addPostMessage="addPostMessage"
      @removePostMessage="removePostMessage"
      />
    </div>
    <form @submit="handleSubmit" v-if="!posting">
      <textarea @input="handleChange" placeholder="Enter message here" :value="message" name="message" />
      <button type="submit" :disabled="!message">Send</button>
    </form>
    <form v-if="posting" @submit="createPost">
      <textarea @input="handleChange" placeholder="Caption" :value="caption" name="caption" />
      <div>
        <button @click="clearPost">Cancel</button>
        <button :disabled="postMessages.length < 1" type="submit">Post</button>
      </div>
    </form>
    <button v-else @click="togglePosting">Create Post</button>
    <h3>Members:</h3>
    <div class="members" :style="{'background-color': this.group.color}">
      <MemberCard v-for="member in members" :key="member.id" :member="member" :user="user" />
    </div>
    <SearchBar 
    :user="user" 
    :addingGroupMember="true" 
    :groupId="group.id" 
    @checkUser="checkUser"
    :members="members"
    />
  </div>
</template>

<script>
import axios from 'axios'
import MessageCard from '../components/MessageCard.vue'
import MemberCard from '../components/MemberCard.vue'
import SearchBar from '../components/SearchBar.vue'

export default {
  name: 'GroupPage',
  components: {
    MessageCard,
    MemberCard,
    SearchBar
  },
  data: () => ({
    user: {},
    group: {},
    messages: [],
    members: [],
    message: '',
    posting: false,
    postMessages: [],
    caption: '',
    creator: '',
    editingImage: false,
    newImage: '',
    editingName: false,
    newName: ''
  }),
  async mounted() {
    await this.getUser()
    await this.getGroup()
    await this.getMessages()
    await this.getMembers()
    await this.getCreator()
  },
  methods: {
    async getUser() {
      const res = await axios.get(`http://localhost:8000/users/${this.$route.params.user_id}`)
      this.user = res.data
    },
    async getGroup() {
      const res = await axios.get(`http://localhost:8000/groups/${this.$route.params.group_id}`)
      this.group = res.data
    },
    async getMessages() {
      this.messages = []
      const res = await axios.get('http://localhost:8000/messages/')
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].group === this.group.id) {
          this.messages.push(res.data[i])
        }
      }
    },
    async getMembers() {
      const userIds = []
      const res = await axios.get('http://localhost:8000/memberships/')
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].group === this.group.id) {
          userIds.push(res.data[i].user)
        }
      }
      for (let i = 0; i < userIds.length; i++) {
        let userRes = await axios.get(`http://localhost:8000/users/${userIds[i]}`)
        this.members.push(userRes.data)
      }
    },
    async createMessage(packagedPayload) {
      const res = await axios.post('http://localhost:8000/messages/', packagedPayload)
      return res.data
    },
    async getCreator() {
      const res = await axios.get(`http://localhost:8000/users/${this.group.creator}`)
      this.creator = res.data
    },
    handleChange(e) {
      this[e.target.name] = e.target.value
    },
    async handleSubmit(e) {
      e.preventDefault()
      await this.createMessage(
        {
        message: this.message, 
        groupName: this.group.name, 
        senderUsername: this.user.username, 
        group: this.group.id, 
        sender: this.user.id
        }
      )
      this.message = ''
      await this.getMessages()
    },
    async deleteGroup() {
      const res = await axios.get('http://localhost:8000/memberships/')
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].group === this.group.id) {
          await axios.delete(`http://localhost:8000/memberships/${res.data[i].id}`)
        }
      }
      await axios.delete(`http://localhost:8000/groups/${this.group.id}`)
      return this.$router.push(`/home/${this.user.id}`)
    },
    togglePosting() {
      this.posting = !this.posting
    },
    addPostMessage(message) {
      this.postMessages.push(message)
    },
    removePostMessage(message) {
      const index = this.postMessages.indexOf(message)
      if (index > -1) {
        this.postMessages = this.postMessages.splice(index, 1)
      }
    },
    async createPost(e) {
      e.preventDefault()
      const newPost = await axios.post('http://localhost:8000/posts/', 
      {
        user: this.user.id,
        caption: this.caption
      }
      )
      for (let i = 0; i < this.postMessages.length; i++) {
        await axios.post('http://localhost:8000/postmessages/', 
        {
          post: newPost.data.id,
          message: this.postMessages[i].id
        }
        )
      }
      this.posting = false
      this.postMessages = []
      this.caption = ''
    },
    clearPost() {
      this.posting = false
      this.postMessages = []
      this.caption = ''
    },
    goToCreatorProfile() {
      this.$router.push(`/profile/${this.user.id}/${this.creator.id}`)
    },
    toggleEditingImage() {
      this.editingImage = !this.editingImage
    },
    async submitImageChange() {
      if (this.newImage.slice(0, 4) !== 'http') {
        return window.alert('Please copy and paste an image address from the internet')
      }
      await axios.put(`http://localhost:8000/groups/${this.group.id}`, 
        {
          image: this.newImage,
          name: this.group.name,
          color: this.group.color,
          membersCount: this.group.membersCount,
          creator: this.group.creator
        }
      )
      await this.getGroup()
      this.editingImage = false
    },
    toggleEditingName() {
      this.editingName = !this.editingName
    },
    async submitNameChange() {
      await axios.put(`http://localhost:8000/groups/${this.group.id}`, 
        {
         name: this.newName,
         color: this.group.color,
         membersCount: this.group.membersCount,
         creator: this.group.creator,
         image: this.group.image
       }
      )
      await this.getGroup()
      this.editingName = false
    },
    logout() {
      this.$router.push('/')
    },
    goHome() {
      this.$router.push(`/home/${this.user.id}`)
    }
  }
}
</script>

<style scoped>
#title {
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
}
#title button {
  max-height: 3vh;
  justify-self: center;
  align-self: center;
  margin-left: 1vw;
}
#grouppage {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
textarea {
  margin-right: 1vw;
}
.messages-box {
  display: flex;
  flex-direction: column;
  border-style: solid;
  border-radius: 10%;
  width: 95vw;
  margin: 5vh 0;
  min-height: 20vh;
  height: 60vh;
  z-index: 5;
  --webkit-overflow-scrolling: touch;
  overflow-y: auto;
}
textarea {
  width: 80vw;
  height: 5vh;
}
.header {
  background-color: red;
  height: 5vh;
  display: flex;
  align-items: center;
  width: 100vw;
}
.header button {
  margin: 0 2vw;
  background-color: white;
  border-color: black;
  border-radius: 0;
  padding: .5vh 1vw;
}
#title img {
  border-radius: 50%;
  border-style: solid;
  margin-top: 0.5vh;
  border-width: .13em;
  height: 50%;
  width: 50%;
}
#title h1 {
  margin: 0;
  margin-top: 0.5vh;
}
.image-button {
  margin: .5vh 0;
}
.members {
  display: flex;
  --webkit-overflow-scrolling: touch;
  overflow-x: auto;
  justify-content: flex-start;
  height: 15vh;
  align-items: center;
  margin-bottom: 1vh;
}
</style>
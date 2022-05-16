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
      <h3 :style="{'display': 'flex'}">Created by <div class="username" @click="goToCreatorProfile">{{ this.creator.username }}</div></h3>
      <button v-if="group.creator === user.id" @click="deleteGroup">Delete Group</button>
    </div>
    <div>
        Sort by 
        <select @change="handleSortChange">
          <option value="time">Time</option>
          <option value="likes">&#128077;</option>
          <option value="dislikes">&#128078;</option>
          <option value="laughs">&#128514;</option>
        </select>
        <button @click="sort">Sort</button>
      </div>
    <div class="messages-box" :style="{'background-color': this.group.color}">
      <MessageCard 
      v-for="message in messages" 
      :group="group"
      :key="message.id" 
      :message="message" 
      :user="user" 
      @getMessages="getMessages"
      :posting="posting"
      @addPostMessage="addPostMessage"
      @removePostMessage="removePostMessage"
      @updateMessage="updateMessage"
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
    newName: '',
    sorting: 'time'
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
      let userId = this.unhashIdFromGroupPage(this.$route.params.user_id)
      const res = await axios.get(`https://boiling-caverns-16943.herokuapp.com/users/${userId}`)
      this.user = res.data
    },
    unhashIdFromGroupPage(integer) {
      let result = parseInt(integer) - 1234
      result = result / 3
      return result
    },
    async getGroup() {
      const res = await axios.get(`https://boiling-caverns-16943.herokuapp.com/groups/${this.$route.params.group_id}`)
      this.group = res.data
    },
    async getMessages() {
      this.messages = []
      const res = await axios.get('https://boiling-caverns-16943.herokuapp.com/messages/')
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].group === this.group.id) {
          this.messages.push(res.data[i])
        }
      }
      this.sort()
    },
    async getMembers() {
      const userIds = []
      const res = await axios.get('https://boiling-caverns-16943.herokuapp.com/memberships/')
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].group === this.group.id) {
          userIds.push(res.data[i].user)
        }
      }
      for (let i = 0; i < userIds.length; i++) {
        let userRes = await axios.get(`https://boiling-caverns-16943.herokuapp.com/users/${userIds[i]}`)
        this.members.push(userRes.data)
      }
    },
    async createMessage(packagedPayload) {
      await axios.post('https://boiling-caverns-16943.herokuapp.com/messages/', packagedPayload)
    },
    async getCreator() {
      const res = await axios.get(`https://boiling-caverns-16943.herokuapp.com/users/${this.group.creator}`)
      this.creator = res.data
    },
    handleChange(e) {
      this[e.target.name] = e.target.value
    },
    async handleSubmit(e) {
      e.preventDefault()
      let time = new Date()
      time = time.toLocaleString()
      let formattedTime = time.slice(0, time.length - 6) + time.slice(time.length - 3, time.length)
      await this.createMessage(
        {
        message: this.message, 
        groupName: this.group.name, 
        senderUsername: this.user.username, 
        group: this.group.id, 
        sender: this.user.id,
        likes: 0,
        dislikes: 0,
        laughs: 0,
        time: formattedTime
        }
      )
      this.message = ''
      await this.getMessages()
    },
    async deleteGroup() {
      const res = await axios.get('https://boiling-caverns-16943.herokuapp.com/memberships/')
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].group === this.group.id) {
          await axios.delete(`https://boiling-caverns-16943.herokuapp.com/memberships/${res.data[i].id}`)
        }
      }
      await axios.delete(`https://boiling-caverns-16943.herokuapp.com/groups/${this.group.id}`)
      return this.$router.push(`/home/${this.hashUserIdForHome(this.user.id)}`)
    },
    hashUserIdForHome(integer) {
        return integer * 37 - 32
    },
    togglePosting() {
      this.posting = !this.posting
    },
    addPostMessage(message) {
      this.postMessages.push(message)
    },
    removePostMessage(message) {
      const index = this.postMessages.indexOf(message)
      console.log(index)
      if (index > -1) {
        this.postMessages.splice(index, 1)
      }
    },
    async createPost(e) {
      e.preventDefault()
      let time = new Date()
      time = time.toLocaleString()
      let formattedTime = time.slice(0, time.length - 6) + time.slice(time.length - 3, time.length)
      const newPost = await axios.post('https://boiling-caverns-16943.herokuapp.com/posts/', 
      {
        user: this.user.id,
        caption: this.caption,
        groupColor: this.group.color,
        likes: 0,
        laughs: 0,
        comments: 0,
        time: formattedTime
      }
      )
      for (let i = 0; i < this.postMessages.length; i++) {
        await axios.post('https://boiling-caverns-16943.herokuapp.com/postmessages/', 
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
      this.$router.push(`/profile/${this.hashUserIdForProfilePage(this.user.id)}/${this.hashProfileIdForProfilePage(this.creator.id)}`)
    },
    hashUserIdForProfilePage(integer) {
      return integer * 31 + 19
    },
    hashProfileIdForProfilePage(integer) {
      return integer * 13 - 392
    },
    toggleEditingImage() {
      this.editingImage = !this.editingImage
    },
    async submitImageChange() {
      if (this.newImage.slice(0, 4) !== 'http') {
        return window.alert('Please copy and paste an image address from the internet')
      }
      await axios.put(`https://boiling-caverns-16943.herokuapp.com/groups/${this.group.id}`, 
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
      await axios.put(`https://boiling-caverns-16943.herokuapp.com/groups/${this.group.id}`, 
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
      this.$router.push(`/home/${this.hashUserIdForHome(this.user.id)}`)
    },
    goToProfile() {
      this.$router.push( `/profile/${this.hashUserIdForProfilePage(this.user.id)}/${this.hashProfileIdForProfilePage(this.user.id)}`)
    },
    updateMessage(id, newMessage) {
      for (let i = 0; i < this.messages.length; i++) {
        if (this.messages[i].id === id) {
          this.messages[i] = newMessage
        }
      }
    },
    handleSortChange(e) {
      e.preventDefault()
      this.sorting = e.target.value
    },
    sort() {
      let sorted = this.messages
      if (this.sorting === 'time') {
        sorted = sorted.sort((a, b) => {
          return new Date(a.time) - new Date(b.time)
        })
        this.messages = sorted
      } else if (this.sorting === 'likes') {
        sorted = sorted.sort((a, b) => {
          return b.likes - a.likes
        })
        this.messages = sorted
      } else if (this.sorting === 'dislikes') {
        sorted = sorted.sort((a, b) => {
          return b.dislikes - a.dislikes
        })
        this.messages = sorted
      } else if (this.sorting === 'laughs') {
        sorted = sorted.sort((a, b) => {
          return b.laughs - a.laughs
        })
        this.messages = sorted
      }
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
.username {
  margin: 0 0 0 0.5vw;
  color: purple
}
.username:hover {
  color: cyan;
}
</style>
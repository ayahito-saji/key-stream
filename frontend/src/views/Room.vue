<template>
  <v-app>
    <div v-if="room" class="room">
      <h1>{{ room.displayName }}</h1>{{ rid }}
      <v-btn @click="leave()" class="ma-2" tile outlined color="error">
        <v-icon left>mdi-account-arrow-right</v-icon> ルームから退出する
      </v-btn>
      <div>
        <input type="text" v-model="email" placeholder="メールアドレス">
        <button @click="invite()">ユーザーを招待する</button>
      </div>
      <ul>
        <li v-for="joinUser in joinUsers">{{ joinUser[1].displayName }}</li>
        <li v-for="invitedUser in invitedUsers">{{ invitedUser[1].displayName }}(招待中)</li>
      </ul>
      <div v-for="message in messages">
        {{ findUserById(message[1].from)[1].displayName }}: {{ message[1].body }}
      </div>
      <Textbox/>
    </div>
    <div v-else>
      <h1>Room not found</h1>
    </div>
  </v-app>
</template>

<script>
  import Textbox from '../components/Textbox'
  export default {
    name: 'room',
    components: {
      Textbox
    },
    data() {
      return {
        email: '',
        drawer_r: false
      }
    },
    computed: {
      user: function() { return this.$store.state.authentication.user },
      joinRooms: function() { return this.$store.state.room.joinRooms },
      rid: function() { return this.$store.state.room.currentRoomId },
      room: function() { return this.rid ? this.joinRooms[this.rid] : null },
      messages: function() { return this.$store.getters['message/messages'] },
      joinUsers: function() { return this.$store.getters['user/joinUsers'] },
      invitedUsers: function() { return this.$store.getters['user/invitedUsers'] },
    },
    methods: {
      created() {
        this.$store.dispatch('room/createLife', this.$router.history.current.params.rid)
      },
      destroyed() {
        this.$store.dispatch('room/destroyLife')
        this.message = ''
      },
      invite() {
        console.log("inviting room")
        this.$store.dispatch('room/inviteUser', {email: this.email, rid: this.rid})
        this.email = ''
      },
      leave() {
        console.log("leaving room")
        this.$store.dispatch('room/leaveRoom', this.rid)
      },
      findUserById(uid) {
        return this.$store.getters['user/user'](uid)
      }
    },
    created() {
      this.created()
    },
    destroyed() {
      this.destroyed()
    },
    watch: {
      '$route'() {
        this.destroyed()
        this.created()
      }
    }
  }
</script>

<style scoped>
.v-application .error--text {
  display: block;
  margin: auto!important;
}
</style>

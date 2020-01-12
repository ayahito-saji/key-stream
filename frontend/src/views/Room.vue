<template>
  <v-app>
    <div v-if="room" class="room">
      <h1>{{ room.displayName }}</h1>{{ rid }}
      <br><br>
      <v-row align="center" justify="center">
        <v-item-group v-model="toggle_exclusive" dark class="tool-bar">
          <v-btn @click.stop="dialog2 = true">
            <v-icon left>mdi-account-group</v-icon>メンバー
          </v-btn>
          <v-btn @click.stop="dialog1 = true">
            <v-icon left>mdi-account-plus</v-icon>招待
          </v-btn>
          <v-btn @click="leave()">
            <v-icon left>mdi-account-arrow-right</v-icon> 退出
          </v-btn>
        </v-item-group>
      </v-row>
      <br>

      <v-dialog v-model="dialog1" max-width="290">
        <v-card>
          <v-card-title class="headline">メンバー招待</v-card-title>
          <v-card-text>招待するユーザーのメールアドレスを入力してください</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-text-field　v-model="email" label="メールアドレス" color="blue darken-4"></v-text-field>
            <v-btn text large color="blue darken-4" @click="dialog1 = false, invite()" dark>招待する</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog2" max-width="290">
        <v-card>
          <v-card-title class="headline">メンバー</v-card-title>
          <v-list>
            <v-list-item v-for="joinUser in joinUsers">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              {{ joinUser[1].displayName }}
            </v-list-item>
            <v-list-item v-for="invitedUser in invitedUsers">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              {{ invitedUser[1].displayName }}(招待中)
            </v-list-item>
          </v-list>
        </v-card>
      </v-dialog>

      <v-list two-line>
        <div v-for="message in messages">
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              {{ message[1].body }}
              <v-list-item-subtitle>{{ findUserById(message[1].from)[1].displayName }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
        </div>
      </v-list>

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
        drawer_r: false,
        toggle_exclusive: undefined,
        dialog1: false,
        dialog2: false
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
.room {
  padding: 70px 3% 180px;
}

.tool-bar {
  position: fixed;
  top: 10px;
  right: 4px;
  z-index: 2000;
}

.v-application .error--text {
  display: block;
  margin: auto!important;
}
</style>

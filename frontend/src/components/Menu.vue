<template>
  <v-app>
    <div v-if="user" class="menu">
      <v-list>
        <v-subheader>プロフィール</v-subheader>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ user.displayName }}</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-email</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ user.email }}</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-btn @click="logout()"　text small color="error" class="logout">ログアウト</v-btn>
        </v-list-item>
        <v-divider></v-divider>

        <v-subheader>ルーム</v-subheader>
        <v-list-item v-for="(invitedRoom, rid) in invitedRooms">
          <a href="javascript:void(0)" @click="join(rid)" class="room-link"><strong>{{ invitedRoom.displayName }}(招待中)</strong></a>
        </v-list-item>
        <v-list-item v-for="(joinRoom, rid) in joinRooms" class="rooms">
          <v-list-item-icon>
            <v-icon>mdi-message-text</v-icon>
          </v-list-item-icon>
          <v-btn text large color="blue darken-4" :to="'/'+rid">{{ joinRoom.displayName }}</v-btn>
        </v-list-item>
        <v-divider></v-divider>

        <v-subheader>ルームを作成</v-subheader>
        <v-list-item>
          <v-text-field　v-model="roomName" label="ルーム名" data-vv-name="name" color="blue darken-4"></v-text-field>
          <v-icon @click="create()">mdi-plus</v-icon>
        </v-list-item>
      </v-list>
    </div>
  </v-app>
</template>

<script>
  export default {
    name: 'menu',
    data() {
      return {
        roomName: ''
      }
    },
    computed: {
      user: function() { return this.$store.state.authentication.user },
      joinRooms: function() { return this.$store.state.room.joinRooms },
      invitedRooms: function() { return this.$store.state.room.invitedRooms }
    },
    methods: {
      login() {
        this.$store.dispatch('authentication/login')
      },
      logout() {
        this.$store.dispatch('authentication/logout').then(()=>{
          this.$router.push('/login')
        })
      },
      join(rid) {
        this.$store.dispatch('room/joinRoom', rid)
      },
      create() {
        console.log("creating room")
        this.$store.dispatch('room/createRoom', this.roomName)
        this.roomName = ''
      }
    }
  }
</script>

<style scoped lang="scss">
.logout {
  margin: auto;
}

.room-link {
  text-decoration: none;
}

.v-list-item__icon:last-of-type:not(:only-child) {
  margin-left: 0;
}

.v-btn:not(.v-btn--round).v-size--large {
  min-width: unset;
  padding: 0;
}
</style>

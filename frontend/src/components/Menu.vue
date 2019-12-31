<template>
  <div v-if="user">
    <h2>{{ user.displayName }}</h2>
    <div>{{ user.email }}</div>
    <button @click="logout()">Logout</button>
    <div v-for="(invitedRoom, rid) in invitedRooms">
      <a href="javascript:void(0)" @click="join(rid)"><strong>{{ invitedRoom.displayName }}(招待中)</strong></a>
    </div>
    <div v-for="(joinRoom, rid) in joinRooms">
      <router-link :to="'/'+rid">{{ joinRoom.displayName }}</router-link>
    </div>
    <div>
      <input type="text" v-model="roomName" placeholder="ルーム名">
      <button @click="create()">新しい部屋を作成</button>
    </div>
  </div>
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
      }
    }
  }
</script>

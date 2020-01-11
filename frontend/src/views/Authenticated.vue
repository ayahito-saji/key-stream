<template>
  <v-app>
    <div class="chat">
      <v-app-bar class="grey darken-4" dark>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" width="85%" absolute temporary>
        <Menu/>
      </v-navigation-drawer>
      <router-view/>
    </div>
  </v-app>
</template>

<script>
  import Menu from '../components/Menu'
  export default {
    components: {
      Menu
    },
    data: () => ({
      drawer: false
    }),
    created() {
      const rid = this.$router.history.current.params.rid
      if (this.$store.state.authentication.user == null) {
        this.$router.push(rid ? "/login?redirect_to="+rid : "/about")
      }
    }
  }
</script>

<style scoped lang="scss">
.chat {
  min-height: 100vh;
}
</style>

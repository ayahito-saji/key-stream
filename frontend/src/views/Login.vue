<template>
  <v-app>
    <div class="login">
      <p class="login__text">Googleアカウントで<br>ログインします</p>
      <v-btn @click="login()" x-large width="70%" max-width="300px" class="grey darken-4" dark>Login</v-btn><br>
      <v-btn to="/about" text large class="login__back">もどる</v-btn>
    </div>
  </v-app>
</template>

<script>
  export default {
    name: 'login',
    computed: {
      user: function() { return this.$store.state.authentication.user },
      isFetched: function() { return this.$store.state.authentication.isFetched }
    },
    methods: {
      login() {
        this.$store.dispatch('authentication/login')
      }
    },
    created() {
      if (this.user != null) {
        const redirect_to = this.$router.history.current.query.redirect_to
        this.$router.push(redirect_to ? redirect_to : "/")
      }
    }
  }
</script>

<style scoped lang="scss">
.login {
  min-height: 100vh;
  text-align: center;

  &__text {
    font-size: 24px;
    font-weight: bold;
    padding: 28vh 0;
  }

  &__back {
    font-size: 16px;
    margin-top: 20px;
  }
}
</style>

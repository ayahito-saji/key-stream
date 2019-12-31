<template>
  <div>
    <button @click="login()">Login</button>
    <router-link to="/about">戻る</router-link>
  </div>
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

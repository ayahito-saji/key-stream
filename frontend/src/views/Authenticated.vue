<template>
  <div>
    <Menu/>
    <router-view/>
  </div>
</template>

<script>
  import Menu from '../components/Menu'
  export default {
    components: {
      Menu
    },
    created() {
      const rid = this.$router.history.current.params.rid
      if (this.$store.state.authentication.user == null) {
        this.$router.push(rid ? "/login?redirect_to="+rid : "/about")
      }
    }
  }
</script>

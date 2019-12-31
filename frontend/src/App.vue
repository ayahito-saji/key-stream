<template>
  <div v-if="isFetched">
    <router-view/>
  </div>
  <div v-else>
    Loading...
  </div>
</template>
<script>
  import firebase from 'firebase'
  export default {
    computed: {
      isFetched: function() { return this.$store.state.authentication.isFetched }
    },
    created() {
      console.log(this.$store.dispatch('authentication/authStateChangeListener'))
    }
  }
</script>

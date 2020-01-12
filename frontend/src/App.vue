<template>
  <div v-if="isFetched">
    <router-view/>
  </div>
  <div v-else>
    <div class="loading-wrap">
      <v-progress-circular indeterminate color="blue darken-4" :size="60" :width="8" class="loading"></v-progress-circular>
    </div>
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
<style lang="scss">
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  &-wrap {
    position: relative;
    height: 100vh;
    width: 100vw;
  }
}
</style>

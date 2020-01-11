<template>
  <v-app>
    <div class="about">
      <h1 class="about__title">KEY STREAM</h1>
      <v-btn x-large to="/login" width="70%" max-width="300px" class="grey darken-4" dark>はじめる</v-btn>
    </div>
  </v-app>
</template>

<style scoped lang="scss">
.about {
  min-height: 100vh;
  text-align: center;

  &__title {
    padding: 30vh 0;
  }
}
</style>

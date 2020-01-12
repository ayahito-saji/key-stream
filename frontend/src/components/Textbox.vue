<template>
  <div>
    <v-footer padless fixed :elevation="5">
    <div style="border: solid 1px rgba(0, 0, 0, 0.42);padding: 0.5rem;width: 95%;margin: 0.7rem auto;">
      <div style="width: 100%;min-height: 3rem;position: relative;" v-bind:style="{height: line + 'rem'}">
        <div style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;font-family: inherit;font-size: 1rem;padding:0;line-height: 1rem;white-space: pre;" v-html="messageHTML"></div>
        <textarea style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;font-family: inherit;font-size: 1rem;padding:0;line-height: 1rem;white-space: pre;border: 0;outline: 0;color: rgba(0,0,0,0);caret-color: rgb(0,0,0);background: transparent;resize: none;" @input="sync"></textarea>
      </div>
    </div>
    <div style="width: 100%;text-align: right;padding: 0 0.7rem 0.7rem;">
      <v-btn @click="submit()" large color="blue darken-4" dark>送信</v-btn>
    </div>
  </v-footer>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        textbox: null
      }
    },
    computed: {
      message() { return this.$store.state.message.message },
      messageHTML() {
        let messageHTML = this.message.replace(/</g, '&lt').replace(/>/g, '&gt')
        this.joinUsers.forEach((u) => {
          let pattern = new RegExp('(@'+u[1].displayName+')', 'g')
          messageHTML = messageHTML.replace(pattern, '<span style="color: #0000ff">$1</span>')
        })
        return messageHTML
      },
      line() { return this.message.split('\n').length > 3 ? this.message.split('\n').length : 3 },
      joinUsers: function() { return this.$store.getters['user/joinUsers'] },
    },
    methods: {
      sync(e) {
        this.$store.commit('message/syncMessage', e.target.value)
        if (this.textbox == null)
          this.textbox = e.target
      },
      submit() {
        this.$store.dispatch('message/createMessage')
        if (this.textbox !== null)
          this.textbox.value = ""
      }
    }
  }
</script>

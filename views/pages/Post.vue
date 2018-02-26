<template>
  <div class="post-wrapper">
    <div class="container">
      <div class="title">{{post.title}}</div>
      <div class="content" v-html="post.html"></div>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    post () {
      return this.$store.state.posts
        .filter(p => p._id === this.$route.params.id)[0]
    }
  }
}
</script>
<style lang="scss">
.post-wrapper {
  .container {
    width: 56rem;
    .title {
      text-align: center;
      font-weight: 600;
      font-size: 1.6rem;
      margin:1rem 0;
    }
  }
}
</style>



<template>
  <div>
    <blog-header></blog-header>
    <router-view></router-view>
    <blog-footer />
 </div>
</template>

<script>
import * as t from 'types'
import BlogHeader from 'comps/Header'
import BlogFooter from 'comps/Footer'
export default {
  methods: {
    logout: function () {
      this.$store.dispatch(t.AUTH_LOGOUT)
        .then(() => {
          this.$router.push('/login')
        })
    }
  },
  components: {
    BlogHeader,
    BlogFooter
  }
}
</script>

<template>
 <div>
   <stars/>
   <form class="login" @submit.prevent="login">
     <h1 class="title">登录</h1>
     <div class="field username">
        <input required v-model="username" type="text" placeholder="用户名"/>
     </div>
     <div class="field password">
        <input required v-model="password" type="password" placeholder="密码"/>
     </div>
     <button class="submit" type="submit">登录</button>
   </form>
 </div>
</template>
<script>
// import Cookies from 'universal-cookie'
// import conf from 'config'
import Stars from '../components/Stars'
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login () {
      // const cookies = new Cookies()
      const {username, password} = this
      this.$store.dispatch('AUTH_REQUEST', {username, password}).then(user => {
        this.$ls.set('user', user)
        this.$router.push('/')
      })
    }
  },
  components: {Stars}
}
</script>
<style lang="stylus">
.login
  position fixed
  left 50%
  top 50%
  font-size 14px
  line-height 20px
  transform translate(-50%,-50%)
  width 360px
  color white
  padding 2rem
  .title
    margin  5rem 0
    text-align center
  .field,button[type='submit']
    margin 2rem 0
    display block
  .field
    input
      width 100%
      padding .5rem
      caret-color white
      color white
      border-radius .4rem
      border: none;
      outline: none;
      background rgba(0,0,0,0)
      border-bottom-color gray
      border-bottom-style solid
      border-bottom-width 1px
      &:focus
        border-bottom-color white
        transition all .5s linear
        border-bottom-width 2px
  button[type='submit']
    display inline-block
    width 100%
    padding .5rem 0
    border-radius .4rem
    &:hover
      background rgba(0,0,0,0)
      cursor pointer
      color white
</style>

<template>
   <div>
   <form class="login" @submit.prevent="register">
     <h1>Register</h1>
     <label>User name</label><hr/>
     <input required v-model="username" type="text" placeholder="Snoopy"/><hr/>
     <label>Email</label><hr/>
     <input required v-model="email" type="text" placeholder="Snoopy"/><hr/>
       <label>Password</label><hr/>
     <input required v-model="password" type="password" placeholder="Password"/>
     <hr/>
     <button type="submit">Register</button>
   </form>
 </div>
</template>
<script>
import { Register } from '@/api'
export default {
  data () {
    return {
      password: '',
      email: '',
      username: ''
    }
  },
  methods: {
    register () {
      const {username, password, email} = this
      Register({username, password, email}).then(() => {
        this.$store.dispatch('AUTH_REQUEST', {username, password}).then(() => {
          this.$router.push('/')
        })
      }).catch(e => {
      })
    }
  }
}
</script>

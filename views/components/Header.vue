<template>
  <div class="header">
    <div class="container">
        <div class="title" @click="$router.push('/')">DolbyDot</div>
        <div class="options right">
          <span><i class="fas fa-search"></i></span>
          <span class="notification"><i class="fas fa-bell"></i></span>
          <span class="dropdown"  @click="()=>{this.showMenu = !this.showMenu}">
            <a class="avatar">
            </a>
            <ul class="menu" ref="" v-show="this.showMenu">
              <li class="hello"><span>Hello {{curUser.name || 'World'}}</span></li>
              <li class="divider"></li>
              <li @click="$router.push('/write')"><span>新建文章</span></li>
              <li><span>修改资料</span></li>
              <li @click="logOut()"><span>退出登录</span></li>
            </ul>
          </span>
        </div>
    </div>
    <!-- <img src="/favicon.png" alt="" class="avatar">
    <ul class="options">
      <li class="active"><a>博客</a></li>
      <li><a>热门</a></li>
      <li><a>意见</a></li>
      <li><a>关于</a></li>
    </ul>
    <div class="search">
      <input type="text">
      <span class="iconfont icon-search"></span>
    </div>
    <div class="dropdown">
      <img src="/favicon.png" alt="" class="avatar">
      <ul class="about">
        <li><router-link to="/write">提笔</router-link></li>
        <li>编辑资料</li>
        <li>退出</li>
      </ul>
    </div> -->
  </div>
</template>

<script>
import Cookies from 'universal-cookie'
import conf from 'config'
import * as t from 'types'
export default {
  name: 'blog-header',
  data () {
    return {
      showMenu: false,
      showSearch: false
    }
  },
  methods: {
    logOut () {
      const cookies = new Cookies()
      this.$ls.remove('user')
      cookies.remove(conf.storageNamespace + 'token')
      this.$store.commit(t.SET_USER, {})
      this.$router.push('/login')
    }
  },
  computed: {
    inputStyle () {
      return {
        'padding-left': this.showSearch ? '3px' : 0,
        'padding-right': this.showSearch ? '3px' : 0,
        width: this.showSearch ? '180px' : 0
      }
    },
    curUser () {
      return this.$store.state.user
    }
  }
}
</script>

<style lang="scss" scoped>
$gh-black: #24292e;
.header {
  width: 100%;
  background:$gh-black;
  height: 50px;
  .title {
    position: absolute;
    width: 100%;
    text-align: center;
    line-height: 50px;
    font-size: 1.5rem;
    color: rgba(255,255,255,0.75);
    font-weight: 600;
    &:hover{
      cursor: pointer;
    }
  }
  .search {
    margin-right: .5rem;
    outline: 0;
    display: inline-block;
    vertical-align: top;
    width: 180px;
    border: none;
    -webkit-transition: width .2s,padding .2s;
    transition: width .2s,padding .2s;
    cursor: pointer;
    caret-color: white;
    color:white;
    background: #6d6f72;
  }
  .options {
    padding: 15px 0;
    height: 50px;
    position: relative;
    box-sizing: border-box;

    > span{
      margin-left: .4rem;
      margin-right: .4rem;
      float: left;
      cursor: pointer;

    }
    > span:not(:last-child){
      color: invert($gh-black);
    }
    .avatar {
      display: block;
      background-image: url('/favicon.png');
      background-size: cover;
      border-radius: 3px;
      width: 20px;
      height: 20px;
    }
  }
  .carent{
    position: absolute;
    top:50%;
    left: 100%;
    width: 0;
    height: 0;
    vertical-align: middle;
    content: "";
    border: 4px solid;
    border-color: rgba(255,255,255,0.75);
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-left-color: transparent;
  }
  .menu {
    position: absolute;
    right:0;
    padding:0;
    text-align: left;
    font-size: .7rem;
    margin-top: 8px;
    width: 80px;
    top: 100%;
    z-index: 100;
    width: 120px;
    margin-top: -4px;
    list-style: none;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(27,31,35,0.15);
    border-radius: 4px;
    box-shadow: 0 3px 12px rgba(27,31,35,0.15);
    .divider {
      height: 1px;
      margin: 8px 1px;
      background-color: #e1e4e8;
    }
    li:not(.divider){
      list-style: none;
      padding: .6rem 1rem;
      margin-top:.3rem;
      margin-bottom: .3rem;
      &:hover {
        background: #0366d6;
        color:white;
      }
    }
    .hello:hover{
      background: white;
    }
  }
  .menu::after{
    position: absolute;
    content: '';
    top: -14px;
    right: 10px;
    left: auto;
    border: 7px solid transparent;
    border-bottom-color: #fff;
  }
  .iconfont{
    font-size: 20px;
    color:rgba(255,255,255,0.75);
  }
}
// .header {
//   position: relative;
//   border-bottom: 2px solid #ccc;
//   line-height: 48px;
//   display: flex;
//   justify-content: space-between;
//   .avatar {
//     border-radius: 50%;
//     height: 48px;
//     vertical-align: top;
//   }
//   .options {
//     width: 50%;
//     display: flex;
//     justify-content: space-around;
//     text-align: center;
//     font-size: 1.2em;
//     li {
//       flex-grow: 1;
//     }
//     .active{
//       transform: translateY(2px);
//       border: 2px solid #ccc;
//       border-bottom-color: white;
//       color: black;
//     }
//   }
//   .search{
//     position: relative;
//     input{
//       padding:0 14px 0 5px;
//     }
//     .icon-search {
//       position: absolute;
//       right: 5px;
//     }
//   }
//   .dropdown{
//     cursor: pointer;
//     &:hover>.about{
//       display: block;
//     }
//     .about {
//       display: none;
//       position: absolute;
//       top: 48px;
//       right: -1px;
//       padding-left: 10px;
//       padding-right: 10px;
//       border: 1px solid #ccc;
//       border-top: none;
//       li:not(:last-child) {
//         border-bottom: 1px solid #ccc;
//       }
//     }
//   }
// }

</style>





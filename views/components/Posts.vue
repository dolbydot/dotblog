<template>
<div class="container">
  <div class="section posts">
    <main>
      <template v-for="post in posts">
        <div class="post" :key="post.id">
          <h4 class="title" @click="view(post)">{{post.title}}</h4>
          <ul class="meta">
            <li class="author">
              <img src="/favicon.png" alt="" class="avatar">
              <span>{{post.author.name}}</span></li>
            <li class="created">
              <i class="fas fa-calendar-alt"></i><span >{{post.created | formateDate}}</span></li>
            <li class="tag"><i class="fas fa-tag"></i><span>{{post.tags[0].tagName}}</span></li>
          </ul>
          <div class="abstract" v-html="post.abstract">
          </div>
          <ul class="feedback">
            <li class="thumbsup">
              <span class="fas fa-thumbs-up"></span><span>{{post.up}}</span></li>
            <li class="heart">
              <span class="fas fa-heart"></span><span>{{post.heart}}</span></li>
            <li class="comment">
              <span class="fas fa-comments"></span><span>{{post.comments}}</span></li>
            <li class="pv">
              <span class="fas fa-eye"></span><span>{{post.pv}}</span></li>
          </ul>
        </div>
      </template>

    </main>
  </div>
</div>
</template>

<script>
import * as t from 'types'
import moment from 'moment'

export default {
  name: 'posts',
  asyncData ({store}) {
    return store.dispatch(t.FETCH_POSTS)
  },
  created () {
    // this.$store.dispatch(t.FETCH_TAGS)
  },
  computed: {
    tags () {
      return this.$store.state.tags
    },
    posts () {
      return this.$store.state.posts
    }
  },
  methods: {
    view (post) {
      this.$router.push('/post/' + post._id)
    }
  },
  filters: {
    formateDate (a) {
      return moment(new Date(a).toISOString()).format('YYYY-MM-DD H:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
$gh-blue: #0366d6;
$meta-gray: #6a737d;
@mixin meta-item {
  padding-right: 1.5rem;
  font-size: .87rem;
  span {
    padding-left: .4rem;
  }
  span:hover{
    cursor: pointer;
    border-bottom: 1px solid black;
  }
}
.posts {
  display: flex;
  justify-content: space-between;
  text-align: left;
  line-height: 48px;

  main {
    margin: 20px auto;
    line-height: 30px;
    width: 685px;
    .post {
      border-bottom: 1px solid #ccc;
      margin-bottom: 15px;
      .title {
        font-weight: 500;
        font-size: 1.3rem;
        &:hover{
          cursor: pointer;
          color: $gh-blue;
        }
      }
      .meta {
        display: flex;
        margin-top: .2rem;
        margin-bottom: .8rem;
        color: $meta-gray;
        svg {
          fill: currentColor;
        }
        li {
         @include  meta-item ;
        }
        .avatar {
          border-radius: 50%;
          height: 1.5rem;
          width:1.5rem;
          vertical-align: top;
        }
      }
      .feedback {
        display: flex;
        color: $meta-gray;
        li {
         @include  meta-item ;
        }
      }
    }
  }

  aside {
    width: 200px;
    padding-left: 10px;
    margin-top: 20px;
    .notice {
      margin-bottom: 40px;
    }
    .comment {
      p {
        line-height: 20px;
        text-align: right;
      }
    }
  }
}
</style>


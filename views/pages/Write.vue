<template>
  <div class="editor">
  <div class="container">
    <div class="head">
      <input class="title" placeholder="请输入文章标题" v-model="title"/>
      <select name="text" class="tag" ref="tag">
        <template v-for="tag in tags">
          <option :key="tag._id" :value="tag._id">{{tag.tagName}}</option>
        </template>
      </select>
      <button type="submit" class="submit" @click="publish">发布文章</button>
    </div>
    <div class="toolbar">
      <span @click="()=>this.writing = true" :class="{ active: this.writing === true }">Write</span>
      <span @click="()=>this.writing = false" :class="{ active: this.writing !== true }">Preview</span>
      <ul class="shortcuts">
        <li><span><b>B</b></span></li>
        <li><span><i>I</i></span></li>
        <li><span>H</span></li>
      </ul>
    </div>
    <div class="contentarea" >
      <textarea ref="textarea" v-show="writing" @keyup.stop="()=>{}" v-model="content"  v-shortkey="{bold: ['meta','b'], h1: ['meta','h']}" @shortkey="theAction()"/>
      <div v-show="!writing" class="preview markdown-body" v-html="html"></div>
    </div>
  </div>
</div>

</template>
<script>
import * as t from 'types'
import marked from 'marked'
import conf from 'config'
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  xhtml: false,
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value
  }
})
export default {
  asyncData ({ store }) {
    return store.dispatch(t.FETCH_TAGS)
  },
  data () {
    return {
      title: '',
      content: '\n<--abstract-->\n',
      tagId: '',
      writing: true
    }
  },
  computed: {
    tags () {
      return this.$store.state.tags
    },
    html () {
      return marked(this.content.split(conf.abstractSaparater).join(''))
    }
  },
  methods: {
    publish () {
      const post = {
        author: this.$store.state.user._id,
        title: this.title,
        content: this.content,
        tags: [this.$refs.tag.value]
      }
      this.$store.dispatch(t.PUBLISH_POST, post).then(() => {
        this.$router.push('/')
      })
    },
    theAction () {
      // https:// stackoverflow.com/questions/34968174/set-text-cursor-position-in-a-textarea
      switch (event.srcKey) {
        case 'bold':
          this.bold()
          break
        case 'h1':
          this.h1()
          break
      }
    },
    bold () {
      const txtarea = this.$refs.textarea
      const start = txtarea.selectionStart
      const end = txtarea.selectionEnd
      const sel = txtarea.value.substring(start, end)
      const finText = txtarea.value.substring(0, start) + '**' + sel + '**' + txtarea.value.substring(end)
      txtarea.value = finText
      this.content = finText
      txtarea.focus()
      txtarea.selectionEnd = end + 2
    },
    h1 () {
      const txtarea = this.$refs.textarea
      const start = txtarea.selectionStart
      const end = txtarea.selectionEnd
      const sel = txtarea.value.substring(start, end)
      const finText = txtarea.value.substring(0, start) + '# ' + sel + '\n' + txtarea.value.substring(end)
      txtarea.value = finText
      this.content = finText
      txtarea.focus()
      txtarea.selectionEnd = end + 1
    },
    h2 () {

    },
    h3 () {

    }
  }
}
</script>
<style lang="scss" scoped>
.editor {
  padding-top:1rem;
  .head{
  display: flex;
  .title{
    width: 100%;
    padding: .375rem .75rem;
    font-size: 1.3rem;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: .25rem;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    flex:1;
    &:focus{
      outline: none;
      border-color: black;
    }
  }
  .tag{
    margin-left: 2rem;
  }
  .submit{
    padding: .8rem;
    margin-left: 2rem;
  }
}
.toolbar{
  margin-top:2rem;
  &>span{
    display: inline-block;
    padding: .8rem;
    transition: all .15s linear;
    border-bottom:1px solid white;
    font-weight: 100;
    &:hover{
      cursor: pointer;
    }
    &.active {
      font-weight:800;
      border-bottom-color:gray;
    }
  }
  .shortcuts{
    float: right;
    li{
      float: left;
      padding: 0 1rem;
    }
  }
}
.contentarea{
  textarea{
    margin-top: 1rem;
    width: 100%;
    padding:1rem;
    min-height: 450px;
    border-color: gray;
    &:focus{
      outline: none;
      color: #495057;
      background-color: #fff;
      border-radius: .2rem;
      border-color: black;
    }
  }
  .preview{
    margin-top: 1rem;
    min-height: 450px;
  }
}
}

</style>


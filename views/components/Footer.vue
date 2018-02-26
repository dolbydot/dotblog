<template>
<div class="footer">
  <div class="container">
    <ul>
      <li><a href="/"> <i class="fas fa-home"></i></a></li>
      <li><a href="https://github.com/dolbydot"> <i class="fab fa-github"></i></a></li>
      <li><a href="mailto:dolby.dot@gmail.com"><i class="fab fa-weixin"></i></a></li>
      <li><a href="mailto:dolby.dot@gmail.com"><i class="far fa-envelope"></i></a></li>
    </ul>
  </div>
</div>
</template>

<style lang="scss">
.footer {
  padding: 2rem 0;
  // background: #495057;
  text-align: center;
  li {
    display: inline-block;
    padding-left: 1rem;
    padding-right: 1rem;
    a{
      color: black;
      &:hover{
        color: gray;
      }
    }
    &:hover {
      cursor: pointer;
    }
  }
}
</style>




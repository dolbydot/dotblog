<template>
  <div id="stars">
  </div>
</template>
<script>
import * as THREE from 'three'
export default {
  name: 'stars',
  mounted () {
    let scene = new THREE.Scene()
    let camera
    const renderer = new THREE.WebGLRenderer()
    let starCount = 6000
    let particle

    function initScene () {
      renderer.setSize(window.innerWidth, window.innerHeight)
      document.querySelector('#stars').appendChild(renderer.domElement)
      camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 1, 6000)
      camera.position.set(0, 0, 0)
      var sphere = new THREE.SphereGeometry(1.3, 32, 32)
      var material = new THREE.MeshBasicMaterial({
        color: 0xaaaa99
      })
      for (let i = 0; i < starCount; i++) {
        particle = new THREE.Mesh(sphere, material)
        particle.position.x = getPosition()
        particle.position.y = getPosition()
        particle.position.z = getPosition()
        scene.add(particle)
      }
      requestAnimationFrame(render)
    }

    function getPosition () {
      let seed = Math.random()
      let res = seed > 0.5 ? (Math.random() * 3800) : -(Math.random() * 3800)
      return res
    }
    function render () {
      renderer.render(scene, camera)
      camera.rotation.x += 0.0003
      camera.rotation.z += 0.0003
      camera.rotation.y += 0.0003
      requestAnimationFrame(render)
    }
    initScene()
  }
}
</script>
<style lang="stylus">
#stars
  font-size 0
::-webkit-scrollbar
  width 0
  background transparent
</style>


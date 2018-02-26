
const fs = require('fs')
const path = require('path')
const LRU = require('lru-cache')
const config = require('config')
const Cookies = require('universal-cookie')
const { createBundleRenderer } = require('vue-server-renderer')
// const {asyncHandler} = require('../utils')

const resolve = file => path.resolve(__dirname, file)
const isProd = process.env.NODE_ENV === 'production'
const templatePath = resolve('../views/template.html')
const serverBundlePath = '../dist/vue-ssr-server-bundle.json'
const clientManifestPath = '../dist/vue-ssr-client-manifest.json'
let readyPromise, renderer
const createRenderer = (bundle, options) => createBundleRenderer(bundle, Object.assign(options, {
// https://ssr.vuejs.org/zh/api.html#renderer-options
  cache: LRU({
    max: 1000,
    maxAge: 1000 * 60 * 15
  }),
  basedir: resolve('../dist'),
  runInNewContext: false
}))

const render = app => {
  if (isProd) {
    const template = fs.readFileSync(templatePath, 'utf-8')
    const bundle = require(serverBundlePath)
    const clientManifest = require(clientManifestPath)
    renderer = createRenderer(bundle, {
      template,
      clientManifest
    })
  } else {
    readyPromise = require('../build/setup-dev-server')(
      app,
      templatePath,
      (bundle, options) => {
        renderer = createRenderer(bundle, options)
      }
    )
  }

  // TODO: update code
  const genHTML = context => new Promise((resolve, reject) => {
    const cb = (err, html) => {
      if (err) throw err
      resolve(html)
    }
    if (isProd) return renderer.renderToString(context, cb)
    readyPromise.then(() => renderer.renderToString(context, cb))
  })

  return (req, res) => {
    const context = {
      title: config.get('app'),
      url: req.url,
      cookies: new Cookies(req.headers.cookie)
    }
    res.set('Content-Type', 'text/html')
    genHTML(context).then(html => res.send(html))
      .catch(e => {
        console.error(e)
        res.send('err')
      })
  }
}
module.exports = render

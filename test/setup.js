process.env.NODE_ENV = 'test'
require('babel-register')()
var jsdom = require('jsdom').jsdom
var enzyme = require('enzyme')
var Adapter = require('enzyme-adapter-react-16')
var exposedProperties = ['window', 'navigator', 'document']

global.document = jsdom('')
global.navigator = { userAgent: 'node.js' }
global.window = document.defaultView
enzyme.configure({adapter: new Adapter()})
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property)
    global[property] = document.defaultView[property]
  }
})

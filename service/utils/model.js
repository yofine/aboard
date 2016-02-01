const thinky = require('thinky')
const models = require('../models')
const _ = require('lodash')

let Models = {}

let build = function(name) {
  return Models[name]
}

let init = function(opt) {
  let ty = thinky(opt)
  _.each(models, function(v, k) {
    Models[k] = v(ty)
  })
}

module.exports = {
  init: init,
  build: build
}

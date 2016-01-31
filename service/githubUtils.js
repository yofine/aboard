const rq = require('request-promise')
const config = require('./config')

module.exports = {

  access_token: function(code, state) {

    let body = {
      client_id: config.github.client_id,
      client_secret: config.github.client_secret,
      code: code,
      state: state,
      redirect_uri: config.github.redirect_uri
    }
    let options = {
      uri: "https://github.com/login/oauth/access_token",
      method: 'POST',
      body: body,
      json: true
    }
    return rq(options)
  },

  user: function(access_token) {
    let uri = 'https://api.github.com/user?access_token=' + access_token
    console.log(uri)

    let options = {
      uri: uri,
      method: 'GET',
      headers: {
        'User-Agent': 'node.js'
      },
      json: true
    }
    return rq(options)
  }
}


const koa = require('koa')
const app = koa()

const logger = require('koa-logger')()
const koaBody = require('koa-body')()
const router = require('koa-router')()
const r = require('rethinkdb')

const config = require('./config')
const connectOptions = config.db
const github = require('./githubUtils')

app.use(logger)
app.use(koaBody)

function *home(next) {
  this.body = "Welcome"

}

function *auth(next) {
  let response = yield github.access_token(this.request.query.code, this.request.query.state)
  console.log(response.access_token)
  let user_data = yield github.user(response.access_token)
  console.log(user_data)
  this.hooks = {}
  this.hooks.access_token = response.access_token
  this.hooks.user_data = user_data
  yield next
  let url = '/session/create?access_token=' + response.access_token
  this.redirect(url)
}

function *user(next) {
  let user_data = this.hooks.user_data
  let conn = yield r.connect(connectOptions)
  let result = yield r.table('user').filter({name: user_data.name}).run(conn)
  let user = yield result.toArray()
  if(!user.length) {
    let user = {
      name: user_data.name,
      email: user_data.email,
      created_at: r.now(),
      role: 'member',
      avatar_url: user_data.avatar_url,
    }
    let userInsert = yield r.table('user').insert(user, {return_changes: true}).run(conn)
  }
}

function *session(next) {
  let session = null
  let user_data = null
  let access_token = this.request.headers.authorization
  if(access_token) {
    try {
      user_data = yield github.user(access_token)
    } catch (err) {
      if(err) {
        return this.body = JSON.stringify(err.error)
      }
    }
    let conn = yield r.connect(connectOptions)
    let result = yield r.table('user').filter({name: user_data.name}).run(conn)
    let user = yield result.toArray()
    if(user.length) {
      session = {
        avatar: user[0].avatar_url,
        created_at: user[0].created_at,
        email: user[0].email,
        id: user[0].id,
        name: user[0].name,
      }
    }
  }
  if(session) {
    this.body = session
  } else {
    this.body = {
      name: 'guest',
      guest: true
    }
  }
}


router.get('/', home)
router.get('/auth/github/callback', auth, user)
router.get('/session', session)

app.use(router.routes())
app.listen(9001, function() {
  console.log('run')
})

/**
 * TODO
 * 1、将现在 controller 部分抽象出 model 和 controller，
 * 2、在 model 部分加上字段检查
*/

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

//home controller
function *home(next) {
  this.body = "Welcome"
}

// auth
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

//user controller
let user = {
  add: function *(next) {
    let user_data = this.hooks.user_data
    let conn = yield r.connect(connectOptions)
    let result = yield r.table('user').filter({name: user_data.name}).run(conn)
    let user = yield result.toArray()
    if(!user.length) {
      let user = {
        name: user_data.name,
        email: user_data.email,
        created_at: r.now(),
        updated_at: r.now(),
        role: 'member',
        avatar_url: user_data.avatar_url,
        github_id: user_data.id
      }
      let userInsert = yield r.table('user').insert(user, {return_changes: true}).run(conn)
    }
  }
}

//checkAuth
function *checkAuth(next) {
  this.authorized = false
  let access_token = this.request.headers.authorization
  let user_data = null
  if(access_token) {
    try {
      user_data = yield github.user(access_token)
    } catch (err) {
      if(err) {
        return this.body = JSON.stringify(err.error)
      }
    }
    let conn = yield r.connect(connectOptions)
    let result = yield r.table('user').filter({github_id: user_data.id}).run(conn)
    let user = yield result.toArray()
    if(user[0] && user[0].name == user_data.name) {
      this.authorized = true
      this.session = {
        avatar: user[0].avatar_url,
        created_at: user[0].created_at,
        email: user[0].email,
        id: user[0].id,
        name: user[0].name,
      }
    }
    conn.close()
  }
  yield next
}

//session controller
function *session(next) {
  if(this.authorized) {
    this.body = this.session
  } else {
    this.body = {
      name: 'guest',
      guest: true
    }
  }
}

//project controller
let project = {
  add: function *(next) {
    if(!this.authorized) {
      this.status = 401
    } else {
      let p = {
        creator_id: this.session.id,
        name: this.request.body.name,
        url: 'http://1231.com',
        describe: this.request.body.describe,
        cover_image: 'http://1213231/1.png',
        created_at: r.now(),
        updated_at: r.now()
      }
      let conn = yield r.connect(connectOptions)
      let pInsert = yield r.table('project').insert(p, {return_changes: true}).run(conn)
      this.body = pInsert.changes[0].new_val
    }
  },
  list: function *(next) {
    let startIndex = +this.request.query.startIndex || 0
    let maxResults = +this.request.query.maxResults || 10
    let conn = yield r.connect(connectOptions)
    let pFind = yield r.table('project').orderBy({index: r.desc('created_at')}).skip(startIndex).limit(maxResults).run(conn)
    this.body = yield pFind.toArray()
    conn.close()
  },
  detail: function *(next) {
    console.log(this.params)
    let conn = yield r.connect(connectOptions)
    let pFind = yield r.table('project').get(this.params.id).run(conn)
    this.body = pFind
    conn.close()
  },
  update: function *(next) {
    this.body = '开发中'
  },
  remove: function *(next) {
    this.body = '开发中'
  }
}

let review = {
  add: function *(next) {
    if(!this.authorized) {
      this.status = 401
    } else {
      let re = {
        created_id: this.session.id,
        project_id: this.params.projectId,
        score: this.request.body.score,
        title: this.request.body.title,
        advantage: this.request.body.advantage,
        defect: this.request.body.defect,
        created_at: r.now(),
        updated_at: r.now()
      }
      console.log(re)
      let conn = yield r.connect(connectOptions)
      let reInsert = yield r.table('review').insert(re, {return_changes: true}).run(conn)
      this.body = reInsert.changes[0].new_val
    }
  },
  list: function *(next) {
    let startIndex = +this.request.query.startIndex || 0
    let maxResults = +this.request.query.maxResults || 10
    let conn = yield r.connect(connectOptions)
    let reFind = yield r.table('review').orderBy({index: r.desc('created_at')}).filter({project_id: this.params.projectId}).skip(startIndex).limit(maxResults).run(conn)
    this.body = yield reFind.toArray()
    conn.close()
  }
}

//home
router.get('/', home)

//auth github callback
router.get('/auth/github/callback', auth, user.add)

//session
router.get('/session', checkAuth, session)

//project
router.post('/projects', checkAuth, project.add)
router.get('/projects', project.list)
router.get('/projects/:id', project.detail)
router.put('/projects/:id', project.update)
router.delete('/projects/:id', project.remove)

//review
router.post('/projects/:projectId/reviews', checkAuth, review.add)
router.get('/projects/:projectId/reviews', review.list)

app.use(router.routes())
app.listen(9001, function() {
  console.log('run')
})

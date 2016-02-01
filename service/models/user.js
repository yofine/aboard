//user model

module.exports = function(thinky) {
  const type = thinky.type
  const r = thinky.r
  const User = thinky.createModel('user', {
    id: type.string(),
    name: type.string(),
    email: type.string(),
    createdAt: type.date().default(r.now()),
    updatedAt: type.date().default(r.now()),
    avatar: type.string(),
    custome_data: type.object()
  })
  return User
}

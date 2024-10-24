const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')
const Session = require('./session')

Blog.belongsTo(User)
User.hasMany(Blog)
Session.belongsTo(User)
User.hasOne(Session)

Blog.belongsToMany(User, { through: ReadingList, as: 'user_selected' })
User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })

module.exports = {
  Blog,
  User,
}

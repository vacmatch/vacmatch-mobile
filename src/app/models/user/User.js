
class User {

  constructor (id, type, username, password, userId) {
    this.id_ = id
    this.databaseType = type ? type : 'user'
    this.username = username ? username : ''
    this.password = password ? password : ''
  }

}

module.exports = User

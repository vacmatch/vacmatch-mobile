import RefereeUserType from '../web/user/RefereeUserType'

class User {

  constructor (id, type, username, password, avatarUrl, email, firstName, lastName, cardId, signKey) {
    this.id_ = id
    this.databaseType = type ? type : 'user'
    this.username = username
    this.password = password
    this.avatarUrl = avatarUrl
    this.email = email
    this.firstName = firstName
    this.lastName = lastName
    this.cardId = cardId
    this.signKey = signKey
    this.userType = RefereeUserType.type
  }

}

module.exports = User

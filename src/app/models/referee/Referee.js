
class Referee {

  constructor (id, name, cardId, avatarUrl, userId) {
    this._id = id
    this.databaseType = 'referee'
    this.name = name
    this.cardId = cardId
    this.avatarUrl = avatarUrl
    this.userId = userId
    // TODO: Add real fedId
    this.fedId = 1
  }

}

module.exports = Referee

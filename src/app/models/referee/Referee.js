
class Referee {

  constructor (id, type, name, cardId, avatarUrl, userId) {
    this._id = id
    this.type = type ? type : 'referee'
    this.name = name
    this.cardId = cardId
    this.avatarUrl = avatarUrl
    this.userId = userId
    // TODO: Add real fedId
    this.fedId = 1
  }

}

module.exports = Referee


export default class Referee {

  constructor (type, name, cardId, avatarUrl, userId) {
    this.type = type
    this.name = name
    this.cardId = cardId
    this.avatarUrl = avatarUrl
    this.userId = userId
    // TODO: Add real fedId
    this.fedId = 1
  }

}

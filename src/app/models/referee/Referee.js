
export default class Referee {

  constructor (type, name, cardId, avatarUrl, userId) {
    this.type = type ? type : 'referee'
    this.name = name ? name : ''
    this.cardId = cardId ? type : ''
    this.avatarUrl = avatarUrl ? avatarUrl : ''
    this.userId = userId ? userId : ''
    // TODO: Add real fedId
    this.fedId = 1
  }

}

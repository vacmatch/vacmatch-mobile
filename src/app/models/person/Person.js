
class Person {

  constructor (id, type, name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, teamId, userId) {
    this._id = id
    this.type = type ? type : 'person'
    this.name = name
    this.cardId = cardId
    this.dorsal = dorsal
    this.avatarUrl = avatarUrl
    this.isCalled = isCalled
    this.isStaff = isStaff
    this.reportId = reportId
    this.teamId = teamId
    this.userId = userId
  }

}

module.exports = Person

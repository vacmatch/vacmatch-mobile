
class Person {

  constructor (type, name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, teamId, userId) {
    this.type = type ? type : 'person'
    this.name = name ? name : ''
    this.cardId = cardId ? cardId : ''
    this.dorsal = dorsal ? dorsal : ''
    this.avatarUrl = avatarUrl ? avatarUrl : ''
    this.isCalled = isCalled ? isCalled : false
    this.isStaff = isStaff ? isStaff : false
    this.reportId = reportId ? reportId : ''
    this.teamId = teamId ? teamId : ''
    this.userId = userId ? userId : ''
  }

}

module.exports = Person

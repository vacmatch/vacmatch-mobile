
class Signature {

  constructor (id, userId, reportId, hash, timeStamp, identifier, name, teamId, fedId) {
    this._id = id
    this.databaseType = 'signature'
    this.userId = userId
    this.reportId = reportId
    this.hash = hash
    this.timeStamp = timeStamp
    this.identifier = identifier
    this.name = name
    this.teamId = teamId
    this.fedId = fedId
  }

}

module.exports = Signature

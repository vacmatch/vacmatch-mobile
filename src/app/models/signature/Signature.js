
class Signature {

  constructor (id, type, userId, reportId, hash, timeStamp, identifier, name, teamId, fedId) {
    this._id = id
    this.databaseType = type ? type : 'signature'
    this.userId = userId ? userId : ''
    this.reportId = reportId ? reportId : ''
    this.hash = hash ? hash : ''
    this.timeStamp = timeStamp ? timeStamp : ''
    this.identifier = identifier ? identifier : ''
    this.name = name ? name : ''
    this.teamId = teamId ? teamId : ''
    this.fedId = fedId ? fedId : ''
  }

}

module.exports = Signature


export default class Signature {

  constructor (type, userId, reportId, hash, timeStamp, identifier, name, teamId, fedId) {
    this.databaseType = type
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

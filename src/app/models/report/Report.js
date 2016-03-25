
class Report {

  constructor (id, date, location, hasFinished, localTeam, visitorTeam, refereeList) {
    this._id = id
    this.databaseType = 'report'
    this.date = date
    this.location = location
    this.hasFinished = hasFinished
    this.localTeam = visitorTeam ? {
      _id: localTeam._id,
      name: localTeam.name,
      result: localTeam.result,
      secondaryField: localTeam.secondaryField
    } : null
    this.visitorTeam = visitorTeam ? {
      _id: visitorTeam._id,
      name: visitorTeam.name,
      result: visitorTeam.result,
      secondaryField: visitorTeam.secondaryField
    } : null
    this.incidences = ''
    this.refereeList = refereeList
  }

}

module.exports = Report

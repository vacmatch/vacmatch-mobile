
class Report {

  constructor (id, type, date, location, hasFinished, localTeam, visitorTeam, refereeList) {
    this._id = id
    this.databaseType = type ? type : 'report'
    this.date = date ? date : ''
    this.location = location ? location : ''
    this.hasFinished = hasFinished ? hasFinished : false
    this.localTeam = {
      _id: localTeam ? localTeam._id : '',
      name: localTeam ? localTeam.name : '',
      result: localTeam ? localTeam.result : 0,
      secondaryField: localTeam ? localTeam.secondaryField : 0
    }
    this.visitorTeam = {
      _id: visitorTeam ? visitorTeam._id : '',
      name: visitorTeam ? visitorTeam.name : '',
      result: visitorTeam ? visitorTeam.result : 0,
      secondaryField: visitorTeam ? visitorTeam.secondaryField : 0
    }
    this.incidences = ''
    this.refereeList = refereeList ? refereeList : []
  }

}

module.exports = Report

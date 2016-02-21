
export default class Report {

  constructor (type, date, location, hasFinished, localTeam, visitorTeam, refereeList) {
    this.databaseType = type ? type : 'report'
    this.date = date ? date : ''
    this.location = location ? location : ''
    this.hasFinished = hasFinished ? hasFinished : false
    this.localTeam = {
      _id: localTeam ? localTeam._id : '',
      teamName: localTeam ? localTeam.teamName : '',
      result: localTeam ? localTeam.result : 0,
      secondaryField: localTeam ? localTeam.secondaryField : 0
    }
    this.visitorTeam = {
      _id: visitorTeam ? visitorTeam._id : '',
      teamName: visitorTeam ? visitorTeam.teamName : '',
      result: visitorTeam ? visitorTeam.result : 0,
      secondaryField: visitorTeam ? visitorTeam.secondaryField : 0
    }
    this.incidences = ''
    this.refereeList = refereeList ? refereeList : []
  }

}

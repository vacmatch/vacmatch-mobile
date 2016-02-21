
export default class Report {

  constructor (type, date, location, hasFinished, localTeam, visitorTeam, refereeList) {
    this.databaseType = type ? type : 'report'
    this.date = date ? date : ''
    this.location = location ? location : ''
    this.hasFinished = hasFinished ? hasFinished : false
    this.localTeam = {
      _id: localTeam ? localTeam._id : '',
      teamName: localTeam ? localTeam.teamName : '',
      result: localTeam ? localTeam.result : '',
      secondaryField: localTeam ? localTeam.secondaryField : ''
    }
    this.visitorTeam = {
      _id: visitorTeam ? visitorTeam._id : '',
      teamName: visitorTeam ? visitorTeam.teamName : '',
      result: visitorTeam ? visitorTeam.result : '',
      secondaryField: visitorTeam ? visitorTeam.secondaryField : ''
    }
    this.incidences = ''
    this.refereeList = refereeList ? refereeList : []
  }

}

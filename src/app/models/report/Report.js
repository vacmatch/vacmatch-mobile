
export default class Report {

  constructor (type, date, location, hasFinished, localTeam, visitorTeam, refereeList) {
    this.databaseType = type
    this.date = date
    this.location = location
    this.hasFinished = hasFinished
    this.localTeam = {
      id: localTeam.id,
      teamName: localTeam.teamName,
      result: localTeam.result,
      secondaryField: localTeam.secondaryField
    }
    this.visitorTeam = {
      id: visitorTeam.id,
      teamName: visitorTeam.teamName,
      result: visitorTeam.result,
      secondaryField: visitorTeam.secondaryField
    }
    this.incidences = ''
    this.refereeList = refereeList
  }

}

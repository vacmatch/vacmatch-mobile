
export class Event {

  constructor (type, reportId, person, team, eventType, matchTime, cause, timestamp) {
    this.databaseType = type ? type : 'event'
    this.reportId = reportId ? reportId : ''
    this.person = {
      _id: person ? person._id : '',
      name: person ? person.name : '',
      dorsal: person ? person.dorsal : '',
      avatarUrl: person ? person.avatarUrl : ''
    }
    this.team = {
      _id: team ? team._id : '',
      name: team ? team.teamName : ''
    }
    this.type = eventType ? eventType : ''
    this.matchTime = matchTime ? matchTime : ''
    this.text = cause ? cause : ''
    this.timestamp = timestamp ? timestamp : ''
    // TODO: Add user which create the event
  }

}

export class ControlEvent {

  constructor (type, reportId, eventType, matchTime, cause, timestamp) {
    this.databaseType = type ? type : 'event'
    this.reportId = reportId ? reportId : ''
    this.type = eventType ? eventType : ''
    this.matchTime = matchTime ? matchTime : ''
    this.text = cause ? cause : ''
    this.timestamp = timestamp ? timestamp : ''
    // TODO: Add user which create the event
  }

}

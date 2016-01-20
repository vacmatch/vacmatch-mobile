
export class Event {

  constructor (type, reportId, person, team, eventType, matchTime, cause, timestamp) {
    this.databaseType = type
    this.reportId = reportId
    this.person = {
      _id: person._id,
      name: person.name,
      dorsal: person.dorsal,
      avatarUrl: person.avatarUrl
    }
    this.team = {
      id: team.id,
      name: team.teamName
    }
    this.type = eventType
    this.matchTime = matchTime
    this.text = cause
    this.timestamp = timestamp
    // TODO: Add user which create the event
  }

}

export class ControlEvent {

  constructor (type, reportId, eventType, matchTime, cause, timestamp) {
    this.databaseType = type
    this.reportId = reportId
    this.type = eventType
    this.matchTime = matchTime
    this.text = cause
    this.timestamp = timestamp
    // TODO: Add user which create the event
  }

}

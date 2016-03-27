
class Event {

  constructor (id, reportId, person, team, eventType, matchTime, cause, timestamp) {
    this._id = id
    this.databaseType = 'event'
    this.reportId = reportId
    this.person = {
      _id: person ? person._id : null,
      name: person ? person.name : null,
      dorsal: person ? person.dorsal : null,
      avatarUrl: person ? person.avatarUrl : null
    }
    this.team = {
      _id: team ? team._id : null,
      name: team ? team.name : null
    }
    this.type = eventType
    this.matchTime = matchTime
    this.text = cause
    this.timestamp = timestamp
    // TODO: Add user which create the event
  }

}

class ControlEvent {

  constructor (id, reportId, eventType, matchTime, cause, timestamp) {
    this._id = id
    this.databaseType = 'event'
    this.reportId = reportId
    this.type = eventType
    this.matchTime = matchTime
    this.text = cause
    this.timestamp = timestamp
    // TODO: Add user which create the event
  }

}

module.exports = {
  Event: Event,
  ControlEvent: ControlEvent
}

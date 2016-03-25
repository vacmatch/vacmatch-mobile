
class Event {

  constructor (id, reportId, person, team, eventType, matchTime, cause, timestamp) {
    this._id = id
    this.databaseType = 'event'
    this.reportId = reportId
    this.person = person ? {
      _id: person._id,
      name: person.name,
      dorsal: person.dorsal,
      avatarUrl: person.avatarUrl
    } : null
    this.team = team ? {
      _id: team._id,
      name: team.name
    } : null
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

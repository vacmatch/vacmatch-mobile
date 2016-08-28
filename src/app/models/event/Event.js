//
// Copyright (c) 2016 by VACmatch
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//


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

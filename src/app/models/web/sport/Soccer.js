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

import SportEvent from '../event/SportEvent'
import GoalEvent from '../event/GoalEvent'
import FoulEvent from '../event/FoulEvent'
import YellowCardEvent from '../event/YellowCardEvent'
import RedCardEvent from '../event/RedCardEvent'

import ChangeTermEvent from '../event/control/ChangeTermEvent'
import StartMatchEvent from '../event/control/StartMatchEvent'
import EndMatchEvent from '../event/control/EndMatchEvent'

import Sport from './Sport'

class Soccer extends Sport {
  constructor () {
    super()
    this.events = [
      new GoalEvent(),
      new FoulEvent(),
      new YellowCardEvent(),
      new RedCardEvent()
    ]
    this.controlEvents = [
      new ChangeTermEvent(),
      new StartMatchEvent(),
      new EndMatchEvent()
    ]
  }

  getEvents () {
    return this.events
  }

  getEventByType (eventType) {
    // By default returns a SportEvent
    let event = new SportEvent()
    this.events.map(e => {
      if (e.areYou(eventType)) {
        event = e
      }
    })
    this.controlEvents.map(e => {
      if (e.areYou(eventType)) {
        event = e
      }
    })
    return event
  }

  getIconByType (eventType) {
    // By default returns a Goal Event
    let event = 'fa fa-times-circle'
    this.events.map(e => {
      if (e.areYou(eventType)) {
        event = e
      }
    })
    return event.iconClass
  }

  getPrimaryFieldValue (eventList, teamId) {
    let resultList = eventList.filter(function (element) { return element.team._id === teamId })
    return resultList.length.toString()
  }

  getSecondaryFieldValue (eventList, teamId) {
    let resultList = eventList.filter(function (element) { return element.team._id === teamId })
    return resultList.length.toString()
  }

}

module.exports = Soccer

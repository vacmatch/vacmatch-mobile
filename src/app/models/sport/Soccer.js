import SportEvent from '../event/SportEvent'
import GoalEvent from '../event/GoalEvent'
import FoulEvent from '../event/FoulEvent'
import YellowCardEvent from '../event/YellowCardEvent'
import RedCardEvent from '../event/RedCardEvent'

import ChangeTermEvent from '../event/control/ChangeTermEvent'
import StartMatchEvent from '../event/control/StartMatchEvent'

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
      new StartMatchEvent()
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

}

module.exports = Soccer

import GoalEvent from '../event/GoalEvent'
import FoulEvent from '../event/FoulEvent'
import YellowCardEvent from '../event/YellowCardEvent'
import RedCardEvent from '../event/RedCardEvent'
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
  }

  getEvents () {
    return this.events
  }

  getEventByType (eventType) {
    // By default returns a Goal Event
    let event = new GoalEvent()
    this.events.map(e => {
      if (e.areYou(eventType)) {
        event = e
      }
    })
    return event
  }
}

module.exports = Soccer

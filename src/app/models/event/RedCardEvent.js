import React from 'react'
import EventWithCause from '../../components/eventType/EventWithCause'
import SportEvent from './SportEvent'

class RedCardEvent extends SportEvent {
  constructor () {
    super()
    this.type = 'red-card'
    this.title = 'Red Card'
    this.subtitle = 'red card'
    this.causes = ['Insult', 'Aggression', 'Kick', 'Referee aggression']
    this.iconClass = 'fa fa-sticky-note'
    this.component = <EventWithCause/>
  }

  isControl () {
    return false
  }
}

module.exports = RedCardEvent

import React from 'react'
import EventWithCause from '../../components/eventType/EventWithCause'
import SportEvent from './SportEvent'

class YellowCardEvent extends SportEvent {
  constructor () {
    super()
    this.type = 'yellow-card'
    this.title = 'Yellow Card'
    this.subtitle = 'yellow card'
    this.causes = ['Insult', 'Aggression', 'Kick', 'Referee aggression']
    this.component = <EventWithCause/>
  }
}

module.exports = YellowCardEvent
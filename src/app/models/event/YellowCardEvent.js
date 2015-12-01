import React from 'react'
import Event from '../../components/eventType/Event'
import SportEvent from './SportEvent'

class YellowCardEvent extends SportEvent {
  constructor () {
    super()
    this.type = 'yellow-card'
    this.title = 'Yellow Card'
    this.subtitle = 'yellow card'
    this.causes = []
    this.component = <Event/>
  }
}

module.exports = YellowCardEvent

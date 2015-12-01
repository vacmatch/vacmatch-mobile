import React from 'react'
import Event from '../../components/eventType/Event'
import SportEvent from './SportEvent'

class RedCardEvent extends SportEvent {
  constructor () {
    super()
    this.type = 'red-card'
    this.title = 'Red Card'
    this.subtitle = 'red card'
    this.causes = []
    this.component = <Event/>
  }
}

module.exports = RedCardEvent

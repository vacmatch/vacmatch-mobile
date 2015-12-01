import React from 'react'
import Event from '../../components/eventType/Event'
import SportEvent from './SportEvent'

class FoulEvent extends SportEvent {
  constructor () {
    super()
    this.type = 'foul'
    this.title = 'Foul'
    this.subtitle = 'foul'
    this.causes = []
    this.component = <Event/>
  }
}

module.exports = FoulEvent

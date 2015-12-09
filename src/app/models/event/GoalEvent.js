import React from 'react'
import Event from '../../components/eventType/Event'
import SportEvent from './SportEvent'

class GoalEvent extends SportEvent {
  constructor () {
    super()
    this.type = 'goal'
    this.title = 'Goal'
    this.subtitle = 'goal'
    this.causes = []
    this.iconClass = 'fa fa-futbol-o'
    this.component = <Event/>
  }
}

module.exports = GoalEvent

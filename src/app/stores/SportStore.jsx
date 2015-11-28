import React from 'react'
import Reflux from 'reflux'

import Goal from '../components/eventType/Goal'
import Foul from '../components/eventType/Foul'

import SportActions from '../actions/SportActions'

let SportStore = Reflux.createStore({
  listenables: SportActions,

  init: function () {
    this.state = {
      eventComponent: <Goal/>
    }
  },

  getInitialState: function () {
    return this.state
  },

  /**
   * Update event component for this eventType
   */
  onUpdateEventComponent: function (eventType) {
    let component = <Goal/>
    if (eventType === 'goal') {
      component = <Goal/>
    }
    if (eventType === 'foul') {
      component = <Foul/>
    }
    this.state.eventComponent = component
    this.trigger(this.state)
  }

})

module.exports = SportStore

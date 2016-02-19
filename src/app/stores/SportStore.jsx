import Reflux from 'reflux'

import Soccer from '../models/web/sport/Soccer'

import SportActions from '../actions/SportActions'

let SportStore = Reflux.createStore({
  listenables: SportActions,

  init: function () {
    this.state = new Soccer()
  },

  getInitialState: function () {
    return this.state
  },

  onUpdateSport: function (newSport) {
    this.state = newSport
    this.trigger(this.state)
  }

})

module.exports = SportStore

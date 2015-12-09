import Reflux from 'reflux'

import MenuActions from '../actions/MenuActions'

let MenuStore = Reflux.createStore({
  listenables: MenuActions,

  init: function () {
    this.state = {
      rightMenu: []
    }
  },

  getInitialState: function () {
    return this.state
  },

  onSetRightMenu: function (items) {
    // item -> text, url, callback
    this.state.rightMenu = items
    this.trigger(this.state)
  }

})

module.exports = MenuStore

import Reflux from 'reflux'

import SnackBarActions from '../actions/SnackBarActions'

let SnackBarStore = Reflux.createStore({
  listenables: SnackBarActions,

  init: function () {
    this.state = {
      name: '',
      message: ''
    }
  },

  getInitialState: function () {
    return this.state
  },

  onGetLastElement: function () {
    return this.state.message
  },

  onSetElement: function (newElement) {
    this.state = {
      name: newElement.name,
      message: newElement.message
    }
    this.trigger(this.state)
  }

})

module.exports = SnackBarStore

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

  onGetLastError: function () {
    return this.state
  },

  onSetError: function (newErrorMessage) {
    console.log('snack-', newErrorMessage)
    this.state = {
      name: newErrorMessage.name,
      message: newErrorMessage.message
    }
    this.trigger(this.state)
  }

})

module.exports = SnackBarStore

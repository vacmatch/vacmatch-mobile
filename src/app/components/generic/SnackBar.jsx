import React from 'react'
import Reflux from 'reflux'
import mui from 'material-ui'

import SnackBarStore from '../../stores/SnackBarStore'

let Snackbar = mui.Snackbar

let SnackBarItem = React.createClass({
  mixins: [
    Reflux.connect(SnackBarStore, 'snackBar')
  ],

  onStatusChange: function (status) {
    this.refs.snack.show()
  },

  componentDidMount: function () {
    this.listenTo(SnackBarStore, this.onStatusChange)
  },

  render: function () {
    return <Snackbar key={'generic-snackbar'}
      ref='snack'
      message={this.state.snackBar.message}
      autoHideDuration={4000} />
  }
})

module.exports = SnackBarItem

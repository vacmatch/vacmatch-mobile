import React from 'react'
import mui from 'material-ui'

let FlatButton = mui.FlatButton
let Dialog = mui.Dialog
let TextField = mui.TextField

let EditReport = React.createClass({
  propTypes: {
    cronoUpdate: React.PropTypes.func,
    time: React.PropTypes.string
  },

  _showDialog: function () {
    this.refs.editDialog.show()
  },

  _handleCancel: function () {
    this.refs.editDialog.dismiss()
  },

  _handleCronoUpdate: function () {
    let time = this.refs.time.getValue()
    this.props.cronoUpdate(time)
    this.refs.editDialog.dismiss()
  },

  render: function () {
    let customActions = [
      <FlatButton
        label='Cancel'
        secondary={true}
        onTouchTap={this._handleCancel} />,
      <FlatButton
        label='Submit'
        primary={true}
        onTouchTap={this._handleCronoUpdate} />
    ]

    return (
      <div>
        <FlatButton label='Edit' primary={true} onClick={this._showDialog} />
        <Dialog ref='editDialog'
          title='Edit report'
          actions={customActions}
          isOpen={customActions}>
          <TextField ref='time'
            hintText='Insert time'
            floatingLabelText='Reset match time'
            defaultValue={this.props.time} />
        </Dialog>
      </div>
    )
  }

})

module.exports = EditReport

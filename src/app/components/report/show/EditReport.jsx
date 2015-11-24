import React from 'react'
import mui from 'material-ui'

import style from './report-style'

let FlatButton = mui.FlatButton
let Dialog = mui.Dialog
let TextField = mui.TextField

let EditReport = React.createClass({
  propTypes: {
    cronoUpdate: React.PropTypes.func,
    termUpdate: React.PropTypes.func,
    time: React.PropTypes.string,
    term: React.PropTypes.string
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

  _handleModifyTerm: function () {
    let term = this.refs.term.getValue()
    this.props.termUpdate(parseInt(term, 10))
    this.refs.editDialog.dismiss()
  },

  render: function () {
    let customActions = [
      <FlatButton
        label='Cancel'
        secondary={true}
        onTouchTap={this._handleCancel} />
    ]

    return (
      <div>
        <FlatButton label='Edit' primary={true} onClick={this._showDialog} />
        <Dialog ref='editDialog'
          title='Edit report'
          actions={customActions}
          isOpen={customActions}>
          <div style={style.container}>
            <TextField ref='time'
              hintText='Insert time'
              floatingLabelText='Reset match time'
              defaultValue={this.props.time} />
            <FlatButton
              label='Modify time'
              primary={true}
              onTouchTap={this._handleCronoUpdate} />
            <br/>
            <TextField ref='term'
              hintText='Insert new term'
              floatingLabelText='Modify term'
              defaultValue={this.props.term} />
            <FlatButton
              label='Modify term'
              primary={true}
              onTouchTap={this._handleModifyTerm} />
          </div>
        </Dialog>
      </div>
    )
  }

})

module.exports = EditReport

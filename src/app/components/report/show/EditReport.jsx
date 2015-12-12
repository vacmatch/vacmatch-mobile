import React from 'react'
import mui from 'material-ui'

import style from './report-style'

import ChangeTermEvent from '../../../models/event/control/ChangeTermEvent'

import EventActions from '../../../actions/EventActions'

let FlatButton = mui.FlatButton
let Dialog = mui.Dialog
let TextField = mui.TextField

let EditReport = React.createClass({
  propTypes: {
    reportId: React.PropTypes.string,
    cronoUpdate: React.PropTypes.func,
    termUpdate: React.PropTypes.func,
    time: React.PropTypes.string,
    term: React.PropTypes.string
  },

  getInitialState: function () {
    return {
      dialogIsOpen: false
    }
  },

  toggleDialog: function () {
    this.setState({dialogIsOpen: !this.state.dialogIsOpen})
  },

  _handleCronoUpdate: function () {
    let time = this.refs.time.getValue()
    this.props.cronoUpdate(time)
    this.toggleDialog()
  },

  _handleModifyTerm: function () {
    let term = this.refs.term.getValue()
    let event = new ChangeTermEvent()
    EventActions.addControlEvent(this.props.reportId, event.type, this.props.time, term, () => {
      this.props.termUpdate(term)
      this.toggleDialog()
    })
  },

  render: function () {
    let customActions = [
      <FlatButton
        key={'dialog-cancel'}
        label='Cancel'
        secondary={true}
        onTouchTap={this.toggleDialog} />
    ]

    return (
      <div key={'dialog-div'}>
        <FlatButton label='Edit' primary={true} onClick={this.toggleDialog} />
        <Dialog key={'dialog-edit-report'}
          ref='editDialog'
          title='Edit report'
          actions={customActions}
          open={this.state.dialogIsOpen}>
          <div style={style.containerDialog}>
            <TextField ref='time'
              key={'dialog-time-field'}
              hintText='Insert time'
              floatingLabelText='Reset match time'
              defaultValue={this.props.time} />
            <FlatButton
              key={'dialog-time'}
              label='Modify time'
              primary={true}
              onTouchTap={this._handleCronoUpdate} />
            <br/>
            <TextField ref='term'
              key={'dialog-term-field'}
              hintText='Insert new term'
              floatingLabelText='Modify term'
              defaultValue={this.props.term} />
            <FlatButton
              key={'dialog-term'}
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

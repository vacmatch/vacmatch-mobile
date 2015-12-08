import React from 'react'
import mui from 'material-ui'
import { History } from 'react-router'

import urls from '../../../api/urls'
import EventActions from '../../../actions/EventActions'
import EndMatchEvent from '../../../models/event/control/EndMatchEvent'

// Components
let Dialog = mui.Dialog
let FlatButton = mui.FlatButton

let Event = React.createClass({
  mixins: [
    History
  ],

  propTypes: {
    reportId: React.PropTypes.string,
    matchTime: React.PropTypes.number,
    addMenuElements: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      dialogIsOpen: false
    }
  },

  componentWillMount: function () {
    let elements = [
      {text: 'End game', callback: this.toggleDialog}
    ]
    this.props.addMenuElements(elements)
  },

  toggleDialog: function () {
    this.setState({dialogIsOpen: !this.state.dialogIsOpen})
  },

  _onDialogSubmit: function () {
    let event = new EndMatchEvent()
    // Check if there is an EndMatchEvent
    EventActions.getEventsByReportIdAndType(this.props.reportId, event.type, (endEvents) => {
      if (endEvents.length === 0) {
        // Add event to the db
        EventActions.addControlEvent(this.props.reportId, event.type, this.props.matchTime, '', (event) => {
          // Close dialog
          this.toggleDialog()
          // Go to the end match page
          this.history.pushState(null, urls.report.end(this.props.reportId))
        })
      } else {
        // Close dialog
        this.toggleDialog()
        // Go to the end match page
        this.history.pushState(null, urls.report.end(this.props.reportId))
      }
    })
  },

  render: function () {
    return (
    <div key={'EndMatchDialog'}>
      <Dialog
        ref='eventDialog'
        title='End match'
        open={this.state.dialogIsOpen}
        actions={
          [
            <FlatButton
            key={'dialog-cancel'}
            label='Cancel'
            secondary={true}
            onTouchTap={this.toggleDialog}/>,
            <FlatButton
            key={'dialog-acept'}
            label='Accept'
            primary={true}
            onTouchTap={this._onDialogSubmit}/>
          ]
        }
        actionFocus='submit'>
        <hr/>
        <p>
          Do you want to end this match?</p>
      </Dialog>
    </div>
    )
  }
})

module.exports = Event

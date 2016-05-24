import React from 'react'
import Reflux from 'reflux'
import mui from 'material-ui'
import { History } from 'react-router'

import urls from '../../../api/urls'
import EventActions from '../../../actions/EventActions'
import EndMatchEvent from '../../../models/web/event/control/EndMatchEvent'
import ErrorActions from '../../../actions/ErrorActions'
import ErrorHandlerStore from '../../../stores/utils/ErrorHandlerStore'
import {FormattedMessage, injectIntl, intlShape, defineMessages} from 'react-intl'

// Components
let Dialog = mui.Dialog
let FlatButton = mui.FlatButton

const messages = defineMessages({
  endGame: {
    id: 'report.endMatchDialog.button.endGame',
    description: 'End match button in right top menu',
    defaultMessage: 'End match'
  },
  endMatchTitle: {
    id: 'report.endMatchDialog.endMatch',
    description: 'End match dialog title',
    defaultMessage: 'End match'
  }
})

let EndMatchDialog = React.createClass({
  mixins: [
    History,
    Reflux.connect(ErrorHandlerStore, 'error')
  ],

  propTypes: {
    reportId: React.PropTypes.string,
    matchTime: React.PropTypes.number,
    addMenuElements: React.PropTypes.func,
    intl: intlShape.isRequired
  },

  getInitialState: function () {
    return {
      dialogIsOpen: false
    }
  },

  componentWillMount: function () {
    let elements = [
      {text: this.props.intl.formatMessage(messages.endGame), callback: this.toggleDialog}
    ]
    this.props.addMenuElements(elements)
  },

  toggleDialog: function () {
    this.setState({dialogIsOpen: !this.state.dialogIsOpen})
  },

  _onDialogSubmit: function () {
    let event = new EndMatchEvent()
    // Check if there is an EndMatchEvent
    EventActions.getEventsByReportIdAndType(this.props.reportId, event.type, (endEvents, err) => {
      if (err !== null) {
        ErrorActions.setError(err)
      } else {
        if (endEvents.length === 0) {
          // Add event to the db
          EventActions.addControlEvent(this.props.reportId, event.type, this.props.matchTime, '', (event, err) => {
            if (err !== null) {
              ErrorActions.setError(err)
            } else {
              // Close dialog
              this.toggleDialog()
              // Go to the end match page
              this.history.pushState(null, urls.report.end(this.props.reportId))
            }
          })
        } else {
          // Close dialog
          this.toggleDialog()
          // Go to the end match page
          this.history.pushState(null, urls.report.end(this.props.reportId))
        }
      }
    })
  },

  render: function () {
    let title = this.props.intl.formatMessage(messages.endMatchTitle)
    return (
    <div key={'EndMatchDialog'}>
      <Dialog
        ref='eventDialog'
        title={title}
        open={this.state.dialogIsOpen}
        actions={
          [
            <FlatButton
            key={'dialog-cancel'}
            label={
              <FormattedMessage
                  id='button.cancel'
                  description='Cancel dialog button'
                  defaultMessage='Cancel'
              />
            }
            secondary={true}
            onTouchTap={this.toggleDialog}/>,
            <FlatButton
            key={'dialog-acept'}
            label={
              <FormattedMessage
                  id='button.accept'
                  description='Accept dialog button'
                  defaultMessage='Accept'
              />
            }
            primary={true}
            onTouchTap={this._onDialogSubmit}/>
          ]
        }
        actionFocus='submit'>
        <hr/>
        <p>
          <FormattedMessage
              id='report.endMatchDialog.confirmDialog'
              description='Confirm end match text'
              defaultMessage='Do you want to end this match?'
          />
          </p>
      </Dialog>
    </div>
    )
  }
})

module.exports = injectIntl(EndMatchDialog)

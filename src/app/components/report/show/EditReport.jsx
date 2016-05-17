import React from 'react'
import Reflux from 'reflux'
import mui from 'material-ui'

import style from './report-style'

import ChangeTermEvent from '../../../models/web/event/control/ChangeTermEvent'

import EventActions from '../../../actions/EventActions'
import ErrorActions from '../../../actions/ErrorActions'
import ErrorHandlerStore from '../../../stores/utils/ErrorHandlerStore'
import {FormattedMessage, injectIntl, intlShape, defineMessages} from 'react-intl'

let FlatButton = mui.FlatButton
let Dialog = mui.Dialog
let TextField = mui.TextField

const messages = defineMessages({
  edit: {
    id: 'button.edit',
    description: 'Edit button in right top menu',
    defaultMessage: 'Edit'
  },
  editReportLabel: {
    id: 'report.edit',
    description: 'Edit report dialog title',
    defaultMessage: 'Edit report'
  }
})

let EditReport = React.createClass({
  mixins: [
    Reflux.connect(ErrorHandlerStore, 'error')
  ],

  propTypes: {
    reportId: React.PropTypes.string,
    cronoUpdate: React.PropTypes.func,
    termUpdate: React.PropTypes.func,
    time: React.PropTypes.string,
    term: React.PropTypes.string,
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
      {text: this.props.intl.formatMessage(messages.edit), callback: this.toggleDialog}
    ]
    this.props.addMenuElements(elements)
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
    EventActions.addControlEvent(this.props.reportId, event.type, this.props.time, term, (event, err) => {
      if (err !== null) {
        ErrorActions.setError(err)
      } else {
        this.props.termUpdate(term)
        this.toggleDialog()
      }
    })
  },

  render: function () {
    let customActions = [
      <FlatButton
        key={'dialog-cancel'}
        label={
          <FormattedMessage
              id='button.cancel'
              description='Cancel button text'
              defaultMessage='Cancel'
          />
        }
        secondary={true}
        onTouchTap={this.toggleDialog} />
    ]

    let titleLabel = this.props.intl.formatMessage(messages.editReportLabel)

    return (
      <div key={'dialog-div'}>
        <FlatButton label={
          <FormattedMessage
              id='button.edit'
          />
        } primary={true} onClick={this.toggleDialog} />
        <Dialog key={'dialog-edit-report'}
          ref='editDialog'
          title={titleLabel}
          actions={customActions}
          open={this.state.dialogIsOpen}>
          <div style={style.containerDialog}>
            <TextField ref='time'
              key={'dialog-time-field'}
              hintText={
                <FormattedMessage
                    id='report.edit.insertTime'
                    description='Insert time text in text field'
                    defaultMessage='Insert time'
                />
              }
              floatingLabelText={
                <FormattedMessage
                    id='report.edit.modifyTime'
                    description='Modify time text in text field'
                    defaultMessage='Modify time'
                />
              }
              defaultValue={this.props.time} />
            <FlatButton
              key={'dialog-time'}
              label={
                <FormattedMessage
                    id='button.modify'
                    description='Modify button'
                    defaultMessage='Modify'
                />
              }
              primary={true}
              onTouchTap={this._handleCronoUpdate} />
            <br/>
            <TextField ref='term'
              key={'dialog-term-field'}
              hintText={
                <FormattedMessage
                    id='report.edit.modifyTerm.input'
                    description='Modify term text in text field'
                    defaultMessage='Insert new term'
                />
              }
              floatingLabelText={
                <FormattedMessage
                    id='report.edit.modifyTerm.button'
                    description='Modify term button'
                    defaultMessage='Modify term'
                />
              }
              defaultValue={this.props.term} />
            <FlatButton
              key={'dialog-term'}
              label={
                <FormattedMessage
                    id='button.modify'
                    description='Modify button'
                    defaultMessage='Modify'
                />
              }
              primary={true}
              onTouchTap={this._handleModifyTerm} />
          </div>
        </Dialog>
      </div>
    )
  }

})

module.exports = injectIntl(EditReport)

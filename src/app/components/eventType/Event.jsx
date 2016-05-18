import React from 'react'
import mui from 'material-ui'
import style from '../../../assets/style/generic-style'
import {FormattedMessage, injectIntl} from 'react-intl'

// Components
let Dialog = mui.Dialog
let Avatar = mui.Avatar
let ListItem = mui.ListItem
let FlatButton = mui.FlatButton

let Event = React.createClass({

  propTypes: {
    reportId: React.PropTypes.string,
    matchTime: React.PropTypes.number,
    person: React.PropTypes.object,
    team: React.PropTypes.object,
    eventTitle: React.PropTypes.string,
    eventSubtitle: React.PropTypes.string,
    eventType: React.PropTypes.string,
    causeList: React.PropTypes.array,
    handleEventSubmit: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      dialogIsOpen: false,
      cause: ''
    }
  },

  toggleDialog: function () {
    this.setState({dialogIsOpen: !this.state.dialogIsOpen})
  },

  _onDialogSubmit: function () {
    this.props.handleEventSubmit(this.props.reportId, this.props.person, this.props.team,
      this.props.eventType, this.props.matchTime, this.state.cause)
  },

  render: function () {
    let personName = this.props.person.name
    let personDorsal = this.props.person.dorsal
    let staffLabel = <span style={style.secondaryColor}>
      <FormattedMessage
          id='eventType.player'
      />
    </span>
    if (this.props.person.isStaff) {
      staffLabel = <span style={style.primaryColor}>
        <FormattedMessage
            id='eventType.staff'
        />
      </span>
    }
    let secondaryText = (
      <div>
        <span>{personDorsal}</span>
        <br/>
        <small>{staffLabel}</small>
      </div>
    )
    let avatarUrl = this.props.person.avatarUrl

    return (
    <div key={'event-' + this.props.person._id}>
      <Dialog
        ref='eventDialog'
        title={this.props.eventTitle}
        open={this.state.dialogIsOpen}
        actions={
          [
            <FlatButton
            key={'dialog-cancel-' + this.props.person._id}
            label={<FormattedMessage id='button.cancel' />}
            secondary={true}
            onTouchTap={this.toggleDialog}/>,
            <FlatButton
            key={'dialog-acept-' + this.props.person._id}
            label={<FormattedMessage id='button.accept' />}
            primary={true}
            onTouchTap={this._onDialogSubmit}/>
          ]
        }
        actionFocus='submit'>
        <hr/>
        <p>
          <FormattedMessage
              id='eventType.addEventMessage'
              values={{event: this.props.eventSubtitle}}
          />
        </p>
        <h4>
          <FormattedMessage
              id='eventType.dorsal'
              values={{element: personDorsal}}
          />
        </h4>
        <h4>{personName}</h4>
      </Dialog>
      <ListItem key={'listItem-' + this.props.person._id}
        primaryText={personName}
        secondaryTextLines={2}
        secondaryText={secondaryText}
        leftAvatar={<Avatar src= {avatarUrl} />} onClick={this.toggleDialog}/>
    </div>
    )
  }
})

module.exports = injectIntl(Event)

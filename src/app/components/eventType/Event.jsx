import React from 'react'
import mui from 'material-ui'

// Components
let Dialog = mui.Dialog
let Avatar = mui.Avatar
let ListItem = mui.ListItem
let FlatButton = mui.FlatButton

let Event = React.createClass({

  propTypes: {
    person: React.PropTypes.object,
    eventTitle: React.PropTypes.string,
    eventSubtitle: React.PropTypes.string,
    eventType: React.PropTypes.string,
    causeList: React.PropTypes.array,
    handleEventSubmit: React.PropTypes.func,
    params: React.PropTypes.shape({
      reportId: React.PropTypes.string
    })
  },

  getInitialState: function () {
    return {
      dialogIsOpen: false
    }
  },

  toggleDialog: function () {
    this.setState({dialogIsOpen: !this.state.dialogIsOpen})
  },

  _onDialogSubmit: function () {
    this.toggleDialog()
    // TODO: Add event to the db
    this.props.handleEventSubmit()
  },

  render: function () {
    let personName = this.props.person.name
    let personDorsal = this.props.person.dorsal
    let avatarUrl = this.props.person.avatarUrl

    return (
    <div key={'event-' + this.props.person.id}>
      <Dialog
        ref='eventDialog'
        title={this.props.eventTitle}
        open={this.state.dialogIsOpen}
        actions={
          [
            <FlatButton
            key={'dialog-cancel-' + this.props.person.id}
            label='Cancel'
            secondary={true}
            onTouchTap={this.toggleDialog}/>,
            <FlatButton
            key={'dialog-acept-' + this.props.person.id}
            label='Accept'
            primary={true}
            onTouchTap={this._onDialogSubmit}/>
          ]
        }
        actionFocus='submit'>
        <hr/>
        <p>
          You are going to add a <b>{this.props.eventSubtitle}</b> to:</p>
        <h4>Dorsal: {personDorsal}</h4>
        <h4>{personName}</h4>
      </Dialog>
      <ListItem key={'listItem-' + this.props.person.id}
        primaryText={personName}
        secondaryText={personDorsal}
        leftAvatar={<Avatar src= {avatarUrl} />} onClick={this.toggleDialog}/>
    </div>
    )
  }
})

module.exports = Event

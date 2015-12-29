import React from 'react'
import Reflux from 'reflux'
import mui from 'material-ui'

import EventStore from '../../stores/EventStore'
import style from '../../../assets/style/generic-style'

// Components
let Dialog = mui.Dialog
let Avatar = mui.Avatar
let ListItem = mui.ListItem
let FlatButton = mui.FlatButton
let SelectField = mui.SelectField

let EventWithCause = React.createClass({
  mixins: [
    Reflux.connect(EventStore, 'events')
  ],

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
      causeIndex: 0,
      causeValue: ''
    }
  },

  toggleDialog: function () {
    this.setState({dialogIsOpen: !this.state.dialogIsOpen})
  },

  _onDialogSubmit: function () {
    this.props.handleEventSubmit(this.props.reportId, this.props.person, this.props.team,
      this.props.eventType, this.props.matchTime, this.state.causeValue)
  },

  _handleSelectValueChange: function (e, index, element) {
    this.setState({
      causeIndex: index,
      causeValue: element.text
    })
  },

  getMenuItems: function (items) {
    let elements = [{payload: 1, text: ''}]
    items.map((c, index) => {
      elements.push({ payload: (index + 2).toString(), text: c })
    })
    return elements
  },

  render: function () {
    let personName = this.props.person.name
    let personDorsal = this.props.person.dorsal
    let staffLabel = <span style={style.secondaryColor}>Player</span>
    if (this.props.person.isStaff) {
      staffLabel = <span style={style.primaryColor}>Staff</span>
    }
    let secondaryText = (
      <div>
        <span>{personDorsal}</span>
        <br/>
        <small>{staffLabel}</small>
      </div>
    )
    let avatarUrl = this.props.person.avatarUrl
    let menuItems = this.getMenuItems(this.props.causeList)

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
        <SelectField
          ref='test'
          floatingLabelText='Select cause'
          menuItems={menuItems}
          selectedIndex={this.state.causeIndex}
          onChange={this._handleSelectValueChange} />
      </Dialog>
      <ListItem key={'listItem-' + this.props.person.id}
        primaryText={personName}
        secondaryTextLines={2}
        secondaryText={secondaryText}
        leftAvatar={<Avatar src= {avatarUrl} />} onClick={this.toggleDialog}/>
    </div>
    )
  }
})

module.exports = EventWithCause

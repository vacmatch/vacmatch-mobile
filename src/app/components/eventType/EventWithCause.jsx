//
// Copyright (c) 2016 by VACmatch
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

import React from 'react'
import Reflux from 'reflux'
import mui from 'material-ui'
import {FormattedMessage, injectIntl} from 'react-intl'

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
    let staffLabel = <span style={style.secondaryColor}>
      <FormattedMessage
          id='eventType.player'
          description='Player text for items in list'
          defaultMessage='Player'
      />
    </span>
    if (this.props.person.isStaff) {
      staffLabel = <span style={style.primaryColor}>
        <FormattedMessage
            id='eventType.staff'
            description='Staff text for items in list'
            defaultMessage='Staff'
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
    let menuItems = this.getMenuItems(this.props.causeList)

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
              description='Text about add an event in add event modal'
              defaultMessage='You are going to add a {event} to:'
              values={{event: this.props.eventSubtitle}}
          />
        </p>
        <h4>
          <FormattedMessage
              id='eventType.dorsal'
              description='Dorsal label for text in add event modal'
              defaultMessage='Dorsal: {element}'
              values={{element: personDorsal}}
          />
        </h4>
        <h4>{personName}</h4>
        <SelectField
          floatingLabelText={
            <FormattedMessage
                id='eventType.selectCause'
                description='Select cause input text'
                defaultMessage='Select cause'
            />
          }
          menuItems={menuItems}
          selectedIndex={this.state.causeIndex}
          onChange={this._handleSelectValueChange} />
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

module.exports = injectIntl(EventWithCause)

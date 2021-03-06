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
import mui from 'material-ui'
import {FormattedMessage, injectIntl} from 'react-intl'

import style from './call-style'

let FlatButton = mui.FlatButton
let Dialog = mui.Dialog
let TextField = mui.TextField
let SelectField = require('material-ui/lib/select-field')
import Checkbox from 'material-ui/lib/checkbox'

let EditPerson = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    person: React.PropTypes.shape({
      _id: React.PropTypes.string,
      name: React.PropTypes.string,
      dorsal: React.PropTypes.string,
      avatarUrl: React.PropTypes.string,
      isCalled: React.PropTypes.boolean,
      isStaff: React.PropTypes.boolean,
      reportId: React.PropTypes.string,
      teamId: React.PropTypes.string,
      userId: React.PropTypes.string
    }),
    teams: React.PropTypes.array,
    dialogIsOpen: React.PropTypes.bool,
    toggleDialog: React.PropTypes.func,
    handleUpdate: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      index: 0,
      value: {},
      teamId: '0'
    }
  },

  componentWillReceiveProps: function () {
    // Update team select field
    let index = 0
    if (this.props.person.teamId) {
      index = this.props.teams.findIndex((t) => { return t.value === this.props.person.teamId })
    }
    let element = this.props.teams[index]
    this._handleSelectValueChange(null, index, element)
  },

  _handleSelectValueChange: function (e, index, element) {
    this.setState({
      index: index,
      value: this.props.teams[index],
      teamId: element.value
    })
  },

  handleUpdate: function () {
    let oldTeamId = this.props.person.teamId
    let newPerson = this.props.person
    newPerson.name = this.refs.name.getValue()
    newPerson.dorsal = this.refs.dorsal.getValue()
    newPerson.teamId = this.state.teamId
    newPerson.isStaff = this.refs.isStaff.isChecked()
    this.props.handleUpdate(oldTeamId, newPerson)
  },

  render: function () {
    let customActions = [
      <FlatButton
        key={'dialog-cancel'}
        label={<FormattedMessage id='button.cancel'/>}
        secondary={true}
        onTouchTap={this.props.toggleDialog} />,
      <FlatButton
        key={'dialog-accept'}
        label={<FormattedMessage id='button.modify'/>}
        primary={true}
        onTouchTap={this.handleUpdate} />
    ]

    return (
      <div key={'dialog-div'}>
        <Dialog key={'dialog-edit-person'}
          ref='editDialog'
          title={this.props.title}
          actions={customActions}
          open={this.props.dialogIsOpen}>
          <div style={style.containerDialog}>
            <TextField ref='name'
              key={'dialog-name-field'}
              hintText={
                <FormattedMessage
                    id='call.editPerson.insertName'
                    description='Insert name input text'
                    defaultMessage='Insert name'
                />
              }
              floatingLabelText={
                <FormattedMessage
                    id='call.editPerson.modifyName'
                    description='Modify name input text'
                    defaultMessage='Modify name'
                />
              }
              defaultValue={this.props.person.name}/>
            <br/>
            <TextField ref='dorsal'
              key={'dialog-dorsal-field'}
              hintText={
                <FormattedMessage
                    id='call.editPerson.insertDorsal'
                    description='Insert dorsal input text'
                    defaultMessage='Insert dorsal'
                />
              }
              floatingLabelText={
                <FormattedMessage
                    id='call.editPerson.modifyDorsal'
                    description='Modify dorsal input text'
                    defaultMessage='Modify dorsal'
                />
              }
              defaultValue={this.props.person.dorsal}/>
              <br/>
            <SelectField
              ref='teamId'
              displayMember='text'
              menuItems={this.props.teams}
              selectedIndex={this.state.index}
              onChange={this._handleSelectValueChange} />
            <Checkbox
              ref='isStaff'
              label={
                <FormattedMessage
                    id='call.editPerson.isStaff'
                    description='Is staff checkbox'
                    defaultMessage='Is staff'
                />
              }
              defaultChecked={this.props.person.isStaff}/>
          </div>
        </Dialog>
      </div>
    )
  }

})

module.exports = injectIntl(EditPerson)

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

// Components
let Avatar = mui.Avatar
let ListItem = mui.ListItem
let Toggle = mui.Toggle
let IconButton = mui.IconButton
let IconMenu = mui.IconMenu
let MenuItem = require('material-ui/lib/menus/menu-item')

import style from '../../../assets/style/generic-style'

let Event = React.createClass({

  propTypes: {
    dialogIsOpen: React.PropTypes.bool,
    editDialog: React.PropTypes.func,
    deleteDialog: React.PropTypes.func,
    handleCallToggle: React.PropTypes.func,
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
    })
  },

  render: function () {
    let personName = this.props.person.name
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
    let personDorsal = (
      <div>
        <span>{this.props.person.dorsal}</span>
        <br/>
        <small>{staffLabel}</small>
      </div>
    )
    let avatarUrl = this.props.person.avatarUrl
    let menuElements = [
      <MenuItem key={'edit'} index={0} primaryText={<FormattedMessage id='button.edit'/>}
        onClick={
          this.props.editDialog.bind(null, this.props.person._id, this.props.person.reportId, this.props.person.teamId)
        }/>,
      <MenuItem key={'delete'} index={1} primaryText={<FormattedMessage id='button.delete'/>}
        onClick={
          this.props.deleteDialog.bind(null, this.props.person._id, this.props.person.reportId, this.props.person.teamId)
        }/>
    ]

    return (
      <div>
        <ListItem key={'listItem-' + this.props.person._id}
          primaryText={personName}
          secondaryTextLines={2}
          secondaryText={personDorsal}
          leftAvatar={
            <Avatar src= {avatarUrl} />
          }
          rightToggle={
            <div>
              <Toggle
                name={'toggle-' + this.props.person._id}
                defaultToggled={this.props.person.isCalled}
                onToggle={this.props.handleCallToggle.bind(null, this.props.person._id, this.props.person.teamId)} />
            </div>
          }
          rightIcon={
            <div>
              <br/>
              <IconMenu
                iconButtonElement={
                  <IconButton tooltip={<FormattedMessage id='tooltip.edit'/>}>
                    <i className='material-icons'>more_vert</i>
                  </IconButton>
                }>
                {menuElements}
              </IconMenu>
            </div>
          }/>
      </div>
    )
  }
})

module.exports = injectIntl(Event)

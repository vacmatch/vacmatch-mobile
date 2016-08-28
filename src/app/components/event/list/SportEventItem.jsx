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

import CronoUtils from '../../../stores/CronoUtils'

let ListItem = mui.ListItem
let FontIcon = mui.FontIcon
let IconButton = mui.IconButton

let SportEventItem = React.createClass({

  propTypes: {
    typeIcon: React.PropTypes.string,
    event: React.PropTypes.shape({
      _id: React.PropTypes.string,
      type: React.PropTypes.string,
      person: React.PropTypes.shape({
        name: React.PropTypes.string,
        dorsal: React.PropTypes.string
      }),
      team: React.PropTypes.shape({
        name: React.PropTypes.string
      }),
      matchTime: React.PropTypes.number,
      text: React.PropTypes.string
    }),
    handleDeleteEvent: React.PropTypes.func
  },

  render: function () {
    return <ListItem
      leftAvatar={
        <FontIcon className={this.props.typeIcon} />
      }
      primaryText={<b>{'(' + this.props.event.person.dorsal + ') ' + this.props.event.person.name}</b>}
      secondaryTextLines={2}
      secondaryText={
        <p>
          {this.props.event.team.name}
        <br/>
          <i>{CronoUtils.milisecondsToString(this.props.event.matchTime) + ' - ' + this.props.event.text}</i>
        </p>
      }
      rightIconButton={
        <IconButton tooltip={
          <FormattedMessage
              id='tooltip.delete'
              description='Delete tooltip in right button in each list element'
              defaultMessage='Delete'
          />
        } onClick={this.props.handleDeleteEvent.bind(null, this.props.event)}>
          <i className='material-icons'>delete</i>
        </IconButton>
      } />
  }
})

module.exports = injectIntl(SportEventItem)

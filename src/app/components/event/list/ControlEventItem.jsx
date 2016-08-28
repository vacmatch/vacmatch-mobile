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

let ListItem = mui.ListItem
let FontIcon = mui.FontIcon
let IconButton = mui.IconButton

let ControlEventItem = React.createClass({

  propTypes: {
    typeIcon: React.PropTypes.string,
    event: React.PropTypes.shape({
      _id: React.PropTypes.string,
      type: React.PropTypes.string,
      title: React.PropTypes.string,
      text: React.PropTypes.string
    }),
    eventType: React.PropTypes.shape({
      title: React.PropTypes.string
    }),
    handleDeleteEvent: React.PropTypes.func
  },

  render: function () {
    return <ListItem
      leftAvatar={
        <FontIcon className={this.props.typeIcon} />
      }
      primaryText={<b>{this.props.eventType.title}
      </b>}
      secondaryText={this.props.event.text}
      rightIconButton={
        <IconButton tooltip={
          <FormattedMessage id='tooltip.delete' />
        } onClick={this.props.handleDeleteEvent.bind(null, this.props.event)}>
          <i className='material-icons'>delete</i>
        </IconButton>
      } />
  }
})

module.exports = injectIntl(ControlEventItem)

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
import { History } from 'react-router'
import urls from '../../../api/urls'
import {FormattedMessage, injectIntl} from 'react-intl'

let ListItem = mui.ListItem
let IconButton = mui.IconButton
let IconMenu = mui.IconMenu
let MenuItem = require('material-ui/lib/menus/menu-item')

let ReportItem = React.createClass({
  mixins: [History],

  propTypes: {
    key: React.PropTypes.string,
    report: React.PropTypes.shape({
      _id: React.PropTypes.string,
      localTeam: React.PropTypes.shape({
        name: React.PropTypes.string,
        result: React.PropTypes.string
      }),
      visitorTeam: React.PropTypes.shape({
        name: React.PropTypes.string,
        result: React.PropTypes.string
      }),
      date: React.PropTypes.string,
      location: React.PropTypes.string,
      status: React.PropTypes.number
    }),
    editDialog: React.PropTypes.func,
    deleteDialog: React.PropTypes.func
  },

  handleClick: function (id) {
    this.history.pushState(null, urls.report.show(id))
  },

  render: function () {
    let menuElements = [
      <MenuItem key={'edit'} index={0} primaryText={
        <FormattedMessage id='button.edit' />
      } onClick={this.props.editDialog.bind(null, this.props.report._id)}/>,
      <MenuItem key={'delete'} index={1} primaryText={
        <FormattedMessage id='button.delete' />
      } onClick={this.props.deleteDialog.bind(null, this.props.report._id)}/>

    ]

    return (
      <div>
        <ListItem key={this.props.key}
          primaryText={this.props.report.localTeam.name + ' ' + this.props.report.localTeam.result +
          ' - ' + this.props.report.visitorTeam.result + ' ' + this.props.report.visitorTeam.name}
          secondaryText={ this.props.report.date + ' - ' + this.props.report.location }
          rightIconButton={
            <IconMenu
              iconButtonElement={
                <IconButton>
                  <i className='material-icons'>more_vert</i>
                </IconButton>
              }>
              {menuElements}
            </IconMenu>
          }
          onTouchTap={(ev) => this.handleClick(this.props.report._id)}
        />
      </div>
    )
  }

})

module.exports = injectIntl(ReportItem)

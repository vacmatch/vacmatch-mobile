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
import AuthStore from '../../stores/AuthStore'

import {FormattedMessage} from 'react-intl'
import mui from 'material-ui'
let MenuItemTemp = mui.MenuItem

let LeftMenuData = Reflux.createStore({

  getMenuIcon: function () {
    return 'menu'
  },

  getBackIcon: function () {
    return 'chevron_left'
  },

  getToggleActionName: function () {
    return 'TOGGLE'
  },

  getBackActionName: function () {
    return 'BACK'
  },

  defaultLeftMenuItems: function () {
    return [
      {type: MenuItemTemp.Types.SUBHEADER, text: <FormattedMessage id='leftnav.settings' description='Settings divider in left menu' defaultMessage='Settings'/>},
      {type: 'LINK', payload: '#about', text: <FormattedMessage id='leftnav.about' description='About section in left menu' defaultMessage='About'/>},
      {type: 'LINK', payload: '#settings', text: <FormattedMessage id='leftnav.settings' description='Settings divider in left menu' defaultMessage='Settings'/>}
    ]
  },

  loggedLeftMenuItems: function () {
    if (AuthStore.isLoggedIn()) {
      return [
        {type: MenuItemTemp.Types.SUBHEADER, text: <FormattedMessage id='leftnav.report' description='Report divider in left menu' defaultMessage='Report'/>},
        {type: 'LINK', payload: '#reports', text: <FormattedMessage id='leftnav.reportList' description='Report list section in left menu' defaultMessage='Report list'/>},
        {type: MenuItemTemp.Types.SUBHEADER, text: <FormattedMessage id='leftnav.settings' description='Settings divider in left menu' defaultMessage='Settings'/>},
        {type: 'LINK', payload: '#about', text: <FormattedMessage id='leftnav.about' description='About section in left menu' defaultMessage='About'/>},
        {type: 'LINK', payload: '#settings', text: <FormattedMessage id='leftnav.settings' description='Settings divider in left menu' defaultMessage='Settings'/>}
      ]
    } else {
      return this.defaultLeftMenuItems()
    }
  }

})

module.exports = LeftMenuData

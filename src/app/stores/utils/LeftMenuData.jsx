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

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
import injectTapEventPlugin from 'react-tap-event-plugin'
import mui from 'material-ui'
import { History } from 'react-router'
import MenuStore from '../stores/MenuStore'
import MenuActions from '../actions/MenuActions'
import AuthStore from '../stores/AuthStore'
import AuthActions from '../actions/AuthActions'
import ErrorActions from '../actions/ErrorActions'
import {FormattedMessage, injectIntl, intlShape} from 'react-intl'
import urls from '../api/urls'

import LeftMenuData from '../stores/utils/LeftMenuData'
// Components
let AppBar = mui.AppBar
let Avatar = mui.Avatar
let LeftNav = mui.LeftNav
let IconMenu = mui.IconMenu
let MenuItem = require('material-ui/lib/menus/menu-item')
let IconButton = mui.IconButton
let FlatButton = mui.FlatButton
import SnackBar from './generic/SnackBar'

import style from '../../assets/style/generic-style'

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://ADFgithub.com/zilverline/react-tap-event-plugin
injectTapEventPlugin()

/*
 * Layout component
 */
let Layout = React.createClass({
  mixins: [
    Reflux.connect(MenuStore, 'menu'),
    Reflux.connect(AuthStore, 'auth'),
    History
  ],

  propTypes: {
    children: React.PropTypes.element.isRequired,
    intl: intlShape.isRequired
  },

  componentWillMount: function () {
    this._setLeftMenuItems()
  },

  _getRightMenuItems: function () {
    return (
      this.state.menu.rightMenu.map((element, index) => {
        return <MenuItem key={index} index={index} primaryText={element.text} onClick={this._handleClickRightMenu.bind(null, element)}/>
      })
    )
  },

  _handleLeftNavToggle: function () {
    this.refs.leftNav.toggle()
  },

  _handleClickRightMenu: function (element) {
    // If element has url, go to the link
    if (element.url) {
      this.history.pushState(null, element.url)
    }
    // If element has a callback just use it
    if (element.callback) {
      element.callback()
    }
  },

  _handleLogOut: function () {
    AuthActions.logOut((response, err) => {
      if (err !== null) {
        // Show logout error
        ErrorActions.setError(err)
      } else {
        this._handleLeftNavToggle()
        // Reset left menu items
        this._setLeftMenuItems()
        this.history.pushState(null, urls.login.show)
      }
    })
  },

  _setLeftMenuItems: function () {
    // Get default left menu items
    let menuItems = LeftMenuData.defaultLeftMenuItems()
    let toggleActionName = LeftMenuData.getToggleActionName()
    let icon = LeftMenuData.getMenuIcon()
    // Add menu default action
    MenuActions.addActionFunction(toggleActionName, this._handleLeftNavToggle, () => {
      // Set left menu
      MenuActions.setLeftMenu(icon, toggleActionName, menuItems)
    })
  },

  _handleLogIn: function () {
    this._handleLeftNavToggle()
    this.history.pushState(null, urls.login.show)
  },

  render: function () {
    // Show logged info or not
    let loggedInfo = <h4>Please, log in!</h4>
    if (AuthStore.isLoggedIn()) {
      loggedInfo = (
        <div>
          <h4>{this.state.auth.user.name}</h4>
          <FlatButton label={
            <FormattedMessage
                id='leftnav.logout'
                description='Logout button text in left menu'
                defaultMessage='Log out'
            />
          } primary={true} onClick={this._handleLogOut}/>
        </div>
      )
    } else {
      loggedInfo = (
        <div>
          <p>
            <FlatButton label={
              <FormattedMessage
                  id='leftnav.login'
                  description='Login button text in left menu'
                  defaultMessage='Log in'
              />
            } primary={true} onClick={this._handleLogIn}/>
          </p>
        </div>
      )
    }

    return <div>
      <AppBar
        title='VACmatch'
        iconElementLeft={
              <IconButton
                onClick={this.state.menu.leftMenu.action}
              ><i className='material-icons'>{this.state.menu.leftMenu.icon}</i></IconButton>
        }
        iconElementRight={
          <IconMenu
            iconButtonElement={
              <IconButton><i className='material-icons'>more_vert</i></IconButton>
            }>
            {this._getRightMenuItems()}
          </IconMenu>
        }
        />
      <LeftNav ref='leftNav' docked={false} menuItems={this.state.menu.leftMenu.elements}
        header={
          <div style={style.center}>
            <Avatar src='assets/img/logos/vacmatch.png' size={100} />
            {loggedInfo}
          </div>
        }/>
        <SnackBar/>
        {this.props.children}
      </div>
  }
})

module.exports = injectIntl(Layout)

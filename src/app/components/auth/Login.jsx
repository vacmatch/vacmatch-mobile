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
import { History } from 'react-router'
import {FormattedMessage, injectIntl, intlShape, defineMessages} from 'react-intl'

import EditUser from './EditUser'
import AuthStore from '../../stores/AuthStore'
import AuthActions from '../../actions/AuthActions'
import ErrorActions from '../../actions/ErrorActions'
import ErrorHandlerStore from '../../stores/utils/ErrorHandlerStore'
import MenuStore from '../../stores/MenuStore'

import urls from '../../api/urls'
import style from './auth-style.js'

let TextField = mui.TextField
let RaisedButton = mui.RaisedButton
let Avatar = mui.Avatar
let FlatButton = mui.FlatButton

const messages = defineMessages({
  signupTitle: {
    id: 'auth.login.signupTitle',
    description: 'Sign up text for dialog title',
    defaultMessage: 'Sign up'
  },
  report: {
    id: 'leftnav.report',
    description: 'Report divider in left menu',
    defaultMessage: 'Report'
  },
  reportList: {
    id: 'leftnav.reportList',
    description: 'Report list section in left menu',
    defaultMessage: 'Report list'
  }
})

let Login = React.createClass({
  mixins: [
    Reflux.connect(AuthStore, 'auth'),
    Reflux.connect(ErrorHandlerStore, 'error'),
    Reflux.connect(MenuStore, 'menu'),
    History
  ],

  propTypes: {
    intl: intlShape.isRequired
  },

  getInitialState: function () {
    return {
      dialogIsOpen: false
    }
  },

  handleLogin: function () {
    let username = this.refs.username.getValue()
    let password = this.refs.password.getValue()
    AuthActions.logIn(username, password, (user, err) => {
      if (err === null) {
        // Go to report list
        this.history.pushState(null, urls.report.list)
      } else {
        // Show login error
        ErrorActions.setError(err)
      }
    })
  },

  handleSignUp: function (username, password, secondPassword, email, firstName, surname, cardId, signKey, secondSignKey) {
    AuthActions.signUp(username, password, secondPassword, email, firstName, surname, cardId, signKey, secondSignKey, (user, err) => {
      if (err === null) {
        // Go to report list
        this.toggleSignUpDialog()
        this.history.pushState(null, urls.report.list)
      } else {
        // Show signUp error
        ErrorActions.setError(err)
      }
    })
  },

  toggleSignUpDialog: function () {
    this.setState({dialogIsOpen: !this.state.dialogIsOpen})
  },

  render: function () {
    let title = this.props.intl.formatMessage(messages.signupTitle)
    return (
      <div style={style.center} >
        <EditUser
          title={title}
          dialogIsOpen={this.state.dialogIsOpen}
          handleToggleDialog={this.toggleSignUpDialog}
          handleUpdate={this.handleSignUp}
          />
        <Avatar src='assets/img/logos/vacmatch.png' size={100} />
        <div>
          <br/>
          <TextField ref='username'
            hintText={
              <FormattedMessage
                  id='auth.login.username'
                  description='Username text for input tag'
                  defaultMessage='Username'
              />
            } />
          <br/>
          <TextField ref='password'
            hintText={
              <FormattedMessage
                  id='auth.login.password'
                  description='Password text for input tag'
                  defaultMessage='Password'
              />
            }
            type='password' />
          <br/>
          <div style={style.buttonRow}>
            <FlatButton style={style.button} label={
              <FormattedMessage
                  id='auth.login.signup'
                  description='Sign in text for button'
                  defaultMessage='Sign up'
              />
            } onClick={this.toggleSignUpDialog}/>
            <RaisedButton style={style.button} label={
              <FormattedMessage
                  id='auth.login.login'
                  description='Log in text for button'
                  defaultMessage='Login'
              />
            } primary={true} onClick={this.handleLogin} />
          </div>
        </div>
      </div>
    )
  }
})

module.exports = injectIntl(Login)

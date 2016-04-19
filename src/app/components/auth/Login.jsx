import React from 'react'
import Reflux from 'reflux'
import mui from 'material-ui'
import { History } from 'react-router'

import EditUser from './EditUser'
import AuthStore from '../../stores/AuthStore'
import AuthActions from '../../actions/AuthActions'
import ErrorActions from '../../actions/ErrorActions'
import ErrorHandlerStore from '../../stores/utils/ErrorHandlerStore'

import urls from '../../api/urls'
import style from './auth-style.js'

let TextField = mui.TextField
let RaisedButton = mui.RaisedButton
let Avatar = mui.Avatar
let FlatButton = mui.FlatButton

let Login = React.createClass({
  mixins: [
    Reflux.connect(AuthStore, 'auth'),
    Reflux.connect(ErrorHandlerStore, 'error'),
    History
  ],

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
    return (
      <div style={style.center} >
        <EditUser
          title='Sign up'
          dialogIsOpen={this.state.dialogIsOpen}
          handleToggleDialog={this.toggleSignUpDialog}
          handleUpdate={this.handleSignUp}
          />
        <Avatar src='assets/img/logos/vacmatch.png' size={100} />
        <div>
          <br/>
          <TextField ref='username'
            hintText='Username' />
          <br/>
          <TextField ref='password'
            hintText='Password'
            type='password' />
          <br/>
          <div style={style.buttonRow}>
            <FlatButton style={style.button} label='Sign up' onClick={this.toggleSignUpDialog}/>
            <RaisedButton style={style.button} label='Login' primary={true} onClick={this.handleLogin} />
          </div>
        </div>
      </div>
    )
  }
})

module.exports = Login

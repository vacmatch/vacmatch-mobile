import React from 'react'
import mui from 'material-ui'
import style from './auth-style.js'
import AuthService from '../../services/AuthService'
import EditUser from './EditUser'

let TextField = mui.TextField
let RaisedButton = mui.RaisedButton
let Avatar = mui.Avatar
let FlatButton = mui.FlatButton

let Login = React.createClass({

  getInitialState: function () {
    return {
      dialogIsOpen: false
    }
  },

  handleLogin: function () {
    let username = this.refs.username.getValue()
    let password = this.refs.password.getValue()
    console.log('handleLogin', username, password)
    AuthService.login(username, password, function (user, err) {
      console.log(user, err)
    })
  },

  handleSignUp: function (username, password, email, firstName, surname, cardId) {
    console.log('handleSignUp', username, password, email, firstName, surname, cardId)
    AuthService.signup(username, password, email, firstName, surname, cardId, function (user, err) {
      console.log(user, err)
      this.toggleSignUpDialog()
    })
  },

  toggleSignUpDialog: function () {
    this.setState({dialogIsOpen: !this.state.dialogIsOpen})
  },

  render: function () {
    return (
      <div style={style.container} >
        <EditUser
          title='Sign up'
          dialogIsOpen={this.state.dialogIsOpen}
          handleToggleDialog={this.toggleSignUpDialog}
          handleUpdate={this.handleSignUp}
          />
        <Avatar style={style.center} src='assets/img/logos/vacmatch.png' size={100} />
        <div>
          <br/>
          <TextField ref='username'
            hintText='Username' />
          <br/>
          <TextField ref='password'
            hintText='Password' />
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

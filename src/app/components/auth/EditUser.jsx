import React from 'react'
import mui from 'material-ui'
import style from './auth-style'

let FlatButton = mui.FlatButton
let Dialog = mui.Dialog
let TextField = mui.TextField

let EditUser = React.createClass({

  propTypes: {
    title: React.PropTypes.string,
    user: React.PropTypes.shape({
      _id: React.PropTypes.string,
      username: React.PropTypes.string,
      password: React.PropTypes.string
    }),
    dialogIsOpen: React.PropTypes.bool,
    handleToggleDialog: React.PropTypes.func,
    handleUpdate: React.PropTypes.func
  },

  handleUpdate: function () {
    this.props.handleUpdate(
      this.refs.username.getValue(), this.refs.password.getValue(),
      this.refs.email.getValue(), this.refs.name.getValue(), this.refs.surname.getValue(),
      this.refs.cardid.getValue(), this.refs.signKey.getValue()
    )
  },

  render: function () {
    let customActions = [
      <FlatButton
        key={'dialog-cancel'}
        label='Cancel'
        secondary={true}
        onTouchTap={this.props.handleToggleDialog} />,
      <FlatButton
        key={'dialog-accept'}
        label='Modify'
        primary={true}
        onTouchTap={this.handleUpdate} />
    ]

    return (
      <div key={'dialog-div'}>
        <Dialog key={'dialog-edit-person'}
          ref='editDialog'
          title={this.props.title}
          actions={customActions}
          open={this.props.dialogIsOpen}>
          <div style={style.containerDialog}>
            <TextField ref='username'
              key={'dialog-username-field'}
              hintText='Insert username'
              floatingLabelText='Username'/>
            <br/>
            <TextField ref='password'
              key={'dialog-password-field'}
              hintText='Insert password'
              floatingLabelText='Password'
              type='password'/>
            <br/>
            <TextField ref='signKey'
              key={'dialog-signKey-field'}
              hintText='Insert PIN'
              floatingLabelText='PIN'
              type='password'/>
            <br/>
            <TextField ref='name'
              key={'dialog-name-field'}
              hintText='Insert name'
              floatingLabelText='Name'/>
            <br/>
            <TextField ref='surname'
              key={'dialog-surname-field'}
              hintText='Insert surname'
              floatingLabelText='Surname'/>
            <br/>
            <TextField ref='email'
              key={'dialog-email-field'}
              hintText='Insert email'
              floatingLabelText='Email'/>
            <br/>
            <TextField ref='cardid'
              key={'dialog-cardid-field'}
              hintText='Insert card id'
              floatingLabelText='Card id'/>
            <br/>
          </div>
        </Dialog>
      </div>
    )
  }
})

module.exports = EditUser

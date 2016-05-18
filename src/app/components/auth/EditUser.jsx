import React from 'react'
import mui from 'material-ui'
import style from './auth-style'
import {FormattedMessage, injectIntl} from 'react-intl'

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
      this.refs.username.getValue(), this.refs.password.getValue(), this.refs.secondPassword.getValue(),
      this.refs.email.getValue(), this.refs.name.getValue(), this.refs.surname.getValue(),
      this.refs.cardid.getValue(), this.refs.signKey.getValue(), this.refs.secondSignKey.getValue()
    )
  },

  render: function () {
    let customActions = [
      <FlatButton
        key={'dialog-cancel'}
        label={<FormattedMessage id='button.cancel'/>}
        secondary={true}
        onTouchTap={this.props.handleToggleDialog} />,
      <FlatButton
        key={'dialog-accept'}
        label={<FormattedMessage id='button.modify'/>}
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
              hintText={
                <FormattedMessage
                    id='auth.editUser.insertUsername'
                    description='Insert username for input text'
                    defaultMessage='Insert username'
                />
              }
              floatingLabelText={
                <FormattedMessage
                    id='auth.editUser.username'
                    description='Username for input text'
                    defaultMessage='Username'
                />
              }/>
            <br/>
            <TextField ref='password'
              key={'dialog-password-field'}
              hintText={
                <FormattedMessage
                    id='auth.editUser.insertPassword'
                    description='Insert password for input text'
                    defaultMessage='Insert password'
                />
              }
              floatingLabelText={
                <FormattedMessage
                    id='auth.editUser.password'
                    description='Password for input text'
                    defaultMessage='Password'
                />
              }
              type='password'/>
            <br/>
            <TextField ref='secondPassword'
              key={'dialog-secondPassword-field'}
              hintText={
                <FormattedMessage
                    id='auth.editUser.confirmPassword'
                    description='Confirm password for input text'
                    defaultMessage='Confirm password'
                />
              }
              floatingLabelText={
                <FormattedMessage id='auth.editUser.confirmPassword' />
              }
              type='password'/>
            <br/>
            <TextField ref='signKey'
              key={'dialog-signKey-field'}
              hintText={
                <FormattedMessage
                    id='auth.editUser.insertPin'
                    description='Insert PIN for input text'
                    defaultMessage='Insert PIN'
                />
              }
              floatingLabelText={
                <FormattedMessage
                    id='auth.editUser.pin'
                    description='Pin for input text'
                    defaultMessage='PIN'
                />
              }
              type='password'/>
            <TextField ref='secondSignKey'
              key={'dialog-secondSignKey-field'}
              hintText={
                <FormattedMessage
                    id='auth.editUser.confirmPin'
                    description='Confirm pin for input text'
                    defaultMessage='Confirm PIN'
                />
              }
              floatingLabelText={
                <FormattedMessage id='auth.editUser.confirmPin' />
              }
              type='password'/>
            <br/>
            <TextField ref='name'
              key={'dialog-name-field'}
              hintText={
                <FormattedMessage
                    id='auth.editUser.insertName'
                    description='Insert name for input text'
                    defaultMessage='Insert name'
                />
              }
              floatingLabelText={
                <FormattedMessage
                    id='auth.editUser.name'
                    description='Name for input text'
                    defaultMessage='Name'
                />
              }/>
            <br/>
            <TextField ref='surname'
              key={'dialog-surname-field'}
              hintText={
                <FormattedMessage
                    id='auth.editUser.insertSurnames'
                    description='Insert surnames for input text'
                    defaultMessage='Insert surnames'
                />
              }
              floatingLabelText={
                <FormattedMessage
                    id='auth.editUser.surnames'
                    description='Surnames for input text'
                    defaultMessage='Surnames'
                />
              }/>
            <br/>
            <TextField ref='email'
              key={'dialog-email-field'}
              hintText={
                <FormattedMessage
                    id='auth.editUser.insertEmail'
                    description='Insert email for input text'
                    defaultMessage='Insert email'
                />
              }
              floatingLabelText={
                <FormattedMessage
                    id='auth.editUser.email'
                    description='Email for input text'
                    defaultMessage='Email'
                />
              }/>
            <br/>
            <TextField ref='cardid'
              key={'dialog-cardid-field'}
              hintText={
                <FormattedMessage
                    id='auth.editUser.insertCardId'
                    description='Insert card id for input text'
                    defaultMessage='Insert card id'
                />
              }
              floatingLabelText={
                <FormattedMessage
                    id='auth.editUser.cardId'
                    description='Card id for input text'
                    defaultMessage='Card id'
                />
              }/>
            <br/>
          </div>
        </Dialog>
      </div>
    )
  }
})

module.exports = injectIntl(EditUser)

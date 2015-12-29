import React from 'react'
import mui from 'material-ui'

import style from './call-style'

let FlatButton = mui.FlatButton
let Dialog = mui.Dialog
let TextField = mui.TextField
let SelectField = require('material-ui/lib/select-field')
import Checkbox from 'material-ui/lib/checkbox'

let EditPerson = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    person: React.PropTypes.shape({
      _id: React.PropTypes.string,
      name: React.PropTypes.string,
      dorsal: React.PropTypes.string,
      avatarUrl: React.PropTypes.string,
      isCalled: React.PropTypes.boolean,
      isStaff: React.PropTypes.boolean,
      reportId: React.PropTypes.string,
      teamId: React.PropTypes.string,
      userId: React.PropTypes.string
    }),
    teams: React.PropTypes.array,
    dialogIsOpen: React.PropTypes.bool,
    toggleDialog: React.PropTypes.func,
    handleUpdate: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      index: 0,
      value: {},
      teamId: '0'
    }
  },

  componentWillReceiveProps: function () {
    // Update team select field
    let index = 0
    if (this.props.person.teamId) {
      index = this.props.teams.findIndex((t) => { return t.value === this.props.person.teamId })
    }
    let element = this.props.teams[index]
    this._handleSelectValueChange(null, index, element)
  },

  _handleSelectValueChange: function (e, index, element) {
    this.setState({
      index: index,
      value: this.props.teams[index],
      teamId: element.value
    })
  },

  handleUpdate: function () {
    let oldTeamId = this.props.person.teamId
    let newPerson = this.props.person
    newPerson.name = this.refs.name.getValue()
    newPerson.dorsal = this.refs.dorsal.getValue()
    newPerson.teamId = this.state.teamId
    newPerson.isStaff = this.refs.isStaff.isChecked()
    this.props.handleUpdate(oldTeamId, newPerson)
  },

  render: function () {
    let customActions = [
      <FlatButton
        key={'dialog-cancel'}
        label='Cancel'
        secondary={true}
        onTouchTap={this.props.toggleDialog} />,
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
            <TextField ref='name'
              key={'dialog-name-field'}
              hintText='Insert name'
              floatingLabelText='Modify name'
              defaultValue={this.props.person.name}/>
            <br/>
            <TextField ref='dorsal'
              key={'dialog-dorsal-field'}
              hintText='Insert dorsal'
              floatingLabelText='Modify dorsal'
              defaultValue={this.props.person.dorsal}/>
              <br/>
            <SelectField
              ref='teamId'
              displayMember='text'
              menuItems={this.props.teams}
              selectedIndex={this.state.index}
              onChange={this._handleSelectValueChange} />
            <Checkbox
              ref='isStaff'
              label='Is staff'
              defaultChecked={this.props.person.isStaff}/>
          </div>
        </Dialog>
      </div>
    )
  }

})

module.exports = EditPerson

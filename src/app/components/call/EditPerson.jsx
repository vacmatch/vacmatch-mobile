import React from 'react'
import mui from 'material-ui'

import style from './call-style'
import PersonActions from '../../actions/PersonActions'

let FlatButton = mui.FlatButton
let Dialog = mui.Dialog
let TextField = mui.TextField

let EditPerson = React.createClass({
  propTypes: {
    person: React.PropTypes.shape({
      _id: React.PropTypes.string,
      name: React.PropTypes.string,
      dorsal: React.PropTypes.string,
      avatarUrl: React.PropTypes.string,
      isCalled: React.PropTypes.boolean,
      reportId: React.PropTypes.string,
      teamId: React.PropTypes.number,
      userId: React.PropTypes.number
    }),
    dialogIsOpen: React.PropTypes.bool,
    toggleDialog: React.PropTypes.func,
    handleUpdate: React.PropTypes.func
  },

  handleUpdate2: function () {
    let newDorsal = this.refs.dorsal.getValue()
    PersonActions.updatePersonDorsal(this.props.person._id, this.props.person.reportId,
      this.props.person.teamId, newDorsal, (data, err) => {
        this.props.toggleDialog()
      })
  },

  handleUpdate: function () {
    let newPerson = this.props.person
    newPerson.name = this.refs.name.getValue()
    newPerson.dorsal = this.refs.dorsal.getValue()
    this.props.handleUpdate(newPerson)
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
          title='Edit person'
          actions={customActions}
          open={this.props.dialogIsOpen}>
          <div style={style.containerDialog}>
            <TextField ref='name'
              key={'dialog-name-field'}
              hintText='Insert name'
              floatingLabelText='Modify name'
              defaultValue={this.props.person.name}/>
            <TextField ref='dorsal'
              key={'dialog-dorsal-field'}
              hintText='Insert dorsal'
              floatingLabelText='Modify dorsal'
              defaultValue={this.props.person.dorsal}/>
          </div>
        </Dialog>
      </div>
    )
  }

})

module.exports = EditPerson

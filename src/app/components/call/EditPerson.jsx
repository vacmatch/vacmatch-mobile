import React from 'react'
import mui from 'material-ui'

import style from './call-style'
import PersonActions from '../../actions/PersonActions'

let FlatButton = mui.FlatButton
let Dialog = mui.Dialog
let TextField = mui.TextField

let EditPerson = React.createClass({
  propTypes: {
    person: React.PropTypes.object,
    dialogIsOpen: React.PropTypes.boolean,
    toggleDialog: React.PropTypes.func
  },

  handleUpdate: function () {
    let newDorsal = this.refs.dorsal.getValue()
    PersonActions.updatePersonDorsal(this.props.person._id, this.props.person.reportId,
      this.props.person.teamId, newDorsal, (data, err) => {
        this.props.toggleDialog()
      })
  },

  render: function () {
    let customActions = [
      <FlatButton
        key={'dialog-cancel'}
        label='Cancel'
        secondary={true}
        onTouchTap={this.props.toggleDialog} />
    ]

    return (
      <div key={'dialog-div'}>
        <Dialog key={'dialog-edit-person'}
          ref='editDialog'
          title='Edit person'
          actions={customActions}
          open={this.props.dialogIsOpen}>
          <div style={style.containerDialog}>
            <TextField ref='dorsal'
              key={'dialog-dorsal-field'}
              hintText='Insert dorsal'
              floatingLabelText='Modify dorsal'
              defaultValue={this.props.person.dorsal}/>
            <FlatButton
              key={'dialog-dorsal'}
              label='Modify dorsal'
              primary={true}
              onTouchTap={this.handleUpdate} />
          </div>
        </Dialog>
      </div>
    )
  }

})

module.exports = EditPerson

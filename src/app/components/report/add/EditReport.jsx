import React from 'react'
import mui from 'material-ui'
const Dialog = require('material-ui/lib/dialog')

let FlatButton = mui.FlatButton
let TextField = mui.TextField

let EditReport = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    report: React.PropTypes.shape({
      _id: React.PropTypes.string,
      localTeam: React.PropTypes.shape({
        name: React.PropTypes.string
      }),
      visitorTeam: React.PropTypes.shape({
        name: React.PropTypes.string
      }),
      date: React.PropTypes.string,
      location: React.PropTypes.string
    }),
    dialogIsOpen: React.PropTypes.bool,
    toggleDialog: React.PropTypes.func,
    handleUpdate: React.PropTypes.func
  },

  handleUpdate: function () {
    let newReport = this.props.report
    newReport.localTeam.name = this.refs.localTeam.getValue()
    newReport.visitorTeam.name = this.refs.visitorTeam.getValue()
    newReport.date = this.refs.date.getValue()
    newReport.location = this.refs.location.getValue()
    this.props.handleUpdate(newReport)
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
        <Dialog key={'dialog-edit-report'}
          ref='editDialog'
          title={this.props.title}
          actions={customActions}
          open={this.props.dialogIsOpen}>
            <div>
              <TextField ref='localTeam'
                key={'dialog-localTeam-field'}
                hintText='Insert local team'
                floatingLabelText='Modify local team'
                defaultValue={this.props.report.localTeam ? this.props.report.localTeam.name : ''}/>
              <TextField ref='visitorTeam'
                key={'dialog-visitorTeam-field'}
                hintText='Insert visitor team'
                floatingLabelText='Modify visitor team'
                defaultValue={this.props.report.visitorTeam ? this.props.report.visitorTeam.name : ''}/>
              <TextField ref='date'
                key={'dialog-date-field'}
                hintText='Insert date'
                floatingLabelText='Modify date'
                defaultValue={this.props.report.date}/>
              <TextField ref='location'
                key={'dialog-place-field'}
                hintText='Insert location'
                floatingLabelText='Modify location'
                defaultValue={this.props.report.location}/>
            </div>
        </Dialog>
      </div>
    )
  }

})

module.exports = EditReport
